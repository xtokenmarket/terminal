import { BigNumber } from '@ethersproject/bignumber'
import {
  Button,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core'
import { FeeAmount } from '@uniswap/v3-sdk'
import { FEE_TIERS } from 'config/constants'
import { useConnectedWeb3Context } from 'contexts'
import { formatEther } from 'ethers/lib/utils'
import React, { useEffect, useState } from 'react'
import { ICreatePoolData, IToken, MintState } from 'types'
import { Bound, Field } from 'utils/enums'
import { RewardModal } from '../../../../components'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  label: {
    color: theme.colors.white,
    marginBottom: theme.spacing(2),
  },
  fee: {
    margin: theme.spacing(2),
    fontSize: 12,
    color: theme.colors.primary100,
  },
  editWrapper: {
    borderRadius: 4,
    backgroundColor: theme.colors.primary400,
    padding: theme.spacing(2),
  },
  logos: {
    display: 'flex',
    lineHeight: '48px',
    verticalAlign: 'middle',
  },
  tokenIcon: {
    width: 48,
    height: 48,
    border: `6px solid ${theme.colors.primary400}`,
    position: 'relative',
    borderRadius: '50%',
    '&+&': {
      left: -16,
    },
  },
  tokenSymbols: {
    color: theme.colors.white,
    fontSize: 22,
    fontWeight: 700,
    lineHeight: '48px',
  },
  detailsWrapper: {
    margin: theme.spacing(4, 0),
  },
  section: {
    '& .title': {
      color: theme.colors.primary100,
      margin: 0,
      fontSize: 14,
      fontWeight: 700,
    },

    '& .data': {
      color: theme.colors.white,
      margin: 0,
      fontSize: 22,
      fontWeight: 800,
    },

    '& .description': {
      color: theme.colors.white,
      margin: 0,
      fontSize: 14,
      fontWeight: 500,
    },

    '&+&': {
      [theme.breakpoints.up('sm')]: {
        borderLeft: `1px solid ${theme.colors.primary200}`,
        left: -16,
      },
    },
  },
  noRewardsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  noRewardsText: {
    color: theme.colors.primary100,
    fontSize: 22,
    margin: theme.spacing(5, 0),
  },
  createRewardsBtn: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  rewardTokenRow: {
    display: 'flex',
    flexDirection: 'row',
  },
}))

interface IProps {
  data: ICreatePoolData
  updateData: (_: any) => void
  onEdit: () => void
  onNext: () => void
}

export const RewardsStep: React.FC<IProps> = ({
  data,
  updateData,
  onEdit,
  onNext,
}) => {
  const cl = useStyles()
  const { account, networkId } = useConnectedWeb3Context()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const feeAmount: FeeAmount = data.tier.toNumber()
  const feeLabel = FEE_TIERS.find((fee) => fee.value.eq(data.tier))?.label
  const priceLabel = `${data.token0.symbol.toUpperCase()} per ${data.token1.symbol.toUpperCase()}`

  const toggleRewardsModal = () => setIsModalVisible((prevState) => !prevState)

  const [tokens, setTokens] = useState<IToken[]>([])
  const [amounts, setAmounts] = useState<BigNumber[]>([])
  const [errors, setErrors] = useState<(string | null)[]>([])
  const onTokensChanged = (amounts: BigNumber[], tokens: IToken[], errors: (string | null)[]) => {
    setAmounts(amounts)
    setErrors(errors)
    setTokens(tokens)
  }

  return (
    <div className={cl.root}>
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <div className={cl.editWrapper}>
              <Grid item xs={12}>
                <div className={cl.logos}>
                  {[data.token0.image, data.token1.image].map((img) => (
                    <img className={cl.tokenIcon} src={img} key={img} />
                  ))}
                  <Typography className={cl.tokenSymbols}>
                    {`${data.token0.symbol.toUpperCase()}/${data.token1.symbol.toUpperCase()}`}
                  </Typography>
                </div>
                <Grid container spacing={3} className={cl.detailsWrapper}>
                  <Grid item xs={12} sm={4} className={cl.section}>
                    <p className="title">Min Price</p>
                    <p className="data">{data.minPrice}</p>
                    <p className="description">{priceLabel}</p>
                  </Grid>
                  <Grid item xs={12} sm={4} className={cl.section}>
                    <p className="title">Max Price</p>
                    <p className="data">{data.maxPrice}</p>
                    <p className="description">{priceLabel}</p>
                  </Grid>
                  <Grid item xs={12} sm={4} className={cl.section}>
                    <p className="title">Fee tier</p>
                    <p className="data">{feeAmount / 10000}%</p>
                    <p className="description">{feeLabel}</p>
                  </Grid>
                </Grid>

                <Button
                  color="secondary"
                  fullWidth
                  onClick={onEdit}
                  variant="contained"
                >
                  EDIT
                </Button>
              </Grid>
            </div>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography className={cl.label}>Rewards</Typography>
            <div className={cl.noRewardsWrapper}>
              {tokens.length > 0 ? (
                <>
                  {tokens.map((token, i) => {
                    const amount = formatEther(amounts[i])
                    return (
                      <div className={cl.rewardTokenRow}>
                        <img src={token.image} />
                        <p>{token.name}</p>
                        <p>{amount}</p>
                      </div>
                    )
                  })}
                </>
              ) : (
                <Typography className={cl.noRewardsText}>
                  You have no rewards program for this pool.
                </Typography>
              )}
              <Button
                className={cl.createRewardsBtn}
                color="secondary"
                onClick={toggleRewardsModal}
                variant="contained"
              >
                CREATE A REWARDS PROGRAM
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>

      <Typography className={cl.fee}>
        Pool Deployment fee is 0.1 ETH. Additional 1% fee on any rewards
        distributed for this pool.
      </Typography>
      <Button
        color="primary"
        fullWidth
        onClick={onNext}
        variant="contained"
      >
        Next
      </Button>

      <RewardModal
        open={isModalVisible}
        onClose={toggleRewardsModal}
        onSuccess={async () => {
          toggleRewardsModal()
        }}
        onTokensChanged={onTokensChanged}
      />
    </div>
  )
}
