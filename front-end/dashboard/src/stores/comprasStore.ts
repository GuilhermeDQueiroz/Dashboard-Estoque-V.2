import { defineStore } from 'pinia';
import { api } from '../api/api';

/**
 * Gerencia o estado e as chamadas de API para o Painel de Pedidos de Compra.
 */
export const useComprasStore = defineStore('compras', {

  // Variáveis reativas de estado
  state: () => ({
    compras: [],
    carregando: false,
  }),

  actions: {
    async carregarCompras() {
      this.carregando = true;
      try {
        const response = await api.get('/compras/pendentes');
        this.compras = response.data.data || response.data;
      } catch (error) {
        console.error('Erro ao carregar compras:', error);
      } finally {
        this.carregando = false;
      }
    }
  }
});
