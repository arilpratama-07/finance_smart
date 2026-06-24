import { useStore } from '../store';
import {
  LayoutDashboard, Receipt, PiggyBank, TrendingUp,
  Wallet, RefreshCw, FileBarChart, Settings,
  LogOut, Shield, Plus
} from 'lucide-react';
import { fmt } from '../store';

const navItems = [
  { page: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'menu' },
  { page: 'transactions', label: 'Transaksi', icon: Receipt, section: 'menu' },
  { page: 'budgets', label: 'Anggaran', icon: PiggyBank, section: 'menu' },
  { page: 'investments', label: 'Investasi', icon: TrendingUp, section: 'menu' },
  { page: 'accounts', label: 'Multi-Akun', icon: Wallet, section: 'menu' },
  { page: 'scheduled', label: 'Transaksi Rutin', icon: RefreshCw, section: 'menu' },
  { page: 'reports', label: 'Laporan', icon: FileBarChart, section: 'laporan' },
  { page: 'settings', label: 'Pengaturan', icon: Settings, section: 'lainnya' },
];

const sections = [
  { key: 'menu', label: 'Menu Utama' },
  { key: 'laporan', label: 'Laporan' },
  { key: 'lainnya', label: 'Lainnya' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { activePage, setPage, accounts, logout, user } = useStore();
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  const navigate = (page) => {
    setPage(page);
    onClose?.();
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">F</div>
        <div>
          <div className="logo-text">FinanSmart</div>
          <div className="logo-version">v2.4.0 stable</div>
        </div>
      </div>

      {/* Balance summary */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Saldo</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: totalBalance >= 0 ? 'var(--green)' : 'var(--red)' }}>
          {fmt(totalBalance)}
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {sections.map(sec => (
          <div key={sec.key}>
            <div className="nav-section-label">{sec.label}</div>
            {navItems.filter(n => n.section === sec.key).map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.page}
                  className={`nav-item ${activePage === item.page ? 'active' : ''}`}
                  onClick={() => navigate(item.page)}
                >
                  <Icon />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', marginBottom: 8 }}>
          <Shield size={13} color="var(--green)" />
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>End-to-End Encrypted</span>
        </div>
        <div className="user-profile">
          <div className="user-avatar">{user?.name ? user.name[0].toUpperCase() : 'U'}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-email">{user?.email || 'user@example.com'}</div>
          </div>
          <LogOut onClick={logout} size={15} color="var(--text-muted)" style={{ cursor: 'pointer', flexShrink: 0 }} />
        </div>
      </div>
    </aside>
  );
}
