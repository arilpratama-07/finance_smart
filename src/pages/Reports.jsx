import { useState } from 'react';
import { useStore, fmt } from '../store';
import { Download, FileText, FileSpreadsheet, TrendingUp, TrendingDown } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 16px' }}>
      <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:8 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize:13, fontWeight:600, color:p.color, marginBottom:4 }}>
          {p.name}: {fmt(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function Reports() {
  const { transactions, categories } = useStore();
  const [period, setPeriod] = useState('6m');

  const months = period === '3m' ? 3 : period === '6m' ? 6 : 12;

  // Monthly cashflow
  const cashflowData = Array.from({length: months}, (_, i) => {
    const d = subMonths(new Date(), months - 1 - i);
    const monthStr = format(d, 'yyyy-MM');
    const label = format(d, 'MMM yy', { locale: localeId });
    const income = transactions.filter(t => t.type==='income' && t.date.startsWith(monthStr)).reduce((s,t)=>s+t.amount,0);
    const expense = transactions.filter(t => t.type==='expense' && t.date.startsWith(monthStr)).reduce((s,t)=>s+t.amount,0);
    const net = income - expense;
    return { month: label, Pemasukan: income, Pengeluaran: expense, 'Arus Kas': net };
  });

  // Category breakdown this month
  const thisMonth = format(new Date(), 'yyyy-MM');
  const catMap = {};
  transactions.filter(t => t.type==='expense' && t.date.startsWith(thisMonth)).forEach(t => {
    catMap[t.category] = (catMap[t.category]||0) + t.amount;
  });
  const catData = Object.entries(catMap).map(([catId, val]) => {
    const cat = categories.expense.find(c=>c.id===catId);
    return { name: cat?.name || catId, value: val, fill: cat?.color||'#666', icon: cat?.icon };
  }).sort((a,b) => b.value - a.value);

  // Running balance
  const runningBalance = cashflowData.map((d, i) => ({
    month: d.month,
    'Saldo Bersih': cashflowData.slice(0, i+1).reduce((s, m) => s + m['Arus Kas'], 0),
  }));

  const totalIncome = cashflowData.reduce((s,d)=>s+d.Pemasukan, 0);
  const totalExpense = cashflowData.reduce((s,d)=>s+d.Pengeluaran, 0);
  const avgMonthlyExpense = totalExpense / months;
  const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div className="page-title">Laporan & Analitik</div>
          <div className="page-subtitle">Analisis mendalam kondisi keuangan Anda</div>
        </div>
        <div style={{display:'flex', gap:10}}>
          <div className="tabs">
            {['3m','6m','12m'].map(p => (
              <button key={p} className={`tab ${period===p?'active':''}`} onClick={()=>setPeriod(p)}>{p}</button>
            ))}
          </div>
          <button className="btn btn-secondary btn-sm"><FileText size={14}/> PDF</button>
          <button className="btn btn-secondary btn-sm"><FileSpreadsheet size={14}/> Excel</button>
          <button className="btn btn-primary btn-sm"><Download size={14}/> CSV</button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="stats-grid" style={{marginBottom:24}}>
        <div className="stat-card green">
          <div className="stat-icon green"><TrendingUp /></div>
          <div className="stat-label">Total Pemasukan ({period})</div>
          <div className="stat-value" style={{color:'var(--green)', fontSize:20}}>{fmt(totalIncome)}</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon red"><TrendingDown /></div>
          <div className="stat-label">Total Pengeluaran ({period})</div>
          <div className="stat-value" style={{color:'var(--red)', fontSize:20}}>{fmt(totalExpense)}</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon blue"><TrendingUp /></div>
          <div className="stat-label">Rata-rata Bulanan</div>
          <div className="stat-value" style={{color:'var(--blue)', fontSize:20}}>{fmt(avgMonthlyExpense)}</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon purple"><TrendingUp /></div>
          <div className="stat-label">Tingkat Tabungan</div>
          <div className="stat-value" style={{color:'var(--purple)', fontSize:20}}>{savingsRate}%</div>
        </div>
      </div>

      {/* Cashflow Chart */}
      <div className="card" style={{marginBottom:24}}>
        <div className="chart-title">Arus Kas Bulanan</div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={cashflowData} barSize={20} barGap={6}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{fill:'var(--text-muted)', fontSize:12}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:'var(--text-muted)', fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000000).toFixed(0)}jt`}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Legend wrapperStyle={{fontSize:13, color:'var(--text-secondary)'}}/>
            <Bar dataKey="Pemasukan" fill="var(--green)" radius={[6,6,0,0]}/>
            <Bar dataKey="Pengeluaran" fill="var(--red)" radius={[6,6,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid-chart" style={{marginBottom:24}}>
        {/* Net Savings Trend */}
        <div className="card">
          <div className="chart-title">Tren Arus Kas Bersih</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={cashflowData}>
              <defs>
                <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--cyan)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--cyan)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3"/>
              <XAxis dataKey="month" tick={{fill:'var(--text-muted)', fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'var(--text-muted)', fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000000).toFixed(0)}jt`}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Area type="monotone" dataKey="Arus Kas" stroke="var(--cyan)" strokeWidth={2} fill="url(#netGrad)" dot={{fill:'var(--cyan)', r:4}}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="card">
          <div className="chart-title">Pengeluaran per Kategori</div>
          <div style={{display:'flex', flexDirection:'column', gap:10}}>
            {catData.slice(0,6).map((cat, i) => {
              const maxVal = catData[0]?.value || 1;
              const pct = (cat.value / maxVal * 100).toFixed(0);
              return (
                <div key={i}>
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:5}}>
                    <span style={{color:'var(--text-secondary)'}}>{cat.icon} {cat.name}</span>
                    <span style={{fontWeight:700, color:cat.fill}}>{fmt(cat.value)}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width:`${pct}%`, background:cat.fill}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
