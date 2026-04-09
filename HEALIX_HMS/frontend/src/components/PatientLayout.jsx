import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Home, Calendar, FileText, Brain, HeartPulse, 
    Stethoscope, Pill, Activity, UserCircle, 
    CreditCard, Apple, Dumbbell, ChevronDown, Bell, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NavDropdown = ({ label, icon, items, currentPath, navigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isActive = items.some(i => currentPath === i.to);

    return (
        <div 
            style={{ position: 'relative' }} 
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div style={{ 
                display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1.2rem', 
                borderRadius: '14px', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem',
                color: isActive ? '#1e40af' : '#64748b',
                background: isActive ? 'rgba(30, 58, 138, 0.05)' : 'transparent',
                transition: 'all 0.2s'
            }}>
                {icon} {label} <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        style={{ 
                            position: 'absolute', top: '100%', left: 0, marginTop: '0.5rem',
                            minWidth: '220px', background: 'rgba(255,255,255,0.9)', 
                            backdropFilter: 'blur(16px)', borderRadius: '16px', 
                            boxShadow: '0 10px 40px rgba(15, 23, 42, 0.1)', 
                            border: '1px solid rgba(255,255,255,0.5)', zIndex: 100,
                            padding: '0.5rem'
                        }}
                    >
                        {items.map((item, idx) => (
                            <div 
                                key={idx}
                                onClick={() => navigate(item.to)}
                                style={{ 
                                    padding: '0.8rem 1rem', borderRadius: '10px', 
                                    display: 'flex', alignItems: 'center', gap: '0.8rem',
                                    cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem',
                                    color: currentPath === item.to ? '#1e40af' : '#475569',
                                    background: currentPath === item.to ? '#eff6ff' : 'transparent',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                onMouseLeave={(e) => { if(currentPath !== item.to) e.currentTarget.style.background = 'transparent'; }}
                            >
                                {item.icon} {item.label}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const PatientNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const currentPath = location.pathname;

    const navLinks = [
        { label: 'Home', icon: <Home size={18} />, to: '/patient-dashboard' },
        { label: 'Appointments', icon: <Calendar size={18} />, to: '/patient/appointments' },
        { label: 'EMR Vault', icon: <FileText size={18} />, to: '/patient/records' },
        { label: 'AURA Triage', icon: <Brain size={18} color="#8b5cf6" />, to: '/patient/aura' }
    ];

    const wellnessItems = [
        { label: 'Telehealth Room', icon: <Stethoscope size={16} />, to: '/patient/telehealth' },
        { label: 'Vitals Sync', icon: <HeartPulse size={16} />, to: '/patient/vitals' },
        { label: 'Diet & Nutrition', icon: <Apple size={16} />, to: '/patient/nutrition' },
        { label: 'Mental Health', icon: <Activity size={16} />, to: '/patient/mental-health' },
        { label: 'Recovery & Rehab', icon: <Dumbbell size={16} />, to: '/patient/rehab' }
    ];

    const servicesItems = [
        { label: 'Pharmacy Delivery', icon: <Pill size={16} />, to: '/patient/pharmacy' },
        { label: 'Financial Ledger', icon: <CreditCard size={16} />, to: '/patient/billing' },
        { label: 'Settings & Privacy', icon: <UserCircle size={16} />, to: '/patient/settings' }
    ];

    return (
        <header style={{ 
            position: 'sticky', top: 0, zIndex: 1000, 
            background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', 
            borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
            padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => navigate('/patient-dashboard')}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #1e3a8a, #1e40af)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 950, fontSize: '1.2rem', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)' }}>
                    P
                </div>
                <div>
                    <div style={{ color: '#0f172a', fontWeight: 950, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>Healix</div>
                    <div style={{ color: '#64748b', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Patient Portal</div>
                </div>
            </div>

            {/* Primary Nav */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }}>
                {navLinks.map(link => (
                    <div 
                        key={link.to} 
                        onClick={() => navigate(link.to)}
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1.2rem', 
                            borderRadius: '14px', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem',
                            color: currentPath === link.to ? '#1e40af' : '#64748b',
                            background: currentPath === link.to ? 'rgba(30, 58, 138, 0.05)' : 'transparent',
                            transition: 'all 0.2s'
                        }}
                    >
                        {link.icon} {link.label}
                    </div>
                ))}
                
                <NavDropdown label="Wellbeing" icon={<HeartPulse size={18} />} items={wellnessItems} currentPath={currentPath} navigate={navigate} />
                <NavDropdown label="Services" icon={<CreditCard size={18} />} items={servicesItems} currentPath={currentPath} navigate={navigate} />
            </nav>

            {/* User Profile & Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div 
                    style={{ position: 'relative', cursor: 'pointer' }}
                    onClick={() => navigate('/patient/notifications')}
                >
                    <Bell size={20} color="#64748b" />
                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '10px', height: '10px', background: '#ec4899', borderRadius: '50%', border: '2px solid white' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '1.5rem', borderLeft: '1px solid #e2e8f0' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#0f172a', fontWeight: 800, fontSize: '0.85rem' }}>{user?.username || 'Patient'}</div>
                        <div style={{ color: '#1e40af', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase' }}>Basic Coverage</div>
                    </div>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }} onClick={logout}>
                        <LogOut size={18} />
                    </div>
                </div>
            </div>
        </header>
    );
};

const PatientLayout = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#eff6ff' }}>
            <PatientNavbar />
            <main style={{ flex: 1, padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

export default PatientLayout;
