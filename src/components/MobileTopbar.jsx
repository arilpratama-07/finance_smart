import { useStore } from '../store';
import { Menu, Bell, Plus } from 'lucide-react';

const pageTitles = {
  dashboard: 'Dashboard',
  transactions: 'Transaksi',
  budgets: 'Anggaran',
  investments: 'Investasi',
  accounts: 'Multi-Akun',
  scheduled: 'Rutin',
  reports: 'Laporan',
  settings: 'Pengaturan',
};

export default function MobileTopbar({ onHamburger }) {
  const { activePage, openModal } = useStore();

  return (
    <div className="mobile-topbar">
      <div className="mobile-topbar-left">
        <button className="hamburger" onClick={onHamburger} aria-label="Buka menu">
          <Menu size={20} />
        </button>
        <div className="mobile-page-title">{pageTitles[activePage] || 'FinanSmart'}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          className="btn btn-secondary btn-icon"
          style={{ position: 'relative' }}
          aria-label="Notifikasi"
        >
          <Bell size={18} />
          <span className="notif-dot" />
        </button>
      </div>
    </div>
  );
}
