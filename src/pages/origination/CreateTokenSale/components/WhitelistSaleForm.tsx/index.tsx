import { EPricingFormula } from 'utils/enums'
import { ICreateTokenSaleData, SaleData } from 'types'
import { SaleForm } from '../SaleForm'

export const validPricingDetailsSet = (
  pricingFormula: EPricingFormula,
  startingPrice: number,
  endingPrice: number
) => {
  switch (pricingFormula) {
    case EPricingFormula.Ascending:
      return startingPrice < endingPrice
    case EPricingFormula.Descending:
      return startingPrice > endingPrice
    case EPricingFormula.Standard:
      return startingPrice === endingPrice
    default:
      return false
  }
}

interface IProps {
  data: ICreateTokenSaleData
  updateData: (_: any) => void
  onNext: () => void
}

export const WhitelistSaleForm: React.FC<IProps> = ({
  data,
  updateData,
  onNext,
}) => {
  const { whitelistSale } = data
  const {
    pricingFormula,
    startingPrice,
    endingPrice,
    offeringPeriod,
    offeringPeriodUnit,
  } = whitelistSale
  const isNextBtnDisabled =
    (whitelistSale.enabled == undefined || !!whitelistSale.enabled) &&
    !(
      pricingFormula &&
      startingPrice &&
      endingPrice &&
      offeringPeriod &&
      offeringPeriodUnit &&
      validPricingDetailsSet(
        pricingFormula,
        Number(startingPrice),
        Number(endingPrice)
      )
    )

  return (
    <SaleForm
      purchaseToken={data.purchaseToken}
      offerToken={data.offerToken}
      saleData={data.whitelistSale}
      updateSaleData={(data: Partial<SaleData>) =>
        updateData({ whitelistSale: { ...whitelistSale, ...data } })
      }
      onSubmit={onNext}
      submitDisabled={isNextBtnDisabled}
    />
  )
}
