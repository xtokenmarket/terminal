import { Checkbox, makeStyles, Typography } from '@material-ui/core'
import { useState } from 'react'

const useStyles = makeStyles((theme) => ({
  label: {
    color: theme.colors.white,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    '&:not(:last-of-type)': {
      marginBottom: theme.spacing(2),
    },
  },
  checkboxIcon: {
    position: 'absolute',
    left: 0,
    width: 16,
    height: 16,
  },
  checkboxRoot: {
    marginRight: 8,
  },
}))

interface IProps {
  items: string[]
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked?: boolean
  ) => void
  className?: string
}

export const Radio: React.FC<IProps> = ({ items, onChange, className }) => {
  const [value, setValue] = useState('')
  const classes = useStyles()

  return (
    <div className={className}>
      {items.map((item: string) => (
        <div key={item} className={classes.item}>
          <Checkbox
            checked={value === item}
            color="secondary"
            classes={{
              root: classes.checkboxRoot,
            }}
            icon={
              <img
                src="/assets/icons/unchecked.svg"
                className={classes.checkboxIcon}
              />
            }
            checkedIcon={
              <img
                src="/assets/icons/checked-white.svg"
                className={classes.checkboxIcon}
              />
            }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onChange(e)
              setValue(item)
            }}
            disableRipple
            value={item}
          />
          <Typography className={classes.label}>{item}</Typography>
        </div>
      ))}
    </div>
  )
}
