<script setup>
// Importa hooks de ciclo de vida e estado reativo do Vue
import { onMounted, computed, ref } from "vue";
// Importa a store de compras para gerenciar o estado global desta tela
import { useComprasStore } from "../stores/comprasStore";
import { useUiStore } from "../stores/uiStore";
// Importa os utilitários e componentes
import { formatarMoeda, formatarData, formatarNumero, isAtrasado } from "../utils/formatters";
import KpiCard from "../components/KpiCard.vue";
import FiltrosDashboard from "../components/FiltrosDashboard.vue";
import TabelaPaginada from "../components/TabelaPaginada.vue";
import CartaoGrafico from "../components/CartaoGrafico.vue";

// Instancia a store para carregar os dados
const store = useComprasStore();
const uiStore = useUiStore();

// Dispara a requisição para buscar os dados de compras assim que o componente for montado na tela
onMounted(() => {
  // Reseta o estado de carregamento para garantir que a animação dos gráficos aconteça sempre
  store.carregando = true;

  // Se a opção de manter filtros estiver DESATIVADA, limpamos os filtros ao entrar
  if (!uiStore.manterFiltros) {
    uiStore.limparFiltros();
  }

  store.carregarCompras();
});

// Controle de visibilidade da barra de filtros
const toggleFiltros = () => {
  uiStore.toggleFiltros();
};

// Computada Mestre: Filtra os dados brutos da store
const comprasFiltradas = computed(() => {
  return store.compras.filter(c => {
    // Filtro de Fornecedor
    if (uiStore.filtros.fornecedor && c.RAZAOSOCIAL_PESSOA) {
      if (!c.RAZAOSOCIAL_PESSOA.toLowerCase().includes(uiStore.filtros.fornecedor.toLowerCase())) {
        return false;
      }
    }
    // Filtro de Item
    if (uiStore.filtros.item && c.DESCRICAO_ITEM) {
      if (!c.DESCRICAO_ITEM.toLowerCase().includes(uiStore.filtros.item.toLowerCase())) {
        return false;
      }
    }
    // Filtro de Data
    if (uiStore.filtros.dataInicio || uiStore.filtros.dataFim) {
      const dataAlvoStr = c[uiStore.filtros.tipoData];
      if (!dataAlvoStr) return false;

      const dataB = new Date(dataAlvoStr);
      const dataAlvo = new Date(dataB.getTime() + dataB.getTimezoneOffset() * 60000);
      dataAlvo.setHours(0, 0, 0, 0);

      if (uiStore.filtros.dataInicio) {
        const dInicio = new Date(uiStore.filtros.dataInicio + "T00:00:00");
        if (dataAlvo < dInicio) return false;
      }

      if (uiStore.filtros.dataFim) {
        const dFim = new Date(uiStore.filtros.dataFim + "T00:00:00");
        if (dataAlvo > dFim) return false;
      }
    }

    return true;
  });
});

// CÁLCULO DOS KPIs
const kpis = computed(() => {
  let pedidosUnicos = new Set();
  let pedidosEmAtraso = new Set();
  let valorPendenteTotal = 0;
  let valorEmAtraso = 0;

  comprasFiltradas.value.forEach(c => {
    if (!c.CODIGO_PDC) return;

    pedidosUnicos.add(c.CODIGO_PDC);

    const valorLinha = (c.QTDEABERTA_PDCITEMDET || 0) * (c.VLRUNITARIOLIQUIDO_PDCITEMDET || 0);
    valorPendenteTotal += valorLinha;

    if (isAtrasado(c.DTPREVENTREGA_PDC)) {
      pedidosEmAtraso.add(c.CODIGO_PDC);
      valorEmAtraso += valorLinha;
    }
  });

  const totalPedidos = pedidosUnicos.size;
  const pctAtraso = totalPedidos ? ((pedidosEmAtraso.size / totalPedidos) * 100).toFixed(1) : 0;

  return {
    totalPedidos,
    pedidosAtraso: pedidosEmAtraso.size,
    valorPendente: valorPendenteTotal,
    valorAtraso: valorEmAtraso,
    pctAtraso
  };
});

