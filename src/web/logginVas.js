const puppeteer = require('puppeteer');
require('dotenv').config();

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var page;

async function getToken() {
  const browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
  let resolveToken;

  const tokenPromise = new Promise(resolve => {
    resolveToken = resolve;
  });

  await page.goto(process.env.OUTLOOK);

  page.on('response', async response => {
    if (response.url() === process.env.OUTLOOK) {
      const payload = await response.text();
      const payloadJSON = JSON.parse(payload);
      resolveToken(payloadJSON.token);
    }
  });

  await delay(3000);

  await page.click('[name="loginfmt"]');
  await page.type('[name="loginfmt"]', process.env.VASCOUSERNAME);
  await page.click('[id="idSIButton9"]');

  await delay(5000);

  await page.click('[name="passwd"]');
  await page.type('[name="passwd"]', process.env.VASCOPDW);
  await page.click('[id="idSIButton9"]');

  await delay(5000);

  await page.click('[data-value="OneWaySMS"]');

  return 'asd';
}

async function applyCode(accessCode) {
  console.log('accessCode ', accessCode)

  await page.click('[id="idTxtBx_SAOTCC_OTC"]');
  await page.type('[id="idTxtBx_SAOTCC_OTC"]', accessCode);

  await page.click('[id="idSubmit_SAOTCC_Continue"]');

  await page.click('[id="idSIButton9"]');
}

function executar() {
  console.log("A executar");
  return getToken()
    .then(({ token, verificationCode }) => {
      console.log('Token:', token);
      console.log('Código de Verificação:', verificationCode);
      return { token, verificationCode };
    })
    .catch(error => {
      throw error;
    });
}

module.exports = {
  executar,
  applyCode
};
