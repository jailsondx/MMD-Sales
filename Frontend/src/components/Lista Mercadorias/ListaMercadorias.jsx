import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PesquisaProduto from '../Pesquisa Produto/PesquisaProduto';

import './ListaMercadorias.css';
import ButtonEditarMercadoria from '../Button Editar Mercadoria/ButtonEditarMercadoria';
import ButtonApagarMercadoria from '../Button Apagar Mercadoria/ButtonApagarMercadoria';

const ListaMercadorias = () => {
    const [mercadorias, setProdutos] = useState([]);
    const [mercadoriasFiltrados, setProdutosFiltrados] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Número de itens por página


    // Função separada para buscar mercadorias
    const fetchMercadorias = async () => {
        try {
            const response = await axios.get(`http://${import.meta.env.VITE_SERVER_IP}:3001/api/mercadoriaBalanca`);
            console.log('Resposta do Servidor:', response.data);
            setProdutos(response.data);
            setProdutosFiltrados(response.data); // Inicialmente, mostrar todos os mercadorias
        } catch (error) {
            console.error('Erro ao buscar mercadorias:', error);
            setError('Erro ao buscar mercadorias');
        }
    };

    // Chama fetchMercadorias uma vez quando o componente é montado
    useEffect(() => {
        fetchMercadorias();
    }, []);

    const handleSearch = (query) => {
        if (query === '') {
            setProdutosFiltrados(mercadorias);
        } else {
            const queryLower = query.toLowerCase();
            setProdutosFiltrados(mercadorias.filter(mercadoria =>
                mercadoria.prod_nome.toLowerCase().includes(queryLower) ||
                mercadoria.prod_cod.toString().includes(query)
            ));
        }
        setCurrentPage(1); // Resetar para a primeira página ao buscar
    };

    // Calcular os mercadorias a serem exibidos na página atual
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProdutos = mercadoriasFiltrados.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(mercadoriasFiltrados.length / itemsPerPage);

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
        setProdutos(mercadorias.map(mercadoria => (mercadoria.id === editedProduct.id ? editedProduct : mercadoria)));
        setProdutosFiltrados(mercadoriasFiltrados.map(mercadoria => (mercadoria.id === editedProduct.id ? editedProduct : mercadoria)));
        await fetchMercadorias();  // Recarrega a lista após editar
    };

    const handleDelete = async (productId) => {
        setProdutos(mercadorias.filter(p => p.id !== productId));
        await fetchMercadorias();  // Recarrega a lista após deletar
    };

    return (
        <div className='Lista-Prod'>
            <h1>Lista de Mercadorias</h1>
            <PesquisaProduto onSearch={handleSearch} />
            <table>
                <thead>
                    <tr>
                        <th className='Lista-ID' hidden>ID</th>
                        <th className='Lista-Nome-Prod'>Produto</th>
                        <th className='Lista-Cod-Prod'>Cod. Barras</th>
                        <th className='Lista-Actions'>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProdutos.map((mercadoria) => (
                        <tr key={mercadoria.id}>
                            <td hidden>{mercadoria.id}</td>
                            <td>{mercadoria.prod_nome}</td>
                            <td>{mercadoria.prod_cod}</td>
                            <td>
                                <div className='buttons-Action'>
                                <ButtonEditarMercadoria mercadoria={mercadoria} onEdit={handleEdit} />
                                <ButtonApagarMercadoria mercadoria={mercadoria} onDelete={handleDelete} />
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
                    <button className="button-Pagination"  onClick={handleLastPage} disabled={currentPage === totalPages}>
                        Última Página
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListaMercadorias;
