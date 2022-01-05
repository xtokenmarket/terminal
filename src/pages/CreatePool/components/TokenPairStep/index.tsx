import { BigNumber } from '@ethersproject/bignumber'
import {
  Button,
  CircularProgress,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core'
import { TokenSelect } from 'components'
import { DEFAULT_NETWORK_ID, NULL_ADDRESS } from 'config/constants'
import { useConnectedWeb3Context } from 'contexts'
import { useIsMountedRef, useServices } from 'helpers'
import { transparentize } from 'polished'
import { useEffect, useState } from 'react'
import { IToken } from 'types'
import { ZERO } from 'utils/number'
import { getPriceInX96 } from 'utils/price'
import { FeeTierSection } from '../'
import { LoadingOverlay } from '../LoadingOverlay'
import { PairCreateModal } from '../PairCreateModal'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  label: {
    color: theme.colors.white,
    marginBottom: 16,
  },
  fee: {
    marginTop: 40,
    fontSize: 12,
    color: theme.colors.primary100,
    marginBottom: 8,
  },
  // progressWrapper: {
  //   position: 'absolute',
  //   left: 0,
  //   right: 0,
  //   top: 0,
  //   bottom: 0,
  //   backgroundColor: transparentize(0.9, theme.colors.gray2),
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   flexDirection: 'column',
  //   zIndex: 5,
  // },
  // spinner: {
  //   color: theme.colors.white,
  // },
  // progressTitle: {
  //   color: theme.colors.white,
  //   fontSize: 20,
  //   fontWeight: 600,
  //   marginTop: 16,
  //   marginBottom: 16,
  // },
  // progressDescription: { color: theme.colors.white },
  warn: {
    marginTop: 24,
    padding: 24,
    borderRadius: 4,
    color: theme.colors.white,
    border: `1px solid ${theme.colors.warn1}`,
    backgroundColor: transparentize(0.7, theme.colors.warn1),
    marginBottom: 16,
  },
  priceInput: {
    border: `1px solid ${theme.colors.primary100}`,
    borderRadius: 4,
    padding: '12px 16px',
  },
}))

interface IProps {
  data: {
    token0?: IToken
    token1?: IToken
    tier: BigNumber
  }
  updateData: (_: any) => void
  onNext: () => void
}

interface IState {
  startPrice: string
  uniPoolExist: boolean
  loading: boolean
  poolChecked: boolean
  successVisible: boolean
}

const initialState: IState = {
  startPrice: '0',
  uniPoolExist: false,
  loading: false,
  poolChecked: false,
  successVisible: false,
}

