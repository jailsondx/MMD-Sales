const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

function genEnvVar(localIP, envPath){

// Caminho para o arquivo .env do frontend
//const envPath = path.join(__dirname, '../../Frontend/.env');

// Ler o conteúdo do arquivo .env, se ele existir
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf-8');
}

// Atualiza ou adiciona a variável de ambiente VITE_SERVER_IP
const newEnvContent = envContent
  .split('\n')
  .filter(line => !line.startsWith('VITE_SERVER_IP='))
  .concat('VITE_SERVER_IP='+localIP)
  .join('\n');

// Escrever o conteúdo atualizado de volta ao arquivo .env
fs.writeFileSync(envPath, newEnvContent, 'utf-8');

}

module.exports = genEnvVar;