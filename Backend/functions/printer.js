const { printer: ThermalPrinter, types: PrinterTypes } = require('node-thermal-printer');
const Printer = require('printer');
const formatarPreco = require('./formatarPreco');

require('dotenv').config({ path: '../.env' });

// Configurações da impressora
const printerName = 'ELGIN'; // Nome da impressora instalada no sistema

const Empresa = process.env.EMPRESA || 'Nome da Empresa Padrão';
const Endereco = process.env.ENDERECO || 'Endereço Padrão';

console.log(Empresa);

// Função para imprimir
function ImprimirCupom(produtos = [], total, valorRecebido, troco) {
    return new Promise((resolve, reject) => {
        // Verifica se produtos é um array
        if (!Array.isArray(produtos)) {
            console.error('Produtos deve ser um array');
            return reject({ status: 400, message: 'Produtos deve ser um array' });
        }

        // Inicializa a impressora
        const printer = new ThermalPrinter({
            type: PrinterTypes.EPSON, // Tipo da impressora (epson, star, etc.)
            interface: `//localhost/${printerName}`, // Interface da impressora
            options: {
                encoding: 'PC860_PORTUGUESE' // Define a codificação de caracteres como UTF-8
            },
            characterSet: 'PC860_PORTUGUESE',
            removeSpecialCharacters: false,
        });

        // Configurações adicionais
        printer.setTextSize(0, 0);
        printer.alignCenter();
        printer.println(Empresa);
        printer.println(Endereco);
        printer.drawLine();
        printer.println('Esse cupom não possui valor fiscal');
        printer.drawLine();
        printer.alignLeft();
        printer.println('QTD | PROD | UN | TOTAL');
        printer.println(produtos.map((produto) => {
            const precoFloat = parseFloat(produto.prod_preco.replace(',', '.'));
            const totalProduto = produto.quantidade * precoFloat;
            return `${produto.quantidade}x ${produto.prod_nome} | R$ ${produto.prod_preco} |  ${formatarPreco(totalProduto)}`;
        }).join('\n'));
        printer.drawLine();
        printer.println(`Total: ${formatarPreco(total)}`);
        printer.println(`Valor Recebido: ${formatarPreco(valorRecebido)}`);
        printer.println(`Troco: ${formatarPreco(troco)}`);
        printer.cut();

        // Envia o comando para a impressora
        Printer.printDirect({
            data: printer.getBuffer(), // Buffer com os comandos de impressão
            printer: printerName, // Nome da impressora
            type: 'RAW', // Tipo de impressão
            success: function(jobID) {
                console.log(`Impressão enviada com sucesso! Job ID: ${jobID}`);
                resolve({ status: 200, message: 'Impressão realizada com sucesso!' });
            },
            error: function(err) {
                console.error('Erro ao imprimir:', err);
                reject({ status: 500, message: 'Erro ao imprimir' });
            }
        });
    });
}

module.exports = ImprimirCupom;