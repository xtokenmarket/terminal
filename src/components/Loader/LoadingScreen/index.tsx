import { makeStyles, Box, LinearProgress } from '@material-ui/core'

import React from 'react'

const useStyles = makeStyles({
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    minHeight: '100%',
    padding: 24,
    marginTop: 150,
  },
})

export const LoadingScreen = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Box width={400}>
        <LinearProgress />
      </Box>
    </div>
  )
}
