DROP DATABASE IF EXISTS faxina_db;
CREATE DATABASE faxina_db;

\c faxina_db

-- ENUMS

CREATE TYPE perfil_usuario AS ENUM ('ADMIN', 'OPERADOR');
CREATE TYPE tipo_faxina    AS ENUM ('RESIDENCIAL', 'COMERCIAL');
CREATE TYPE tipo_acao      AS ENUM ('CRIACAO', 'EDICAO', 'EXCLUSAO');

-- TABLES

-- Operadores da empresa (login do sistema - itens 4, 5, 6 e 7 do PDF)
CREATE TABLE usuario (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(100)    NOT NULL,
    email       VARCHAR(120)    NOT NULL UNIQUE,
    senha_hash  VARCHAR(255)    NOT NULL,
    perfil      perfil_usuario  NOT NULL DEFAULT 'OPERADOR',
    ativo       BOOLEAN         NOT NULL DEFAULT TRUE,
    criado_em   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Clientes que solicitam o servico de faxina
CREATE TABLE cliente (
    id         SERIAL PRIMARY KEY,
    nome       VARCHAR(100) NOT NULL,
    cpf_cnpj   VARCHAR(14)  NOT NULL UNIQUE,
    telefone   VARCHAR(20)  NOT NULL,
    email      VARCHAR(120) NOT NULL UNIQUE,
    criado_em  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE endereco (
    id           SERIAL PRIMARY KEY,
    cliente_id   INTEGER      NOT NULL REFERENCES cliente(id),
    logradouro   VARCHAR(150) NOT NULL,
    numero       VARCHAR(10)  NOT NULL,
    bairro       VARCHAR(60)  NOT NULL,
    cidade       VARCHAR(60)  NOT NULL,
    cep          CHAR(8)      NOT NULL
);

CREATE TABLE profissional (
    id        SERIAL PRIMARY KEY,
    nome      VARCHAR(100) NOT NULL,
    cpf       CHAR(11)     NOT NULL UNIQUE,
    telefone  VARCHAR(20)  NOT NULL,
    email     VARCHAR(120) NOT NULL UNIQUE
);

-- Janela semanal de disponibilidade de cada profissional.
CREATE TABLE disponibilidade (
    id               SERIAL PRIMARY KEY,
    profissional_id  INTEGER  NOT NULL REFERENCES profissional(id),
    dia_semana       SMALLINT NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
    hora_inicio      TIME     NOT NULL,
    hora_fim         TIME     NOT NULL,
    CHECK (hora_fim > hora_inicio)
);

COMMENT ON COLUMN disponibilidade.dia_semana IS
    '0 = domingo, 1 = segunda, 2 = terca, 3 = quarta, 4 = quinta, 5 = sexta, 6 = sabado (igual ao EXTRACT(DOW) do PostgreSQL)';

-- Agendamentos de faxina. Alertas de conflito de horario e de indisponibilidade
CREATE TABLE agendamento (
    id                SERIAL PRIMARY KEY,
    cliente_id        INTEGER     NOT NULL REFERENCES cliente(id),
    profissional_id   INTEGER     NOT NULL REFERENCES profissional(id),
    endereco_id       INTEGER     NOT NULL REFERENCES endereco(id),
    tipo              tipo_faxina NOT NULL,
    data_hora_inicio  TIMESTAMP   NOT NULL,
    data_hora_fim     TIMESTAMP   NOT NULL,
    observacoes       TEXT,
    CHECK (data_hora_fim > data_hora_inicio)
);

-- Indice de apoio a verificacao de conflito de horario
CREATE INDEX idx_agendamento_prof_inicio ON agendamento (profissional_id, data_hora_inicio);

-- Historico completo de cada operacao sobre um agendamento, identificando cliente, profissional e o usuario (operador) responsavel pela acao.
CREATE TABLE historico_agendamento (
    id               SERIAL PRIMARY KEY,
    agendamento_id   INTEGER   REFERENCES agendamento(id) ON DELETE SET NULL,
    cliente_id       INTEGER   NOT NULL REFERENCES cliente(id),
    profissional_id  INTEGER   NOT NULL REFERENCES profissional(id),
    usuario_id       INTEGER   NOT NULL REFERENCES usuario(id),
    acao             tipo_acao NOT NULL,
    data_hora        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuario (nome, email, senha_hash, perfil) VALUES
    ('Gustavo', 'gustavo@faxinaja.com.br', '$2b$12$tKwHfS8zslcEKanzcJAp/e75fWj3tXn7.mdy0tq2xi.KxCYINvdKy', 'ADMIN'),
    ('Mariana Duarte',  'mariana.duarte@faxinaja.com.br',  '$2b$12$GOy1AIW7FUiGTmUfhi9OiOBFOzjfw.rz7FRmz5Zbrlsh1JB2jqxgO', 'OPERADOR'),
    ('Rafael Nunes',    'rafael.nunes@faxinaja.com.br',    '$2b$12$uoaPt6xeH13KUf1AUYGc/OWDuUa0KOr5yrUoy8zW7tjKNVm6oNFLG', 'OPERADOR');

INSERT INTO cliente (nome, email, cpf_cnpj, telefone) VALUES
    ('Helena Costa',             'helena.costa@email.com',      '11122233344',    '11988887777'),
    ('Condominio Vista Verde',   'sindico@vistaverde.com.br',   '12345678000199', '11977776666'),
    ('Escritorio Alfa Contabil', 'contato@alfacontabil.com.br', '98765432000155', '11966665555');

INSERT INTO endereco (cliente_id, logradouro, numero, bairro, cidade, cep) VALUES
    (1, 'Rua das Palmeiras',    '120', 'Jardim Europa', 'Sao Paulo', '01450000'),
    (2, 'Avenida Brasil',       '900', 'Centro',        'Sao Paulo', '01001000'),
    (3, 'Rua Sete de Setembro', '350', 'Bela Vista',    'Sao Paulo', '01311000');

INSERT INTO profissional (nome, cpf, telefone, email) VALUES
    ('Sonia Ferreira', '22233344455', '11955554444', 'sonia.ferreira@email.com'),
    ('Carlos Mendes',  '33344455566', '11944443333', 'carlos.mendes@email.com'),
    ('Patricia Lima',  '44455566677', '11933332222', 'patricia.lima@email.com');

-- dia_semana: 0 = domingo .. 6 = sabado 
INSERT INTO disponibilidade (profissional_id, dia_semana, hora_inicio, hora_fim) VALUES
    (1, 1, '08:00', '18:00'),  -- Sonia Ferreira: segunda-feira
    (2, 2, '08:00', '17:00'),  -- Carlos Mendes: terca-feira
    (3, 5, '07:00', '15:00');  -- Patricia Lima: sexta-feira

INSERT INTO agendamento (cliente_id, profissional_id, endereco_id, tipo, data_hora_inicio, data_hora_fim, observacoes) VALUES
    (1, 1, 1, 'RESIDENCIAL', '2026-08-10 09:00', '2026-08-10 11:00', 'Cliente pediu atencao especial na cozinha'),
    (2, 1, 2, 'COMERCIAL',   '2026-08-10 10:00', '2026-08-10 12:00', 'Limpeza da area comum do condominio'),
    (3, 2, 3, 'COMERCIAL',   '2026-08-10 09:00', '2026-08-10 12:00', 'Escritorio com sala de reuniao adicional'),
    (1, 3, 1, 'RESIDENCIAL', '2026-08-14 08:00', '2026-08-14 12:00', 'Limpeza pesada apos reforma do banheiro');

INSERT INTO historico_agendamento (agendamento_id, cliente_id, profissional_id, usuario_id, acao) VALUES
    (1, 1, 1, 1, 'CRIACAO'),
    (2, 2, 1, 1, 'CRIACAO'),
    (3, 3, 2, 2, 'CRIACAO'),
    (4, 1, 3, 2, 'CRIACAO');
