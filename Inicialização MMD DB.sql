-- Criação do banco de dados 'mmd_store'
CREATE DATABASE IF NOT EXISTS mmd_store;

-- Selecionar o banco de dados criado
USE mmd_store;

-- Criação da tabela 'produtos' com 'id' como AUTO_INCREMENT
CREATE TABLE IF NOT EXISTS produtos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,  -- Chave primária com auto incremento
    prod_nome VARCHAR(50) NOT NULL,              -- Nome do produto
    prod_cod VARCHAR(30) NOT NULL,               -- Código do produto
    prod_preco FLOAT(20) NOT NULL,               -- Preço do produto
    prod_add_infor VARCHAR(255),                  -- Informação adicional do produto
    prod_estoque INT,
    prod_tipo VARCHAR (10)
);

-- Criação da tabela 'balanca' com 'id' como AUTO_INCREMENT
CREATE TABLE IF NOT EXISTS balanca (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,  -- Chave primária com auto incremento
    prod_nome VARCHAR(50) NOT NULL,              -- Nome do produto
    prod_cod VARCHAR(30) NOT NULL,                   -- Código do produto
    prod_preco FLOAT(20)                         -- Preço do produto
);

-- Criação da tabela 'vendas' para armazenar cada venda com informações gerais
CREATE TABLE IF NOT EXISTS vendas (
    id_venda INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,  -- Identificador único para cada venda
    data DATE NOT NULL,           -- Data da venda
    time TIME NOT NULL,           -- Hora da venda
    valor_total FLOAT(20) NOT NULL,                    -- Valor total da venda
    valor_recebido FLOAT(20) NOT NULL                  -- Valor recebido pelo cliente
);


-- Criação da tabela 'itens_venda' para armazenar os itens de cada venda,
-- incluindo o nome e preço do produto no momento da venda
CREATE TABLE IF NOT EXISTS itens_venda (
    id_item INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,     -- Identificador único para cada item da venda
    id_venda INT UNSIGNED NOT NULL,                      -- Referência à venda na tabela 'vendas'
    nome_produto VARCHAR(50) NOT NULL,                   -- Nome do produto no momento da venda
    quantidade INT UNSIGNED NOT NULL,                    -- Quantidade do produto vendido
    preco_unitario FLOAT(20) NOT NULL,                   -- Preço unitário do produto no momento da venda

    -- Chave estrangeira para garantir a integridade referencial com a tabela `vendas`
    FOREIGN KEY (id_venda) REFERENCES vendas(id_venda) ON DELETE CASCADE
);


-- Apagar a tabela 'balanca'
DROP TABLE IF EXISTS balanca;

-- Apagar a tabela 'produtos'
DROP TABLE IF EXISTS produtos;

-- Apagar a tabela 'vendas'
DROP TABLE IF EXISTS vendas;

-- Apagar a tabela 'itens_venda'
DROP TABLE IF EXISTS itens_venda;

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

-- Consultar todos os dados da tabela 'vendas'
SELECT * FROM vendas;

-- Consultar todos os dados da tabela 'itens_venda'
SELECT * FROM itens_venda;

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
