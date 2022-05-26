import { ICreateTokenSaleData, SaleData } from 'types'
import { validPricingDetailsSet } from '../WhitelistSaleForm.tsx'
import { SaleForm } from '../SaleForm'

interface IProps {
  data: ICreateTokenSaleData
  updateData: (_: any) => void
  onNext: () => void
}

export const PublicSaleForm: React.FC<IProps> = ({
  data,
  updateData,
  onNext,
}) => {
  const { publicSale, whitelistSale } = data
  const { pricingFormula, startingPrice, endingPrice } = publicSale
  const isNextBtnDisabled =
    (!whitelistSale.enabled && !publicSale.enabled) ||
    (!!publicSale.enabled &&
      !(
        pricingFormula &&
        startingPrice &&
        endingPrice &&
        validPricingDetailsSet(
          pricingFormula,
          Number(startingPrice),
          Number(endingPrice)
        )
      ))

  return (
    <SaleForm
      purchaseToken={data.purchaseToken}
      offerToken={data.offerToken}
      saleData={data.publicSale}
      updateSaleData={(data: Partial<SaleData>) =>
        updateData({ publicSale: { ...publicSale, ...data } })
      }
      onSubmit={onNext}
      submitDisabled={isNextBtnDisabled}
    />
  )
}
