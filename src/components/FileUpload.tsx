import React, { useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { SalesData } from '../types';
import { cn } from '../lib/utils';

interface FileUploadProps {
  onDataLoaded: (data: SalesData[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded, loading, setLoading }) => {
  const processFile = useCallback(async (file: File) => {
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet) as any[];

        const getVal = (row: any, keys: string[]) => {
          const foundKey = Object.keys(row).find(k => 
            keys.some(key => k.toLowerCase().trim() === key.toLowerCase().trim())
          );
          return foundKey ? row[foundKey] : undefined;
        };

        const processedData: SalesData[] = json.map((row) => {
          const fechaRaw = getVal(row, ['fecha', 'date']);
          
          // Helper to parse numbers that might come as strings with commas/dots
          const parseNum = (val: any) => {
            if (typeof val === 'number') return val;
            if (typeof val === 'string') {
              // Remove currency symbols and handle thousands separators
              const clean = val.replace(/[€$]/g, '').replace(/\./g, '').replace(',', '.').trim();
              return parseFloat(clean) || 0;
            }
            return 0;
          };

          return {
            cliente: String(getVal(row, ['cliente', 'client']) || ''),
            pais: String(getVal(row, ['pais', 'país', 'country']) || ''),
            canal: String(getVal(row, ['canal', 'channel']) || ''),
            formaDePago: String(getVal(row, ['forma de pago', 'payment method', 'forma_pago']) || ''),
            producto: String(getVal(row, ['producto', 'product']) || ''),
            vendedor: String(getVal(row, ['vendedor', 'seller', 'salesperson']) || ''),
            fecha: new Date(fechaRaw),
            ventas: parseNum(getVal(row, ['ventas', 'sales', 'venta'])),
            cantidad: parseNum(getVal(row, ['cantidad', 'quantity', 'qty'])),
          };
        }).filter(item => !isNaN(item.fecha.getTime()));

        if (processedData.length === 0) {
          alert('No se encontraron datos válidos. Verifique que las columnas coincidan con las requeridas (cliente, pais, canal, forma de pago, producto, vendedor, fecha, ventas, cantidad).');
        } else {
          onDataLoaded(processedData);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error al procesar el archivo. Por favor, asegúrese de que el formato sea correcto.');
    } finally {
      setLoading(false);
    }
  }, [onDataLoaded, setLoading]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          "w-full max-w-2xl p-12 border-2 border-dashed rounded-[2rem] transition-all duration-500 flex flex-col items-center gap-8 group relative overflow-hidden",
          loading 
            ? "border-cyber-accent bg-cyber-accent/5" 
            : "border-cyber-border bg-cyber-card/50 hover:border-cyber-accent hover:bg-cyber-accent/5 cursor-pointer"
        )}
        onClick={() => !loading && document.getElementById('fileInput')?.click()}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyber-accent opacity-20 group-hover:opacity-100 transition-opacity rounded-tl-[2rem]"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-cyber-pink opacity-20 group-hover:opacity-100 transition-opacity rounded-br-[2rem]"></div>

        <input
          id="fileInput"
          type="file"
          accept=".xlsx, .xls, .csv"
          className="hidden"
          onChange={handleChange}
          disabled={loading}
        />
        
        <div className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500",
          loading ? "bg-cyber-accent/20 text-cyber-accent" : "bg-cyber-bg border border-cyber-border text-cyber-muted group-hover:text-cyber-accent group-hover:border-cyber-accent group-hover:cyber-glow-cyan"
        )}>
          {loading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyber-accent border-t-transparent" />
          ) : (
            <Upload size={48} className="group-hover:scale-110 transition-transform" />
          )}
        </div>

        <div className="text-center space-y-3 relative z-10">
          <h2 className="text-3xl font-bold text-cyber-text tracking-tight">
            {loading ? 'Procesando datos...' : 'Cargar archivo de ventas'}
          </h2>
          <p className="text-cyber-muted max-w-md mx-auto text-lg">
            Arrastre y suelte su archivo <span className="text-cyber-accent font-medium">Excel</span> o <span className="text-cyber-pink font-medium">CSV</span> aquí, o haga clic para seleccionar uno.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-4 relative z-10">
          <div className="flex items-center gap-3 text-sm text-cyber-text bg-cyber-bg/80 px-6 py-3 rounded-2xl border border-cyber-border shadow-lg backdrop-blur-sm group-hover:border-cyber-accent/50 transition-colors">
            <FileSpreadsheet size={20} className="text-cyber-accent" />
            <span className="font-medium">XLSX, XLS, CSV</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-cyber-text bg-cyber-bg/80 px-6 py-3 rounded-2xl border border-cyber-border shadow-lg backdrop-blur-sm group-hover:border-cyber-pink/50 transition-colors">
            <AlertCircle size={20} className="text-cyber-pink" />
            <span className="font-medium">Columnas: cliente, pais, canal...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
