import 'jest'
import {
  clickElement,
  launchAndConnect,
  sleep,
  page,
  metamask,
} from './createTokenSale.spec'

const POOL_ADDRESS =
  'http://localhost:3000/origination/token-offers/goerli/0x8B8A2346Aebe65dc0070941d31a91BDF90562a8B'
jest.setTimeout(60000)

describe('initiate sale', () => {
  beforeAll(async () => {
    await launchAndConnect()
    await page.goto(POOL_ADDRESS, {
      waitUntil: 'load',
    })
  })

  it('should initiate sale', async () => {
    await clickElement(page, '#initiateSale')
    await sleep(3000)

    if ((await page.$('#initiateSaleApprove')) !== null) {
      await clickElement(page, '#initiateSaleApprove')
      await sleep(3000)
      await metamask.confirmTransaction()
      await page.bringToFront()
      await sleep(1000)
    }

    await clickElement(page, '#initiate', 60000)
    await sleep(3000)
    await metamask.confirmTransaction()
    await sleep(2000)
    await page.bringToFront()
    await clickElement(page, '#initiateDone', 90000)
  })
})
