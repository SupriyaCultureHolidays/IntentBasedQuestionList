import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigationItems = [
    {
      path: '/admin',
      icon: '📊',
      label: 'Dashboard',
      description: 'Overview & Analytics'
    },
    {
      path: '/reports',
      icon: '📋',
      label: 'Detailed Reports',
      description: 'Data Analysis & Export'
    }
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={{
        ...styles.sidebar,
        width: sidebarCollapsed ? '80px' : '280px'
      }} className="admin-sidebar">
        {/* Logo/Brand */}
        <div style={styles.brand}>
          <div style={styles.brandIcon}>🏢</div>
          {!sidebarCollapsed && (
            <div style={styles.brandText}>
              <h2 style={styles.brandTitle}>Culture Holidays</h2>
              <p style={styles.brandSubtitle}>Admin Panel</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={styles.nav}>
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              style={{
                ...styles.navItem,
                ...(isActive(item.path) ? styles.navItemActive : {})
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {!sidebarCollapsed && (
                <div style={styles.navContent}>
                  <span style={styles.navLabel}>{item.label}</span>
                  <span style={styles.navDescription}>{item.description}</span>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div style={styles.userSection}>
          {!sidebarCollapsed && (
            <div style={styles.userInfo}>
              <div style={styles.userAvatar}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={styles.userDetails}>
                <span style={styles.userName}>{user?.name}</span>
                <span style={styles.userRole}>Administrator</span>
              </div>
            </div>
          )}
          <button onClick={logout} style={styles.logoutBtn}>
            {sidebarCollapsed ? '🚪' : 'Logout'}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={styles.collapseBtn}
        >
          {sidebarCollapsed ? '→' : '←'}
        </button>
      </aside>

      {/* Main Content */}
      <main style={{
        ...styles.main,
        marginLeft: sidebarCollapsed ? '80px' : '280px'
      }} className="admin-main">
        {children}
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  sidebar: {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    background: 'linear-gradient(180deg, #1f2937 0%, #111827 100%)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s ease',
    zIndex: 1000,
    boxShadow: '4px 0 20px rgba(0,0,0,0.15)'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    padding: '24px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    gap: '12px'
  },
  brandIcon: {
    fontSize: '28px',
    minWidth: '40px',
    textAlign: 'center'
  },
  brandText: {
    flex: 1
  },
  brandTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '700',
    letterSpacing: '-0.3px',
    color: 'white'
  },
  brandSubtitle: {
    margin: '2px 0 0',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500'
  },
  nav: {
    flex: 1,
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.8)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    gap: '12px',
    textAlign: 'left',
    borderRadius: '0 25px 25px 0',
    margin: '0 0 0 0'
  },
  navItemActive: {
    background: 'linear-gradient(90deg, rgba(102,126,234,0.2) 0%, rgba(102,126,234,0.1) 100%)',
    color: 'white',
    borderLeft: '4px solid #667eea'
  },
  navIcon: {
    fontSize: '20px',
    minWidth: '24px',
    textAlign: 'center'
  },
  navContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  navLabel: {
    fontSize: '15px',
    fontWeight: '600',
    letterSpacing: '-0.2px'
  },
  navDescription: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '400'
  },
  userSection: {
    padding: '20px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '700',
    color: 'white'
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'white'
  },
  userRole: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500'
  },
  logoutBtn: {
    padding: '10px 16px',
    background: 'rgba(239,68,68,0.2)',
    color: '#fca5a5',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s ease'
  },
  collapseBtn: {
    position: 'absolute',
    right: '-12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#667eea',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    transition: 'all 0.2s ease'
  },
  main: {
    flex: 1,
    transition: 'margin-left 0.3s ease',
    minHeight: '100vh'
  }
};

export default AdminLayout;