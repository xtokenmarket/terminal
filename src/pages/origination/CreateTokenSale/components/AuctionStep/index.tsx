import clsx from 'clsx'
import { ETokenSalePhase } from 'utils/enums'
import { Button, makeStyles } from '@material-ui/core'
import { ICreateTokenSaleData } from 'types'
import { useState } from 'react'
import { WhitelistSaleForm } from '../WhitelistSaleForm.tsx'
import { PublicSaleForm } from '../PublicSaleForm'

const useStyles = makeStyles((theme) => ({
  saleTypeToggle: {
    display: 'flex',
    marginBottom: 46,
  },
  btnInactive: {
    boxShadow: 'none',
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    color: '#fff3',

    '&:hover': {
      color: theme.colors.white,
    },
  },
}))

interface IProps {
  data: ICreateTokenSaleData
  updateData: (_: any) => void
  onNext: () => void
  onBack: () => void
}

export const AuctionStep: React.FC<IProps> = ({
  data,
  updateData,
  onNext,
  onBack,
}) => {
  const [tokenSalePhase, setTokenSalePhase] = useState(
    ETokenSalePhase.Whitelist
  )
  const classes = useStyles()
  const { whitelistSale, publicSale } = data

  const handlePublicSaleSubmit = () => {
    if (!whitelistSale.enabled && !publicSale.enabled) {
      setTokenSalePhase(ETokenSalePhase.Whitelist)
      return
    }

    onNext()
  }

  const handleWhitelistSaleClick = () => {
    if (tokenSalePhase !== ETokenSalePhase.Whitelist) {
      setTokenSalePhase(ETokenSalePhase.Whitelist)
    }
  }

  return (
    <>
      <div className={classes.saleTypeToggle}>
        <Button
          color="primary"
          fullWidth
          variant="contained"
          onClick={handleWhitelistSaleClick}
          className={clsx(
            tokenSalePhase !== ETokenSalePhase.Whitelist && classes.btnInactive
          )}
        >
          Allowlist Program
        </Button>
        <Button
          color="primary"
          fullWidth
          variant="contained"
          disabled={tokenSalePhase !== ETokenSalePhase.Public}
        >
          Public Program
        </Button>
      </div>

      {tokenSalePhase === ETokenSalePhase.Whitelist ? (
        <WhitelistSaleForm
          data={data}
          updateData={updateData}
          onNext={() => setTokenSalePhase(ETokenSalePhase.Public)}
          onBack={onBack}
        />
      ) : (
        <PublicSaleForm
          data={data}
          updateData={updateData}
          onNext={handlePublicSaleSubmit}
          onBack={onBack}
        />
      )}
    </>
  )
}
