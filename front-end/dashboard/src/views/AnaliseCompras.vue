<script setup>
import { onMounted, computed, ref } from "vue";
import { useAnaliseComprasStore } from "../stores/analiseComprasStore";
import { useUiStore } from "../stores/uiStore";
import KpiCard from "../components/KpiCard.vue";
import FiltrosDashboard from "../components/FiltrosDashboard.vue";
import TabelaPaginada from "../components/TabelaPaginada.vue";
import CartaoGrafico from "../components/CartaoGrafico.vue";
import LoadingState from "../components/LoadingState.vue";
import { formatarMoeda, formatarNumero } from "../utils/formatters";

const store = useAnaliseComprasStore();
const uiStore = useUiStore();

// Controle de visibilidade da barra de filtros
const toggleFiltros = () => {
  uiStore.toggleFiltros();
};

// Computed para filtrar os dados brutos da store
const dadosFiltrados = computed(() => {
  if (!store.dados || store.dados.length === 0) return [];

  return store.dados.filter(c => {
    if (uiStore.filtros.fornecedor && c.RAZAOSOCIAL_PESSOA) {
      if (!c.RAZAOSOCIAL_PESSOA.toLowerCase().includes(uiStore.filtros.fornecedor.toLowerCase())) return false;
    }
    if (uiStore.filtros.item && c.DESCRICAO_ITEM) {
      if (!c.DESCRICAO_ITEM.toLowerCase().includes(uiStore.filtros.item.toLowerCase())) return false;
    }
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

onMounted(() => {
  store.carregando = true;

  if (!uiStore.manterFiltros) {
    uiStore.limparFiltros();
  }

  store.carregarHistorico();
});

// KPIs 
const kpis = computed(() => {
  let totalValor = 0;
  let totalQtde = 0;

  dadosFiltrados.value.forEach(c => {
    const qtde = c.QTDEPEDIDO_PDCITEMDET || 0;
    const vlr = c.VLRUNITARIOLIQUIDO_PDCITEMDET || 0;
    totalValor += qtde * vlr;
    totalQtde += qtde;
  });

  return { totalValor, totalQtde };
});

// EVOLUÇÃO MENSAL
const evolucaoMensal = computed(() => {
  const mapa = {};

  dadosFiltrados.value.forEach(c => {
    if (!c.DTEMISSAO_PDC) return;
    const qtde = c.QTDEPEDIDO_PDCITEMDET || 0;
    const vlr = c.VLRUNITARIOLIQUIDO_PDCITEMDET || 0;
    const valor = qtde * vlr;

    const data = new Date(c.DTEMISSAO_PDC);
    const dataLocal = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
    const ano = dataLocal.getFullYear();
    const mes = dataLocal.getMonth();
    const sortKey = `${ano}-${String(mes + 1).padStart(2, '0')}`;
    const mesCurto = dataLocal.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
    const anoCurto = ano.toString().slice(-2);
    const label = `${mesCurto}/${anoCurto}`;

    if (!mapa[sortKey]) mapa[sortKey] = { label, sortKey, valor: 0, qtde: 0 };
    mapa[sortKey].valor += valor;
    mapa[sortKey].qtde += qtde;
  });

  const array = Object.values(mapa);
  array.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  return array;
});

// R$ MÉDIO DE ITEM 
const precoMedioMensal = computed(() => {
  return evolucaoMensal.value.map(m => {
    const medio = m.qtde > 0 ? m.valor / m.qtde : 0;
    return { ...m, medio };
  });
});

// TOP FORNECEDORES
const topFornecedores = computed(() => {
  const mapa = {};

  dadosFiltrados.value.forEach(c => {
    const fornecedor = c.RAZAOSOCIAL_PESSOA || 'DESCONHECIDO';
    const codFornecedor = c.FORNECEDOR_PDC || '';
    const qtde = c.QTDEPEDIDO_PDCITEMDET || 0;
    const vlr = c.VLRUNITARIOLIQUIDO_PDCITEMDET || 0;
    const valor = qtde * vlr;

    const key = codFornecedor + '|' + fornecedor;
    if (!mapa[key]) mapa[key] = { codigo: codFornecedor, nome: fornecedor, valor: 0 };
    mapa[key].valor += valor;
  });

  const array = Object.values(mapa);
  array.sort((a, b) => b.valor - a.valor);
  return array;
});

// DETALHAMENTO DE ITENS
const detalheItens = computed(() => {
  const mapa = {};

  dadosFiltrados.value.forEach(c => {
    const item = c.DESCRICAO_ITEM || 'Item Desconhecido';
    const codigoItem = c.ITEM_PDCITEM || '';
    const descFull = codigoItem ? `${codigoItem} - ${item}` : item;
    const qtde = c.QTDEPEDIDO_PDCITEMDET || 0;
    const vlr = c.VLRUNITARIOLIQUIDO_PDCITEMDET || 0;
    const valor = qtde * vlr;

    if (!mapa[descFull]) mapa[descFull] = { descricao: descFull, qtde: 0, valor: 0 };
    mapa[descFull].qtde += qtde;
    mapa[descFull].valor += valor;
  });

  const array = Object.values(mapa).map(i => ({
    ...i,
    medio: i.qtde > 0 ? i.valor / i.qtde : 0
  }));
  array.sort((a, b) => b.valor - a.valor);
  return array;
});

const mediaPrecoGlobal = computed(() => {
  const total = detalheItens.value.reduce((acc, i) => acc + i.medio, 0);
  return detalheItens.value.length > 0 ? total / detalheItens.value.length : 0;
});

// CONFIGURAÇÃO DOS GRÁFICOS
const chartType1 = ref('bar');
const toggleChart1 = () => { chartType1.value = chartType1.value === 'bar' ? 'area' : 'bar'; };

const chartOptionsCompras = computed(() => ({
  chart: { toolbar: { show: false }, fontFamily: 'Segoe UI' },
  plotOptions: { bar: { borderRadius: 3, columnWidth: '60%' } },
  colors: ['#181852'],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: chartType1.value === 'area' ? 2 : 0 },
  fill: { type: chartType1.value === 'area' ? 'gradient' : 'solid', opacity: chartType1.value === 'area' ? 0.3 : 1 },
  xaxis: {
    categories: evolucaoMensal.value.map(m => m.label),
    labels: { style: { colors: '#181852' } },
    axisBorder: { show: false }, axisTicks: { show: false }
  },
  yaxis: { labels: { formatter: (val) => (val / 1000000).toFixed(1) + 'M', style: { colors: '#181852' } } },
  grid: { borderColor: '#f3f4f6' }
}));

const seriesCompras = computed(() => [
  { name: 'Compras (R$)', data: evolucaoMensal.value.map(m => m.valor.toFixed(2)) }
]);

const chartType2 = ref('area');
const toggleChart2 = () => { chartType2.value = chartType2.value === 'bar' ? 'area' : 'bar'; };

const coresPrecoMedio = computed(() => {
  const valores = precoMedioMensal.value.map(m => m.medio);
  if (valores.length === 0) return [];

  const max = Math.max(...valores);
  const min = Math.min(...valores);
  const avg = valores.reduce((a, b) => a + b, 0) / valores.length;

  const limiteSuperior = avg + (max - avg) * 0.4;
  const limiteInferior = avg - (avg - min) * 0.4;

  return precoMedioMensal.value.map(m => {
    if (m.medio >= limiteSuperior) return 'rgb(146, 23, 27)';
    if (m.medio <= limiteInferior) return '#65a30d';
    return '#eab308';
  });
});

const chartOptionsPreco = computed(() => ({
  chart: { toolbar: { show: false }, fontFamily: 'Segoe UI' },
  plotOptions: { bar: { borderRadius: 3, columnWidth: '60%', distributed: chartType2.value === 'bar' } },
  colors: chartType2.value === 'bar' ? coresPrecoMedio.value : ['rgb(146, 23, 27)'],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: chartType2.value === 'area' ? 2 : 0 },
  fill: { type: chartType2.value === 'area' ? 'gradient' : 'solid', opacity: chartType2.value === 'area' ? 0.3 : 1 },
  xaxis: {
    categories: precoMedioMensal.value.map(m => m.label),
    labels: { style: { colors: '#181852' } },
    axisBorder: { show: false }, axisTicks: { show: false }
  },
  yaxis: { labels: { formatter: (val) => 'R$ ' + val.toFixed(0), style: { colors: '#181852' } } },
  grid: { borderColor: '#f3f4f6' },
  legend: { show: false }
}));

const seriesPreco = computed(() => [
  { name: 'Preço Médio (R$)', data: precoMedioMensal.value.map(m => m.medio.toFixed(2)) }
]);

</script>

<template>
  <div class="compras-root">
    <!-- Cabeçalho -->
    <div class="header">
      <h1><i class="fas fa-chart-bar"></i> Dashboard - Análise de Compras (36 Meses)</h1>
      <button class="action-btn" @click="toggleFiltros">
        <i class="fas fa-filter"></i> {{ uiStore.filtrosVisiveis ? 'Ocultar Filtros' : 'Exibir Filtros' }}
      </button>
    </div>

    <!-- Barra de Filtros Componentizada -->
    <FiltrosDashboard />

    <!-- Loading -->
    <LoadingState v-if="store.carregando" />

    <template v-else>
      <!-- KPIs -->
      <div class="kpi-grid kpi-grid-auto">
        <KpiCard title="Total Compras (R$)" :value="formatarMoeda(kpis.totalValor)" valueClass="success"
          borderColor="blue" icon="fas fa-money-check-alt" iconColor="var(--success)" />
        <KpiCard title="Total Itens (Qtd)" :value="formatarNumero(kpis.totalQtde)" valueClass="accent"
          borderColor="blue" icon="fas fa-boxes" iconColor="var(--warning)" />
      </div>

      <!-- Gráficos -->
      <div class="dashboard-grid grid-2-cols">
        <CartaoGrafico titulo="R$ Compras Realizadas" :tipo="chartType1" :opcoes="chartOptionsCompras"
          :series="seriesCompras" :exibirGrafico="evolucaoMensal.length > 0">
          <template #acoes>
            <button class="action-btn" @click="toggleChart1">
              <i class="fas fa-exchange-alt"></i> Visualização
            </button>
          </template>
        </CartaoGrafico>

        <CartaoGrafico titulo="R$ Médio de Item" :tipo="chartType2" :opcoes="chartOptionsPreco" :series="seriesPreco"
          :exibirGrafico="precoMedioMensal.length > 0">
          <template #acoes>
            <button class="action-btn" @click="toggleChart2">
              <i class="fas fa-exchange-alt"></i> Visualização
            </button>
          </template>
        </CartaoGrafico>
      </div>

      <!-- Tabelas -->
      <div class="dashboard-grid grid-2-cols">
        <!-- Fornecedores -->
        <div class="card">
          <div class="section-header">
            <h2 class="section-title">Detalhamento de Fornecedores</h2>
          </div>
          <TabelaPaginada :itens="topFornecedores" :itensPorPagina="7">
            <template #cabecalho>
              <tr>
                <th>Fornecedor</th>
                <th class="text-right">% Entrega no Prazo</th>
                <th class="text-right">R$ Total</th>
              </tr>
            </template>
            <template #linha="{ item }">
              <tr>
                <td class="text-accent-bold">
                  {{ item.codigo ? item.codigo + ' - ' : '' }}{{ item.nome }}
                </td>
                <td class="text-right">{{ }}</td>
                <td class="text-right">{{ formatarMoeda(item.valor) }}</td>
              </tr>
            </template>
          </TabelaPaginada>
        </div>

        <!-- Detalhamento de Itens -->
        <div class="card">
          <div class="section-header">
            <h2 class="section-title">Detalhamento de Itens</h2>
          </div>
          <TabelaPaginada :itens="detalheItens" :itensPorPagina="7">
            <template #cabecalho>
              <tr>
                <th>Item</th>
                <th class="text-right">Qtd.</th>
                <th class="text-right">R$ Total</th>
                <th class="text-right">R$ Médio</th>
              </tr>
            </template>
            <template #linha="{ item }">
              <tr>
                <td class="text-small text-accent-bold">{{ item.descricao }}</td>
                <td class="text-right">{{ formatarNumero(item.qtde) }}</td>
                <td class="text-right">{{ formatarMoeda(item.valor) }}</td>
                <td class="text-right" :class="{ 'text-danger-bold': item.medio > mediaPrecoGlobal * 3 }">
                  {{ formatarMoeda(item.medio) }}
                </td>
              </tr>
            </template>
          </TabelaPaginada>
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
