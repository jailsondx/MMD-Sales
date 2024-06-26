import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Table, Alert } from 'react-bootstrap';
import BotaoRemover from '../Button Remover da Lista/ButtonRemover';
import { Beforeunload } from 'react-beforeunload';


import './Vendas.css';

function FormataValor(valor, char_troca, char_novo) {
    return valor.replace(char_troca, char_novo);
}

function FormataTotal(valor) {
    let partes = valor.toString().split(".");
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return partes.join(",");
}

const TelaVendas = () => {
    const [barcode, setBarcode] = useState('');
    const [produtos, setProdutos] = useState([]);
    const [total, setTotal] = useState(0);
    const [quantidade, setQuantidade] = useState(1);
    const [error, setError] = useState('');
    const [aviso, setAviso] = useState('');
    const [multiplicador, setMultiplicador] = useState(1);
    

    const handleSearch = async (event) => {
        event.preventDefault();
        setAviso('');
        setError('');

        if (!barcode) {
            setError('Código de barras não pode ser vazio.');
            return;
        }

        // Verifica se o input é um único dígito
        if (barcode.length <= 3 && !isNaN(barcode)) {
            setMultiplicador(parseInt(barcode, 10));
            setQuantidade(parseInt(barcode, 10));
            setBarcode('');
            setAviso('O Proximo produto será adicionado na quantidade de: ' + barcode + 'x');
            return;
        }

        try {
            const response = await axios.get(`http://${import.meta.env.VITE_SERVER_IP}:3001/api/produtos/vendas`, {
                params: { barcode }
            });

            const produto = response.data[0]; // Ajuste aqui para pegar o primeiro item da lista
            if (!produto) {
                setError('Produto não encontrado.');
                setBarcode('');
                return;
            }

            console.log('Produto:', produto);

            if(multiplicador > 1){
                // Multiplica o preço pelo multiplicador
                const precoOriginal = parseFloat(produto.prod_preco.replace(',', '.'));
                produto.unidade_preco = produto.prod_preco;
                const precoMultiplicado = precoOriginal * multiplicador;
                produto.prod_preco = precoMultiplicado.toFixed(2).toString().replace('.', ',');

                produto.quantidade = multiplicador;

                setProdutos([...produtos, produto]);
                setTotal(prevTotal => prevTotal + precoMultiplicado);
                setBarcode('');
                setMultiplicador(1); // Resetar o multiplicador após usar
                setQuantidade(1); // Resetar a quantidade após usar
            } else {
                //const precoOriginal = parseFloat(produto.prod_preco.replace(',', '.'));
                const precoMultiplicado = produto.prod_preco * multiplicador;
                produto.unidade_preco = produto.prod_preco;
                produto.prod_preco = precoMultiplicado.toFixed(2).toString().replace('.', ',');

                produto.quantidade = multiplicador;

                setProdutos([...produtos, produto]);
                setTotal(prevTotal => prevTotal + precoMultiplicado);
                setBarcode('');
                setMultiplicador(1); // Resetar o multiplicador após usar
                setQuantidade(1); // Resetar a quantidade após usar
            }
            
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            setError('Erro ao buscar produto. Verifique o código de barras e o servidor.');
        }
    };

    const handleRemove = (index) => {
        const produtoRemovido = produtos[index];
        const precoRemovido = parseFloat(produtoRemovido.prod_preco.replace(',', '.'));
        setTotal(prevTotal => prevTotal - precoRemovido);

        const novosProdutos = produtos.filter((_, i) => i !== index);
        setProdutos(novosProdutos);
    };

    return (
        <div className='Tela-Vendas'>

            <Beforeunload onBeforeunload={(event) => {
                if (produtos.length > 0) {
                    event.preventDefault();
                    //setOpenDialog(true);
                    return "Deseja mesmo cancelar a venda?";
                }
            }} />


            <h1>Tela de Vendas</h1>
            {aviso && <Alert variant="warning">{aviso}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            
            <div className='form-Adicao-Produto'>
                <Form onSubmit={handleSearch}>
                    <Form.Group controlId="formBarcode">
                        <Form.Label>Código de Barras</Form.Label>
                        <Form.Control
                            className='input-Adicao-Produto'
                            type="number"
                            value={barcode}
                            onChange={(event) => setBarcode(event.target.value)}
                        />
                    </Form.Group>
                </Form>
            </div>

            <div className='text-Total'>
                Total: <b>R$ {FormataTotal(total.toFixed(2))}</b>
            </div>
            
            <h2>Produtos</h2>
            <div className='table-Lista-Produtos-Venda'>
                <table>
                    <thead className='table-Head'>
                        <tr>
                            <th className='Lista-Nome-Prod'>Produto</th>
                            <th className='Lista-Quantidade'>Qtd</th>
                            <th className='Lista-Preco'>Valor Un</th>
                            <th className='Lista-Preco'>Valor Total</th>
                            <th className='Lista-Acao'>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.map((produto, index) => (
                            <tr key={produto.id}>
                                <td>
                                    {produto.prod_nome}
                                    <br />
                                    <div className='text-Venda-AddInfor'>({produto.prod_add_infor})</div>
                                </td>
                                <td>{produto.quantidade}x</td>
                                <td>R$ {FormataValor(produto.unidade_preco, '.', ',')}</td>
                                <td>R$ {FormataValor(produto.prod_preco, '.', ',')}</td>
                                <td>
                                    <BotaoRemover onClick={() => handleRemove(index)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TelaVendas;
