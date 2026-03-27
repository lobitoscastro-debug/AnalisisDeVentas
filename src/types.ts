export interface SalesData {
  cliente: string;
  pais: string;
  canal: string;
  formaDePago: string;
  producto: string;
  vendedor: string;
  fecha: Date;
  ventas: number;
  cantidad: number;
}

export interface DashboardStats {
  totalSales: number;
  totalQuantity: number;
  avgTicket: number;
  totalTransactions: number;
}

export interface FilterState {
  startDate: string;
  endDate: string;
  countries: string[];
  channels: string[];
  sellers: string[];
  products: string[];
  paymentMethods: string[];
  clients: string[];
}
