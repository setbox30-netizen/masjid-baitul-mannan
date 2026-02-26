import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  Package, 
  Calendar, 
  Users, 
  Settings, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  Search,
  Menu,
  X,
  ChevronRight,
  Bell,
  Printer,
  Download,
  Edit2,
  Trash2,
  AlertTriangle,
  LogOut,
  Lock,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { DashboardStats, FinanceRecord, InventoryItem, MosqueEvent, User } from './types';

// --- Components ---

const LoginPage = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const user = await res.json();
        onLogin(user);
      } else {
        const data = await res.json();
        setError(data.error || 'Login gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8] p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-600 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-200 mx-auto mb-4 sm:mb-6">
            <LayoutDashboard size={32} className="sm:hidden" />
            <LayoutDashboard size={40} className="hidden sm:block" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 px-4">Sistem Manajemen Masjid</h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">Silakan masuk untuk melanjutkan</p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl border border-emerald-50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 text-rose-600 text-sm font-medium rounded-2xl border border-rose-100">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="Username"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Masuk Sekarang'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, title: string, message: string }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
      >
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 text-sm mb-8">{message}</p>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={onClose}
            className="py-3 bg-slate-50 text-slate-500 font-bold rounded-xl hover:bg-slate-100 transition-all"
          >
            Batal
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
          >
            Ya, Hapus
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
        : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
    {active && <motion.div layoutId="active-pill" className="ml-auto"><ChevronRight size={16} /></motion.div>}
  </button>
);

const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
  <div className="card-mosque p-6">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      {trend && (
        <span className={`flex items-center text-xs font-bold ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trend > 0 ? '+' : ''}{trend}%
          <ArrowUpRight size={14} className="ml-1" />
        </span>
      )}
    </div>
    <p className="text-slate-500 text-xs sm:text-sm font-medium">{label}</p>
    <h3 className="text-xl sm:text-2xl font-bold mt-1">
      {typeof value === 'number' ? `Rp ${value.toLocaleString('id-ID')}` : value}
    </h3>
  </div>
);

// --- Pages ---

const Dashboard = ({ stats, finances }: { stats: DashboardStats | null, finances: FinanceRecord[] }) => {
  const chartData = finances.slice(0, 7).reverse().map(f => ({
    name: format(new Date(f.date), 'dd MMM'),
    amount: f.amount,
    type: f.type
  }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard 
          label="Saldo Kas" 
          value={stats?.balance || 0} 
          icon={Wallet} 
          color="bg-emerald-500" 
        />
        <StatCard 
          label="Total Pemasukan" 
          value={stats?.totalIncome || 0} 
          icon={TrendingUp} 
          color="bg-blue-500" 
        />
        <StatCard 
          label="Total Pengeluaran" 
          value={stats?.totalExpense || 0} 
          icon={TrendingDown} 
          color="bg-rose-500" 
        />
        <StatCard 
          label="Inventaris" 
          value={stats?.inventoryCount || 0} 
          icon={Package} 
          color="bg-amber-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card-mosque p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Arus Kas Terakhir</h3>
            <select className="bg-slate-50 border-none text-sm rounded-lg px-3 py-1 outline-none">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
            </select>
          </div>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-mosque p-6">
          <h3 className="text-lg font-bold mb-6">Transaksi Terbaru</h3>
          <div className="space-y-4">
            {finances.slice(0, 5).map((f) => (
              <div key={f.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className={`p-2 rounded-lg ${f.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {f.type === 'income' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm truncate">{f.description}</p>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-medium uppercase">{f.category}</span>
                  </div>
                  <p className="text-xs text-slate-500">{format(new Date(f.date), 'dd MMMM yyyy', { locale: localeId })}</p>
                </div>
                <p className={`font-bold text-sm ${f.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {f.type === 'income' ? '+' : '-'} {f.amount.toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors">
            Lihat Semua Transaksi
          </button>
        </div>
      </div>
    </div>
  );
};

const FinancePage = ({ data, onAdd, onEdit, onDelete, onRefresh, settings, role }: { data: FinanceRecord[], onAdd: () => void, onEdit: (item: FinanceRecord) => void, onDelete: (id: number) => void, onRefresh: () => void, settings: Record<string, string>, role: string }) => {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const mosqueName = settings.mosque_name || 'Nurul Iman';

  // Get unique months from data for filter options
  const availableMonths = Array.from(new Set(data.map(item => item.date.substring(0, 7)))).sort().reverse();
  
  // Ensure current month is in options if not present
  const currentMonthStr = format(new Date(), 'yyyy-MM');
  if (!availableMonths.includes(currentMonthStr)) {
    availableMonths.unshift(currentMonthStr);
  }

  const getFilteredData = (allData: FinanceRecord[]) => {
    // 1. Sort all data chronologically to calculate correct running balance
    const sortedAll = [...allData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // 2. Calculate running balance for everything
    let currentBal = 0;
    const dataWithBalance = sortedAll.map(item => {
      if (item.type === 'income') currentBal += item.amount;
      else currentBal -= item.amount;
      return { ...item, runningBal: currentBal };
    });

    // 3. Filter by selected month
    return dataWithBalance.filter(item => item.date.startsWith(selectedMonth)).reverse();
  };

  const filteredData = getFilteredData(data);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const logoHtml = settings.mosque_logo 
      ? `<img src="${settings.mosque_logo}" style="height: 80px; margin-bottom: 10px;" />` 
      : '';

    const rowsHtml = [...filteredData].reverse().map((item) => {
      const debit = item.type === 'income' ? item.amount : 0;
      const credit = item.type === 'expense' ? item.amount : 0;

      return `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${format(new Date(item.date), 'dd/MM/yyyy')}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.description}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${debit ? debit.toLocaleString('id-ID') : '-'}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${credit ? credit.toLocaleString('id-ID') : '-'}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">${item.runningBal.toLocaleString('id-ID')}</td>
        </tr>
      `;
    }).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Laporan Keuangan - ${mosqueName}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            h1, h2, h3 { text-align: center; margin: 5px; }
            .header { margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 10px;">
              ${logoHtml}
              <h1 style="margin: 0;">LAPORAN KEUANGAN</h1>
              <h2 style="margin: 5px 0;">${mosqueName.toUpperCase()}</h2>
            </div>
            <h3 style="margin: 5px 0;">Periode: ${format(new Date(selectedMonth + '-01'), 'MMMM yyyy', { locale: localeId })}</h3>
            <p style="text-align: center;">Dicetak pada: ${format(new Date(), 'dd MMMM yyyy HH:mm')}</p>
          </div>
          <table>
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="border: 1px solid #ddd; padding: 8px;">Tanggal</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Uraian</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Debet (Masuk)</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Kredit (Keluar)</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Saldo</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div style="margin-top: 50px; display: flex; justify-content: space-between; padding: 0 50px;">
            <div style="text-align: center;">
              <p>Mengetahui,</p>
              <p style="font-weight: bold; margin-bottom: 60px;">Ketua Takmir</p>
              <p style="text-decoration: underline; font-weight: bold;">${settings.chairman_name || '-'}</p>
            </div>
            <div style="text-align: center;">
              <p>${format(new Date(), 'dd MMMM yyyy', { locale: localeId })}</p>
              <p style="font-weight: bold; margin-bottom: 60px;">Bendahara</p>
              <p style="text-decoration: underline; font-weight: bold;">${settings.treasurer_name || '-'}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    const csvContent = [
      ['Tanggal', 'Uraian', 'Kategori', 'Debet', 'Kredit', 'Saldo'],
      ...[...filteredData].reverse().map(item => [
        format(new Date(item.date), 'yyyy-MM-dd'),
        item.description,
        item.category,
        item.type === 'income' ? item.amount : 0,
        item.type === 'expense' ? item.amount : 0,
        item.runningBal
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_${mosqueName.replace(/\s+/g, '_')}_${selectedMonth}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Laporan Keuangan</h2>
          <div className="flex items-center gap-2 mt-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Periode:</label>
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-white border border-slate-200 text-sm rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {availableMonths.map(m => (
                <option key={m} value={m}>
                  {format(new Date(m + '-01'), 'MMMM yyyy', { locale: localeId })}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button 
            onClick={handlePrint}
            className="flex-1 sm:flex-none bg-white text-slate-700 border border-slate-200 px-3 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm text-sm"
          >
            <Printer size={16} />
            <span>Cetak</span>
          </button>
          <button 
            onClick={handleDownload}
            className="flex-1 sm:flex-none bg-white text-slate-700 border border-slate-200 px-3 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm text-sm"
          >
            <Download size={16} />
            <span>CSV</span>
          </button>
          {role === 'admin' && (
            <button 
              onClick={onAdd} 
              className="w-full sm:w-auto bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 text-sm font-bold"
            >
              <Plus size={18} />
              <span>Tambah</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="card-mosque overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-sm font-bold text-slate-600 w-32">Tanggal</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Uraian / Keterangan</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 text-right w-40">Debet (Masuk)</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 text-right w-40">Kredit (Keluar)</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 text-right w-44">Saldo</th>
                {role === 'admin' && <th className="px-6 py-4 text-sm font-bold text-slate-600 text-center w-24">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{format(new Date(item.date), 'dd/MM/yyyy')}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col max-w-md">
                        <span className="text-sm font-medium break-words line-clamp-2" title={item.description}>{item.description}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">{item.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-right text-emerald-600 whitespace-nowrap">
                      {item.type === 'income' ? `Rp ${item.amount.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-right text-rose-600 whitespace-nowrap">
                      {item.type === 'expense' ? `Rp ${item.amount.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-right text-slate-900 whitespace-nowrap">
                      Rp {item.runningBal.toLocaleString('id-ID')}
                    </td>
                    {role === 'admin' && (
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => onEdit(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => onDelete(item.id)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={role === 'admin' ? 6 : 5} className="px-6 py-12 text-center text-slate-400 italic">
                    Tidak ada transaksi pada periode ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{format(new Date(item.date), 'dd MMM yyyy', { locale: localeId })}</span>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-2 mt-0.5">{item.description}</h4>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 self-start uppercase">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {item.type === 'income' ? '+' : '-'} {item.amount.toLocaleString('id-ID')}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Saldo: Rp {item.runningBal.toLocaleString('id-ID')}</p>
                  </div>
                </div>
                {role === 'admin' && (
                  <div className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-slate-50">
                    <button 
                      onClick={() => onEdit(item)}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-600 px-3 py-1.5 bg-blue-50 rounded-lg"
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-rose-600 px-3 py-1.5 bg-rose-50 rounded-lg"
                    >
                      <Trash2 size={14} />
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 italic text-sm">
              Tidak ada transaksi pada periode ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TransactionModal = ({ isOpen, onClose, onSuccess, editItem }: { isOpen: boolean, onClose: () => void, onSuccess: () => void, editItem: FinanceRecord | null }) => {
  const [formData, setFormData] = useState({
    type: 'income',
    category: 'Infaq',
    customCategory: '',
    amount: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    if (editItem) {
      const standardCategories = ['Infaq', 'Shadaqah', 'Zakat', 'Wakaf', 'Operasional', 'Pemeliharaan', 'Kegiatan'];
      const isCustom = !standardCategories.includes(editItem.category);
      setFormData({
        type: editItem.type,
        category: isCustom ? 'Lainnya' : editItem.category,
        customCategory: isCustom ? editItem.category : '',
        amount: editItem.amount.toString(),
        description: editItem.description,
        date: editItem.date
      });
    } else {
      setFormData({
        type: 'income',
        category: 'Infaq',
        customCategory: '',
        amount: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd')
      });
    }
  }, [editItem, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = formData.category === 'Lainnya' ? formData.customCategory : formData.category;
    const url = editItem ? `/api/finances/${editItem.id}` : '/api/finances';
    const method = editItem ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          category: finalCategory,
          amount: Number(formData.amount) 
        })
      });
      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl my-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">{editItem ? 'Edit Transaksi' : 'Tambah Transaksi'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <button 
              type="button"
              onClick={() => setFormData({...formData, type: 'income'})}
              className={`py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${formData.type === 'income' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 text-slate-500'}`}
            >
              Pemasukan
            </button>
            <button 
              type="button"
              onClick={() => setFormData({...formData, type: 'expense'})}
              className={`py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${formData.type === 'expense' ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'bg-slate-50 text-slate-500'}`}
            >
              Pengeluaran
            </button>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Kategori</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full p-2.5 sm:p-3 bg-slate-50 border-none rounded-xl outline-none text-sm"
            >
              <option>Infaq</option>
              <option>Shadaqah</option>
              <option>Zakat</option>
              <option>Wakaf</option>
              <option>Operasional</option>
              <option>Pemeliharaan</option>
              <option>Kegiatan</option>
              <option>Lainnya</option>
            </select>
            {formData.category === 'Lainnya' && (
              <motion.input 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                type="text" 
                required
                value={formData.customCategory}
                onChange={(e) => setFormData({...formData, customCategory: e.target.value})}
                className="w-full p-2.5 sm:p-3 bg-slate-50 border-none rounded-xl outline-none mt-2 text-sm"
                placeholder="Masukkan kategori baru..."
              />
            )}
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Jumlah (Rp)</label>
            <input 
              type="number" 
              required
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="w-full p-2.5 sm:p-3 bg-slate-50 border-none rounded-xl outline-none text-sm"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Keterangan</label>
            <input 
              type="text" 
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2.5 sm:p-3 bg-slate-50 border-none rounded-xl outline-none text-sm"
              placeholder="Contoh: Infaq Jumat"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Tanggal</label>
            <input 
              type="date" 
              required
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full p-2.5 sm:p-3 bg-slate-50 border-none rounded-xl outline-none text-sm"
            />
          </div>
          <button type="submit" className="w-full py-3 sm:py-4 bg-emerald-600 text-white font-bold rounded-2xl mt-2 sm:mt-4 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 text-sm">
            {editItem ? 'Update Transaksi' : 'Simpan Transaksi'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const InventoryPage = ({ data, onAdd, role }: { data: InventoryItem[], onAdd: () => void, role: string }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Inventaris Barang</h2>
      {role === 'admin' && (
        <button onClick={onAdd} className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-colors">
          <Plus size={20} />
          <span>Tambah Barang</span>
        </button>
      )}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item) => (
        <div key={item.id} className="card-mosque p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Package size={24} />
            </div>
            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
              item.condition === 'good' ? 'bg-emerald-100 text-emerald-700' : 
              item.condition === 'fair' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
            }`}>
              {item.condition === 'good' ? 'Baik' : item.condition === 'fair' ? 'Cukup' : 'Rusak'}
            </span>
          </div>
          <h4 className="font-bold text-lg">{item.name}</h4>
          <p className="text-slate-500 text-sm mb-4">{item.category}</p>
          <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-100">
            <div>
              <p className="text-slate-400 text-xs">Jumlah</p>
              <p className="font-bold">{item.quantity} Unit</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-xs">Terakhir Cek</p>
              <p className="font-medium">{format(new Date(item.last_checked), 'dd MMM yyyy')}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SettingsPage = ({ settings, onSave, role }: { settings: Record<string, string>, onSave: (data: Record<string, string>) => void, role: string }) => {
  const [formData, setFormData] = useState(settings);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, mosque_logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role !== 'admin') return;
    onSave(formData);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold">Pengaturan Masjid</h2>
      <div className="card-mosque p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
            <div className="relative group">
              <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-200 group-hover:border-emerald-500 transition-colors">
                {formData.mosque_logo ? (
                  <img src={formData.mosque_logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <LayoutDashboard size={32} className="text-slate-300" />
                )}
              </div>
              {role === 'admin' && (
                <label className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2 rounded-lg cursor-pointer shadow-lg hover:bg-emerald-700 transition-colors">
                  <Plus size={16} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                </label>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-lg">Logo Masjid</h3>
              <p className="text-sm text-slate-500">Unggah logo resmi masjid Anda. Format yang disarankan: PNG atau JPG (Maks. 1MB).</p>
              {formData.mosque_logo && role === 'admin' && (
                <button 
                  type="button" 
                  onClick={() => setFormData({ ...formData, mosque_logo: '' })}
                  className="text-xs font-bold text-rose-600 mt-2 hover:underline"
                >
                  Hapus Logo
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nama Masjid</label>
            <input 
              type="text" 
              disabled={role !== 'admin'}
              value={formData.mosque_name || ''}
              onChange={(e) => setFormData({...formData, mosque_name: e.target.value})}
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
              placeholder="Contoh: Masjid Nurul Iman"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Alamat Masjid</label>
            <textarea 
              rows={3}
              disabled={role !== 'admin'}
              value={formData.mosque_address || ''}
              onChange={(e) => setFormData({...formData, mosque_address: e.target.value})}
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
              placeholder="Alamat lengkap masjid..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nomor Telepon / WhatsApp</label>
            <input 
              type="text" 
              disabled={role !== 'admin'}
              value={formData.mosque_phone || ''}
              onChange={(e) => setFormData({...formData, mosque_phone: e.target.value})}
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
              placeholder="0812..."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nama Ketua Takmir</label>
              <input 
                type="text" 
                disabled={role !== 'admin'}
                value={formData.chairman_name || ''}
                onChange={(e) => setFormData({...formData, chairman_name: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
                placeholder="Nama Ketua..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nama Bendahara Takmir</label>
              <input 
                type="text" 
                disabled={role !== 'admin'}
                value={formData.treasurer_name || ''}
                onChange={(e) => setFormData({...formData, treasurer_name: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
                placeholder="Nama Bendahara..."
              />
            </div>
          </div>
          {role === 'admin' && (
            <button type="submit" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
              Simpan Perubahan
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [finances, setFinances] = useState<FinanceRecord[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [events, setEvents] = useState<MosqueEvent[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<FinanceRecord | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [statsRes, financeRes, invRes, eventRes, settingsRes] = await Promise.all([
        fetch('/api/stats').then(r => r.json()),
        fetch('/api/finances').then(r => r.json()),
        fetch('/api/inventory').then(r => r.json()),
        fetch('/api/events').then(r => r.json()),
        fetch('/api/settings').then(r => r.json())
      ]);
      setStats(statsRes);
      setFinances(financeRes);
      setInventory(invRes);
      setEvents(eventRes);
      setSettings(settingsRes);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  const handleDeleteFinance = async (id: number) => {
    if (user?.role !== 'admin') return;
    setItemToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDeleteFinance = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`/api/finances/${itemToDelete}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setItemToDelete(null);
    }
  };

  const handleEditFinance = (item: FinanceRecord) => {
    if (user?.role !== 'admin') return;
    setEditItem(item);
    setIsModalOpen(true);
  };

  const handleAddFinance = () => {
    if (user?.role !== 'admin') return;
    setEditItem(null);
    setIsModalOpen(true);
  };

  const handleSaveSettings = async (newSettings: Record<string, string>) => {
    if (user?.role !== 'admin') return;
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        setSettings(newSettings);
        alert('Pengaturan berhasil disimpan!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard stats={stats} finances={finances} />;
      case 'finance': return (
        <FinancePage 
          data={finances} 
          onAdd={handleAddFinance} 
          onEdit={handleEditFinance}
          onDelete={handleDeleteFinance}
          onRefresh={fetchData} 
          settings={settings} 
          role={user?.role || 'warga'}
        />
      );
      case 'inventory': return <InventoryPage data={inventory} onAdd={() => {}} role={user?.role || 'warga'} />;
      case 'settings': return <SettingsPage settings={settings} onSave={handleSaveSettings} role={user?.role || 'warga'} />;
      case 'events': return <div className="p-8 text-center text-slate-500">Fitur Kegiatan Segera Hadir</div>;
      default: return <Dashboard stats={stats} finances={finances} />;
    }
  };

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen flex bg-[#FDFCF8]">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-emerald-50 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 overflow-hidden">
                {settings.mosque_logo ? (
                  <img src={settings.mosque_logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <LayoutDashboard size={24} />
                )}
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight truncate max-w-[140px]">{settings.mosque_name || 'Nurul Iman'}</h1>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Management System</p>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg lg:hidden">
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-2 flex-1">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarItem icon={Wallet} label="Keuangan" active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} />
            <SidebarItem icon={Package} label="Inventaris" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
            <SidebarItem icon={Calendar} label="Kegiatan" active={activeTab === 'events'} onClick={() => setActiveTab('events')} />
            <SidebarItem icon={Users} label="Jamaah" active={activeTab === 'jamaah'} onClick={() => setActiveTab('jamaah')} />
            <SidebarItem icon={Settings} label="Pengaturan" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </nav>

          <div className="mt-auto pt-8 border-t border-emerald-50 space-y-4">
            <div className="px-4 py-3 bg-slate-50 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xs uppercase">
                {user.username[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user.username}</p>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={() => setUser(null)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-all font-medium"
            >
              <LogOut size={20} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-emerald-50 px-4 sm:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg">
              <Menu size={20} />
            </button>
            <div className="h-6 w-[1px] bg-slate-100 mx-1 sm:mx-2 hidden md:block"></div>
            <h2 className="font-bold text-slate-400 hidden md:block truncate max-w-[200px]">{settings.mosque_name || 'Nurul Iman'}</h2>
          </div>
          
          <div className="relative max-w-md w-full hidden lg:block mx-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari data, laporan, atau barang..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-100 mx-1 sm:mx-2"></div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold capitalize truncate max-w-[100px]">{user.username}</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase">{user.role === 'admin' ? 'Administrator' : 'Jamaah'}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 border-2 border-white shadow-sm flex items-center justify-center text-emerald-600 font-bold uppercase text-xs sm:text-base">
                {user.username[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        <TransactionModal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setEditItem(null);
          }} 
          onSuccess={fetchData} 
          editItem={editItem}
        />

        <ConfirmationModal 
          isOpen={isConfirmOpen}
          onClose={() => {
            setIsConfirmOpen(false);
            setItemToDelete(null);
          }}
          onConfirm={confirmDeleteFinance}
          title="Hapus Transaksi?"
          message="Data yang dihapus tidak dapat dikembalikan. Apakah Anda yakin?"
        />
      </main>
    </div>
  );
}
