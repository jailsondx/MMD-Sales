const FormataValor = require("./FormataValor");

async function ListaProdutos(DBconnection, res) {
    try {
        const sql = 'SELECT * FROM produtos';
        const [rows] = await DBconnection.query(sql);

        // Manipular o valor de prod_preco
        const updatedRows = rows.map(row => {
            row.prod_preco = FormataValor(row.prod_preco,'.',',');
            return row;
        });

        res.json(updatedRows);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).send('Erro ao buscar produtos');
    }
}

module.exports = ListaProdutos;
