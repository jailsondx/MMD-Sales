const thermalPrinter = require('node-thermal-printer').printer;
const Printer = require('printer');

require('dotenv').config('../.env');

// Configurações da impressora
const printerName = 'ELGIN'; // Nome da impressora instalada no sistema

const Empresa = process.env.EMPRESA || 'Nome da Empresa Padrão';
const Endereco = process.env.ENDERECO || 'Endereço Padrão';



console.log(Empresa);

// Função para imprimir
function printToThermalPrinter() {
    const printer = new thermalPrinter({
        type: 'epson', // Tipo da impressora (epson, star, etc.)
        interface: `//localhost/${printerName}`, // Interface da impressora
        options: {
            encoding: 'PC860_PORTUGUESE' // Define a codificação de caracteres como UTF-8
        },
        characterSet: 'PC860_PORTUGUESE',
        removeSpecialCharacters: false,
    });

    // Configurações adicionais
    printer.alignCenter();
    printer.println(Empresa);
    printer.println(Endereco);
    printer.drawLine();
    //printer.cut();
    printer.newLine();
    printer.newLine();
    printer.newLine();

    // Envia o comando para a impressora
    Printer.printDirect({
        data: printer.getBuffer(), // Buffer com os comandos de impressão
        printer: printerName, // Nome da impressora
        type: 'RAW', // Tipo de impressão
        success: function(jobID) {
            console.log(`Impressão enviada com sucesso! Job ID: ${jobID}`);
        },
        error: function(err) {
            console.error('Erro ao imprimir:', err);
        }
    });
}

// Executa a função de impressão
printToThermalPrinter();