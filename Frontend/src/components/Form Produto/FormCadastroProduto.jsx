import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import CurrencyInput from 'react-currency-input-field';

import './FormCadastroProduto.css';



function FormCadastroProduto() {

    const [produto, setproduto] = useState({
        nome: '',
        codigoBarras: '',
        preco: '',
        informacoesAdicionais: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setproduto(prevproduto => ({
            ...prevproduto,
            [name]: value
        }));
    };

    const handleCurrencyChange = (value, name) => {
        setproduto(prevproduto => ({
            ...prevproduto,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        //Limpa o Console
        console.clear();
        console.table([produto]);

        try {
            const response = await axios.post(`http://${import.meta.env.VITE_SERVER_IP}:3001/api/data`, { produto });
            console.log('Resposta do Servidor:', response.data);
            alert('SUCESSO CADASTRO');
        } catch (error) {
            console.error('Houve um erro ao enviar as informacoes!', error);
        }


        // Resetar os valores dos campos
        setproduto({
            nome: '',
            codigoBarras: '',
            preco: '',
            informacoesAdicionais: ''
        });
        
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
                                <CurrencyInput
                                    className="form-control"
                                    name="preco"
                                    value={produto.preco}
                                    autoComplete='no'
                                    intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                                    onValueChange={handleCurrencyChange}
                                    placeholder="Digite o preço"
                                    required
                                />
                            </Form.Group>
                        </div>

                        <div className='formCampo'>
                            <Form.Group controlId="formInformacoesAdicionais">
                                <Form.Label>Informações Adicionais (Opcional):</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="informacoesAdicionais"
                                    className="informacoesAdicionais"
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
        </div>
    );
}

export default FormCadastroProduto;
