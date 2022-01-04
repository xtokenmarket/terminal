export const getSortedToken = (tokenA: string, tokenB: string) => {
  const tA = tokenA.toLowerCase()
  const tB = tokenB.toLowerCase()

  return tA < tB ? [tA, tB] : [tB, tA]
}
