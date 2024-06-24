const FormataValor = require('./FormataValor');

async function AtualizaProduto(DBconnection, id, produto) {
    try {
        // Realiza a formatação dos valores
        produto.prod_preco = FormataValor(produto.prod_preco, ',', '.');

        // Preparando a consulta SQL
        const sql = 'UPDATE produtos SET prod_nome = ?, prod_cod = ?, prod_preco = ?, prod_add_infor = ? WHERE id = ?';

        // Valores para a consulta
        const values = [produto.prod_nome, produto.prod_cod, produto.prod_preco, produto.prod_add_infor, id];

        // Executando a consulta
        await DBconnection.query(sql, values);

        console.log('Produto atualizado com sucesso!');

        return "200";
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        return "500";
    } finally {
        // Fechando a conexão, se necessário
        // await DBconnection.end();
    }
}

module.exports = AtualizaProduto;
