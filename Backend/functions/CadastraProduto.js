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
    produto.preco = FormataValor(produto.preco, ',', '.');
    produto.nome = produto.nome.toUpperCase();

    // Preparando a consulta SQL
    const sqlInsert = 'INSERT INTO produtos (prod_nome, prod_cod, prod_preco, prod_add_infor) VALUES (?, ?, ?, ?)';
  
    // Valores para a consulta
    const valuesInsert = [produto.nome, produto.codigoBarras, produto.preco, produto.informacoesAdicionais];
  
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
