import { Button, makeStyles, Typography } from '@material-ui/core'
import { ViewTransaction } from 'components'
import { IOfferingOverview } from 'types'

import { OutputEstimation } from '../index'

const ICON_SIZE = 150

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: ICON_SIZE / 2,
    width: 600,
    maxWidth: '90vw',
    // minHeight: '20vh',
    // maxHeight: '50vh',
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
}))

interface IProps {
  offerData: IOfferingOverview
  onClose: () => void
  txHash: string
}

export const SuccessSection = (props: IProps) => {
  const classes = useStyles()
  const { offerData, onClose, txHash } = props

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <img
          alt="check"
          src="/assets/icons/confirmed.png"
          className={classes.img}
        />
        <Typography className={classes.title}>Program deployed!</Typography>
        <Typography className={classes.description}>
          You have successfully initiated your program. Contributors are now
          able to invest or contribute.
        </Typography>
      </div>
      <OutputEstimation offerData={offerData} />
      <div className={classes.actions}>
        <div className={classes.transaction}>
          <ViewTransaction txId={txHash} />
        </div>
        <Button
          id="initiateDone"
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
