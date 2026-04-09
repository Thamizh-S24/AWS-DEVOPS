import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, Users, UserCog, Activity,
    Settings, LogOut, Package, ClipboardList,
    MapPin, Bell, Search, User, FlaskConical,
    ShoppingBag, Shield, Monitor, Database,
    PhoneCall, Wrench, Heart, Building, Calendar, FileText,
    Ambulance, Pill, PieChart, ClipboardCheck, History, UserCircle,
    Layout, Map, CheckCircle, Clock, Plus, Beaker, Microscope
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useSearch } from '../context/SearchContext';

const NavItem = ({ icon, label, to, active }) => (
    <Link to={to} className={`nav-item-clinical ${active ? 'active' : ''}`}>
        {icon}
        <span style={{ fontSize: '0.9rem' }}>{label}</span>
    </Link>
);

const DashboardLayout = ({ children, role }) => {
    const { logout, user } = useAuth();
    const { searchTerm, setSearchTerm } = useSearch();
    const location = useLocation();
    const navigate = useNavigate();
    const pathRole = role === 'radiologist' ? 'radiology' : role;
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [unreadCount, setUnreadCount] = React.useState(0);
    const [lastNotif, setLastNotif] = React.useState(null);

    React.useEffect(() => {
        if (!user) return;

        const fetchInitial = async () => {
            try {
                const res = await api.get(`/notification/my/${user.username}`);
                const notifs = Array.isArray(res.data) ? res.data : [];
                setUnreadCount(notifs.filter(n => !n.read).length);
            } catch (err) { console.error("Initial load failed"); }
        };
        fetchInitial();

        let ws;
        try {
            const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${wsProtocol}//localhost:8000/api/notification/ws/notifications/${user.username}`;
            ws = new WebSocket(wsUrl);

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setUnreadCount(prev => prev + 1);
                setLastNotif(data);
                setTimeout(() => setLastNotif(null), 5000);
            };
        } catch (e) {
            console.error("Critical: Telemetry sync failure", e);
        }

        return () => ws?.close();
    }, [user]);

    const menuItems = {
        admin: [
            { icon: <LayoutDashboard size={20} />, label: 'Hospital Overview', to: '/admin-dashboard' },
            { icon: <Users size={20} />, label: 'Staff Directory', to: '/admin/registry' },
            { icon: <ClipboardList size={20} />, label: 'Attendance Logs', to: '/admin/attendance' },
            { icon: <Building size={20} />, label: 'Building Manager', to: '/admin/infrastructure' },
            { icon: <Pill size={20} />, label: 'Medicine Stock', to: '/admin/pharmacy' },
            { icon: <Bell size={20} />, label: 'Notification Center', to: '/admin/notifications' },
            { icon: <Settings size={20} />, label: 'System Settings', to: '/admin/microservices' },
            { icon: <PieChart size={20} />, label: 'Hospital Reports', to: '/admin/analytics' },
            { icon: <History size={20} />, label: 'Activity Logs', to: '/admin/audit' },
            { icon: <Ambulance size={20} />, label: 'Ambulance Hub', to: '/admin/ambulance' },
            { icon: <Activity size={20} />, label: 'Emergency Center', to: '/admin/emergency' },
            { icon: <ClipboardCheck size={20} />, label: 'Leave Approvals', to: '/admin/leaves' },
            { icon: <UserCircle size={20} />, label: 'Profile Settings', to: '/admin/profile' },
        ],
        doctor: [
            { icon: <LayoutDashboard size={20} />, label: 'Visualization Hub', to: '/doctor-dashboard' },
            { icon: <ClipboardList size={20} />, label: 'Clinical Queue', to: '/doctor/consultations' },
            { icon: <Database size={20} />, label: 'EMR Records', to: '/doctor/emr' },
            { icon: <Pill size={20} />, label: 'e-Prescription', to: '/doctor/prescriptions' },
            { icon: <FileText size={20} />, label: 'Session Notes', to: '/doctor/session' },
            { icon: <Activity size={20} />, label: 'Diagnostic Lab', to: '/doctor/diagnostics' },
            { icon: <Building size={20} />, label: 'Wards & Admit', to: '/doctor/admissions' },
            { icon: <Clock size={20} />, label: 'Duty Timeline', to: '/doctor/attendance' },
        ],
        patient: [
            { icon: <LayoutDashboard size={20} />, label: 'Patient Portal', to: '/patient-dashboard' },
            { icon: <Heart size={20} />, label: 'My Health Record', to: '/patient-dashboard' },
        ],
        nurse: [
            { icon: <LayoutDashboard size={20} />, label: 'Nursing Station', to: '/nurse-dashboard' },
            { icon: <Map size={20} />, label: 'Ward Occupancy', to: '/nurse/wards' },
            { icon: <Activity size={20} />, label: 'Vitals Entry', to: '/nurse/vitals' },
            { icon: <FileText size={20} />, label: 'Clinical Context', to: '/nurse/summary' },
            { icon: <Settings size={20} />, label: 'Ward Management', to: '/nurse/crud' },
        ],
        pharmacist: [
            { icon: <LayoutDashboard size={20} />, label: 'Pharmacy Hub', to: '/pharmacist-dashboard' },
            { icon: <Package size={20} />, label: 'Stocks Management', to: '/pharmacist/inventory' },
            { icon: <ClipboardList size={20} />, label: 'Order Queue', to: '/pharmacist/prescriptions' },
            { icon: <Bell size={20} />, label: 'Alert Center', to: '/pharmacist/notifications' },
            { icon: <UserCircle size={20} />, label: 'Profile Settings', to: '/pharmacist/profile' },
        ],
        lab_tech: [
            { icon: <LayoutDashboard size={20} />, label: 'Lab Overview', to: '/lab-tech-dashboard' },
            { icon: <ClipboardList size={20} />, label: 'Order Queue', to: '/lab/queue' },
            { icon: <Microscope size={20} />, label: 'Specimen Terminal', to: '/lab/terminal' },
            { icon: <FileText size={20} />, label: 'Result Portal', to: '/lab/reports' },
            { icon: <Beaker size={20} />, label: 'Pathology Resources', to: '/lab/inventory' },
        ],
        receptionist: [
            { icon: <LayoutDashboard size={20} />, label: 'Reception Hub', to: '/receptionist-dashboard' },
            { icon: <Users size={20} />, label: 'Patient Registry', to: '/receptionist/registry' },
            { icon: <Activity size={20} />, label: 'Admission Queue', to: '/receptionist/admissions' },
            { icon: <PhoneCall size={20} />, label: 'Emergency Triage', to: '/receptionist/emergency' },
            { icon: <ClipboardList size={20} />, label: 'Billing & Settle', to: '/receptionist/billing' },
        ],
        maintenance: [
            { icon: <LayoutDashboard size={20} />, label: 'Ops Command Hub', to: '/maintenance-dashboard' },
            { icon: <ClipboardList size={20} />, label: 'Service Desk Queue', to: '/maintenance/tickets' },
            { icon: <Users size={20} />, label: 'Workforce Hub', to: '/maintenance/staff' },
            { icon: <Beaker size={20} />, label: 'Biomedical Engineering', to: '/maintenance/biomed' },
            { icon: <Database size={20} />, label: 'Infrastructure Registry', to: '/maintenance/assets' },
            { icon: <Activity size={20} />, label: 'Environment Monitor', to: '/maintenance/facility' },
            { icon: <Shield size={20} />, label: 'Safety & Security', to: '/maintenance/safety' },
            { icon: <Bell size={20} />, label: 'Incident Alerts', to: '/maintenance/notifications' },
            { icon: <UserCircle size={20} />, label: 'Personnel Portal', to: '/maintenance/profile' },
        ],
        radiologist: [
            { icon: <LayoutDashboard size={20} />, label: 'Radiology Hub', to: '/radiology-dashboard' },
            { icon: <ClipboardList size={20} />, label: 'Imaging Worklist', to: '/radiology/worklist' },
            { icon: <Monitor size={20} />, label: 'Procedure Terminal', to: '/radiology/terminal' },
            { icon: <FileText size={20} />, label: 'Result Archive', to: '/radiology/archive' },
            { icon: <Database size={20} />, label: 'Resource Registry', to: '/radiology/inventory' },
            { icon: <Bell size={20} />, label: 'Alert Hub', to: '/radiology/notifications' },
            { icon: <UserCircle size={20} />, label: 'Clinical Profile', to: '/radiology/profile' },
        ]
    };

    return (
        <div className="dashboard-white-root medical-grid-bg" style={{ display: 'flex', position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}>
            {/* Overlay for mobile sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mobile-only"
                        onClick={() => setIsSidebarOpen(false)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 95
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Unique Clinical Sidebar Rail */}
            <aside className={`clinical-sidebar-rail ${isSidebarOpen ? 'open' : ''}`}>
                <div style={{ padding: '0 2rem 2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #0ea5e9, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '1.2rem', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)' }}>H</div>
                    <div>
                        <div style={{ color: 'white', fontWeight: 950, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>Healix</div>
                        <div style={{ color: '#64748b', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Clinical Suite</div>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '0 0.5rem' }}>
                    {(menuItems?.[role] || []).map((item, idx) => (
                        <NavItem
                            key={idx}
                            icon={item.icon}
                            label={item.label}
                            to={item.to}
                            active={location.pathname === item.to}
                        />
                    ))}
                </div>

                <div style={{ marginTop: 'auto', padding: '1.5rem 1rem 0' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '20px', padding: '1.2rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <UserCircle size={18} />
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                                <div style={{ color: 'white', fontWeight: 800, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.username || 'Medical Staff'}</div>
                                <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>{role}</div>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
                        >
                            <LogOut size={16} /> SIGN OUT
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="dashboard-main-content">
                <div className="dashboard-container-inner">
                    <header className="responsive-header" style={{ height: 'auto', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                            <button className="mobile-only" onClick={() => setIsSidebarOpen(true)} style={{ background: '#f1f5f9', border: 'none', padding: '0.6rem', borderRadius: '10px', color: '#0ea5e9', cursor: 'pointer' }}>
                                <Layout size={20} />
                            </button>
                            <div style={{ position: 'relative', maxWidth: '400px', width: '100%' }}>
                                <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
                                <input
                                    placeholder="Search database..."
                                    value={searchTerm || ''}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ padding: '0.8rem 1.25rem 0.8rem 3.5rem', width: '100%', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.85rem', color: '#1e293b', outline: 'none' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div className="header-icon-container" onClick={() => navigate(`/${pathRole}/notifications`)} style={{ cursor: 'pointer', width: '44px', height: '44px', borderRadius: '14px', background: 'white', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Bell size={20} color="#64748b" />
                                {unreadCount > 0 && (
                                    <span style={{ position: 'absolute', top: '10px', right: '10px', width: '12px', height: '12px', background: '#ec4899', borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6px', color: 'white', fontWeight: 900 }}>{unreadCount}</span>
                                )}
                            </div>
                            <div className="header-icon-container" onClick={() => navigate(`/${pathRole}/profile`)} style={{ cursor: 'pointer', width: '44px', height: '44px', borderRadius: '14px', background: 'white', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <UserCircle size={20} color="#64748b" />
                            </div>
                        </div>
                    </header>

                    <div className="dashboard-workspace" style={{ flex: 1, overflowY: 'auto' }}>
                        {children}
                    </div>

                    <AnimatePresence>
                        {lastNotif && (
                            <motion.div
                                initial={{ opacity: 0, x: 50, y: 50 }}
                                animate={{ opacity: 1, x: 0, y: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                onClick={() => navigate(`/${pathRole}/notifications`)}
                                style={{ position: 'fixed', bottom: '2rem', right: '2rem', padding: '1.5rem', background: 'white', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', zIndex: 1000, maxWidth: '350px', cursor: 'pointer', display: 'flex', gap: '1rem', border: '1px solid rgba(14, 165, 233, 0.1)' }}
                            >
                                <div style={{ padding: '0.8rem', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', borderRadius: '12px', height: 'fit-content' }}>
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 950, color: '#0f172a', fontSize: '0.9rem', marginBottom: '0.3rem' }}>{lastNotif.subject}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, lineHeight: 1.4 }}>{lastNotif.message.slice(0, 80)}...</div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
