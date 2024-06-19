async function CadastraProduto(DBconnection, produto) {

    //await DBconnection.CreatePool();
    // Preparando a consulta SQL
    const sql = 'INSERT INTO produtos (prod_nome, prod_cod, prod_preco, prod_add_infor) VALUES (?, ?, ?, ?)';
  
    // Valores para a consulta
    const values = [produto.nome, produto.codigoBarras, produto.preco, produto.informacoesAdicionais];
  
    // Executando a consulta
    await DBconnection.query(sql, values);
  
    // Fechando a conexão
    //await DBconnection.end();
  
    console.log('Produto Cadastrado com sucesso!');
}

module.exports = CadastraProduto;
