import { ETokenSalePhase } from 'utils/enums'
import { Button, makeStyles } from '@material-ui/core'
import { ICreateTokenSaleData } from 'types'
import { useState } from 'react'
import { WhitelistPhaseForm } from '../WhitelistPhaseForm.tsx'
import { PublicSaleForm } from '../PublicSalePhaseForm'

const useStyles = makeStyles(() => ({
  saleTypeToggle: {
    display: 'flex',
    marginBottom: 46,
  },
}))

interface IProps {
  data: ICreateTokenSaleData
  updateData: (_: any) => void
  onNext: () => void
}

export const AuctionStep: React.FC<IProps> = ({ data, updateData, onNext }) => {
  const [tokenSalePhase, setTokenSalePhase] = useState(
    ETokenSalePhase.Whitelist
  )
  const classes = useStyles()

  return (
    <>
      <div className={classes.saleTypeToggle}>
        <Button
          color="primary"
          fullWidth
          variant="contained"
          disabled={tokenSalePhase !== ETokenSalePhase.Whitelist}
        >
          Whitelist Sale
        </Button>
        <Button
          color="primary"
          fullWidth
          variant="contained"
          disabled={tokenSalePhase !== ETokenSalePhase.Public}
        >
          Public Sale
        </Button>
      </div>

      {tokenSalePhase === ETokenSalePhase.Whitelist ? (
        <WhitelistPhaseForm
          tokenSalePhase={tokenSalePhase}
          data={data}
          updateData={updateData}
          onNext={() => setTokenSalePhase(ETokenSalePhase.Public)}
        />
      ) : (
        <PublicSaleForm
          tokenSalePhase={tokenSalePhase}
          data={data}
          updateData={updateData}
          onNext={onNext}
        />
      )}
    </>
  )
}
