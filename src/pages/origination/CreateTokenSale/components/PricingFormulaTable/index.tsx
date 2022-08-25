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
import { IToken, SaleData } from 'types'
import { TokenAmountPriceEstimation } from '../TokenAmountPriceEstimation'
import { EPricingFormula } from 'utils/enums'
import clsx from 'clsx'
import { getDurationSec, parseDurationSec } from 'utils'

const useStyles = makeStyles((theme) => ({
  tableContainer: {},
  table: {
    '& th': {
      padding: theme.spacing(1),
      paddingTop: 0,
      paddingLeft: 0,
      borderColor: theme.colors.primary200,
    },
    '& td': {
      padding: '16px 8px 24px 0px',
      borderColor: theme.colors.primary200,
    },
  },
  tableCell: {
    verticalAlign: 'top',
    padding: 0,
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
  },
  priceEstimation: {
    color: theme.colors.primary100,
    fontSize: 12,
  },
  tableCellPrice: {
    width: '30%',
  },
}))

interface IProps {
  offerToken: IToken
  saleData: SaleData
  purchaseToken: IToken
}

export const PricingFormulaTable: React.FC<IProps> = ({
  saleData,
  offerToken,
  purchaseToken,
}) => {
  const cl = useStyles()

  return (
    <TableContainer>
      <Table className={cl.table}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="h6" className={cl.rowHeader}>
                Pricing Formula
              </Typography>
            </TableCell>
            {saleData.pricingFormula === EPricingFormula.Standard ? (
              <TableCell className={cl.tableCellPrice}>
                <Typography variant="h6" className={cl.rowHeader}>
                  Price per {offerToken.symbol}
                </Typography>
              </TableCell>
            ) : (
              <>
                <TableCell>
                  <Typography variant="h6" className={cl.rowHeader}>
                    Starting Price
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" className={cl.rowHeader}>
                    Ending Price
                  </Typography>
                </TableCell>
              </>
            )}
            <TableCell>
              <Typography variant="h6" className={cl.rowHeader}>
                Sale Period
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell className={cl.tableCell}>
              <Typography className={cl.bodyRowText}>
                {saleData.pricingFormula}
              </Typography>
            </TableCell>
            {saleData.pricingFormula === EPricingFormula.Standard ? (
              <TableCell className={cl.tableCell}>
                <>
                  <Typography className={cl.bodyRowText}>
                    {saleData.startingPrice} {purchaseToken.symbol}
                  </Typography>
                  {offerToken && (
                    <TokenAmountPriceEstimation
                      className={cl.priceEstimation}
                      token={offerToken}
                      tokenAmount={Number(saleData.startingPrice)}
                    />
                  )}
                </>
              </TableCell>
            ) : (
              <>
                <TableCell className={cl.tableCell}>
                  <>
                    <Typography className={cl.bodyRowText}>
                      {saleData.startingPrice} {purchaseToken.symbol}
                    </Typography>
                    {offerToken && (
                      <TokenAmountPriceEstimation
                        className={cl.priceEstimation}
                        token={offerToken}
                        tokenAmount={Number(saleData.startingPrice)}
                      />
                    )}
                  </>
                </TableCell>
                <TableCell className={cl.tableCell}>
                  <>
                    <Typography className={cl.bodyRowText}>
                      {saleData.endingPrice} {purchaseToken.symbol}
                    </Typography>
                    {offerToken && (
                      <TokenAmountPriceEstimation
                        className={cl.priceEstimation}
                        token={offerToken}
                        tokenAmount={Number(saleData.endingPrice)}
                      />
                    )}
                  </>
                </TableCell>
              </>
            )}
            <TableCell className={cl.tableCell}>
              <Typography className={cl.bodyRowText}>
                {parseDurationSec(
                  getDurationSec(
                    Number(saleData.offeringPeriod),
                    saleData.offeringPeriodUnit.toString()
                  ).toNumber()
                )}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
