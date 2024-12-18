import { Button, makeStyles, Typography } from '@material-ui/core'
import { BigNumber } from 'ethers'
import { IToken } from 'types'
import { parseFee } from 'utils'

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
  logos: {
    display: 'flex',
    justifyContent: 'center',
  },
}))

interface IProps {
  onClose: () => void
  token0: IToken
  token1: IToken
  tier: BigNumber
}

export const SuccessSection: React.FC<IProps> = ({
  onClose,
  token0,
  token1,
  tier,
}) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <img
          alt="check"
          src="/assets/icons/confirmed.png"
          className={classes.img}
        />
        <div className={classes.logos}>
          {[token0.image, token1.image].map((img) => (
            <img src={img} key={img} />
          ))}
        </div>
        <Typography className={classes.title}>
          {`${token0.symbol}/${token1.symbol}`} {`${parseFee(tier)}%`} pool
          deployed!
        </Typography>
        <Typography className={classes.description}>
          You have successfully deployed {`${token0.symbol}/${token1.symbol}`}{' '}
          pool on Uniswap V3.
        </Typography>
      </div>
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
