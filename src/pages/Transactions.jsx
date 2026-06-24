import { useState } from 'react';
import { useStore, fmt } from '../store';
import { Search, Trash2, Edit2, Plus, ArrowUpCircle, ArrowDownCircle, SlidersHorizontal } from 'lucide-react';
import TransactionModal from '../components/TransactionModal';

export default function Transactions() {
  const {
    transactions, categories, accounts,
    deleteTransaction, openModal, modalOpen,
    filterType, filterCategory, filterAccount, searchQuery,
    setFilter, setSearch
  } = useStore();

  const [showFilters, setShowFilters] = useState(false);

  const allCats = [...categories.income, ...categories.expense];
  const getCategory = (id) => allCats.find(c => c.id === id);
  const getAccount = (id) => accounts.find(a => a.id === id);

  const filtered = transactions.filter(t => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    if (filterAccount !== 'all' && t.account !== filterAccount) return false;
    if (searchQuery && !t.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalIn = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalOut = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="page-container">
      {modalOpen === 'transaction' && <TransactionModal />}

      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="page-title">Transaksi</div>
          <div className="page-subtitle">{filtered.length} transaksi</div>
        </div>
        <button className="btn btn-primary" onClick={() => openModal('transaction')}>
          <Plus size={14} /> <span className="btn-label-hide">Tambah Transaksi</span>
          <span style={{ display: 'none' }} className="mobile-only">Tambah</span>
        </button>
      </div>

      {/* Summary chips */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {[
          { label: 'Pemasukan', value: totalIn, color: 'var(--green)', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', prefix: '+' },
          { label: 'Pengeluaran', value: totalOut, color: 'var(--red)', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', prefix: '-' },
          { label: 'Selisih', value: totalIn - totalOut, color: totalIn - totalOut >= 0 ? 'var(--green)' : 'var(--red)', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', prefix: totalIn - totalOut >= 0 ? '+' : '' },
        ].map((s, i) => (
          <div key={i} style={{ flexShrink: 0, minWidth: 140, background: s.bg, border: `1px solid ${s.border}`, borderRadius: 'var(--radius)', padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: s.color }}>{s.prefix}{fmt(Math.abs(s.value))}</div>
          </div>
        ))}
      </div>

      {/* Search + filter toggle */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <div className="search-wrap" style={{ flex: 1 }}>
          <Search />
          <input
            className="form-control"
            placeholder="Cari transaksi..."
            value={searchQuery}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          className={`btn btn-secondary btn-icon ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(v => !v)}
          style={{ borderColor: showFilters ? 'var(--green)' : '', color: showFilters ? 'var(--green)' : '' }}
          aria-label="Filter"
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>

      {/* Collapsible Filters */}
      {showFilters && (
        <div className="card" style={{ marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <select className="form-control" value={filterType} onChange={e => setFilter('filterType', e.target.value)}>
            <option value="all">Semua Tipe</option>
            <option value="income">Pemasukan</option>
            <option value="expense">Pengeluaran</option>
          </select>
          <select className="form-control" value={filterCategory} onChange={e => setFilter('filterCategory', e.target.value)}>
            <option value="all">Semua Kategori</option>
            {allCats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
          <select className="form-control" value={filterAccount} onChange={e => setFilter('filterAccount', e.target.value)}>
            <option value="all">Semua Akun</option>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
          </select>
        </div>
      )}

      {/* Desktop Table */}
      <div className="card table-desktop">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Deskripsi</th>
                <th>Kategori</th>
                <th>Akun</th>
                <th>Tanggal</th>
                <th>Jumlah</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map(tx => {
                const cat = getCategory(tx.category);
                const acc = getAccount(tx.account);
                return (
                  <tr key={tx.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 9, background: `${cat?.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                          {cat?.icon || '💳'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{tx.description}</div>
                          {tx.note && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{tx.note}</div>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${tx.type === 'income' ? 'green' : 'orange'}`}>
                        {cat?.icon} {cat?.name || tx.category}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                        <span>{acc?.icon}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{acc?.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{tx.date}</td>
                    <td className={`td-amount ${tx.type === 'income' ? 'amount-in' : 'amount-out'}`}>
                      {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-icon btn-sm" onClick={() => openModal('transaction', tx)}>
                          <Edit2 size={13} />
                        </button>
                        <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteTransaction(tx.id)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="mobile-tx-list" style={{ display: 'none' }}>
        {filtered.slice(0, 50).map(tx => {
          const cat = getCategory(tx.category);
          const acc = getAccount(tx.account);
          return (
            <div key={tx.id} className="mobile-tx-card">
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${cat?.color || '#666'}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                {cat?.icon || '💳'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {tx.description}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  {cat?.name} · {tx.date} · {acc?.icon}{acc?.name}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: tx.type === 'income' ? 'var(--green)' : 'var(--red)' }}>
                  {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                </div>
                <div style={{ display: 'flex', gap: 4, marginTop: 4, justifyContent: 'flex-end' }}>
                  <button className="btn btn-secondary btn-icon" style={{ padding: 5 }} onClick={() => openModal('transaction', tx)}>
                    <Edit2 size={12} />
                  </button>
                  <button className="btn btn-danger btn-icon" style={{ padding: 5 }} onClick={() => deleteTransaction(tx.id)}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">Tidak ada transaksi</div>
            <div className="empty-desc">Coba ubah filter atau tambah transaksi baru</div>
          </div>
        )}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state table-desktop">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">Tidak ada transaksi</div>
          <div className="empty-desc">Coba ubah filter atau tambah transaksi baru</div>
        </div>
      )}
    </div>
  );
}
