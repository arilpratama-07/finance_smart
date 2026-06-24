import { useState } from 'react';
import { useStore, fmt } from '../store';
import { X, TrendingUp, TrendingDown, Plus, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const typeLabels = { stock:'Saham', mutual:'Reksa Dana', crypto:'Kripto', gold:'Emas', bond:'Obligasi' };
const typeColors = { stock:'#3b82f6', mutual:'#10b981', crypto:'#f59e0b', gold:'#f97316', bond:'#8b5cf6' };

function InvestModal({ onClose }) {
  const { addInvestment } = useStore();
  const [form, setForm] = useState({ name:'', type:'stock', quantity:'', buyPrice:'', currentPrice:'', sector:'' });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const handleSubmit = (e) => {
    e.preventDefault();
    addInvestment({ ...form, quantity: Number(form.quantity), buyPrice: Number(form.buyPrice), currentPrice: Number(form.currentPrice) });
    onClose();
  };
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Tambah Investasi</div>
          <button className="btn btn-secondary btn-icon btn-sm" onClick={onClose}><X size={16}/></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nama Instrumen</label>
                <input className="form-control" placeholder="BBCA, Bitcoin..." value={form.name} onChange={e=>set('name',e.target.value)} required/>
              </div>
              <div className="form-group">
                <label className="form-label">Tipe</label>
                <select className="form-control" value={form.type} onChange={e=>set('type',e.target.value)}>
                  {Object.entries(typeLabels).map(([k,v])=><option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Jumlah / Lot</label>
                <input className="form-control" type="number" placeholder="10" value={form.quantity} onChange={e=>set('quantity',e.target.value)} required/>
              </div>
              <div className="form-group">
                <label className="form-label">Sektor</label>
                <input className="form-control" placeholder="Perbankan, Teknologi..." value={form.sector} onChange={e=>set('sector',e.target.value)}/>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Harga Beli (Rp)</label>
                <input className="form-control" type="number" placeholder="9400" value={form.buyPrice} onChange={e=>set('buyPrice',e.target.value)} required/>
              </div>
              <div className="form-group">
                <label className="form-label">Harga Saat Ini (Rp)</label>
                <input className="form-control" type="number" placeholder="10250" value={form.currentPrice} onChange={e=>set('currentPrice',e.target.value)} required/>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary">Tambah Investasi</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Investments() {
  const { investments, deleteInvestment, openModal, modalOpen } = useStore();
  const [showModal, setShowModal] = useState(false);

  const withCalc = investments.map(inv => {
    const currentValue = inv.quantity * inv.currentPrice;
    const costBasis = inv.quantity * inv.buyPrice;
    const gainLoss = currentValue - costBasis;
    const gainLossPct = ((gainLoss / costBasis) * 100).toFixed(2);
    return { ...inv, currentValue, costBasis, gainLoss, gainLossPct };
  });

  const totalValue = withCalc.reduce((s,i)=>s+i.currentValue, 0);
  const totalCost = withCalc.reduce((s,i)=>s+i.costBasis, 0);
  const totalGL = totalValue - totalCost;
  const totalGLPct = totalCost ? ((totalGL/totalCost)*100).toFixed(2) : 0;

  // Allocation pie
  const byType = {};
  withCalc.forEach(i => { byType[i.type] = (byType[i.type]||0) + i.currentValue; });
  const pieData = Object.entries(byType).map(([k,v])=>({ name: typeLabels[k]||k, value: v, color: typeColors[k]||'#666' }));

  return (
    <div className="page-container">
      {showModal && <InvestModal onClose={()=>setShowModal(false)}/>}

      <div className="page-header">
        <div>
          <div className="page-title">Portofolio Investasi</div>
          <div className="page-subtitle">Pantau semua instrumen investasi Anda</div>
        </div>
        <button className="btn btn-primary" onClick={()=>setShowModal(true)}><Plus size={14}/> Tambah Investasi</button>
      </div>

      {/* Summary */}
      <div className="grid-chart" style={{marginBottom:24}}>
        <div style={{display:'flex', flexDirection:'column', gap:16}}>
          <div style={{
            background:'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))',
            border:'1px solid rgba(59,130,246,0.25)', borderRadius:'var(--radius-lg)', padding:24
          }}>
            <div style={{fontSize:12, color:'var(--text-muted)', marginBottom:6}}>Total Nilai Portofolio</div>
            <div style={{fontFamily:'var(--font-display)', fontSize:36, fontWeight:900, color:'var(--blue)', marginBottom:8}}>{fmt(totalValue)}</div>
            <div style={{display:'flex', gap:24}}>
              <div>
                <div style={{fontSize:11, color:'var(--text-muted)'}}>Modal Investasi</div>
                <div style={{fontSize:16, fontWeight:700}}>{fmt(totalCost)}</div>
              </div>
              <div>
                <div style={{fontSize:11, color:'var(--text-muted)'}}>Untung/Rugi</div>
                <div style={{fontSize:16, fontWeight:700, color: totalGL>=0?'var(--green)':'var(--red)'}}>
                  {totalGL>=0?'+':''}{fmt(totalGL)} ({totalGL>=0?'+':''}{totalGLPct}%)
                </div>
              </div>
            </div>
          </div>
          <div className="grid-3">
            {withCalc.slice(0,3).map(inv=>(
              <div key={inv.id} style={{background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:16}}>
                <div style={{fontSize:11, color:typeColors[inv.type], fontWeight:700, marginBottom:4}}>{typeLabels[inv.type]}</div>
                <div style={{fontWeight:700, fontSize:14}}>{inv.name}</div>
                <div style={{fontSize:13, color: inv.gainLoss>=0?'var(--green)':'var(--red)', fontWeight:600, marginTop:4}}>
                  {inv.gainLoss>=0?'+':''}{inv.gainLossPct}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="chart-title">Alokasi Portofolio</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {pieData.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip formatter={v=>fmt(v)} contentStyle={{background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:10}}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:'flex', flexDirection:'column', gap:6}}>
            {pieData.map((d,i)=>(
              <div key={i} style={{display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:12}}>
                <div style={{display:'flex', alignItems:'center', gap:6}}>
                  <div style={{width:8, height:8, borderRadius:'50%', background:d.color}}/>
                  <span style={{color:'var(--text-secondary)'}}>{d.name}</span>
                </div>
                <span style={{fontWeight:600}}>{((d.value/totalValue)*100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Investment Cards */}
      <div className="grid-2">
        {withCalc.map(inv => (
          <div key={inv.id} className="invest-card">
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14}}>
              <div>
                <div style={{display:'flex', alignItems:'center', gap:8}}>
                  <div style={{fontFamily:'var(--font-display)', fontSize:18, fontWeight:800}}>{inv.name}</div>
                  <span className="badge" style={{background:`${typeColors[inv.type]}20`, color:typeColors[inv.type]}}>{typeLabels[inv.type]}</span>
                </div>
                <div style={{fontSize:12, color:'var(--text-muted)', marginTop:2}}>{inv.sector}</div>
              </div>
              <button className="btn btn-danger btn-icon btn-sm" onClick={()=>deleteInvestment(inv.id)}><Trash2 size={13}/></button>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14}}>
              {[
                {label:'Jumlah', val: inv.quantity.toLocaleString('id-ID')},
                {label:'Harga Beli', val: fmt(inv.buyPrice)},
                {label:'Harga Saat Ini', val: fmt(inv.currentPrice)},
                {label:'Nilai Saat Ini', val: fmt(inv.currentValue)},
              ].map((item,i)=>(
                <div key={i} style={{background:'var(--bg-primary)', borderRadius:8, padding:'10px 12px'}}>
                  <div style={{fontSize:11, color:'var(--text-muted)'}}>{item.label}</div>
                  <div style={{fontSize:13, fontWeight:700, marginTop:2}}>{item.val}</div>
                </div>
              ))}
            </div>

            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', background: inv.gainLoss>=0?'rgba(16,185,129,0.08)':'rgba(239,68,68,0.08)', borderRadius:10, border:`1px solid ${inv.gainLoss>=0?'rgba(16,185,129,0.2)':'rgba(239,68,68,0.2)'}`}}>
              <div style={{display:'flex', alignItems:'center', gap:6}}>
                {inv.gainLoss>=0 ? <TrendingUp size={16} color="var(--green)"/> : <TrendingDown size={16} color="var(--red)"/>}
                <span style={{fontSize:13, color:'var(--text-muted)'}}>Untung / Rugi</span>
              </div>
              <div style={{fontFamily:'var(--font-display)', fontWeight:800, fontSize:16, color: inv.gainLoss>=0?'var(--green)':'var(--red)'}}>
                {inv.gainLoss>=0?'+':''}{fmt(inv.gainLoss)} ({inv.gainLoss>=0?'+':''}{inv.gainLossPct}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
