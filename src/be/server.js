const express = require('express');
const mysql = require('mysql');
const app = express();
const server = require('http').createServer(app);

function startServer() {
  // Configurar conexão com o banco de dados
  const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'calendar'
  });

  app.use(express.json())

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

  app.post('/api/phone/msg', (req, res) => {
    const events = req.body; // Obtém a matriz de objetos enviada no corpo da solicitação
    
    console.log(events)

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

  // Iniciar o servidor
  const port = 3000;
  server.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
  });
}

module.exports = {
  startServer
};
