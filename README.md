# 🚀 Firebird ERP Integration & Analytics Dashboard

Este projeto é uma solução completa de integração de dados, composta por uma **API REST robusta em Node.js** e um **Dashboard analítico em Vue.js**. O objetivo principal é extrair dados de um banco de dados **Firebird** (utilizado em sistemas de ERP) e transformá-los em indicadores visuais (KPIs) e relatórios dinâmicos para suporte à tomada de decisão gerencial.

## 📌 Visão Geral do Projeto

A solução resolve o problema de visualização de dados em ERPs legados, permitindo a consulta de documentos de faturamento, pedidos de compra e itens de forma performática, segura e com interface moderna.

O projeto está dividido em três frentes complementares:
1. **Operacional (Dashboard de Compras):** Focado em pendências, atrasos por fornecedor, controle de saldo aberto e recebimentos programados.
2. **Estratégico (Análise de Compras):** Análise histórica abrangente de até 36 meses, volume financeiro anual, comportamento de custos e flutuação de preços médios por item.
3. **Comercial (Dashboard de Vendas):** Visão geral de faturamento e desempenho comercial da empresa.

---

## 🛠️ Tecnologias Utilizadas

### **Back-end (API)**
- **Node.js & Express**: Framework para construção da API.
- **Firebird 5**: Banco de dados do ERP.
- **node-firebird**: Driver de conexão com suporte a **Pool de Conexões** para alta performance.
- **Swagger**: Documentação interativa disponível em `/docs`.
- **Dotenv**: Gestão de variáveis de ambiente e credenciais seguras.
- **CORS**: Configuração de permissões para comunicação com o Front-end.

### **Front-end (Dashboard)**
- **Vue.js 3 (Vite)**: Framework reativo para a interface.
- **TypeScript**: Tipagem estática para maior segurança e manutenção do código.
- **Pinia**: Gestão de estado global para cache de dados e métricas.
- **Vue Router**: Navegação entre os painéis Operacional e Estratégico.
- **Vuetify / CSS Custom**: Interface moderna com design responsivo.
- **ApexCharts**: Visualizações gráficas dinâmicas (Barras, Donut, Linhas).
- **Axios**: Cliente HTTP para consumo da API.

---

## 📐 Arquitetura do Sistema

### **Estrutura de Pastas**
```text
project/
├── back-end/
│   ├── config/          # Whitelist de tabelas e configurações globais
│   ├── controllers/     # Lógica de negócio e queries SQL
│   ├── db/              # Configuração do Pool de Conexão Firebird
│   ├── routes/          # Definição dos endpoints da API
│   └── index.js         # Ponto de entrada do servidor
└── front-end/
    └── dashboard/
        ├── src/
        │   ├── api/       # Instância configurada do Axios
        │   ├── assets/    # Estilos globais e identidade visual
        │   ├── components/# Componentes reutilizáveis (ex: KpiCard)
        │   ├── stores/    # Stores do Pinia (analiseComprasStore, comprasStore, vendasStore, uiStore)
        │   ├── utils/     # Formatadores de moeda, data e números
        │   └── views/     # Telas principais (DashboardCompras, AnaliseCompras, DashboardVendas)
        └── index.html
```

### **Fluxo de Dados**
`Banco Firebird` $\rightarrow$ `Node API` $\rightarrow$ `Pinia Store` $\rightarrow$ `Vue Components` $\rightarrow$ `ApexCharts / Tabelas`

---

## 🚀 Funcionalidades Implementadas

### **1. API Inteligente & Genérica**
- **Rotas Dinâmicas**: Possibilidade de listar registros de qualquer tabela permitida via `GET /api/:tabela`.
- **Filtros Dinâmicos**: Suporte a query parameters para filtragem automática no SQL (ex: `/api/ITEM?CODIGO_ITEM=10`).
- **Busca por ID**: Endpoint otimizado para busca de registros únicos.
- **Limitação de Dados**: Parâmetro `limit` para controle de volume de dados retornados.

