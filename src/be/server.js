const express = require('express');
const mysql = require('mysql');
const app = express();
const server = require('http').createServer(app);
const Joi = require('joi');
const logginVas = require('../web/logginVas')

var APIsmsToken = null;

const smsSchema = Joi.object({
  msgFrom: Joi.string().required(),
  msgBody: Joi.string().required()
});


function startServer() {
  // Configurar conexão com o banco de dados
  const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'calendar'
  });

  app.use(express.json());

  // Conectar ao banco de dados
  db.connect(err => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
      return;
    }
    console.log('Conectado ao banco de dados MySQL');
  });

  // Rota para recuperar os eventos do banco de dados
  app.get('/events', (req, res) => {
    db.query('SELECT * FROM events', (err, results) => {
      if (err) {
        console.error('Erro ao recuperar os eventos do banco de dados:', err);
        res.status(500).json({ error: 'Erro ao recuperar os eventos' });
        return;
      }
      res.json(results);
    });
  });

  app.post('/events', (req, res) => {
    const events = req.body; // Obtém a matriz de objetos enviada no corpo da solicitação

    // Verifique se a matriz de eventos é uma matriz válida e possui pelo menos um evento
    if (!Array.isArray(events) || events.length === 0) {
      res.status(400).json({ error: 'Matriz de eventos inválida' });
      return;
    }

    const query = 'INSERT INTO events (title, description, start, end) VALUES ?';
    const values = [];

    // Construa a matriz de valores a serem inseridos na consulta SQL
    events.forEach(event => {
      const { title, description, start, end } = event;
      values.push([title, description, start, end]);
    });

    // Insira os dados dos eventos na tabela "events"
    db.query(query, [values], (err, result) => {
      if (err) {
        console.error('Erro ao inserir os eventos na tabela:', err);
        res.status(500).json({ error: 'Erro ao inserir os eventos' });
        return;
      }

      res.json({ message: 'Eventos adicionados com sucesso' });
    });
  });



  app.post('/api/phone/msg', async (req, res) => {
    const events = req.body;
  
    console.log(events);
  
    const { error, value } = smsSchema.validate(events);
    if (error) {
      console.log('Objeto inválido ' + error.details[0].message);
      res.status(400).json({ error: 'Objeto inválido ' + error.details[0].message });
      return false;
    }
  
    const regex = /cód\. de verificação (\d+)/i;
    const match = value.msgBody.match(regex);
    if (match && match[1]) {
      APIsmsToken = match[1]; // Atualiza o valor da variável APIsmsToken
    }
  
    await logginVas.applyCode(APIsmsToken);
    res.json({ message: 'Código enviado com sucesso' });
    return true;
  });

  const port = 3000;
  server.listen(port, () => {
    console.log(`Servidor ouvindo na porta ${port}`);
  });
}

module.exports = {
  startServer,
  APIsmsToken
};
