# Graph Report - .  (2026-05-20)

## Corpus Check
- Corpus is ~9,873 words - fits in a single context window. You may not need a graph.

## Summary
- 247 nodes · 249 edges · 34 communities (29 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]

## God Nodes (most connected - your core abstractions)
1. `scripts` - 9 edges
2. `**Passo a Passo**` - 9 edges
3. `🚀 Firebird ERP Integration & Analytics Dashboard` - 8 edges
4. `🚀 Funcionalidades Implementadas` - 7 edges
5. `dashboard` - 6 edges
6. `scripts` - 5 edges
7. `Project Setup` - 5 edges
8. `compilerOptions` - 4 edges
9. `api` - 4 edges
10. `🛠️ Tecnologias Utilizadas` - 3 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (34 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (24): **1. API Inteligente & Genérica**, **1. Rotas Genéricas (`GET /api/:tabela`)**, **2. Endpoints Customizados (Específicos)**, **2. Segurança e Performance**, **3. Dashboard Operacional (Compras)**, **4. Painel de Análise Estratégica (Histórico)**, **4. Painel de Análise Estratégica (Histórico de Compras)**, **5. Painel de Vendas (Comercial e Logístico)** (+16 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (22): devDependencies, eslint, eslint-plugin-oxlint, eslint-plugin-vue, jiti, npm-run-all2, oxlint, @tsconfig/node24 (+14 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (21): author, dependencies, cors, dotenv, express, mongodb, node-firebird, swagger-jsdoc (+13 more)

### Community 3 - "Community 3"
Cohesion: 0.16
Nodes (16): ano, anoCurto, array, data, dataAlvo, dataB, dataLocal, dFim (+8 more)

### Community 4 - "Community 4"
Cohesion: 0.21
Nodes (16): ano, anoCurto, array, data, dataAlvo, dataB, dataLocal, dFim (+8 more)

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (10): pool, pool, pool, Firebird, options, pool, analiseComprasController, comprasController (+2 more)

### Community 6 - "Community 6"
Cohesion: 0.14
Nodes (11): colunas, condicoes, filtrosQuery, limit, pool, tabelaNome, tabelasConfig, valores (+3 more)

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (13): code:sh (npm install), code:sh (npm run dev), code:sh (npm run build), code:sh (npm run lint), Compile and Hot-Reload for Development, Customize configuration, dashboard, Lint with [ESLint](https://eslint.org/) (+5 more)

### Community 8 - "Community 8"
Cohesion: 0.18
Nodes (11): code:bash (git clone <url-do-repositorio>), code:bash (npm install), code:env (DB_HOST=192.168.254.42), code:bash (npm run dev:backend), code:bash (node index.js), code:bash (cd front-end/dashboard), code:bash (npm install), code:bash (npm run dev) (+3 more)

### Community 9 - "Community 9"
Cohesion: 0.20
Nodes (9): app, comprasRoutes, cors, express, genericRoutes, options, specs, swaggerJsdoc (+1 more)

### Community 10 - "Community 10"
Cohesion: 0.22
Nodes (9): scripts, build, build-only, dev, lint, lint:eslint, lint:oxlint, preview (+1 more)

### Community 11 - "Community 11"
Cohesion: 0.22
Nodes (8): compilerOptions, noUncheckedIndexedAccess, paths, tsBuildInfoFile, exclude, extends, include, @/*

### Community 12 - "Community 12"
Cohesion: 0.25
Nodes (8): dependencies, apexcharts, axios, pinia, vue, vue3-apexcharts, vue-router, vuetify

### Community 13 - "Community 13"
Cohesion: 0.36
Nodes (4): api, useAnaliseComprasStore, useComprasStore, useVendasStore

### Community 14 - "Community 14"
Cohesion: 0.29
Nodes (6): categories, correctness, env, browser, plugins, $schema

### Community 15 - "Community 15"
Cohesion: 0.29
Nodes (3): routes, app, data

## Knowledge Gaps
- **145 isolated node(s):** `name`, `version`, `description`, `main`, `test` (+140 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `🚀 Firebird ERP Integration & Analytics Dashboard` connect `Community 0` to `Community 8`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `scripts` connect `Community 10` to `Community 1`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _145 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._