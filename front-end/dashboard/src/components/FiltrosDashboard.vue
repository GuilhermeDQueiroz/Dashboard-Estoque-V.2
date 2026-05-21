<script setup>
import { useUiStore } from '../stores/uiStore';

const uiStore = useUiStore();

const limparFiltros = () => {
  uiStore.limparFiltros();
};
</script>

<template>
  <transition name="slide">
    <div class="card filters-card" v-show="uiStore.filtrosVisiveis">
      <h2 class="section-title mb-0 pb-0 border-none">
        <i class="fas fa-filter"></i> Filtros e Pesquisa
      </h2>
      <div class="filters-grid">
        <div class="filter-group">
          <label>Fornecedor</label>
          <input type="text" v-model="uiStore.filtros.fornecedor" placeholder="Pesquisar..." />
        </div>
        <div class="filter-group">
          <label>Item / Produto</label>
          <input type="text" v-model="uiStore.filtros.item" placeholder="Pesquisar..." />
        </div>
        <div class="filter-group">
          <label>Filtrar Data Por</label>
          <select v-model="uiStore.filtros.tipoData">
            <option value="DTPREVENTREGA_PDC">Previsão de Entrega</option>
            <option value="DTEMISSAO_PDC">Emissão do Pedido</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Data Inicial</label>
          <input type="date" v-model="uiStore.filtros.dataInicio" />
        </div>
        <div class="filter-group">
          <label>Data Final</label>
          <input type="date" v-model="uiStore.filtros.dataFim" />
        </div>
        <div class="filter-actions flex-gap-8">
          <button 
            class="btn-keep" 
            :class="{ active: uiStore.manterFiltros }"
            @click="uiStore.manterFiltros = !uiStore.manterFiltros"
            title="Manter filtros ao navegar entre painéis"
          >
            <i class="fas" :class="uiStore.manterFiltros ? 'fa-lock' : 'fa-lock-open'"></i>
            {{ uiStore.manterFiltros ? 'Mantendo' : 'Manter?' }}
          </button>
          <button class="btn-clear" @click="limparFiltros">
            <i class="fas fa-eraser"></i> Limpar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* Animação ao mostrar/ocultar filtros */
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  max-height: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.slide-enter-to, .slide-leave-from {
  opacity: 1;
  max-height: 300px;
}
.btn-keep {
  padding: 8px 15px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: white;
  color: #666;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-keep.active {
  background: var(--accent-blue);
  color: white;
  border-color: var(--accent-blue);
}
.btn-keep:hover {
  border-color: var(--accent-blue);
  color: var(--accent-blue);
}
.btn-keep.active:hover {
  opacity: 0.9;
  color: white;
}
</style>
