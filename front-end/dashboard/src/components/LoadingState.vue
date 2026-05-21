<template>
  <div class="loading-state">
    <i class="fas fa-spinner fa-spin loading-icon"></i>
    <p class="loading-text">Carregando dashboard...</p>
  </div>
</template>

<style scoped>
.loading-state {
  text-align: center;
  padding: 100px;
  color: var(--text-secondary);
}

.loading-icon {
  font-size: 3rem;
  color: var(--accent-blue);
}

.loading-text {
  margin-top: 15px;
  font-weight: 600;
}
</style>
