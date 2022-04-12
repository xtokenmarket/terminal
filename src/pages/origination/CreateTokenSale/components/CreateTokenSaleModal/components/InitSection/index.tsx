import { Button, makeStyles } from '@material-ui/core'
import { WarningInfo } from 'components/Common/WarningInfo'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 32,
  },
  button: { height: 48, marginTop: 24 },
}))

interface IProps {
  onNext: () => void
  onClose: () => void
}

export const InitSection = (props: IProps) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <WarningInfo
        title="Important"
        description="This will transfer the tokens from your address to the Terminal contract. This action cannot be undone or reversed."
      />

      <Button
        className={classes.button}
        color="primary"
        fullWidth
        onClick={props.onNext}
        variant="contained"
      >
        SELL TOKEN
      </Button>
      <Button
        className={classes.button}
        color="secondary"
        fullWidth
        onClick={props.onClose}
        variant="contained"
      >
        CANCEL
      </Button>
    </div>
  )
}
