import { Button, Grid, makeStyles, Typography } from '@material-ui/core'
import { SimpleLoader } from 'components'
import { useConnectedWeb3Context } from 'contexts'
import { BigNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { useTerminalPool } from 'helpers'
import { useState } from 'react'
import { CLRService } from 'services'
import { ClaimRewardsModal } from './ClaimRewardsModal'

const useStyles = makeStyles((theme) => ({
  block: {
    height: '100%',
    background: theme.colors.primary400,
    padding: 24,
    [theme.breakpoints.down('sm')]: {
      marginTop: 10,
      width: '100%',
      padding: '24px 8px',
    },
  },
  title: {
    color: theme.colors.primary100,
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 15,
    marginRight: 3,
  },
  symbol: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: 700,
  },
  value: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: 400,
  },
  lightPurpletext: {
    color: theme.colors.primary100,
    fontSize: 12,
    fontWeight: 400,
    margin: theme.spacing(0, 1),
  },
  whiteText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: 400,
  },
  wrapper: {
    display: 'flex',
    flex: 1,
  },
  vestingWrapper: {
    display: 'flex',
    flex: 1,
    minHeight: 35,
    alignItems: 'center',
  },
  itemWrapper: {
    display: 'flex',
    alignItems: 'center',
    minHeight: 35,
  },
  icon: {
    widows: 14,
    height: 14,
    marginRight: 10,
  },
  symbolWrapper: {
    display: 'flex',
    flex: 2,
  },
  valueWrapper: {
    display: 'flex',
    flex: 5,
    marginLeft: 10,
  },
  rewardValueWrapper: {
    display: 'flex',
    alignItems: 'center',
    flex: 8,
    [theme.breakpoints.down('sm')]: {
      flex: 3,
    },
  },
  button: {
    height: 20,
    margin: '0 3px',
    fontSize: 12,
  },
  titleWrapper: {
    display: 'flex',
  },
}))

interface IProps {
  poolAddress: string
}

export const RewardVestSection: React.FC<IProps> = ({
  poolAddress,
}) => {
  const cl = useStyles()
  const { loading, pool } = useTerminalPool(undefined, poolAddress)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const renderVestingTokens = () => {
    if (!pool || !pool.vestingInfo) {
      return <Typography variant="h5" className={cl.whiteText}>N/A</Typography>
    }
    return (
      <>
        {pool.vestingInfo.map(data => (
          <div key={data.symbol} className={cl.vestingWrapper}>
            <div className={cl.symbolWrapper}>
              <img className={cl.icon} alt="token" src={data.image} />
              <Typography className={cl.symbol}>
                {data.symbol}
              </Typography>
            </div>
            <div className={cl.valueWrapper}>
              <Typography className={cl.value}>
                {Number(formatEther(data.amount)).toFixed(4)}
              </Typography>
              {/* <Typography className={cl.lightPurpletext}>
                {`~ $ ${rate}`}
              </Typography> */}
            </div>
          </div>
        ))}
      </>
    )
  }

  const renderVestingPeriods = () => {
    if (!pool || !pool.vestingInfo) {
      return <Typography variant="h5" className={cl.whiteText}>N/A</Typography>
    }
    const formatDurationUnits = (duration: string[]) => {
      const primary = duration[0] || ''
      const rest = duration.slice(1, duration.length)
      rest.splice(0, 0, '')
      return { primary, rest: rest.join(' — ')}
    }
    return (
      <>
        {pool.vestingInfo.map((data, i) => {
          const { primary, rest } = formatDurationUnits(data.durationRemaining)
          return (
            <div key={i} className={cl.vestingWrapper}>
              <Typography className={cl.whiteText}>
                {primary}
              </Typography>
              <Typography className={cl.lightPurpletext}>
                {rest}
              </Typography>
            </div>
          )
        })}
      </>
    )
  }

  const { account, networkId, library: provider } = useConnectedWeb3Context()
  const onClickClaim = async () => {
    if (!account || !provider || loading || !pool) return
    try {
      // setState((prev) => ({
      //   ...prev,
      //   vesting: true,
      // }))
      const clr = new CLRService(provider, account, poolAddress)
      const txId = await clr.claimReward()
      console.log('tx id:', txId)
      const finalTxId = await clr.waitUntilClaimReward(account, txId)
      console.log('final tx id:', finalTxId)
      const claimInfo = await clr.parseClaimTx(finalTxId)
      console.log('claim info:', claimInfo)

      const claimedEarn: BigNumber[] = []

      // poolData.rewardState.tokens.forEach((rewardToken) => {
      //   const rewardAmount = claimInfo[rewardToken.address.toLowerCase()] || ZERO
      //   claimedEarn.push(rewardAmount)
      // })

      // setState((prev) => ({
      //   ...prev,
      //   vesting: false,
      //   vestTx: txId,
      //   vestDone: true,
      //   claimedEarn,
      // }))
    } catch (error) {
      console.error(error)
      // setState((prev) => ({
      //   ...prev,
      //   vesting: false,
      // }))
    }
  }

  const renderRewardsItems = () => (
    <div>
      {pool && pool.earnedInfo.map(({ symbol, image, amount}, i) => (
        <div key={i} className={cl.itemWrapper}>
          <div className={cl.symbolWrapper}>
            <img className={cl.icon} alt="token" src={image} />
            <Typography className={cl.symbol}>
              {symbol}
            </Typography>
          </div>
          <div className={cl.rewardValueWrapper}>
            <Typography className={cl.value}>
              {Number(formatEther(amount)).toFixed(4)}
            </Typography>
            {/* <Typography className={cl.lightPurpletext}>
              {`~ $ ${rate}`}
            </Typography> */}
            <div style={{flex: 8}} />
            {i === 0 && (
              <Button
                className={cl.button}
                color="secondary"
                variant="contained"
                onClick={() => setIsModalOpen(true)}
              >
                CLAIM ALL REWARDS
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  if (loading || !pool) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={cl.block}>
            <SimpleLoader />
          </div>
        </Grid>
      </Grid>
    )
  }

  return (
    <>
      <ClaimRewardsModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        poolAddress={poolAddress}
        earnedInfo={pool.earnedInfo}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div className={cl.block}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography className={cl.title}>
                  TOTAL VESTING
                </Typography>
                {renderVestingTokens()}
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography className={cl.title}>
                  REMAINING PERIOD
                </Typography>
                {renderVestingPeriods()}
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={cl.block}>
            <div className={cl.titleWrapper}>
              <Typography className={cl.title}>
                CLAIMABLE REWARDS
              </Typography>
              <img
                className={cl.icon}
                alt="token"
                src={'/assets/imgs/star.svg'}
              />
            </div>
            {renderRewardsItems()}
          </div>
        </Grid>
      </Grid>
    </>
  )
}
