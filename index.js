const puppeteer = require("puppeteer-extra");
const chalk = require("chalk");
const password = require("secure-random-password");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const ac = require("@antiadmin/anticaptchaofficial");
const { delay } = require("./utils/function");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { v4: uuidv4 } = require("uuid");

puppeteer.use(StealthPlugin());
ac.setAPIKey("76a583e59fa07d2d3b81c2a4a8d33f12");
ac.getBalance()
  .then((balance) => console.log("my balance is: " + balance))
  .catch((error) => console.log("an error with API key: " + error));

const creds = require("./My First Project-fb74077938fd.json");

async function accessSpreadSheet(account_details) {
  const doc = new GoogleSpreadsheet(
    "1ji1NBNXT2P9-ZAzPyxohiMKhGk5NsCay2vcY0gEVibI"
  );
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  sheet.addRow(account_details);
  //console.log(`Title:${sheet.title},Rows:${sheet.rowCount}`);
}

(async () => {
  console.log("solving recaptcha ...");
  let token = await ac.solveRecaptchaV2Proxyless(
    "https://www.dofus.com/fr/mmorpg/jouer",
    "6LfbFRsUAAAAACrqF5w4oOiGVxOsjSUjIHHvglJx"
  );
  if (!token) {
    console.log("something went wrong");
    return;
  }

  //! submit form automatically
  const user_name = password.randomPassword({
    characters: [password.lower, password.upper],
  });

  const user_password = password.randomPassword({
    characters: [password.lower, password.upper, password.digits],
  });

  const user_email = "closet162@gmail.com";

  const account_details = {
    ID: uuidv4(),
    Username: user_name,
    Password: user_password,
    Email: user_email,
  };

  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto("https://www.dofus.com/fr/mmorpg/jouer");
  await delay(3000);

  //! filling username
  console.log(chalk.green("filling username"));
  await page.type("#userlogin", user_name, { delay: 200 });

  //! filling password
  console.log(chalk.green("filling password"));
  await page.type("#user_password", user_password, { delay: 200 });
  await page.type("#user_password_confirm", user_password, { delay: 200 });

  //! filling email
  console.log(chalk.green("filling email"));
  await page.type("#user_mail", user_email, { delay: 200 });

  //! filling birth date
  console.log(chalk.green("filling birth date"));
  await page.select("select#ak_field_1", "1");
  await page.select("select#ak_field_2", "2");
  await page.select("select#ak_field_3", "1997");

  //! Setting recaptcha response
  console.log(chalk.green("setting recaptcha g-response ..."));
  await page.$eval(
    "#g-recaptcha-response",
    (element, token) => {
      element.value = token;
    },
    token
  );

  //! Send Infos to GoogleSheet

  //! submit form automatically
  console.log(chalk.green("submit form automatically"));
  await page.click("#ak_field_4");
  await delay(10000);
  accessSpreadSheet(account_details);
})();
