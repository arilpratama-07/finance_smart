import { useState } from 'react';
import { useStore, fmt } from '../store';
import { Trash2, Edit2, Plus, X, AlertTriangle } from 'lucide-react';

function BudgetModal({ onClose }) {
  const { addBudget, categories } = useStore();
  const [form, setForm] = useState({ category: categories.expense[0].id, limit: '' });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const handleSubmit = (e) => {
    e.preventDefault();
    addBudget({ ...form, limit: Number(form.limit) });
    onClose();
  };
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Buat Anggaran Baru</div>
          <button className="btn btn-secondary btn-icon btn-sm" onClick={onClose}><X size={16}/></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Kategori</label>
              <select className="form-control" value={form.category} onChange={e=>set('category',e.target.value)}>
                {categories.expense.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Batas Anggaran (Rp)</label>
              <input className="form-control" type="number" placeholder="1000000" value={form.limit} onChange={e=>set('limit',e.target.value)} required />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary">Simpan Anggaran</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Budgets() {
  const { budgets, deleteBudget, categories, transactions } = useStore();
  const [showModal, setShowModal] = useState(false);

  const thisMonth = new Date().toISOString().slice(0,7);
  const allCats = [...categories.income, ...categories.expense];
  const getCategory = (id) => allCats.find(c => c.id === id);

  const budgetsWithActual = budgets.map(b => {
    const actual = transactions.filter(t => t.type==='expense' && t.category===b.category && t.date.startsWith(thisMonth)).reduce((s,t)=>s+t.amount,0);
    return { ...b, actual };
  });

  const totalBudget = budgets.reduce((s,b)=>s+b.limit,0);
  const totalSpent = budgetsWithActual.reduce((s,b)=>s+b.actual,0);
  const overBudget = budgetsWithActual.filter(b=>b.actual > b.limit);

  return (
    <div className="page-container">
      {showModal && <BudgetModal onClose={()=>setShowModal(false)}/>}

      <div className="page-header">
        <div>
          <div className="page-title">Anggaran</div>
          <div className="page-subtitle">Kelola batas pengeluaran per kategori</div>
        </div>
        <button className="btn btn-primary" onClick={()=>setShowModal(true)}><Plus size={14}/> Buat Anggaran</button>
      </div>

      {/* Summary */}
      <div className="grid-3" style={{marginBottom:24}}>
        <div className="card" style={{textAlign:'center'}}>
          <div style={{fontSize:12, color:'var(--text-muted)', marginBottom:6}}>Total Anggaran</div>
          <div style={{fontFamily:'var(--font-display)', fontSize:24, fontWeight:800, color:'var(--blue)'}}>{fmt(totalBudget)}</div>
        </div>
        <div className="card" style={{textAlign:'center'}}>
          <div style={{fontSize:12, color:'var(--text-muted)', marginBottom:6}}>Total Terpakai</div>
          <div style={{fontFamily:'var(--font-display)', fontSize:24, fontWeight:800, color: totalSpent > totalBudget ? 'var(--red)' : 'var(--green)'}}>{fmt(totalSpent)}</div>
        </div>
        <div className="card" style={{textAlign:'center'}}>
          <div style={{fontSize:12, color:'var(--text-muted)', marginBottom:6}}>Sisa Anggaran</div>
          <div style={{fontFamily:'var(--font-display)', fontSize:24, fontWeight:800, color: totalBudget-totalSpent < 0 ? 'var(--red)' : 'var(--green)'}}>{fmt(totalBudget-totalSpent)}</div>
        </div>
      </div>

      {overBudget.length > 0 && (
        <div style={{background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'var(--radius)', padding:'14px 18px', marginBottom:20, display:'flex', alignItems:'center', gap:10}}>
          <AlertTriangle size={18} color="var(--red)"/>
          <span style={{fontSize:14, color:'var(--red)', fontWeight:600}}>{overBudget.length} kategori melebihi batas anggaran!</span>
        </div>
      )}

      {/* Budget Cards */}
      <div className="grid-2">
        {budgetsWithActual.map(b => {
          const cat = getCategory(b.category);
          const pct = Math.min(Math.round(b.actual / b.limit * 100), 100);
          const rawPct = Math.round(b.actual / b.limit * 100);
          const isOver = b.actual > b.limit;
          const isWarn = !isOver && pct >= 80;
          const barColor = isOver ? 'var(--red)' : isWarn ? 'var(--yellow)' : 'var(--green)';

          return (
            <div key={b.id} className="card">
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16}}>
                <div style={{display:'flex', alignItems:'center', gap:10}}>
                  <div style={{width:42, height:42, borderRadius:12, background:`${cat?.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>
                    {cat?.icon}
                  </div>
                  <div>
                    <div style={{fontWeight:700, fontSize:15}}>{cat?.name}</div>
                    <div style={{fontSize:12, color:'var(--text-muted)'}}>Bulan ini</div>
                  </div>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:8}}>
                  {isOver && <span className="badge badge-red">Melebihi Batas</span>}
                  {isWarn && !isOver && <span className="badge badge-yellow">Hampir Habis</span>}
                  <button className="btn btn-danger btn-icon btn-sm" onClick={()=>deleteBudget(b.id)}><Trash2 size={13}/></button>
                </div>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:10}}>
                <span style={{color:'var(--text-muted)'}}>Terpakai: <strong style={{color: isOver?'var(--red)':'var(--text-primary)'}}>{fmt(b.actual)}</strong></span>
                <span style={{color:'var(--text-muted)'}}>Batas: <strong>{fmt(b.limit)}</strong></span>
              </div>
              <div className="progress-bar" style={{height:10}}>
                <div className="progress-fill" style={{width:`${pct}%`, background: barColor, boxShadow:`0 0 8px ${barColor}60`}}/>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:12, marginTop:8}}>
                <span style={{color: barColor, fontWeight:700}}>{rawPct}% terpakai</span>
                <span style={{color:'var(--text-muted)'}}>Sisa: {fmt(Math.max(b.limit - b.actual, 0))}</span>
              </div>
            </div>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <div className="empty-title">Belum ada anggaran</div>
          <div className="empty-desc">Buat anggaran untuk mengontrol pengeluaran Anda</div>
        </div>
      )}
    </div>
  );
}
