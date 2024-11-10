import React from 'react';
import { Modal, Form, InputGroup, Button } from 'react-bootstrap';
import './Modais.css';

const ModalAdicionarProdutoSemCodigo = ({
    showModal,
    handleModalClose,
    handleModalSave,
    valorProduto,
    setValorProduto,
    inputModalRef
}) => {
    const handleSave = () => {
        // Remove espaços em branco
        const trimmedValue = valorProduto.trim();
    
        // Verifica se o valor é vazio, zero ou contém caracteres não numéricos
        if (trimmedValue === '' || trimmedValue === '0') {
            alert('O valor do produto não pode estar vazio ou ser zero!');
            return;
        }
    
        // Verifica se o valor contém apenas números (usando expressão regular)
        if (!/^\d+([.,]\d+)?$/.test(trimmedValue)) {
            alert('O valor do produto deve conter apenas números!');
            return;
        }
    
        // Se passar por todas as validações, chama a função de salvar
        handleModalSave();
    };
    

    return (
        <Modal show={showModal} onHide={handleModalClose} className="custom-modal">
            <Modal.Header closeButton className="custom-modal-header">
                <Modal.Title className="custom-modal-title">Adicionar Produto Manualmente</Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
                <Form.Group controlId="formValorProduto">
                    <Form.Label className="custom-modal-label">Valor</Form.Label>
                    <InputGroup className="mb-3">
                        <InputGroup.Text className="custom-modal-input-group-text">R$</InputGroup.Text>
                        <Form.Control
                            type="text"
                            value={valorProduto}
                            autoComplete='off'
                            onChange={(e) => setValorProduto(e.target.value)}
                            ref={inputModalRef}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSave();
                                }
                            }}
                            className="custom-modal-input"
                        />
                    </InputGroup>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer className="custom-modal-footer">
                <Button variant="primary" onClick={handleSave} className="custom-modal-button-primary">
                    Adicionar
                </Button>
                <Button variant="secondary" onClick={handleModalClose} className="custom-modal-button-secondary">
                    Fechar
                </Button>

            </Modal.Footer>
        </Modal>
    );
};

export default ModalAdicionarProdutoSemCodigo;
