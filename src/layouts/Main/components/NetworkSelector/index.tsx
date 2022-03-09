import { makeStyles, Select, MenuItem } from '@material-ui/core'
import clsx from 'clsx'
import { ChainId, CHAIN_NAMES } from 'config/constants'
import { useNetworkContext } from 'contexts/networkContext'
import { useCallback } from 'react'
import { ENetwork } from 'utils/enums'

const useStyles = makeStyles((theme) => ({
  root: {
    '& svg': {
      color: theme.colors.eighth,
    },
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    '& img': {
      width: 24,
      height: 24,
      marginRight: 6,
    },
  },
  input: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.colors.primary600,
    paddingLeft: 8,
    paddingTop: 8,
    paddingBottom: 8,
    '& img': {
      width: 24,
      height: 24,
      marginRight: 6,
    },
    [theme.breakpoints.down('xs')]: {
      backgroundColor: theme.colors.primary,
      '& span': {
        display: 'none',
      },
    },
  },
  paper: { backgroundColor: theme.colors.fifth },
  list: { backgroundColor: theme.colors.fifth, color: theme.colors.white },
}))

interface IProps {
  className?: string
  network: ENetwork
}

export const NetworkSelector = (props: IProps) => {
  const classes = useStyles()
  const { chainId, supportedChains, switchChain } = useNetworkContext()

  const handleNetworkChange = useCallback(
    async ({ target: { value: network } }) => {
      await switchChain(network)
    },
    [switchChain]
  )

  return (
    <Select
      value={chainId || ChainId.Mainnet}
      className={clsx(classes.root, props.className)}
      disableUnderline
      classes={{
        root: classes.input,
      }}
      MenuProps={{
        PaperProps: {
          className: classes.paper,
        },
        classes: {
          list: classes.list,
        },
      }}
      onChange={handleNetworkChange}
    >
      {supportedChains.map((chainId) => {
        const network = CHAIN_NAMES[chainId]
        return (
          <MenuItem value={chainId} key={chainId} className={classes.item}>
            <img alt="img" src={`/assets/networks/${network}.svg`} />
            <span>{network}</span>
          </MenuItem>
        )
      })}
    </Select>
  )
}
