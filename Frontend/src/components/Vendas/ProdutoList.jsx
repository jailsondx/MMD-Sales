import BotaoRemover from '../Button Remover da Lista/ButtonRemover';
import './ProdutoList.css';
import PropTypes from 'prop-types';

const ProdutoList = ({ produtos, handleRemove }) => {
    const produtosInvertidos = [...produtos].reverse(); // Inverte a ordem dos produtos
    
    return (
        <div className='table-Lista-Produtos-Venda'>
            <table>
                <thead className='table-Head'>
                    <tr>
                        <th className='Lista-Venda-ID'>#</th> {/* Nova coluna para a ordem de adição */}
                        <th className='Lista-Venda-Nome-Prod'>Produto</th>
                        <th className='Lista-Venda-Quantidade'>Qtd</th>
                        <th className='Lista-Venda-Preco'>Valor Un</th>
                        <th className='Lista-Venda-Preco'>Valor Total</th>
                        <th className='Lista-Venda-Acao'>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {produtosInvertidos.map((produto, index) => (
                        <tr key={index}> {/* Usando o index como chave */}
                            <td>{produtos.length - index}</td> {/* Calcula o índice correto na ordem inversa */}
                            <td>
                                {produto.prod_nome}
                                {produto.prod_add_infor && (
                                    <div className='text-Venda-AddInfor'>({produto.prod_add_infor})</div>
                                )}
                            </td>
                            <td>{produto.quantidade}x</td>
                            <td>R$ {produto.prod_preco}</td>
                            <td>R$ {produto.valor_total}</td>
                            <td>
                                <BotaoRemover onClick={() => handleRemove(produtos.length - index - 1)} /> {/* Passa o index correto */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
ProdutoList.propTypes = {
    produtos: PropTypes.arrayOf(
        PropTypes.shape({
            prod_nome: PropTypes.string.isRequired,
            prod_add_infor: PropTypes.string,
            quantidade: PropTypes.number.isRequired,
            prod_preco: PropTypes.number.isRequired,
            valor_total: PropTypes.number.isRequired,
        })
    ).isRequired,
    handleRemove: PropTypes.func.isRequired,
};

export default ProdutoList;
