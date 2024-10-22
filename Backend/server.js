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
const CadastraMercadoriaBalanca = require('./functions/CadastraMercadoriaBalanca');
const ListaProdutos = require('./functions/ListaProdutos');
const ListaMercadorias = require('./functions/ListaMercadorias');
const AtualizaProduto = require('./functions/AtualizaProduto');
const AtualizaMercadoria = require('./functions/AtualizaMercadoria');
const ApagaProduto = require('./functions/ApagaProduto');
const ApagaMercadoria = require('./functions/ApagaMercadoria');
const AdicionaProduto = require('./functions/AdicionaProdutoVenda');
const PesquisaNaBalanca = require('./functions/PesquisaNaBalanca');
const VerificaProduto = require('./functions/VerificaProduto');


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
app.post('/api/CadastroProduto', async (req, res) => {
  const data = req.body;
  const produto = data.produto;

  // Limpa o Console
  console.clear();

  console.log('Informacoes do Produto:', produto);

  try {
    // Função que faz o cadastro no DB
    const statusCadastro = await CadastraProduto(DBconnection, produto, res);

    // Respondendo ao cliente
    res.send(statusCadastro);
  } catch (error) {
    console.error('Erro no cadastro do produto:', error);
    res.status(500).send('Erro no cadastro do produto');
  }
});


// Rota para receber os dados de Mercadorias de Balança
app.post('/api/CadastroMercadoriaBalanca', async (req, res) => {
  const data = req.body;
  const mercadoria = data.mercadoria;

  //Limpa o Console
  console.clear();

  console.log('Informacoes da Mercadoria:', mercadoria);
  try {
    // Função que faz o cadastro no DB
    const statusCadastro = await CadastraMercadoriaBalanca(DBconnection, mercadoria, res);

    // Respondendo ao cliente
    res.send(statusCadastro);
  } catch (error) {
    console.error('Erro no cadastro da mercadoria:', error);
    res.status(500).send('Erro no cadastro da mercadoria');
  }
});

// Rota para receber os dados
app.get('/api/produtos', (req, res) => {
  ListaProdutos(DBconnection, res);
});

// Rota para receber os dados
app.get('/api/mercadoriaBalanca', (req, res) => {
  ListaMercadorias(DBconnection, res);
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

// Rota PUT para atualizar uma Mercadoria de Peso
app.put('/api/mercadoriasBalanca/:id', async (req, res) => {
  const { id } = req.params;
  const mercadoria = req.body;

  try {
      const resAtualizaMercadoria = await AtualizaMercadoria(DBconnection, id, mercadoria);
      
      if(resAtualizaMercadoria == '200'){
        res.send("Mercadoria atualizado com sucesso!");
      } else {
        res.status(500).json({ message: 'Erro ao atualizar produto' });
      }

  } catch (error) {
      res.send("ERROR");
      //res.status(500).json({ message: 'Erro ao atualizar produto' });
  }
});


// Rota DELETE para APAGAR um produto
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

// Rota DELETE para APAGAR uma MERCADORIA
app.delete('/api/mercadoria/:id', async (req, res) => {
  const { id } = req.params;
  const mercadoria = req.body;

  try {
      const resAtualizaMercadoria = await ApagaMercadoria(DBconnection, id, mercadoria);
      
      if(resAtualizaMercadoria == '200'){
        res.send("Mercadoria apagado com sucesso!");
      } else {
        res.status(500).json({ message: 'Erro ao apagar mercadoria' });
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

      // Verifica se o codBarras inicia com o número 2
      if (produtoAdicionado.barcode.startsWith(2)) {
        const produto_balanca = await PesquisaNaBalanca(DBconnection,produtoAdicionado);
        console.log('BALANCA', produto_balanca);
        res.json(produto_balanca);
    } else {
        const produto = await AdicionaProduto(DBconnection, produtoAdicionado);
        console.log('PRODUTO', produto);
        res.json(produto);
    }
});

// Rota para pesquisar produtos por código de barras ou nome
app.get('/api/produtos/verifica', async (req, res) => {
  const { query } = req.query;

  try {
      const produto = await VerificaProduto(DBconnection, query);
      if (produto.length === 0) {
          return res.status(404).json({ message: 'Produto não encontrado.' });
      }

      res.json({
          success: true,
          dadosProduto: produto, // Retorna o primeiro produto encontrado
      });
  } catch (error) {
      console.error('Erro ao buscar o produto:', error);
      res.status(500).json({ success: false, message: 'Erro ao buscar o produto.' });
  }
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
