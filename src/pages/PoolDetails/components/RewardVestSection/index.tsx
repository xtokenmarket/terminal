import { useState } from 'react'
import { formatEther } from 'ethers/lib/utils'
import { Button, Grid, makeStyles, Typography } from '@material-ui/core'
import { SimpleLoader } from 'components'
import { ClaimRewardsModal } from './ClaimRewardsModal'
import { toUsd } from 'utils/number'
import { ITerminalPool } from 'types'

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
  pool: ITerminalPool
}

export const RewardVestSection: React.FC<IProps> = ({ pool }) => {
  const cl = useStyles()

  const [isModalOpen, setIsModalOpen] = useState(false)

  let shouldDisplay = true
  if (pool) {
    const hasNoVisibleVesting =
      !pool.vestingTokens ||
      pool.vestingTokens.every((token) => token.amount.isZero)
    const hasNoVisibleRewards =
      !pool.earnedTokens ||
      pool.earnedTokens.every((token) => token.amount.isZero())

    if (hasNoVisibleRewards && hasNoVisibleVesting) {
      shouldDisplay = false
    }
  }

  if (!shouldDisplay) return null

  const renderVestingTokens = () => {
    if (!pool || !pool.vestingTokens) {
      return (
        <Typography variant="h5" className={cl.whiteText}>
          N/A
        </Typography>
      )
    }
    return (
      <>
        {pool.vestingTokens.map((token) => {
          const amount = Number(formatEther(token.amount))
          const price = toUsd(amount * Number(token.price))
          return (
            <div key={token.symbol} className={cl.vestingWrapper}>
              <div className={cl.symbolWrapper}>
                <img className={cl.icon} alt="token" src={token.image} />
                <Typography className={cl.symbol}>{token.symbol}</Typography>
              </div>
              <div className={cl.valueWrapper}>
                <Typography className={cl.value}>
                  {amount.toFixed(4)}
                </Typography>
                <Typography className={cl.lightPurpletext}>
                  ~ {price}
                </Typography>
              </div>
            </div>
          )
        })}
      </>
    )
  }

  const renderVestingPeriods = () => {
    if (!pool || !pool.vestingTokens) {
      return (
        <Typography variant="h5" className={cl.whiteText}>
          N/A
        </Typography>
      )
    }
    const formatDurationUnits = (duration: string[]) => {
      const primary = duration[0] || ''
      const rest = duration.slice(1, duration.length)
      rest.splice(0, 0, '')
      return { primary, rest: rest.join(' — ') }
    }
    return (
      <>
        {pool.vestingTokens.map((token, i) => {
          const { primary, rest } = formatDurationUnits(token.durationRemaining)
          if (token.durationRemaining.length === 0) {
            return (
              <div key={i} className={cl.vestingWrapper}>
                <Typography className={cl.whiteText}>N/A</Typography>
              </div>
            )
          }
          return (
            <div key={i} className={cl.vestingWrapper}>
              <Typography className={cl.whiteText}>{primary}</Typography>
              <Typography className={cl.lightPurpletext}>{rest}</Typography>
            </div>
          )
        })}
      </>
    )
  }

  const renderRewardsItems = () => (
    <div>
      {pool &&
        pool.earnedTokens.map((token, i) => {
          const amount = Number(formatEther(token.amount))
          const price = toUsd(amount * Number(token.price))
          return (
            <div key={i} className={cl.itemWrapper}>
              <div className={cl.symbolWrapper}>
                <img className={cl.icon} alt="token" src={token.image} />
                <Typography className={cl.symbol}>{token.symbol}</Typography>
              </div>
              <div className={cl.rewardValueWrapper}>
                <Typography className={cl.value}>
                  {amount.toFixed(4)}
                </Typography>
                <Typography className={cl.lightPurpletext}>
                  ~ {price}
                </Typography>
                <div style={{ flex: 8 }} />
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
          )
        })}
    </div>
  )

  return (
    <>
      <ClaimRewardsModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        poolAddress={pool.address}
        earnedTokens={pool.earnedTokens}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div className={cl.block}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography className={cl.title}>TOTAL VESTING</Typography>
                {renderVestingTokens()}
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography className={cl.title}>REMAINING PERIOD</Typography>
                {renderVestingPeriods()}
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={cl.block}>
            <div className={cl.titleWrapper}>
              <Typography className={cl.title}>CLAIMABLE REWARDS</Typography>
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
