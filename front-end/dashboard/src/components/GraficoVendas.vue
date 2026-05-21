<script setup>
// Importa o componente do ApexCharts para Vue 3
import VueApexCharts from "vue3-apexcharts";
import { computed } from "vue";
// Importa a Store de vendas para acessar os dados globalmente
import { useVendasStore } from "../stores/storeVendas";

const store = useVendasStore();

/**
 * Computa a série de dados para o gráfico.
 * O ApexCharts espera um array de objetos contendo "name" e "data".
 * Mapeamos as vendas pegando apenas o valor líquido (VLRLIQUIDO_DOCFAT).
 */
const series = computed(() => [
  {
    name: "Vendas",
    data: store.vendas.map(v => v.VLRLIQUIDO_DOCFAT)
  }
]);

/**
 * Computa as opções do gráfico.
 * Define o tipo como "line" (linha) e usa as datas de emissão
 * para preencher o eixo X (categorias).
 */
const chartOptions = computed(() => ({
  chart: {
    type: "line"
  },
  xaxis: {
    categories: store.vendas.map(v =>
      new Date(v.DTEMISSAO_DOCFAT).toLocaleDateString()
    )
  }
}));
</script>

<template>
  <!-- Renderiza o componente do gráfico passando as opções e séries calculadas -->
  <apexchart type="line" height="350" :options="chartOptions" :series="series" />
</template>