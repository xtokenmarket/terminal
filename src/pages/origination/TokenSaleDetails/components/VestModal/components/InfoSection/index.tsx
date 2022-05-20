import { Button, IconButton, makeStyles, Typography } from '@material-ui/core'
import { IOfferingOverview } from 'types'
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
    fontSize: 22,
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
    paddingTop: 0,
    backgroundColor: theme.colors.primary500,
  },
  transaction: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    marginTop: 20,
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
}

export const InfoSection = (props: IProps) => {
  const classes = useStyles()
  const { offerData, onNext, onClose, vestState } = props

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
      <OutputEstimation offerData={offerData} vestState={vestState} />
      <div className={classes.actions}>
        <Button
          color="primary"
          variant="contained"
          fullWidth
          className={classes.deposit}
          onClick={onNext}
        >
          VEST
        </Button>
      </div>
    </div>
  )
}
