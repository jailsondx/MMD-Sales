import React from 'react';
import { Modal, Form, InputGroup, Button } from 'react-bootstrap';

const ModalAdicionarProduto = ({
    showModal,
    handleModalClose,
    handleModalSave,
    valorProduto,
    setValorProduto,
    inputModalRef
}) => {
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
                            onChange={(e) => setValorProduto(e.target.value)}
                            ref={inputModalRef}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleModalSave();
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
                <Button variant="primary" onClick={handleModalSave} className="custom-modal-button-primary">
                    Adicionar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAdicionarProduto;
