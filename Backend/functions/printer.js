const { exec } = require('child_process');
const os = require('os');
const escpos = require('escpos');
const USB = require('escpos-usb');

const printerName = '_ELGIN_I9'; // Substitua pelo nome correto
const testMessage = 'Teste de impressão via Node.js';

let printCommand;

if (os.platform() === 'win32') {
  // Windows usa escpos
  const device = new USB();
  const printer = new escpos.Printer(device);

  device.open((error) => {
    if (error) {
      console.error('Erro ao abrir a impressora:', error);
      return;
    }

    printer
      .align('ct')
      .text(testMessage)
      .cut()
      .close();
  });
} else {
  // macOS e Linux usam `lp`
  printCommand = `echo "${testMessage}" | lp -d ${printerName}`;

  exec(printCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao imprimir: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`Impressão enviada com sucesso: ${stdout}`);
  });
}