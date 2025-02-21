async function AtualizaProduto(DBconnection, id, produto) {
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
        produto.prod_nome = produto.prod_nome.toUpperCase();

        // Preparando a consulta SQL
        const sql = 'UPDATE produtos SET prod_nome = ?, prod_cod = ?, prod_preco = ?, prod_add_infor = ? WHERE id = ?';

        // Valores para a consulta
        const values = [produto.prod_nome, produto.prod_cod, produto.prod_preco, produto.prod_add_infor, id];

        // Executando a consulta
        await DBconnection.query(sql, values);

        return { status: 200, mensagem: 'Produto Atualizado com sucesso!' };
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        return { status: 500, erro: 'Erro ao cadastrar produto' };
    } finally {
        // Fechando a conexão, se necessário
        // await DBconnection.end();
    }
}

module.exports = AtualizaProduto;
