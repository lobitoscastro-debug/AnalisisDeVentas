/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { SalesData, FilterState, DashboardStats } from './types';
import { FileUpload } from './components/FileUpload';
import { KPIStats } from './components/KPIStats';
import { Filters } from './components/Filters';
import { SalesOverTime, SalesByCountry, SalesByChannel, SalesBySeller, SalesByClient } from './components/Charts';
import { SummaryTable } from './components/SummaryTable';
import { 
  LayoutDashboard, 
  BarChart3, 
  LogOut, 
  RefreshCcw, 
  TrendingUp, 
  Settings, 
  Database, 
  PieChart, 
  Bell, 
  User, 
  Menu, 
  Search 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, isWithinInterval, parseISO, startOfDay } from 'date-fns';

export default function App() {
  const [rawData, setRawData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filters, setFilters] = useState<FilterState>({
    startDate: '',
    endDate: '',
    countries: [],
    channels: [],
    sellers: [],
    products: [],
    paymentMethods: [],
    clients: [],
  });

  const toggleFilter = (key: keyof FilterState, value: string) => {
    const current = filters[key] as string[];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setFilters({ ...filters, [key]: updated });
  };

  // Extract unique options for filters
  const filterOptions = useMemo(() => {
    if (rawData.length === 0) return { countries: [], channels: [], sellers: [], products: [], paymentMethods: [], clients: [] };
    
    return {
      countries: Array.from(new Set(rawData.map(d => d.pais))).filter(Boolean).sort(),
      channels: Array.from(new Set(rawData.map(d => d.canal))).filter(Boolean).sort(),
      sellers: Array.from(new Set(rawData.map(d => d.vendedor))).filter(Boolean).sort(),
      products: Array.from(new Set(rawData.map(d => d.producto))).filter(Boolean).sort(),
      paymentMethods: Array.from(new Set(rawData.map(d => d.formaDePago))).filter(Boolean).sort(),
      clients: Array.from(new Set(rawData.map(d => d.cliente))).filter(Boolean).sort(),
    };
  }, [rawData]);

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    return rawData.filter(item => {
      const dateMatch = (!filters.startDate || item.fecha >= startOfDay(parseISO(filters.startDate))) &&
                        (!filters.endDate || item.fecha <= startOfDay(parseISO(filters.endDate)));
      const countryMatch = filters.countries.length === 0 || filters.countries.includes(item.pais);
      const channelMatch = filters.channels.length === 0 || filters.channels.includes(item.canal);
      const sellerMatch = filters.sellers.length === 0 || filters.sellers.includes(item.vendedor);
      const productMatch = filters.products.length === 0 || filters.products.includes(item.producto);
      const paymentMatch = filters.paymentMethods.length === 0 || filters.paymentMethods.includes(item.formaDePago);
      const clientMatch = filters.clients.length === 0 || filters.clients.includes(item.cliente);

      return dateMatch && countryMatch && channelMatch && sellerMatch && productMatch && paymentMatch && clientMatch;
    });
  }, [rawData, filters]);

  // Calculate KPIs
  const stats = useMemo<DashboardStats>(() => {
    const totalSales = filteredData.reduce((sum, item) => sum + item.ventas, 0);
    const totalQuantity = filteredData.reduce((sum, item) => sum + item.cantidad, 0);
    const totalTransactions = filteredData.length;
    const avgTicket = totalTransactions > 0 ? totalSales / totalTransactions : 0;

    return { totalSales, totalQuantity, totalTransactions, avgTicket };
  }, [filteredData]);

  // Prepare chart data
  const chartData = useMemo(() => {
    const salesByDate = filteredData.reduce((acc, curr) => {
      const dateStr = format(curr.fecha, 'yyyy-MM-dd');
      acc[dateStr] = (acc[dateStr] || 0) + curr.ventas;
      return acc;
    }, {} as Record<string, number>);

    const timeSeries = Object.entries(salesByDate)
      .map(([date, sales]) => ({ date, sales }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const salesByCountry = filteredData.reduce((acc, curr) => {
      acc[curr.pais] = (acc[curr.pais] || 0) + curr.ventas;
      return acc;
    }, {} as Record<string, number>);

    const countrySeries = Object.entries(salesByCountry)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => (b.value as number) - (a.value as number));

    const salesByChannel = filteredData.reduce((acc, curr) => {
      acc[curr.canal] = (acc[curr.canal] || 0) + curr.ventas;
      return acc;
    }, {} as Record<string, number>);

    const channelSeries = Object.entries(salesByChannel)
      .map(([name, value]) => ({ name, value }));

    const salesBySeller = filteredData.reduce((acc, curr) => {
      acc[curr.vendedor] = (acc[curr.vendedor] || 0) + curr.ventas;
      return acc;
    }, {} as Record<string, number>);

    const sellerSeries = Object.entries(salesBySeller)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => (b.value as number) - (a.value as number))
      .slice(0, 5);

    const salesByClient = filteredData.reduce((acc, curr) => {
      acc[curr.cliente] = (acc[curr.cliente] || 0) + curr.ventas;
      return acc;
    }, {} as Record<string, number>);

    const clientSeries = Object.entries(salesByClient)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => (b.value as number) - (a.value as number))
      .slice(0, 5);

    return { timeSeries, countrySeries, channelSeries, sellerSeries, clientSeries };
  }, [filteredData]);

  const resetData = () => {
    setRawData([]);
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

  const SidebarItem = ({ icon: Icon, label, id }: { icon: any, label: string, id: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-4 px-6 py-4 transition-all relative group ${
        activeTab === id 
          ? 'text-cyber-accent' 
          : 'text-cyber-muted hover:text-cyber-text'
      }`}
    >
      {activeTab === id && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-y-2 left-2 right-2 rounded-xl bg-cyber-accent/10 border-l-4 border-cyber-accent"
        />
      )}
      <Icon size={20} className={activeTab === id ? 'text-cyber-accent' : 'text-cyber-muted'} />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-cyber-bg text-cyber-text">
      {/* Sidebar */}
      <aside className="w-64 bg-cyber-card/50 border-r border-cyber-border flex flex-col hidden lg:flex">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl cyber-gradient-cyan flex items-center justify-center text-cyber-bg font-bold text-xl cyber-glow-cyan">
            A
          </div>
          <span className="text-xl font-bold tracking-tight">ANÁLISIS</span>
        </div>

        <div className="mt-8 flex-1">
          <div className="px-8 mb-4 text-[10px] font-bold text-cyber-muted uppercase tracking-[0.2em]">MENÚ</div>
          <SidebarItem icon={LayoutDashboard} label="Panel Principal" id="dashboard" />
          <SidebarItem icon={TrendingUp} label="Tendencias" id="analytics" />
          <SidebarItem icon={Settings} label="Configuración" id="settings" />
          <SidebarItem icon={Database} label="Base de Datos" id="data" />
          <SidebarItem icon={PieChart} label="Reportes" id="reports" />
        </div>

        <div className="p-8">
          <div className="p-4 rounded-2xl bg-cyber-border/30 border border-cyber-border">
            <div className="text-[10px] font-bold text-cyber-muted uppercase mb-2">CURSO EXCEL IA</div>
            <div className="text-xs text-cyber-muted mb-4">Optimiza tus análisis de datos con inteligencia artificial.</div>
            <button className="w-full py-2 rounded-xl bg-cyber-border text-xs font-bold hover:bg-cyber-border/50 transition-all">
              SABER MÁS
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 bg-cyber-card/30 border-b border-cyber-border flex items-center justify-between px-8">
          <div className="flex items-center gap-8">
            <button className="lg:hidden text-cyber-muted hover:text-cyber-text">
              <Menu size={24} />
            </button>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-cyber-muted">
              <a href="#" className="hover:text-cyber-text transition-colors">Resumen</a>
              <a href="#" className="hover:text-cyber-text transition-colors">Ventas</a>
              <a href="#" className="text-cyber-text relative">
                Análisis de Ventas
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyber-pink cyber-glow-pink" />
              </a>
              <a href="#" className="hover:text-cyber-text transition-colors">Histórico</a>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-muted" size={16} />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="pl-10 pr-4 py-2 bg-cyber-border/30 border border-cyber-border rounded-xl text-sm focus:outline-none focus:border-cyber-accent/50 w-64"
              />
            </div>
            <button className="relative text-cyber-muted hover:text-cyber-text">
              <Bell size={20} />
              <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-cyber-accent border-2 border-cyber-card" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-cyber-border">
              <div className="w-10 h-10 rounded-full bg-cyber-pink/20 border border-cyber-pink/50 flex items-center justify-center text-cyber-pink">
                <User size={20} />
              </div>
              <button className="text-cyber-muted hover:text-cyber-text">
                <Menu size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <AnimatePresence mode="wait">
            {rawData.length === 0 ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-center min-h-[calc(100vh-12rem)]"
              >
                <FileUpload onDataLoaded={setRawData} loading={loading} setLoading={setLoading} />
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="flex flex-col xl:flex-row gap-8">
                  {/* Sidebar Filters */}
                  <aside className="w-full xl:w-80 flex-shrink-0">
                    <Filters filters={filters} setFilters={setFilters} options={filterOptions} />
                  </aside>

                  {/* Main Dashboard Area */}
                  <div className="flex-1 space-y-8">
                    {/* KPIs */}
                    <KPIStats stats={stats} />

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="lg:col-span-2">
                        <SalesOverTime data={chartData.timeSeries} />
                      </div>
                      <SalesByCountry data={chartData.countrySeries} onSelect={(val) => toggleFilter('countries', val)} />
                      <SalesByChannel data={chartData.channelSeries} onSelect={(val) => toggleFilter('channels', val)} />
                      <SalesBySeller data={chartData.sellerSeries} onSelect={(val) => toggleFilter('sellers', val)} />
                      <SalesByClient data={chartData.clientSeries} onSelect={(val) => toggleFilter('clients', val)} />
                    </div>

                    {/* Summary Table */}
                    <SummaryTable data={filteredData} />
                    
                    <div className="flex justify-end">
                      <button
                        onClick={resetData}
                        className="flex items-center gap-2 px-6 py-3 bg-cyber-card border border-cyber-border rounded-2xl text-sm font-bold text-cyber-muted hover:text-cyber-pink hover:border-cyber-pink/50 transition-all"
                      >
                        <RefreshCcw size={18} />
                        <span>Cargar nuevo archivo</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Footer */}
          <footer className="mt-12 py-8 border-t border-cyber-border text-center">
            <p className="text-cyber-muted text-sm font-medium tracking-wide">
              Creado por: <span className="text-cyber-accent">Christian Castro Daza</span> - <span className="text-cyber-pink">Curso de Excel con IA</span>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
