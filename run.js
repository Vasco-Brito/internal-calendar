const webLoggin = require('./src/web/loggin');
const inovarCalendar = require('./src/be/inovarCalendar');

async function main() {
  try {
    const token = await webLoggin.executar();
    inovarCalendar.getCalendar(token);
  } catch (error) {
    console.error('Erro:', error);
  }
}

main();