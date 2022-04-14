import { Checkbox, makeStyles, Typography } from '@material-ui/core'
import { useState } from 'react'
import { QuestionTooltip } from '../QuestionTooltip'

const useStyles = makeStyles((theme) => ({
  label: {
    color: theme.colors.white,
    cursor: 'pointer',
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
  tooltipQuestion: {
    marginLeft: 10,
  },
}))

interface IProps {
  items: string[]
  onChange: (value: string, checked?: boolean) => void
  className?: string
  infoText?: string[]
}

export const Radio: React.FC<IProps> = ({
  items,
  onChange,
  className,
  infoText,
}) => {
  const [value, setValue] = useState('')
  const classes = useStyles()

  const handleItemSelected = (item: string) => {
    onChange(item)
    setValue(item)
  }

  return (
    <div className={className}>
      {items.map((item: string, index) => (
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleItemSelected(e.target.value)
            }
            disableRipple
            value={item}
          />
          <Typography
            className={classes.label}
            onClick={() => handleItemSelected(item)}
          >
            {item}
          </Typography>
          {infoText && (
            <QuestionTooltip
              title={infoText[index]}
              className={classes.tooltipQuestion}
            />
          )}
        </div>
      ))}
    </div>
  )
}
