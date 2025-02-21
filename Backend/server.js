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
const RegistrarVenda = require('./functions/RegistrarVenda');
const ConsultarVendas = require('./functions/ConsultarVendas');


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

  try {
    // Função que faz o cadastro no DB
    const resultadoCadastro = await CadastraProduto(DBconnection, produto);

    // Usando switch-case para tratar cada status
    switch (resultadoCadastro.status) {
      case 200:
        // Produto cadastrado com sucesso
        res.status(200).json({
          mensagem: resultadoCadastro.mensagem || 'Produto Cadastrado com sucesso!'
        });
        break;

      case 400:
        // Dados inválidos (ex: preço inválido)
        res.status(400).json({
          erro: resultadoCadastro.erro || 'Dados inválidos'
        });
        break;

      case 409:
        // Produto já cadastrado
        res.status(409).json({
          erro: resultadoCadastro.mensagem || 'Produto já Cadastrado'
        });
        break;

      case 500:
        // Erro interno do servidor
        res.status(500).json({
          erro: resultadoCadastro.erro || 'Erro interno ao cadastrar produto'
        });
        break;

      default:
        // Status não tratado especificamente
        res.status(resultadoCadastro.status).json({
          erro: resultadoCadastro.mensagem || resultadoCadastro.erro || 'Resposta inesperada do servidor'
        });
    }
  } catch (error) {
    console.error('Erro no cadastro do produto:', error);

    // Em caso de erro inesperado, retorna status 500 (Erro interno do servidor)
    res.status(500).json({
      erro: 'Erro no cadastro do produto'
    });
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
      
       // Usando switch-case para tratar cada status
    switch (resAtualizaProduto.status) {
      case 200:
        // Produto cadastrado com sucesso
        res.status(200).json({
          mensagem: resAtualizaProduto.mensagem || 'Produto Atualizado com sucesso!'
        });
        break;

      case 400:
        // Dados inválidos (ex: preço inválido)
        res.status(400).json({
          erro: resAtualizaProduto.erro || 'Dados inválidos'
        });
        break;

      case 409:
        // Produto já cadastrado
        res.status(409).json({
          erro: resAtualizaProduto.mensagem || 'Produto já Cadastrado'
        });
        break;

      case 500:
        // Erro interno do servidor
        res.status(500).json({
          erro: resAtualizaProduto.erro || 'Erro interno ao atualizar o produto'
        });
        break;

      default:
        // Status não tratado especificamente
        res.status(resultadoCadastro.status).json({
          erro: resultadoCadastro.mensagem || resultadoCadastro.erro || 'Resposta inesperada do servidor'
        });
    }
  } catch (error) {
    console.error('Erro no editar o produto:', error);

    // Em caso de erro inesperado, retorna status 500 (Erro interno do servidor)
    res.status(500).json({
      erro: 'Erro na atualização do produto'
    });
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
        //console.log('BALANCA', produto_balanca);
        res.json(produto_balanca);
    } else {
        const produto = await AdicionaProduto(DBconnection, produtoAdicionado);
        //console.log('PRODUTO', produto);
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




app.post('/api/vendas/fechar', async (req, res) => {
  const { produtos, total, troco, valorRecebido } = req.body;

  // Verifica se os dados necessários foram passados
  if (!produtos || !Array.isArray(produtos) || produtos.length === 0) {
      return res.status(400).json({ error: 'Nenhum produto foi adicionado à venda.' });
  }

  if (total === undefined || troco === undefined || valorRecebido === undefined) {
      return res.status(400).json({ error: 'Informações incompletas da venda.' });
  }

  // Prepara os itens da venda para enviar à função RegistrarVenda
  const itensVenda = produtos.map(produto => ({
      nome: produto.prod_nome,
      quantidade: produto.quantidade,
      preco_unitario: parseFloat(produto.prod_preco.replace(',', '.'))
  }));

  try {
      // Chama a função RegistrarVenda para salvar os dados no banco
      const resultadoVenda = await RegistrarVenda(DBconnection, itensVenda, total, valorRecebido);

      // Verifica se houve erro durante o registro da venda
      if (resultadoVenda.erro) {
          return res.status(500).json({ error: resultadoVenda.erro });
      }

      // Retorna o resultado da venda registrada com sucesso
      res.json({
          message: resultadoVenda.mensagem,
          idVenda: resultadoVenda.idVenda,
          troco: troco
      });
  } catch (error) {
      console.error('Erro ao finalizar venda:', error);
      res.status(500).json({ error: 'Erro ao finalizar a venda.' });
  }
});


// Rota para consultar vendas por data
app.post('/api/vendas/consultar', async (req, res) => {
  const { data } = req.body;

  // Verifica se a data foi fornecida
  if (!data) {
      return res.status(400).json({ error: 'Data não fornecida.' });
  }

  try {
      // Chama a função para consultar as vendas
      const resultado = await ConsultarVendas(DBconnection, data);

      if (resultado.erro) {
          return res.status(500).json({ erro: resultado.erro });
      }

      res.json(resultado);
  } catch (error) {
      console.error('Erro ao consultar vendas:', error);
      res.status(500).json({ erro: 'Erro ao consultar vendas.' });
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
