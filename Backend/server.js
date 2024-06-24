const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const DBconnection = require('./connection');
const path = require('path');
const chalk = require('chalk');
const { performance } = require('perf_hooks');

const getLocalIPAddress = require('./functions/getLocalIPAddress');
const genEnvVar = require('./functions/GenEnv');
const CadastraProduto = require('./functions/CadastraProduto');
const ListaProdutos = require('./functions/ListaProdutos');
const AtualizaProduto = require('./functions/AtualizaProduto')
const ApagaProduto = require('./functions/ApagaProduto');
const AdicionaProduto = require('./functions/AdicionaProdutoVenda');

const PORT = 3001;
const app = express();
const server = http.createServer(app);
const startTime = performance.now();

const corsOptions = {
  origin: '*', // Permitir qualquer origem
  methods: ['GET', 'POST','PUT', 'DELETE'], // Permitir métodos HTTP especificados
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

// Rota para receber os dados
app.get('/api/produtos', (req, res) => {
  ListaProdutos(DBconnection, res);
});


// Rota PUT para atualizar um produto
app.put('/api/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const produto = req.body;

  try {
      const resAtualizaProduto = await AtualizaProduto(DBconnection, id, produto);
      
      if(resAtualizaProduto == '200'){
        res.send("Produto atualizado com sucesso!");
      } else {
        res.status(500).json({ message: 'Erro ao atualizar produto' });
      }

  } catch (error) {
      res.send("ERROR");
      //res.status(500).json({ message: 'Erro ao atualizar produto' });
  }
});


// Rota PUT para atualizar um produto
app.delete('/api/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const produto = req.body;

  try {
      const resAtualizaProduto = await ApagaProduto(DBconnection, id, produto);
      
      if(resAtualizaProduto == '200'){
        res.send("Produto apagado com sucesso!");
      } else {
        res.status(500).json({ message: 'Erro ao apagar produto' });
      }

  } catch (error) {
      res.send("ERROR");
      //res.status(500).json({ message: 'Erro ao atualizar produto' });
  }
});

// Rota para receber os dados
app.get('/api/produtos/vendas', async (req, res) => {
  const produtoAdicionado = req.query;
  //const produtoAdicionado = {barcode};

  console.log('Codigo de barras solictado', produtoAdicionado);

  //const produto = await AdicionaProduto(DBconnection, produtoAdicionado);
  const produto = await AdicionaProduto(DBconnection, produtoAdicionado,res);
  //res.json(produto);
});


// Obtém o endereço IP local
const localIP = getLocalIPAddress();

// Escreve o IP no arquivo .env
const UpdateENVFront = genEnvVar(localIP, envPathFront);
const UpdateENVBack = genEnvVar(localIP, envPathBack);


// Iniciar o servidor
server.listen(PORT, '0.0.0.0', () => {
  
  const endTime = performance.now();
  const startupTime = (endTime - startTime).toFixed(2);

  //Limpa o Console
  console.clear();
  console.log('\n',chalk.blue.bold('NodeJS'), chalk.gray('ready in'), chalk.bold(startupTime), 'ms');
  console.log(chalk.bold('  Servidor Rodando Local: ') + chalk.green('http://localhost:' + chalk.green.bold(PORT)));
  console.log(chalk.bold('  Servidor Rodando Network: ') + chalk.green('http://' + localIP + ':' + chalk.green.bold(PORT)));
});
