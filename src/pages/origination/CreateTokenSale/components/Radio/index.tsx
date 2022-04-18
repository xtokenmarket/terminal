import { Checkbox, makeStyles, Typography } from '@material-ui/core'
import { useState } from 'react'
import { QuestionTooltip } from '../QuestionTooltip'

const useStyles = makeStyles((theme) => ({
  label: {
    color: theme.colors.white,
    fontSize: 14,
    lineHeight: '16.8px',
    marginBottom: theme.spacing(2),
  },
  itemText: {
    color: theme.colors.white,
    cursor: 'pointer',
    fontSize: 14,
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
  selectedItem?: string
  label?: string
  onChange: (value: string, checked?: boolean) => void
  className?: string
  infoText?: string[]
}

export const Radio: React.FC<IProps> = ({
  items,
  selectedItem = '',
  label,
  onChange,
  className,
  infoText,
}) => {
  const [value, setValue] = useState(selectedItem)
  const classes = useStyles()

  const handleItemSelected = (item: string) => {
    onChange(item)
    setValue(item)
  }

  return (
    <div className={className}>
      {label && <Typography className={classes.label}>{label}</Typography>}
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
            value={item}
            disableRipple
          />
          <Typography
            className={classes.itemText}
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
