-- Criação do banco de dados 'mmd_store'
CREATE DATABASE IF NOT EXISTS mmd_store;

-- Selecionar o banco de dados criado
USE mmd_store;

-- Criação da tabela 'produtos' com 'id' como AUTO_INCREMENT
CREATE TABLE IF NOT EXISTS produtos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,  -- Chave primária com auto incremento
    prod_nome VARCHAR(50) NOT NULL,              -- Nome do produto
    prod_cod INT(20) NOT NULL,                   -- Código do produto
    prod_preco FLOAT(20) NOT NULL,               -- Preço do produto
    prod_add_infor VARCHAR(255)                  -- Informação adicional do produto
);

-- Criação da tabela 'balanca' com 'id' como AUTO_INCREMENT
CREATE TABLE IF NOT EXISTS balanca (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,  -- Chave primária com auto incremento
    prod_nome VARCHAR(50) NOT NULL,              -- Nome do produto
    prod_cod INT(20) NOT NULL,                   -- Código do produto
    prod_preco FLOAT(20)                         -- Preço do produto
);

-- Apagar a tabela 'balanca'
DROP TABLE IF EXISTS balanca;

-- Apagar a tabela 'produtos'
DROP TABLE IF EXISTS produtos;

-- Limpar (truncar) as tabelas sem remover a estrutura
TRUNCATE TABLE balanca;
TRUNCATE TABLE produtos;

-- Selecionar o banco de dados
USE mmd_store;

-- Listar todas as tabelas no banco de dados
SHOW TABLES;

-- Ver a estrutura da tabela 'produtos'
DESCRIBE produtos;

-- Ver a estrutura da tabela 'ticket' (caso exista)
DESCRIBE ticket;

-- Consultar todos os dados da tabela 'produtos'
SELECT * FROM produtos;

-- Consultar todos os dados da tabela 'balanca'
SELECT * FROM balanca;

-- Inserir dados na tabela 'balanca'
INSERT INTO balanca (prod_nome, prod_cod)
VALUES ('Test de Balanca', 123456);

-- Verificar o maior ID na tabela 'produtos'
SELECT MAX(id) FROM produtos;

-- Reiniciar o valor de AUTO_INCREMENT da tabela 'produtos'
ALTER TABLE produtos AUTO_INCREMENT = 1;

-- Renomear a coluna 'id' existente para 'old_id'
ALTER TABLE produtos CHANGE id old_id INT;

-- Remover a chave primária existente
ALTER TABLE produtos DROP PRIMARY KEY;

-- Adicionar uma nova coluna 'id' como chave primária com AUTO_INCREMENT
ALTER TABLE produtos ADD id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;

-- Remover a coluna 'old_id'
ALTER TABLE produtos DROP COLUMN old_id;
