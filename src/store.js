import { create } from 'zustand';
import { format, subDays, subMonths } from 'date-fns';

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const categories = {
  expense: [
    { id:'food', name:'Makanan & Minum', icon:'🍜', color:'#f97316' },
    { id:'transport', name:'Transportasi', icon:'🚗', color:'#3b82f6' },
    { id:'shopping', name:'Belanja', icon:'🛍️', color:'#8b5cf6' },
    { id:'health', name:'Kesehatan', icon:'💊', color:'#ef4444' },
    { id:'entertainment', name:'Hiburan', icon:'🎮', color:'#f59e0b' },
    { id:'utilities', name:'Tagihan & Utilitas', icon:'⚡', color:'#06b6d4' },
    { id:'education', name:'Pendidikan', icon:'📚', color:'#10b981' },
    { id:'other_exp', name:'Lainnya', icon:'📦', color:'#6b7280' },
  ],
  income: [
    { id:'salary', name:'Gaji', icon:'💼', color:'#10b981' },
    { id:'freelance', name:'Freelance', icon:'💻', color:'#34d399' },
    { id:'investment', name:'Hasil Investasi', icon:'📈', color:'#06b6d4' },
    { id:'bonus', name:'Bonus', icon:'🎁', color:'#f59e0b' },
    { id:'other_inc', name:'Lainnya', icon:'💰', color:'#8b5cf6' },
  ]
};

const accounts = [
  { id:'bca', name:'BCA Tabungan', icon:'🏦', type:'bank', balance: 12500000, color:'#3b82f6' },
  { id:'gopay', name:'GoPay', icon:'💚', type:'ewallet', balance: 850000, color:'#10b981' },
  { id:'ovo', name:'OVO', icon:'💜', type:'ewallet', balance: 320000, color:'#8b5cf6' },
  { id:'cash', name:'Kas Tunai', icon:'💵', type:'cash', balance: 500000, color:'#f59e0b' },
  { id:'mandiri', name:'Mandiri Kredit', icon:'🏧', type:'credit', balance: -2300000, color:'#ef4444' },
];

const generateTransactions = () => {
  const txns = [];
  const expCats = categories.expense;
  const incCats = categories.income;
  const accIds = accounts.map(a => a.id);

  for (let i = 60; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    // 1-2 income per week
    if (i % 7 === 0 || i % 30 === 0) {
      const cat = incCats[rand(0, incCats.length - 1)];
      txns.push({
        id: `inc-${i}`, type: 'income', date, 
        amount: i % 30 === 0 ? rand(8000000, 12000000) : rand(500000, 2500000),
        category: cat.id, description: cat.name, account: 'bca',
        note: '', tags: []
      });
    }
    // 2-4 expenses per day
    const numExp = rand(1, 3);
    for (let j = 0; j < numExp; j++) {
      const cat = expCats[rand(0, expCats.length - 1)];
      txns.push({
        id: `exp-${i}-${j}`, type: 'expense', date,
        amount: rand(15000, 800000),
        category: cat.id, description: cat.name,
        account: accIds[rand(0, accIds.length - 1)],
        note: '', tags: []
      });
    }
  }
  return txns.sort((a, b) => b.date.localeCompare(a.date));
};

const investments = [
  { id:'inv1', name:'BBCA', type:'stock', quantity: 10, buyPrice: 9400, currentPrice: 10250, sector:'Perbankan' },
  { id:'inv2', name:'Reksa Dana Campuran', type:'mutual', quantity: 1000000, buyPrice: 1, currentPrice: 1.18, sector:'Campuran' },
  { id:'inv3', name:'Bitcoin', type:'crypto', quantity: 0.015, buyPrice: 850000000, currentPrice: 980000000, sector:'Kripto' },
  { id:'inv4', name:'GOTO', type:'stock', quantity: 50000, buyPrice: 54, currentPrice: 61, sector:'Teknologi' },
  { id:'inv5', name:'Emas Digital', type:'gold', quantity: 5, buyPrice: 1050000, currentPrice: 1120000, sector:'Komoditas' },
];

const budgets = [
  { id:'b1', category:'food', limit: 2000000, spent: 1450000 },
  { id:'b2', category:'transport', limit: 800000, spent: 620000 },
  { id:'b3', category:'shopping', limit: 1500000, spent: 1380000 },
  { id:'b4', category:'entertainment', limit: 500000, spent: 210000 },
  { id:'b5', category:'health', limit: 600000, spent: 150000 },
];

