import 'jest'
import {
  clickElement,
  launchAndConnect,
  sleep,
  page,
  metamask,
} from './createTokenSale.spec'

const POOL_ADDRESS =
  'http://localhost:3000/origination/offerings/goerli/0x9539e6BE310EB44a9cbd81fAccbaDe659081CE0A'
const ADDRESS_CAP = 1
const WHITELIST_PATH = process.env.WHITELIST_PATH || ''
jest.setTimeout(60000)

describe('set whitelist', () => {
  beforeAll(async () => {
    await launchAndConnect()
    await page.goto(POOL_ADDRESS, {
      waitUntil: 'load',
    })
  })

  it('should set whitelist', async () => {
    await clickElement(page, '#setWhitelist')
    await sleep(1000)

    const uploadWhitelist = await page.waitForSelector('#uploadWhitelist')
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      uploadWhitelist?.click(),
    ])
    await fileChooser.accept([WHITELIST_PATH])

    const input = await page.waitForSelector('input#addressCapInput')
    await input?.type(ADDRESS_CAP.toString())
    await sleep(1000)
    await clickElement(page, '#submitWhitelist')
    await sleep(2000)
    await metamask.sign()
    // TODO: need to manually confirm transaction here.
    await sleep(3000)
    await metamask.confirmTransaction()
    await sleep(8000)

    await page.bringToFront()
    await clickElement(page, 'button#setWhitelistDone')
  })
})
