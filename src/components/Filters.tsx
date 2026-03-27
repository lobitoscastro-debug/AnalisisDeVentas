import React, { useState } from 'react';
import { Filter, X, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { FilterState } from '../types';

interface FiltersProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  options: {
    countries: string[];
    channels: string[];
    sellers: string[];
    products: string[];
    paymentMethods: string[];
    clients: string[];
  };
}

export const Filters: React.FC<FiltersProps> = ({ filters, setFilters, options }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    countries: true,
    channels: true,
    sellers: false,
    products: false,
    paymentMethods: false,
    clients: false,
  });

  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});

  const handleMultiSelect = (key: keyof FilterState, value: string) => {
    const current = filters[key] as string[];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setFilters({ ...filters, [key]: updated });
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      countries: [],
      channels: [],
      sellers: [],
      products: [],
      paymentMethods: [],
      clients: [],
    });
  };

  const toggleSection = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const FilterSection = ({ title, items, selected, filterKey }: { 
    title: string, 
    items: string[], 
    selected: string[], 
    filterKey: keyof FilterState 
  }) => {
    const searchTerm = searchTerms[filterKey] || '';
    const filteredItems = items.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="border-b border-cyber-border pb-4 last:border-0">
        <button 
          onClick={() => toggleSection(filterKey)}
          className="w-full flex items-center justify-between py-2 group"
        >
          <h3 className="text-xs font-bold text-cyber-muted uppercase tracking-wider group-hover:text-cyber-accent transition-colors">
            {title} {selected.length > 0 && <span className="ml-1 text-cyber-accent">({selected.length})</span>}
          </h3>
          {expanded[filterKey] ? <ChevronUp size={14} className="text-cyber-muted" /> : <ChevronDown size={14} className="text-cyber-muted" />}
        </button>
        
        {expanded[filterKey] && (
          <div className="space-y-3 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
            {items.length > 8 && (
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-cyber-muted" size={12} />
                <input
                  type="text"
                  placeholder={`Buscar ${title.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerms(prev => ({ ...prev, [filterKey]: e.target.value }))}
                  className="w-full pl-7 pr-2 py-1.5 text-[11px] bg-cyber-bg border border-cyber-border rounded-lg outline-none focus:ring-1 focus:ring-cyber-accent text-cyber-text"
                />
              </div>
            )}
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
              {filteredItems.map(item => (
                <button
                  key={item}
                  onClick={() => handleMultiSelect(filterKey, item)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all border ${
                    selected.includes(item)
                      ? 'bg-cyber-accent text-cyber-bg border-cyber-accent shadow-[0_0_10px_rgba(0,242,255,0.5)]'
                      : 'bg-cyber-bg text-cyber-muted border-cyber-border hover:border-cyber-accent hover:text-cyber-accent'
                  }`}
                >
                  {item}
                </button>
              ))}
              {filteredItems.length === 0 && (
                <p className="text-[10px] text-cyber-muted italic py-2">No se encontraron resultados</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="cyber-card p-5 space-y-5 h-fit sticky top-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-cyber-text font-bold">
          <Filter size={18} className="text-cyber-accent" />
          <span className="text-sm">Filtros Dinámicos</span>
        </div>
        <button
          onClick={clearFilters}
          className="text-[11px] font-semibold text-cyber-pink hover:text-white flex items-center gap-1 bg-cyber-pink/10 px-2 py-1 rounded-lg transition-all hover:bg-cyber-pink/20"
        >
          <X size={12} />
          Limpiar
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2 border-b border-cyber-border pb-4">
          <h3 className="text-xs font-bold text-cyber-muted uppercase tracking-wider">Rango de Fechas</h3>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-cyber-muted w-8">Desde</span>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="flex-1 text-[11px] p-2 rounded-lg border border-cyber-border focus:ring-2 focus:ring-cyber-accent outline-none bg-cyber-bg text-cyber-text"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-cyber-muted w-8">Hasta</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="flex-1 text-[11px] p-2 rounded-lg border border-cyber-border focus:ring-2 focus:ring-cyber-accent outline-none bg-cyber-bg text-cyber-text"
              />
            </div>
          </div>
        </div>

        <FilterSection title="Países" items={options.countries} selected={filters.countries} filterKey="countries" />
        <FilterSection title="Canales" items={options.channels} selected={filters.channels} filterKey="channels" />
        <FilterSection title="Vendedores" items={options.sellers} selected={filters.sellers} filterKey="sellers" />
        <FilterSection title="Clientes" items={options.clients} selected={filters.clients} filterKey="clients" />
        <FilterSection title="Productos" items={options.products} selected={filters.products} filterKey="products" />
        <FilterSection title="Formas de Pago" items={options.paymentMethods} selected={filters.paymentMethods} filterKey="paymentMethods" />
      </div>
    </div>
  );
};
