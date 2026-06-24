import { useState } from 'react';
import { useStore, fmt } from '../store';
import { Plus, X, CreditCard, Wallet, Landmark, Smartphone, Edit, Trash2 } from 'lucide-react';

const typeIcons = { bank: Landmark, ewallet: Smartphone, cash: Wallet, credit: CreditCard };
const typeLabels = { bank:'Bank', ewallet:'Dompet Digital', cash:'Kas Tunai', credit:'Kartu Kredit' };
const typeColors = { bank:'#3b82f6', ewallet:'#10b981', cash:'#f59e0b', credit:'#ef4444' };

function AccountModal({ onClose, editingAccount }) {
  const { addAccount, updateAccount } = useStore();
  const [form, setForm] = useState(editingAccount || { name:'', type:'bank', balance:'', icon:'🏦', color:'#3b82f6' });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAccount) {
      updateAccount(editingAccount.id, { ...form, balance: Number(form.balance) });
    } else {
      addAccount({ ...form, balance: Number(form.balance) });
    }
    onClose();
  };
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{editingAccount ? 'Edit Akun' : 'Tambah Akun'}</div>
          <button className="btn btn-secondary btn-icon btn-sm" onClick={onClose}><X size={16}/></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nama Akun</label>
                <input className="form-control" placeholder="BCA Tabungan..." value={form.name} onChange={e=>set('name',e.target.value)} required/>
              </div>
              <div className="form-group">
                <label className="form-label">Tipe Akun</label>
                <select className="form-control" value={form.type} onChange={e=>set('type',e.target.value)}>
                  {Object.entries(typeLabels).map(([k,v])=><option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Saldo Awal (Rp)</label>
                <input className="form-control" type="number" placeholder="0" value={form.balance} onChange={e=>set('balance',e.target.value)} required/>
              </div>
              <div className="form-group">
                <label className="form-label">Ikon Emoji</label>
                <input className="form-control" placeholder="🏦" value={form.icon} onChange={e=>set('icon',e.target.value)}/>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary">{editingAccount ? 'Simpan Perubahan' : 'Tambah Akun'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Accounts() {
  const { accounts, deleteAccount } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const handleEdit = (acc) => {
    setEditingAccount(acc);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus akun ini?')) {
      deleteAccount(id);
    }
  };

  const totalAssets = accounts.filter(a=>a.balance>0).reduce((s,a)=>s+a.balance,0);
  const totalDebt = accounts.filter(a=>a.balance<0).reduce((s,a)=>s+a.balance,0);
  const netWorth = totalAssets + totalDebt;

  const byType = {};
  accounts.forEach(a => { if(!byType[a.type]) byType[a.type]=[]; byType[a.type].push(a); });

  return (
    <div className="page-container">
      {showModal && <AccountModal onClose={()=>{setShowModal(false); setEditingAccount(null);}} editingAccount={editingAccount}/>}

      <div className="page-header">
        <div>
          <div className="page-title">Multi-Akun</div>
          <div className="page-subtitle">Kelola semua rekening dan dompet Anda</div>
        </div>
        <button className="btn btn-primary" onClick={()=>setShowModal(true)}><Plus size={14}/> Tambah Akun</button>
      </div>

      {/* Summary */}
      <div className="grid-3" style={{marginBottom:28}}>
        <div style={{background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'var(--radius-lg)', padding:24}}>
          <div style={{fontSize:12, color:'var(--text-muted)', marginBottom:6}}>Total Aset</div>
          <div style={{fontFamily:'var(--font-display)', fontSize:26, fontWeight:800, color:'var(--green)'}}>{fmt(totalAssets)}</div>
        </div>
        <div style={{background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'var(--radius-lg)', padding:24}}>
          <div style={{fontSize:12, color:'var(--text-muted)', marginBottom:6}}>Total Utang</div>
          <div style={{fontFamily:'var(--font-display)', fontSize:26, fontWeight:800, color:'var(--red)'}}>{fmt(totalDebt)}</div>
        </div>
        <div style={{background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:'var(--radius-lg)', padding:24}}>
          <div style={{fontSize:12, color:'var(--text-muted)', marginBottom:6}}>Kekayaan Bersih</div>
          <div style={{fontFamily:'var(--font-display)', fontSize:26, fontWeight:800, color:'var(--blue)'}}>{fmt(netWorth)}</div>
        </div>
      </div>

      {/* Accounts by type */}
      {Object.entries(byType).map(([type, accs]) => {
        const Icon = typeIcons[type] || Wallet;
        const color = typeColors[type] || '#666';
        return (
          <div key={type} style={{marginBottom:24}}>
            <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:14}}>
              <div style={{width:32, height:32, borderRadius:8, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Icon size={16} color={color}/>
              </div>
              <div style={{fontFamily:'var(--font-display)', fontSize:16, fontWeight:700, color}}>{typeLabels[type]}</div>
              <div style={{fontSize:12, color:'var(--text-muted)'}}>({accs.length} akun)</div>
            </div>
            <div className="grid-2">
              {accs.map(acc => (
                <div key={acc.id} style={{
                  background:'var(--bg-card)', border:`1px solid ${acc.balance<0?'rgba(239,68,68,0.2)':'var(--border)'}`,
                  borderRadius:'var(--radius-lg)', padding:22, transition:'var(--transition)'
                }}>
                  <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:16}}>
                    <div style={{width:48, height:48, borderRadius:14, background:`${acc.color||color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24}}>
                      {acc.icon}
                    </div>
                    <div style={{flex: 1}}>
                      <div style={{fontWeight:700, fontSize:15}}>{acc.name}</div>
                      <div style={{fontSize:12, color:'var(--text-muted)'}}>{typeLabels[acc.type]}</div>
                    </div>
                    <div style={{display:'flex', gap: 4}}>
                      <button className="btn btn-secondary btn-icon btn-sm" onClick={() => handleEdit(acc)} style={{padding: 6}}><Edit size={14}/></button>
                      <button className="btn btn-secondary btn-icon btn-sm" onClick={() => handleDelete(acc.id)} style={{padding: 6, color: 'var(--red)'}}><Trash2 size={14}/></button>
                    </div>
                  </div>
                  <div style={{fontFamily:'var(--font-display)', fontSize:28, fontWeight:900, color: acc.balance<0?'var(--red)':'var(--text-primary)'}}>
                    {fmt(acc.balance)}
                  </div>
                  {acc.balance < 0 && (
                    <div style={{marginTop:8, fontSize:12, color:'var(--red)'}}>⚠️ Saldo minus / hutang</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
