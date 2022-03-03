import React, { useState, useEffect } from 'react'
import {
  makeStyles,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@material-ui/core'
import { useServices } from 'helpers'
import { IRewardState } from 'components'

const useStyles = makeStyles((theme) => ({
  tableContainer: {},
  table: {
    '& th': {
      padding: theme.spacing(1),
      borderColor: theme.colors.primary200,
    },
    '& td': {
      padding: theme.spacing(2, 1),
      borderColor: theme.colors.primary200,
    },
  },
  rowHeader: {
    color: theme.colors.primary100,
    fontSize: '12px',
  },
  bodyRowText: {
    color: 'white',
    fontFamily: 'Gilmer',
    fontWeight: 700,
  },
}))

interface IProps {
  rewardState: IRewardState
}

export const RewardTokensTable: React.FC<IProps> = ({
  rewardState: { tokens, vesting },
}) => {
  const cl = useStyles()
  const { lmService } = useServices()
  const [rewardFeePercent, setRewardFeePercent] = useState(0)

  useEffect(() => {
    ;(async () => {
      const fee = await lmService.getRewardFee()
      setRewardFeePercent(fee.toNumber() / 10000)
    })()
  }, [lmService])

  return (
    <TableContainer>
      <Table className={cl.table}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="h6" className={cl.rowHeader}>
                REWARD TOKENS
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" className={cl.rowHeader}>
                VESTING PERIOD
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tokens.map((token, i) => {
            return (
              <TableRow key={i}>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={token.image} style={{ marginRight: 8 }} />
                    <Typography variant="h3" className={cl.bodyRowText}>
                      {token.symbol}
                    </Typography>
                  </div>
                </TableCell>
                <TableCell>
                  <Typography variant="h5" className={cl.bodyRowText}>
                    {Number(vesting) ? `${vesting} week(s)` : '-'}
                  </Typography>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
