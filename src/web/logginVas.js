const puppeteer = require('puppeteer');
const axios = require('axios');
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

  // Esperar a resposta da API antes de continuar
  const verificationCode = await waitForAPIResponse(page);

  await page.click('[id="idSubmit_SAOTCC_Continue"]');

  return { token: await tokenPromise, verificationCode };
}

async function waitForAPIResponse(page) {
  const apiURL = 'http://localhost:3000/api/phone/msg'; // URL da API
  const timeout = 10000; // Tempo limite de espera em milissegundos
  const pollingInterval = 1000; // Intervalo de tempo entre as tentativas em milissegundos

  let startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const response = await axios.get(apiURL);
      const data = response.data;

      // Verificar se a resposta da API contém o valor esperado
      if (data && data.msgBody) {
        const verificationCode = extractVerificationCode(data.msgBody);
        if (verificationCode) {
          return verificationCode; // Retorna o código de verificação extraído
        }
      }
    } catch (error) {
      // Lidar com erros de requisição ou respostas inválidas da API
      console.error('Erro ao fazer a requisição à API:', error);
    }

    // Aguardar o intervalo de tempo antes de fazer uma nova tentativa
    await delay(pollingInterval);
  }

  throw new Error('Timeout: A resposta da API não foi recebida dentro do tempo limite');
}

function extractVerificationCode(msgBody) {
  console.log(msgBody)
  const regex = /cód\. de verificação (\d+)/i;
  const match = msgBody.match(regex);
  if (match && match[1]) {
    console.log(match[1])
    return match[1]; // Retorna o código de verificação extraído
  }
  return null; // Código de verificação não encontrado
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
  executar
};
