import { useState, useEffect } from 'react';
import { useStore } from './store';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import MobileTopbar from './components/MobileTopbar';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Investments from './pages/Investments';
import Accounts from './pages/Accounts';
import Scheduled from './pages/Scheduled';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const pages = {
  dashboard: Dashboard,
  transactions: Transactions,
  budgets: Budgets,
  investments: Investments,
  accounts: Accounts,
  scheduled: Scheduled,
  reports: Reports,
  settings: Settings,
};

export default function App() {
  const { activePage, theme } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const Page = pages[activePage] || Dashboard;

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : '';
  }, [theme]);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen(v => !v);

  return (
    <div className="app-layout">
      {/* Sidebar overlay (mobile) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <main className="main-content">
        {/* Desktop topbar */}
        <Topbar />

        {/* Mobile topbar */}
        <MobileTopbar onHamburger={toggleSidebar} />

        {/* Page content */}
        <Page />
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
