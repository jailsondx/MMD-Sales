import React from 'react';
import { Button } from 'react-bootstrap';

import './ButtonRemover.css'

const BotaoRemover = ({ onClick }) => {
    return (
        <Button className='button-Remover' variant="danger" onClick={onClick}>Remover</Button>
    );
};

export default BotaoRemover;
