import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Table, Alert } from 'react-bootstrap';
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
    const [multiplicador, setMultiplicador] = useState(1);

    const handleSearch = async (event) => {
        event.preventDefault();
        setError('');

        if (!barcode) {
            setError('Código de barras não pode ser vazio.');
            return;
        }

      // Verifica se o input é um único dígito
      if (barcode.length <= 4 && !isNaN(barcode)) {
        setMultiplicador(parseInt(barcode, 10));
        setQuantidade(parseInt(barcode, 10));
        setBarcode('');
        setError('O proximo produto será vendido na quantidade de: '+ barcode +'x');
        return;
        }

        try {
            const response = await axios.get(`http://${import.meta.env.VITE_SERVER_IP}:3001/api/produtos/vendas`, {
                params: { barcode }
            });
            
            const produto = response.data[0]; // Ajuste aqui para pegar o primeiro item da lista
            if (!produto) {
                setError('Produto não encontrado.');
                return;
            }
            
            // Multiplica o preço pelo multiplicador
            const precoOriginal = parseFloat(produto.prod_preco.replace(',', '.'));
            const precoMultiplicado = precoOriginal * multiplicador;
            produto.prod_preco = precoMultiplicado.toFixed(2).toString().replace('.', ',');

            produto.quantidade = multiplicador;

            setProdutos([...produtos, produto]);
            setTotal(prevTotal => prevTotal + precoMultiplicado);
            setBarcode('');
            setMultiplicador(1); // Resetar o multiplicador após usar
            setQuantidade(1); // Resetar a quantidade após usar
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            setError('Erro ao buscar produto. Verifique o código de barras e o servidor.');
        }
    };

    return (
        <div className='Tela-Vendas'>
            <h1>Tela de Vendas</h1>
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
                <h2>Total: R$ {FormataTotal(total.toFixed(2))}</h2>
            </div>
            
            <h2>Produtos</h2>
            <div className='table-Lista-Produtos-Venda'>
                <Table>
                    <thead>
                        <tr>
                            <th className='Lista-Nome-Prod'>Nome</th>
                            <th className='Lista-Quantidade'>Qtd</th>
                            <th className='Lista-Cod-Prod'>Código</th>
                            <th className='Lista-Preco'>Preço</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.map(produto => (
                            <tr key={produto.id}>
                                <td>
                                    {produto.prod_nome}
                                    <br />
                                    <div className='text-Venda-AddInfor'>({produto.prod_add_infor})</div>
                                </td>
                                <td>{produto.quantidade}x</td>
                                <td>{produto.prod_cod}</td>
                                <td>R${FormataValor(produto.prod_preco, '.', ',')}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default TelaVendas;
