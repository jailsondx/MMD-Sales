const CompletaCodBarras = require('./CompletaCodBarras');
const FormataValor = require('./FormataValor');

async function CadastraMercadoriaBalanca(DBconnection, mercadoria) {
    try {

        mercadoria.codigoBarras = CompletaCodBarras(mercadoria.codigoBarras);
        mercadoria.nome = mercadoria.nome.toUpperCase();
        // Preparando a consulta SQL
        const sql = 'INSERT INTO balanca (prod_nome, prod_cod) VALUES (?, ?)';
  
        // Valores para a consulta
        const values = [mercadoria.nome, mercadoria.codigoBarras];
  
        // Executando a consulta
        await DBconnection.query(sql, values);
  
        console.log('Mercadoria de Balança Cadastrada com sucesso!');
    } catch (error) {
        console.error('Erro ao cadastrar mercadoria:', error);
    } finally {
        // Fechando a conexão, se necessário
        // await DBconnection.end();
    }
}

module.exports = CadastraMercadoriaBalanca;
