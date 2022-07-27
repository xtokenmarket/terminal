/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line no-undef
const puppeteer = require('puppeteer')
// eslint-disable-next-line no-undef
const dappeteer = require('@chainsafe/dappeteer')
// eslint-disable-next-line no-undef
require('dotenv').config()

const ABC_ADDRESS = '0x36FC806bb8FE99d00439E9867314A5E082184257'
const XYZ_ADDRESS = '0x67F0ecD58a6287d5ec8CA92b6Fda836EDa9aE41F'

/*  
TODO: should add jest after all the sale funcitions are added. 
ref: https://github.com/ChainSafe/dappeteer/blob/master/docs/JEST.md
run E2E testing: `node src/test/index.js`
Need to manually maximize the Chromium view size to prevent the case some html elements not found while running the test 
*/

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function launchAndConnect() {
  const browser = await dappeteer.launch(puppeteer, {
    metamaskVersion: 'v10.15.0',
    defaultViewport: null,
  })
  const metamask = await dappeteer.setupMetamask(browser, {
    // eslint-disable-next-line no-undef
    seed: process.env.SEED,
  })
  await sleep(2000)
  await metamask.switchNetwork('goerli')
  const page = await browser.newPage()
  page.bringToFront()
  await page.goto('http://localhost:3000/mining/discover', {
    waituntil: 'load',
  })
  var connectWalletButton = await page.$('#connectWallet')
  await connectWalletButton.click()
  var metamaskButton = await page.$('#wallets > button:nth-child(1)')
  await metamaskButton.click()
  await sleep(2000)
  page.bringToFront()
  await metamask.approve()
  page.bringToFront()
  return [page, metamask]
}

async function offeringStep(page) {
  //create token sale
  await page.goto('http://localhost:3000/origination/new-token-sale', {
    waituntil: 'load',
  })
  var selectToken0 = await page.waitForSelector('div#selectToken0')
  await selectToken0.click()
  var input = await page.waitForSelector('input#tokenAddress')
  await input.type(XYZ_ADDRESS)
  await sleep(3000)
  var token = await page.waitForSelector('div#tokenList > div')
  await token.click()

  var selectToken1 = await page.waitForSelector('div#selectToken1')
  await selectToken1.click()
  await input.type(ABC_ADDRESS)
  await sleep(3000)
  token = await page.waitForSelector('div#tokenList > div')
  await token.click()
  var input0 = await page.waitForSelector('input#OfferTokenAmount')
  await input0.type('3')
  var input1 = await page.waitForSelector('input#ReservePurchaseTokenRaised')
  await input1.type('2')
  var next = await page.waitForSelector('button#next')
  await next.click()
}

async function auctionStep(page, isCreateWhitelist, isCreatePublic = true) {
  async function fillForm() {
    await sleep(1000)
    var formulaStandard = await page.waitForSelector(
      '#formula > div:nth-child(2) > span'
    )
    await formulaStandard.click()
    var price = await page.waitForSelector('input#standardPrice')
    await price.type('1')
    var offeringPeriodDropdown = await page.waitForSelector(
      '#offeringPeriodDropdown'
    )
    await offeringPeriodDropdown.click()
    var offeringPeriodDropdownItem = await page.waitForSelector(
      '#offeringPeriodDropdown-0'
    )
    await sleep(500)
    await offeringPeriodDropdownItem.click()
    var offeringPeriodInput = await page.waitForSelector('#offeringPeriodInput')
    await offeringPeriodInput.type('5')
  }

  if (isCreateWhitelist) {
    var yes = await page.waitForSelector('#isSetWhitelist > label:nth-child(1)')
    await yes.click()
    await fillForm()
  } else {
    var no = await page.waitForSelector('#isSetWhitelist > label:nth-child(2)')
    await no.click()
  }

  await sleep(1000)
  var next = await page.waitForSelector('#next')
  await next.click()

  if (isCreatePublic) {
    yes = await page.waitForSelector('#isSetPublic > label:nth-child(1)')
    await yes.click()
    await fillForm()
  } else {
    no = await page.waitForSelector('#isSetPublic > label:nth-child(2)')
    await no.click()
  }

  await sleep(1000)
  next = await page.waitForSelector('#next')
  await next.click()
}

