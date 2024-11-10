const { getCurrentDate, getCurrentTime } = require('./getCurrentDateTime');

async function RegistrarVenda(DBconnection, itensVenda, valorTotal, valorRecebido) {
  let idVenda;
  let connection;

  try {
      // Obter uma conexão do pool
      connection = await DBconnection.getConnection();
      
      // Iniciar uma transação com a conexão obtida
      await connection.beginTransaction();

      // Inserir a venda na tabela `vendas` com o valor recebido
        const sqlInsertVenda = 'INSERT INTO vendas (valor_total, valor_recebido, data, time) VALUES (?, ?, ?, ?)';
        const [resultVenda] = await connection.query(sqlInsertVenda, [valorTotal, valorRecebido, getCurrentDate(), getCurrentTime()]);

      
      // Capturar o ID da venda inserida
      idVenda = resultVenda.insertId;

      // Inserir cada item da venda na tabela `itens_venda` sem o id_produto
      for (const item of itensVenda) {
          const sqlInsertItemVenda = `
              INSERT INTO itens_venda (id_venda, nome_produto, quantidade, preco_unitario)
              VALUES (?, ?, ?, ?)
          `;
          const valuesInsertItemVenda = [idVenda, item.nome, item.quantidade, item.preco_unitario];
  
          // Executa a inserção para cada item da venda
          await connection.query(sqlInsertItemVenda, valuesInsertItemVenda);
      }

      // Commit da transação, confirmando as inserções
      await connection.commit();
      console.log('Venda registrada com sucesso!');
      return { mensagem: 'Venda registrada com sucesso!', idVenda: idVenda };
      
  } catch (error) {
      // Em caso de erro, fazer rollback para reverter qualquer alteração parcial
      if (connection) {
          await connection.rollback();
      }
      console.error('Erro ao registrar venda:', error);
      return { erro: 'Erro ao registrar venda' };
  } finally {
      // Certifique-se de liberar a conexão de volta ao pool após o uso
      if (connection) {
          connection.release();
      }
  }
}



module.exports = RegistrarVenda;
