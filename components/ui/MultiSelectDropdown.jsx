'use client';

/**
 * Dropdown reutilizável com múltipla seleção via checkboxes.
 * Replica o padrão de filtros do Excel (Selecionar tudo + opções individuais)
 * e mantém compatibilidade com o estado atual que usa um valor "all"
 * para representar a seleção completa.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';

const EMPTY_ARRAY = [];

export default function MultiSelectDropdown({
  label,
  options,
  value,
  onChange,
  allValue = 'all',
  allLabel = 'Todos',
  placeholder = 'Selecionar',
  disabled = false
}) {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const safeValue = Array.isArray(value) ? value : EMPTY_ARRAY;

  const allSelected = useMemo(() => {
    if (!options.length) return false;
    if (safeValue.includes(allValue)) return true;
    const selecionados = safeValue.filter((item) => item !== allValue);
    return selecionados.length === options.length;
  }, [allValue, options.length, safeValue]);

  const selectedValues = useMemo(() => {
    if (allSelected || safeValue.includes(allValue)) {
      return options.map((option) => option.value);
    }
    return safeValue.filter((item) => item !== allValue);
  }, [allSelected, allValue, options, safeValue]);

  const selectedLabels = useMemo(
    () =>
      options
        .filter((option) => selectedValues.includes(option.value))
        .map((option) => option.label),
    [options, selectedValues]
  );

  const summaryLabel = useMemo(() => {
    if (!options.length) return 'Nenhuma opção';
    if (allSelected || selectedLabels.length === options.length) return `${allLabel}`;
    if (!selectedLabels.length) return placeholder;
    if (selectedLabels.length <= 2) return selectedLabels.join(', ');
    return `${selectedLabels.slice(0, 2).join(', ')} +${selectedLabels.length - 2}`;
  }, [allLabel, allSelected, options.length, placeholder, selectedLabels]);

  const filteredOptions = useMemo(() => {
    const termo = query.trim().toLowerCase();
    if (!termo) return options;
    return options.filter((option) => option.label.toLowerCase().includes(termo));
  }, [options, query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!containerRef.current) return;
      if (containerRef.current.contains(event.target)) return;
      setIsOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const handleToggleAll = () => {
    if (allSelected) {
      onChange([]);
      return;
    }
    onChange([allValue]);
  };

  const handleToggleValue = (optionValue) => {
    const atual = new Set(selectedValues);

    if (atual.has(optionValue)) {
      atual.delete(optionValue);
    } else {
      atual.add(optionValue);
    }

    if (atual.size === 0) {
      onChange([]);
      return;
    }

    if (atual.size === options.length) {
      onChange([allValue]);
      return;
    }

    onChange(Array.from(atual));
  };

  const toggleOpen = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="space-y-1" ref={containerRef}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wide text-bjj-gray-200/60">{label}</label>
      )}
      <button
        type="button"
        onClick={toggleOpen}
        className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-bjj-red/60 ${
          disabled
            ? 'cursor-not-allowed border-bjj-gray-800/50 bg-bjj-gray-900/40 text-bjj-gray-200/40'
            : 'border-bjj-gray-800/80 bg-bjj-gray-900/60 text-bjj-gray-200 hover:border-bjj-red/60'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span className="truncate text-sm text-bjj-white/90">{summaryLabel}</span>
        <ChevronDown size={14} className="text-bjj-gray-200/70" />
      </button>

      {isOpen && (
        <div className="absolute z-30 mt-1 w-full min-w-[220px] max-w-xs rounded-2xl border border-bjj-gray-800/80 bg-bjj-gray-900/95 p-3 shadow-focus">
          <div className="flex items-center gap-2 rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 px-2 py-1.5">
            <Search size={14} className="text-bjj-gray-200/60" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Pesquisar"
              className="flex-1 bg-transparent text-xs text-bjj-white placeholder:text-bjj-gray-200/50 focus:outline-none"
            />
          </div>
          <div className="mt-2 max-h-52 space-y-1 overflow-y-auto pr-1 text-xs">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-bjj-gray-200 transition hover:bg-bjj-gray-800/70">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-bjj-gray-700 bg-bjj-gray-900/90 text-bjj-red focus:ring-bjj-red"
                checked={allSelected}
                onChange={handleToggleAll}
              />
              <span className="flex-1 text-[11px] uppercase tracking-wide text-bjj-gray-200/80">{allLabel}</span>
            </label>
            <div className="h-px bg-bjj-gray-800/60" />
            {filteredOptions.length === 0 && (
              <p className="px-2 py-2 text-[11px] text-bjj-gray-200/50">Nenhuma opção encontrada.</p>
            )}
            {filteredOptions.map((option) => {
              const checked = allSelected || selectedValues.includes(option.value);
              return (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-bjj-gray-200 transition hover:bg-bjj-gray-800/70"
                >
                  <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded border border-bjj-gray-700 bg-bjj-gray-900/90">
                    <input
                      type="checkbox"
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      checked={checked}
                      onChange={() => handleToggleValue(option.value)}
                    />
                    {checked && <Check size={12} className="text-bjj-red" />}
                  </span>
                  <span className="flex-1 truncate text-sm text-bjj-white/80">{option.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
