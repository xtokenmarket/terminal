import { ICreateTokenSaleData, SaleData } from 'types'
import { validPricingDetailsSet } from '../WhitelistSaleForm.tsx'
import { SaleForm } from '../SaleForm'
import { ETokenSalePhase } from 'utils/enums'

interface IProps {
  data: ICreateTokenSaleData
  updateData: (_: any) => void
  onNext: () => void
  onBack: () => void
}

export const PublicSaleForm: React.FC<IProps> = ({
  data,
  updateData,
  onNext,
  onBack,
}) => {
  const { publicSale, whitelistSale } = data
  const {
    pricingFormula,
    startingPrice,
    endingPrice,
    offeringPeriod,
    offeringPeriodUnit,
  } = publicSale

  const isInvalidSale = !whitelistSale.enabled && !publicSale.enabled

  const isNextBtnDisabled =
    isInvalidSale ||
    (!!publicSale.enabled &&
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
        ) &&
        Number(startingPrice) > 0 &&
        Number(endingPrice) > 0 &&
        Number(offeringPeriod) > 0
      ))

  return (
    <SaleForm
      error={
        isInvalidSale && publicSale.enabled !== null
          ? 'Please select either Allowlist or Public sale to proceed further'
          : ''
      }
      offerToken={data.offerToken}
      onBack={onBack}
      onSubmit={onNext}
      purchaseToken={data.purchaseToken}
      saleData={data.publicSale}
      submitDisabled={isNextBtnDisabled}
      tokenSalePhase={ETokenSalePhase.Public}
      updateSaleData={(data: Partial<SaleData>) =>
        updateData({ publicSale: { ...publicSale, ...data } })
      }
    />
  )
}
