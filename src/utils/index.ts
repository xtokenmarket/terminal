import { BigNumber, utils } from "ethers";

const { formatUnits } = utils;

export const shortenAddress = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};

export const formatBigNumber = (
  value: BigNumber,
  decimals: number,
  precision = 2
): string => Number(formatUnits(value, decimals)).toFixed(precision);

export const numberWithCommas = (x: number | string) => {
  const splits = x.toString().split(".");
  const first = splits[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (splits.length === 1) return first;
  return [first, splits[1]].join(".");
};

export const hideInsignificantZeros = (x: string) => {
  const splits = x.toString().split(".");
  if (splits.length === 1) {
    return x;
  }
  let right = splits[1];

  while (right.length > 0 && right.charAt(right.length - 1) === "0") {
    right = right.substr(0, right.length - 1);
  }
  if (right.length === 0) {
    return splits[0];
  }
  return [splits[0], right].join(".");
};

export const getLeftTimeString = (dest: number, current: number) => {
  if (dest > current) {
    const secs = dest - current;
    if (secs < 60) {
      return `${secs} secs`;
    }
    const mins = Math.floor(secs / 60);
    if (mins < 60) {
      return `${mins} mins`;
    }
    const hours = Math.floor(mins / 60);
    if (hours < 24) {
      return `${hours} hours`;
    }
    const days = Math.floor(hours / 24);
    return `${days} days`;
  } else {
    return "";
  }
};

export const getFloatDecimalNumber = (num: string, decimals: number) => {
  const subs = num.split(".");
  if (subs.length < 2) return num;

  return [subs[0], subs[1].substr(0, decimals)].join(".");
};

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value
    .mul(BigNumber.from(10000).add(BigNumber.from(1000)))
    .div(BigNumber.from(10000));
}

export const waitSeconds = (sec?: number) =>
  new Promise((resolve) => setTimeout(resolve, (sec || 1) * 1000));
