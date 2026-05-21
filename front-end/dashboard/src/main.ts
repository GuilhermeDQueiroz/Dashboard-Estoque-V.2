// Importação das funções principais do Vue e do gerenciador de estado Pinia
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Importação do componente raiz da aplicação e do sistema de roteamento
import App from './App.vue'
import router from './router'

// Importação do CSS Global que centraliza o visual do projeto
import './assets/global.css'

// Inicializa a aplicação Vue usando o componente App.vue
const app = createApp(App)

// Injeta o Pinia (gerenciamento de estados como Vendas e Compras) na aplicação
app.use(createPinia())
// Injeta o Vue Router (navegação entre telas) na aplicação
app.use(router)

// Monta a aplicação na div com id "app" no arquivo index.html
app.mount('#app')
