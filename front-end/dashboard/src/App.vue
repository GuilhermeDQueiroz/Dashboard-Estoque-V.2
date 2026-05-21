<script setup>
// Importa os componentes do Vue Router necessários para a navegação
import { RouterView, RouterLink } from 'vue-router'
import { ref } from 'vue'

// Controle de recolhimento da sidebar
const sidebarCollapsed = ref(false)
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<template>
  <div class="app-layout" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <!-- Barra lateral de navegação -->
    <nav class="sidebar">
      <div class="sidebar-header">
        <h2 v-show="!sidebarCollapsed">Estoque</h2>
        <button class="toggle-btn" @click="toggleSidebar" :title="sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'">
          <i class="mdi" :class="sidebarCollapsed ? 'mdi-menu' : 'mdi-close'"></i>
        </button>
      </div>
      <ul>
        <!-- router link para evitar reload da página -->
        <!--<li>
          <RouterLink to="/">
            <i class="mdi mdi-view-dashboard nav-icon"></i>
            <span class="nav-text" v-show="!sidebarCollapsed">Painel de Vendas</span>
          </RouterLink>
        </li>-->
        <li>
          <RouterLink to="/compras">
            <i class="mdi mdi-cart-arrow-down nav-icon"></i>
            <span class="nav-text" v-show="!sidebarCollapsed">Pedidos de Compra</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/analise-compras">
            <i class="mdi mdi-cart-percent nav-icon"></i>
            <span class="nav-text" v-show="!sidebarCollapsed">Análise de Compras</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
    
    <!--onde as telas são injetadas-->
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f5f7fa;
}

.app-layout {
  display: flex;
  min-height: 100vh;
}

/* Sidebar expandida */
.sidebar {
  width: 250px;
  min-width: 250px;
  background-color: #181852;
  color: white;
  padding: 10px 0;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  transition: width 0.3s ease, min-width 0.3s ease;
  overflow: hidden;
}

/* Sidebar recolhida */
.sidebar-collapsed .sidebar {
  width: 60px;
  min-width: 60px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  margin-bottom: 20px;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 20px;
  color: #ecf0f1;
  white-space: nowrap;
}

.toggle-btn {
  background: none;
  border: 1px solid rgba(255,255,255,0.2);
  color: #ecf0f1;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.3s;
  flex-shrink: 0;
}

.toggle-btn:hover {
  background-color: rgba(255,255,255,0.1);
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  color: #ecf0f1;
  text-decoration: none;
  font-size: 16px;
  border-left: 4px solid transparent;
  transition: all 0.3s;
  white-space: nowrap;
}

.sidebar-collapsed .sidebar li a {
  justify-content: center;
  padding: 15px 0;
  border-left: none;
}

.nav-icon {
  font-size: 22px;
  flex-shrink: 0;
  width: 24px;
  text-align: center;
}

.sidebar li a:hover,
.sidebar li a.router-link-exact-active {
  background-color: #34495e;
  border-left-color: #3498db;
}

.sidebar-collapsed .sidebar li a:hover,
.sidebar-collapsed .sidebar li a.router-link-exact-active {
  border-left: none;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>