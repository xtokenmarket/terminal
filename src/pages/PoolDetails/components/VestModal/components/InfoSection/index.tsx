import { BigNumber } from '@ethersproject/bignumber'
import { Button, IconButton, makeStyles, Typography } from '@material-ui/core'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import Abi from 'abis'
import { getContractAddress } from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { useIsMountedRef, useServices } from 'helpers'
import { IVestState } from 'pages/PoolDetails/components'
import { useEffect } from 'react'
import { ERC20Service } from 'services'
import { ITerminalPool } from 'types'
import { OutputEstimation } from '..'

const useStyles = makeStyles((theme) => ({
  root: { backgroundColor: theme.colors.primary500 },
  header: {
    padding: 32,
    position: 'relative',
    paddingBottom: 16,
  },
  title: {
    color: theme.colors.white,
    fontWeight: 600,
    fontSize: 22,
    marginBottom: 24,
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 12,
    color: theme.colors.white1,
  },

  actions: {
    padding: 32,
  },

  deposit: { marginTop: 32 },
  buy: { marginTop: 8 },
}))

interface IProps {
  onNext: () => void
  onClose: () => void
  vestState: IVestState
  updateState: (e: any) => void
  poolData: ITerminalPool
}

let timerId: any

export const InfoSection: React.FC<IProps> = ({
  onNext,
  onClose,
  vestState,
  updateState,
  poolData,
}) => {
  const cl = useStyles()
  const { account, library: provider, networkId } = useConnectedWeb3Context()
  const isMountedRef = useIsMountedRef()
  const { multicall } = useServices()

  const loadBasicInfo = async () => {
    if (!account || !provider) {
      return
    }
    try {
      const stakingToken = new ERC20Service(
        provider,
        account,
        poolData.stakedToken.address
      )

      const userLP = await stakingToken.getBalanceOf(account)

      const earnedCall = poolData.rewardState.tokens.map((rewardToken) => ({
        name: 'earned',
        address: poolData.address,
        params: [account, rewardToken.address],
      }))

      const earned = await multicall.multicallv2(Abi.CLRV0, earnedCall, {
        requireSuccess: false,
      })

      const escrowAddress = getContractAddress('rewardEscrow', networkId)

      const numVestingEntriesCalls = poolData.rewardState.tokens.map(
        (rewardToken) => ({
          name: 'numVestingEntries',
          address: escrowAddress,
          params: [poolData.address, rewardToken.address, account],
        })
      )
      const numVestingEntriesResponse = await multicall.multicallv2(
        Abi.RewardEscrow,
        numVestingEntriesCalls,
        { requireSuccess: false }
      )

      const vestings: { amount: BigNumber; timestamp: BigNumber }[][] = []

      for (let index = 0; index < numVestingEntriesResponse.length; index++) {
        const vestingCount = numVestingEntriesResponse[index][0].toNumber()
        const subCalls = []
        const rewardToken = poolData.rewardState.tokens[index]

        for (let i = 0; i < vestingCount; i++) {
          subCalls.push({
            name: 'getVestingScheduleEntry',
            address: escrowAddress,
            params: [poolData.address, rewardToken.address, account, i],
          })
        }

        const entryResponse = await multicall.multicallv2(
          Abi.RewardEscrow,
          subCalls,
          { requireSuccess: false }
        )

        const info: { amount: BigNumber; timestamp: BigNumber }[] = []
        entryResponse.forEach((element: any) => {
          info.push({ amount: element[0], timestamp: element[1] })
        })

        vestings.push(info)
      }

      if (isMountedRef.current === true) {
        updateState({
          userLP,
          earned: earned.map((res: any) => res[0]),
          vestings,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadBasicInfo()
  }, [])

  const disabled = vestState.earned.some((el) => el.isZero())

  return (
    <div className={cl.root}>
      <div className={cl.header}>
        <Typography className={cl.title}>Vest tokens</Typography>
        <IconButton className={cl.closeButton} onClick={onClose}>
          <CloseOutlinedIcon />
        </IconButton>
      </div>
      <OutputEstimation poolData={poolData} earned={vestState.earned} />
      <div className={cl.actions}>
        <Button
          color="primary"
          variant="contained"
          fullWidth
          disabled={disabled}
          className={cl.deposit}
          onClick={() => {
            updateState({ withdrawOnly: false })
            onNext()
          }}
        >
          VEST
        </Button>
      </div>
    </div>
  )
}
