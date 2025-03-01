import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, InputGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import ModalImpressao from './ModalImpressao'; // Importe o ModalImpressao
import './Modais.css';

const ModalTroco = ({
    showTrocoModal,
    handleTrocoModalClose,
    handleTrocoCalculate,
    valorRecebido,
    setValorRecebido,
    troco,
    setTroco,
    inputTrocoRef,
    produtos,
    total
}) => {
    const [calculoFeito, setCalculoFeito] = useState(false);
    const [showPrintConfirmationModal, setShowPrintConfirmationModal] = useState(false); // Estado para controlar o modal de impressão
    const [vendaData, setVendaData] = useState(null); // Estado para armazenar os dados da venda

    const handleCalcular = () => {
        handleTrocoCalculate();
        setCalculoFeito(true);
    };

    const enviarVenda = async () => {
        try {
            // Substitui a vírgula por ponto
            let valorRecebidoFinal = valorRecebido ? valorRecebido.replace(',', '.') : '0.00';

            const vendaData = {
                produtos: produtos.map((produto) => ({
                    id: produto.id,
                    prod_nome: produto.prod_nome,
                    quantidade: produto.quantidade,
                    prod_preco: produto.prod_preco
                })),
                total: total,
                troco: troco,
                valorRecebido: valorRecebidoFinal
            };

            await axios.post(`http://${import.meta.env.VITE_SERVER_IP}:3001/api/vendas/fechar`, vendaData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Armazena os dados da venda no estado
            setVendaData(vendaData);

            handleTrocoModalClose();
            setShowPrintConfirmationModal(true); // Exibe o modal de confirmação de impressão

        } catch (error) {
            console.error("Erro ao enviar venda:", error);
            alert("Erro ao finalizar a venda. Tente novamente.");
        }
    };

    const handleFinalizarVenda = () => {
        enviarVenda();
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

    const handlePrintConfirmationModalClose = () => {
        setShowPrintConfirmationModal(false);
        //window.location.reload();
        
    }

    return (
        <>
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
                                autoComplete='off'
                                onChange={(e) => {
                                    setValorRecebido(e.target.value);
                                    setCalculoFeito(false);
                                    setTroco(null);
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
                            <span className='text-Value-Troco'>
                                <b>R$ {(isNaN(troco) || troco === null || troco === undefined) ? '0,00' : troco.toFixed(2).toString().replace('.', ',')}</b>
                            </span>
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

            {/* Modal de Confirmação de Impressão */}
            {vendaData && (
                <ModalImpressao
                    showPrintConfirmationModal={showPrintConfirmationModal}
                    handlePrintConfirmationModalClose={handlePrintConfirmationModalClose}
                    produtos={vendaData.produtos}
                    total={vendaData.total}
                    valorRecebido={vendaData.valorRecebido}
                    troco={vendaData.troco}
                />
            )}
        </>
    );
};

ModalTroco.propTypes = {
    showTrocoModal: PropTypes.bool.isRequired,
    handleTrocoModalClose: PropTypes.func.isRequired,
    handleTrocoCalculate: PropTypes.func.isRequired,
    valorRecebido: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    setValorRecebido: PropTypes.func.isRequired,
    troco: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
    setTroco: PropTypes.func.isRequired,
    inputTrocoRef: PropTypes.object.isRequired,
    produtos: PropTypes.arrayOf(PropTypes.shape({
        prod_cod: PropTypes.number.isRequired,
        prod_nome: PropTypes.string.isRequired,
        quantidade: PropTypes.number.isRequired,
        prod_preco: PropTypes.number.isRequired
    })).isRequired,
    total: PropTypes.number.isRequired
};

export default ModalTroco;