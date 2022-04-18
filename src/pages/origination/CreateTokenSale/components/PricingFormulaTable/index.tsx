import React from 'react'
import clsx from 'clsx'
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
import { ICreateTokenSaleData } from 'types'
import { TokenAmountPriceEstimation } from '../TokenAmountPriceEstimation'

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
    fontWeight: 700,
  },
  bodyRowText: {
    color: 'white',
    fontFamily: 'Gilmer',
    fontWeight: 700,
  },
  priceEstimation: {
    color: theme.colors.primary100,
    fontSize: 12,
  },
  endingPriceEstimation: {
    marginTop: 4,
  },
}))

interface IProps {
  data: ICreateTokenSaleData
}

export const PricingFormulaTable: React.FC<IProps> = ({ data }) => {
  const cl = useStyles()
  const { offerToken } = data

  return (
    <TableContainer>
      <Table className={cl.table}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="h6" className={cl.rowHeader}>
                STARTING PRICE
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" className={cl.rowHeader}>
                ENDING PRICE
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" className={cl.rowHeader}>
                VESTING PERIOD
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" className={cl.rowHeader}>
                CLIFF PERIOD
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={data.offerToken?.image} style={{ marginRight: 8 }} />
                <div>
                  <Typography variant="h3" className={cl.bodyRowText}>
                    {data.startingPrice}
                  </Typography>
                  {offerToken && (
                    <TokenAmountPriceEstimation
                      className={cl.priceEstimation}
                      token={offerToken}
                      tokenAmount={Number(data.startingPrice)}
                    />
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <Typography variant="h5" className={cl.bodyRowText}>
                  {data.endingPrice}
                </Typography>
                {offerToken && (
                  <TokenAmountPriceEstimation
                    className={clsx(
                      cl.priceEstimation,
                      cl.endingPriceEstimation
                    )}
                    token={offerToken}
                    tokenAmount={Number(data.endingPrice)}
                  />
                )}
              </div>
            </TableCell>
            <TableCell>
              <Typography variant="h5" className={cl.bodyRowText}>
                {data.vestingPeriod} {data.vestingPeriodUnit}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h5" className={cl.bodyRowText}>
                {data.cliffPeriod} {data.cliffPeriodUnit}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
