import React from 'react';
import { Button } from 'react-bootstrap';
import './ButtonRemover.css';

const BotaoRemover = ({ onClick }) => {
    const handleClick = (e) => {
        e.stopPropagation(); // Impede a propagação do evento para outros elementos, se necessário
        if (window.confirm('Tem certeza de que deseja remover este item?')) {
            onClick(); // Chama a função onClick apenas se o usuário confirmar
        }
    };

    return (
        <Button className='button-Remover' variant="danger" onClick={handleClick}>Remover</Button>
    );
};

export default BotaoRemover;
