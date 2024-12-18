import { makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { TokenIcon, TokenSelectModal } from 'components'
import { useState } from 'react'
import { IToken } from 'types'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: theme.colors.primary400,
    height: 80,
    alignItems: 'center',
    padding: theme.spacing(2),
    borderRadius: 4,
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
    transition: 'all 0.4s',
    '&:hover': {
      backgroundColor: theme.colors.primary200,
    },
    '&.disabled': {
      cursor: 'default',
    },
  },
  icon: {},
  text: {
    flex: 1,
    marginLeft: theme.spacing(2),
    color: theme.colors.white,
    fontWeight: 700,
  },
  downArrow: {},
}))

interface IProps {
  className?: string
  isDisabled?: boolean
  token?: IToken
  onChange: (_: IToken) => void
}

export const TokenSelect: React.FC<IProps> = ({
  token,
  isDisabled = false,
  onChange,
  className,
}) => {
  const classes = useStyles()
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <div>
      <TokenSelectModal
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={(token) => {
          onChange(token)
          setModalVisible(false)
        }}
      />
      <div
        className={clsx(classes.root, className)}
        onClick={() => (!isDisabled ? setModalVisible(true) : undefined)}
      >
        <TokenIcon token={token} />
        <Typography className={classes.text}>
          {token ? token.symbol : 'Select token'}
        </Typography>
        {!isDisabled && (
          <img
            alt="down"
            className={classes.downArrow}
            src="/assets/icons/down-arrow.svg"
          />
        )}
      </div>
    </div>
  )
}
