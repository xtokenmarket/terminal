import {
  Button,
  Grid,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core'
import TouchRipple from '@material-ui/core/ButtonBase/TouchRipple'
import { useConnectedWeb3Context } from 'contexts'
import moment from 'moment'
import { useState, useRef, useEffect } from 'react'
import { ITerminalPool, PoolService } from 'types'
import {
  formatBigNumber,
  formatDateTime,
  formatToShortNumber,
  getCurrentTimeStamp,
  getTimeDurationStr,
  getTimeDurationUnitInfo,
  numberWithCommas,
  parseFee,
} from 'utils'
import { parseDuration, ZERO } from 'utils/number'
import { RewardModal } from 'components'
import { DEFAULT_NETWORK_ID, ETHER_DECIMAL } from 'config/constants'
import { Network } from 'utils/enums'

import {
  BalanceSection,
  DepositModal,
  HistorySection,
  InfoSection,
  WithdrawModal,
  ReinvestModal,
} from '../index'
import { RewardVestSection } from '../RewardVestSection'
import { VestAllModal } from '../VestAllModal'
import { PoolShareSection } from '../PoolShareSection'
import { tickToPrice } from '@uniswap/v3-sdk'
import { Token } from '@uniswap/sdk-core'
import { CLRService } from 'services'
import { PoolDescription } from '../PoolDescription'

const useStyles = makeStyles((theme) => ({
  root: {},
  content: { paddingBottom: 32 },
  balance: {
    position: 'relative',
    '&+&': {
      '&::before': {
        content: `""`,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        borderLeft: `1px solid ${theme.colors.primary200}`,
      },
      '&:last-child': {
        '&::before': { borderLeft: 'none' },
      },
    },
    [theme.breakpoints.down('sm')]: {
      '&+&': {
        '&::before': {
          borderLeft: 'none !important',
        },
      },
    },
  },
  info: {
    position: 'relative',

    '&::before': {
      content: `""`,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      border: `1px solid ${theme.colors.primary200}`,
      borderRight: 'none',
    },
    '&:first-child': {
      '&::before': { borderLeft: 'none' },
    },

    [theme.breakpoints.down('sm')]: {
      '&:nth-child(4)': {
        '&::before': {
          borderLeft: 'none',
          borderTop: 'none',
        },
      },
      '&:nth-child(5)': {
        '&::before': {
          borderTop: 'none',
        },
      },
      '&:nth-child(6)': {
        '&::before': {
          borderTop: 'none',
        },
      },
    },
    [theme.breakpoints.down('xs')]: {
      '&:nth-child(3)': {
        '&::before': {
          borderLeft: 'none',
          borderTop: 'none',
        },
      },
      '&:nth-child(4)': {
        '&::before': {
          borderLeft: `1px solid ${theme.colors.primary200}`,
        },
      },
      '&:nth-child(5)': {
        '&::before': {
          borderLeft: 'none',
        },
      },
    },
  },
  tag: {
    padding: '2px 4px 3px',
    height: 19,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    lineHeight: '14.4px',
    '&.positive': {
      backgroundColor: theme.colors.positive1,
      color: theme.colors.positive,
    },
    '&.negative': {
      backgroundColor: theme.colors.negative1,
      color: theme.colors.negative,
    },
  },
  buttons: {
    marginTop: 24,
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: -9,
    marginRight: -9,
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  button: {
    minWidth: 130,
    flex: 1,
    height: 40,
    margin: 9,
    [theme.breakpoints.down('sm')]: {
      maxWidth: 130,
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: 'unset',
    },
  },
  rewardVestWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      flexDirection: 'column',
    },
  },
  title: {
    color: theme.colors.primary100,
    marginTop: 16,
    fontFamily: 'Gilmer',
    fontSize: 10,
    marginLeft: 18,
  },
  percent: {
    background: theme.colors.primary200,
    fontSize: 12,
    color: theme.colors.white,
    borderRadius: '16px',
    justifyContent: 'center',
    padding: '0 13px',
    marginLeft: 16,
  },
  tooltipArrow: {
    color: theme.colors.primary300,
  },
  tooltip: {
    backgroundColor: theme.colors.primary300,
    fontFamily: 'Gilmer',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 8,
  },
  titleWrapper: {
    display: 'flex',
  },
  tooltipWrapper: {
    fontSize: 10,
    color: theme.colors.primary300,
    marginLeft: 6,
    cursor: 'pointer',
  },
  infoIcon: {
    width: 16,
    height: 16,
  },
  hr: {
    borderColor: theme.colors.primary200,
    marginTop: 20,
  },
  tvlLabel: {
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
  },
}))

