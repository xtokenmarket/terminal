import 'jest'
import {
  clickElement,
  launchAndConnect,
  sleep,
  page,
  metamask,
} from './createTokenSale.spec'
import 'dotenv/config'

const POOL_ADDRESS =
  'http://localhost:3000/origination/token-offers/goerli/0x58AfAd19f2BD3C6DF3Bc93532Ef41085F4a1b34B'
const ABC_ADDRESS = '0x36FC806bb8FE99d00439E9867314A5E082184257'

describe('whitelist invest', () => {
  beforeAll(async () => {
    await launchAndConnect(process.env.USER_SEED)
    await page.goto(POOL_ADDRESS, {
      waitUntil: 'load',
    })
  })

  it('should invest in whitelist sale', async () => {
    await metamask.addToken({ tokenAddress: ABC_ADDRESS })
    // manually navigate to previous page
    await sleep(5000)
    page.bringToFront()
    await clickElement(page, '#whitelistInvest')
    await sleep(1000)
    const input = await page.waitForSelector('input#investInput')
    await input?.type('1')
    await sleep(3000)
    await clickElement(page, 'button#invest')

    if ((await page.waitForSelector('#approve')) !== null) {
      await clickElement(page, '#approve')
      await sleep(3000)
      await metamask.confirmTransaction()
      page.bringToFront()
      await sleep(3000)
    }

    await clickElement(page, 'button#invest', 60000)
    await sleep(3000)
    await clickElement(page, 'button#investTokenBtn')
    await sleep(3000)
    await metamask.confirmTransaction()
    await sleep(3000)
    await page.bringToFront()

    await clickElement(page, 'button#initiateDone', 90000)
  })
})
