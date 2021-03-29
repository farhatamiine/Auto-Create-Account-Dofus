const ac = require('@antiadmin/anticaptchaofficial')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const chalk = require('chalk')

const delay = (time) =>
    new Promise((resolve) => {
        setTimeout(resolve, time)
    })

const fillingForms = async (accountDetails, page) => {
    //! filling username
    console.log(chalk.green('🎫 Filling username : ') + accountDetails.Username)
    await page.type('#userlogin', accountDetails.Username, { delay: 400 })

    //! filling password
    console.log(chalk.green('🔐 Filling password : ') + accountDetails.Password)
    await page.type('#user_password', accountDetails.Password, { delay: 350 })
    await page.type('#user_password_confirm', accountDetails.Password, {
        delay: 260,
    })

    //! filling email
    console.log(chalk.green('📧 Filling email with : ') + accountDetails.Email)
    await page.type('#user_mail', accountDetails.Email, { delay: 450 })

    //! filling birth date
    console.log(chalk.green('📅 Filling birth date'))
    await page.select('select#ak_field_1', '1')
    await page.select('select#ak_field_2', '2')
    await page.select('select#ak_field_3', '1997')
}

// ? Access Spreadsheet
async function accessSpreadSheet(accountDetails, credentials) {
    console.log(chalk.green(`📝 Saving data on google spreadsheet`))
    const doc = new GoogleSpreadsheet(
        '1ji1NBNXT2P9-ZAzPyxohiMKhGk5NsCay2vcY0gEVibI'
    )
    await doc.useServiceAccountAuth(credentials)
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0]
    sheet.addRow(accountDetails)
}

// ? Check CaptchaSolver balance
const checkBalance = () => {
    ac.shutUp()
    ac.setAPIKey('76a583e59fa07d2d3b81c2a4a8d33f12')
    ac.getBalance()
        .then((balance) =>
            console.log(chalk.green(`💵 My balance is $${balance}`))
        )
        .catch((error) => console.log(chalk.red(`received error ${error}`)))
}

// ? Solve Captcha
async function solveReCaptcha(page) {
    checkBalance()
    const responses = await ac
        .solveRecaptchaV2Proxyless(
            'https://www.dofus.com/fr/mmorpg/jouer',
            '6LfbFRsUAAAAACrqF5w4oOiGVxOsjSUjIHHvglJx'
        )
        .then((response) => response)
        .catch((error) =>
            console.log(chalk.red(`test received error ${error}`))
        )
    console.log(chalk.green('Response : ') + responses)
    const js = `document.getElementById("g-recaptcha-response").innerHTML="${responses}";`
    await page.evaluate(js)
}

module.exports = {
    delay,
    fillingForms,
    accessSpreadSheet,
    solveReCaptcha,
}