interface IProps {
  clrService: PoolService
  poolData: ITerminalPool
  reloadTerminalPool: (isReloadPool: boolean) => Promise<void>
}

interface IState {
  depositVisible: boolean
  withdrawVisible: boolean
  vestVisible: boolean
  rewardVisible: boolean
  reinvestVisible: boolean
}

const initialState: IState = {
  depositVisible: false,
  withdrawVisible: false,
  vestVisible: false,
  rewardVisible: false,
  reinvestVisible: false,
}

export const Content = (props: IProps) => {
  const classes = useStyles()
  const { account, setWalletConnectModalOpened, networkId } =
    useConnectedWeb3Context()
  const [state, setState] = useState<IState>(initialState)

  const { clrService, poolData, reloadTerminalPool } = props
  const { manager, owner, poolName, token0, token1 } = poolData

  const timestamp = getCurrentTimeStamp()
  const isManageable = account
    ? [owner.toLowerCase(), manager.toLowerCase()].includes(
        account.toLowerCase()
      )
    : false
  const isDeposited = !poolData.user.stakedTokenBalance.isZero()
  const rewardPeriodFinished = poolData.periodFinish.toNumber() < timestamp
  const { vesting } = poolData.rewardState

  const rippleRef = useRef(null)
  const buttonRef = useRef(null)

  const isDepositDisabled =
    (poolData.network === Network.MAINNET &&
      [
        '0x6148a1bd2be586e981115f9c0b16a09bbc271e2c', // CitaDAO pool
        '0xc5f0237a2a2bb9dc60da73491ad39a1afc4c8b63', // frETH-WETH pool
        '0x7fc70abe76605d1ef1f7a5ddc5e2ad35a43a6949', // PONY-USDC pool
      ].includes(poolData.address.toLowerCase())) ||
    (poolData.network === Network.OPTIMISM &&
      poolData.address.toLowerCase() ===
        '0x6148a1bd2be586e981115f9c0b16a09bbc271e2c') // OP-WETH pool

  useEffect(() => {
    const timer = (ms: number) => new Promise((res) => setTimeout(res, ms))

    const slowTrigger = async () => {
      for (let i = 0; i < 3; i++) {
        triggerRipple()
        await timer(700)
      }
    }

    if (rewardPeriodFinished && isManageable) {
      slowTrigger()
    }
  }, [])

  const setDepositModalVisible = (depositVisible: boolean) => {
    setState((prev) => ({ ...prev, depositVisible }))
  }

  const setWithdrawModalVisible = (withdrawVisible: boolean) => {
    setState((prev) => ({ ...prev, withdrawVisible }))
  }

  const setVestModalVisible = (vestVisible: boolean) => {
    setState((prev) => ({ ...prev, vestVisible }))
  }

  const setRewardModalVisible = (rewardVisible: boolean) => {
    setState((prev) => ({ ...prev, rewardVisible }))
  }

  const setReinvestModalVisible = (reinvestVisible: boolean) => {
    setState((prev) => ({ ...prev, reinvestVisible }))
  }

  const readyToVest = poolData.vestingTokens.filter(
    (token) => token.vestedAmount.gt(0) && token.durationRemaining.length === 0
  )
  const shouldDisplayVestButton =
    Number(poolData.rewardState.vesting) > 0 && readyToVest.length !== 0

  const shouldDisplayRewardsButton = isManageable && poolData.isReward

  const getRewardsPerWeek = () => {
    const { duration, amounts } = poolData.rewardState

    const isInitiateRewardsPending = duration === '0'
    if (isInitiateRewardsPending || !poolData.isReward) {
      return 'N/A'
    }

    const rewards = poolData.rewardState.tokens.map((rewardToken, index) => {
      const durationInfo = getTimeDurationUnitInfo(Number(duration))
      const uintAmount = amounts[index]
        ? amounts[index].mul(durationInfo.unit).div(Number(duration))
        : ZERO
      return `${formatToShortNumber(
        formatBigNumber(uintAmount, rewardToken.decimals)
      )}
              ${rewardToken.symbol} ${
        index !== poolData.rewardState.tokens.length - 1 ? ' / ' : ''
      }`
    })
    return rewards.join('')
  }

  const getPriceFromTicks = (
    tickLower: number,
    tickUpper: number,
    _token0: any,
    _token1: any
  ) => {
    const token0 = new Token(
      networkId || DEFAULT_NETWORK_ID,
      _token0.address,
      Number(_token0.decimals),
      _token0.symbol,
      _token0.name
    )
    const token1 = new Token(
      networkId || DEFAULT_NETWORK_ID,
      _token1.address,
      Number(_token1.decimals),
      _token1.symbol,
      _token1.name
    )

    const priceLower = tickToPrice(token0, token1, tickLower)
    const priceUpper = tickToPrice(token0, token1, tickUpper)

    return {
      priceLower,
      priceUpper,
    }
  }

  const getPriceRange = () => {
    const { token0, token1, ticks, poolFee } = poolData
    const { tick0, tick1 } = ticks

    const numberPoolFee = Number(poolFee)
    const numberTick0 = Number(tick0)
    const numberTick1 = Number(tick1)

    const formatNumber = (price: string) => {
      const priceInt = parseInt(price)
      const toFixed = priceInt >= 100 ? 0 : priceInt >= 1 ? 3 : 4
      return parseFloat(Number(price).toFixed(toFixed))
    }

    if (
      (numberPoolFee === 500 &&
        numberTick0 == -887270 &&
        numberTick1 === 887270) ||
      (numberPoolFee === 3000 &&
        numberTick0 == -887220 &&
        numberTick1 === 887220) ||
      (numberPoolFee === 10000 &&
        numberTick0 == -887200 &&
        numberTick1 === 887200)
    ) {
      return '0 to infinity'
    }

    const { priceLower, priceUpper } = getPriceFromTicks(
      numberTick0,
      numberTick1,
      token0,
      token1
    )

    return `${formatNumber(priceLower.toSignificant(4))} ${token0.symbol} per ${
      token1.symbol
    } to ${formatNumber(priceUpper.toSignificant(4))} ${token0.symbol} per ${
      token1.symbol
    }`
  }

  const triggerRipple = () => {
    const container = buttonRef.current
    if (!container) return

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const rect = container.getBoundingClientRect()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    rippleRef.current.start(
      {
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      },
      // when center is true, the ripple doesn't travel to the border of the container
      { center: false }
    )

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setTimeout(() => rippleRef.current.stop({}), 320)
  }

  return (
    <div className={classes.root}>
      {state.depositVisible && (
        <DepositModal
          onClose={() => setDepositModalVisible(false)}
          onSuccess={async () => {
            setDepositModalVisible(false)
            await reloadTerminalPool(true)
          }}
          clrService={clrService}
          poolData={poolData}
        />
      )}

      <RewardModal
        isCreatePool={false}
        isOpen={state.rewardVisible}
        onClose={() => setRewardModalVisible(false)}
        onSuccess={async () => {
          setRewardModalVisible(false)
          await reloadTerminalPool(true)
        }}
        poolData={poolData}
      />

      {state.withdrawVisible && (
        <WithdrawModal
          onClose={() => setWithdrawModalVisible(false)}
          onSuccess={async () => {
            setWithdrawModalVisible(false)
            await reloadTerminalPool(true)
          }}
          clrService={clrService}
          poolData={poolData}
        />
      )}

      {poolData.isReward && poolData.vestingTokens.length !== 0 && (
        <VestAllModal
          open={state.vestVisible}
          onClose={() => setVestModalVisible(false)}
          vestingTokens={readyToVest}
          poolAddress={poolData.address}
          reloadTerminalPool={reloadTerminalPool}
        />
      )}

      <ReinvestModal
        open={state.reinvestVisible}
        onClose={() => setReinvestModalVisible(false)}
        clrService={clrService}
        poolData={poolData}
        onSuccess={async () => {
          setReinvestModalVisible(false)
          await reloadTerminalPool(true)
        }}
      />

      <div className={classes.content}>
        <div>
          <PoolDescription
            poolName={poolName}
            poolDescription={poolData.description}
            loadInfo={() => reloadTerminalPool(true)}
            isOwnerOrManager={isManageable}
            poolAddress={poolData.address}
          />
          <hr className={classes.hr} />
          <Grid container spacing={0}>
            <Grid item xs={12} md={6} className={classes.balance}>
              <div className={classes.titleWrapper}>
                <Typography className={classes.title}>POOL BALANCE</Typography>
              </div>

              <Grid container spacing={0}>
                <Grid item xs={12} md={6}>
                  <BalanceSection token={token0} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <BalanceSection token={token1} />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={4} className={classes.balance}>
              <Typography className={classes.title}>MY DEPOSIT</Typography>
              <Grid container spacing={0}>
                <Grid item xs={12} md={6}>
                  <BalanceSection
                    token={token0}
                    isDeposit
                    deposit={poolData.user.token0Deposit}
                    tokenTvl={poolData.user.token0Tvl}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <BalanceSection
                    token={token1}
                    isDeposit
                    deposit={poolData.user.token1Deposit}
                    tokenTvl={poolData.user.token1Tvl}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={2} className={classes.balance}>
              <Typography className={classes.title}>POOL SHARE</Typography>
              <Grid container spacing={0}>
                <Grid item xs={12} md={12}>
                  <PoolShareSection percent={poolData.poolShare} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <div>
          <Grid container spacing={0}>
            <Grid item xs={6} sm={4} md={2} className={classes.info}>
              <InfoSection
                label={
                  <div className={classes.tvlLabel}>
                    <span>TVL</span>
                    <div className={classes.tooltipWrapper}>
                      <Tooltip
                        arrow
                        placement="right"
                        classes={{
                          arrow: classes.tooltipArrow,
                          tooltip: classes.tooltip,
                        }}
                        title={`Price Range: ${getPriceRange()}`}
                      >
                        <img
                          className={classes.infoIcon}
                          alt="question"
                          src="/assets/icons/info.svg"
                        />
                      </Tooltip>
                    </div>
                  </div>
                }
                value={`$${numberWithCommas(
                  formatBigNumber(poolData.tvl, ETHER_DECIMAL)
                )}`}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2} className={classes.info}>
              <InfoSection
                label="APR"
                value={
                  poolData.apr === 'N/A' || poolData.apr === '0'
                    ? 'N/A'
                    : `${poolData.apr}%`
                }
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2} className={classes.info}>
              <InfoSection
                label="REWARDS PER WEEK"
                value={getRewardsPerWeek()}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2} className={classes.info}>
              <InfoSection
                label="REWARDS ENDING"
                value={
                  poolData.periodFinish.isZero() || !poolData.isReward
                    ? 'N/A'
                    : moment(
                        new Date(poolData.periodFinish.toNumber() * 1000)
                      ).format('MMM DD, YYYY')
                }
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2} className={classes.info}>
              <InfoSection
                label="VESTING PERIOD"
                value={
                  !poolData.isReward
                    ? 'N/A'
                    : Number(vesting) === 0
                    ? 'None'
                    : getTimeDurationStr(parseDuration(vesting))
                }
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2} className={classes.info}>
              <InfoSection
                label="FEE TIER"
                value={`${parseFee(poolData.poolFee).toString()} %`}
              />
            </Grid>
          </Grid>
        </div>

        <div className={classes.buttons}>
          <Button
            className={classes.button}
            color="primary"
            disabled={isDepositDisabled}
            onClick={() =>
              account
                ? setDepositModalVisible(true)
                : setWalletConnectModalOpened(true)
            }
            variant="contained"
          >
            DEPOSIT
          </Button>

          <Button
            className={classes.button}
            color="secondary"
            disabled={!isDeposited}
            variant="contained"
            onClick={() =>
              account
                ? setWithdrawModalVisible(true)
                : setWalletConnectModalOpened(true)
            }
          >
            WITHDRAW
          </Button>

          {shouldDisplayVestButton && (
            <Button
              className={classes.button}
              color="secondary"
              variant="contained"
              onClick={() =>
                account
                  ? setVestModalVisible(true)
                  : setWalletConnectModalOpened(true)
              }
            >
              VEST
            </Button>
          )}

          {shouldDisplayRewardsButton && (
            <Button
              ref={buttonRef}
              className={classes.button}
              color="secondary"
              variant="contained"
              disabled={!rewardPeriodFinished}
              onClick={() =>
                account
                  ? setRewardModalVisible(true)
                  : setWalletConnectModalOpened(true)
              }
            >
              REWARDS
              <TouchRipple ref={rippleRef} center />
            </Button>
          )}

          {isManageable && (
            <Button
              className={classes.button}
              color="secondary"
              variant="contained"
              onClick={() => setReinvestModalVisible(true)}
            >
              REINVEST
            </Button>
          )}
        </div>

        <RewardVestSection
          clrService={clrService}
          pool={poolData}
          reloadTerminalPool={reloadTerminalPool}
        />

        <HistorySection pool={poolData} />
      </div>
    </div>
  )
}
