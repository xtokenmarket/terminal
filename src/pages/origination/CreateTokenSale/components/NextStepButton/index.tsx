import { Button, Grid, makeStyles } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  root: { marginTop: 'auto', display: 'flex', width: '100%' },
  button: {
    width: '50%',
  },
  error: {
    color: theme.colors.warn,
    marginBottom: 15,
    fontSize: 14,
  },
}))

interface IProps {
  disabled?: boolean
  error?: string
  id: string
  onBackClick: () => void
  onNextClick: () => void
}

export const NextStepButton = ({
  disabled,
  error,
  id,
  onBackClick,
  onNextClick,
}: IProps) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          {error && <div className={classes.error}>{error}</div>}
        </Grid>
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
