import React, { useState } from 'react';
import './PesquisaProduto.css'

const PesquisaProduto = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        onSearch(e.target.value); // Passa a consulta para a função handleSearch
    };

    return (
        <div className='Pesquisa-Prod'>
            <input className='input-Pesquisa'
                type='text'
                value={query}
                onChange={handleInputChange}
                placeholder='Pesquisar produto...'
            />
        </div>
    );
};

export default PesquisaProduto;
