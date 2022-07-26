/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line no-undef
const { launchAndConnect, sleep } = require('./createTokenSale')
// eslint-disable-next-line no-undef
require('dotenv').config()

const POOL_ADDRESS =
  'http://localhost:3000/origination/token-offers/goerli/0x6E39c3A5CdabF51178e1a791C204f46760aD6ffD'
const ADDRESS_CAP = 1
// eslint-disable-next-line no-undef
const WHITELIST_PATH = process.env.WHITELIST_PATH

async function setWhitelist(page, metamask) {
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
  await sleep(3000)
  await metamask.confirmTransaction()
  await sleep(8000)

  page.bringToFront()
  const done = await page.waitForSelector('button#setWhitelistDone', {
    timeout: 60000,
  })
  await done.click()
}

async function initiateSale(page, metamask) {
  var initiateSale = await page.waitForSelector('#initiateSale')
  await initiateSale.click()
  await sleep(1000)
  var approve = await page.waitForSelector('#approve')
  await approve.click()
  await sleep(3000)
  await metamask.confirmTransaction()
  page.bringToFront()
  await sleep(3000)
  page.bringToFront()
  var initiate = await page.waitForSelector('#initiate', {
    timeout: 60000,
  })
  await initiate.click()
  await sleep(3000)
  await metamask.confirmTransaction()
  await sleep(2000)
  page.bringToFront()
  const done = await page.waitForSelector('button#initiateDone', {
    timeout: 60000,
  })
  await done.click()
}

async function executeSaleFunctionsInWhitelistPublicSaleWithVesting() {
  try {
    const [page, metamask] = await launchAndConnect()
    await page.goto(POOL_ADDRESS, {
      waituntil: 'load',
    })
    await sleep(3000)
    await setWhitelist(page, metamask)
    await initiateSale(page, metamask)
  } catch (error) {
    console.log('error>>', error)
  }
}

executeSaleFunctionsInWhitelistPublicSaleWithVesting()
