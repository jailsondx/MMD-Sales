const { printer: ThermalPrinter, types: PrinterTypes } = require('node-thermal-printer');
const Printer = require('printer');
const formatarPreco = require('./formatarPreco');

require('dotenv').config({ path: '../.env' });

// Variaveis de Ambiente
const CAIXA01 = process.env.CAIXA01;
const CAIXA02 = process.env.CAIXA02;
const Empresa = process.env.EMPRESA || 'Nome da Empresa Padrão';
const Endereco = process.env.ENDERECO || 'Endereço Padrão';

//Caixa
let caixaPrinter;
let printerName;


// Função para formatar uma linha da tabela
function formatarLinha(colunas, tamanhos) {
    return colunas
        .map((coluna, index) => coluna.padEnd(tamanhos[index]))
        .join(' ');
}

// Função para imprimir
function ImprimirCupom(produtos = [], total, valorRecebido, troco, caixa) {
    return new Promise((resolve, reject) => {
        // Verifica se produtos é um array
        if (!Array.isArray(produtos)) {
            console.error('Produtos deve ser um array');
            return reject({ status: 400, message: 'Produtos deve ser um array' });
        }

        if(caixa === 'Caixa 1'){
            caixaPrinter = CAIXA01
            printerName = process.env.PRINTERNAME_CX01;
        } else if (caixa === 'Caixa 2'){
            caixaPrinter = CAIXA02
            printerName = process.env.PRINTERNAME_CX02;
        }

        console.log('CAIXA:', caixa, '| Impressora:',caixaPrinter+'/'+printerName);

        // Inicializa a impressora
        const printer = new ThermalPrinter({
            type: PrinterTypes.EPSON, // Tipo da impressora (epson, star, etc.)
            interface: `//${caixaPrinter}/${printerName}`, // Interface da impressora
            options: {
                encoding: 'PC860_PORTUGUESE' // Define a codificação de caracteres como UTF-8
            },
            characterSet: 'PC860_PORTUGUESE',
            removeSpecialCharacters: false,
        });

        // Configurações adicionais
        printer.setTextSize(0, 0); // Tamanho padrão da fonte
        printer.alignCenter();
        printer.println(Empresa);
        printer.println(Endereco);
        printer.drawLine();
        printer.println('Esse cupom não possui valor fiscal');
        printer.drawLine();

        // Cabeçalho da tabela
        const tamanhosColunas = [5, 20, 10, 10]; // Tamanhos das colunas (QTD, PRODUTO, UN, TOTAL)
        const cabecalho = formatarLinha(["QTD", "PRODUTO", "UN", "TOTAL"], tamanhosColunas);
        printer.alignLeft();
        printer.println(cabecalho);
        printer.drawLine();

        // Dados da tabela
        produtos.forEach((produto) => {
            const precoFloat = parseFloat(produto.prod_preco.replace(',', '.'));
            const totalProduto = produto.quantidade * precoFloat;
            const linha = formatarLinha(
                [
                    `${produto.quantidade}x`, // Quantidade
                    produto.prod_nome, // Nome do produto
                    `R$ ${produto.prod_preco}`, // Preço unitário
                    formatarPreco(totalProduto) // Total do produto
                ],
                tamanhosColunas
            );
            printer.println(linha);
        });

        // Rodapé
        printer.drawLine();
        printer.println(`Total: ${formatarPreco(total)}`);
        printer.println(`Recebido: ${formatarPreco(valorRecebido)}`);
        printer.println(`Troco: ${formatarPreco(troco)}`);
        printer.cut();

        // Envia o comando para a impressora
        Printer.printDirect({
            data: printer.getBuffer(), // Buffer com os comandos de impressão
            printer: printerName, // Nome da impressora
            type: 'RAW', // Tipo de impressão
            success: function (jobID) {
                console.log(`Impressão enviada com sucesso! Job ID: ${jobID}`);
                resolve({ status: 200, message: 'Impressão realizada com sucesso!' });
            },
            error: function (err) {
                console.error('Erro ao imprimir:', err);
                reject({ status: 500, message: 'Erro ao imprimir' });
            }
        });
    });
}

module.exports = ImprimirCupom;