const { formatDate, formatTime } = require('./formatDateTime');

async function ConsultarVendas(DBconnection, dataVenda) {
    let connection;

    try {
        // Obter uma conexão do pool
        connection = await DBconnection.getConnection();

        // Consultar as vendas e seus itens pela data fornecida
        const sqlQuery = `
            SELECT 
                v.id_venda,
                v.data,
                v.time,
                v.valor_total,
                v.valor_recebido,
                i.id_item,
                i.nome_produto,
                i.quantidade,
                i.preco_unitario
            FROM vendas v
            LEFT JOIN itens_venda i ON v.id_venda = i.id_venda
            WHERE v.data = ?
            ORDER BY v.id_venda, i.id_item;
        `;

        // Executa a consulta com a data fornecida
        const [rows] = await connection.query(sqlQuery, [dataVenda]);

        // Processa os resultados para organizar as vendas e seus itens
        const vendas = [];
        let vendaAtual = null;

        for (const row of rows) {
            // Verifica se estamos em uma nova venda
            if (!vendaAtual || vendaAtual.id_venda !== row.id_venda) {
                // Se existe uma venda anterior, adiciona à lista de vendas
                if (vendaAtual) {
                    vendas.push(vendaAtual);
                }

                // Cria uma nova venda com os detalhes e uma lista para os itens
                vendaAtual = {
                    id_venda: row.id_venda,
                    data: formatDate(row.data),  // Formata a data
                    hora: row.time,  // Formata a hora
                    valor_total: row.valor_total,
                    valor_recebido: row.valor_recebido,
                    itens: []
                };
            }

            // Adiciona o item à venda atual
            if (row.id_item) { // Verifica se há itens na venda
                vendaAtual.itens.push({
                    id_item: row.id_item,
                    nome_produto: row.nome_produto,
                    quantidade: row.quantidade,
                    preco_unitario: row.preco_unitario
                });
            }
        }

        // Adiciona a última venda processada à lista
        if (vendaAtual) {
            vendas.push(vendaAtual);
        }

        // Retorna a lista de vendas formatada
        return vendas.length > 0 ? { vendas } : { mensagem: 'Nenhuma venda encontrada para essa data.' };

    } catch (error) {
        console.error('Erro ao consultar vendas:', error);
        return { erro: 'Erro ao consultar vendas.' };
    } finally {
        // Libera a conexão de volta ao pool após o uso
        if (connection) {
            connection.release();
        }
    }
}

module.exports = ConsultarVendas;
