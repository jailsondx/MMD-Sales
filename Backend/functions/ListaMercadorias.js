const FormataValor = require("./FormataValor");

async function ListaMercadorias(DBconnection, res) {
    try {
        const sql = 'SELECT * FROM balanca ORDER BY id DESC';
        const [rows] = await DBconnection.query(sql);

        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar mercadorias:', error);
        res.status(500).send('Erro ao buscar mercadorias');
    }
}

module.exports = ListaMercadorias;
