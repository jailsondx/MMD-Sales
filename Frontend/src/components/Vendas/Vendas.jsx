import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import { Beforeunload } from 'react-beforeunload';
import './Vendas.css';
import FormataValor from './FormataValor';
import FormataTotal from './FormataTotal';
import ProdutoList from './ProdutoList';
import ModalAdicionarProduto from './ModalAdicionarProduto';
import ModalTroco from './ModalTroco';



const TelaVendas = () => {
    const [barcode, setBarcode] = useState('');
    const [produtos, setProdutos] = useState([]);
    const [total, setTotal] = useState(0);
    const [quantidade, setQuantidade] = useState(1);
    const [error, setError] = useState('');
    const [aviso, setAviso] = useState('');
    const [multiplicador, setMultiplicador] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [valorProduto, setValorProduto] = useState('');

    const [showTrocoModal, setShowTrocoModal] = useState(false);
    const [valorRecebido, setValorRecebido] = useState('');
    const [troco, setTroco] = useState(null);

    const inputAdicaoRef = useRef(null);
    const inputModalRef = useRef(null);
    const inputTrocoRef = useRef(null);

    useEffect(() => {
        if (inputAdicaoRef.current) {
            inputAdicaoRef.current.focus();
        }

        const handleKeyDown = (event) => {
            if (event.key === 'F2') {
                setShowModal(true);
            } else if (event.key === 'F10') {
                setShowTrocoModal(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (showModal && inputModalRef.current) {
            inputModalRef.current.focus();
        } else if (showTrocoModal && inputTrocoRef.current) {
            inputTrocoRef.current.focus();
        }
    }, [showModal, showTrocoModal]);

    const handleSearch = async (event) => {
        event.preventDefault();
        setAviso('');
        setError('');

        if (!barcode) {
            setError('Código de barras não pode ser vazio.');
            return;
        }

        if ((barcode > 0 && barcode.length <= 3) && !isNaN(barcode)) {
            setMultiplicador(parseInt(barcode, 10));
            setQuantidade(parseInt(barcode, 10));
            setBarcode('');
            setAviso('O próximo produto será adicionado na quantidade de: ' + barcode + 'x');
            return;
        }

        try {
            const response = await axios.get(`http://${import.meta.env.VITE_SERVER_IP}:3001/api/produtos/vendas`, {
                params: { barcode }
            });

            const produto = response.data[0];
            if (!produto) {
                setError('Produto não encontrado.');
                return;
            }

            const precoOriginal = parseFloat(String(produto.prod_preco).replace(',', '.'));
            const precoMultiplicado = precoOriginal * multiplicador;
            produto.prod_preco = precoOriginal.toFixed(2).toString().replace('.', ',');
            produto.valor_total = precoMultiplicado.toFixed(2).toString().replace('.', ',');
            produto.quantidade = multiplicador;

            setProdutos([...produtos, produto]);
            setTotal(prevTotal => prevTotal + precoMultiplicado);
            setBarcode('');
            setMultiplicador(1);
            setQuantidade(1);

        } catch (error) {
            console.error('CATCH: Erro ao buscar produto:', error);
            setError('Erro ao buscar produto. Verifique o código de barras e o servidor.');
        }
    };

    const handleRemove = (index) => {
        const produtoRemovido = produtos[index];
        const precoRemovido = parseFloat(String(produtoRemovido.prod_preco).replace(',', '.')) * produtoRemovido.quantidade;
        setTotal(prevTotal => prevTotal - precoRemovido);

        const novosProdutos = produtos.filter((_, i) => i !== index);
        setProdutos(novosProdutos);
    };

    const handleModalClose = () => setShowModal(false);

    const handleModalSave = () => {
        const novoProduto = {
            prod_nome: "Produto sem cod. de barras",
            prod_preco: parseFloat(valorProduto.replace(',', '.')).toFixed(2).toString().replace('.', ','),
            valor_total: parseFloat(valorProduto.replace(',', '.')).toFixed(2).toString().replace('.', ','),
            quantidade: 1
        };

        setProdutos([...produtos, novoProduto]);
        setTotal(prevTotal => prevTotal + parseFloat(valorProduto.replace(',', '.')));
        setValorProduto('');
        setShowModal(false);
    };

    const handleTrocoModalClose = () => {
        setShowTrocoModal(false);
        setValorRecebido('');
        setTroco(null);
    };

    const handleTrocoCalculate = () => {
        const valor = parseFloat(valorRecebido.replace(',', '.'));
        const trocoCalculado = valor - total;
        setTroco(trocoCalculado);
    };

    return (
        <div className='Tela-Vendas'>
            <Beforeunload onBeforeunload={(event) => {
                if (produtos.length > 0) {
                    event.preventDefault();
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
                            type="text"
                            value={barcode}
                            onChange={(event) => setBarcode(event.target.value)}
                            autoComplete='off'
                            ref={inputAdicaoRef}
                        />
                        <div className='text-Venda-AddInfor'>(F2: Adicionar produto sem código)</div>
                        <div className='text-Venda-AddInfor'>(F10: Calcular troco e finalizar venda)</div>
                    </Form.Group>
                </Form>
            </div>

            <div className='text-Total'>
                Total: <b>R$ {FormataTotal(total.toFixed(2))}</b>
            </div>

            <ProdutoList produtos={produtos} handleRemove={handleRemove} />

            <ModalAdicionarProduto
                showModal={showModal}
                handleModalClose={handleModalClose}
                handleModalSave={handleModalSave}
                valorProduto={valorProduto}
                setValorProduto={setValorProduto}
                inputModalRef={inputModalRef}
            />

            <ModalTroco
                showTrocoModal={showTrocoModal}
                handleTrocoModalClose={handleTrocoModalClose}
                handleTrocoCalculate={handleTrocoCalculate}
                valorRecebido={valorRecebido}
                setValorRecebido={setValorRecebido}
                troco={troco}
                inputTrocoRef={inputTrocoRef}
            />
        </div>
    );
};

export default TelaVendas;