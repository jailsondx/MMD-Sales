import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Form, Alert } from 'react-bootstrap';
import { Beforeunload } from 'react-beforeunload';
import FormataTotal from '../../functions/FormataTotal';
import ProdutoList from './ProdutoList';
import ModalAdicionarProdutoSemCodigo from './ModalAdicionarProdutoSemCodigo';
import ModalTroco from './ModalTroco';
import ModalVerificaProduto from './ModalVerificaProduto';
import ModalAlert from './ModalAlert';
import './Vendas.css';

const SERVER_IP = import.meta.env.VITE_SERVER_IP;

const TelaVendas = () => {
    // Estados principais
    const [barcode, setBarcode] = useState('');
    const [produtos, setProdutos] = useState([]);
    const [total, setTotal] = useState(0);
    const [quantidade, setQuantidade] = useState(1);
    const [multiplicador, setMultiplicador] = useState(1);
    const [valorProduto, setValorProduto] = useState('');
    const [valorRecebido, setValorRecebido] = useState('');
    const [troco, setTroco] = useState(null);
    const [showAlertModal, setShowAlertModal] = useState(false);

    // Estados para avisos e erros
    const [error, setError] = useState('');
    const [aviso, setAviso] = useState('');

    // Estados para os modais
    const [showModal, setShowModal] = useState(false);
    const [showTrocoModal, setShowTrocoModal] = useState(false);
    const [showVerificaProdutoModal, setShowVerificaProduto] = useState(false);

    // Estado para armazenar produtos removidos
    const [produtosRemovidos, setProdutosRemovidos] = useState([]);

    // Refs para inputs
    const inputAdicaoRef = useRef(null);
    const inputModalRef = useRef(null);
    const inputTrocoRef = useRef(null);
    const inputVerProdutoRef = useRef(null);

    // Foca no campo de adição de produto quando o componente é montado
    useEffect(() => {
        if (inputAdicaoRef.current) {
            inputAdicaoRef.current.focus();
        }

        // Função para lidar com atalhos de teclado
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'F2':
                    setShowModal(true); // Abre modal para adicionar produto sem código de barras
                    break;
                case 'F10': {
                    const caixaSelecionada = localStorage.getItem('caixaSelecionada');
                    if (!caixaSelecionada) {
                        setError('Caixa não selecionada. Por favor, selecione uma caixa antes de continuar.');
                        return;
                    }
                    setError('');
                    setShowTrocoModal(true); // Abre modal para cálculo de troco
                    break;
                }
                case 'F4':
                    setShowVerificaProduto(true); // Abre modal para verificação de produto
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Remove o listener ao desmontar o componente
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Foca no input correto quando os modais são abertos
    useEffect(() => {
        if (showModal && inputModalRef.current) {
            inputModalRef.current.focus();
        } else if (showTrocoModal && inputTrocoRef.current) {
            inputTrocoRef.current.focus();
        } else if (showVerificaProdutoModal && inputVerProdutoRef.current) {
            inputVerProdutoRef.current.focus();
        } 
    }, [showModal, showTrocoModal, showVerificaProdutoModal]);

    // Função para buscar o produto pelo código de barras
    const handleAddProduto = async (event) => {
        event.preventDefault();
        setAviso('');
        setError('');

        if (!barcode) {
            setError('Código de barras não pode ser vazio.');
            return;
        }

        // Verifica se é uma quantidade de múltiplos
        if ((barcode > 0 && barcode.length <= 3) && !isNaN(barcode)) {
            setMultiplicador(parseInt(barcode, 10));
            setQuantidade(parseInt(barcode, 10));
            setBarcode('');
            setAviso('O próximo produto será adicionado na quantidade de: ' + barcode + 'x');
            return;
        }

        // Busca produto via API
        try {
            const response = await axios.get(`http://${SERVER_IP}:3001/api/produtos/vendas`, {
                params: { barcode }
            });

            const produto = response.data[0];
            if (!produto) {
                //setError('Produto não encontrado.');
                setShowAlertModal(true);
                setBarcode('');
                return;
            }

            // Formata preço e atualiza o estado
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
            console.error('Erro ao buscar produto:', error);
            setError('Erro ao buscar produto. Verifique o código de barras e o servidor.');
        }
    };

    const handleAddProdutoExtra = (produto) => {
        setProdutos([...produtos, produto]);
        setTotal(prevTotal => prevTotal + parseFloat(produto.valor_total.replace(',', '.')));
    };
    

    // Função para remover produto
    const handleRemove = (indexProduto) => {
        const produtoParaRemover = produtos[indexProduto];

        if (produtoParaRemover) {
            const valorRemover = parseFloat(produtoParaRemover.valor_total.replace(',', '.'));
            setTotal(prevTotal => prevTotal - valorRemover);

            setProdutosRemovidos([...produtosRemovidos, produtoParaRemover]);

            const novosProdutos = produtos.filter((_, index) => index !== indexProduto);
            setProdutos(novosProdutos);

            inputAdicaoRef.current.focus();
        }
    };

    // Funções de modal
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

       // Função para fechar o modal de alerta
       const handleAlertModalClose = () => {
        setShowAlertModal(false);
    };

    return (
        <div className='Tela-Vendas'>
            <Beforeunload onBeforeunload={(event) => {
                if (produtos.length > 0) {
                    event.preventDefault();
                    return "Deseja mesmo cancelar a venda?";
                }
            }} />

            {aviso && <Alert variant="warning">{aviso}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <div className='form-Adicao-Produto'>
                <Form onSubmit={handleAddProduto}>
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
                        <div className='text-Venda-AddInfor'>(F2: Adicionar produto sem código) | (F4: Consultar produto)</div>
                        <div className='text-Venda-AddInfor'>(F5: Finalizar venda) | (F10: Calcular troco e finalizar venda)</div>
                    </Form.Group>
                </Form>
            </div>

            <div className='Divisao-Telas'>
                <div className='Tela-Esquerda'>
                    <div className='text-Total'>
                        <span>Total: </span>
                        <span><b>R$ {FormataTotal(total.toFixed(2))}</b></span>
                        <div className='produtos-removidos'>
                            <h5>Produtos Removidos:</h5>
                            <ul>
                                {produtosRemovidos.map((produto, index) => (
                                    <li className='li-produtos-removidos' key={index}>{produto.quantidade}x {produto.prod_nome}: R$ {produto.valor_total} </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className='Tela-Direita'>
                    <ProdutoList produtos={produtos} handleRemove={handleRemove} />
                </div>
            </div>

            {/* Modais */}
            <ModalAdicionarProdutoSemCodigo
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
                produtos={produtos} // Passa a lista de produtos
                total={total} // Passa o valor total
            />

            <ModalVerificaProduto
                showModal={showVerificaProdutoModal}
                handleModalClose={() => setShowVerificaProduto(false)}
                valorProduto={valorProduto}
                setValorProduto={setValorProduto}
                inputModalRef={inputVerProdutoRef}
                handleAddProduto={handleAddProdutoExtra} // Passa a função para o modal
            />

            <ModalAlert
                show={showAlertModal}
                onHide={handleAlertModalClose}
                mensagem={'Produto Não Encontrado'}
            />

        </div>
    );
};

export default TelaVendas;
