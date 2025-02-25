import React, { useState } from 'react';
import { Modal, Form, InputGroup, Button } from 'react-bootstrap';
import axios from 'axios'; // Adicione a importação do axios
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
    produtos, // Recebe a lista de produtos vendidos
    total // Recebe o valor total da venda
}) => {
    const [calculoFeito, setCalculoFeito] = useState(false);

    const handleCalcular = () => {
        handleTrocoCalculate();
        setCalculoFeito(true);
    };

    // Função para enviar a venda para o backend
    const enviarVenda = async () => {
        try {
            // Verifica se o valorRecebido é nulo ou NaN, e se for, atribui 0.00
            const valorRecebidoFinal = (valorRecebido == '' || isNaN(valorRecebido)) ? 0.00 : valorRecebido;

            // Define o payload com os dados da venda e dos produtos
            const vendaData = {
                produtos: produtos.map((produto) => ({
                    prod_codigo: produto.prod_cod,
                    prod_nome: produto.prod_nome,
                    quantidade: produto.quantidade,
                    prod_preco: produto.prod_preco
                })),
                total: total,
                troco: troco,  // Verifique se você tem esse valor no frontend
                valorRecebido: valorRecebidoFinal  // Envia o valor final após verificação
            };

            // Faz a requisição para o backend (substitua pelo endpoint correto)
            await axios.post(`http://${import.meta.env.VITE_SERVER_IP}:3001/api/vendas/fechar`, vendaData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Após o envio da venda, recarrega a página ou redefine os dados da venda atual
            handleTrocoModalClose();
            window.location.reload(); // Recarrega a página para simular finalização da venda

        } catch (error) {
            console.error("Erro ao enviar venda:", error);
            alert("Erro ao finalizar a venda. Tente novamente.");
        }
    };

    const handleFinalizarVenda = () => {
        enviarVenda(); // Envia a venda para o backend
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
                            autoComplete='off'
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
                        onClick={handleFinalizarVenda} // Finaliza a venda
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
