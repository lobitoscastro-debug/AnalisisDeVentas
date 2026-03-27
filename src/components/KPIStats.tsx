import React from 'react';
import { DollarSign, Package, TrendingUp, ShoppingCart } from 'lucide-react';
import { DashboardStats } from '../types';
import { motion } from 'motion/react';

interface KPIStatsProps {
  stats: DashboardStats;
}

export const KPIStats: React.FC<KPIStatsProps> = ({ stats }) => {
  const kpis = [
    {
      label: 'Ventas Totales',
      value: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(stats.totalSales),
      icon: DollarSign,
      color: 'text-cyber-accent',
      bgColor: 'bg-cyber-accent/10',
      glow: 'cyber-glow-cyan',
    },
    {
      label: 'Cantidad Vendida',
      value: new Intl.NumberFormat('es-ES').format(stats.totalQuantity),
      icon: Package,
      color: 'text-cyber-pink',
      bgColor: 'bg-cyber-pink/10',
      glow: 'cyber-glow-pink',
    },
    {
      label: 'Ticket Promedio',
      value: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(stats.avgTicket),
      icon: TrendingUp,
      color: 'text-cyber-orange',
      bgColor: 'bg-cyber-orange/10',
      glow: 'shadow-[0_0_15px_rgba(255,138,0,0.3)]',
    },
    {
      label: 'Transacciones',
      value: new Intl.NumberFormat('es-ES').format(stats.totalTransactions),
      icon: ShoppingCart,
      color: 'text-white',
      bgColor: 'bg-white/10',
      glow: 'shadow-[0_0_15px_rgba(255,255,255,0.1)]',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`cyber-card p-6 flex items-center gap-4 ${kpi.glow}`}
        >
          <div className={`${kpi.bgColor} p-3 rounded-2xl ${kpi.color}`}>
            <kpi.icon size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-cyber-muted uppercase tracking-wider">{kpi.label}</p>
            <p className="text-xl font-bold text-white mt-1">{kpi.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
