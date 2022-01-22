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
import { BigNumber } from 'ethers'
import { IToken } from 'types'
import { formatEther } from 'ethers/lib/utils'
import { useServices } from 'helpers'

const useStyles = makeStyles(theme => ({
  tableContainer: {

  },
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
  }
}))

interface IProps {
  tokens: IToken[]
  amounts: BigNumber[]
  period: string
}

export const RewardTokensTable: React.FC<IProps> = ({
  tokens,
  amounts,
  period,
}) => {
  const cl = useStyles()
  const { lmService } = useServices()
  const [rewardFeePercent, setRewardFeePercent] = useState(0)
  useEffect(() => {
    (async () => {
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
                REWARDS AMOUNT
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" className={cl.rowHeader}>
                TOTAL REWARDS
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" className={cl.rowHeader}>
                REWARDS PERIOD
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tokens.map((token, i) => {
            const amount = formatEther(amounts[i])
            return (
              <TableRow>
                <TableCell style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={token.image} style={{ marginRight: 8 }} />
                  <Typography variant="h3" className={cl.bodyRowText}>
                    {amount}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h5" className={cl.bodyRowText}>
                    {(Number(amount) * (1 + rewardFeePercent)).toFixed(4)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h5" className={cl.bodyRowText}>
                    {`${period} ${(period === '1' ? 'week' : 'weeks')}`}
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