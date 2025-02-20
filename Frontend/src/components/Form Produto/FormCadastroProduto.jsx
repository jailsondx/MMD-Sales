import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Alert, Snackbar } from '@mui/material';

import './FormCadastroProduto.css';

function FormCadastroProduto() {
    const [produto, setProduto] = useState({
        nome: '',
        codigoBarras: '',
        preco: '',
        estoque: '', // Adicionando o estoque no estado
        tipo: "UN",
        informacoesAdicionais: ''
    });

    const nomeInputRef = useRef(null);

    useEffect(() => {
        if (nomeInputRef.current) {
            nomeInputRef.current.focus();
        }
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'preco') {
            // Substituir vírgulas por pontos, e limitar o valor ao formato de número
            //const formattedValue = value.replace(',', '.');
            setProduto(prevProduto => ({
                ...prevProduto,
                [name]: value
            }));
        } else {
            setProduto(prevProduto => ({
                ...prevProduto,
                [name]: value
            }));
        }
    };

    const [showTemporaryModal, setShowTemporaryModal] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowTemporaryModal(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.clear();
        console.table([produto]);

        // Antes de enviar ao backend, converta o valor de preco para float
        const precoFormatado = parseFloat(produto.preco.replace(',', '.')); // Garante que seja um número

        try {
            const response = await axios.post(`http://${import.meta.env.VITE_SERVER_IP}:3001/api/CadastroProduto`, {
                produto: {
                    ...produto,
                    preco: precoFormatado // Envia como número para o backend
                }
            });

            if(response.data.mensagem === 'Produto já Cadastrado'){
                setSnackbarMessage(response.data.mensagem);
                setSnackbarSeverity('error');
            } else {
                setSnackbarMessage(response.data.mensagem || 'Produto Cadastrado com Sucesso');
                setSnackbarSeverity('success');
            }

        } catch (error) {
            console.error('Houve um erro ao enviar as informacoes!', error);

            setSnackbarMessage(error.response?.data?.erro || 'Erro ao cadastrar produto');
            setSnackbarSeverity('error');
        } finally {
            setShowTemporaryModal(true);
            setProduto({
                nome: '',
                codigoBarras: '',
                preco: '',
                estoque: '',
                informacoesAdicionais: ''
            });
        }
    };

    return (
        <div className='Cad-Prod'>
            <div className='Title-Page'>
                <h1>Cadastro de Produto</h1>
            </div>
            <div className='Form-Cad-Prod'>
                <div>
                    <Form onSubmit={handleSubmit}>
                        <div className='formCampo'>
                            <Form.Group controlId="formDescricaoProduto">
                                <Form.Label>Descrição do Produto:</Form.Label>
                                <Form.Control
                                    ref={nomeInputRef}
                                    className='input-Cadastro'
                                    type="text"
                                    name="nome"
                                    autoComplete='no'
                                    value={produto.nome}
                                    onChange={handleChange}
                                    placeholder="Digite a Descrição/Nome do Produto"
                                    required
                                />
                            </Form.Group>
                        </div>

                        <div className='formCampo'>
                            <Form.Group controlId="formCodigoBarras">
                                <Form.Label>Código de Barras:</Form.Label>
                                <Form.Control
                                    className='input-Cadastro'
                                    type="number"
                                    name="codigoBarras"
                                    autoComplete='no'
                                    value={produto.codigoBarras}
                                    onChange={handleChange}
                                    placeholder="Digite o código de barras"
                                    required
                                />
                            </Form.Group>
                        </div>

                        <div className='formCampo'>
                            <Form.Group controlId="formPreco">
                                <Form.Label>Preço:</Form.Label>
                                <InputGroup className="formMoeda">
                                    <InputGroup.Text>R$</InputGroup.Text>
                                    <Form.Control
                                        className='input-Cadastro'
                                        type="text"  // Alterado para text
                                        name="preco"
                                        value={produto.preco}
                                        autoComplete='no'
                                        onChange={handleChange}
                                        placeholder="Digite o preço"
                                        required
                                    />
                                </InputGroup>
                            </Form.Group>
                        </div>

                        <div className='formCampo Inputs2'>
                            <Form.Group controlId="formEstoque">
                                <Form.Label>Estoque:</Form.Label>
                                <Form.Control
                                    className='input-Cadastro'
                                    type="number"
                                    name="estoque"
                                    value={produto.estoque}
                                    autoComplete='no'
                                    onChange={handleChange}
                                    placeholder="Digite o estoque atual"
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formUnidadeMedida">
                                <Form.Label>Unidade de Medida:</Form.Label>
                                <Form.Control
                                    as="select"
                                    className='input-Cadastro'
                                    name="tipo"
                                    value={produto.tipo} // Acompanhando a unidade de medida no estado
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="UN">UN</option>
                                    <option value="CX">CX</option>
                                </Form.Control>
                            </Form.Group>
                        </div>


                        {/* Alterando informações adicionais para input simples */}
                        <div className='formCampo'>
                            <Form.Group controlId="formInformacoesAdicionais">
                                <Form.Label>Informações Adicionais (Opcional):</Form.Label>
                                <Form.Control
                                    className="input-Cadastro"
                                    type="text"  // Alterado para input simples de texto
                                    name="informacoesAdicionais"
                                    autoComplete='no'
                                    value={produto.informacoesAdicionais}
                                    onChange={handleChange}
                                    placeholder="Digite informações adicionais"
                                />
                            </Form.Group>
                        </div>

                        <Button variant="primary" type="submit">
                            Cadastrar
                        </Button>
                    </Form>
                </div>
            </div>
            <Snackbar open={showTemporaryModal} autoHideDuration={3000} onClose={handleClose}>
                <Alert
                className='alert-Snackbar'
                severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default FormCadastroProduto;