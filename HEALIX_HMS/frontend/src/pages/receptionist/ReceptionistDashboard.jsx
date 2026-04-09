import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Activity, Users, ClipboardList, PhoneCall,
    TrendingUp, Clock, MapPin
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ icon, label, value, trend, color, subtext }) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="glass-v3"
        style={{ position: 'relative', overflow: 'hidden', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.8rem', borderRadius: '16px', background: `${color}10`, color: color }}>
                {icon}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', background: '#dcfce7', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                <TrendingUp size={12} />
                {trend}
            </div>
        </div>
        <div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '0.4rem' }}>{label}</p>
            <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{value}</h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>{subtext}</p>
        </div>
        <div style={{ position: 'absolute', right: '-10%', bottom: '-10%', opacity: 0.03, color: color }}>
            {icon ? React.cloneElement(icon, { size: 100 }) : null}
        </div>
    </motion.div>
);

const ReceptionistDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        pendingAdmissions: 0,
        unpaidInvoices: 0,
        unreadNotifs: 0,
        totalPatients: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            if (!user) return;
            try {
                const [admissionsRes, billsRes, notifsRes, statsRes] = await Promise.all([
                    api.get('/ward/admission-requests').catch(() => ({ data: [] })),
                    api.get('/billing/unpaid').catch(() => ({ data: [] })),
                    api.get(`/notification/my/${user.username}`).catch(() => ({ data: [] })),
                    api.get('/patient/stats').catch(() => ({ data: { total_patients: 0 } }))
                ]);

                setStats({
                    pendingAdmissions: (admissionsRes.data || []).filter(r => r.status === 'Pending').length,
                    unpaidInvoices: (billsRes.data || []).length,
                    unreadNotifs: (notifsRes.data || []).filter(n => !n.read).length,
                    totalPatients: (statsRes.data || {}).total_patients || 0
                });
            } catch (err) {
                console.error("Failed to fetch receptionist stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
        const intv = setInterval(fetchMetrics, 30000);
        return () => clearInterval(intv);
    }, [user]);

    return (
        <DashboardLayout role="receptionist">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}
            >
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 950, color: '#0f172a', margin: 0, letterSpacing: '-1.5px' }}>Front Desk Hub</h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 500 }}>Daily Management & Patient Office</p>
                </div>

                {/* Desk Metrics Strip */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                    <StatCard
                        icon={<Users size={24} />}
                        label="Total Patients"
                        value={loading ? "..." : stats.totalPatients}
                        trend="Live"
                        color="#0ea5e9"
                        subtext="Registered in database"
                    />
                    <StatCard
                        icon={<Activity size={24} />}
                        label="Waitlist for Beds"
                        value={loading ? "..." : stats.pendingAdmissions}
                        trend="Live"
                        color="#ef4444"
                        subtext="Patients waiting for a room"
                    />
                    <StatCard
                        icon={<ClipboardList size={24} />}
                        label="Unpaid Bills"
                        value={loading ? "..." : stats.unpaidInvoices}
                        trend="Live"
                        color="#f59e0b"
                        subtext="Bills waiting for payment"
                    />
                    <StatCard
                        icon={<PhoneCall size={24} />}
                        label="Priority Inquiries"
                        value={loading ? "..." : stats.unreadNotifs}
                        trend="Live"
                        color="#0d9488"
                        subtext="Unread system alerts"
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                    {/* Navigation Cards */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass-v3"
                        style={{ padding: '2rem', display: 'flex', flexDirection: 'column', cursor: 'pointer', border: '1px solid #e2e8f0' }}
                        onClick={() => window.location.href = '/receptionist/registry'}
                    >
                        <div style={{ padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', borderRadius: '12px', width: 'fit-content', marginBottom: '1.5rem' }}>
                            <Users size={32} />
                        </div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>Patient Registration</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: 500, lineHeight: 1.5 }}>Register new patients and look up their medical history.</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass-v3"
                        style={{ padding: '2rem', display: 'flex', flexDirection: 'column', cursor: 'pointer', border: '1px solid #e2e8f0' }}
                        onClick={() => window.location.href = '/receptionist/admissions'}
                    >
                        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px', width: 'fit-content', marginBottom: '1.5rem' }}>
                            <Activity size={32} />
                        </div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>Hospital Admissions</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: 500, lineHeight: 1.5 }}>Assign patients to beds and wards for their hospital stay.</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass-v3"
                        style={{ padding: '2rem', display: 'flex', flexDirection: 'column', cursor: 'pointer', border: '1px solid #e2e8f0' }}
                        onClick={() => window.location.href = '/receptionist/emergency'}
                    >
                        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '12px', width: 'fit-content', marginBottom: '1.5rem' }}>
                            <PhoneCall size={32} />
                        </div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>Emergency Desk</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: 500, lineHeight: 1.5 }}>Quickly register emergency cases and alert the medical team.</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass-v3"
                        style={{ padding: '2rem', display: 'flex', flexDirection: 'column', cursor: 'pointer', border: '1px solid #e2e8f0' }}
                        onClick={() => window.location.href = '/receptionist/billing'}
                    >
                        <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '12px', width: 'fit-content', marginBottom: '1.5rem' }}>
                            <ClipboardList size={32} />
                        </div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>Payment Office</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: 500, lineHeight: 1.5 }}>Check and receive patient payments for medical services.</p>
                    </motion.div>
                </div>

                {/* Routing Insights Strip */}
                <div className="glass-v3" style={{ background: '#0f172a', border: 'none', padding: '2rem', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <MapPin size={40} color="#0ea5e9" />
                            <div>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 900, fontSize: '1.5rem', color: 'white' }}>System Running Smoothly</h3>
                                <p style={{ margin: 0, color: '#94a3b8', fontSize: '1rem' }}>All departments are connected and data is syncing in real-time.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
};

export default ReceptionistDashboard;
