import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import './Modais.css';

const ModalImpressao = ({
    showPrintConfirmationModal,
    handlePrintConfirmationModalClose,
    produtos,
    total,
    valorRecebido,
    troco
}) => {
    const naoButtonRef = useRef(null); // Referência para o botão "NÃO"
    const [caixaSelecionada, setCaixaSelecionada] = useState('');

    // Define o foco no botão "NÃO" quando o modal é aberto
    useEffect(() => {
        if (showPrintConfirmationModal && naoButtonRef.current) {
            naoButtonRef.current.focus();
        }
    }, [showPrintConfirmationModal]);

    // Atualiza o valor da caixa selecionada sempre que o modal for aberto
    useEffect(() => {
        if (showPrintConfirmationModal) {
            const caixaSalva = localStorage.getItem('caixaSelecionada');
            if (caixaSalva) {
                setCaixaSelecionada(caixaSalva);
            } else {
                setCaixaSelecionada(''); // Caso não haja caixa selecionada
            }
        }
    }, [showPrintConfirmationModal]); // Executa sempre que o modal for aberto

    // Função para enviar os dados para o backend
    const handleImprimir = async () => {
        try {
            // Monta os dados para impressão
            const dadosParaImpressao = {
                produtos: produtos.map((produto) => ({
                    prod_codigo: produto.prod_cod,
                    prod_nome: produto.prod_nome,
                    quantidade: produto.quantidade,
                    prod_preco: produto.prod_preco
                })),
                total: total,
                valorRecebido: valorRecebido,
                troco: troco,
                caixa: caixaSelecionada
            };

            // Envia os dados para o backend
            const response = await axios.post(`http://${import.meta.env.VITE_SERVER_IP}:3001/api/vendas/impressao`, dadosParaImpressao, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                console.log('Dados enviados para impressão com sucesso');
                handlePrintConfirmationModalClose();
            } else {
                console.error('Erro ao enviar dados para impressão:', response.message);
                alert('Erro ao enviar dados para impressão. Tente novamente.');
            }
        } catch (error) {
            console.error("Erro ao enviar dados para impressão:", error);
            alert("Erro ao enviar dados para impressão. Tente novamente.");
        } finally {
            // Fecha o modal independentemente de sucesso ou falha
            handlePrintConfirmationModalClose();
        }
    };

    // Função para lidar com eventos de teclado
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === '1') {
            handlePrintConfirmationModalClose();
        } else if (e.key === '2') {
            handleImprimir();
        }
    };

    // Adiciona e remove o evento de teclado quando o modal é aberto/fechado
    useEffect(() => {
        if (showPrintConfirmationModal) {
            window.addEventListener('keydown', handleKeyDown);
        } else {
            window.removeEventListener('keydown', handleKeyDown);
        }

        // Cleanup para remover o evento quando o componente é desmontado
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [showPrintConfirmationModal]);

    return (
        <Modal show={showPrintConfirmationModal} onHide={handlePrintConfirmationModalClose} className="custom-modal">
            <Modal.Header closeButton className="custom-modal-header">
                <Modal.Title className="custom-modal-title">Confirmação de Impressão</Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
                <p>Deseja imprimir o comprovante?</p>
                <p>Caixa selecionada: {caixaSelecionada}</p>
            </Modal.Body>
            <Modal.Footer className="custom-modal-footer">
                <Button
                    ref={naoButtonRef} // Referência para o botão "NÃO"
                    variant="secondary"
                    onClick={handlePrintConfirmationModalClose}
                    className="custom-modal-button-secondary"
                >
                    1 - NÃO
                </Button>
                <Button
                    variant="primary"
                    onClick={handleImprimir} // Chama a função para enviar os dados e imprimir
                    className="custom-modal-button-primary"
                >
                    2 - SIM
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

ModalImpressao.propTypes = {
    showPrintConfirmationModal: PropTypes.bool.isRequired,
    handlePrintConfirmationModalClose: PropTypes.func.isRequired,
    produtos: PropTypes.arrayOf(PropTypes.shape({
        prod_cod: PropTypes.number.isRequired,
        prod_nome: PropTypes.string.isRequired,
        quantidade: PropTypes.number.isRequired,
        prod_preco: PropTypes.number.isRequired
    })).isRequired,
    total: PropTypes.number.isRequired,
    valorRecebido: PropTypes.number.isRequired,
    troco: PropTypes.number.isRequired
};

export default ModalImpressao;