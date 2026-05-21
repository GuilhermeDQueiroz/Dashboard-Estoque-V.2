<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  borderColor: {
    type: String,
    default: 'transparent'
  },
  valueClass: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: '' 
  },
  iconColor: {
    type: String,
    default: 'var(--text-secondary)' // Cor do ícone de fundo
  }
});
</script>

<template>
  <div class="card kpi-card" :class="borderColor ? `${borderColor}-border` : ''">
    <i v-if="icon" :class="icon" class="kpi-icon" :style="{ color: iconColor }"></i>
    <div class="kpi-title">{{ title }}</div>
    <div class="kpi-value" :class="valueClass">{{ value }}</div>
  </div>
</template>

<style scoped>
.kpi-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 0;
  border-left: 4px solid transparent;
  position: relative;
  overflow: hidden;
}

/* Bordas dinâmicas */
.blue-border { border-left-color: var(--accent-blue); }
.red-border { border-left-color: var(--danger); }
.yellow-border { border-left-color: var(--warning); }

/* Ícone decorativo de fundo */
.kpi-icon {
  position: absolute;
  right: 20px;
  top: 18px;
  font-size: 2.2rem;
  opacity: 0.15;
}

.kpi-title {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.kpi-value {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-primary);
}

/* Modificadores de cor para o texto */
.danger { color: var(--danger); }
.money { color: var(--success); }
.warning { color: var(--warning); }
.accent { color: var(--accent-blue); }
.logistica { color: #FEB019; }
</style>
