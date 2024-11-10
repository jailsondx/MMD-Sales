import React, { useState } from 'react';
import { Modal, Form, InputGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import { HiClipboardCopy } from "react-icons/hi";
import './Modais.css';

const ModalVerificaProduto = ({
    showModal,
    handleModalClose,
    inputModalRef,
    handleAddProduto, // Função para adicionar produto no componente pai
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [produto, setProduto] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSearch = async () => {
        setErrorMessage(''); // Limpa mensagens de erro antes de fazer a requisição
        try {
            const response = await axios.get(`http://${import.meta.env.VITE_SERVER_IP}:3001/api/produtos/verifica`, {
                params: { query: searchTerm },
            });

            if (response.data) {
                setProduto(response.data.dadosProduto); // Assume que o produto está no formato correto
                setErrorMessage('');
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setProduto([]);
                setErrorMessage('Produto não encontrado. Verifique o código ou nome e tente novamente.');
            } else {
                setProduto([]);
                setErrorMessage('Erro ao buscar o produto. Tente novamente mais tarde.');
            }
        }
    };

    const handleSelectProduto = (selectedProduto) => {
        const precoOriginal = parseFloat(String(selectedProduto.prod_preco).replace(',', '.'));
        const multiplicador = 1; // Ou defina a quantidade que você deseja adicionar, se necessário
        const precoMultiplicado = precoOriginal * multiplicador;
    
        // Crie um novo produto
        const novoProduto = {
            ...selectedProduto,
            prod_preco: precoOriginal.toFixed(2).toString().replace('.', ','),
            valor_total: precoMultiplicado.toFixed(2).toString().replace('.', ','),
            quantidade: multiplicador,
        };
    
        // Adiciona o produto na lista do componente pai
        handleAddProduto(novoProduto); // Passa o novo produto para a função do pai
    
        // Fecha o modal
        handleCloseAndClear();
    };
    

    const handleCloseAndClear = () => {
        setSearchTerm('');
        setProduto([]);
        setErrorMessage('');
        handleModalClose();
    };

    return (
        <Modal show={showModal} onHide={handleCloseAndClear} className="custom-modal">
            <Modal.Header closeButton className="custom-modal-header">
                <Modal.Title className="custom-modal-title">Pesquisar Produto</Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
                <Form.Group controlId="formPesquisaProduto">
                    <Form.Label className="custom-modal-label">Digite o código de barras ou nome do produto</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control
                            type="text"
                            value={searchTerm}
                            autoComplete="off"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            ref={inputModalRef}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                            className="custom-modal-input"
                        />
                    </InputGroup>
                </Form.Group>

                {produto.length > 0 ? (
                    <div>
                        {produto.map((item, index) => (
                            <div key={index} className='div-ProdutosExtra'>
                                <div className='div-Icon-AddProdutoExtra'>
                                    <HiClipboardCopy className='Icon'/>
                                </div>
                                <div className='div-ProdutoExtra-Add'>
                                    <p>{item.prod_nome}</p>
                                    <p>R$ {item.prod_preco}</p>
                                </div>
                                <div className='div-Button-Add'>
                                    <Button 
                                        variant="primary" 
                                        onClick={() => handleSelectProduto(item)} 
                                        className="custom-modal-button-primary"
                                    >
                                        Adicionar
                                    </Button>
                                </div>
                                <hr></hr>
                            </div>
                        ))}
                    </div>
                ) : errorMessage ? (
                    <p className="text-danger">{errorMessage}</p>
                ) : null}
            </Modal.Body>
            <Modal.Footer className="custom-modal-footer">
                <Button variant="primary" onClick={handleSearch} className="custom-modal-button-primary">
                    Pesquisar
                </Button>
                <Button variant="secondary" onClick={handleCloseAndClear} className="custom-modal-button-secondary">
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalVerificaProduto;
