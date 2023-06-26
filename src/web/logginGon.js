const puppeteer = require('puppeteer');
require('dotenv').config();

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getToken() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  let resolveToken;

  const tokenPromise = new Promise(resolve => {
    resolveToken = resolve;
  });

  page.on('response', async response => {
    if (response.url() === 'https://aefhp.unicard.pt/inovarconsulta/api/loginFU/') {
      const payload = await response.text();
      const payloadJSON = JSON.parse(payload);
      resolveToken(payloadJSON.token);
    }
  });

  await page.goto(process.env.INOVARURL);

  await delay(2000);

  await page.click('[data-ng-model="userName"]');
  await page.type('[data-ng-model="userName"]', process.env.GONUSERNAME);

  await page.click('[data-ng-model="userPassword"]');
  await page.type('[data-ng-model="userPassword"]', process.env.GONPDW);

  await page.click('[data-ng-click="logar()"]');

  return tokenPromise;
}

function executar() {
  console.log("A executar");
  return getToken().then(token => {
    return token; // Retorna o token para que possa ser utilizado em outros arquivos
  }).catch(error => {
    throw error;
  });
}

module.exports = {
  executar
};