import { Button, Grid, makeStyles } from '@material-ui/core'

interface IProps {
  id: string
  disabled?: boolean
  onNextClick: () => void
  onBackClick: () => void
}

const useStyles = makeStyles((theme) => ({
  root: { marginTop: 'auto', display: 'flex', width: '100%' },
  button: {
    width: '50%',
  },
}))

export const NextStepButton = ({
  id,
  disabled,
  onNextClick,
  onBackClick,
}: IProps) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Button
            color="secondary"
            fullWidth
            variant="contained"
            onClick={onBackClick}
          >
            Back
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            id={id}
            color="primary"
            fullWidth
            onClick={onNextClick}
            variant="contained"
            disabled={disabled}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}
