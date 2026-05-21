/**
 * Configuração de Tabelas Permitidas (Whitelist)
 * 
 * Cada tabela permitida na API deve ser definida aqui com:
 * - pk: O nome real da coluna de chave primária no banco Firebird.
 * - colunasExpostas: Array de colunas que podem ser retornadas no SELECT (use ["*"] para todas).
 * - filtrosPermitidos: Quais colunas o usuário pode usar como filtro na URL (?NOME_COLUNA=valor).
 */
module.exports = {
  "DOCUMENTO_FATURA": {
    pk: "CODIGO_DOCFAT",
    colunasExpostas: ["*"], 
    filtrosPermitidos: ["CODIGO_DOCFAT", "EMPRESA_DOCFAT"]
  },
  "ITEM": {
    pk: "CODIGO_ITEM",
    colunasExpostas: ["*"],
    filtrosPermitidos: ["CODIGO_ITEM", "DESCRICAO_ITEM"]
  },
  "MOVIMENTO_ESTOQUE": {
    pk: "CODIGO_MOVEST",
    colunasExpostas: ["*"],
    filtrosPermitidos: ["CODIGO_MOVEST"]
  },
  "PEDIDO_COMPRA": {
    pk: "CODIGO_PDC",
    colunasExpostas: ["*"],
    filtrosPermitidos: ["CODIGO_PDC", "EMPRESA_PDC", "FORNECEDOR_PDC"]
  },
  "PEDIDO_COMPRA_ITEM": {
    pk: "AUTOINC_PDCITEM",
    colunasExpostas: ["*"],
    filtrosPermitidos: ["AUTOINC_PDCITEM", "AUTOINC_PDC"]
  },
  "PEDIDO_COMPRA_ITEM_DETALHE": {
    pk: "AUTOINC_PDCITEMDET",
    colunasExpostas: ["*"],
    filtrosPermitidos: ["AUTOINC_PDCITEMDET"]
  },
  "VARIACAO": {
    pk: "CODIGO_VARIACAO",
    colunasExpostas: ["*"],
    filtrosPermitidos: ["CODIGO_VARIACAO"]
  },
  "COR": {
    pk: "CODIGO_COR",
    colunasExpostas: ["*"],
    filtrosPermitidos: ["CODIGO_COR"]
  },
  "ACABAMENTO": {
    pk: "CODIGO_ACABAMENTO",
    colunasExpostas: ["*"],
    filtrosPermitidos: ["CODIGO_ACABAMENTO"]
  },
  "PESSOA": {
    pk: "CODIGO_PESSOA",
    colunasExpostas: ["*"],
    filtrosPermitidos: ["CODIGO_PESSOA", "RAZAOSOCIAL_PESSOA", "CNPJ_PESSOA"]
  }
};