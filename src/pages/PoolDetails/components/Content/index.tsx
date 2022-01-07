import { BigNumber } from '@ethersproject/bignumber'
import { Button, Grid, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import { useConnectedWeb3Context } from 'contexts'
import { useIsMountedRef } from 'helpers'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { ERC20Service } from 'services'
import { ITerminalPool } from 'types'
import {
  formatToShortNumber,
  getCurrentTimeStamp,
  getTimeDurationStr,
  numberWithCommas,
} from 'utils'
import { ZERO } from 'utils/number'
import {
  BalanceSection,
  DepositModal,
  HistorySection,
  InfoSection,
  VestModal,
  WithdrawModal,
  RewardModal,
} from '../index'

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
}))

interface IProps {
  poolData: ITerminalPool
  reloadTerminalPool: () => Promise<void>
}

interface IState {
  stakedTokenBalance: BigNumber
  depositVisible: boolean
  withdrawVisible: boolean
  vestVisible: boolean
  rewardVisible: boolean
}

const initialState: IState = {
  stakedTokenBalance: ZERO,
  depositVisible: false,
  withdrawVisible: false,
  vestVisible: false,
  rewardVisible: false,
}

export const Content = (props: IProps) => {
  const { poolData } = props
  const [state, setState] = useState<IState>(initialState)
  const classes = useStyles()
  const {
    account,
    library: provider,
    networkId,
    setWalletConnectModalOpened,
  } = useConnectedWeb3Context()
  const isMountedRef = useIsMountedRef()

  const timestamp = getCurrentTimeStamp()
  const isManageable = [poolData.owner, poolData.manager]
    .map((e) => e.toLowerCase())
    .includes((account || '').toLowerCase())
  const isDeposited = !state.stakedTokenBalance.isZero()
  const rewardPeriodFinished = poolData.periodFinish.toNumber() < timestamp

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

  const loadPersonalInfo = async () => {
    if (!account || !provider) {
      setState((prev) => ({ ...prev, stakedTokenBalance: ZERO }))
      return
    }

    try {
      const stakedToken = new ERC20Service(
        provider,
        account,
        poolData.stakedToken.address
      )
      const balance = await stakedToken.getBalanceOf(account)
      if (isMountedRef.current) {
        setState((prev) => ({ ...prev, stakedTokenBalance: balance }))
      }
    } catch (error) {
      if (isMountedRef.current) {
        setState((prev) => ({ ...prev, stakedTokenBalance: ZERO }))
      }
    }
  }

  useEffect(() => {
    loadPersonalInfo()
  }, [account, networkId])

  return (
    <div className={classes.root}>
      {state.depositVisible && (
        <DepositModal
          onClose={() => setDepositModalVisible(false)}
          onSuccess={async () => {
            setDepositModalVisible(false)
            await props.reloadTerminalPool()
          }}
          poolData={poolData}
        />
      )}

      {state.rewardVisible && (
        <RewardModal
          onClose={() => setRewardModalVisible(false)}
          onSuccess={async () => {
            setRewardModalVisible(false)
            await props.reloadTerminalPool()
          }}
          poolData={poolData}
        />
      )}

      {state.withdrawVisible && (
        <WithdrawModal
          onClose={() => setWithdrawModalVisible(false)}
          onSuccess={async () => {
            setWithdrawModalVisible(false)
            await props.reloadTerminalPool()
          }}
          poolData={poolData}
        />
      )}

      {state.vestVisible && (
        <VestModal
          onClose={() => setVestModalVisible(false)}
          onSuccess={async () => {
            setVestModalVisible(false)
            await props.reloadTerminalPool()
          }}
          poolData={poolData}
        />
      )}

      <div className={classes.content}>
        <div>
          <Grid container spacing={0}>
            <Grid item xs={12} md={6} className={classes.balance}>
              <BalanceSection
                pool={poolData}
                token={poolData.token0}
                percent={poolData.token0Percent}
                tokentvl={poolData.token0tvl}
              />
            </Grid>
            <Grid item xs={12} md={6} className={classes.balance}>
              <BalanceSection
                pool={poolData}
                token={poolData.token1}
                percent={poolData.token1Percent}
                tokentvl={poolData.token1tvl}
              />
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
                label="VESTING PERIOD"
                value={getTimeDurationStr(poolData.rewardsDuration.toNumber())}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2} className={classes.info}>
              <InfoSection
                label="ENDING"
                value={moment(
                  new Date(poolData.periodFinish.toNumber() * 1000)
                ).format('MMM DD, YYYY')}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2} className={classes.info}>
              <InfoSection label="APR" value="68%" />
            </Grid>
            <Grid item xs={6} sm={4} md={2} className={classes.info}>
              <InfoSection
                label="VOLUME(24H)"
                value={`$${formatToShortNumber('791')}`}
                right={
                  <span className={clsx(classes.tag, 'positive')}>+17.38%</span>
                }
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2} className={classes.info}>
              <InfoSection
                label="VOLUME(7D)"
                value={`$${formatToShortNumber('91451')}`}
                right={
                  <span className={clsx(classes.tag, 'negative')}>-13.38%</span>
                }
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

          {isDeposited && (
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
            <Button
              className={classes.button}
              color="secondary"
              variant="contained"
            >
              REBALANCE
            </Button>
          )}
        </div>
        <HistorySection pool={poolData} />
      </div>
    </div>
  )
}
