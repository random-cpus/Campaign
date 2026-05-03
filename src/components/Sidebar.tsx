import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Megaphone, ChevronLeft, ChevronRight, Zap, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const navItems = [
  { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard', end: true },
  { to: '/campaigns', icon: <Megaphone size={20} />, label: 'Campaigns' },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { logout, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (!window.confirm('Kya aap log out karna chahte hain?')) return;
    setLoggingOut(true);
    try {
      await logout();
      navigate('/login');
      showToast('Successfully logged out.', 'info');
    } catch {
      showToast('Logout fail hua. Dobara try karein.', 'error');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-icon"><Zap size={20} /></div>
          {!collapsed && <span className="brand-name">Resilience</span>}
        </div>
        <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && user && (
          <div className="sidebar-version" style={{ marginBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <span title={user.email}>{user.email}</span>
          </div>
        )}
        {!collapsed && (
          <div className="sidebar-version">
            <span>Campaign Hub</span>
            <span>v2.0</span>
          </div>
        )}
        <button
          className="nav-item"
          onClick={handleLogout}
          disabled={loggingOut}
          style={{ width: '100%', marginTop: '0.5rem', color: 'var(--danger-color)', cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left' }}
          title="Log out"
        >
          <span className="nav-icon"><LogOut size={20} /></span>
          {!collapsed && <span className="nav-label">{loggingOut ? 'Logging out…' : 'Log Out'}</span>}
        </button>
      </div>
    </aside>
  );
};
