import { useStore, fmt } from '../store';
import { RefreshCw, Calendar, Clock } from 'lucide-react';

const freqLabels = { daily:'Harian', weekly:'Mingguan', monthly:'Bulanan', yearly:'Tahunan' };

export default function Scheduled() {
  const { scheduledTx, categories, accounts } = useStore();
  const allCats = [...categories.income, ...categories.expense];

  const upcoming = [...scheduledTx].sort((a,b) => a.nextDate.localeCompare(b.nextDate));
  const totalMonthly = scheduledTx.filter(t=>t.frequency==='monthly').reduce((s,t)=>s+t.amount,0);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div className="page-title">Transaksi Rutin</div>
          <div className="page-subtitle">Cicilan, tagihan berulang, dan tabungan otomatis</div>
        </div>
        <button className="btn btn-primary"><RefreshCw size={14}/> Tambah Rutin</button>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{marginBottom:24}}>
        <div className="card" style={{textAlign:'center'}}>
          <div style={{fontSize:36, marginBottom:8}}>📅</div>
          <div style={{fontSize:12, color:'var(--text-muted)', marginBottom:6}}>Total Jadwal Aktif</div>
          <div style={{fontFamily:'var(--font-display)', fontSize:28, fontWeight:800}}>{scheduledTx.length}</div>
        </div>
        <div className="card" style={{textAlign:'center'}}>
          <div style={{fontSize:36, marginBottom:8}}>💸</div>
          <div style={{fontSize:12, color:'var(--text-muted)', marginBottom:6}}>Total Bulanan</div>
          <div style={{fontFamily:'var(--font-display)', fontSize:24, fontWeight:800, color:'var(--red)'}}>{fmt(totalMonthly)}</div>
        </div>
        <div className="card" style={{textAlign:'center'}}>
          <div style={{fontSize:36, marginBottom:8}}>🔔</div>
          <div style={{fontSize:12, color:'var(--text-muted)', marginBottom:6}}>Jatuh Tempo Minggu Ini</div>
          <div style={{fontFamily:'var(--font-display)', fontSize:28, fontWeight:800, color:'var(--yellow)'}}>2</div>
        </div>
      </div>

      {/* Scheduled List */}
      <div className="card">
        <div className="chart-title" style={{marginBottom:20}}>Jadwal Transaksi</div>
        <div style={{display:'flex', flexDirection:'column', gap:12}}>
          {upcoming.map(item => {
            const cat = allCats.find(c=>c.id===item.category);
            const acc = accounts.find(a=>a.id===item.account);
            const dueDate = new Date(item.nextDate);
            const today = new Date();
            const diff = Math.ceil((dueDate - today) / (1000*60*60*24));
            const isUrgent = diff <= 3;
            const isPast = diff < 0;

            return (
              <div key={item.id} style={{
                display:'flex', alignItems:'center', gap:14,
                padding:'16px 18px', borderRadius:'var(--radius)',
                background: isUrgent ? 'rgba(245,158,11,0.08)' : 'var(--bg-primary)',
                border: `1px solid ${isUrgent ? 'rgba(245,158,11,0.3)' : 'var(--border)'}`,
              }}>
                <div style={{width:44, height:44, borderRadius:12, background:`${cat?.color||'#666'}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0}}>
                  {cat?.icon || '🔁'}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700, fontSize:15}}>{item.name}</div>
                  <div style={{fontSize:12, color:'var(--text-muted)', marginTop:3, display:'flex', alignItems:'center', gap:12}}>
                    <span><Calendar size={11} style={{display:'inline', marginRight:4}}/>{item.nextDate}</span>
                    <span><Clock size={11} style={{display:'inline', marginRight:4}}/>{freqLabels[item.frequency]}</span>
                    <span>{acc?.icon} {acc?.name}</span>
                  </div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontFamily:'var(--font-display)', fontWeight:800, fontSize:16, color:'var(--red)'}}>{fmt(item.amount)}</div>
                  <div style={{fontSize:11, marginTop:4}}>
                    {isPast ? (
                      <span style={{color:'var(--red)', fontWeight:600}}>Terlambat</span>
                    ) : diff === 0 ? (
                      <span style={{color:'var(--red)', fontWeight:600}}>Hari ini</span>
                    ) : isUrgent ? (
                      <span style={{color:'var(--yellow)', fontWeight:600}}>{diff} hari lagi</span>
                    ) : (
                      <span style={{color:'var(--text-muted)'}}>{diff} hari lagi</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