### **2. Segurança e Performance**
- **Whitelist de Tabelas**: Apenas tabelas autorizadas em `config/tabelas.js` podem ser acessadas, prevenindo exposição de dados sensíveis.
- **Proteção contra SQL Injection**: Todas as consultas utilizam **Prepared Statements**.
- **Pool de Conexões**: Evita a abertura excessiva de conexões com o Firebird, reduzindo a latência.

### **3. Dashboard Operacional (Compras)**
- **KPIs em Tempo Real**: Total de pedidos pendentes, valor financeiro em aberto e % de atraso.
- **Gráficos de Atraso**: Visualização de fornecedores com maior volume de pendências (Modos: Qtd, Valor e Rosca).
- **Paginação Client-Side**: Navegação fluida em tabelas de pedidos e itens.
- **Filtros Avançados**: Pesquisa instantânea por fornecedor, item e período (Emissão ou Previsão).

### **4. Painel de Análise Estratégica (Histórico de Compras)**
- **Análise Histórica Avançada**: Visão consolidada de compras realizadas nos últimos 36 meses.
- **Evolução Mensal**: Gráficos de barras comparando o gasto mensal de forma sequencial.
- **Monitoramento de Preços**: Gráfico de "Preço Médio por Item" com cores condicionais (Heatmap) para alertar de forma visual sobre disparadas ou flutuações incomuns de custos.
- **Ranking de Fornecedores**: Top fornecedores por volume financeiro.

### **5. Painel de Vendas (Comercial e Logístico)**
- **Métricas de Faturamento**: KPIs consolidados de total de pedidos, faturamento bruto líquido, peso total (kg) e cubagem expedida (m³).
- **Gráficos Comerciais**:
  - *Faturamento Diário*: Gráfico de área interativo mostrando a evolução do faturamento ao longo do tempo.
  - *Desempenho Logístico*: Gráfico de barras com a quantidade de volumes expedidos por dia.
- **Tabela de Detalhamento Comercial**: Listagem detalhada de todos os documentos de faturamento com informações de emissão, cliente, número de itens, volumes, peso e valor líquido.

---

## ⚙️ Instalação e Configuração

### **Pré-requisitos**
- Node.js instalado.
- Acesso ao banco de dados Firebird.

### **Passo a Passo**

