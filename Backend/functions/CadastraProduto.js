const FormataValor = require('./FormataValor');

async function CadastraProduto(DBconnection, produto, res) {
  try {
    // Verificar se o código de barras já está cadastrado
    const sqlConsulta = 'SELECT prod_cod FROM produtos WHERE prod_cod = ?';
    const valuesConsulta = [produto.codigoBarras];

    // Executando a consulta
    const [rows] = await DBconnection.query(sqlConsulta, valuesConsulta);

    if (rows.length > 0) {
      return { mensagem: 'Produto já Cadastrado' };
    }
  } catch (error) {
    console.error('Erro ao verificar produto:', error);
    return { erro: 'Erro ao verificar produto' };
  }

  try {
    // Realiza a formatação dos valores
    // Verificando se o valor de produto.preco é um número
    if (typeof produto.preco === 'string') {
      // Se for string, tenta converter para número (float)
      produto.preco = parseFloat(produto.preco.replace(',', '.'));

      // Verifica se a conversão foi bem-sucedida (não é NaN)
      if (isNaN(produto.preco)) {
          // Se não for um número válido, você pode lançar um erro ou tratar de acordo
          throw new Error('O preço fornecido não é válido.');
      }
    }
    produto.nome = produto.nome.toUpperCase();

    // Preparando a consulta SQL
    const sqlInsert = 'INSERT INTO produtos (prod_nome, prod_cod, prod_preco, prod_add_infor, prod_estoque, prod_tipo) VALUES (?, ?, ?, ?, ?, ?)';
  
    // Valores para a consulta
    const valuesInsert = [produto.nome, produto.codigoBarras, produto.preco, produto.informacoesAdicionais, produto.estoque, produto.tipo];
  
    // Executando a consulta
    await DBconnection.query(sqlInsert, valuesInsert);
  
    console.log('Produto Cadastrado com sucesso!');
    return { mensagem: 'Produto Cadastrado com sucesso!' };
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    return { erro: 'Erro ao cadastrar produto' };
  } finally {
    // Fechando a conexão, se necessário
    // await DBconnection.end();
  }
}

module.exports = CadastraProduto;
