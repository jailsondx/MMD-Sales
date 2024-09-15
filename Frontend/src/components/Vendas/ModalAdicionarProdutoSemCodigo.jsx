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
        // Remove espaços em branco e verifica se o valor é vazio ou zero
        const trimmedValue = valorProduto.trim();
        if (trimmedValue === '' || trimmedValue === '0') {
            alert('O valor do produto não pode estar vazio!');
            return;
        }
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
                <Button variant="secondary" onClick={handleModalClose} className="custom-modal-button-secondary">
                    Fechar
                </Button>
                <Button variant="primary" onClick={handleSave} className="custom-modal-button-primary">
                    Adicionar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAdicionarProdutoSemCodigo;