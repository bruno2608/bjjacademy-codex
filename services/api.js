/**
 * Arquivo de configuração simulando uma API REST.
 * Centraliza atrasos de rede e conversão de respostas.
 */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function mockRequest(response, delay = 400) {
  await wait(delay);
  return response;
}
