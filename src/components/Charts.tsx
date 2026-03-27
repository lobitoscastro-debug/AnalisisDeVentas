import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const COLORS = ['#00f2ff', '#ff007a', '#ff8a00', '#7000ff', '#00ff95', '#ff0055', '#0077ff'];

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => (
  <div className="cyber-card p-6">
    <h3 className="text-lg font-bold text-cyber-text mb-6 flex items-center gap-2">
      <span className="w-1 h-6 cyber-gradient-cyan rounded-full"></span>
      {title}
    </h3>
    <div className="h-[300px] w-full">
      {children}
    </div>
  </div>
);

export const SalesOverTime: React.FC<{ data: any[] }> = ({ data }) => (
  <ChartCard title="Ventas por Fecha">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a4a" />
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: '#8080a0' }} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: '#8080a0' }}
          tickFormatter={(value) => `€${value}`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#16162a', 
            borderRadius: '16px', 
            border: '1px solid #2a2a4a',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            color: '#e0e0ff'
          }}
          itemStyle={{ color: '#00f2ff' }}
          formatter={(value: number) => [`€${value.toLocaleString()}`, 'Ventas']}
        />
        <Line 
          type="monotone" 
          dataKey="sales" 
          stroke="#00f2ff" 
          strokeWidth={4} 
          dot={{ r: 4, fill: '#00f2ff', strokeWidth: 2, stroke: '#0d0d1a' }}
          activeDot={{ r: 8, fill: '#00f2ff', stroke: '#fff', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </ChartCard>
);

export const SalesByCountry: React.FC<{ data: any[], onSelect: (val: string) => void }> = ({ data, onSelect }) => (
  <ChartCard title="Ventas por País">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" onClick={(e) => e && e.activeLabel && onSelect(e.activeLabel)}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#2a2a4a" />
        <XAxis type="number" hide />
        <YAxis 
          dataKey="name" 
          type="category" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: '#8080a0' }}
          width={80}
        />
        <Tooltip 
          cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
          contentStyle={{ 
            backgroundColor: '#16162a', 
            borderRadius: '16px', 
            border: '1px solid #2a2a4a',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            color: '#e0e0ff'
          }}
          itemStyle={{ color: '#ff007a' }}
          formatter={(value: number) => [`€${value.toLocaleString()}`, 'Ventas']}
        />
        <Bar dataKey="value" fill="#ff007a" radius={[0, 8, 8, 0]} barSize={24} className="cursor-pointer" />
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>
);

export const SalesByChannel: React.FC<{ data: any[], onSelect: (val: string) => void }> = ({ data, onSelect }) => (
  <ChartCard title="Distribución por Canal">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={8}
          dataKey="value"
          onClick={(e) => onSelect(e.name)}
          className="cursor-pointer"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#16162a', 
            borderRadius: '16px', 
            border: '1px solid #2a2a4a',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            color: '#e0e0ff'
          }}
          formatter={(value: number) => [`€${value.toLocaleString()}`, 'Ventas']}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36} 
          iconType="circle"
          formatter={(value) => <span className="text-cyber-muted text-xs font-medium">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  </ChartCard>
);

export const SalesBySeller: React.FC<{ data: any[], onSelect: (val: string) => void }> = ({ data, onSelect }) => (
  <ChartCard title="Top 5 Vendedores">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} onClick={(e) => e && e.activeLabel && onSelect(e.activeLabel)}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a4a" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: '#8080a0' }} 
        />
        <YAxis hide />
        <Tooltip 
          cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
          contentStyle={{ 
            backgroundColor: '#16162a', 
            borderRadius: '16px', 
            border: '1px solid #2a2a4a',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            color: '#e0e0ff'
          }}
          itemStyle={{ color: '#ff8a00' }}
          formatter={(value: number) => [`€${value.toLocaleString()}`, 'Ventas']}
        />
        <Bar dataKey="value" fill="#ff8a00" radius={[8, 8, 0, 0]} barSize={40} className="cursor-pointer" />
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>
);

export const SalesByClient: React.FC<{ data: any[], onSelect: (val: string) => void }> = ({ data, onSelect }) => (
  <ChartCard title="Top 5 Clientes">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" onClick={(e) => e && e.activeLabel && onSelect(e.activeLabel)}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#2a2a4a" />
        <XAxis type="number" hide />
        <YAxis 
          dataKey="name" 
          type="category" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: '#8080a0' }}
          width={100}
        />
        <Tooltip 
          cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
          contentStyle={{ 
            backgroundColor: '#16162a', 
            borderRadius: '16px', 
            border: '1px solid #2a2a4a',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            color: '#e0e0ff'
          }}
          itemStyle={{ color: '#7000ff' }}
          formatter={(value: number) => [`€${value.toLocaleString()}`, 'Ventas']}
        />
        <Bar dataKey="value" fill="#7000ff" radius={[0, 8, 8, 0]} barSize={24} className="cursor-pointer" />
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>
);
