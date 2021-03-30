const axios = require('axios').default

const userCredential = {
    address: 'aminefarhat@maxresistance.com',
    password: 'amine.farhat50',
}

let user = {}
async function getJwtToken(userCredentials) {
    return await axios
        .post('https://api.mail.tm/token', {
            address: userCredentials.address,
            password: userCredentials.password,
        })
        .then((res) => {
            return {
                id: res.data.id,
                token: res.data.token,
            }
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            console.log('Done')
        })
}

user = await getJwtToken(userCredential)

console.log(user)
