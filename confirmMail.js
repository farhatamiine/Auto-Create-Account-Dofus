const axios = require('axios').default
const chalk = require('chalk')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const cheerio = require('cheerio')
const fs = require('fs')
const delay = require('./utils/function')

const userCredential = {
    address: 'aminefarhat@maxresistance.com',
    password: 'amine.farhat50',
}

puppeteer.use(StealthPlugin())

async function getJwtToken(userCredentials) {
    return axios.post('https://api.mail.tm/token', {
        address: userCredentials.address,
        password: userCredentials.password,
    })
}

async function getAllMessages() {
    const rawdata = fs.readFileSync('token.json')
    const token = JSON.parse(rawdata)
    return axios.get('https://api.mail.tm/messages?page=1', {
        headers: {
            Authorization: `Bearer ${token.token}`,
            accept: 'application/ld+json',
        },
    })
}

const confirmMail = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 10,
        defaultViewPort: null,
    })
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0)

    getJwtToken(userCredential).then((res) => {
        const data = JSON.stringify(res.data)
        fs.writeFileSync('token.json', data)
    })

    getAllMessages().then((res) => {
        const message = res.data['hydra:member'].filter((e) => (
            e.subject === 'Merci de confirmer votre email pour jouer à DOFUS' &&
            e.seen === true
        ))
        const rawdata = fs.readFileSync('token.json')
        const token = JSON.parse(rawdata)
        const email = axios
            .get(`https://api.mail.tm${message[0]['@id']}`, {
                headers: {
                    Authorization: `Bearer ${token.token}`,
                    accept: 'application/ld+json',
                },
            })
            .then((response) => response.data)
        email.then(async (result) => {
            console.log(chalk.green("Confirming the created account!!"));
            const $ = cheerio.load(result.html[0])
            const confirmationLink = $('td>a').first().attr('href')
            await page.goto(confirmationLink)
            await delay(3000)
            browser.close();
        })
    })
}


confirmMail();