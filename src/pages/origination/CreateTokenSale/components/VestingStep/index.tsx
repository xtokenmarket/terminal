import { ICreateTokenSaleData } from 'types'

interface IProps {
  data: ICreateTokenSaleData
  updateData: (_: any) => void
  onNext: () => void
}

export const VestingStep: React.FC<IProps> = ({ data, updateData, onNext }) => {
  return <>VestingStep</>
}
