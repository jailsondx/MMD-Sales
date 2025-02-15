async function ListaProdutos(DBconnection, res) {
    try {
        const sql = 'SELECT * FROM produtos ORDER BY prod_nome';
        const [rows] = await DBconnection.query(sql);

        // Retornar os dados diretamente sem formatação do preço
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).send('Erro ao buscar produtos');
    }
}

module.exports = ListaProdutos;
