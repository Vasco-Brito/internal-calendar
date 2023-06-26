const logginGon = require('./src/web/logginGon');
const logginVas = require('./src/web/logginVas');
const inovarCalendar = require('./src/be/inovarCalendar');
const server = require('./src/be/server')

async function main() {

  try {
    server.startServer()
    //const tokenGon = await logginGon.executar();
    const tokenVas = await logginVas.executar();
    //inovarCalendar.getCalendar(tokenGon);
    
  } catch (error) {
    console.error('Erro:', error);
  }

}

main();