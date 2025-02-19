const { exec } = require('child_process');
const os = require('os');

const printerName = '_ELGIN_I9'; // Substitua pelo nome correto
const testMessage = 'Teste de impressão via Node.js';

let printCommand;

if (os.platform() === 'win32') {
  // Windows usa `print` ou `notepad /p`
  printCommand = `echo ${testMessage} > temp.txt && print /D:"${printerName}" temp.txt && del temp.txt`;
} else {
  // macOS e Linux usam `lp`
  printCommand = `echo "${testMessage}" | lp -d ${printerName}`;
}

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
