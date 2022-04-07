import { ICreateTokenSaleData } from 'types'

interface IProps {
  data: ICreateTokenSaleData
  updateData: (_: any) => void
  onEdit: () => void
}

export const ConfirmStep: React.FC<IProps> = ({ data, updateData, onEdit }) => {
  return <>ConfirmStep</>
}
