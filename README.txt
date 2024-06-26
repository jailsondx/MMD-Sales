#FRONTEND

--Instalar o VITE (React)
npm create vite@latest

--Instalar Axios
npm i axios

--Instalar o Router React Dom
npm install react-router-dom

--Instale o DotEnv para lidar com variaveis de ambiente
npm install dotenv

--Instalar Bootstrap
npm install react-bootstrap bootstrap

--Instalar o MterialUI
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material

--Instalar Fonte Roboto
npm install @fontsource/roboto

--Instalar o MODAL para React
npm install react-modal

--Instalar o react-beforeunload
npm install react-beforeunload


--Instale o React Imask para criar mascaras de input para moedas
npm install react-currency-input-field




#BACKEND

--Iniciar o NODEJS
npm init -y

--Instale o Express
npm i express

--Instale o CORS
npm i cors

--Instale o socket.io (se necessario)
npm i socket.io-client

--Instale o MySql
npm install mysql2

--Instale o DotEnv para lidar com variaveis de ambiente
npm install dotenv

--Instale o chalk para estilizar o console log
npm install chalk (Para versao de Modules = import)
ou
npm install chalk@4 (Para versao de CommonJS = require)

--Instale o PM2 para usar na PRODUCAO
npm install -g pm2

--Adicionar o Script de DEV
  "dev": "node --watch server.js",

--Criar o arquivo de servidor node
server.js ou index.js



#Configuracao para acessos externos de IP na mesma rede
--React VITE
  No arquivo vite.config.js adicione a seguinte configuracao no export default:
  server: {
    host: '0.0.0.0',
    port: 5173
  }

--NodeJS
  No arquivo do servidor NodeJS (Arquivo criado no inicio) adicione a seguinte configuracao:
  server.listen(PORT, '0.0.0.0',() => {
    console.log('Servidor Rodando na porta ' + PORT);
  });



  #GERAL RAIZ
  --Comando para iniciar os 2 servicos simultaneo com so 1 Comando
  npm init -y
  npm install concurrently --save-dev

  --Adicione o script de execucao
  "start": "concurrently \"npm run dev --prefix Frontend\" \"npm run dev --prefix Backend\""


  #Comandos PM2
  --Iniciar a aplicacao
  cd Backend
  pm2 start server.js --name "mmd-sales-backend"

  --Salve a configuração atual do PM2:
  pm2 save

  --Configure o PM2 para iniciar automaticamente na inicialização do sistema:
  pm2 startup

  --Reiniciar a Aplicação Automaticamente em Caso de Falhas:
  pm2 restart mmd-sales-backend

  --Monitorar a Aplicação:
  pm2 logs
  pm2 monit


