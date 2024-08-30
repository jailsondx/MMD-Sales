import React, { useState } from 'react';
import { Modal, Form, InputGroup, Button } from 'react-bootstrap';

const ModalTroco = ({
    showTrocoModal,
    handleTrocoModalClose,
    handleTrocoCalculate,
    valorRecebido,
    setValorRecebido,
    troco,
    setTroco,
    inputTrocoRef
}) => {
    const [calculoFeito, setCalculoFeito] = useState(false);

    const handleCalcular = () => {
        handleTrocoCalculate();
        setCalculoFeito(true);
    };

    const handleFinalizarVenda = () => {
        handleTrocoModalClose();
        window.location.reload(); // Recarrega a página para simular finalização da venda
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (calculoFeito) {
                handleFinalizarVenda();
            } else {
                handleCalcular();
            }
        }
    };

    return (
        <Modal show={showTrocoModal} onHide={handleTrocoModalClose} className="custom-modal">
            <Modal.Header closeButton className="custom-modal-header">
                <Modal.Title className="custom-modal-title">Calcular Troco</Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
                <Form.Group controlId="formValorRecebido">
                    <Form.Label className="custom-modal-label">Valor Recebido</Form.Label>
                    <InputGroup className="mb-3">
                        <InputGroup.Text className="custom-modal-input-group-text">R$</InputGroup.Text>
                        <Form.Control
                            type="text"
                            value={valorRecebido}
                            onChange={(e) => {
                                setValorRecebido(e.target.value);
                                setCalculoFeito(false); // Reseta o estado do cálculo feito se o valor mudar
                                setTroco(null); // Limpa o troco quando o valor recebido é alterado
                            }}
                            ref={inputTrocoRef}
                            onKeyDown={handleKeyDown}
                            className="custom-modal-input"
                        />
                    </InputGroup>
                </Form.Group>
                {troco !== null && (
                    <div className="troco-result">
                        <span className='text-Troco'>Troco:</span>
                        <span className='text-Value-Troco'><b>R$ {troco.toFixed(2).toString().replace('.', ',')}</b></span>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer className="custom-modal-footer">
                {!calculoFeito ? (
                    <Button
                        variant="primary"
                        onClick={handleCalcular}
                        className="custom-modal-button-primary"
                    >
                        Calcular
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        onClick={handleFinalizarVenda}
                        className="custom-modal-button-primary"
                    >
                        Finalizar Venda
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default ModalTroco;
