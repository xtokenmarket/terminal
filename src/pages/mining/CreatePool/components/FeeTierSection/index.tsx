import { BigNumber } from '@ethersproject/bignumber'
import { Grid, makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { transparentize } from 'polished'
import { FEE_TIERS } from 'config/constants'
import { parseFee } from 'utils'

const useStyles = makeStyles((theme) => ({
  tierInner: {
    '&:hover:not(.active)': {
      opacity: 0.7,
    },
    display: 'flex',
    flexDirection: 'column',
    border: `1px solid ${theme.colors.primary200}`,
    borderRadius: 4,
    padding: theme.spacing(2),

    position: 'relative',
    transition: 'all 0.4s',
    backgroundColor: theme.colors.transparent,
    cursor: 'pointer',
    '&.active': {
      borderColor: theme.colors.secondary,
      backgroundColor: transparentize(0.85, theme.colors.secondary),
      color: theme.colors.white,
    },
  },
  checkIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
    opacity: 0,
    transition: 'all 0.4s',
    '&.active': {
      opacity: 1,
    },
  },
  percent: {
    color: theme.colors.primary100,
    fontSize: 22,
    fontWeight: 600,
    transition: 'all 0.4s',
    '&.active': {
      color: theme.colors.white,
    },
  },
  label: {
    color: theme.colors.primary100,
    fontSize: 14,
    fontWeight: 600,
    transition: 'all 0.4s',
    '&.active': {
      color: theme.colors.white,
    },
  },
}))

interface IProps {
  tier: BigNumber
  onChange: (_: BigNumber) => void
  className?: string
}

export const FeeTierSection: React.FC<IProps> = ({
  className,
  tier,
  onChange,
}) => {
  const cl = useStyles()

  return (
    <Grid container spacing={3}>
      {FEE_TIERS.map(({ value, label }) => {
        const active = value.eq(tier)
        return (
          <Grid item xs={12} sm={6} key={label} onClick={() => onChange(value)}>
            <div className={clsx(cl.tierInner, { active })}>
              <Typography className={clsx(cl.percent, { active })}>
                {parseFee(value)}%
              </Typography>
              <Typography className={clsx(cl.label, { active })}>
                {label}
              </Typography>
              <img
                src="/assets/icons/checked.svg"
                className={clsx(cl.checkIcon, { active })}
              />
            </div>
          </Grid>
        )
      })}
    </Grid>
  )
}
