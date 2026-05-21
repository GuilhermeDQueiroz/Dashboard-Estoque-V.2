/**
 * 
 * Funções para formatação de dados.
 * 
 */

// Formata valores numéricos como R$ 1.000,00
export const formatarMoeda = (valor: number | null | undefined): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor || 0);
};

// Formata strings de data ISO em padrão local (resolvendo problema de timezone)
export const formatarData = (dataString: string | null | undefined): string => {
  if (!dataString) return '-';
  const data = new Date(dataString);
  // Adiciona o offset para corrigir diferença de fuso horário que poderia jogar o dia para trás
  return new Date(data.getTime() + data.getTimezoneOffset() * 60000).toLocaleDateString('pt-BR');
};

// Formata números normais com precisão de até 2 casas decimais (ex: 1.250,50)
export const formatarNumero = (valor: number | null | undefined): string => {
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 2
  }).format(valor || 0);
};

// Regra de Negócio: Verifica se a data de previsão de entrega já passou
export const isAtrasado = (dataString: string | null | undefined): boolean => {
  if (!dataString) return false;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); // Zera as horas para comparar só o dia

  const data = new Date(dataString);
  const dataPrev = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
  dataPrev.setHours(0, 0, 0, 0);

  return dataPrev < hoje;
};
