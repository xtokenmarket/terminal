import {
  Select,
  makeStyles,
  MenuItem,
  Grid,
  Typography,
} from '@material-ui/core'
import clsx from 'clsx'
import { Input } from '../Input'
import { QuestionTooltip } from '../QuestionTooltip'

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
    borderRadius: 4,
    position: 'relative',
    border: `1px solid ${theme.colors.primary100}`,
    fontSize: 16,
    padding: '17px 26px 17px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
  },
  inputDisabled: {
    borderRadius: 4,
    borderColor: theme.colors.primary200,
    color: theme.colors.primary200,
    '&::placeholder': {
      /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: theme.colors.primary200,
      /* Firefox */
      opacity: 1,
    },
    '&:-ms-input-placeholder': {
      /* Internet Explorer 10-11 */
      color: theme.colors.primary200,
    },

    '&::-ms-input-placeholder': {
      /* Microsoft Edge */
      color: theme.colors.primary200,
    },
  },
  paper: { backgroundColor: theme.colors.fifth },
  list: {
    backgroundColor: theme.colors.fifth,
    color: theme.colors.white,
  },
  width: {
    width: 150,
  },
  labelContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  label: {
    color: theme.colors.white,
    fontWeight: 700,
  },
  labelDisabled: {
    color: theme.colors.primary200,
  },
  tooltipQuestion: {
    marginLeft: 16,
    marginTop: 2,
  },
  selectIcon: {
    width: 12,
    position: 'absolute',
    right: 16,
  },
}))

interface IProps {
  onSelectorChange: (
    event: React.ChangeEvent<{
      name?: string | undefined
      value: unknown
    }>,
    child: React.ReactNode
  ) => void | undefined
  selectorValue: string
  label?: string
  infoText?: string
  inputValue: string
  disabled?: boolean
  onChangeinput: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Selector: React.FC<IProps> = ({
  onSelectorChange,
  selectorValue,
  label,
  infoText,
  inputValue,
  disabled,
  onChangeinput,
}) => {
  const classes = useStyles()

  return (
    <>
      {label && (
        <div className={classes.labelContainer}>
          <Typography
            className={clsx(classes.label, disabled && classes.labelDisabled)}
          >
            {label}
          </Typography>
          {infoText && (
            <QuestionTooltip
              title={infoText}
              className={classes.tooltipQuestion}
            />
          )}
        </div>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Input
            value={inputValue}
            onChange={onChangeinput}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Select
            placeholder="Weeks"
            className={clsx(classes.root, classes.width)}
            disableUnderline
            classes={{
              root: clsx(classes.input, disabled && classes.inputDisabled),
            }}
            MenuProps={{
              PaperProps: {
                className: classes.paper,
              },
              classes: {
                list: classes.list,
              },
            }}
            IconComponent={() => (
              <img
                alt="down"
                className={classes.selectIcon}
                src="/assets/icons/down-arrow.svg"
              />
            )}
            value={selectorValue}
            onChange={onSelectorChange}
            disabled={disabled}
          >
            {['Days', 'Weeks', 'Months', 'Years'].map((unit) => {
              return (
                <MenuItem className={classes.item} value={unit} key={unit}>
                  {unit}
                </MenuItem>
              )
            })}
          </Select>
        </Grid>
      </Grid>
    </>
  )
}
