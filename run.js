const webLoggin = require('./src/web/loggin');
const inovarCalendar = require('./src/be/inovarCalendar');
const server = require('./src/be/server')

async function main() {
  try {
    server.startServer()
    const token = await webLoggin.executar();
    inovarCalendar.getCalendar(token);
  } catch (error) {
    console.error('Erro:', error);
  }
}

main();