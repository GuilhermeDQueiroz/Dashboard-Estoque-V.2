const pool = require('../db/firebird');
const tabelasConfig = require('../config/tabelas');

/**
 * Rota Genérica para Listar Registros (Versão Segura)
 * 
 * Filtra as tabelas e colunas com base no arquivo de configuração,
 * evitando SQL Injection em nomes de colunas e exposição de dados sensíveis.
 */
exports.listar = (req, res) => {
  const tabelaNome = req.params.tabela.toUpperCase();
  const config = tabelasConfig[tabelaNome];

  // 1. Validação de Segurança: Tabela permitida?
  if (!config) {
    return res.status(403).json({ erro: "Acesso negado: Tabela não configurada ou inexistente." });
  }

  // 2. Parâmetros de Paginação
  const limit = Math.min(parseInt(req.query.limit) || 20, 100); // Limite máximo de 100 por consulta
  const colunas = config.colunasExpostas.join(", ");
  
  const filtrosQuery = { ...req.query };
  delete filtrosQuery.limit;

  let where = "";
  let valores = [];

  // 3. Filtros Seguros: Apenas colunas explicitamente permitidas no config
  const condicoes = Object.keys(filtrosQuery)
    .filter(campo => config.filtrosPermitidos.includes(campo.toUpperCase()))
    .map(campo => {
      valores.push(filtrosQuery[campo]);
      return `${campo.toUpperCase()} = ?`;
    });

  if (condicoes.length > 0) {
    where = "WHERE " + condicoes.join(" AND ");
  }

  const sql = `SELECT FIRST ${limit} ${colunas} FROM ${tabelaNome} ${where}`;

  pool.get((err, db) => {
    if (err) return res.status(500).json({ erro: "Erro ao conectar ao banco de dados" });

    db.query(sql, valores, (err, result) => {
      db.detach();

      if (err) {
        console.error(`Erro na query genérica (${tabelaNome}):`, err.message);
        return res.status(500).json({ erro: "Erro ao executar consulta", detalhe: err.message });
      }

      res.json(result);
    });
  });
};

/**
 * Rota Genérica para Buscar por ID (Versão Segura)
 * 
 * Usa o mapeamento de chaves primárias definido no config para buscar um registro único.
 */
exports.buscarPorId = (req, res) => {
  const tabelaNome = req.params.tabela.toUpperCase();
  const id = req.params.id;
  const config = tabelasConfig[tabelaNome];

  // 1. Validação de Segurança
  if (!config) {
    return res.status(403).json({ erro: "Acesso negado: Tabela não configurada." });
  }

  pool.get((err, db) => {
    if (err) return res.status(500).json({ erro: "Erro ao conectar ao banco de dados" });

    // 2. Uso da Chave Primária correta mapeada no arquivo de configuração
    const colunaId = config.pk;
    const colunas = config.colunasExpostas.join(", ");
    const sql = `SELECT ${colunas} FROM ${tabelaNome} WHERE ${colunaId} = ?`;

    db.query(sql, [id], (err, result) => {
      db.detach();

      if (err) {
        console.error(`Erro na busca por ID (${tabelaNome}):`, err.message);
        return res.status(500).json({ erro: "Erro ao buscar registro", detalhe: err.message });
      }

      if (result.length === 0) {
        return res.status(404).json({ mensagem: "Registro não encontrado." });
      }

      res.json(result[0]);
    });
  });
};