import {
  Select,
  makeStyles,
  MenuItem,
  Grid,
  Typography,
} from '@material-ui/core'
import clsx from 'clsx'
import { EOfferingPeriods, EPeriods } from 'utils/enums'
import { Input } from '../Input'
import { QuestionTooltip } from '../QuestionTooltip'

const useStyles = makeStyles((theme) => ({
  item: {
    display: 'flex',
    alignItems: 'center',
    '& img': {
      width: 24,
      height: 24,
      marginRight: 6,
    },
  },
  selectorInput: {
    borderRadius: 4,
    position: 'relative',
    background: 'transparent',
    color: theme.colors.primary100,
    border: `1px solid ${theme.colors.primary100}`,
    fontSize: 16,
    padding: '17px 26px 17px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),

    '&:focus': {
      borderRadius: 4,
    },
  },
  selectorInputDisabled: {
    borderRadius: 4,
    background: 'transparent',
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
  list: {
    backgroundColor: theme.colors.primary400,
    borderRadius: 4,
    color: theme.colors.white,
    fontSize: 14,
    lineHeight: '16.8px',
    '& li.Mui-selected': {
      fontWeight: 700,
      background: 'none',
    },
    '& li.Mui-selected:hover': {
      background: 'none',
    },
    '& li:hover': {
      background: 'none',
    },
  },
  inputField: {
    color: theme.colors.primary100,
    fontWeight: 400,
  },
  labelContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  label: {
    color: theme.colors.white,
    fontWeight: 700,
    fontSize: 14,
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
  onChangeinput: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  saleDisplayName?: string
  id?: string
}

export const Selector: React.FC<IProps> = ({
  onSelectorChange,
  selectorValue,
  label,
  infoText,
  inputValue,
  disabled,
  onChangeinput,
  saleDisplayName,
  id,
}) => {
  const classes = useStyles()
  const Eoptions = saleDisplayName ? EOfferingPeriods : EPeriods

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
      <Grid container justifyContent="space-between" spacing={3}>
        <Grid item xs={12} md={7}>
          <Input
            id={`${id}Input`}
            className={classes.inputField}
            value={inputValue}
            onChange={onChangeinput}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <Select
            id={`${id}Dropdown`}
            fullWidth
            disableUnderline
            placeholder={Eoptions.Weeks}
            classes={{
              root: clsx(
                classes.selectorInput,
                disabled && classes.selectorInputDisabled
              ),
            }}
            MenuProps={{
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
            {Object.values(Eoptions).map((unit, index) => {
              return (
                <MenuItem
                  className={classes.item}
                  value={unit}
                  key={unit}
                  id={`${id}Dropdown-${index}`}
                >
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