export const TokenPairStep = (props: IProps) => {
  const classes = useStyles()
  const { account, networkId, setWalletConnectModalOpened, setTxModalInfo } =
    useConnectedWeb3Context()
  const { lmService } = useServices()
  const [state, setState] = useState<IState>(initialState)

  const mountedRef = useIsMountedRef()
  const { data, updateData } = props

  const loadIfUniPoolExists = async () => {
    if (data.token0 && data.token1) {
      try {
        setState((prev) => ({ ...prev, loading: true, poolChecked: false }))
        const uniPoolAddress = await lmService.getPool(
          data.token0.address,
          data.token1.address,
          data.tier
        )
        const isExists = uniPoolAddress !== NULL_ADDRESS

        if (mountedRef.current === true) {
          setState((prev) => ({
            ...prev,
            uniPoolExist: isExists,
            loading: false,
            poolChecked: true,
          }))
          updateData({ uniPool: uniPoolAddress })
        }
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false, poolChecked: false }))
      }
    }
  }

  useEffect(() => {
    const timer = setTimeout(loadIfUniPoolExists, 1500)

    return () => {
      clearTimeout(timer)
    }
  }, [data.tier._hex, data.token0?.address, data.token1?.address, networkId])

  const onCreateUniPool = async () => {
    if (!account) {
      setWalletConnectModalOpened(true)
      return
    }
    if (data.token0 && data.token1 && !state.uniPoolExist) {
      try {
        setTxModalInfo(true, 'Creating Pool on Uniswap')

        const { token0, token1, startPrice } = (() => {
          if (
            BigNumber.from(data.token0.address).lt(
              BigNumber.from(data.token1.address)
            )
          ) {
            return {
              token0: data.token0,
              token1: data.token1,
              startPrice: state.startPrice,
            }
          }
          return {
            token0: data.token1,
            token1: data.token0,
            startPrice: String(1 / Number(state.startPrice)),
          }
        })()

        const txId = await lmService.deployUniswapPool(
          token0.address,
          token1.address,
          data.tier,
          getPriceInX96(
            startPrice,
            token0,
            token1,
            networkId || DEFAULT_NETWORK_ID,
            data.tier.toNumber()
          ).toString()
        )
        setTxModalInfo(
          true,
          'Creating Pool on Uniswap',
          'Please wait until tx is confirmed',
          txId
        )
        const finalTxId = await lmService.waitUntilPoolCreated(
          data.token0.address,
          data.token1.address,
          data.tier,
          txId
        )
        const poolAddress = await lmService.parsePoolCreatedTx(finalTxId)

        updateData({ uniPool: poolAddress })
        setState((prev) => ({
          ...prev,
          uniPoolExist: true,
          successVisible: true,
        }))

        setTxModalInfo(false)
      } catch (error) {
        console.error(error)
        setTxModalInfo(false)
      }
    }
  }

  const onCloseSuccess = () => {
    setState((prev) => ({ ...prev, successVisible: false }))
  }

  return (
    <div className={classes.root}>
      {state.successVisible && (
        <PairCreateModal
          onClose={onCloseSuccess}
          token0={data.token0 as Required<IToken>}
          token1={data.token1 as Required<IToken>}
        />
      )}
      <LoadingOverlay visible={state.loading} />
        <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.label}>Select pair</Typography>
          <TokenSelect
            token={data.token0}
            onChange={(token0) => updateData({ token0 })}
          />
          <TokenSelect
            token={data.token1}
            onChange={(token1) => updateData({ token1 })}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <div>
            {state.poolChecked && !state.uniPoolExist && (
              <>
                {data.token0 && data.token1 && (
                  <>
                    <Typography className={classes.label}>
                      Set starting price
                    </Typography>
                    <TextField
                      InputProps={{
                        disableUnderline: true,
                        className: classes.priceInput,
                      }}
                      fullWidth
                      placeholder="0"
                      helperText={`1 ${data.token0.symbol}=${
                        state.startPrice || '0'
                      } ${data.token1.symbol}`}
                      type="number"
                      value={state.startPrice}
                      onChange={(event) => {
                        let newValue = event.target.value
                        if (Number(newValue || '0') < 0) {
                          newValue = '0'
                        }
                        setState((prev) => ({
                          ...prev,
                          startPrice: newValue,
                        }))
                      }}
                    />
                  </>
                )}

                <Typography className={classes.warn}>
                  This pool must be initialized before you can add liquidity.
                  To initialize plase set the starting price for the pool and
                  deploy the pool on Uniswap V3.
                </Typography>
              </>
            )}
            <Typography className={classes.label}>Select fee tier</Typography>
            <FeeTierSection
              tier={data.tier}
              onChange={(tier) => updateData({ tier })}
            />
          </div>
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.fee}>
            Pool Deployment fee is 0.1 ETH. Additional 1% fee on any rewards
            distributed for this pool.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {state.poolChecked && !state.uniPoolExist ? (
            <Button
              color="primary"
              fullWidth
              disabled={Number(state.startPrice || '0') === 0}
              onClick={onCreateUniPool}
              variant="contained"
            >
              Deploy ON Uniswap v3
            </Button>
          ) : (
            <Button
              color="primary"
              fullWidth
              disabled={!state.uniPoolExist}
              onClick={props.onNext}
              variant="contained"
            >
              Next
            </Button>
          )}
        </Grid>
      </Grid>
    </div>
  )
}
