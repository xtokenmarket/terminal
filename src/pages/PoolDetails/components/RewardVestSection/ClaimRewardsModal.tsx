import React, { useState } from 'react'
import { Modal, makeStyles, Typography, IconButton, Button, CircularProgress } from '@material-ui/core'
import CloseOutlined from '@material-ui/icons/CloseOutlined'
import { EarnedInfo } from 'types'
import { formatEther } from 'ethers/lib/utils'
import { ViewTransaction, WarningInfo } from 'components/Modal/RewardModal/components'
import { useConnectedWeb3Context } from 'contexts'
import { CLRService } from 'services'
import { ZERO } from 'utils/number'

const ICON_SIZE = 150

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    position: 'relative',
    backgroundColor: theme.colors.primary500,
    outline: 'none',
    userSelect: 'none',
    overflowY: 'visible',
    padding: theme.spacing(3, 0),
    maxHeight: '80vh',
    width: '70vw',
    maxWidth: 600,
    [theme.breakpoints.down('xs')]: {
      width: '90vw',
    },
  },
  title: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(0, 3),
    color: theme.colors.white,
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px',
      marginBottom: theme.spacing(2),
      padding: theme.spacing(0, 2),
    }
  },
  subheader: {
    color: theme.colors.primary100,
    fontWeight: 700,
    fontSize: '12px',
    marginBottom: theme.spacing(1),
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: theme.colors.white1,
  },
  tokens: {
    backgroundColor: theme.colors.primary400,
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    }
  },
  token: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    marginRight: theme.spacing(2),
  },
  amount: {
    color: theme.colors.white,
  },
  dollarAmount: {
    color: theme.colors.primary100,
    marginLeft: theme.spacing(2),
  },
  warning: {
    margin: theme.spacing(2),
  },
  bottomContent: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
  img: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    position: 'absolute',
    top: -ICON_SIZE / 2,
    left: `calc(50% - ${ICON_SIZE / 2}px)`,
  },
  successHeader: {
    paddingTop: theme.spacing(6),
    color: theme.colors.white,
    marginBottom: theme.spacing(2),
  },
}))

enum ClaimState {
  None,
  Claiming,
  Claimed,
}

interface IProps {
  open: boolean
  onClose: () => void
  earnedInfo: EarnedInfo
  poolAddress: string
}

export const ClaimRewardsModal: React.FC<IProps> = ({
  open,
  onClose,
  earnedInfo,
  poolAddress,
}) => {
  const cl = useStyles()
  const { account, library: provider } = useConnectedWeb3Context()

  const [claimState, setClaimState] = useState<ClaimState>(ClaimState.None)
  const [claimTx, setClaimTx] = useState('')
  const [claimedTokens, setClaimedTokens] = useState<EarnedInfo>([])

  const tokensToRender = claimState === ClaimState.Claimed ? claimedTokens : earnedInfo

  const _onClose = () => {
    if (claimState === ClaimState.Claimed) {
      setClaimTx('')
      setClaimedTokens([])
      setClaimState(ClaimState.None)
    }
    onClose()
  }

  const onClickClaim = async () => {
    if (!provider || !account) return

    const clr = new CLRService(provider, account, poolAddress)
    const txId = await clr.claimReward()
    setClaimState(ClaimState.Claiming)
    
    const finalTxId = await clr.waitUntilClaimReward(account, txId)
    const claimInfo = await clr.parseClaimTx(finalTxId)
    const claimedTokens = earnedInfo.map(token => ({
      ...token,
      amount: claimInfo[token.address.toLowerCase()] || ZERO
    }))

    setClaimState(ClaimState.Claimed)
    setClaimTx(finalTxId)
    setClaimedTokens(claimedTokens)
  }

  const renderTopContent = () => {
    if (claimState === ClaimState.Claimed) {
      return (
        <>
          <img
            alt="check"
            src="/assets/icons/confirmed.png"
            className={cl.img}
          />
          <Typography variant="h2" className={cl.successHeader} align="center">
            Rewards claimed successfully!
          </Typography>
        </>
      )
    }

    return (
      <Typography className={cl.title} variant="h4">
        Claim rewards
      </Typography>
    )
  }

  const renderBottomContent = () => {
    if (claimState === ClaimState.Claimed) {
      return (
        <div className={cl.bottomContent}>
          <ViewTransaction txId={claimTx} />
        </div>
      )
    }
    const buttonContent = {
      [ClaimState.None]: 'Claim',
      [ClaimState.Claiming]: (
        <CircularProgress style={{color: 'white'}} size={30} />
      ),
    }[claimState]

    return (
      <div className={cl.bottomContent}>
        <Button
          fullWidth
          color="primary"
          variant="contained"
          disabled={claimState !== ClaimState.None}
          onClick={onClickClaim}
        >
        {buttonContent}
        </Button>
      </div>
    )
  }
  return (
    <Modal open={open} onClose={_onClose} className={cl.modal}>
      <div className={cl.content}>
        <IconButton className={cl.closeButton} onClick={_onClose}>
          <CloseOutlined />
        </IconButton>

        {renderTopContent()}
        <div className={cl.tokens}>
          <Typography variant="subtitle2" className={cl.subheader}>
            {claimState === ClaimState.Claimed ? 'YOU CLAIMED' : 'AVAILABLE TO CLAIM'}
          </Typography>
          {tokensToRender.map((token, i) => {
            return (
              <div className={cl.token} key={i}>
                <img src={token.image} className={cl.logo} />
                <Typography variant="h2" className={cl.amount}>
                  {Number(formatEther(token.amount)).toFixed(4)}
                </Typography>
                {/* <Typography variant="h5" className={cl.dollarAmount}>
                  ~ $ TODO
                </Typography> */}
              </div>
            )
          })}
        </div>
        {claimState === ClaimState.Claiming && (
          <WarningInfo
            className={cl.warning}
            title="Warning"
            description="Please don't close this window until the process is complete"
          />
        )}
        {renderBottomContent()}
      </div>
    </Modal>
  )
}