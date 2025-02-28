require('dotenv').config();
const mysql = require('mysql2/promise');

const DBconnection = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '3307',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mmd_store'
});

async function testConnection() {
    try {
        const connectionTest = await DBconnection.getConnection();
        console.log('Conectado ao Banco de Dados MySql:', process.env.DB_NAME, 'em', process.env.DB_HOST);
        connectionTest.release(); // Release the connection back to the pool
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
    }
}

testConnection();

module.exports = DBconnection;
