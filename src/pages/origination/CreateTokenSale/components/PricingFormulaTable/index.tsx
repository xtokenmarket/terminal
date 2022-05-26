import React from 'react'
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
  tableCell: {
    verticalAlign: 'top',
  },
  rowHeader: {
    color: theme.colors.primary100,
    fontSize: '12px',
    fontWeight: 700,
  },
  bodyRowText: {
    color: 'white',
    fontFamily: 'Gilmer',
    fontSize: 16,
    fontWeight: 700,
    marginTop: 6,
  },
  priceEstimation: {
    color: theme.colors.primary100,
    fontSize: 12,
  },
}))

interface IProps {
  data: ICreateTokenSaleData
}

export const PricingFormulaTable: React.FC<IProps> = ({ data }) => {
  const cl = useStyles()
  const { offerToken, publicSale } = data

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
            <TableCell className={cl.tableCell}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <img src={data.offerToken?.image} style={{ marginRight: 8 }} />
                <div>
                  <Typography className={cl.bodyRowText}>
                    {publicSale.startingPrice}
                  </Typography>
                  {offerToken && (
                    <TokenAmountPriceEstimation
                      className={cl.priceEstimation}
                      token={offerToken}
                      tokenAmount={Number(publicSale.startingPrice)}
                    />
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell className={cl.tableCell}>
              <>
                <Typography className={cl.bodyRowText}>
                  {publicSale.endingPrice}
                </Typography>
                {offerToken && (
                  <TokenAmountPriceEstimation
                    className={cl.priceEstimation}
                    token={offerToken}
                    tokenAmount={Number(publicSale.endingPrice)}
                  />
                )}
              </>
            </TableCell>
            <TableCell className={cl.tableCell}>
              <Typography className={cl.bodyRowText}>
                {data.vestingPeriod} {data.vestingPeriodUnit}
              </Typography>
            </TableCell>
            <TableCell className={cl.tableCell}>
              <Typography className={cl.bodyRowText}>
                {data.cliffPeriod} {data.cliffPeriodUnit}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
