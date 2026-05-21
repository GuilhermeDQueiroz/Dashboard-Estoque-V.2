<script setup>
// Importa hooks do ciclo de vida do Vue e funções reativas
import { onMounted, computed } from "vue";
// Importa a store Pinia que lida com os dados de Vendas
import { useVendasStore } from "../stores/vendasStore";
// Importa o componente para criar gráficos visualmente atraentes
import VueApexCharts from "vue3-apexcharts";
// Importa os utilitários e componentes
import { formatarMoeda, formatarData, formatarNumero } from "../utils/formatters";
import KpiCard from "../components/KpiCard.vue";

// Instancia a store para usar na tela
const store = useVendasStore();

// onMounted: Executado assim que a tela é montada (carregada) no navegador
onMounted(() => {
  store.carregarVendas(); // Dispara a requisição à API para buscar as vendas
});

// ==========================================
// 1. CÁLCULO DOS KPIs (Cards Superiores)
// ==========================================
// "computed" faz com que esses valores se auto-atualizem reativamente assim que os dados da API chegam na store
const kpis = computed(() => {
  const totalVendas = store.vendas.length;
  // Reduce itera sobre todas as vendas para somar os valores específicos
  const faturamentoTotal = store.vendas.reduce((acc, v) => acc + (v.VLRLIQUIDO_DOCFAT || 0), 0);
  const pesoTotal = store.vendas.reduce((acc, v) => acc + (v.PESO_DOCFAT || 0), 0);
  const volumeM3Total = store.vendas.reduce((acc, v) => acc + (v.VOLUMEM3_DOCFAT || 0), 0);

  return { totalVendas, faturamentoTotal, pesoTotal, volumeM3Total };
});

// ==========================================
// 3. AGRUPAMENTO DE DADOS PARA OS GRÁFICOS
// ==========================================
// Agrupa os dados por dia para não repetir datas no eixo X
const dadosAgrupadosPorDia = computed(() => {
  const mapa = {};
  
  store.vendas.forEach(v => {
    const data = formatarData(v.DTEMISSAO_DOCFAT);
    if (!mapa[data]) {
      mapa[data] = { valor: 0, volumes: 0 };
    }
    mapa[data].valor += (v.VLRLIQUIDO_DOCFAT || 0);
    mapa[data].volumes += (v.VOLUMES_DOCFAT || 0);
  });

  // Ordena pelas datas (simplificado)
  const datas = Object.keys(mapa).sort();
  const valores = datas.map(d => mapa[d].valor.toFixed(2));
  const volumes = datas.map(d => mapa[d].volumes);

  return { datas, valores, volumes };
});

// ==========================================
// 4. CONFIGURAÇÃO DOS GRÁFICOS (ApexCharts)
// ==========================================
// Gráfico 1: Faturamento Financeiro (Área)
const chartOptionsFinanceiro = computed(() => ({
  chart: { type: 'area', toolbar: { show: false } },
  colors: ['#00E396'],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth' },
  xaxis: { categories: dadosAgrupadosPorDia.value.datas },
  yaxis: { labels: { formatter: (val) => formatarMoeda(val) } },
  title: { text: 'Faturamento por Dia', align: 'left' }
}));

const seriesFinanceiro = computed(() => [
  { name: 'Faturamento Bruto', data: dadosAgrupadosPorDia.value.valores }
]);

// Gráfico 2: Logística - Volumes (Barras)
const chartOptionsLogistica = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false } },
  colors: ['#FEB019'],
  dataLabels: { enabled: true },
  xaxis: { categories: dadosAgrupadosPorDia.value.datas },
  title: { text: 'Qtd de Volumes Expedidos por Dia', align: 'left' }
}));

const seriesLogistica = computed(() => [
  { name: 'Volumes', data: dadosAgrupadosPorDia.value.volumes }
]);

</script>

<template>
  <div class="dashboard-container">
    <header class="header">
      <h1>Painel de Controle Comercial e Logístico</h1>
      <p>Acompanhamento de Vendas e Expedição</p>
    </header>

    <div class="kpi-grid">
      <KpiCard title="Total de Pedidos" :value="kpis.totalVendas" borderColor="blue" />
      <KpiCard title="Faturamento Total" :value="formatarMoeda(kpis.faturamentoTotal)" valueClass="money" borderColor="blue" />
      <KpiCard title="Peso Total (Kg)" :value="formatarNumero(kpis.pesoTotal) + ' kg'" valueClass="logistica" borderColor="yellow" />
      <KpiCard title="Cubagem Total (m³)" :value="formatarNumero(kpis.volumeM3Total) + ' m³'" valueClass="logistica" borderColor="yellow" />
    </div>

    <div class="charts-grid" v-if="store.vendas.length > 0">
      <div class="chart-box">
        <VueApexCharts type="area" height="300" :options="chartOptionsFinanceiro" :series="seriesFinanceiro" />
      </div>
      <div class="chart-box">
        <VueApexCharts type="bar" height="300" :options="chartOptionsLogistica" :series="seriesLogistica" />
      </div>
    </div>

    <div class="table-container">
      <h2>Detalhamento dos Pedidos</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Emissão</th>
            <th>Cliente</th>
            <th>Qtd Itens</th>
            <th>Volumes</th>
            <th>Peso Bruto (Kg)</th>
            <th>Valor Líquido</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in store.vendas" :key="v.CODIGO_DOCFAT">
            <td>#{{ v.CODIGO_DOCFAT }}</td>
            <td>{{ formatarData(v.DTEMISSAO_DOCFAT) }}</td>
            <td>{{ v.CLIENTE_DOCFAT }}</td>
            <td>{{ v.QTDETOTALITENS_DOCFAT }}</td>
            <td>{{ v.VOLUMES_DOCFAT }}</td>
            <td>{{ formatarNumero(v.PESO_DOCFAT) }}</td>
            <td class="valor-col">{{ formatarMoeda(v.VLRLIQUIDO_DOCFAT) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* Estilos mantidos apenas se forem estritamente específicos do Dashboard de Vendas.
   O restante (cards, grids, botões) foi movido para o global.css */
.header h1 {
  margin-bottom: 5px;
  color: var(--accent-blue);
}
.header p {
  color: var(--text-secondary);
  margin-top: 0;
  margin-bottom: 30px;
}
.valor-col {
  font-weight: bold;
  color: var(--success);
}
</style>