// AGRUPAMENTO PARA GRÁFICOS E TABELAS

// --- Mês a Mês ---
const resumoMensal = computed(() => {
  const mapa = {};

  comprasFiltradas.value.forEach(c => {
    if (!c.DTPREVENTREGA_PDC) return;
    const valorLinha = (c.QTDEABERTA_PDCITEMDET || 0) * (c.VLRUNITARIOLIQUIDO_PDCITEMDET || 0);

    const data = new Date(c.DTPREVENTREGA_PDC);
    const dataLocal = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
    const mesFormatado = dataLocal.toLocaleDateString('pt-BR', { month: 'long' });
    const ano = dataLocal.getFullYear();
    const chave = `${mesFormatado.charAt(0).toUpperCase() + mesFormatado.slice(1)} de ${ano}`;

    const mesCurto = dataLocal.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
    const anoCurto = ano.toString().slice(-2);
    const chaveCurta = `${mesCurto}/${anoCurto}`;

    const sortKey = `${ano}-${String(dataLocal.getMonth() + 1).padStart(2, '0')}`;

    if (!mapa[chave]) {
      mapa[chave] = { label: chave, short: chaveCurta, sortKey: sortKey, valor: 0, qtd: new Set() };
    }
    mapa[chave].valor += valorLinha;
    mapa[chave].qtd.add(c.CODIGO_PDC);
  });

  const array = Object.values(mapa).map(m => ({
    label: m.label, short: m.short, sortKey: m.sortKey, valor: m.valor, qtd: m.qtd.size
  }));

  array.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  return array;
});

// --- Fornecedores em Atraso (Todos para a Tabela e Gráficos) ---
const todosAtrasoFornecedores = computed(() => {
  const mapa = {};

  comprasFiltradas.value.forEach(c => {
    if (!isAtrasado(c.DTPREVENTREGA_PDC)) return;

    const fornecedor = c.RAZAOSOCIAL_PESSOA || 'DESCONHECIDO';
    const valorLinha = (c.QTDEABERTA_PDCITEMDET || 0) * (c.VLRUNITARIOLIQUIDO_PDCITEMDET || 0);

    if (!mapa[fornecedor]) mapa[fornecedor] = { valor: 0, qtd: new Set() };
    mapa[fornecedor].valor += valorLinha;
    mapa[fornecedor].qtd.add(c.CODIGO_PDC);
  });

  const array = Object.keys(mapa).map(f => ({ nome: f, valor: mapa[f].valor, qtd: mapa[f].qtd.size }));
  if (supplierChartMode.value === 0) {
    array.sort((a, b) => b.qtd - a.qtd);
  } else {
    array.sort((a, b) => b.valor - a.valor);
  }
  return array;
});

// Gráfico: Top 6
const atrasoFornecedores = computed(() => todosAtrasoFornecedores.value.slice(0, 6));

// CONFIGURAÇÃO DOS GRÁFICOS 

const mainChartType = ref('bar');
const toggleMainChartType = () => {
  mainChartType.value = mainChartType.value === 'bar' ? 'area' : 'bar';
};

const chartOptionsMeses = computed(() => ({
  chart: { toolbar: { show: false }, fontFamily: 'Segoe UI' },
  plotOptions: { bar: { borderRadius: 3, columnWidth: '60%' } },
  colors: ['#181852'],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: mainChartType.value === 'area' ? 2 : 0 },
  fill: { type: mainChartType.value === 'area' ? 'gradient' : 'solid', opacity: mainChartType.value === 'area' ? 0.3 : 1 },
  xaxis: {
    categories: resumoMensal.value.map(m => m.short),
    labels: { style: { colors: '#181852' } },
    axisBorder: { show: false }, axisTicks: { show: false }
  },
  yaxis: { labels: { formatter: (val) => (val / 1000000).toFixed(1) + 'M', style: { colors: '#181852' } } },
  grid: { borderColor: '#f3f4f6' }
}));

const seriesMeses = computed(() => [
  { name: 'Valor Pendente (R$)', data: resumoMensal.value.map(m => m.valor.toFixed(2)) }
]);

