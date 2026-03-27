import React, { useState, useMemo } from 'react';
import { SalesData } from '../types';
import { Search, ArrowUpDown } from 'lucide-react';

interface SummaryTableProps {
  data: SalesData[];
}

interface ProductSummary {
  name: string;
  sales: number;
  quantity: number;
  transactions: number;
}

export const SummaryTable: React.FC<SummaryTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof ProductSummary, direction: 'asc' | 'desc' }>({
    key: 'sales',
    direction: 'desc'
  });

  // Group by product for the summary
  const productSummary = useMemo(() => {
    const summary = data.reduce((acc, curr) => {
      if (!acc[curr.producto]) {
        acc[curr.producto] = { name: curr.producto, sales: 0, quantity: 0, transactions: 0 };
      }
      acc[curr.producto].sales += curr.ventas;
      acc[curr.producto].quantity += curr.cantidad;
      acc[curr.producto].transactions += 1;
      return acc;
    }, {} as Record<string, ProductSummary>);

    return (Object.values(summary) as ProductSummary[])
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        return sortConfig.direction === 'asc' 
          ? (aValue as number) - (bValue as number) 
          : (bValue as number) - (aValue as number);
      });
  }, [data, searchTerm, sortConfig]);

  const handleSort = (key: keyof ProductSummary) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc'
    });
  };

  return (
    <div className="cyber-card overflow-hidden">
      <div className="p-6 border-b border-cyber-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-cyber-text flex items-center gap-2">
          <span className="w-1 h-6 cyber-gradient-pink rounded-full"></span>
          Resumen Detallado por Producto
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-muted" size={16} />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-cyber-bg border border-cyber-border rounded-xl text-sm text-cyber-text focus:ring-2 focus:ring-cyber-accent outline-none w-full md:w-64 transition-all"
          />
        </div>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-cyber-bg/50 text-cyber-muted text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-bold cursor-pointer hover:text-cyber-accent transition-colors" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">Producto <ArrowUpDown size={12} /></div>
              </th>
              <th className="px-6 py-4 font-bold text-right cursor-pointer hover:text-cyber-accent transition-colors" onClick={() => handleSort('sales')}>
                <div className="flex items-center justify-end gap-1">Ventas <ArrowUpDown size={12} /></div>
              </th>
              <th className="px-6 py-4 font-bold text-right cursor-pointer hover:text-cyber-accent transition-colors" onClick={() => handleSort('quantity')}>
                <div className="flex items-center justify-end gap-1">Cantidad <ArrowUpDown size={12} /></div>
              </th>
              <th className="px-6 py-4 font-bold text-right cursor-pointer hover:text-cyber-accent transition-colors" onClick={() => handleSort('transactions')}>
                <div className="flex items-center justify-end gap-1">Transacciones <ArrowUpDown size={12} /></div>
              </th>
              <th className="px-6 py-4 font-bold text-right">Ticket Prom.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-border">
            {productSummary.length > 0 ? (
              productSummary.map((product) => (
                <tr key={product.name} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 text-sm font-medium text-cyber-text group-hover:text-cyber-accent transition-colors">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-cyber-text text-right font-mono">
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.sales)}
                  </td>
                  <td className="px-6 py-4 text-sm text-cyber-muted text-right">
                    {new Intl.NumberFormat('es-ES').format(product.quantity)}
                  </td>
                  <td className="px-6 py-4 text-sm text-cyber-muted text-right">
                    {product.transactions}
                  </td>
                  <td className="px-6 py-4 text-sm text-cyber-accent text-right font-mono">
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.sales / product.transactions)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-cyber-muted italic">No se encontraron productos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
