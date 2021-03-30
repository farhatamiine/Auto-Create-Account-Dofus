const puppeteer = require('puppeteer-extra')
const chalk = require('chalk')
const password = require('secure-random-password')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

const { v4: uuidv4 } = require('uuid')
const {
    delay,
    fillingForms,
    accessSpreadSheet,
    solveReCaptcha,
} = require('./utils/function')

puppeteer.use(StealthPlugin())

const credentials = require('./My First Project-fb74077938fd.json')

const createAccount = async () => {
    //! create username
    const userName = password.randomPassword({
        characters: [password.lower, password.upper],
    })

    //! create username
    const userPassword = password.randomPassword({
        length: 16,
        characters: [password.lower, password.upper, password.digits],
    })

    const userEmail = 'aminefarhat@maxresistance.com'

    const accountDetails = {
        ID: uuidv4(),
        Username: userName,
        Password: userPassword,
        Email: userEmail,
    }

    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 10,
        defaultViewPort: null,
    })

    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0)
    await page.goto('https://www.dofus.com/fr/mmorpg/jouer')
    await delay(3000)

    //! filing forms
    await fillingForms(accountDetails, page)

    //! Setting recaptcha response
    console.log(chalk.green('Solve Recaptcha'))
    await solveReCaptcha(page)

    //! submit form automatically
    console.log(chalk.green('submit form automatically'))

    await page.click('#ak_field_4')
    await delay(10000)
    await page.waitForSelector('div.ak-register-email-validate', {
        visible: true,
        timeout: 0,
    })

    //! Send Infos to GoogleSheet
    accessSpreadSheet(accountDetails, credentials)
    browser.close()
}

createAccount()
