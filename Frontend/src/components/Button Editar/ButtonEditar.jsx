import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Alert, Snackbar } from '@mui/material';


import './ButtonEditar.css';


const ButtonEditar = ({ produto, onEdit }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [editedProduct, setEditedProduct] = useState({
        ...produto,
        // Converte o valor de 'prod_preco' para string com vírgula quando o modal é aberto
        prod_preco: produto.prod_preco.toString().replace('.', ',')
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
            // Antes de enviar ao backend, converta o valor de preco para float
            editedProduct.prod_preco = parseFloat(editedProduct.prod_preco.replace(',', '.')); // Corrige a conversão de string com vírgula

            const response = await axios.put(`http://${import.meta.env.VITE_SERVER_IP}:3001/api/produtos/${editedProduct.id}`, editedProduct);
            if (response.data === "Produto atualizado com sucesso!") {
                onEdit(editedProduct);
                setShowTemporaryModal(true);
                closeModal();
            }
        } catch (error) {
            console.error('Erro ao editar produto:', error);
            setError('Erro ao editar produto. Verifique se os campos estao corretos.');
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
                    <h2>Editar Produto</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Form.Group controlId="formNome">
                        <Form.Label>Produto</Form.Label>
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

                    <Form.Group controlId="formPreco">
                        <Form.Label>Preço</Form.Label>
                        <InputGroup className="formMoeda">
                            <InputGroup.Text>R$</InputGroup.Text>
                            <Form.Control
                                className='input-Cadastro'
                                type="text"
                                name="prod_preco"
                                value={editedProduct.prod_preco}
                                onChange={handleChange}
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group controlId="formPreco">
                        <Form.Label>Informações Adicionais</Form.Label>
                        <Form.Control
                            className='informacoesAdicionais'
                            as="textarea"
                            name="prod_add_infor"
                            value={editedProduct.prod_add_infor}
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
                    Produto Atualizado com <b>Sucesso</b>
                </Alert>
            </Snackbar>
        </>
    );
};

export default ButtonEditar;
