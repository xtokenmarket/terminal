import { Button, makeStyles, Typography } from '@material-ui/core'
import { ViewTransaction } from 'components'
import { IUserPosition, IOfferingOverview } from 'types'
import { VestState } from '../..'

import { OutputEstimation } from '../index'

const ICON_SIZE = 150

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: ICON_SIZE / 2,
    width: 600,
    maxWidth: '90vw',
  },
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
  actions: {
    padding: 32,
    paddingTop: 0,
    backgroundColor: theme.colors.primary500,
  },
  transaction: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}))

interface IProps {
  offerData: IOfferingOverview
  onClose: () => void
  txHash: string
  vestState: VestState
  userPositionData: IUserPosition
}

export const SuccessSection = (props: IProps) => {
  const classes = useStyles()
  const { offerData, onClose, txHash, vestState, userPositionData } = props

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <img
          alt="check"
          src="/assets/icons/confirmed.png"
          className={classes.img}
        />
        <Typography className={classes.title}>Vest confirmed!</Typography>
        <Typography className={classes.description}>
          You have successfully finished your vest process! Below you can see
          details of your transaction.
        </Typography>
      </div>
      <OutputEstimation
        offerData={offerData}
        vestState={vestState}
        userPositionData={userPositionData}
      />
      <div className={classes.actions}>
        <div className={classes.transaction}>
          <ViewTransaction txId={txHash} />
        </div>
        <Button color="primary" variant="contained" fullWidth onClick={onClose}>
          DONE
        </Button>
      </div>
    </div>
  )
}
