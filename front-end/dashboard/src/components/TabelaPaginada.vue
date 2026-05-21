<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  itens: {
    type: Array,
    required: true
  },
  itensPorPagina: {
    type: Number,
    default: 7
  }
});

const paginaAtual = ref(1);

// Volta para a página 1 sempre que a lista de itens mudar (ex: aplicar filtro)
watch(() => props.itens, () => {
  paginaAtual.value = 1;
});

const totalPaginas = computed(() => Math.ceil(props.itens.length / props.itensPorPagina) || 1);

const itensPaginados = computed(() => {
  const inicio = (paginaAtual.value - 1) * props.itensPorPagina;
  const fim = inicio + props.itensPorPagina;
  return props.itens.slice(inicio, fim);
});

const paginaAnterior = () => {
  if (paginaAtual.value > 1) paginaAtual.value--;
};

const proximaPagina = () => {
  if (paginaAtual.value < totalPaginas.value) paginaAtual.value++;
};
</script>

<template>
  <div class="table-container">
    <table>
      <thead>
        <slot name="cabecalho"></slot>
      </thead>
      <tbody>
        <slot name="linha" v-for="(item, index) in itensPaginados" :key="index" :item="item" :index="index"></slot>
      </tbody>
      <tfoot v-if="$slots.rodape">
        <slot name="rodape"></slot>
      </tfoot>
    </table>
    
    <div class="pagination-controls" v-if="props.itens.length > props.itensPorPagina">
      <button class="pagination-btn" @click="paginaAnterior" :disabled="paginaAtual === 1">Anterior</button>
      <span class="pagination-info">Página {{ paginaAtual }} de {{ totalPaginas }}</span>
      <button class="pagination-btn" @click="proximaPagina" :disabled="paginaAtual === totalPaginas">Próxima</button>
    </div>
  </div>
</template>

<style scoped>
/*  se necessário, estilos específicos podem ser adicionados aqui. */
</style>
