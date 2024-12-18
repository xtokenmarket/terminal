import { useState } from 'react'
import { useConnectedWeb3Context } from 'contexts'
import { getEtherscanUri } from 'config/networks'
import { formatUnits } from 'ethers/lib/utils'
import { Button, Grid, makeStyles, Typography } from '@material-ui/core'
import { formatDurationUnits } from 'utils'
import { toUsd } from 'utils/number'
import { ITerminalPool, PoolService } from 'types'

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
  tokenLink: {
    display: 'flex',
    alignItems: 'center',
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
  clrService: PoolService
  pool: ITerminalPool
  reloadTerminalPool: (isReloadPool: boolean) => Promise<void>
}

export const RewardVestSection: React.FC<IProps> = ({
  clrService,
  pool,
  reloadTerminalPool,
}) => {
  const cl = useStyles()
  const { networkId } = useConnectedWeb3Context()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const etherscanUri = getEtherscanUri(networkId)

  const toggleModal = () => setIsModalOpen((prevState) => !prevState)

  let shouldDisplay = true
  if (pool) {
    const hasNoVisibleVesting =
      !pool.vestingTokens ||
      pool.vestingTokens.every((token) => token.amount.isZero())
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
          const amount = Number(formatUnits(token.amount, token.decimals))
          const price = toUsd(amount * Number(token.price))
          return (
            <div key={token.symbol} className={cl.vestingWrapper}>
              <div className={cl.symbolWrapper}>
                <a
                  className={cl.tokenLink}
                  href={`${etherscanUri}token/${token.address}`}
                  target={'_blank'}
                  rel={'noopener noreferrer'}
                >
                  <img className={cl.icon} alt="token" src={token.image} />
                  <Typography className={cl.symbol}>{token.symbol}</Typography>
                </a>
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
          const amount = Number(formatUnits(token.amount, token.decimals))
          const price = toUsd(amount * Number(token.price))
          return (
            <div key={i} className={cl.itemWrapper}>
              <div className={cl.symbolWrapper}>
                <a
                  className={cl.tokenLink}
                  href={`${etherscanUri}token/${token.address}`}
                  target={'_blank'}
                  rel={'noopener noreferrer'}
                >
                  <img className={cl.icon} alt="token" src={token.image} />
                  <Typography className={cl.symbol}>{token.symbol}</Typography>
                </a>
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
                    onClick={toggleModal}
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
        onClose={toggleModal}
        clrService={clrService}
        earnedTokens={pool.earnedTokens}
        reloadTerminalPool={reloadTerminalPool}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div className={cl.block}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography className={cl.title}>TOTAL VESTING</Typography>
                {renderVestingTokens()}
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
