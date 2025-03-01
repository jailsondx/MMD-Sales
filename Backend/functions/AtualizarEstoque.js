async function AtualizarEstoque(DBconnection, idProduto, quantidadeVendida) {
    // Verifica se o idProduto é undefined ou null, e se for, ignora o processamento
    if (idProduto === undefined || idProduto === null) {
        //console.log('Id do produto indefinido ou nulo. Ignorando a atualização de estoque.');
        return; // Ignora o processamento se o idProduto não for válido
    }

    let connection;
    
    try {
        // Obter uma conexão do pool
        connection = await DBconnection.getConnection();
        
        // Consultar o estoque atual do produto
        const sqlConsultaEstoque = 'SELECT prod_estoque FROM produtos WHERE id = ?';
        const [produto] = await connection.query(sqlConsultaEstoque, [idProduto]);
        
        if (produto.length === 0) {
            throw new Error('Produto não encontrado.');
        }

        // Verifica o estoque atual do produto
        const estoqueAtual = produto[0].prod_estoque;

        // Se a quantidade vendida for maior que o estoque atual, define o estoque como 0
        const novoEstoque = estoqueAtual < quantidadeVendida ? 0 : estoqueAtual - quantidadeVendida;

        // Atualizar o estoque do produto
        const sqlAtualizarEstoque = `
            UPDATE produtos
            SET prod_estoque = ?
            WHERE id = ?
        `;
        await connection.query(sqlAtualizarEstoque, [novoEstoque, idProduto]);

        //console.log(`Estoque do produto ${idProduto} atualizado para ${novoEstoque} com sucesso!`);
        
    } catch (error) {
        console.error('Erro ao atualizar estoque:', error);
        throw error; // Lança o erro para que a transação principal seja interrompida
    } finally {
        // Certifique-se de liberar a conexão de volta ao pool após o uso
        if (connection) {
            connection.release();
        }
    }
}

module.exports = AtualizarEstoque;
