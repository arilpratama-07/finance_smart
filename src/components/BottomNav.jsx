import { useStore } from '../store';
import {
  LayoutDashboard, Receipt, PiggyBank, TrendingUp,
  FileBarChart, Plus
} from 'lucide-react';

const navItems = [
  { page: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { page: 'transactions', label: 'Transaksi', icon: Receipt },
  null, // center FAB slot
  { page: 'budgets', label: 'Anggaran', icon: PiggyBank },
  { page: 'reports', label: 'Laporan', icon: FileBarChart },
];

export default function BottomNav() {
  const { activePage, setPage, openModal } = useStore();

  const handleAdd = () => {
    openModal('transaction');
  };

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Navigasi bawah">
      <div className="bottom-nav-inner">
        {navItems.map((item, i) => {
          if (item === null) {
            return (
              <button
                key="fab-center"
                className="bnav-center-btn"
                onClick={handleAdd}
                aria-label="Tambah transaksi"
              >
                <Plus size={26} />
              </button>
            );
          }
          const Icon = item.icon;
          const isActive = activePage === item.page;
          return (
            <button
              key={item.page}
              className={`bnav-item ${isActive ? 'active' : ''}`}
              onClick={() => setPage(item.page)}
              aria-label={item.label}
            >
              <Icon />
              <span className="bnav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
