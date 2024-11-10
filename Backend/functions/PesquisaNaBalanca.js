const FormataValor = require("./FormataValor");

async function PesquisaNaBalanca(DBconnection, codBarras) {
    const codigo_barras = codBarras.barcode;

    // Separando o código após o número 2
    let codigoProduto = codigo_barras.substring(1, 7); // 6 dígitos para o código do produto
    let valorString = codigo_barras.substring(7, 13); // 6 dígitos para o valor

    // Extraindo valor em reais e centavos
    let reais = parseInt(valorString.substring(0, 3)); // 3 primeiros dígitos como reais
    let centavosString = valorString.substring(3, 5); // 3 últimos dígitos como centavos

    // Garante que centavos tenha sempre três dígitos
    if (centavosString.length < 3) {
        centavosString = centavosString.padStart(3, '0');
    }

    let centavos = parseInt(centavosString);
    let valorTotal = reais + (centavos / 100); // Valor total em reais

    try {
        // Consulta na tabela 'balanca' no banco de dados
        const sql = 'SELECT * FROM balanca WHERE prod_cod = ?';

        const [rows] = await DBconnection.query(sql, codigoProduto);

        // Verifica se a consulta retornou algum resultado
        if (rows.length === 0) {
            return []; // Retorna um array vazio se não houver registros
        }

        // Manipular o valor de prod_preco
        const updatedRows = rows.map(row => {
            row.prod_preco = FormataValor(valorTotal.toFixed(2).toString(), '.', ',');
            return row;
        });

        const produto = {
            'Produto': updatedRows[0].prod_nome,
            'Valor Pesado': updatedRows[0].prod_preco
        };

        //console.table([produto]);
        return updatedRows;

    } catch (error) {
        console.error('Erro ao buscar produto de Balanca:', error);
        throw new Error('Erro ao buscar produto de Balanca');
    }
}

module.exports = PesquisaNaBalanca;
