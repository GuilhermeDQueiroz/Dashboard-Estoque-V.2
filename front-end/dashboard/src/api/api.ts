import axios from "axios";

/**
 * Configuração Central do Axios para a API
 * 
 * Cria uma instância do Axios configurada com a baseURL do nosso back-end.
 * Isso evita a necessidade de digitar "http://localhost:3000/api" em 
 * todas as chamadas de API feitas no front-end.
 */
export const api = axios.create({
  baseURL: "http://localhost:3000/api"
});