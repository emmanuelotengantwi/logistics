import React from 'react';
import { Outlet, Link, useNavigate, Navigate } from 'react-router-dom';
import { Package, User, LogOut, FileText, Settings } from 'lucide-react';

const Layout = () => {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    if (!userInfo) {
        return <Navigate to="/login" />
    }

    return (
        <div className="app-layout">
            <aside className="app-sidebar">
                <div style={{ marginBottom: '2rem' }}>
                    <h1 className="heading-2">AMOOKSCO</h1>
                    <span className="badge badge-success" style={{ marginTop: '0.5rem' }}>{userInfo.role}</span>
                </div>

                <nav style={{ flex: 1 }}>
                    <Link to="/dashboard" className="nav-item active">
                        <Package size={20} />
                        Shipments
                    </Link>
                    {userInfo.role === 'Admin' && (
                        <>
                            <Link to="/dashboard/users" className="nav-item">
                                <User size={20} />
                                Users
                            </Link>
                            <Link to="/dashboard/settings" className="nav-item">
                                <Settings size={20} />
                                Rates
                            </Link>
                        </>
                    )}
                    <Link to="/dashboard/invoices" className="nav-item">
                        <FileText size={20} />
                        Invoices
                    </Link>
                </nav>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: 'auto' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <div className="text-sm">User</div>
                        <div style={{ fontWeight: '500' }}>{userInfo.name}</div>
                        <div className="text-sm text-dim">{userInfo.shippingMark || 'N/A'}</div>
                    </div>
                    <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>
            <main className="app-main">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
