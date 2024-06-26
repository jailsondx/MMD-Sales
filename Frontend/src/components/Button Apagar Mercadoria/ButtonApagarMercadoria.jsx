import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { Alert, Snackbar } from '@mui/material';

import './ButtonApagar.css'

const ButtonApagarMercadoria = ({ mercadoria, onDelete }) => {
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
            const response = await axios.delete(`http://${import.meta.env.VITE_SERVER_IP}:3001/api/mercadoria/${mercadoria.id}`);
            if (response.data === "Mercadoria apagado com sucesso!") {
                onDelete(mercadoria.id);
                setShowTemporaryModal(true);
                closeModal();
            }
        } catch (error) {
            console.error('Erro ao apagar mercadoria:', error);
            setError('Erro ao apagar mercadoria. Verifique o ID e o servidor.');
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
                <p>Tem certeza que deseja apagar o mercadoria: <b>{mercadoria.prod_nome}?</b></p>
                <Button variant="danger" onClick={handleDelete}>Confirmar</Button>
                <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
            </Modal>
            <Snackbar open={showTemporaryModal} autoHideDuration={3000} onClose={handleClose}>
                <Alert
                    className='alert-Editar'
                    severity="success">
                    Mercadoria Apagada com <b>Sucesso</b>
                </Alert>
            </Snackbar>
        </>
    );
};

export default ButtonApagarMercadoria;
