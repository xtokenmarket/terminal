import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import { IToken } from 'types'

const useStyles = makeStyles((theme) => ({
  root: {
    width: 32,
    height: 32,
    borderRadius: '50%',
  },
}))

interface IProps {
  token?: IToken
  className?: string
}

export const TokenIcon = (props: IProps) => {
  const classes = useStyles()

  return (
    <img
      alt="token"
      className={clsx(classes.root, props.className)}
      src={
        props.token && props.token.image
          ? props.token.image
          : '/assets/tokens/unknown.png'
      }
    />
  )
}
