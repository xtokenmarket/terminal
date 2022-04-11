import { Checkbox, makeStyles, Typography } from '@material-ui/core'
import { useState } from 'react'

const useStyles = makeStyles((theme) => ({
  label: {
    color: theme.colors.white,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
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
            style={{
              color: '#6E27E4',
            }}
            checked={value === item}
            color="secondary"
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
