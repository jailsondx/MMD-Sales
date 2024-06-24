const FormataValor = require('./FormataValor');

async function CadastraProduto(DBconnection, produto) {
    try {
        // Realiza a formatação dos valores
        produto.preco = FormataValor(produto.preco, ',', '.');

        // Preparando a consulta SQL
        const sql = 'INSERT INTO produtos (prod_nome, prod_cod, prod_preco, prod_add_infor) VALUES (?, ?, ?, ?)';
  
        // Valores para a consulta
        const values = [produto.nome, produto.codigoBarras, produto.preco, produto.informacoesAdicionais];
  
        // Executando a consulta
        await DBconnection.query(sql, values);
  
        console.log('Produto Cadastrado com sucesso!');
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
    } finally {
        // Fechando a conexão, se necessário
        // await DBconnection.end();
    }
}

module.exports = CadastraProduto;
