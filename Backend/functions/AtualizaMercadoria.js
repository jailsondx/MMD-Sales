async function AtualizaMercadoria(DBconnection, id, mercadoria) {
    try {

        // Preparando a consulta SQL
        const sql = 'UPDATE balanca SET prod_nome = ?, prod_cod = ? WHERE id = ?';

        // Valores para a consulta
        const values = [mercadoria.prod_nome, mercadoria.prod_cod, id];

        // Executando a consulta
        await DBconnection.query(sql, values);

        console.log('Mercadoria atualizado com sucesso!');

        return "200";
    } catch (error) {
        console.error('Erro ao atualizar mercadoria:', error);
        return "500";
    } finally {
        // Fechando a conexão, se necessário
        // await DBconnection.end();
    }
}

module.exports = AtualizaMercadoria;
