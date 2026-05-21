import { defineStore } from "pinia";
import { api } from "../api/api";

/**
 * 
 * Centraliza o estado e a lógica de busca de dados relacionados a Vendas.
 * Ao usar uma Store, os dados ficam em memória e podem ser acessados por
 * qualquer componente (como gráficos e tabelas) sem precisar fazer novas
 * requisições à API toda hora.
 */
export const useVendasStore = defineStore("vendas", {

  // state: Define as variáveis reativas que a store vai guardar
  state: () => ({
    vendas: [],       // Lista de vendas retornadas pela API
    loading: false    // Indicador visual de carregamento
  }),

  // actions: Funções que alteram o state ou realizam requisições assíncronas
  actions: {

    // Busca os dados de faturamento (vendas) na API
    async carregarVendas() {

      this.loading = true;

      try {
        // Faz um GET na rota genérica passando limite de 5000 registros
        const response = await api.get("/DOCUMENTO_FATURA?limit=5000");
        this.vendas = response.data;

      } catch (err) {
        console.error("Erro ao carregar vendas:", err);

      } finally {
        this.loading = false;
      }

    }

  }

});