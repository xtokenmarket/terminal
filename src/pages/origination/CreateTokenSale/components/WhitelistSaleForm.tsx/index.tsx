import { EPricingFormula, ETokenSalePhase } from 'utils/enums'
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
  onBack: () => void
}

export const WhitelistSaleForm: React.FC<IProps> = ({
  data,
  updateData,
  onNext,
  onBack,
}) => {
  const { whitelistSale } = data
  const {
    pricingFormula,
    startingPrice,
    endingPrice,
    offeringPeriod,
    offeringPeriodUnit,
  } = whitelistSale

  const isPricingValid =
    pricingFormula &&
    validPricingDetailsSet(
      pricingFormula,
      Number(startingPrice),
      Number(endingPrice)
    )

  const isNextBtnDisabled =
    (whitelistSale.enabled === undefined || !!whitelistSale.enabled) &&
    !(
      startingPrice &&
      endingPrice &&
      offeringPeriod &&
      offeringPeriodUnit &&
      isPricingValid &&
      Number(startingPrice) > 0 &&
      Number(endingPrice) > 0 &&
      Number(offeringPeriod) > 0
    )

  return (
    <SaleForm
      tokenSalePhase={ETokenSalePhase.Whitelist}
      purchaseToken={data.purchaseToken}
      offerToken={data.offerToken}
      saleData={data.whitelistSale}
      updateSaleData={(data: Partial<SaleData>) =>
        updateData({ whitelistSale: { ...whitelistSale, ...data } })
      }
      onSubmit={onNext}
      submitDisabled={isNextBtnDisabled}
      onBack={onBack}
    />
  )
}
