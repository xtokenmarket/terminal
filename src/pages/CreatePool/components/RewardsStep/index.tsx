import {
  Button,
  Grid,
  makeStyles,
  Typography,
  Checkbox,
} from '@material-ui/core'
import { FEE_TIERS, FEE_TIPS } from 'config/constants'
import React, { useState } from 'react'
import { ICreatePoolData } from 'types'
import { RewardTokensTable } from './RewardTokensTable'
import { IRewardState, RewardModal } from 'components'
import { CreatePoolModal } from '../CreatePoolModal'
import { useNetworkContext } from 'contexts/networkContext'
import { parseFee } from 'utils'

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
    marginTop: theme.spacing(2),
  },
  rewardTokenRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  checkboxItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    color: theme.colors.white,
    cursor: 'pointer',
    fontSize: 14,
    marginBottom: 16,
  },
  checkboxIcon: {
    position: 'absolute',
    left: 0,
    width: 16,
    height: 16,
  },
  checkboxRoot: {
    marginRight: 8,
  },
}))

interface IProps {
  data: ICreatePoolData
  updateData: (_: any) => void
  onEdit: () => void
}

export const RewardsStep: React.FC<IProps> = ({ data, updateData, onEdit }) => {
  const cl = useStyles()

  const { chainId } = useNetworkContext()

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isRewardsModalVisible, setIsRewardsModalVisible] = useState(false)
  const [noRewardsChecked, setNoRewardsChecked] = useState(false)

  const feeLabel = FEE_TIERS.find((fee) => fee.value.eq(data.tier))?.label
  const priceLabel = `${data.token1.symbol.toUpperCase()} per ${data.token0.symbol.toUpperCase()}`
  const feeTip = FEE_TIPS[chainId]

  const toggleCreateModal = () =>
    setIsCreateModalVisible((prevState) => !prevState)
  const toggleRewardsModal = () =>
    setIsRewardsModalVisible((prevState) => !prevState)

  const hasSpecifiedRewards = data.rewardState.tokens.length > 0

  const onNextStep = (state: IRewardState) => {
    updateData({ rewardState: state })
    toggleRewardsModal()
  }

  const onNoRewardCheck = () => {
    const checked = !noRewardsChecked
    setNoRewardsChecked(checked)
    updateData({ nonRewardPool: checked })
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
                    <p className="data">
                      {data.minPrice === true ? '0' : data.minPrice}
                    </p>
                    <p className="description">{priceLabel}</p>
                  </Grid>
                  <Grid item xs={12} sm={4} className={cl.section}>
                    <p className="title">Max Price</p>
                    <p className="data">
                      {data.maxPrice === true ? '∞' : data.maxPrice}
                    </p>
                    <p className="description">{priceLabel}</p>
                  </Grid>
                  <Grid item xs={12} sm={4} className={cl.section}>
                    <p className="title">Fee tier</p>
                    <p className="data">{parseFee(data.tier)}%</p>
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
            <Grid item xs={12} className={cl.checkboxItem}>
              <Checkbox
                checked={noRewardsChecked}
                color="secondary"
                classes={{
                  root: cl.checkboxRoot,
                }}
                icon={
                  <img
                    src="/assets/icons/unchecked.svg"
                    className={cl.checkboxIcon}
                  />
                }
                checkedIcon={
                  <img
                    src="/assets/icons/checked-white.svg"
                    className={cl.checkboxIcon}
                  />
                }
                onChange={() => onNoRewardCheck()}
                value={noRewardsChecked}
                disableRipple
              />

              <Typography onClick={() => onNoRewardCheck()}>
                This pool has no rewards
              </Typography>
            </Grid>
            {!noRewardsChecked && (
              <div className={cl.noRewardsWrapper}>
                {hasSpecifiedRewards ? (
                  <RewardTokensTable rewardState={data.rewardState} />
                ) : (
                  <Typography className={cl.noRewardsText}>
                    You have not configured rewards for this pool
                  </Typography>
                )}
                <Button
                  className={cl.createRewardsBtn}
                  color="secondary"
                  onClick={toggleRewardsModal}
                  variant="contained"
                >
                  {hasSpecifiedRewards ? 'EDIT REWARDS' : 'CONFIGURE REWARDS'}
                </Button>
              </div>
            )}
          </Grid>
        </Grid>
      </div>

      <Typography className={cl.fee}>{feeTip}</Typography>
      <Button
        color="primary"
        fullWidth
        onClick={toggleCreateModal}
        variant="contained"
        disabled={noRewardsChecked ? false : !hasSpecifiedRewards}
      >
        CREATE POOL
      </Button>

      <RewardModal
        isCreatePool
        isOpen={isRewardsModalVisible}
        onClose={toggleRewardsModal}
        onCreateReward={onNextStep}
        onSuccess={async () => {
          toggleRewardsModal()
        }}
        poolData={data}
      />

      <CreatePoolModal
        isOpen={isCreateModalVisible}
        onClose={toggleCreateModal}
        poolData={data}
      />
    </div>
  )
}
