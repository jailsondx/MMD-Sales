const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const DBconnection = require('./connection');
const path = require('path');
const getLocalIPAddress = require('./functions/getLocalIPAddress');
const genEnvVar = require('./functions/GenEnv');
const CadastraProduto = require('./functions/CadastraProduto');

const PORT = 3001;
const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: '*', // Permitir qualquer origem
  methods: ['GET', 'POST'], // Permitir métodos HTTP especificados
  allowedHeaders: ['Content-Type'], // Permitir cabeçalhos específicos
};


// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

//Inicializa Conexao com o BD
DBconnection;

// Caminho para o arquivo .env do frontend
const envPathFront = path.join(__dirname, '../Frontend/.env');

// Caminho para o arquivo .env do frontend
const envPathBack = path.join(__dirname, './.env');

// Rota para receber os dados
app.post('/api/data', (req, res) => {
  const data = req.body;
  const produto = data.produto;

  //Limpa o Console
  console.clear();

  console.log('Informacoes do Produto:', produto);
  res.send({ Status: 'Recebido com sucesso', Dados: produto });

  //Funcao que faz o cadastro no DB
  CadastraProduto(DBconnection, produto);
});

// Obtém o endereço IP local
const localIP = getLocalIPAddress();

// Escreve o IP no arquivo .env
const UpdateENVFront = genEnvVar(localIP, envPathFront);
const UpdateENVBack = genEnvVar(localIP, envPathBack);


// Iniciar o servidor
server.listen(PORT, '0.0.0.0', () => {
  //Limpa o Console
  console.clear();
  console.log('Servidor Rodando na porta ' + PORT);
  console.log(`Acesse o servidor em http://${localIP}:${PORT}`);
});
