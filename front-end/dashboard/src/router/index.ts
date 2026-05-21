import { createRouter, createWebHistory } from "vue-router";

// Importação das Views (Telas) da aplicação
import Dashboard from "../views/DashboardVendas.vue";
import DashboardCompras from "../views/DashboardCompras.vue";
import AnaliseCompras from "../views/AnaliseCompras.vue";

/**
 * Definição das Rotas do Front-end
 * O Vue Router é responsável por trocar o componente exibido na tela principal
 * dependendo do caminho (URL) acessado pelo usuário, sem recarregar a página.
 */
const routes = [
  {
    path: "/",
    component: DashboardCompras // Tela inicial (Painel de Compras)
  },
  {
    path: "/compras",
    component: DashboardCompras // Tela do Painel de Compras
  },
  {
    path: "/analise-compras",
    component: AnaliseCompras // Novo Painel de Análise Histórica
  }
];

// Cria e exporta a instância do roteador
export default createRouter({
  history: createWebHistory(), // Usa o histórico HTML5 (sem # na URL)
  routes
});