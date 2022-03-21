import {
  Button,
  Grid,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { useConnectedWeb3Context } from 'contexts'
import moment from 'moment'
import { useState } from 'react'
import { ITerminalPool } from 'types'
import {
  formatBigNumber,
  formatToShortNumber,
  getCurrentTimeStamp,
  getTimeDurationStr,
  getTimeDurationUnitInfo,
  numberWithCommas,
} from 'utils'
import { parseDuration, ZERO } from 'utils/number'
import { RewardModal } from 'components'
import {
  BalanceSection,
  DepositModal,
  HistorySection,
  InfoSection,
  WithdrawModal,
} from '../index'
import { RewardVestSection } from '../RewardVestSection'
import { VestAllModal } from '../VestAllModal'
import { PoolShareSection } from '../PoolShareSection'

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
}))

interface IProps {
  poolData: ITerminalPool
  reloadTerminalPool: (isReloadPool: boolean) => Promise<void>
}

interface IState {
  depositVisible: boolean
  withdrawVisible: boolean
  vestVisible: boolean
  rewardVisible: boolean
}

const initialState: IState = {
  depositVisible: false,
  withdrawVisible: false,
  vestVisible: false,
  rewardVisible: false,
}

export const Content = (props: IProps) => {
  const classes = useStyles()
  const { account, setWalletConnectModalOpened } = useConnectedWeb3Context()
  const [state, setState] = useState<IState>(initialState)

  const { poolData } = props
  const { token0, token1 } = poolData

  const timestamp = getCurrentTimeStamp()
  const isManageable = [poolData.owner, poolData.manager]
    .map((e) => e.toLowerCase())
    .includes((account || '').toLowerCase())
  const isDeposited = !poolData.user.stakedTokenBalance.isZero()
  const rewardPeriodFinished = poolData.periodFinish.toNumber() < timestamp
  const { vesting } = poolData.rewardState

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

  const readyToVest = poolData.vestingTokens.filter(
    (token) => token.vestedAmount.gt(0) && token.durationRemaining.length === 0
  )
  const shouldDisplayVestButton =
    isDeposited &&
    Number(poolData.rewardState.vesting) > 0 &&
    readyToVest.length !== 0

  const getRewardsPerWeek = () => {
    const { duration, amounts } = poolData.rewardState
    const isInitiateRewardsPending = duration === '0'

    const rewards = poolData.rewardState.tokens.map((rewardToken, index) => {
      if (isInitiateRewardsPending) {
        return `${rewardToken.symbol}${
          index !== poolData.rewardState.tokens.length - 1 ? ' / ' : ''
        }`
      } else {
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
      }
    })
    return rewards.join('')
  }

  return (
    <div className={classes.root}>
      {state.depositVisible && (
        <DepositModal
          onClose={() => setDepositModalVisible(false)}
          onSuccess={async () => {
            setDepositModalVisible(false)
            await props.reloadTerminalPool(true)
          }}
          poolData={poolData}
        />
      )}

      <RewardModal
        isCreatePool={false}
        isOpen={state.rewardVisible}
        onClose={() => setRewardModalVisible(false)}
        onSuccess={async () => {
          setRewardModalVisible(false)
          await props.reloadTerminalPool(true)
        }}
        poolData={poolData}
      />

      {state.withdrawVisible && (
        <WithdrawModal
          onClose={() => setWithdrawModalVisible(false)}
          onSuccess={async () => {
            setWithdrawModalVisible(false)
            await props.reloadTerminalPool(true)
          }}
          poolData={poolData}
        />
      )}

      {poolData.vestingTokens.length !== 0 && (
        <VestAllModal
          open={state.vestVisible}
          onClose={() => setVestModalVisible(false)}
          vestingTokens={readyToVest}
          poolAddress={poolData.address}
          reloadTerminalPool={props.reloadTerminalPool}
        />
      )}

      <div className={classes.content}>
        <div>
          <Grid container spacing={0}>
            <Grid item xs={12} md={6} className={classes.balance}>
              <Typography className={classes.title}>POOL BALANCE</Typography>
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
                label="TVL"
                value={`$${numberWithCommas(poolData.tvl)}`}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2} className={classes.info}>
              <InfoSection
                label="APR"
                value={
                  poolData.apr === 'N/A' ? poolData.apr : `${poolData.apr}%`
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
                  poolData.periodFinish.isZero()
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
                  Number(vesting) === 0
                    ? 'None'
                    : getTimeDurationStr(parseDuration(vesting))
                }
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2} className={classes.info}>
              <InfoSection
                label="FEE TIER"
                value={`${(
                  Number(poolData.poolFee.toString()) / 10000
                ).toString()} %`}
              />
            </Grid>
          </Grid>
        </div>

        <div className={classes.buttons}>
          <Button
            className={classes.button}
            color="primary"
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

          {isManageable && (
            <Button
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
            </Button>
          )}

          {isManageable && (
            <Tooltip
              title="Coming Soon"
              arrow
              placement="top"
              classes={{
                arrow: classes.tooltipArrow,
                tooltip: classes.tooltip,
              }}
            >
              <Button
                className={classes.button}
                color="secondary"
                variant="contained"
              >
                REINVEST
              </Button>
            </Tooltip>
          )}
        </div>

        <RewardVestSection
          pool={poolData}
          reloadTerminalPool={props.reloadTerminalPool}
        />

        <HistorySection pool={poolData} />
      </div>
    </div>
  )
}
