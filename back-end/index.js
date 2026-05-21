// Carrega as variáveis de ambiente do arquivo .env (ex: senhas e conexões do banco)
require('dotenv').config();

// Importação das bibliotecas principais
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require("cors"); // Middleware para permitir requisições de diferentes origens (ex: frontend Vue para o backend Node)

// Importação das rotas da API
const genericRoutes = require('./routes/genericRoutes');
const comprasRoutes = require('./routes/comprasRoutes');

// Inicialização do aplicativo Express
const app = express();

// Configuração de middlewares básicos
app.use(express.json()); // Permite que a API receba e envie dados no formato JSON
app.use(cors()); // Libera o acesso cross-origin

//REGISTRO DAS ROTAS DA API 
// A ordem importa: comprasRoutes (rotas específicas) devem vir ANTES de genericRoutes (rotas dinâmicas)
// para evitar que o genericRoutes intercepte chamadas como /api/compras/...
app.use('/api', comprasRoutes);
app.use('/api', genericRoutes);

// 
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Firebird ERP",
      version: "1.0.0",
      description: "API para consulta de documentos (Integração Firebird)"
    }
  },
  apis: []
};

const specs = swaggerJsdoc(options);


// INCIALIZAÇÃO DO SERVIDOR
app.listen(3000, () => {
  console.log("Servidor rodando com sucesso!");
  console.log("API rodando em http://localhost:3000");
  console.log("Documentação Swagger disponível em http://localhost:3000/docs");
});