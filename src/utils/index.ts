import { BigNumber, utils } from 'ethers'
import moment from 'moment'

const { formatUnits } = utils

export const shortenAddress = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

export const formatBigNumber = (
  value: BigNumber,
  decimals: number,
  precision = 2
): string => Number(formatUnits(value, decimals)).toFixed(precision)

export const numberWithCommas = (x: number | string) => {
  if (!x) return '0'
  const splits = x.toString().split('.')
  const first = splits[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  if (splits.length === 1) return first
  return [first, splits[1]].join('.')
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

  return `${parseFloat(rNumber.toFixed(decimals))}${units[unitIndex]}`
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

  const weeks = Math.floor(days / 7)
  if (weeks < 5) {
    return { unit: 604800, unitStr: 'week' }
  }

  return { unit: 2592000, unitStr: 'month' }
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
  } else if (weeks < 5) {
    return `${weeks} weeks`
  }

  const months = Math.floor(days / 30)
  if (months === 1) {
    return `${months} month`
  }
  return `${months} months`
}

export const getTimeRemainingUnits = (time: number, unitPrecision = 3) => {
  const duration = moment.duration(time)
  
  const x = [
    { years: duration.years() },
    { months: duration.months() },
    { weeks: duration.weeks() },
    { days: duration.days() },
    { hours: duration.hours() },
    { minutes: duration.minutes() },
  ]
  console.log('x:', x)

  return [
    { years: duration.years() },
    { months: duration.months() },
    { weeks: duration.weeks() },
    { days: duration.days() },
    { hours: duration.hours() },
    { minutes: duration.minutes() },
  ]
  .filter(unit => Object.values(unit)[0] > 0)
  .map(unit => {
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
