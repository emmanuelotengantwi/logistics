import React from 'react';
import { Outlet, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, MapPin, Package, ClipboardList, Map, 
    CreditCard, FileText, Wallet, Calculator, MessageSquare, 
    Truck, Clock, User, LogOut, Settings, Bell, Search, ChevronRight 
} from 'lucide-react';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    if (!userInfo) {
        return <Navigate to="/login" />
    }

    const isActive = (path) => location.pathname === path ? 'nav-item active' : 'nav-item';

    return (
        <div className="app-layout">
            <aside className="app-sidebar" style={{ width: '260px', padding: '1.5rem 0', overflowY: 'auto' }}>
                <div style={{ marginBottom: '2rem', padding: '0 1.5rem' }}>
                    <h1 className="heading-2" style={{ color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img src="/amooksco.jpeg" alt="Logo" style={{ height: '32px', borderRadius: '50%' }} />
                        AMOOKSCO
                    </h1>
                </div>

                <nav style={{ flex: 1 }}>
                    <div className="sidebar-group-label">Services</div>
                    <Link to="/dashboard" className={isActive('/dashboard')}>
                        <LayoutDashboard size={18} /> My Dashboard
                    </Link>
                    <Link to="/dashboard" className="nav-item">
                        <MapPin size={18} /> My AMOOKSCO address
                    </Link>
                    <Link to="/dashboard" className="nav-item">
                        <Package size={18} /> My Shipment
                    </Link>
                    <Link to="/dashboard" className="nav-item">
                        <ClipboardList size={18} /> My Packing List
                    </Link>
                    <Link to="/dashboard" className="nav-item">
                        <Map size={18} /> Track your Shipment
                    </Link>
                    <Link to="/dashboard" className="nav-item">
                        <CreditCard size={18} /> My Payments
                    </Link>
                    <Link to="/dashboard" className="nav-item">
                        <FileText size={18} /> My Invoices
                    </Link>
                    <Link to="/dashboard" className="nav-item">
                        <Wallet size={18} /> My Wallet
                    </Link>
                    <Link to="/dashboard" className="nav-item">
                        <Calculator size={18} /> CBM Calculator
                    </Link>
                    <Link to="/dashboard" className="nav-item">
                        <MessageSquare size={18} /> Lodge a Complaint
                    </Link>
                    <Link to="/dashboard" className="nav-item" style={{ justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <Truck size={18} /> Pick-ups
                        </div>
                        <ChevronRight size={16} />
                    </Link>

                    <div className="sidebar-group-label" style={{ marginTop: '2rem' }}>Reports</div>
                    <Link to="/dashboard" className="nav-item">
                        <Clock size={18} /> Top-Up history
                    </Link>
                    <Link to="/dashboard" className="nav-item">
                        <FileText size={18} /> Invoices Report
                    </Link>

                    {userInfo.role === 'Admin' && (
                        <>
                            <div className="sidebar-group-label" style={{ marginTop: '2rem' }}>Admin Tools</div>
                            <Link to="/dashboard/users" className={isActive('/dashboard/users')}>
                                <User size={18} /> Manage Users
                            </Link>
                            <Link to="/dashboard/settings" className={isActive('/dashboard/settings')}>
                                <Settings size={18} /> Configure Rates
                            </Link>
                        </>
                    )}
                </nav>
            </aside>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <header className="app-topbar">
                    <div>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <input type="text" placeholder="Search" className="topbar-search" style={{ paddingLeft: '2.5rem' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ position: 'relative', cursor: 'pointer' }}>
                            <Bell size={20} color="var(--text-secondary)" />
                            <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--accent-blue)', color: '#fff', fontSize: '10px', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>0</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={handleLogout} title="Click to Logout">
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={20} color="var(--text-secondary)" />
                            </div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{userInfo.name.split(' ')[0]}</div>
                            <LogOut size={16} color="var(--text-secondary)" />
                        </div>
                    </div>
                </header>
                
                <main className="app-main" style={{ padding: '2rem' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
