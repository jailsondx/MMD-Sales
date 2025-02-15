const CompletaCodBarras = require('./CompletaCodBarras');
const FormataValor = require('./FormataValor');

async function CadastraMercadoriaBalanca(DBconnection, mercadoria) {

    mercadoria.codigoBalanca = CompletaCodBarras(mercadoria.codigoBalanca);
    mercadoria.nome = mercadoria.nome.toUpperCase();

    try {
        // Verificar se o código de barras já está cadastrado
        const sqlConsulta = 'SELECT prod_cod FROM balanca WHERE prod_cod = ?';
        const valuesConsulta = [mercadoria.codigoBalanca];
    
        // Executando a consulta
        const [rows] = await DBconnection.query(sqlConsulta, valuesConsulta);
    
        if (rows.length > 0) {
          return { mensagem: 'Mercadoria já Cadastrado' };
        }
      } catch (error) {
        console.error('Erro ao verificar mercadoria:', error);
        return { erro: 'Erro ao verificar mercadoria' };
      }


    try {
        // Preparando a consulta SQL
        const sqlInsert = 'INSERT INTO balanca (prod_nome, prod_cod) VALUES (?, ?)';
  
        // Valores para a consulta
        const valuesInsert = [mercadoria.nome, mercadoria.codigoBalanca];
  
        // Executando a consulta
        await DBconnection.query(sqlInsert, valuesInsert);
  
        console.log('Mercadoria de Balança Cadastrada com sucesso!');
        return { mensagem: 'Produto Cadastrado com sucesso!' };
    } catch (error) {
        console.error('Erro ao cadastrar mercadoria:', error);
        return { erro: 'Erro ao cadastrar produto' };
    } finally {
        // Fechando a conexão, se necessário
        // await DBconnection.end();
    }
}

module.exports = CadastraMercadoriaBalanca;
