/**
 * Utilitário central de navegação derivado do site map completo.
 * Permite montar menus diferentes reutilizando a mesma fonte de verdade.
 */
import { filterSiteMapByRoles, siteMap, flattenSiteMap } from '../config/siteMap';

export const navigationItems = siteMap;

/**
 * Retorna os itens de navegação filtrados pelos papéis informados.
 */
export function getNavigationItemsForRoles(roles = []) {
  return filterSiteMapByRoles(siteMap, Array.isArray(roles) ? roles : []);
}

/**
 * Deixa disponível uma versão achatada do mapa para consultas pontuais
 * (ex.: verificar rapidamente se o usuário tem acesso a determinada rota).
 */
export function flattenNavigation(items = siteMap) {
  return flattenSiteMap(items);
}

export default siteMap;
