import React, { useState, useEffect } from 'react';
import axios from 'axios';
import formatarValor from '../Vendas/FormatarValor';

import './ConsultaVendas.css';

function ConsultaVendas() {
    const [dataVenda, setDataVenda] = useState('');
    const [vendas, setVendas] = useState([]); // Inicializa como array vazio
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

        // Define a data atual como valor padrão ao carregar o componente
        useEffect(() => {
            const dataAtual = new Date();
            const dia = String(dataAtual.getDate()).padStart(2, '0');
            const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
            const ano = dataAtual.getFullYear();
            setDataVenda(`${ano}-${mes}-${dia}`);
        }, []);

    const buscarVendas = async () => {
        if (!dataVenda) {
            alert('Por favor, insira uma data para buscar as vendas.');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const response = await axios.post(`http://${import.meta.env.VITE_SERVER_IP}:3001/api/vendas/consultar`, { data: dataVenda });
            setVendas(response.data.vendas || []); // Garante que seja um array
        } catch (err) {
            console.error('Erro ao buscar as vendas:', err);
            setError('Não foi possível buscar as vendas. Tente novamente.');
            setVendas([]); // Limpa as vendas em caso de erro
        } finally {
            setLoading(false);
        }
    };

    const abrirProdutosEmNovaAba = (venda) => {
        const produtosHTML = `
            <html>
                <head>
                    <title>Relatório da Venda ${venda.id_venda}</title>
                    <link rel="stylesheet" href="/RelatorioVendas.css" />
                </head>
                <body>
                    <h7>Esse cupom não tem valor fiscal</h7>
                    <div class="consulta-vendas">
                        <img src="budgeting.gif" class="consulta-vendas-icon">
                        <div class="consulta-vendas-informacoes">
                            <h2>Relatório da Venda #${venda.id_venda}</h2>
                            <div class="consulta-vendas-box">
                                <div class="consulta-vendas-minibox">
                                    <p>Data: ${venda.data}</p>
                                    <p>Hora: ${venda.hora}</p>
                                </div>
                                <div class="consulta-vendas-minibox">
                                    <p>Valor Total da Compra: ${formatarValor(venda.valor_total)}</p>
                                    <p>Valor Recebido: ${formatarValor(venda.valor_recebido)}</p>
                                    <p>Valor de Troco: ${formatarValor(venda.valor_recebido - venda.valor_total)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Quantidade</th>
                                <th>Preço Unitário</th>
                                <th>Preço Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${venda.itens
                                .map(
                                    (item) => `
                                    <tr>
                                        <td>${item.nome_produto}</td>
                                        <td>${item.quantidade}x</td>
                                        <td>${formatarValor(item.preco_unitario)}</td>
                                        <td>${formatarValor(item.preco_unitario * item.quantidade)}</td>
                                    </tr>`
                                )
                                .join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;
        const novaAba = window.open();
        novaAba.document.write(produtosHTML);
        novaAba.document.close();
    };

    return (
        <div className="consulta-vendas-container">
            <h1>Consultar Vendas</h1>

            <div className="consulta-vendas-input-container">
                <label htmlFor="dataVenda" className="consulta-vendas-label">Selecione a data:</label>
                <input
                    type="date"
                    id="dataVenda"
                    min="2024-11-10"
                    className="consulta-vendas-input"
                    value={dataVenda}
                    onChange={(data_venda) => setDataVenda(data_venda.target.value)}
                />
                <br/>
                    <button onClick={buscarVendas} className="consulta-vendas-button" disabled={loading}>
                        {loading ? 'Carregando...' : 'Buscar Vendas'}
                    </button>
            </div>

            {error && <p className="consulta-vendas-error">{error}</p>}

            {vendas.length > 0 ? (
                <table className="consulta-vendas-table">
                    <thead>
                        <tr>
                            <th className="id-venda">ID</th>
                            <th className="data-venda">Data</th>
                            <th className="hora-venda">Hora</th>
                            <th className="valor-venda">Valor da Compra</th>
                            <th className="recebido-venda">Valor Recebido</th>
                            <th className="troco-venda">Troco</th>
                            <th className="produtos-venda">Ver Produtos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendas.map((venda) => (
                            <tr key={venda.id_venda}>
                                <td>{venda.id_venda}</td>
                                <td>{venda.data}</td>
                                <td>{venda.hora}</td>
                                <td>{formatarValor(venda.valor_total)}</td>
                                <td>{formatarValor(venda.valor_recebido)}</td>
                                <td>{formatarValor(venda.valor_recebido - venda.valor_total)}</td>
                                <td className='td-ver-produtos-icon'>
                                    <img 
                                        src="caixa-selecao-static.jpg" // imagem estática do GIF
                                        alt="Ver Produtos" 
                                        className="ver-produtos-icon" 
                                        onClick={() => abrirProdutosEmNovaAba(venda)} 
                                        onMouseOver={(e) => e.currentTarget.src = 'caixa-selecao.gif'} // muda para GIF animado
                                        onMouseOut={(e) => e.currentTarget.src = 'caixa-selecao-static.jpg'} // volta para imagem estática
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="consulta-vendas-mensagem">Nenhuma venda encontrada para a data selecionada.</p>
            )}
        </div>
    );
}

export default ConsultaVendas;
