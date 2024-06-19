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

--Instale o React Imask para criar mascaras de input para moedas
npm install react-currency-input-field




#Backend

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