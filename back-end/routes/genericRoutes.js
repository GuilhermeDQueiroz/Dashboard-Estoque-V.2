const express = require('express');
const router = express.Router();

const genericController = require('../controllers/genericController');

/**
 * Definição das Rotas Genéricas
 * 
 * Interceptam URLs no formato /api/NOME_DA_TABELA e invocam
 * as funções dinâmicas criadas no genericController.
 */

// Rota genérica para listar com base no nome da tabela passado na URL
router.get('/:tabela', genericController.listar);

// Rota genérica para buscar um registro individual passando seu ID após a tabela
router.get('/:tabela/:id', genericController.buscarPorId);

module.exports = router;