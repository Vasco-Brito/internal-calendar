const webLoggin = require('./src/web/loggin');

async function main() {
  try {
    const token = await webLoggin.executar();
    console.log('Token:', token);
  } catch (error) {
    console.error('Erro:', error);
  }
}

main();