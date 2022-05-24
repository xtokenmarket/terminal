import { Button, IconButton, makeStyles, Typography } from '@material-ui/core'
import { IMyPosition, IOfferingOverview } from 'types'
import { OutputEstimation } from '../index'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import { VestState } from '../..'

const ICON_SIZE = 150

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: ICON_SIZE / 2,
    width: 600,
    maxWidth: '90vw',
  },
  header: {
    padding: 32,
    position: 'relative',
    paddingBottom: 16,
    display: 'flex',
    backgroundColor: theme.colors.primary500,
  },
  title: {
    color: theme.colors.white,
    fontWeight: 600,
    fontSize: 22,
    marginBottom: 24,
  },
  actions: {
    padding: 32,
    paddingTop: 0,
    backgroundColor: theme.colors.primary500,
  },
  closeButton: {
    padding: 0,
    color: theme.colors.white1,
    position: 'absolute',
    right: 24,
    top: 36,
    [theme.breakpoints.down('xs')]: {
      top: 12,
      right: 12,
    },
  },
}))

interface IProps {
  offerData: IOfferingOverview
  onNext: () => void
  onClose: () => void
  vestState: VestState
  myPositionData: IMyPosition
}

export const InfoSection = (props: IProps) => {
  const classes = useStyles()
  const { offerData, onNext, onClose, vestState, myPositionData } = props

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.title}>
          Vest {offerData.offerToken.symbol} tokens
        </Typography>
        <IconButton className={classes.closeButton} onClick={onClose}>
          <CloseOutlinedIcon />
        </IconButton>
      </div>
      <OutputEstimation
        offerData={offerData}
        vestState={vestState}
        myPositionData={myPositionData}
      />
      <div className={classes.actions}>
        <Button color="primary" variant="contained" fullWidth onClick={onNext}>
          VEST
        </Button>
      </div>
    </div>
  )
}
