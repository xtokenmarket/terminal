/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line no-undef
const { launchAndConnect, sleep } = require('./createTokenSale')
// eslint-disable-next-line no-undef
require('dotenv').config()

const POOL_ADDRESS =
  'http://localhost:3000/origination/token-offers/goerli/0xdeDa947d58c5218CfF9392B667a37831553380A1'
const ADDRESS_CAP = 1
// eslint-disable-next-line no-undef
const WHITELIST_PATH = process.env.WHITELIST_PATH

async function setWhitelist(page, metamask) {
  await page.goto(POOL_ADDRESS, {
    waituntil: 'load',
  })

  await sleep(3000)
  var setWhitelist = await page.waitForSelector('#setWhitelist')
  await setWhitelist.click()
  await sleep(1000)

  var uploadWhitelist = await page.waitForSelector('#uploadWhitelist')
  const [fileChooser] = await Promise.all([
    page.waitForFileChooser(),
    uploadWhitelist.click(),
  ])
  await fileChooser.accept([WHITELIST_PATH])

  var input = await page.waitForSelector('input#addressCapInput')
  await input.type(ADDRESS_CAP.toString())
  await sleep(1000)
  var submitWhitelist = await page.waitForSelector('#submitWhitelist')
  await submitWhitelist.click()
  await sleep(2000)
  await metamask.sign()
  // TODO: need to manually confirm transaction here.
  await sleep(8000)

  page.bringToFront()
  const done = await page.waitForSelector('button#setWhitelistDone', {
    timeout: 60000,
  })
  await done.click()
}

async function executeSaleFunctionsInWhitelistPublicSaleWithVesting() {
  try {
    const [page, metamask] = await launchAndConnect()
    await setWhitelist(page, metamask)
  } catch (error) {
    console.log('error>>', error)
  }
}

executeSaleFunctionsInWhitelistPublicSaleWithVesting()
