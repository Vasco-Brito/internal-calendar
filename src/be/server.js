function startServer() {

    const express = require('express');
    const mysql = require('mysql');
    const app = express();
    const server = require('http').createServer(app);
    const io = require('socket.io')(server);

    // Configurar conexão com o banco de dados
    const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'calendar'
    });

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

    // Iniciar o servidor
    const port = 3000;
    server.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
    });

}


module.exports = {
    startServer
};