import puppeteer from 'puppeteer'
import 'dotenv/config'
import { Dappeteer } from '@chainsafe/dappeteer'
import * as dappeteer from '@chainsafe/dappeteer'
import 'jest'

const ABC_ADDRESS = '0x36FC806bb8FE99d00439E9867314A5E082184257'
const XYZ_ADDRESS = '0x67F0ecD58a6287d5ec8CA92b6Fda836EDa9aE41F'
const NETWORK = 'goerli'
const isCreatePublic = true
const isCreateWhitelist = true
const isSetVesting = true

type Page = Dappeteer['page']
jest.setTimeout(60000)
export let page: Page, browser: any, metamask: Dappeteer

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function clickElement(
  page: Page,
  selector: any,
  timeout?: number
): Promise<void> {
  await page.bringToFront()
  await page.waitForSelector(selector, { timeout })
  const element = await page.$(selector)
  await element?.click()
}

describe('create token sale', () => {
  beforeAll(async () => {
    const launchOptions = {
      metamaskVersion: 'v10.15.0',
      defaultViewport: null,
    }
    const browser = await dappeteer.launch(puppeteer, launchOptions)
    metamask = await dappeteer.setupMetamask(browser, {
      seed: process.env.SEED,
    })
    await sleep(2000)
    await metamask.switchNetwork(NETWORK)
    page = await browser.newPage()
    page.bringToFront()
    await page.goto('http://localhost:3000/mining/discover', {
      waitUntil: 'load',
    })
    await clickElement(page, '#connectWallet')
    await clickElement(page, '#wallets > button:nth-child(1)')
    await sleep(2000)
    page.bringToFront()
    await metamask.approve()
    page.bringToFront()
  })

  it('should fill in offeringStep inputs', async () => {
    await page.goto('http://localhost:3000/origination/new-token-sale', {
      waitUntil: 'load',
    })
    await clickElement(page, 'div#selectToken0')
    const input = await page.waitForSelector('input#tokenAddress')
    await input?.type(XYZ_ADDRESS)
    await sleep(3000)
    await clickElement(page, 'div#tokenList > div')

    await clickElement(page, 'div#selectToken1')
    await input?.type(ABC_ADDRESS)
    await sleep(3000)
    await clickElement(page, 'div#tokenList > div')

    const input0 = await page.waitForSelector('input#OfferTokenAmount')
    await input0?.type('3')
    const input1 = await page.waitForSelector(
      'input#ReservePurchaseTokenRaised'
    )
    await input1?.type('2')
    await clickElement(page, 'button#offeringStepBtn')
  })

  it('should fill in auctionStep inputs', async () => {
    async function fillForm() {
      await sleep(1000)
      await clickElement(page, '#formula > div:nth-child(2) > span')
      const price = await page.waitForSelector('input#standardPrice')
      await price?.type('1')
      await clickElement(page, '#offeringPeriodDropdown')
      const offeringPeriodDropdownItem = await page.waitForSelector(
        '#offeringPeriodDropdown-0'
      )
      await sleep(500)
      await offeringPeriodDropdownItem?.click()
      const offeringPeriodInput = await page.waitForSelector(
        '#offeringPeriodInput'
      )
      await offeringPeriodInput?.type('5')
    }

    if (isCreateWhitelist) {
      await clickElement(page, '#isSetWhitelist > label:nth-child(1)')
      await fillForm()
    } else {
      await clickElement(page, '#isSetWhitelist > label:nth-child(2)')
    }
    await sleep(1000)
    await clickElement(page, '#whitelistSaleBtn')

    if (isCreatePublic) {
      await clickElement(page, '#isSetPublic > label:nth-child(1)')
      await fillForm()
    } else {
      await clickElement(page, '#isSetPublic > label:nth-child(2)')
    }
    await sleep(1000)
    await clickElement(page, '#publicSaleBtn')
  })

  it('should fill in vestingStep inputs', async () => {
    if (isSetVesting) {
      await clickElement(page, '#isSetVesting > div:nth-child(1) > span')
      await sleep(500)

      await clickElement(page, '#vestingPeriodDropdown')
      const vestingPeriodDropdownItem = await page.waitForSelector(
        '#vestingPeriodDropdown-0'
      )
      await sleep(500)
      await vestingPeriodDropdownItem?.click()
      const vestingPeriodInput = await page.waitForSelector(
        '#vestingPeriodInput'
      )
      await vestingPeriodInput?.type('1')
      await sleep(1000)
      await clickElement(page, '#cliffPeriodDropdown')
      const cliffPeriodDropdownItem = await page.waitForSelector(
        '#cliffPeriodDropdown-0'
      )
      await sleep(500)
      await cliffPeriodDropdownItem?.click()
      const cliffPeriodInput = await page.waitForSelector('#cliffPeriodInput')
      await cliffPeriodInput?.type('1')
    } else {
      await clickElement(page, '#isSetVesting > div:nth-child(2) > span')
    }
    await sleep(1000)
    await clickElement(page, 'button#vestingStepBtn')
  })

  it('should submit and create token sale', async () => {
    await page.screenshot({ path: 'create-token-sale.png' })
    await clickElement(page, 'button#submit')
    await clickElement(page, 'button#createTokenSale')
    await sleep(3000)
    await metamask.confirmTransaction()
    await sleep(2000)
    page.bringToFront()
    await clickElement(page, 'button#createTokenSaleSuccessSectionBtn', 60000)
  })
})
