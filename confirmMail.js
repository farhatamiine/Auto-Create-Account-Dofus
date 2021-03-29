const puppeteer = require("puppeteer-extra");
const chalk = require("chalk");

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto("https://mail.google.com/mail/u/1/", {
    waitUntil: "networkidle2",
  });
  await page.type("#identifierId", "closet162", { delay: 350 });
  await page.click("button.VfPpkd-LgbsSe");
  await page.waitForNavigation();
  await page.type('[name="password"]', "  amine.farhat50", { delay: 250 });
  await page.click("button.VfPpkd-LgbsSe");
  await page.waitForNavigation();
  await page.screenshot({ path: "example.png" });
  await browser.close();
})();
