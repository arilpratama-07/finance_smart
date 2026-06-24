import { useStore, fmt } from '../store';
import { Bell, Plus, Search, Download } from 'lucide-react';

const pageTitles = {
  dashboard: 'Dashboard',
  transactions: 'Transaksi',
  budgets: 'Anggaran',
  investments: 'Investasi',
  accounts: 'Multi-Akun',
  scheduled: 'Transaksi Rutin',
  reports: 'Laporan & Analitik',
  settings: 'Pengaturan',
};

export default function Topbar() {
  const { activePage, openModal } = useStore();
  const today = new Date().toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  const handleAdd = () => {
    if (activePage === 'transactions') openModal('transaction');
    else if (activePage === 'budgets') openModal('budget');
    else if (activePage === 'investments') openModal('investment');
    else if (activePage === 'accounts') openModal('account');
    else openModal('transaction');
  };

  return (
    <div className="topbar">
      <div>
        <div className="topbar-title">{pageTitles[activePage]}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{today}</div>
      </div>
      <div className="topbar-actions">
        {activePage === 'reports' && (
          <button className="btn btn-secondary btn-sm">
            <Download size={14} /> Export
          </button>
        )}
        {['transactions','budgets','investments','accounts','dashboard'].includes(activePage) && (
          <button className="btn btn-primary btn-sm" onClick={handleAdd}>
            <Plus size={14} />
            {activePage === 'budgets' ? 'Buat Anggaran' :
             activePage === 'investments' ? 'Tambah Investasi' :
             activePage === 'accounts' ? 'Tambah Akun' : 'Tambah Transaksi'}
          </button>
        )}
        <button className="btn btn-secondary btn-icon notif-btn">
          <Bell size={16} />
          <span className="notif-dot" />
        </button>
      </div>
    </div>
  );
}
