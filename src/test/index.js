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

    await page.goto('http://localhost:3000/origination/new-token-sale', {
      waituntil: 'load',
    })
  } catch (error) {
    console.log('error>>', error)
  }
}

main()
