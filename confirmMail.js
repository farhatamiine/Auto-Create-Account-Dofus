const axios = require('axios').default
const chalk = require('chalk')
const cheerio = require('cheerio')
var fs = require('fs')

const userCredential = {
    address: 'aminefarhat@maxresistance.com',
    password: 'amine.farhat50',
}

async function getJwtToken(userCredentials) {
    return await axios.post('https://api.mail.tm/token', {
        address: userCredentials.address,
        password: userCredentials.password,
    })
}

async function getAllMessages() {
    let rawdata = fs.readFileSync('token.json')
    let token = JSON.parse(rawdata)
    return await axios.get('https://api.mail.tm/messages?page=1', {
        headers: {
            Authorization: `Bearer ${token.token}`,
            accept: 'application/ld+json',
        },
    })
}

getJwtToken(userCredential).then((res) => {
    let data = JSON.stringify(res.data)
    fs.writeFileSync('token.json', data)
})

getAllMessages().then((res) => {
    const message = res.data['hydra:member'].filter((e) => {
        return (
            e.subject == 'Merci de confirmer votre email pour jouer à DOFUS' &&
            e.seen == true
        )
    })
    let rawdata = fs.readFileSync('token.json')
    let token = JSON.parse(rawdata)
    const email = axios
        .get(`https://api.mail.tm${message[0]['@id']}`, {
            headers: {
                Authorization: `Bearer ${token.token}`,
                accept: 'application/ld+json',
            },
        })
        .then((res) => {
            return res.data
        })
    email.then((res) => {
        //console.log(res.html[0])
        const $ = cheerio.load(res.html[0])
        const confirmationLink = $('td>a').first().attr('href')
        console.log(
            `${chalk.green('📩 Confirmation link :')} ${confirmationLink}`
        )
    })
})
