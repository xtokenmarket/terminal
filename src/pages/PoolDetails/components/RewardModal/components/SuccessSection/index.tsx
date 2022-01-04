import { Button, makeStyles, Typography } from '@material-ui/core'
import { IRewardState } from 'pages/PoolDetails/components'
import { ITerminalPool } from 'types'

import { OutputEstimation } from '..'

const ICON_SIZE = 150

const useStyles = makeStyles((theme) => ({
  root: { paddingTop: ICON_SIZE / 2 },
  header: {
    backgroundColor: theme.colors.primary500,
    padding: 32,
    paddingBottom: 16,
    paddingTop: ICON_SIZE / 2,
    textAlign: 'center',
    position: 'relative',
  },
  img: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    position: 'absolute',
    top: -ICON_SIZE / 2,
    left: `calc(50% - ${ICON_SIZE / 2}px)`,
  },
  title: {
    color: theme.colors.white,
    fontWeight: 600,
    fontSize: 28,
    marginBottom: 24,
  },
  description: {
    fontSize: 15,
    marginBottom: 24,
    color: theme.colors.white,
  },
  deposit: {},
  buy: { marginTop: 8 },
  actions: {
    padding: 32,
    backgroundColor: theme.colors.primary500,
  },
}))

interface IProps {
  onClose: () => void
  rewardState: IRewardState
  poolData: ITerminalPool
}

export const SuccessSection = (props: IProps) => {
  const classes = useStyles()
  const { rewardState, poolData, onClose } = props

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <img
          alt="check"
          src="/assets/icons/confirmed.png"
          className={classes.img}
        />
        <Typography className={classes.title}>
          Rewards program initiated successfully!
        </Typography>
        <Typography className={classes.description}>
          You have successfully finished your rewards initiation process! Below
          you can see details of your initialization.
        </Typography>
      </div>
      <OutputEstimation
        poolData={poolData}
        rewardState={rewardState}
        amounts={rewardState.amounts}
      />
      <div className={classes.actions}>
        <Button
          color="primary"
          variant="contained"
          fullWidth
          className={classes.deposit}
          onClick={onClose}
        >
          DONE
        </Button>
      </div>
    </div>
  )
}
