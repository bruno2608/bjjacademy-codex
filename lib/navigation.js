/**
 * Utilitário central de navegação derivado do site map completo.
 * Permite montar menus diferentes reutilizando a mesma fonte de verdade.
 */
import { filterSiteMapByRoles, siteMap } from '../config/siteMap';

export const navigationItems = siteMap;

/**
 * Retorna os itens de navegação filtrados pelos papéis informados.
 */
export function getNavigationItemsForRoles(roles = []) {
  return filterSiteMapByRoles(siteMap, Array.isArray(roles) ? roles : []);
}

export default siteMap;
