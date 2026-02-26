export interface FinanceRecord {
  id: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  created_at: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  condition: 'good' | 'fair' | 'poor';
  purchase_date: string;
  last_checked: string;
}

export interface MosqueEvent {
  id: number;
  title: string;
  speaker: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export interface DashboardStats {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  inventoryCount: number;
  upcomingEvents: number;
}

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'warga';
}
