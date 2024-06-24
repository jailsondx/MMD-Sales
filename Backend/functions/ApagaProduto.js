const FormataValor = require('./FormataValor');

async function ApagaProduto(DBconnection, id, produto) {
    try {
        // Realiza a formatação dos valores
        //produto.prod_preco = FormataValor(produto.prod_preco, ',', '.');

        // Preparando a consulta SQL
        const sql = 'DELETE FROM produtos WHERE id = ?';

        // Valores para a consulta
        const values = id;

        // Executando a consulta
        await DBconnection.query(sql, values);

        console.log('Produto apagado com sucesso!');

        return "200";
    } catch (error) {
        console.error('Erro ao apagar produto:', error);
        return "500";
    } finally {
        // Fechando a conexão, se necessário
        // await DBconnection.end();
    }
}

module.exports = ApagaProduto;
