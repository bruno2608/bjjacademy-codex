import { filterSiteMapByRoles, getRoutesForRoles, siteMap } from '../config/sitemap';
import { normalizeRoles } from '../config/roles';

export const navigationItems = siteMap;

export function getNavigationItemsForRoles(roles = [], { includeHidden = false } = {}) {
  const safeRoles = normalizeRoles(Array.isArray(roles) ? roles : []);
  const filtered = filterSiteMapByRoles(siteMap, safeRoles);
  if (includeHidden) return filtered;
  return filtered.filter((item) => item.showInMainNav !== false);
}

export function flattenNavigation(items = siteMap) {
  return items;
}

export function getAllowedPaths(roles = []) {
  const safeRoles = normalizeRoles(Array.isArray(roles) ? roles : []);
  return getRoutesForRoles(safeRoles);
}

export default siteMap;
