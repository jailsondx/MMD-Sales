async function CadastraProduto(DBconnection, produto) {
  try {
    // Verificar se o código de barras já está cadastrado
    const sqlConsulta = 'SELECT prod_nome, prod_cod FROM produtos WHERE prod_cod = ?';
    const CodBarras = [produto.codigoBarras];

    // Executando a consulta
    const [rows] = await DBconnection.query(sqlConsulta, CodBarras);

    if (rows.length > 0) {
      // Retorna status 409 (Conflito) se o produto já estiver cadastrado
      return { status: 409, mensagem: 'Produto já Cadastrado: ' + rows[0].prod_nome };
    }
  } catch (error) {
    console.error('Erro ao verificar produto:', error);
    // Retorna status 500 (Erro interno do servidor) em caso de erro
    return { status: 500, erro: 'Erro ao verificar produto' };
  }

  try {
    // Realiza a formatação dos valores
    // Verificando se o valor de produto.preco é um número
    if (typeof produto.preco === 'string') {
      // Se for string, tenta converter para número (float)
      produto.preco = parseFloat(produto.preco.replace(',', '.'));

      // Verifica se a conversão foi bem-sucedida (não é NaN)
      if (isNaN(produto.preco)) {
        // Se não for um número válido, retorna status 400 (Bad Request)
        return { status: 400, erro: 'O preço fornecido não é válido.' };
      }
    }

    //UPPCASE no nome do produto
    produto.nome = produto.nome.toUpperCase();

    // Preparando a consulta SQL
    const sqlInsert = 'INSERT INTO produtos (prod_nome, prod_cod, prod_preco, prod_add_infor, prod_estoque, prod_tipo) VALUES (?, ?, ?, ?, ?, ?)';

    // Valores para a consulta
    const valuesInsert = [produto.nome, produto.codigoBarras, produto.preco, produto.informacoesAdicionais, produto.estoque, produto.tipo];

    // Executando a consulta
    await DBconnection.query(sqlInsert, valuesInsert);

    console.log('Produto Cadastrado com sucesso!');
    // Retorna status 200 (OK) em caso de sucesso
    return { status: 200, mensagem: 'Produto Cadastrado com sucesso!' };
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    // Retorna status 500 (Erro interno do servidor) em caso de erro
    return { status: 500, erro: 'Erro ao cadastrar produto' };
  } finally {
    // Fechando a conexão, se necessário
    // await DBconnection.end();
  }
}

module.exports = CadastraProduto;