import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '../api/api';

/**
 * Gerencia os dados de compras realizadas para o painel de análise histórica.
 */
export const useAnaliseComprasStore = defineStore('analiseCompras', () => {
  const dados = ref([]);
  const carregando = ref(false);

  async function carregarHistorico() {
    carregando.value = true;
    try {
      const response = await api.get('/analise/historico');
      dados.value = response.data.data || [];
    } catch (error) {
      console.error('Erro ao carregar histórico de compras:', error);
      dados.value = [];
    } finally {
      carregando.value = false;
    }
  }

  return { dados, carregando, carregarHistorico };
});
