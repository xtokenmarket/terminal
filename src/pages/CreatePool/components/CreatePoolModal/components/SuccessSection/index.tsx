import { Button, makeStyles, Typography } from '@material-ui/core'
import { ICreatePoolData } from 'types'
import { ViewTransaction } from 'components/Common/ViewTransaction'

const ICON_SIZE = 150

const useStyles = makeStyles((theme) => ({
  root: { paddingTop: ICON_SIZE / 2 },
  header: {
    backgroundColor: theme.colors.primary500,
    padding: 32,
    paddingBottom: 2,
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
  transaction: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
  actions: {
    padding: 32,
    paddingTop: 2,
    backgroundColor: theme.colors.primary500,
  },
}))

interface IProps {
  onClose: () => void
  poolData: ICreatePoolData
  txId: string
}

export const SuccessSection = (props: IProps) => {
  const classes = useStyles()
  const { poolData, onClose } = props

  const pool = `${poolData.token0.symbol}/${poolData.token1.symbol}`

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <img
          alt="check"
          src="/assets/icons/confirmed.png"
          className={classes.img}
        />
        <Typography className={classes.title}>{pool} pool created!</Typography>
        <Typography className={classes.description}>
          You have successfully created {pool} pool.
        </Typography>
      </div>
      <div className={classes.actions}>
        <div className={classes.transaction}>
          <ViewTransaction txId={props.txId} />
        </div>
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
