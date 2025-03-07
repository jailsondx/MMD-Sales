import { useState } from 'react';
import Modal from 'react-modal';
import axios, { AxiosError } from 'axios';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Alert, Snackbar } from '@mui/material';
import './ButtonEditar.css';
import PropTypes from 'prop-types';

const ButtonEditar = ({ produto, onEdit }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [editedProduct, setEditedProduct] = useState({
        ...produto,
        // Converte o valor de 'prod_preco' para string com vírgula quando o modal é aberto
        prod_preco: produto.prod_preco.toString().replace('.', ',')
    });

    const [error, setError] = useState('');
    const [showTemporaryModal, setShowTemporaryModal] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'prod_preco') {
            // Regex para permitir apenas números e uma vírgula
            const regex = /^\d*,?\d*$/;
            if (regex.test(value)) {
                setEditedProduct({ ...editedProduct, [name]: value });
            }
        } else {
            setEditedProduct({ ...editedProduct, [name]: value });
        }
    };

    const handleSubmit = async () => {
        try {
            // Antes de enviar ao backend, converta o valor de preco para float
            const precoFormatado = parseFloat(editedProduct.prod_preco.replace(',', '.'));

            // Verifica se a conversão foi bem-sucedida (não é NaN)
            if (isNaN(precoFormatado)) {
                setError('O preço fornecido não é válido.');
                return;
            }

            // Atualiza o valor de prod_preco no estado
            const updatedProduct = {
                ...editedProduct,
                prod_preco: precoFormatado
            };

            // Envia os dados atualizados para o backend
            const response = await axios.put(`http://${import.meta.env.VITE_SERVER_IP}:3001/api/produtos/${updatedProduct.id}`, updatedProduct);

            if (response.status === 200) {
                onEdit(updatedProduct);
                closeModal();
                setSnackbarMessage(response.data.mensagem || 'Produto atualizado com sucesso');
                setSnackbarSeverity('success');

            }
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error('Houve um erro ao cadastrar as informações!', error);
                console.log('response error:', error.data.status, error.data.mensagem);

                // Trata erros de rede ou respostas com status 500
                if (error.response) {
                    // Erro retornado pelo backend (ex: status 500)
                    setSnackbarMessage(error.response.data.erro || 'Erro ao editar produto');
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

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowTemporaryModal(false);
    };

    return (
        <>
            <Button variant="warning" className='button-Editar' onClick={openModal}>Editar</Button>

            <Modal className="modal-Editar" isOpen={modalIsOpen} onRequestClose={closeModal}>
                <Form className='form-Editar'>
                    <h2>Editar Produto</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Form.Group controlId="formNome">
                        <Form.Label>Produto</Form.Label>
                        <Form.Control
                            className='input-Cadastro'
                            type="text"
                            name="prod_nome"
                            value={editedProduct.prod_nome}
                            onChange={handleChange}
                            autoComplete='no'
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formCodigoBarras">
                                <Form.Label>Código de Barras:</Form.Label>
                                <Form.Control
                                    className='input-Cadastro'
                                    type="number"
                                    name="prod_cod"
                                    value={editedProduct.prod_cod}
                                    onChange={handleChange}
                                    placeholder="Digite o código de barras"
                                    autoComplete='no'
                                    required
                                />
                            </Form.Group>

                    <Form.Group controlId="formPreco">
                        <Form.Label>Preço</Form.Label>
                        <InputGroup className="formMoeda">
                            <InputGroup.Text>R$</InputGroup.Text>
                            <Form.Control
                                className='input-Cadastro'
                                type="text"
                                name="prod_preco"
                                value={editedProduct.prod_preco}
                                onChange={handleChange}
                                autoComplete='no'
                                required
                            />
                        </InputGroup>
                    </Form.Group>

                    <div className='formCampo Inputs2'>
                        <Form.Group controlId="formEstoque">
                            <Form.Label>Estoque:</Form.Label>
                            <Form.Control
                                className='input-Cadastro'
                                type="number"
                                name="prod_estoque"
                                value={editedProduct.prod_estoque}
                                onChange={handleChange}
                                placeholder="Digite o estoque atual"
                                autoComplete='no'
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formUnidadeMedida">
                            <Form.Label>Unidade de Medida:</Form.Label>
                            <Form.Control
                                as="select"
                                className='input-Cadastro'
                                name="tipo"
                                value={editedProduct.prod_tipo}// Acompanhando a unidade de medida no estado
                                onChange={handleChange}
                                autoComplete='no'
                                required
                            >
                                <option value="UN">UN</option>
                                <option value="CX">CX</option>
                            </Form.Control>
                        </Form.Group>
                    </div>

                    <Form.Group controlId="formPreco">
                        <Form.Label>Informações Adicionais</Form.Label>
                        <Form.Control
                            className='informacoesAdicionais'
                            as="textarea"
                            name="prod_add_infor"
                            value={editedProduct.prod_add_infor}
                            onChange={handleChange}
                            autoComplete='no'
                        />
                    </Form.Group>

                    <span className='buttons-Modal-Group'>
                        <Button variant="primary" className='button-Modal' onClick={handleSubmit}>Salvar</Button>
                        <Button variant="danger" className='button-Modal' onClick={closeModal}>Cancelar</Button>
                    </span>
                </Form>
            </Modal>
            <Snackbar open={showTemporaryModal} autoHideDuration={3000} onClose={handleClose}>
                <Alert
                    className='alert-Snackbar'
                    severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );


};

// Define a função ButtonEditar e seus parâmetros
// A função ButtonEditar recebe um objeto 'produto' e uma função 'onEdit'
ButtonEditar.propTypes = {
    produto: PropTypes.shape({
        prod_nome: PropTypes.string.isRequired,
        prod_cod: PropTypes.number.isRequired,
        prod_preco: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        prod_add_infor: PropTypes.string
    }).isRequired,
    onEdit: PropTypes.func.isRequired
};

export default ButtonEditar;