import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import { Alert, Snackbar } from '@mui/material';
import './FormCadastroMercadoria.css';

function FormCadastroMercadoria() {
    // Alterando o nome para setMercadoria
    const [mercadoria, setMercadoria] = useState({
        nome: '',
        codigoBalanca: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        // Corrigindo para setMercadoria
        setMercadoria(prevMercadoria => ({
            ...prevMercadoria,
            [name]: value
        }));
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
        // Limpa o Console
        console.clear();
        console.table([mercadoria]);

        try {
            const response = await axios.post(`http://${import.meta.env.VITE_SERVER_IP}:3001/api/CadastroMercadoriaBalanca`, { mercadoria });
            console.log('Resposta do Servidor:', response.data);
            
            if(response.data.mensagem === 'Mercadoria já Cadastrado'){
                setSnackbarMessage(response.data.mensagem);
                setSnackbarSeverity('error');
            } else {
                setSnackbarMessage(response.data.mensagem || 'Mercadoria Cadastrado com Sucesso');
                setSnackbarSeverity('success');
            }

        } catch (error) {
            console.error('Houve um erro ao enviar as informações!', error);
            
            setSnackbarMessage(error.response?.data?.erro || 'Erro ao cadastrar produto');
            setSnackbarSeverity('error');
        } finally {
            setShowTemporaryModal(true);

            // Resetando os valores dos campos
            setMercadoria({
                nome: '',
                codigoBalanca: '',
            });
        }
    };

    return (
        <div className='Cad-Prod'>
            <div className='Title-Page'>
                <h1>Cadastro de Mercadorias de Balança (Peso)</h1>
            </div>
            <div className='Form-Cad-Prod'>
                <div>
                    <Form onSubmit={handleSubmit}>
                        <div className='formCampo'>
                            <Form.Group controlId="formDescricaoMercadoria">
                                <Form.Label>Descrição do Mercadoria:</Form.Label>
                                <Form.Control
                                    className='input-Cadastro'
                                    type="text"
                                    name="nome"
                                    autoComplete='no'
                                    onInput={(e) => e.target.value = e.target.value.toUpperCase()}
                                    value={mercadoria.nome}
                                    onChange={handleChange}
                                    placeholder="Digite a Descrição/Nome do Mercadoria"
                                    required
                                />
                            </Form.Group>
                        </div>

                        <div className='formCampo'>
                            <Form.Group controlId="formCodigoBarras">
                                <Form.Label>Código de Balança:</Form.Label>
                                <Form.Control
                                    className='input-Cadastro'
                                    type="number"
                                    name="codigoBalanca"
                                    autoComplete='no'
                                    value={mercadoria.codigoBalanca}
                                    onChange={handleChange}
                                    placeholder="Digite o código da balança"
                                    required
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

export default FormCadastroMercadoria;
