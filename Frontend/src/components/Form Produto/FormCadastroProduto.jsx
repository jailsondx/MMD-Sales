import { useState, useRef, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Alert, Snackbar } from '@mui/material';

import './FormCadastroProduto.css';

const initialForm = {
    nome: '',
    codigoBarras: '',
    preco: '',
    estoque: '',
    tipo: "UN",
    informacoesAdicionais: ''
}

function FormCadastroProduto() {
    const [produto, setProduto] = useState(initialForm);
    const [showTemporaryModal, setShowTemporaryModal] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const nomeInputRef = useRef(null);

    useEffect(() => {
        if (nomeInputRef.current) {
            nomeInputRef.current.focus();
        }
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'preco') {
            // Regex para permitir apenas números e uma vírgula
            const regex = /^\d*\,?\d*$/;
            if (regex.test(value)) {
                setProduto(prevProduto => ({
                    ...prevProduto,
                    [name]: value
                }));
            }
        } else {
            setProduto(prevProduto => ({
                ...prevProduto,
                [name]: value
            }));
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowTemporaryModal(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        //console.clear();

        // Antes de enviar ao backend, converta o valor de preco para float
        const precoFormatado = parseFloat(produto.preco.replace(',', '.')); // Garante que seja um número

        try {
            const response = await axios.post(`http://${import.meta.env.VITE_SERVER_IP}:3001/api/CadastroProduto`, {
                produto: {
                    ...produto,
                    preco: precoFormatado // Envia como número para o backend
                }
            });

            setSnackbarMessage(response.data.mensagem || 'Produto cadastrado com sucesso');
            setSnackbarSeverity('success');
            setProduto(initialForm);
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error('Houve um erro ao cadastrar as informações!', error);

                // Trata erros de rede ou respostas com status 500
                if (error.response) {
                    // Erro retornado pelo backend (ex: status 500)
                    setSnackbarMessage(error.response.data.erro || 'Erro ao cadastrar produto');
                } else if (error.request) {
                    // Erro de rede (sem resposta do servidor)
                    setSnackbarMessage('Erro de conexão com o servidor');
                } else {
                    // Outros erros (ex: erro ao configurar a requisição)
                    setSnackbarMessage('Erro ao enviar os dados');
                }
            } else {
                console.error('Erro inesperado:', error);
                setSnackbarMessage('Erro inesperado ao enviar os dados');
            }
            setSnackbarSeverity('error');
        } finally {
            // Exibe o Snackbar
            setShowTemporaryModal(true);
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
                                        type="text"
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