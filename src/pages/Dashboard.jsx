import { useStore, fmt } from '../store';
import { ArrowUpCircle, ArrowDownCircle, Wallet, TrendingUp, ArrowUp, ArrowDown, Plus, ChevronRight } from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { format, subDays } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import TransactionModal from '../components/TransactionModal';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 12, fontWeight: 600, color: p.color, marginBottom: 2 }}>
          {p.name}: {fmt(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { transactions, accounts, investments, budgets, categories, openModal, modalOpen } = useStore();

  const thisMonth = format(new Date(), 'yyyy-MM');
  const lastMonth = format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM');

  const monthlyIncome = transactions.filter(t => t.type === 'income' && t.date.startsWith(thisMonth)).reduce((s, t) => s + t.amount, 0);
  const monthlyExpense = transactions.filter(t => t.type === 'expense' && t.date.startsWith(thisMonth)).reduce((s, t) => s + t.amount, 0);
  const lastMonthIncome = transactions.filter(t => t.type === 'income' && t.date.startsWith(lastMonth)).reduce((s, t) => s + t.amount, 0);
  const lastMonthExpense = transactions.filter(t => t.type === 'expense' && t.date.startsWith(lastMonth)).reduce((s, t) => s + t.amount, 0);
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const totalInvest = investments.reduce((s, i) => s + i.quantity * i.currentPrice, 0);

  const incomeChange = lastMonthIncome ? ((monthlyIncome - lastMonthIncome) / lastMonthIncome * 100).toFixed(1) : 0;
  const expenseChange = lastMonthExpense ? ((monthlyExpense - lastMonthExpense) / lastMonthExpense * 100).toFixed(1) : 0;

  // Last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
    const dayLabel = format(subDays(new Date(), 6 - i), 'EEE', { locale: localeId });
    const income = transactions.filter(t => t.date === d && t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.date === d && t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { day: dayLabel, Pemasukan: income, Pengeluaran: expense };
  });

  // Category pie
  const catMap = {};
  transactions.filter(t => t.type === 'expense' && t.date.startsWith(thisMonth)).forEach(t => {
    catMap[t.category] = (catMap[t.category] || 0) + t.amount;
  });
  const allExpCats = categories.expense;
  const pieData = Object.entries(catMap).map(([catId, val]) => {
    const cat = allExpCats.find(c => c.id === catId);
    return { name: cat?.name || catId, value: val, color: cat?.color || '#666', icon: cat?.icon };
  }).sort((a, b) => b.value - a.value).slice(0, 5);

  const recent = transactions.slice(0, 8);
  const budgetAlerts = budgets.filter(b => b.spent / b.limit >= 0.8);
  const allCats = [...categories.income, ...categories.expense];
  const getCategory = (id) => allCats.find(c => c.id === id);

  return (
    <div className="page-container">
      {modalOpen === 'transaction' && <TransactionModal />}

      {/* ── HERO BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0a2e1f 0%, #062030 50%, #1a0a30 100%)',
        border: '1px solid rgba(16,185,129,0.2)',
        borderRadius: 'var(--radius-xl)', padding: '22px',
        marginBottom: 20, position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 130, height: 130, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.15), transparent)', pointerEvents: 'none' }} />
        <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600, marginBottom: 4 }}>👋 Selamat datang kembali</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, marginBottom: 12 }}>Ahmad Fauzi</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Total Kekayaan Bersih</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 30 }} className="gradient-text">
          {fmt(totalBalance + totalInvest)}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Saldo + Portofolio Investasi</div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="stats-grid">
        {[
          { label: 'Pemasukan', value: monthlyIncome, color: 'var(--green)', icon: <ArrowUpCircle />, cls: 'green', change: incomeChange, up: true },
          { label: 'Pengeluaran', value: monthlyExpense, color: 'var(--red)', icon: <ArrowDownCircle />, cls: 'red', change: expenseChange, up: false },
          { label: 'Saldo Akun', value: totalBalance, color: 'var(--blue)', icon: <Wallet />, cls: 'blue', change: accounts.filter(a => a.balance > 0).length + ' akun', noArrow: true },
          { label: 'Investasi', value: totalInvest, color: 'var(--purple)', icon: <TrendingUp />, cls: 'purple', change: '5 instrumen', noArrow: true },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.cls}`}>
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color }}>{fmt(s.value)}</div>
            <div className={`stat-change ${s.up ? (s.change >= 0 ? 'up' : 'down') : (!s.up ? 'up' : 'down')}`}>
              {!s.noArrow && (s.change >= 0 ? <ArrowUp size={11} /> : <ArrowDown size={11} />)}
              {s.noArrow ? s.change : `${Math.abs(s.change)}%`}
            </div>
          </div>
        ))}
      </div>

      {/* ── CASHFLOW CHART ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="chart-title">Arus Kas 7 Hari Terakhir</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={last7} barSize={14} barGap={4}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000000).toFixed(1)}jt`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Pemasukan" fill="var(--green)" radius={[5, 5, 0, 0]} />
            <Bar dataKey="Pengeluaran" fill="var(--red)" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── PIE + BUDGET ALERT ── */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Pie */}
        <div className="card">
          <div className="chart-title">Kategori Pengeluaran</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3} dataKey="value">
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={v => fmt(v)} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {pieData.slice(0, 3).map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: d.color }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{d.icon} {d.name}</span>
                </div>
                <span style={{ fontWeight: 600, color: d.color }}>{fmt(d.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget alerts */}
        <div className="card">
          <div className="chart-title">Status Anggaran</div>
          {budgetAlerts.slice(0, 3).map(b => {
            const cat = getCategory(b.category);
            const pct = Math.min(Math.round(b.spent / b.limit * 100), 100);
            const isOver = b.spent > b.limit;
            const barColor = isOver ? 'var(--red)' : 'var(--yellow)';
            return (
              <div key={b.id} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span>{cat?.icon} {cat?.name}</span>
                  <span style={{ color: barColor, fontWeight: 700 }}>{pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: barColor }} />
                </div>
              </div>
            );
          })}
          {budgetAlerts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--green)', fontSize: 13 }}>
              ✅ Semua anggaran aman
            </div>
          )}
        </div>
      </div>

      {/* ── RECENT TRANSACTIONS ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div className="chart-title" style={{ marginBottom: 0 }}>Transaksi Terbaru</div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => useStore.getState().setPage('transactions')}
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          >
            Semua <ChevronRight size={13} />
          </button>
        </div>
        {recent.map(tx => {
          const cat = getCategory(tx.category);
          return (
            <div key={tx.id} className="tx-item">
              <div className="tx-icon" style={{ background: `${cat?.color}18` }}>{cat?.icon || '💳'}</div>
              <div className="tx-info">
                <div className="tx-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.description}</div>
                <div className="tx-cat">{cat?.name} · {tx.date}</div>
              </div>
              <div className={`tx-amount ${tx.type === 'income' ? 'amount-in' : 'amount-out'}`}>
                {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── ACCOUNTS SUMMARY ── */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div className="chart-title" style={{ marginBottom: 0 }}>Akun Saya</div>
          <button className="btn btn-secondary btn-sm" onClick={() => useStore.getState().setPage('accounts')} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            Detail <ChevronRight size={13} />
          </button>
        </div>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
          {accounts.map(acc => (
            <div key={acc.id} style={{
              flexShrink: 0, minWidth: 150,
              background: 'var(--bg-primary)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '14px',
            }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{acc.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>{acc.name}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: acc.balance < 0 ? 'var(--red)' : 'var(--text-primary)' }}>
                {fmt(acc.balance)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
