import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { Alert, Snackbar } from '@mui/material';

import './ButtonApagar.css'

const ButtonApagar = ({ produto, onDelete }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [error, setError] = useState('');
    const [showTemporaryModal, setShowTemporaryModal] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://${import.meta.env.VITE_SERVER_IP}:3001/api/produtos/${produto.id}`);
            if (response.data === "Produto apagado com sucesso!") {
                onDelete(produto.id);
                setShowTemporaryModal(true);
                closeModal();
            }
        } catch (error) {
            console.error('Erro ao apagar produto:', error);
            setError('Erro ao apagar produto. Verifique o ID e o servidor.');
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowTemporaryModal(false);
    };

    return (
        <>
            <Button className='button-Apagar' variant="danger" onClick={openModal}>Apagar</Button>
            <Modal className="modal-Apagar" isOpen={modalIsOpen} onRequestClose={closeModal}>
                <h2>Confirmar Exclusão</h2>
                <p>Tem certeza que deseja apagar o produto: <b>{produto.prod_nome}?</b></p>
                <Button variant="danger" onClick={handleDelete}>Confirmar</Button>
                <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
            </Modal>
            <Snackbar open={showTemporaryModal} autoHideDuration={3000} onClose={handleClose}>
                <Alert
                    className='alert-Snackbar'
                    severity="success">
                    Produto Apagado com <b>Sucesso</b> Atualize a pagina
                </Alert>
            </Snackbar>
        </>
    );
};

export default ButtonApagar;
