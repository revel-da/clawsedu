/* ═══════════════════════════════════════════════════════
   ClawsEdu — Lumina Campus Layout (Floating Dock)
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores';

/* ────── Icons (Feather / Custom SVG) ────── */
const Icons = {
    Home: (props: any) => <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
    Grid: (props: any) => <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
    Users: (props: any) => <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    MessageCircle: (props: any) => <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>,
    Settings: (props: any) => <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
    LogOut: (props: any) => <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
    Plus: (props: any) => <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Bell: (props: any) => <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
    ChevronLeft: (props: any) => <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>,
    ChevronRight: (props: any) => <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
};

const fetchJson = async <T,>(url: string): Promise<T> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api${url}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    if (!res.ok) return [] as T;
    return res.json();
};

export default function Layout() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuthStore();
    
    const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebar_collapsed') === 'true');
    const [theme, setTheme] = useState<'dark' | 'light'>('light');

    // Persist sidebar state
    useEffect(() => {
        localStorage.setItem('sidebar_collapsed', String(collapsed));
    }, [collapsed]);

    // Theme effect
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', icon: Icons.Home, label: t('nav.dashboard', 'Desk') },
        { path: '/plaza', icon: Icons.Grid, label: t('nav.plaza', 'Plaza') },
        { path: '/interactive', icon: Icons.MessageCircle, label: t('nav.interactive', 'Chat') },
        { path: '/oversight', icon: Icons.Users, label: t('nav.oversight', 'Team') },
    ];

    return (
        <div className="lumina-layout">
            <style>{`
                .lumina-layout {
                    display: flex;
                    height: 100vh;
                    background: linear-gradient(135deg, #F8FAFC 0%, #E0E7FF 100%);
                    position: relative;
                    overflow: hidden;
                }
                
                /* Animated Mesh Background (Neo-Campus Style) */
                .aurora-bg {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                    pointer-events: none;
                }
                .aurora-bg::before {
                    content: '';
                    position: absolute;
                    top: -20%; left: -10%; width: 60%; height: 60%;
                    background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(255,255,255,0) 70%);
                    border-radius: 50%;
                    filter: blur(60px);
                    animation: float 10s ease-in-out infinite;
                }
                .aurora-bg::after {
                    content: '';
                    position: absolute;
                    bottom: -20%; right: -10%; width: 70%; height: 70%;
                    background: radial-gradient(circle, rgba(236,72,153,0.1) 0%, rgba(255,255,255,0) 70%);
                    border-radius: 50%;
                    filter: blur(60px);
                    animation: float 15s ease-in-out infinite reverse;
                }
                @keyframes float { 0% { transform: translate(0,0); } 50% { transform: translate(20px, -20px); } 100% { transform: translate(0,0); } }

                /* Floating Dock Sidebar */
                .dock-sidebar {
                    position: relative;
                    z-index: 100;
                    display: flex;
                    flex-direction: column;
                    width: ${collapsed ? '88px' : '260px'};
                    margin: 16px;
                    border-radius: 24px;
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    box-shadow: 
                        0 20px 50px -12px rgba(0, 0, 0, 0.1),
                        0 0 0 1px rgba(255, 255, 255, 0.5) inset;
                    transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    overflow: hidden;
                }

                .dock-logo {
                    height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: ${collapsed ? 'center' : 'flex-start'};
                    padding: 0 ${collapsed ? '0' : '24px'};
                    cursor: pointer;
                }

                .dock-brand-mark {
                    width: 42px;
                    height: 42px;
                    background: white;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                    flex-shrink: 0;
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    position: relative;
                }

                .dock-brand-mark .graduation-cap {
                    position: absolute;
                    top: -10px;
                    right: -8px;
                    font-size: 20px;
                    transform: rotate(15deg);
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                }

                .dock-brand-text {
                    margin-left: 12px;
                    font-family: 'Outfit', sans-serif;
                    font-weight: 800;
                    font-size: 22px;
                    background: linear-gradient(135deg, #1E293B 0%, #475569 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    white-space: nowrap;
                    opacity: ${collapsed ? 0 : 1};
                    transition: opacity 0.2s;
                    letter-spacing: -0.03em;
                }

                .dock-menu {
                    flex: 1;
                    padding: 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .dock-item {
                    display: flex;
                    align-items: center;
                    padding: 12px 16px;
                    border-radius: 16px;
                    color: #64748B;
                    text-decoration: none;
                    transition: all 0.2s;
                    height: 48px;
                    white-space: nowrap;
                    position: relative;
                }
                
                .dock-item:hover {
                    background: rgba(99, 102, 241, 0.05);
                    color: #1E293B;
                    transform: translateX(4px);
                }

                .dock-item.active {
                    background: rgba(99, 102, 241, 0.1);
                    color: #6366F1;
                    font-weight: 600;
                }
                
                .dock-item.active::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 12px;
                    bottom: 12px;
                    width: 4px;
                    background: #6366F1;
                    border-radius: 0 4px 4px 0;
                    display: ${collapsed ? 'none' : 'block'};
                }

                .dock-icon {
                    min-width: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .dock-label {
                    margin-left: 12px;
                    font-weight: 600;
                    font-size: 15px;
                    opacity: ${collapsed ? 0 : 1};
                    transition: opacity 0.2s;
                }

                .dock-footer {
                    padding: 16px;
                    border-top: 1px solid rgba(0,0,0,0.06);
                }

                .user-pill {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 8px;
                    border-radius: 12px;
                    transition: background 0.2s;
                    cursor: pointer;
                }
                .user-pill:hover {
                    background: rgba(99, 102, 241, 0.05);
                }

                .avatar-circle {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #6366F1, #8B5CF6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    color: white;
                    font-size: 14px;
                    flex-shrink: 0;
                }

                .main-canvas {
                    flex: 1;
                    position: relative;
                    z-index: 10;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                .content-scrollable {
                    flex: 1;
                    overflow-y: auto;
                    padding: 16px;
                }

                /* Collapse Toggle */
                .collapse-btn {
                    position: absolute;
                    right: -12px;
                    top: 50%;
                    width: 24px;
                    height: 24px;
                    background: #FFFFFF;
                    border: 1px solid #E2E8F0;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #64748B;
                    cursor: pointer;
                    z-index: 101;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .collapse-btn:hover {
                    background: #F8FAFC;
                    color: #1E293B;
                }
            `}</style>

            <div className="aurora-bg" />

            <aside className="dock-sidebar">
                <div className="dock-logo" onClick={() => setCollapsed(!collapsed)}>
                    <div className="dock-brand-mark">
                         <span>🦞</span>
                         <span className="graduation-cap">🎓</span>
                     </div>
                     <span className="dock-brand-text">Clawith</span>
                </div>

                <nav className="dock-menu">
                    {navItems.map((item) => (
                        <NavLink 
                            key={item.path} 
                            to={item.path}
                            className={({ isActive }) => `dock-item ${isActive ? 'active' : ''}`}
                            title={collapsed ? item.label : ''}
                        >
                            <span className="dock-icon"><item.icon /></span>
                            <span className="dock-label">{item.label}</span>
                        </NavLink>
                    ))}

                    <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '8px 16px' }} />

                    <NavLink 
                        to="/agents/new" 
                        className={({ isActive }) => `dock-item ${isActive ? 'active' : ''}`}
                    >
                        <span className="dock-icon"><Icons.Plus /></span>
                        <span className="dock-label">{t('nav.newAgent', 'Create')}</span>
                    </NavLink>
                </nav>

                <div className="dock-footer">
                    <div className="user-pill" onClick={handleLogout} title="Click to Logout">
                        <div className="avatar-circle">
                            {user?.display_name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        {!collapsed && (
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <div style={{ fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                    {user?.display_name}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                                    {user?.role === 'platform_admin' ? 'Admin' : 'Student'}
                                </div>
                            </div>
                        )}
                        {!collapsed && <Icons.LogOut style={{ width: 16, height: 16, color: 'var(--text-tertiary)' }} />}
                    </div>
                </div>

                <button 
                    className="collapse-btn" 
                    onClick={() => setCollapsed(!collapsed)}
                    style={{ right: '12px', top: '24px', position: 'absolute', display: 'none' }} /* Hidden for now, click logo to toggle? Or just use state */
                >
                    {collapsed ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}
                </button>
            </aside>

            <main className="main-canvas">
                <div className="content-scrollable">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
