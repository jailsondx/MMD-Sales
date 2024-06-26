import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, InputGroup } from 'react-bootstrap';

import { Alert, Snackbar } from '@mui/material';

import './FormCadastroMercadoria.css';



function FormCadastroMercadoria() {

    const [produto, setproduto] = useState({
        nome: '',
        codigoBarras: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setproduto(prevproduto => ({
            ...prevproduto,
            [name]: value
        }));
    };

    const [showTemporaryModal, setShowTemporaryModal] = useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowTemporaryModal(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        //Limpa o Console
        console.clear();
        console.table([produto]);

        try {
            const response = await axios.post(`http://${import.meta.env.VITE_SERVER_IP}:3001/api/CadastroMercadoriaBalanca`, { produto });
            console.log('Resposta do Servidor:', response.data);
            setShowTemporaryModal(true);
        } catch (error) {
            console.error('Houve um erro ao enviar as informacoes!', error);
        }


        // Resetar os valores dos campos
        setproduto({
            nome: '',
            codigoBarras: '',
        });
        
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
                            <Form.Group controlId="formDescricaoProduto">
                                <Form.Label>Descrição do Produto:</Form.Label>
                                <Form.Control
                                    className='input-Cadastro'
                                    type="text"
                                    name="nome"
                                    autoComplete='no'
                                    oninput="this.value = this.value.toUpperCase()"
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

                        <Button variant="primary" type="submit">
                            Cadastrar
                        </Button>
                    </Form>
                </div>
            </div>
            <Snackbar open={showTemporaryModal} autoHideDuration={3000} onClose={handleClose}>
                    <Alert
                        className='alert-Editar'
                        severity="success">
                        Produto Cadastrado com <b>Sucesso</b>
                    </Alert>
                </Snackbar>
        </div>
        
    );
}

export default FormCadastroMercadoria;
