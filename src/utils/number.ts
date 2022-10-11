import { BigNumber } from 'ethers'
import { parseEther } from 'ethers/lib/utils'

export const ONE_ETHER = parseEther('1')
export const ONE_WEEK_IN_TIME = 7 * 24 * 3600
export const ZERO = BigNumber.from(0)

export const formatDuration = (duration: string) =>
  String(Number(duration) / ONE_WEEK_IN_TIME)

export const parseDuration = (duration: string) =>
  Number(duration) * ONE_WEEK_IN_TIME

export const toUsd = (n: number) => {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
}

export const addLeadingZeros = (n: number, totalLength = 2): string => {
  return String(n).padStart(totalLength, '0')
}

export const getCountdownText = (
  days: number,
  hours: number,
  minutes: number,
  seconds: number
) => {
  return `${days ? `${days}D:` : ''}${
    hours ? `${addLeadingZeros(hours)}H:` : ''
  }${addLeadingZeros(minutes)}M:${addLeadingZeros(seconds)}S`
}