const supplierChartMode = ref(0); // 0 = Qtd, 1 = Valor, 2 = Rosca
const toggleSupplierChartType = () => {
  supplierChartMode.value = (supplierChartMode.value + 1) % 3;
};

const chartOptionsFornecedor = computed(() => {
  const isRosca = supplierChartMode.value === 2;
  const isBarra = supplierChartMode.value === 1;

  return {
    chart: { toolbar: { show: false }, fontFamily: 'Segoe UI' },
    plotOptions: { bar: { horizontal: true, borderRadius: 3, distributed: true, barHeight: '80%' } },
    colors: ['rgba(146, 23, 27, 1)', 'rgba(146, 23, 27, 0.85)', 'rgba(146, 23, 27, 0.7)', 'rgba(146, 23, 27, 0.55)', 'rgba(146, 23, 27, 0.4)', 'rgba(146, 23, 27, 0.25)'],
    dataLabels: { enabled: false },
    xaxis: {
      labels: { show: !isRosca, formatter: (val) => isBarra ? 'R$ ' + (val / 1000).toFixed(0) + 'k' : val, style: { colors: '#181852', fontSize: '0.8rem' } },
      axisBorder: { show: false }, axisTicks: { show: false }
    },
    yaxis: { categories: atrasoFornecedores.value.map(f => f.nome), labels: { style: { colors: '#181852', fontWeight: 'bold' } } },
    grid: { show: false },
    tooltip: { y: { formatter: (val) => isBarra ? formatarMoeda(val) : val + ' pedidos' } },
    labels: atrasoFornecedores.value.map(f => f.nome),
    legend: { show: isRosca, position: 'bottom' }
  };
});

const seriesFornecedor = computed(() => {
  if (supplierChartMode.value === 2) return atrasoFornecedores.value.map(f => f.valor);
  const data = supplierChartMode.value === 1 ? atrasoFornecedores.value.map(f => f.valor) : atrasoFornecedores.value.map(f => f.qtd);
  return [{ name: supplierChartMode.value === 1 ? 'Valor' : 'Quantidade', data }];
});

const supplierChartTitle = computed(() => {
  if (supplierChartMode.value === 0) return "Atraso por Fornecedor (Qtd)";
  if (supplierChartMode.value === 1) return "Atraso por Fornecedor (Valor)";
  return "Atraso por Fornecedor (Valor)";
});

const supplierChartColor = computed(() => 'var(--accent-blue)');


// 5. DADOS DAS TABELAS

const topItens = computed(() => {
  const mapa = {};
  comprasFiltradas.value.forEach(c => {
    const item = c.DESCRICAO_ITEM || 'Item Desconhecido';
    const codigoItem = c.ITEM_PDCITEM || '';
    const descFull = codigoItem ? `${codigoItem} - ${item}` : item;
    const valor = (c.QTDEABERTA_PDCITEMDET || 0) * (c.VLRUNITARIOLIQUIDO_PDCITEMDET || 0);
    const qtde = (c.QTDEABERTA_PDCITEMDET || 0);
    const vlrUn = c.VLRUNITARIOLIQUIDO_PDCITEMDET || 0;

    if (!mapa[descFull]) mapa[descFull] = { valor: 0, qtde: 0, vlrUn };
    mapa[descFull].valor += valor;
    mapa[descFull].qtde += qtde;
  });

  const array = Object.keys(mapa).map(k => ({ descricao: k, ...mapa[k] }));
  array.sort((a, b) => b.valor - a.valor);
  return array;
});

const topPedidos = computed(() => {
  const mapa = {};
  comprasFiltradas.value.forEach(c => {
    const cod = c.CODIGO_PDC;
    if (!cod) return;

    const valor = (c.QTDEABERTA_PDCITEMDET || 0) * (c.VLRUNITARIOLIQUIDO_PDCITEMDET || 0);
    const qtde = (c.QTDEABERTA_PDCITEMDET || 0);

    if (!mapa[cod]) {
      mapa[cod] = { codigo: cod, emissao: c.DTEMISSAO_PDC, previsao: c.DTPREVENTREGA_PDC, fornecedor: c.RAZAOSOCIAL_PESSOA, valorTotal: 0, qtdeTotal: 0 };
    }
    mapa[cod].valorTotal += valor;
    mapa[cod].qtdeTotal += qtde;
  });

  const array = Object.values(mapa);
  array.sort((a, b) => new Date(a.previsao) - new Date(b.previsao));
  return array;
});

