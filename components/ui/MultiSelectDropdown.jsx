'use client';

/**
 * Dropdown reutilizável com múltipla seleção via checkboxes.
 * Replica o padrão de filtros do Excel (Selecionar tudo + opções individuais)
 * e mantém compatibilidade com o estado atual que usa um valor "all"
 * para representar a seleção completa.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { iconColors, iconSizes, iconVariants } from '@/styles/iconTokens';

const EMPTY_ARRAY = [];

export default function MultiSelectDropdown({
  label,
  options,
  value,
  values,
  onChange,
  allValue = 'all',
  allLabel = 'Todos',
  placeholder = 'Selecionar',
  disabled = false,
  className = ''
}) {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const optionValues = useMemo(() => options.map((option) => option.value), [options]);
  const resolvedValue = value ?? values;
  const safeValue = useMemo(
    () => (Array.isArray(resolvedValue) ? resolvedValue.filter(Boolean) : EMPTY_ARRAY),
    [resolvedValue]
  );
  const hasAllSelected = safeValue.includes(allValue);

  const selectedValues = useMemo(() => {
    if (!options.length) return EMPTY_ARRAY;
    if (hasAllSelected) {
      return optionValues;
    }
    return safeValue.filter((item) => optionValues.includes(item));
  }, [hasAllSelected, optionValues, options.length, safeValue]);

  const isAllActive = useMemo(
    () => optionValues.length > 0 && selectedValues.length === optionValues.length,
    [optionValues.length, selectedValues.length]
  );

  const selectedLabels = useMemo(
    () =>
      options
        .filter((option) => selectedValues.includes(option.value))
        .map((option) => option.label),
    [options, selectedValues]
  );

  const summaryLabel = useMemo(() => {
    if (!options.length) return 'Nenhuma opção';
    if (!safeValue.length || hasAllSelected || isAllActive) {
      return allLabel;
    }
    if (!selectedLabels.length) {
      return placeholder;
    }
    if (selectedLabels.length <= 2) return selectedLabels.join(', ');
    return `${selectedLabels.slice(0, 2).join(', ')} +${selectedLabels.length - 2}`;
  }, [allLabel, hasAllSelected, isAllActive, options.length, placeholder, safeValue.length, selectedLabels]);

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
    if (hasAllSelected || isAllActive) {
      onChange([]);
    } else {
      onChange([allValue]);
    }
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

    if (atual.size === optionValues.length) {
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
    <div
      className={`relative flex flex-col gap-1 ${className}`.trim()}
      ref={containerRef}
    >
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wide text-bjj-gray-200/60">{label}</label>
      )}
      <button
        type="button"
        onClick={toggleOpen}
        className={`select select-bordered flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-bjj-gray-700 bg-bjj-gray-900/70 px-3.5 text-left text-sm font-medium text-bjj-white transition focus:border-bjj-red focus:outline-none focus-visible:ring-2 focus-visible:ring-bjj-red/60 ${
          disabled
            ? 'cursor-not-allowed text-bjj-gray-300/50'
            : 'hover:border-bjj-red'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span className="truncate text-sm text-bjj-white/90">{summaryLabel}</span>
        <ChevronDown className={`${iconSizes.sm} ${iconColors.muted}`} />
      </button>

      {isOpen && (
        <div className="absolute z-30 mt-1 w-full min-w-[220px] max-w-xs rounded-2xl border border-bjj-gray-800/80 bg-bjj-gray-900/95 p-3 shadow-focus">
          <div className="flex items-center gap-2 rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 px-2 py-1.5">
            <Search className={`${iconSizes.sm} ${iconColors.muted}`} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Pesquisar"
              className="flex-1 bg-transparent text-xs text-bjj-white placeholder:text-bjj-gray-200/50 focus:outline-none"
            />
          </div>
          <div className="scrollbar-dark mt-2 max-h-52 space-y-1 overflow-y-auto pr-1 text-xs">
            <button
              type="button"
              onClick={handleToggleAll}
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition ${
                hasAllSelected || isAllActive
                  ? 'bg-bjj-gray-800/80 text-bjj-white'
                  : 'text-bjj-gray-200 hover:bg-bjj-gray-800/70'
              }`}
            >
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded border border-bjj-gray-700 bg-bjj-gray-900/90">
                {(hasAllSelected || isAllActive) && <Check className={`${iconSizes.xs} ${iconColors.primary}`} />}
              </span>
              <span className="flex-1 text-[11px] uppercase tracking-wide">{allLabel}</span>
            </button>
            <div className="h-px bg-bjj-gray-800/60" />
            {filteredOptions.length === 0 && (
              <p className="px-2 py-2 text-[11px] text-bjj-gray-200/50">Nenhuma opção encontrada.</p>
            )}
            {filteredOptions.map((option) => {
              const checked = hasAllSelected || isAllActive || selectedValues.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleToggleValue(option.value)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition ${
                    checked ? 'bg-bjj-gray-800/80 text-bjj-white' : 'text-bjj-gray-200 hover:bg-bjj-gray-800/70'
                  }`}
                >
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded border border-bjj-gray-700 bg-bjj-gray-900/90">
                    {checked && <Check className={`${iconSizes.xs} ${iconColors.primary}`} />}
                  </span>
                  <span className="flex-1 truncate text-sm text-bjj-white/80">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