1. **Clonar o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd API-Dashboard-main
   ```

2. **Configurar o Back-end (na raiz do projeto):**
   - Instale as dependências na raiz do projeto (onde está o `package.json` principal que gerencia o Back-end):
     ```bash
     npm install
     ```
   - Acesse a pasta `back-end/` e crie um arquivo `.env` com as configurações de conexão do banco de dados Firebird. Exemplo de conteúdo do `.env`:
     ```env
     DB_HOST=192.168.254.42
     DB_PORT=3056
     DB_DATABASE=C:\Caminho\Para\Seu\DADOSMC.FDB
     DB_USER=SYSDBA
     DB_PASSWORD=masterkey
     ```
   - Para iniciar o servidor Back-end, você pode executar a partir da raiz do projeto:
     ```bash
     npm run dev:backend
     ```
     Ou acessar a pasta `back-end/` e rodar:
     ```bash
     node index.js
     ```

3. **Configurar o Front-end:**
   - Acesse a pasta do painel do Front-end:
     ```bash
     cd front-end/dashboard
     ```
   - Instale as dependências do painel:
     ```bash
     npm install
     ```
   - Inicie o servidor de desenvolvimento do Front-end:
     ```bash
     npm run dev
     ```

---

## 🔌 Endpoints & Exemplos de Uso

A API expõe rotas genéricas seguras e endpoints customizados de alta performance para atender tanto a consultas gerais de tabelas do ERP quanto aos dashboards analíticos específicos.

### **1. Rotas Genéricas (`GET /api/:tabela`)**

Acessa dinamicamente as tabelas permitidas configuradas na **Whitelist** (`back-end/config/tabelas.js`), utilizando `SELECT FIRST {limit}` nativo do Firebird para paginação e proteção contra SQL Injection.

*   **Parâmetro de paginação**: `limit` (Padrão: `20`, Máximo: `100`). Ex: `?limit=50`.
*   **Filtros**: Permite filtrar registros usando parâmetros de busca correspondentes a colunas permitidas.

#### **Tabelas Permitidas na Whitelist:**

| Tabela | Chave Primária (`pk`) | Colunas Expostas | Filtros Permitidos na URL |
| :--- | :--- | :--- | :--- |
| `DOCUMENTO_FATURA` | `CODIGO_DOCFAT` | Todas (`*`) | `CODIGO_DOCFAT`, `EMPRESA_DOCFAT` |
| `ITEM` | `CODIGO_ITEM` | Todas (`*`) | `CODIGO_ITEM`, `DESCRICAO_ITEM` |
| `MOVIMENTO_ESTOQUE`| `CODIGO_MOVEST` | Todas (`*`) | `CODIGO_MOVEST` |
| `PEDIDO_COMPRA` | `CODIGO_PDC` | Todas (`*`) | `CODIGO_PDC`, `EMPRESA_PDC`, `FORNECEDOR_PDC` |
| `PEDIDO_COMPRA_ITEM`| `AUTOINC_PDCITEM` | Todas (`*`) | `AUTOINC_PDCITEM`, `AUTOINC_PDC` |
| `PEDIDO_COMPRA_ITEM_DETALHE`| `AUTOINC_PDCITEMDET`| Todas (`*`) | `AUTOINC_PDCITEMDET` |
| `VARIACAO` | `CODIGO_VARIACAO` | Todas (`*`) | `CODIGO_VARIACAO` |
| `COR` | `CODIGO_COR` | Todas (`*`) | `CODIGO_COR` |
| `ACABAMENTO` | `CODIGO_ACABAMENTO` | Todas (`*`) | `CODIGO_ACABAMENTO` |
| `PESSOA` | `CODIGO_PESSOA` | Todas (`*`) | `CODIGO_PESSOA`, `RAZAOSOCIAL_PESSOA`, `CNPJ_PESSOA` |

#### **Exemplos de Chamadas Genéricas:**
*   **Listar itens (limite padrão de 20)**:
    `GET http://localhost:3000/api/ITEM`
*   **Listar 50 pedidos de compra**:
    `GET http://localhost:3000/api/PEDIDO_COMPRA?limit=50`
*   **Listar itens filtrando por código específico**:
    `GET http://localhost:3000/api/ITEM?CODIGO_ITEM=10`
*   **Buscar pessoa específica pelo ID**:
    `GET http://localhost:3000/api/PESSOA/5`

---

### **2. Endpoints Customizados (Específicos)**

Estes endpoints foram desenvolvidos para executar consultas complexas com múltiplos `JOIN`s, projetados especificamente para suprir as demandas visuais do Dashboard.

#### **A. Pedidos de Compra Pendentes**
*   **Endpoint**: `GET /api/compras/pendentes`
*   **Descrição**: Retorna apenas itens de pedidos de compra que possuem saldo em aberto (`qtdeaberta_pdcitemdet > 0`). Realiza múltiplos `LEFT JOIN`s trazendo informações completas e estruturadas (fornecedor, descrição do item, cor, variação, acabamento, quantidade aberta e valor unitário líquido).
*   **Exemplo**: `GET http://localhost:3000/api/compras/pendentes`

#### **B. Análise Histórica de Compras**
*   **Endpoint**: `GET /api/analise/historico`
*   **Descrição**: Retorna o histórico de compras dos últimos 36 meses, útil para análises de tendências, flutuação de preços médios e evolução de compras. Traz todos os itens de pedidos sem restrição de saldo aberto.
*   **Exemplo**: `GET http://localhost:3000/api/analise/historico`

---

## 📑 Documentação da API

Com o servidor rodando, acesse a documentação interativa via Swagger:
👉 `http://localhost:3000/docs`

