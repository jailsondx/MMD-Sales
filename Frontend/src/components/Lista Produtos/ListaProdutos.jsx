import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PesquisaProduto from '../Pesquisa Produto/PesquisaProduto';

import formatarPreco from '../../functions/FormataPreco'

import './ListaProdutos.css';
import ButtonEditar from '../Button Editar/ButtonEditar';
import ButtonApagar from '../Button Apagar/ButtonApagar';

const ListaProdutos = () => {
    const [produtos, setProdutos] = useState([]);
    const [produtosFiltrados, setProdutosFiltrados] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Número de itens por página



    // Função separada para buscar produtos
    const fetchProdutos = async () => {
        try {
            const response = await axios.get(`http://${import.meta.env.VITE_SERVER_IP}:3001/api/produtos`);
            console.log('Resposta do Servidor:', response.data);
            setProdutos(response.data);
            setProdutosFiltrados(response.data); // Inicialmente, mostrar todos os produtos
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            setError('Erro ao buscar produtos');
        }
    };

    // Chama fetchProdutos uma vez quando o componente é montado
    useEffect(() => {
        fetchProdutos();
    }, []);


    const handleSearch = (query) => {
        if (query === '') {
            setProdutosFiltrados(produtos);
        } else {
            const queryLower = query.toLowerCase();
            setProdutosFiltrados(produtos.filter(produto =>
                produto.prod_nome.toLowerCase().includes(queryLower) ||
                produto.prod_cod.toString().includes(query)
            ));
        }
        setCurrentPage(1); // Resetar para a primeira página ao buscar
    };

    // Calcular os produtos a serem exibidos na página atual
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProdutos = produtosFiltrados.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(produtosFiltrados.length / itemsPerPage);

    const handlePrevPage = () => {
        setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : prevPage));
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => (prevPage < totalPages ? prevPage + 1 : prevPage));
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    const handlePageInputChange = (event) => {
        const value = event.target.value;
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            setCurrentPage(value ? parseInt(value, 10) : '');
        }
    };

    const handlePageInputBlur = () => {
        // Garantir que o valor da página não saia do intervalo válido
        if (currentPage < 1) {
            setCurrentPage(1);
        } else if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    };

    const handlePageInputEnter = () => {
        if (currentPage > 0 && currentPage <= totalPages) {
            return;
        } else {
            setCurrentPage(1); // Resetar para a primeira página, se o número for inválido
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    const handleEdit = async (editedProduct) => {
        setProdutos(produtos.map(produto => (produto.id === editedProduct.id ? editedProduct : produto)));
        setProdutosFiltrados(produtosFiltrados.map(produto => (produto.id === editedProduct.id ? editedProduct : produto)));
        await fetchProdutos(); // Recarrega a lista após editar
    };

    const handleDelete = async (productId) => {
        setProdutos(produtos.filter(p => p.id !== productId));
        await fetchProdutos(); // Recarrega a lista após deletar
    };

    return (
        <div className='Lista-Prod'>
            <h1>Lista de Produtos</h1>
            <PesquisaProduto onSearch={handleSearch} />
            <table>
                <thead>
                    <tr>
                        <th className='Lista-ID' hidden>ID</th>
                        <th className='Lista-Nome-Prod'>Produto</th>
                        <th className='Lista-Preco'>Preço</th>
                        <th className='Lista-Cod-Prod'>Cod. Barras</th>
                        <th className='Lista-Estoque'>Estoque</th>
                        <th className='Lista-Tipo'>Tipo</th>
                        <th className='Lista-Actions'>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProdutos.map((produto) => (
                        <tr key={produto.id}>
                            <td hidden>{produto.id}</td>
                            <td>{produto.prod_nome}</td>
                            <td>{formatarPreco(produto.prod_preco)}</td>
                            <td>{produto.prod_cod}</td>
                            <td>{produto.prod_estoque}</td>
                            <td>{produto.prod_tipo}</td>
                            <td>
                                <div className='buttons-Action'>
                                    <ButtonEditar produto={produto} onEdit={handleEdit} />
                                    <ButtonApagar produto={produto} onDelete={handleDelete} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <div className='pagination-Order'>
                    <button className="button-Pagination" onClick={handlePrevPage} disabled={currentPage === 1}>
                        Anterior
                    </button>
                    <span>
                        <input
                            type="number"
                            value={currentPage || ''}
                            onChange={handlePageInputChange}
                            onBlur={handlePageInputBlur}
                            onKeyPress={(e) => e.key === 'Enter' && handlePageInputEnter()}
                            min="1"
                            max={totalPages}
                            style={{ width: '50px', textAlign: 'center' }}
                        />
                        de {totalPages}
                    </span>
                    <button className="button-Pagination" onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Próxima
                    </button>
                </div>

                <div className='pagination-Last'>
                    <button className="button-Pagination" onClick={handleLastPage} disabled={currentPage === totalPages}>
                        Última Página
                    </button>
                </div>
            </div>

        </div>
    );
};

export default ListaProdutos;
