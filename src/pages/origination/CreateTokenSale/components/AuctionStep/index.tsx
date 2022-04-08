import { makeStyles, Typography } from '@material-ui/core'
import { ICreateTokenSaleData } from 'types'
import { IpricingFormula } from 'utils/enums'
import { Radio } from '../Radio'

const useStyles = makeStyles((theme) => ({
  label: {
    color: theme.colors.white,
    marginBottom: theme.spacing(2),
  },
}))

interface IProps {
  data: ICreateTokenSaleData
  updateData: (_: any) => void
  onNext: () => void
}

export const AuctionStep: React.FC<IProps> = ({ data, updateData, onNext }) => {
  const classes = useStyles()

  return (
    <>
      <Typography className={classes.label}>
        Choose the Pricing formula for this offering
      </Typography>
      <Radio
        items={Object.values(IpricingFormula)}
        onChange={(event) => {
          updateData({ pricingFormula: event.target.value })
        }}
      />
    </>
  )
}
