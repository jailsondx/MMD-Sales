import React, { useState, useRef, useEffect } from 'react';
import './PesquisaProduto.css';

const PesquisaProduto = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const searchInputRef = useRef(null);

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        onSearch(e.target.value); // Passa a consulta para a função handleSearch
    };

    return (
        <div className='Pesquisa-Prod'>
            <input
                ref={searchInputRef}
                className='input-Pesquisa'
                type='text'
                value={query}
                onChange={handleInputChange}
                placeholder='Pesquisar produto...'
            />
        </div>
    );
};

export default PesquisaProduto;