async function vestingStep(page, isSetVesting) {
  if (isSetVesting) {
    var yes = await page.waitForSelector(
      '#isSetVesting > div:nth-child(1) > span'
    )
    await yes.click()
    await sleep(500)

    var vestingPeriodDropdown = await page.waitForSelector(
      '#vestingPeriodDropdown'
    )
    await vestingPeriodDropdown.click()
    var vestingPeriodDropdownItem = await page.waitForSelector(
      '#vestingPeriodDropdown-0'
    )
    await sleep(500)
    await vestingPeriodDropdownItem.click()
    var vestingPeriodInput = await page.waitForSelector('#vestingPeriodInput')
    await vestingPeriodInput.type('1')
    await sleep(1000)

    var cliffPeriodDropdown = await page.waitForSelector('#cliffPeriodDropdown')
    await cliffPeriodDropdown.click()
    var cliffPeriodDropdownItem = await page.waitForSelector(
      '#cliffPeriodDropdown-0'
    )
    await sleep(500)
    await cliffPeriodDropdownItem.click()
    var cliffPeriodInput = await page.waitForSelector('#cliffPeriodInput')
    await cliffPeriodInput.type('1')
  } else {
    var no = await page.waitForSelector(
      '#isSetVesting > div:nth-child(2) > span'
    )
    await no.click()
  }

  await sleep(1000)
  var next = await page.waitForSelector('button#next')
  await next.click()
  await page.screenshot({ path: 'create-token-sale.png' })

  const submit = await page.waitForSelector('button#submit')
  await submit.click()
}

async function submitAndCreateSale(page, metamask) {
  const createTokenSale = await page.waitForSelector('button#createTokenSale')
  await createTokenSale.click()
  await sleep(3000)
  await metamask.confirmTransaction()
  await sleep(2000)
  page.bringToFront()
  const done = await page.waitForSelector('button#done', { timeout: 60000 })
  await done.click()
}

async function createPublicSale() {
  try {
    const [page, metamask] = await launchAndConnect()
    await offeringStep(page)
    await auctionStep(page)
    await vestingStep(page)
    await submitAndCreateSale(page, metamask)
  } catch (error) {
    console.log('error>>', error)
  }
}

async function createWhitelistSale() {
  try {
    const isCreateWhitelist = true
    const isCreatePublic = false

    const [page, metamask] = await launchAndConnect()
    await offeringStep(page)
    await auctionStep(page, isCreateWhitelist, isCreatePublic)
    await vestingStep(page)
    await submitAndCreateSale(page, metamask)
  } catch (error) {
    console.log('error>>', error)
  }
}

async function createWhitelistPublicSale() {
  try {
    const isCreateWhitelist = true
    const isCreatePublic = true

    const [page, metamask] = await launchAndConnect()
    await offeringStep(page)
    await auctionStep(page, isCreateWhitelist, isCreatePublic)
    await vestingStep(page)
    await submitAndCreateSale(page, metamask)
  } catch (error) {
    console.log('error>>', error)
  }
}

async function createPublicSaleWithVesting() {
  try {
    const isSetVesting = true
    const [page, metamask] = await launchAndConnect()
    await offeringStep(page)
    await auctionStep(page)
    await vestingStep(page, isSetVesting)
    await submitAndCreateSale(page, metamask)
  } catch (error) {
    console.log('error>>', error)
  }
}

async function createWhitelistSaleWithVesting() {
  try {
    const isCreateWhitelist = true
    const isCreatePublic = false
    const isSetVesting = true

    const [page, metamask] = await launchAndConnect()
    await offeringStep(page)
    await auctionStep(page, isCreateWhitelist, isCreatePublic)
    await vestingStep(page, isSetVesting)
    await submitAndCreateSale(page, metamask)
  } catch (error) {
    console.log('error>>', error)
  }
}

async function createWhitelistPublicSaleWithVesting() {
  try {
    const isCreateWhitelist = true
    const isCreatePublic = true
    const isSetVesting = true

    const [page, metamask] = await launchAndConnect()
    await offeringStep(page)
    await auctionStep(page, isCreateWhitelist, isCreatePublic)
    await vestingStep(page, isSetVesting)
    await submitAndCreateSale(page, metamask)
  } catch (error) {
    console.log('error>>', error)
  }
}

// createPublicSale()
// createWhitelistSale()
// createWhitelistPublicSale()
// createPublicSaleWithVesting()
// createWhitelistSaleWithVesting()
createWhitelistPublicSaleWithVesting()