const scheduledTx = [
  { id:'s1', name:'Cicilan Rumah', amount: 3500000, frequency:'monthly', nextDate:'2026-07-01', category:'utilities', account:'bca' },
  { id:'s2', name:'Netflix', amount: 54000, frequency:'monthly', nextDate:'2026-06-28', category:'entertainment', account:'ovo' },
  { id:'s3', name:'Tabungan Otomatis', amount: 1000000, frequency:'monthly', nextDate:'2026-07-01', category:'other_inc', account:'bca' },
  { id:'s4', name:'Spotify', amount: 34990, frequency:'monthly', nextDate:'2026-07-05', category:'entertainment', account:'gopay' },
];

const initTransactions = generateTransactions();

export const useStore = create((set, get) => ({
  // State
  activePage: 'dashboard',
  transactions: initTransactions,
  accounts: accounts,
  categories: categories,
  investments: investments,
  budgets: budgets,
  scheduledTx: scheduledTx,
  modalOpen: null,
  editingItem: null,
  filterType: 'all',
  filterCategory: 'all',
  filterAccount: 'all',
  searchQuery: '',
  activeTab: 'all',
  currency: 'IDR',
  theme: 'dark',

  // Navigation
  setPage: (page) => set({ activePage: page }),
  openModal: (modal, item = null) => set({ modalOpen: modal, editingItem: item }),
  closeModal: () => set({ modalOpen: null, editingItem: null }),
  toggleTheme: () => set(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

  // Transactions
  addTransaction: (tx) => set(s => ({
    transactions: [{ ...tx, id: `tx-${Date.now()}` }, ...s.transactions],
    accounts: s.accounts.map(a => a.id === tx.account ? {
      ...a,
      balance: a.balance + (tx.type === 'income' ? tx.amount : -tx.amount)
    } : a)
  })),
  deleteTransaction: (id) => set(s => {
    const tx = s.transactions.find(t => t.id === id);
    return {
      transactions: s.transactions.filter(t => t.id !== id),
      accounts: tx ? s.accounts.map(a => a.id === tx.account ? {
        ...a,
        balance: a.balance + (tx.type === 'income' ? -tx.amount : tx.amount)
      } : a) : s.accounts
    };
  }),
  updateTransaction: (id, data) => set(s => ({
    transactions: s.transactions.map(t => t.id === id ? { ...t, ...data } : t)
  })),
  setFilter: (key, val) => set({ [key]: val }),
  setSearch: (q) => set({ searchQuery: q }),

  // Budgets
  addBudget: (b) => set(s => ({ budgets: [...s.budgets, { ...b, id: `b-${Date.now()}`, spent: 0 }] })),
  updateBudget: (id, data) => set(s => ({ budgets: s.budgets.map(b => b.id === id ? { ...b, ...data } : b) })),
  deleteBudget: (id) => set(s => ({ budgets: s.budgets.filter(b => b.id !== id) })),

  // Investments
  addInvestment: (inv) => set(s => ({ investments: [...s.investments, { ...inv, id: `inv-${Date.now()}` }] })),
  deleteInvestment: (id) => set(s => ({ investments: s.investments.filter(i => i.id !== id) })),

  // Accounts
  addAccount: (acc) => set(s => ({ accounts: [...s.accounts, { ...acc, id: `acc-${Date.now()}` }] })),
  updateAccount: (id, data) => set(s => ({ accounts: s.accounts.map(a => a.id === id ? { ...a, ...data } : a) })),

  // Computed getters
  get totalBalance() {
    return get().accounts.reduce((sum, a) => sum + a.balance, 0);
  },
  get monthlyIncome() {
    const thisMonth = format(new Date(), 'yyyy-MM');
    return get().transactions
      .filter(t => t.type === 'income' && t.date.startsWith(thisMonth))
      .reduce((sum, t) => sum + t.amount, 0);
  },
  get monthlyExpense() {
    const thisMonth = format(new Date(), 'yyyy-MM');
    return get().transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(thisMonth))
      .reduce((sum, t) => sum + t.amount, 0);
  },
  get filteredTransactions() {
    const { transactions, filterType, filterCategory, filterAccount, searchQuery } = get();
    return transactions.filter(t => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (filterCategory !== 'all' && t.category !== filterCategory) return false;
      if (filterAccount !== 'all' && t.account !== filterAccount) return false;
      if (searchQuery && !t.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  },
}));

export const fmt = (amount, currency = 'IDR') => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount);
};

export { categories, accounts as defaultAccounts };
