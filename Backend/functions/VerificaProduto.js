const FormataValor = require("./FormataValor");

async function VerificaProduto(DBconnection, query) {
    try {
        let sql, params;

        // Verifica se o termo de busca é um número (código de barras)
        if (!isNaN(query)) {
            // Pesquisa por código de barras
            sql = 'SELECT * FROM produtos WHERE prod_cod = ?';
            params = [query];
        } else {
            // Pesquisa por nome de produto
            sql = 'SELECT * FROM produtos WHERE prod_nome LIKE ?';
            params = [`%${query}%`];
        }

        const [rows] = await DBconnection.query(sql, params);

        // Verifica se a consulta retornou algum resultado
        if (rows.length === 0) {
            return []; // Retorna um array vazio se não houver registros
        }

        // Formata o valor do produto (se necessário)
        const updatedRows = rows.map(row => {
            row.prod_preco = FormataValor(row.prod_preco, '.', ',');
            return row;
        });

        return updatedRows;
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        throw new Error('Erro ao buscar produto');
    }
}

module.exports = VerificaProduto;
