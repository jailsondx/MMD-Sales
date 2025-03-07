import { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { Alert, Snackbar } from '@mui/material';


import './ButtonEditar.css';
import PropTypes from 'prop-types';

const ButtonEditarMercadoria = ({ mercadoria, onEdit }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [editedProduct, setEditedProduct] = useState({
        ...mercadoria
    });

    const [error, setError] = useState('');
    const [showTemporaryModal, setShowTemporaryModal] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct({ ...editedProduct, [name]: value });
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(`http://${import.meta.env.VITE_SERVER_IP}:3001/api/mercadoriasBalanca/${editedProduct.id}`, editedProduct);
            if (response.data === "Mercadoria atualizado com sucesso!") {
                onEdit(editedProduct);
                setShowTemporaryModal(true);
                closeModal();
            }
        } catch (error) {
            console.error('Erro ao editar mercadoria:', error);
            setError('Erro ao editar mercadoria. Verifique se os campos estao corretos.');
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
            <Button variant="warning" className='button-Editar' onClick={openModal}>Editar</Button>

            <Modal className="modal-Editar" isOpen={modalIsOpen} onRequestClose={closeModal}>
                <Form className='form-Editar'>
                    <h2>Editar Mercadoria</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Form.Group controlId="formNome">
                        <Form.Label>Mercadoria</Form.Label>
                        <Form.Control
                            className='input-Cadastro'
                            type="text"
                            name="prod_nome"
                            value={editedProduct.prod_nome}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formCodigo">
                        <Form.Label>Código</Form.Label>
                        <Form.Control
                            className='input-Cadastro'
                            type="number"
                            name="prod_cod"
                            value={editedProduct.prod_cod}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <span className='buttons-Modal-Group'>
                        <Button variant="primary" className='button-Modal' onClick={handleSave}>Salvar</Button>
                        <Button variant="danger" className='button-Modal' onClick={closeModal}>Cancelar</Button>
                    </span>
                </Form>
            </Modal>

            <Snackbar open={showTemporaryModal} autoHideDuration={3000} onClose={handleClose}>
                <Alert
                    className='alert-Snackbar'
                    severity="success">
                    Mercadoria Atualizado com <b>Sucesso</b>
                </Alert>
            </Snackbar>
        </>
    );
};
ButtonEditarMercadoria.propTypes = {
    mercadoria: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
};

export default ButtonEditarMercadoria;
