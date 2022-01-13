import React from 'react'
import { Typography, makeStyles, CircularProgress } from '@material-ui/core'
import { transparentize } from 'polished'

const useStyles = makeStyles((theme) => ({
  spinnerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: transparentize(0.9, theme.colors.gray2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: 5,
  },
  spinner: {
    color: theme.colors.white,
  },
  title: {
    color: theme.colors.white,
    fontSize: 20,
    fontWeight: 600,
    marginTop: 16,
    marginBottom: 16,
  },
  description: {
    color: theme.colors.white,
  },
}))

interface IProps {
  visible: boolean
}

export const LoadingOverlay: React.FC<IProps> = ({ visible }) => {
  const cl = useStyles()
  if (!visible) return null
  return (
    <div className={cl.spinnerOverlay}>
      <CircularProgress className={cl.spinner} />
      <Typography className={cl.title}>Checking Pool Info</Typography>
      <Typography className={cl.description}>
        Looking for the pool on Uniswap
      </Typography>
    </div>
  )
}
