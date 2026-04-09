import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, ShoppingBag, AlertTriangle, CheckCircle,
    Search, Plus, TrendingUp, Shield, BarChart3,
    Database, Truck, ChevronRight, UserCircle, ClipboardList, LayoutDashboard, Bell
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

const StatCard = ({ icon, label, value, trend, color, subtext }) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="glass-v3"
        style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '2rem',
            background: 'white',
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.8rem', borderRadius: '16px', background: `${color || '#0ea5e9'}10`, color: color || '#0ea5e9' }}>
                {icon}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', background: '#dcfce7', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                {trend || 'Active'}
            </div>
        </div>
        <div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '0.4rem' }}>{label || 'Stats'}</p>
            <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{value ?? 0}</h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>{subtext}</p>
        </div>
    </motion.div>
);

const SectionHeader = ({ title, subtitle, action }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>{title}</h2>
            <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.4rem', fontWeight: 500 }}>{subtitle}</p>
        </div>
        {action}
    </div>
);


const QuickAction = ({ icon, label, sub, to, color }) => {
    const navigate = useNavigate();
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={() => navigate(to)}
            className="glass-v3"
            style={{
                padding: '2.5rem',
                cursor: 'pointer',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                borderLeft: `6px solid ${color}`
            }}
        >
            <div style={{ padding: '1.2rem', borderRadius: '18px', background: `${color}15`, color: color }}>
                {icon}
            </div>
            <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 950, color: '#0f172a' }}>{label}</h3>
                <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>{sub}</p>
            </div>
            <ChevronRight size={20} style={{ marginLeft: 'auto', color: '#cbd5e1' }} />
        </motion.div>
    );
};

const PharmacistDashboard = () => {
    const navigate = useNavigate();
    const [stock, setStock] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [status, setStatus] = useState('Initializing...');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setStatus('Fetching data...');
                const [stockRes, presRes] = await Promise.all([
                    api.get('/pharmacy/inventory'),
                    api.get('/doctor/prescriptions/all')
                ]);
                setStock(Array.isArray(stockRes.data) ? stockRes.data : []);
                setPrescriptions(Array.isArray(presRes.data) ? presRes.data.filter(p => p.status === 'Pending') : []);
                setStatus('Data Ready');
            } catch (err) {
                console.error("Data fetch fail", err);
                setStatus('Fetch Error: ' + err.message);
            }
        };
        fetchData();
    }, []);

    return (
        <DashboardLayout role="pharmacist">
            <div style={{ padding: '1rem 0' }}>
                <SectionHeader
                    title="Pharmacy Dashboard"
                    subtitle="Manage medicines, prescriptions, and stock"
                />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem', marginBottom: '4rem' }}>
                    <StatCard
                        icon={<Package />}
                        label="Medicine Inventory"
                        value={stock.length}
                        trend="In Stock"
                        color="#0ea5e9"
                        subtext="Total items tracked"
                    />
                    <StatCard
                        icon={<ShoppingBag />}
                        label="New Prescriptions"
                        value={prescriptions.length}
                        trend={prescriptions.length > 5 ? "Busy" : "Normal"}
                        color={prescriptions.length > 5 ? "#ef4444" : "#f59e0b"}
                        subtext="Waiting to be filled"
                    />
                    <StatCard
                        icon={<Shield />}
                        label="System Status"
                        value="Active"
                        trend="Secure"
                        color="#10b981"
                        subtext="Running smoothly"
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Department Terminals</h3>
                        <QuickAction
                            icon={<Database />}
                            label="Stocks Management"
                            sub="Inventory CRUD, Batch Tracking & Alerts"
                            to="/pharmacist/inventory"
                            color="#0ea5e9"
                        />
                        <QuickAction
                            icon={<ClipboardList />}
                            label="Prescription List"
                            sub="Check and give out medicines"
                            to="/pharmacist/prescriptions"
                            color="#f59e0b"
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Administrative</h3>
                        <QuickAction
                            icon={<Bell />}
                            label="Alert Center"
                            sub="System Broadcasts & Stock Depletion Feeds"
                            to="/pharmacist/notifications"
                            color="#ec4899"
                        />
                        <QuickAction
                            icon={<UserCircle />}
                            label="Profile Settings"
                            sub="Pharmacy Authorization & Security"
                            to="/pharmacist/profile"
                            color="#6366f1"
                        />
                    </div>
                </div>

                {stock.some(s => s && s.stock < 20) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            marginTop: '4rem',
                            padding: '2rem',
                            borderRadius: '24px',
                            background: 'rgba(239, 68, 68, 0.05)',
                            border: '1px solid rgba(239, 68, 68, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem'
                        }}
                    >
                        <div style={{ padding: '0.8rem', borderRadius: '12px', background: '#ef4444', color: 'white' }}>
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#991b1b' }}>Inventory Depletion Warning</h4>
                            <p style={{ margin: '0.2rem 0 0 0', color: '#b91c1c', fontWeight: 500 }}>
                                Multiple SKUs have fallen below the critical threshold of 20 units. Immediate procurement required.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/pharmacist/inventory')}
                            style={{ marginLeft: 'auto', padding: '0.8rem 1.5rem', borderRadius: '12px', background: '#ef4444', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                        >
                            Review Stocks
                        </button>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default PharmacistDashboard;
