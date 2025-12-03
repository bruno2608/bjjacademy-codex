'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';

import { getNavigationConfigForRoles } from '../../lib/navigation';
import useRole from '../../hooks/useRole';
import UserMenu from './UserMenu';
import AdminTiViewSwitcher from './AdminTiViewSwitcher';

const resolveActivePath = (pathname, item) => {
  const target = typeof item?.href === 'string' ? item.href : item?.href?.pathname || item?.path;
  if (!target) return false;
  return pathname === target || pathname.startsWith(`${target}/`);
};

export default function TabletNav() {
  const pathname = usePathname();
  const { roles } = useRole();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openDrawerGroups, setOpenDrawerGroups] = useState({});
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationConfig = useMemo(() => getNavigationConfigForRoles(roles), [roles]);
  const { topNav, drawerNav, variant } = navigationConfig;

  const toggleDropdown = (key) => {
    setOpenDropdown((current) => (current === key ? null : key));
  };

  const toggleDrawerGroup = (key) => {
    setOpenDrawerGroups((current) => ({ ...current, [key]: !current[key] }));
  };

  const renderDropdown = (item) => {
    const isOpen = openDropdown === item.key;
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => toggleDropdown(item.key)}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-bjj-gray-100 transition hover:bg-bjj-gray-900/70 whitespace-nowrap"
          aria-expanded={isOpen}
        >
          <span className="whitespace-nowrap">{item.title}</span>
          <ChevronDown size={14} className={`transition ${isOpen ? 'rotate-180 text-bjj-white' : 'text-bjj-gray-400'}`} />
        </button>
        {isOpen ? (
          <div className="absolute left-0 z-50 mt-2 w-64 rounded-2xl border border-bjj-gray-800/80 bg-bjj-gray-900/95 p-2 shadow-[0_25px_65px_rgba(0,0,0,0.55)]">
            <ul className="space-y-1 text-sm text-bjj-gray-100">
              {item.children?.map((child) => (
                <li key={child.key}>
                  <Link
                    href={child.href || child.path}
                    className="flex flex-col gap-0.5 rounded-xl px-3 py-2 transition hover:bg-bjj-gray-800/60"
                  >
                    <span className="font-medium">{child.title}</span>
                    {child.description ? (
                      <span className="text-[11px] text-bjj-gray-400">{child.description}</span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    );
  };

  const renderTopItem = (item) => {
    const isActive = resolveActivePath(pathname, item);

    if (item.children?.length) {
      return (
        <li key={item.key} className="relative">
          {renderDropdown(item)}
        </li>
      );
    }

    return (
      <li key={item.key}>
        <Link
          href={item.href || item.path}
          className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition whitespace-nowrap ${
            isActive
              ? 'bg-bjj-red/15 text-bjj-white shadow-[0_12px_32px_rgba(225,6,0,0.18)]'
              : 'text-bjj-gray-100 hover:bg-bjj-gray-900/70'
          }`}
        >
          <span className="whitespace-nowrap">{item.title}</span>
        </Link>
      </li>
    );
  };

  const renderDrawerItems = () => {
    if (!drawerNav?.length) return null;
    let currentSection = null;

    return drawerNav.map((item, index) => {
      const isActive = resolveActivePath(pathname, item);
      const sectionChanged = item.section && item.section !== currentSection;
      if (sectionChanged) {
        currentSection = item.section;
      }

      return (
        <div key={`${item.title}-${index}`} className="flex flex-col gap-1">
          {sectionChanged ? (
            <span className="text-[11px] uppercase tracking-[0.22em] text-bjj-gray-400">{item.section}</span>
          ) : null}

          {item.children?.length ? (
            <div className="rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/60">
              <button
                type="button"
                onClick={() => toggleDrawerGroup(item.key || item.title)}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-bjj-gray-100"
                aria-expanded={openDrawerGroups[item.key || item.title] ? 'true' : 'false'}
              >
                <span>{item.title}</span>
                <ChevronDown
                  size={14}
                  className={`transition ${openDrawerGroups[item.key || item.title] ? 'rotate-180 text-bjj-white' : 'text-bjj-gray-400'}`}
                />
              </button>
              {openDrawerGroups[item.key || item.title] ? (
                <ul className="flex flex-col gap-1 border-t border-bjj-gray-800/80 px-2 py-2 text-sm">
                  {item.children.map((child) => {
                    const childActive = resolveActivePath(pathname, child);
                    return (
                      <li key={child.key}>
                        <Link
                          href={child.href || child.path}
                          onClick={() => setDrawerOpen(false)}
                          className={`flex items-center justify-between rounded-xl px-3 py-2 transition ${
                            childActive
                              ? 'bg-bjj-red/10 text-bjj-white shadow-[0_12px_30px_rgba(225,6,0,0.16)]'
                              : 'text-bjj-gray-200 hover:bg-bjj-red/10 hover:text-bjj-white'
                          }`}
                        >
                          <span>{child.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          ) : (
            <Link
              href={item.href || item.path}
              onClick={() => setDrawerOpen(false)}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
                isActive
                  ? 'border-bjj-red/70 bg-bjj-red/10 text-bjj-white shadow-[0_18px_45px_rgba(225,6,0,0.18)]'
                  : 'border-bjj-gray-800/70 text-bjj-gray-200 hover:border-bjj-red/60 hover:bg-bjj-red/10 hover:text-bjj-white'
              }`}
            >
              <span>{item.title}</span>
            </Link>
          )}
        </div>
      );
    });
  };

  if (!topNav?.length) return null;

  return (
    // Sticky header stays visible while scrolling; shadow toggles when the page moves.
    // Fixed positioning keeps the bar pinned on all viewports, while the AppShell adds top padding to clear it.
    <nav
      className={`fixed inset-x-0 top-0 z-40 border-b bg-bjj-black/95 backdrop-blur transition-shadow ${
        isScrolled ? 'border-bjj-gray-700/80 shadow-[0_18px_30px_rgba(0,0,0,0.35)]' : 'border-bjj-gray-800/70'
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-6 xl:px-8">
        <div className="flex flex-1 items-center gap-6">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/80 text-bjj-gray-100 transition hover:border-bjj-red/70 hover:text-bjj-white md:hidden"
            aria-label={drawerOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={18} />
          </button>

          <span className="text-sm font-semibold uppercase tracking-wide text-bjj-gray-200 md:hidden">BJJ Academy</span>

          <ul className="hidden items-center gap-1 md:flex">{topNav.map((item) => renderTopItem(item))}</ul>
        </div>

        <div className="flex items-center gap-3">
          <AdminTiViewSwitcher />
          <div className="hidden text-sm font-semibold text-bjj-gray-300 md:block">
            {variant === 'staff' ? 'Visão Staff' : 'Área do aluno'}
          </div>
          <UserMenu />
        </div>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 bg-bjj-black/80 backdrop-blur-sm md:hidden">
          <div className="absolute inset-x-0 top-0 mx-auto flex w-full max-w-md flex-col gap-4 rounded-b-3xl border-b border-bjj-gray-800 bg-bjj-gray-900/95 p-5 shadow-[0_45px_75px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wide text-bjj-gray-200">Menu principal</span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-2 text-bjj-gray-100 transition hover:border-bjj-red/70 hover:text-bjj-white"
                aria-label="Fechar menu"
              >
                <X size={16} />
              </button>
            </div>

            <nav className="flex max-h-[70vh] flex-col gap-2 overflow-y-auto">{renderDrawerItems()}</nav>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