const tableViewGrid = ref(false);

const supplierViewMode = ref('chart'); // 'chart' ou 'table'
const toggleSupplierView = () => {
  supplierViewMode.value = supplierViewMode.value === 'chart' ? 'table' : 'chart';
};

</script>

<template>
  <div class="compras-root">
    <!-- Cabeçalho do Dashboard -->
    <div class="header">
      <h1><i class="fas fa-chart-line"></i> Dashboard - Pedidos de Compra</h1>
      <button class="action-btn" @click="toggleFiltros">
        <i class="fas fa-filter"></i> {{ uiStore.filtrosVisiveis ? 'Ocultar Filtros' : 'Exibir Filtros' }}
      </button>
    </div>

    <!-- Barra de Filtros -->
    <FiltrosDashboard />

    <!-- Loading -->
    <div v-if="store.carregando" style="text-align: center; padding: 100px; color: var(--text-secondary);">
      <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: var(--accent-blue);"></i>
      <p style="margin-top: 15px; font-weight: 600;">Carregando dashboard...</p>
    </div>

    <template v-else>
      <!-- KPIs Principais -->
      <div class="kpi-grid">
        <KpiCard title="Pedidos Pendentes (Qtd)" :value="kpis.totalPedidos" valueClass="accent" borderColor="blue"
          icon="fas fa-shopping-cart" iconColor="var(--accent-blue)" />
        <KpiCard title="Pedidos Pendentes (R$)" :value="formatarMoeda(kpis.valorPendente)" valueClass="accent"
          borderColor="blue" icon="fas fa-dollar-sign" iconColor="var(--success)" />
        <KpiCard title="Pedidos em Atraso (Qtd)" :value="kpis.pedidosAtraso" valueClass="danger" borderColor="red"
          icon="fas fa-exclamation-triangle" iconColor="var(--danger)" />
        <KpiCard title="Pedidos em Atraso (R$)" :value="formatarMoeda(kpis.valorAtraso)" valueClass="danger"
          borderColor="red" icon="fas fa-money-bill-wave" iconColor="var(--danger)" />
        <KpiCard title="% Pedidos em Atraso" :value="kpis.pctAtraso + '%'" valueClass="danger"" borderColor=" red"
          icon="fas fa-percentage" iconColor="var(--warning)" />
      </div>

      <CartaoGrafico titulo="Valor Pendente por Mês" :tipo="mainChartType" :opcoes="chartOptionsMeses"
        :series="seriesMeses" :exibirGrafico="resumoMensal.length > 0">
        <template #acoes>
          <button class="action-btn" @click="toggleMainChartType" title="Visualização">
            <i class="fas fa-exchange-alt"></i> Visualização
          </button>
        </template>
      </CartaoGrafico>

      <div class="dashboard-grid">
        <div class="card">
          <div class="section-header">
            <h2 class="section-title">Pedidos Pendentes</h2>
          </div>
          <TabelaPaginada :itens="topPedidos" :itensPorPagina="7" :class="{ 'grid-view': tableViewGrid }">
            <template #cabecalho>
              <tr>

                <th>Pedido</th>
                <th>Emissão</th>
                <th>Fornecedor</th>
                <th class="text-right">Qtd.</th>
                <th class="text-right">R$ Total</th>
                <th class="text-right">Prev. Entrega</th>
              </tr>
            </template>
            <template #linha="{ item }">
              <tr>
                <td data-label="Pedido" style="font-weight:bold; color: var(--accent-blue);">{{ item.codigo }}</td>
                <td data-label="Emissão">{{ formatarData(item.emissao) }}</td>
                <td data-label="Fornecedor">{{ item.fornecedor }}</td>
                <td class="text-right" data-label="Qtd.">{{ formatarNumero(item.qtdeTotal) }}</td>
                <td class="text-right" data-label="Valor">{{ formatarNumero(item.valorTotal) }}</td>
                <td class="text-right" data-label="Previsão">
                  <span :class="{ 'date-delayed': isAtrasado(item.previsao) }">{{ formatarData(item.previsao) }}</span>
                </td>
              </tr>
            </template>
          </TabelaPaginada>
        </div>

        <CartaoGrafico :titulo="supplierChartTitle" :tituloCor="supplierChartColor"
          :tipo="supplierChartMode === 2 ? 'donut' : 'bar'" altura="400" :opcoes="chartOptionsFornecedor"
          :series="seriesFornecedor" :exibirGrafico="supplierViewMode === 'chart' && atrasoFornecedores.length > 0">
          <template #acoes>
            <button class="action-btn" @click="toggleSupplierView"
              :title="supplierViewMode === 'chart' ? 'Ver Tabela' : 'Ver Gráfico'">
              <i :class="supplierViewMode === 'chart' ? 'fas fa-table' : 'fas fa-chart-bar'"></i>
              {{ supplierViewMode === 'chart' ? 'Tabela' : 'Gráfico' }}
            </button>
            <button class="action-btn" @click="toggleSupplierChartType" title="Alterar: Qtd / Valor / Rosca"
              v-show="supplierViewMode === 'chart'">
              <i class="fas fa-exchange-alt"></i> Visualização
            </button>
          </template>

          <template #conteudo v-if="supplierViewMode === 'table'">
            <TabelaPaginada :itens="todosAtrasoFornecedores" :itensPorPagina="7">
              <template #cabecalho>
                <tr>
                  <th>Fornecedor</th>
                  <th class="text-right">Qtd. Pedidos</th>
                  <th class="text-right">Valor em Atraso</th>
                </tr>
              </template>
              <template #linha="{ item }">
                <tr>
                  <td style="font-weight: bold; color: var(--accent-blue);">{{ item.nome }}</td>
                  <td class="text-right">{{ item.qtd }}</td>
                  <td class="text-right" style="color: var(--danger); font-weight: 600;">{{ formatarMoeda(item.valor) }}
                  </td>
                </tr>
              </template>
            </TabelaPaginada>
          </template>
        </CartaoGrafico>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <h2 class="section-title" style="margin-bottom: 15px;">Itens Pendentes (Top Valor)</h2>
          <TabelaPaginada :itens="topItens" :itensPorPagina="8">
            <template #cabecalho>
              <tr>
                <th>Descrição Item</th>
                <th class="text-right">Qtd.</th>
                <th class="text-right">R$ Unitário</th>
                <th class="text-right">R$ Total</th>
              </tr>
            </template>
            <template #linha="{ item }">
              <tr>
                <td style="color: var(--accent-blue); font-weight: bold;">{{ item.descricao }}</td>
                <td class="text-right">{{ formatarNumero(item.qtde) }}</td>
                <td class="text-right">{{ formatarMoeda(item.vlrUn) }}</td>
                <td class="text-right">{{ formatarMoeda(item.valor) }}</td>
              </tr>
            </template>
            <!--<template #rodape>
              <tr style="background-color: #f3f4f6; font-weight: bold;">
                <td>TOTAL GERAL PENDENTE</td>
                <td class="text-right">--</td>
                <td></td>
                <td class="text-right">{{ formatarMoeda(kpis.valorPendente) }}</td>
              </tr>
            </template>-->
          </TabelaPaginada>
        </div>

        <div class="card">
          <h2 class="section-title" style="margin-bottom: 15px;">Previsão Detalhada</h2>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Mês / Ano</th>
                  <th class="text-right">Qtd. Pedidos</th>
                  <th class="text-right">R$ Pendente</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="mes in resumoMensal" :key="mes.label">
                  <tr>
                    <td class="tree-month" style="color: var(--accent-blue); font-weight: bold;">{{ mes.label }}</td>
                    <td class="text-right">{{ mes.qtd }}</td>
                    <td class="text-right">{{ formatarMoeda(mes.valor) }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.compras-root {
  background-color: var(--bg-color);
  color: var(--text-primary);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
}

.header {
  margin-bottom: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-size: 1.5rem;
  color: var(--accent-blue);
  font-weight: 700;
  margin: 0;
}
</style>
