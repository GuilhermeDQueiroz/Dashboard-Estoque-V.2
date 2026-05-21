import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
  const filtrosVisiveis = ref(true);
  const manterFiltros = ref(false);
  
  // Filtros compartilhados entre todos os painéis
  const filtros = ref({
    fornecedor: "",
    item: "",
    dataInicio: "",
    dataFim: "",
    tipoData: "DTEMISSAO_PDC"
  });

  function toggleFiltros() {
    filtrosVisiveis.value = !filtrosVisiveis.value;
  }

  function limparFiltros() {
    filtros.value.fornecedor = "";
    filtros.value.item = "";
    filtros.value.dataInicio = "";
    filtros.value.dataFim = "";
  }

  return { filtrosVisiveis, manterFiltros, filtros, toggleFiltros, limparFiltros };
});
