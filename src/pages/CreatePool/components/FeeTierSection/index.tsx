import { BigNumber } from '@ethersproject/bignumber'
import { makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { transparentize } from 'polished'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 24,
  },
  tier: {
    flex: 1,
    border: `1px solid ${theme.colors.primary200}`,
    borderRadius: 4,
    padding: 16,

    position: 'relative',
    transition: 'all 0.4s',
    backgroundColor: theme.colors.transparent,
    cursor: 'pointer',
    '&:hover': { opacity: 0.7 },
    '& p': {
      color: theme.colors.primary100,
      margin: 0,
      fontSize: 22,
      fontWeight: 600,
      transition: 'all 0.4s',
    },
    '& span': {
      color: theme.colors.primary100,
      fontSize: 14,
      fontWeight: 600,
      transition: 'all 0.4s',
    },
    '& img': {
      position: 'absolute',
      right: 12,
      top: 12,
      opacity: 0,
      transition: 'all 0.4s',
    },
    '&.active': {
      borderColor: theme.colors.secondary,
      backgroundColor: transparentize(0.85, theme.colors.secondary),
      color: theme.colors.white,
      '& p': { color: theme.colors.white },
      '& span': { color: theme.colors.white },
      '& img': {
        opacity: 1,
      },
    },
    '&+&': {
      marginLeft: 12,
    },
  },
}))

interface IProps {
  tier: BigNumber
  onChange: (_: BigNumber) => void
  className?: string
}

const TIERS = [
  {
    value: BigNumber.from(500),
    label: 'Best for stable pairs',
  },
  {
    value: BigNumber.from(3000),
    label: 'Best for most pairs',
  },
  {
    value: BigNumber.from(10000),
    label: 'Best for exact pairs',
  },
]

export const FeeTierSection = (props: IProps) => {
  const classes = useStyles()
  const { tier, onChange } = props

  return (
    <div className={clsx(classes.root, props.className)}>
      {TIERS.map((item) => {
        const isActive = item.value.eq(tier)

        return (
          <div
            className={clsx(classes.tier, isActive && 'active')}
            key={item.label}
            onClick={() => {
              onChange(item.value)
            }}
          >
            <p>{item.value.toNumber() / 100}%</p>
            <span>{item.label}</span>
            <img src="/assets/icons/checked.svg" />
          </div>
        )
      })}
    </div>
  )
}
