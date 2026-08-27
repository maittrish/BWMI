import { useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';

function Header() {
  const navigate = useNavigate();

  return (
    <header className="header glass-strong">
      <div className="header-content" onClick={() => navigate('/')}>
        <span className="header-logo">🤝</span>
        <div>
          <h1 className="header-title">PF Sathi</h1>
          <p className="header-subtitle">Your PF Claims Assistant</p>
        </div>
      </div>
    </header>
  );
}

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/dashboard', icon: '📋', label: 'Claims' },
    { path: '/chat', icon: '💬', label: 'Chat' },
  ];

  return (
    <nav className="bottom-nav glass-strong">
      {tabs.map(tab => (
        <button
          key={tab.path}
          className={`nav-tab ${location.pathname === tab.path ? 'active' : ''}`}
          onClick={() => navigate(tab.path)}
          aria-label={tab.label}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
          {location.pathname === tab.path && <span className="nav-indicator" />}
        </button>
      ))}
    </nav>
  );
}

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="main-content">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
