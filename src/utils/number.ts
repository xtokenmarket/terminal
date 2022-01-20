import { BigNumber } from 'ethers'
import { parseEther } from 'ethers/lib/utils'

export const ONE_ETHER = parseEther('1')
export const ONE_WEEK_IN_TIME = 7 * 24 * 3600
export const ZERO = BigNumber.from(0)

export const parseDuration = (duration: string) =>
  Number(duration) * ONE_WEEK_IN_TIME
