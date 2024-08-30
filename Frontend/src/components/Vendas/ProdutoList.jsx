import React from 'react';
import BotaoRemover from '../Button Remover da Lista/ButtonRemover';

const ProdutoList = ({ produtos, handleRemove }) => {
    return (
        <div className='table-Lista-Produtos-Venda'>
            <table>
                <thead className='table-Head'>
                    <tr>
                        <th className='Lista-Nome-Prod'>Produto</th>
                        <th className='Lista-Quantidade'>Qtd</th>
                        <th className='Lista-Preco'>Valor Un</th>
                        <th className='Lista-Preco'>Valor Total</th>
                        <th className='Lista-Acao'>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {produtos.map((produto, index) => (
                        <tr key={`${produto.prod_cod}-${index}`}>
                            <td>
                                {produto.prod_nome}
                                <br />
                                <div className='text-Venda-AddInfor'>({produto.prod_add_infor})</div>
                            </td>
                            <td>{produto.quantidade}x</td>
                            <td>R$ {produto.prod_preco}</td>
                            <td>R$ {produto.valor_total}</td>
                            <td>
                                <BotaoRemover onClick={() => handleRemove(index)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProdutoList;
