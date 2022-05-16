import { INSUFFICIENT_FUNDS_ERROR } from 'config/constants'
import { BigNumber, BigNumberish, utils } from 'ethers'
import moment from 'moment'

const { formatUnits } = utils

const secondsIn1Day = 24 * 60 * 60

export const shortenAddress = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

export const formatBigNumber = (
  value: BigNumberish,
  decimals: number,
  precision = 2
): string => {
  return Number(formatUnits(value, decimals)).toFixed(precision)
}

export const numberWithCommas = (
  x: string,
  decimals = 2,
  forcePrecision = false
) => {
  if (!x) return '0'
  const n = Number(x)
  if (n < 1000) {
    return Number.isInteger(n) && !forcePrecision ? x : n.toFixed(decimals)
  }
  let formattedNumber = n.toFixed(decimals).replace(/\d(?=(\d{3})+\.)/g, '$&,')
  const splitArray = formattedNumber.split('.')
  if (splitArray.length > 1) {
    formattedNumber = splitArray[0]
  }
  return formattedNumber
}

export const formatToShortNumber = (number: string, decimals = 2): string => {
  if (number.length < 1) {
    return '0'
  }

  const units = ['', 'K', 'M', 'B', 'T']
  let unitIndex = 0
  let rNumber = parseFloat(number.split(',').join(''))

  while (rNumber >= 1000 && unitIndex < 4) {
    unitIndex += 1
    rNumber = rNumber / 1000
  }

  return `${Math.round(parseFloat(rNumber.toFixed(decimals)))}${
    units[unitIndex]
  }`
}

export const hideInsignificantZeros = (x: string) => {
  const splits = x.toString().split('.')
  if (splits.length === 1) {
    return x
  }
  let right = splits[1]

  while (right.length > 0 && right.charAt(right.length - 1) === '0') {
    right = right.substr(0, right.length - 1)
  }
  if (right.length === 0) {
    return splits[0]
  }
  return [splits[0], right].join('.')
}

export const getTimeDurationUnitInfo = (
  secs: number
): { unit: number; unitStr: string } => {
  if (secs < 60) {
    return { unit: 1, unitStr: 'sec' }
  }
  const mins = Math.floor(secs / 60)
  if (mins < 60) {
    return { unit: 60, unitStr: 'min' }
  }
  const hours = Math.floor(mins / 60)
  if (hours < 24) {
    return { unit: 3600, unitStr: 'hour' }
  }
  const days = Math.floor(hours / 24)

  if (days < 7) {
    return { unit: 86400, unitStr: 'day' }
  }

  // const weeks = Math.floor(days / 7)
  // if (weeks < 5) {
  return { unit: 604800, unitStr: 'week' }
  // }

  // return { unit: 2592000, unitStr: 'month' }
}

export const getTimeDurationStr = (secs: number) => {
  if (secs < 60) {
    return `${secs} secs`
  }

  const mins = Math.floor(secs / 60)
  if (mins < 60) {
    return `${mins} mins`
  }

  const hours = Math.floor(mins / 60)
  if (hours < 24) {
    return `${hours} hours`
  }

  const days = Math.floor(hours / 24)
  if (days === 1) {
    return `${days} day`
  } else if (days < 7) {
    return `${days} days`
  }

  const weeks = Math.floor(days / 7)
  if (weeks === 1) {
    return `${weeks} week`
  }
  return `${weeks} weeks`

  // const months = Math.floor(days / 30)
  // if (months === 1) {
  //   return `${months} month`
  // }
  // return `${months} months`
}

export const getTimeRemainingUnits = (time: number, unitPrecision = 3) => {
  const duration = moment.duration(time)

  return [
    { years: duration.years() },
    { months: duration.months() },
    { weeks: duration.weeks() },
    // for some reason, moment keeps days and weeks irrespective of each other
    { days: Math.max(duration.days() - duration.weeks() * 7, 0) },
    { hours: duration.hours() },
    { minutes: duration.minutes() },
  ]
    .filter((unit) => Object.values(unit)[0] > 0)
    .map((unit) => {
      const [key, value] = Object.entries(unit)[0]
      return value.toString() + ' ' + (value === 1 ? key.slice(0, -1) : key)
    })
    .filter((_, i) => i < unitPrecision)
}

