import { Button, makeStyles } from '@material-ui/core'
import { WarningInfo } from '..'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 32,
  },
  button: { height: 48, marginTop: 24 },
}))

interface IProps {
  onNext: () => void
}

export const InitSection = (props: IProps) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <WarningInfo
        title="Important"
        description="This will transfer the tokens from your address to the Terminal contrat. This action cannot be undone or reversed."
      />

      <Button
        className={classes.button}
        color="primary"
        fullWidth
        onClick={props.onNext}
        variant="contained"
      >
        CREATE POOL
      </Button>
    </div>
  )
}