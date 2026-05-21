const express = require('express');
const router = express.Router();

// Importa os controllers de compras
const comprasController = require('../controllers/comprasController');
const analiseComprasController = require('../controllers/analiseComprasController');

/**
 * Rotas de Compras
 * 
 * Este arquivo concentra todos os endpoints que são muito complexos
 * para usar as rotas genéricas, por exemplo, consultas que usam múltiplos JOINs.
 */

// Rota dedicada para buscar os pedidos de compra pendentes (que ainda não foram entregues totalmente)
// Ex: GET /api/compras/pendentes
router.get('/compras/pendentes', comprasController.getComprasPendentes);

// Rota para análise histórica de compras realizadas nos últimos 12 meses
// Ex: GET /api/analise/historico
router.get('/analise/historico', analiseComprasController.getHistoricoCompras);

module.exports = router;
