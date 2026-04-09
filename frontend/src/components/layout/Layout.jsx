import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { 
	    LayoutDashboard, MapPin, Package, ClipboardList, Map, 
	    CreditCard, FileText, Wallet, Calculator, MessageSquare, 
	    Truck, Clock, User, LogOut, Settings, Bell, Search, ChevronRight 
} from 'lucide-react';
import api from '../../api/axios';

const Layout = () => {
	    const navigate = useNavigate();
	    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
	    const isAdmin = userInfo?.role === 'Admin';
	    const [unreadCount, setUnreadCount] = useState(0);
	    const [searchValue, setSearchValue] = useState('');

		    const handleLogout = () => {
		        localStorage.removeItem('userInfo');
		        navigate('/login');
		    };

		    const customerNav = useMemo(() => ([
	        { to: '/dashboard', end: true, icon: <LayoutDashboard size={18} />, label: 'My Dashboard' },
	        { to: '/dashboard/address', icon: <MapPin size={18} />, label: 'My AMOOKSCO address' },
	        { to: '/dashboard/shipments', icon: <Package size={18} />, label: 'My Shipment' },
	        { to: '/dashboard/packing-list', icon: <ClipboardList size={18} />, label: 'My Packing List' },
	        { to: '/dashboard/track', icon: <Map size={18} />, label: 'Track your Shipment' },
	        { to: '/dashboard/payments', icon: <CreditCard size={18} />, label: 'My Payments' },
	        { to: '/dashboard/invoices', icon: <FileText size={18} />, label: 'My Invoices' },
	        { to: '/dashboard/wallet', icon: <Wallet size={18} />, label: 'My Wallet' },
	        { to: '/dashboard/cbm', icon: <Calculator size={18} />, label: 'CBM Calculator' },
	        { to: '/dashboard/complaints', icon: <MessageSquare size={18} />, label: 'Lodge a Complaint' },
	        { to: '/dashboard/pickups', icon: <Truck size={18} />, label: 'Pick-ups', chevron: true },
	    ]), []);

	    const customerReports = useMemo(() => ([
	        { to: '/dashboard/topups', icon: <Clock size={18} />, label: 'Top-Up history' },
	        { to: '/dashboard/invoices-report', icon: <FileText size={18} />, label: 'Invoices Report' },
	    ]), []);

	    const adminNav = useMemo(() => ([
	        { to: '/dashboard', end: true, icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
	        { to: '/dashboard/users', icon: <User size={18} />, label: 'Manage Users' },
	        { to: '/dashboard/settings', icon: <Settings size={18} />, label: 'Configure Rates' },
	    ]), []);

		    useEffect(() => {
		        if (!userInfo) return;
		        let isMounted = true;
		        const fetchUnread = async () => {
		            try {
		                const { data } = await api.get('/notifications');
		                const count = Array.isArray(data) ? data.filter((n) => !n.read).length : 0;
		                if (isMounted) setUnreadCount(count);
		            } catch {
		                // keep UI usable even when backend isn't running
		            }
		        };
		        fetchUnread();
		        return () => {
		            isMounted = false;
		        };
		    }, [userInfo]);

		    if (!userInfo) {
		        return <Navigate to="/login" />
		    }

	    return (
	        <div className="app-layout">
	            <aside className="app-sidebar" style={{ width: '260px', padding: '1.5rem 0', overflowY: 'auto' }}>
	                <div style={{ marginBottom: '2rem', padding: '0 1.5rem' }}>
	                    <h1 style={{ color: 'var(--dark-blue)', display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0 }}>
	                        <img src="/amooksco.jpeg" alt="Logo" style={{ height: '32px', borderRadius: '50%' }} />
	                        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
	                            <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em' }}>AMOOKSCO</span>
	                            <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.18em', color: 'var(--accent-blue)' }}>LOGISTICS</span>
	                        </span>
	                    </h1>
	                </div>

	                <nav style={{ flex: 1 }}>
	                    {!isAdmin ? (
	                        <>
	                            <div className="sidebar-group-label">Services</div>
	                            {customerNav.map((item) => (
	                                <NavLink
	                                    key={item.to}
	                                    to={item.to}
	                                    end={item.end}
	                                    className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
	                                    style={item.chevron ? { justifyContent: 'space-between' } : undefined}
	                                >
	                                    {item.chevron ? (
	                                        <>
	                                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
	                                                {item.icon} {item.label}
	                                            </div>
	                                            <ChevronRight size={16} />
	                                        </>
	                                    ) : (
	                                        <>
	                                            {item.icon} {item.label}
	                                        </>
	                                    )}
	                                </NavLink>
	                            ))}

	                            <div className="sidebar-group-label" style={{ marginTop: '2rem' }}>Reports</div>
	                            {customerReports.map((item) => (
	                                <NavLink
	                                    key={item.to}
	                                    to={item.to}
	                                    className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
	                                >
	                                    {item.icon} {item.label}
	                                </NavLink>
	                            ))}
	                        </>
	                    ) : (
	                        <>
	                            <div className="sidebar-group-label">Admin</div>
	                            {adminNav.map((item) => (
	                                <NavLink
	                                    key={item.to}
	                                    to={item.to}
	                                    end={item.end}
	                                    className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
	                                >
	                                    {item.icon} {item.label}
	                                </NavLink>
	                            ))}
	                        </>
	                    )}
	                </nav>
	            </aside>
            
	            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
	                <header className="app-topbar">
	                    <div>
	                        <div style={{ position: 'relative' }}>
	                            <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
	                            <input
	                                type="text"
	                                placeholder={isAdmin ? 'Search' : 'Search shipments…'}
	                                className="topbar-search"
	                                style={{ paddingLeft: '2.5rem' }}
	                                value={searchValue}
	                                onChange={(e) => setSearchValue(e.target.value)}
	                                onKeyDown={(e) => {
	                                    if (e.key === 'Enter' && !isAdmin) {
	                                        const q = searchValue.trim();
	                                        navigate(q ? `/dashboard/shipments?q=${encodeURIComponent(q)}` : '/dashboard/shipments');
	                                    }
	                                }}
	                            />
	                        </div>
	                    </div>
	                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
	                        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate('/dashboard/notifications')} title="Notifications">
	                            <Bell size={20} color="var(--text-secondary)" />
	                            <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--accent-blue)', color: '#fff', fontSize: '10px', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
	                                {unreadCount}
	                            </span>
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