export const getFloatDecimalNumber = (num: string, decimals = 2) => {
  if (!num) return '0'
  const subs = num.split('.')
  if (subs.length < 2) return num

  return [subs[0], subs[1].substring(0, decimals)].join('.')
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value
    .mul(BigNumber.from(10000).add(BigNumber.from(1000)))
    .div(BigNumber.from(10000))
}

export const waitSeconds = (sec?: number) =>
  new Promise((resolve) => setTimeout(resolve, (sec || 1) * 1000))

export const getCurrentTimeStamp = () => Math.floor(Date.now() / 1000)

export const getTotalTokenPrice = (
  amount: BigNumber,
  decimal: number,
  price: string
) => {
  const totalPrice =
    Number(formatUnits(amount, decimal).toString()) * Number(price)

  return totalPrice.toFixed(2)
}

export const parseFee = (tier: BigNumber | number | string) => {
  const fee =
    typeof tier === 'number' || typeof tier === 'string'
      ? Number(tier)
      : tier.toNumber()
  return fee / 10000
}

export const getMetamaskError = (error: any) => {
  if (
    (error && error.error && error.error.message) ||
    (error && error.data && error.data.message)
  ) {
    const isInsufficientFundsError = error.error
      ? error.error.message.indexOf('insufficient funds') !== -1
      : error.data.message.indexOf('insufficient funds') !== -1

    if (isInsufficientFundsError) {
      return INSUFFICIENT_FUNDS_ERROR
    }
  }
  return null
}

export const getDurationSec = (amount: number, unit: string) => {
  let durationSec = 0

  if (unit === 'Days') {
    durationSec = amount * secondsIn1Day
  }
  if (unit === 'Weeks') {
    durationSec = amount * secondsIn1Day * 7
  }
  if (unit === 'Months') {
    durationSec = amount * secondsIn1Day * 7 * 4
  }
  if (unit === 'Years') {
    durationSec = amount * secondsIn1Day * 7 * 4 * 365
  }

  return BigNumber.from(durationSec.toString())
}

export const parseDurationSec = (amount: number) => {
  if (amount === 0) return '0 day'

  const unitNames = ['Year', 'Month', 'Week', 'Day']
  const amountByUnit = [
    amount / (secondsIn1Day * 7 * 4 * 365),
    amount / (secondsIn1Day * 7 * 4),
    amount / (secondsIn1Day * 7),
    amount / secondsIn1Day,
  ].map(Math.floor)
  const applicableUnitIndex = amountByUnit.findIndex((amount) => amount > 0)
  const getUnitEnding = (unitAmount: number) => (unitAmount > 1 ? 's' : '')

  return `${amountByUnit[applicableUnitIndex]} ${
    unitNames[applicableUnitIndex]
  }${getUnitEnding(amountByUnit[applicableUnitIndex])}`
}

export const parseRemainingDurationSec = (
  amount: number,
  unitPrecision = 3
) => {
  if (amount === 0) return '0D:00H:00M'

  const duration = moment.duration(amount * 1000)

  return [
    { Y: duration.years() },
    { M: duration.months() },
    { W: duration.weeks() },
    // for some reason, moment keeps days and weeks irrespective of each other
    { D: Math.max(duration.days() - duration.weeks() * 7, 0) },
    { H: duration.hours() },
    { M: duration.minutes() },
  ]
    .filter((unit) => Object.values(unit)[0] > 0)
    .map((unit) => {
      const [key, value] = Object.entries(unit)[0]
      return `${value.toString()}${key}`
    })
    .filter((_, i) => i < unitPrecision)
    .join(' ')
}

export const formatDurationUnits = (duration: string[]) => {
  const primary = duration[0] || ''
  const rest = duration.slice(1, duration.length)
  rest.splice(0, 0, '')
  return { primary, rest: rest.join(' — ') }
}

export const getRemainingTime = (endingTime: BigNumber) => {
  if (endingTime.toString() === '0') return 0
  return Date.now() - Number(endingTime.toString())
}
