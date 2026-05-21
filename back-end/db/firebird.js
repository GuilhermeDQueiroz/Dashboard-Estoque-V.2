const Firebird = require('node-firebird');

/**
 * Opções de Conexão com o Banco de Dados
 * Os dados sensíveis de conexão são lidos do arquivo .env
 * para evitar expor credenciais no código-fonte.
 */
const options = {
  host: process.env.DB_HOST,         // IP ou nome do servidor do banco
  port: process.env.DB_PORT,         // Porta de conexão (padrão do Firebird é 3050)
  database: process.env.DB_DATABASE, // Caminho físico do arquivo do banco de dados (.fdb)
  user: process.env.DB_USER,         // Usuário do banco
  password: process.env.DB_PASSWORD, // Senha do banco
  pageSize: 8192                     // Tamanho da página padrão de leitura
};

/**
 * Criação do Pool de Conexões
 * Um pool mantém conexões abertas prontas para serem usadas.
 * Isso melhora muito a performance, já que o sistema não precisa 
 * criar uma conexão do zero a cada nova requisição.
 * O número "5" indica o limite máximo de conexões simultâneas que o pool vai segurar.
 */
const pool = Firebird.pool(5, options);

module.exports = pool;