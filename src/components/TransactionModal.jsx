import { useState } from 'react';
import { useStore, fmt } from '../store';
import { X, ArrowUpCircle, ArrowDownCircle, ArrowLeftRight } from 'lucide-react';
import { format } from 'date-fns';

export default function TransactionModal() {
  const { closeModal, addTransaction, categories, accounts, editingItem } = useStore();
  const [type, setType] = useState(editingItem?.type || 'expense');
  const [form, setForm] = useState({
    amount: editingItem?.amount || '',
    description: editingItem?.description || '',
    category: editingItem?.category || categories.expense[0].id,
    account: editingItem?.account || accounts[0].id,
    date: editingItem?.date || format(new Date(), 'yyyy-MM-dd'),
    note: editingItem?.note || '',
  });

  const cats = type === 'income' ? categories.income : categories.expense;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.description) return;
    addTransaction({ ...form, type, amount: Number(form.amount) });
    closeModal();
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">
            {editingItem ? 'Edit Transaksi' : 'Tambah Transaksi'}
          </div>
          <button className="btn btn-secondary btn-icon btn-sm" onClick={closeModal}><X size={16} /></button>
        </div>

        <div style={{ padding: '20px 28px 0' }}>
          <div className="tabs">
            {[
              { key: 'income', label: 'Pemasukan', icon: ArrowUpCircle },
              { key: 'expense', label: 'Pengeluaran', icon: ArrowDownCircle },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                className={`tab ${type === key ? 'active' : ''}`}
                onClick={() => { setType(key); set('category', key === 'income' ? categories.income[0].id : categories.expense[0].id); }}
                style={{ flex: 1, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}
              >
                <Icon size={14} style={{ color: key === 'income' ? 'var(--green)' : 'var(--red)' }} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Jumlah (Rp)</label>
              <input
                className="form-control"
                type="number"
                placeholder="0"
                value={form.amount}
                onChange={e => set('amount', e.target.value)}
                style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)' }}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Deskripsi</label>
              <input className="form-control" placeholder="Deskripsi transaksi..." value={form.description} onChange={e => set('description', e.target.value)} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Kategori</label>
                <select className="form-control" value={form.category} onChange={e => set('category', e.target.value)}>
                  {cats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Akun</label>
                <select className="form-control" value={form.account} onChange={e => set('account', e.target.value)}>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tanggal</label>
                <input className="form-control" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Catatan (Opsional)</label>
                <input className="form-control" placeholder="Catatan tambahan..." value={form.note} onChange={e => set('note', e.target.value)} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Batal</button>
            <button type="submit" className="btn btn-primary">
              {editingItem ? 'Simpan Perubahan' : '+ Tambah Transaksi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
