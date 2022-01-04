import { Button, makeStyles, Typography } from '@material-ui/core'
import { ITerminalPool } from 'types'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 24,
    backgroundColor: theme.colors.seventh,
    padding: '16px 24px',
    borderRadius: 4,
  },
  title: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 16,
  },
  content: {},
  tableWrapper: {
    '& table': {
      width: '100%',
      borderCollapse: 'collapse',
      '& th': {
        color: theme.colors.purple0,
        fontSize: 11,
        padding: '8px 0',
        textAlign: 'right',
        '&:first-child': { textAlign: 'left' },
        [theme.breakpoints.down('xs')]: {
          '&:nth-child(3)': {
            display: 'none',
          },
        },
        '&+&': {
          paddingLeft: 4,
        },
      },
      '& td': {
        padding: '11px 0',
        color: theme.colors.white,
        fontSize: 14,
        borderTop: `1px solid ${theme.colors.primary200}`,
        textAlign: 'right',
        '&:first-child': { textAlign: 'left' },
        '& span': {
          fontWeight: 700,
        },
        [theme.breakpoints.down('xs')]: {
          '&:nth-child(3)': {
            display: 'none',
          },
        },
        '&+&': {
          paddingLeft: 4,
        },
      },
    },
  },
  button: {
    marginTop: 12,
    height: 40,
  },
}))

const MOCK = [
  { action: 'Deposit', value: '34.4002', time: '11 mins ago', txId: '123' },
  { action: 'Deposit', value: '34.4002', time: '11 mins ago', txId: '234' },
  { action: 'Deposit', value: '34.4002', time: '11 mins ago', txId: '1234' },
  { action: 'Deposit', value: '34.4002', time: '11 mins ago', txId: '253' },
  { action: 'Deposit', value: '34.4002', time: '11 mins ago', txId: '222' },
]

interface IProps {
  pool: ITerminalPool
}

export const HistorySection = (props: IProps) => {
  const classes = useStyles()
  const { pool } = props

  return (
    <div className={classes.root}>
      <Typography className={classes.title}>History</Typography>
      <div className={classes.content}>
        <div className={classes.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>ACTION</th>
                <th>VALUE</th>
                <th>TIME</th>
                <th>TX</th>
              </tr>
            </thead>
            <tbody>
              {MOCK.map((item) => (
                <tr key={item.txId}>
                  <td>{item.action}</td>
                  <td>
                    <span>{item.value}</span>&nbsp;{pool.token0.symbol}/
                    {pool.token1.symbol} LP
                  </td>
                  <td>{item.time}</td>
                  <td>
                    <a href={item.txId}>
                      <img alt="alt" src="/assets/icons/expand.png" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button
          className={classes.button}
          color="secondary"
          fullWidth
          variant="contained"
        >
          Full History
        </Button>
      </div>
    </div>
  )
}
