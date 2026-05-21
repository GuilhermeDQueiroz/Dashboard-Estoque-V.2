<script setup>
import VueApexCharts from "vue3-apexcharts";

const props = defineProps({
  titulo: {
    type: String,
    required: true
  },
  tituloCor: {
    type: String,
    default: 'inherit'
  },
  tipo: {
    type: String,
    default: 'bar'
  },
  altura: {
    type: [Number, String],
    default: 300
  },
  opcoes: {
    type: Object,
    default: () => ({})
  },
  series: {
    type: Array,
    default: () => []
  },
  exibirGrafico: {
    type: Boolean,
    default: true
  }
});
</script>

<template>
  <div class="card">
    <div class="section-header">
      <h2 class="section-title" :style="{ color: tituloCor }">{{ titulo }}</h2>
      <div class="flex-gap-8">
        <slot name="acoes"></slot>
      </div>
    </div>
    
    <slot name="conteudo">
      <div class="chart-container" :style="{ height: typeof altura === 'number' ? altura + 'px' : altura }" v-if="exibirGrafico">
        <VueApexCharts :type="tipo" :height="altura" :options="opcoes" :series="series" />
      </div>
    </slot>
  </div>
</template>

<style scoped>
/* Estilos base já estão no global.css (.card, .section-header, .section-title, .chart-container) */
</style>
