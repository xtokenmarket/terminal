import { Select, makeStyles, MenuItem, Grid } from '@material-ui/core'
import clsx from 'clsx'
import { Input } from '../Input'

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
  paper: { backgroundColor: theme.colors.fifth },
  list: {
    backgroundColor: theme.colors.fifth,
    color: theme.colors.white,
  },
  width: {
    width: 150,
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
  inputValue: string
  onChangeinput: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Selector: React.FC<IProps> = ({
  onSelectorChange,
  selectorValue,
  inputValue,
  onChangeinput,
}) => {
  const classes = useStyles()

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Input value={inputValue} onChange={onChangeinput} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Select
          placeholder="Weeks"
          className={clsx(classes.root, classes.width)}
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
          value={selectorValue}
          onChange={onSelectorChange}
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
  )
}
