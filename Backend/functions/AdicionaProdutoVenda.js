const FormataValor = require("./FormataValor");

async function AdicionaProduto(DBconnection, codBarras) {
    try {
        const codigo_barras = codBarras.barcode;

        const sql = 'SELECT * FROM produtos WHERE prod_cod = ?';

        const [rows] = await DBconnection.query(sql, codigo_barras);

        // Manipular o valor de prod_preco
        const updatedRows = rows.map(row => {
            // row.prod_preco = FormataValor(row.prod_preco, '.', ',');
            return row;
        });
        
        // Log para verificar os dados após formatação
        // console.log('Dados formatados:', updatedRows);

        return updatedRows;
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        throw new Error('Erro ao buscar produtos');
    }
}

module.exports = AdicionaProduto;
