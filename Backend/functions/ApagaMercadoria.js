async function ApagaMercadoria(DBconnection, id) {
    try {
        // Realiza a formatação dos valores
        //produto.prod_preco = FormataValor(produto.prod_preco, ',', '.');

        // Preparando a consulta SQL
        const sql = 'DELETE FROM balanca WHERE id = ?';

        // Valores para a consulta
        const values = id;

        // Executando a consulta
        await DBconnection.query(sql, values);

        console.log('Mercadoria apagado com sucesso!');

        return "200";
    } catch (error) {
        console.error('Erro ao apagar mercadoria:', error);
        return "500";
    } finally {
        // Fechando a conexão, se necessário
        // await DBconnection.end();
    }
}

module.exports = ApagaMercadoria;
