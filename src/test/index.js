/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line no-undef
const puppeteer = require('puppeteer')
// eslint-disable-next-line no-undef
const dappeteer = require('@chainsafe/dappeteer')
// eslint-disable-next-line no-undef
require('dotenv').config()

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  try {
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

    //create token sale
    await page.goto('http://localhost:3000/origination/new-token-sale', {
      waituntil: 'load',
    })
    var selectToken0 = await page.waitForSelector('div#selectToken0')
    await selectToken0.click()
    var input = await page.waitForSelector('input#tokenAddress')
    await input.type('0x36FC806bb8FE99d00439E9867314A5E082184257')
    await sleep(2500)
    var token = await page.waitForSelector('div#tokenList > div')
    await token.click()

    var selectToken1 = await page.waitForSelector('div#selectToken1')
    await selectToken1.click()
    await input.type('0x67F0ecD58a6287d5ec8CA92b6Fda836EDa9aE41F')
    await sleep(2500)
    token = await page.waitForSelector('div#tokenList > div')
    await token.click()
    var input0 = await page.waitForSelector('input#OfferTokenAmount')
    await input0.type('3')
    var input1 = await page.waitForSelector('input#ReservePurchaseTokenRaised')
    await input1.type('2')
    var next = await page.waitForSelector('button#next')
    await next.click()

    // Auction step
    var no = await page.waitForSelector('#isSetWhitelist > label:nth-child(2)')
    await no.click()
    next = await page.waitForSelector('#next')
    await next.click()
    var yes = await page.waitForSelector('#isSetPublic > label:nth-child(1)')
    await yes.click()
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
    await sleep(1000)
    next = await page.waitForSelector('#next')
    await next.click()

    // Vesting step
    var noVesting = await page.waitForSelector(
      '#isSetVesting > div:nth-child(2) > span'
    )
    await noVesting.click()
    await sleep(1000)
    next = await page.waitForSelector('button#next')
    await next.click()
  } catch (error) {
    console.log('error>>', error)
  }
}

main()
