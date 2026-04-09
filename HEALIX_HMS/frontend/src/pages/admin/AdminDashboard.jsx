import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, Building, Database, Server, Shield, Bell, TrendingUp } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader, { StatCard } from './SectionHeader';
import api from '../../services/api';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [wards, setWards] = useState([]);
    const [stats, setStats] = useState({
        bed_occupancy: 0,
        available_beds: 0,
        occupied_beds: 0,
        beds_cleaning: 0,
        total_patients: 0,
        active_admissions: 0,
        active_emergency_cases: 0,
        low_stock_alerts: 0,
        staff_on_duty: 0
    });

    const [hrStats, setHrStats] = useState({ attendance_rate: 0, pending_leaves: 0 });

    useEffect(() => {
        fetchInitialData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchInitialData = async () => {
        fetchUsers();
        fetchDepartments();
        fetchWards();
        fetchAnalytics();
        fetchHRStats();
    };

    const fetchData = async () => {
        fetchAnalytics();
        fetchHRStats();
    };

    const fetchHRStats = async () => {
        try {
            const res = await api.get('/hr/stats');
            setHrStats(res.data);
        } catch (err) { console.error("Failed to fetch HR stats"); }
    };

    const fetchAnalytics = async () => {
        try {
            const res = await api.get('/analytics/overview');
            setStats(res.data);
        } catch (err) { console.error("Failed to fetch analytics"); }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/auth/users');
            setUsers(res.data);
        } catch (err) { console.error("Failed to fetch users"); }
    };

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/hr/departments');
            setDepartments(res.data);
        } catch (err) { console.error("Failed to fetch departments"); }
    };

    const fetchWards = async () => {
        try {
            const res = await api.get('/ward/status');
            setWards(res.data);
        } catch (err) { console.error("Failed to fetch wards"); }
    };

    return (
        <DashboardLayout role="admin">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}
            >
                <SectionHeader
                    title="Hospital Overview"
                    subtitle="Live monitor for all hospital departments and staff"
                />

                {/* Advanced Bento Grid Dashboard */}
                <div className="bento-grid">
                    {/* Primary Stats - Hero Card */}
                    <div className="bento-item glass-v3" style={{ gridColumn: 'span 8', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3rem' }}>
                            <div style={{ borderRight: '1px solid rgba(14, 165, 233, 0.1)' }}>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.8rem' }}>Live Patients</p>
                                <div style={{ fontSize: '3.8rem', fontWeight: 950, color: '#0f172a', letterSpacing: '-3px', lineHeight: 1 }}>{stats.total_patients}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0ea5e9', fontSize: '0.75rem', fontWeight: 800, marginTop: '1rem', background: 'rgba(14, 165, 233, 0.08)', padding: '0.3rem 0.6rem', borderRadius: '50px', width: 'fit-content' }}>
                                    <TrendingUp size={12} /> +12%
                                </div>
                            </div>
                            <div style={{ borderRight: '1px solid rgba(14, 165, 233, 0.1)' }}>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.8rem' }}>Admissions</p>
                                <div style={{ fontSize: '3.8rem', fontWeight: 950, color: '#0f172a', letterSpacing: '-3px', lineHeight: 1 }}>{stats.active_admissions}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#8b5cf6', fontSize: '0.75rem', fontWeight: 800, marginTop: '1rem', background: 'rgba(139, 92, 246, 0.08)', padding: '0.3rem 0.6rem', borderRadius: '50px', width: 'fit-content' }}>
                                    Live Terminal
                                </div>
                            </div>
                            <div style={{ borderRight: '1px solid rgba(14, 165, 233, 0.1)' }}>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.8rem' }}>Emergencies</p>
                                <div style={{ fontSize: '3.8rem', fontWeight: 950, color: '#ef4444', letterSpacing: '-3px', lineHeight: 1 }}>{stats.active_emergency_cases}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ef4444', fontSize: '0.75rem', fontWeight: 800, marginTop: '1rem', background: 'rgba(239, 68, 68, 0.08)', padding: '0.3rem 0.6rem', borderRadius: '50px', width: 'fit-content' }}>
                                    Priority High
                                </div>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.8rem' }}>Staff Duty</p>
                                <div style={{ fontSize: '3.8rem', fontWeight: 950, color: '#0d9488', letterSpacing: '-3px', lineHeight: 1 }}>{stats.staff_on_duty}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0d9488', fontSize: '0.75rem', fontWeight: 800, marginTop: '1rem', background: 'rgba(13, 148, 136, 0.08)', padding: '0.3rem 0.6rem', borderRadius: '50px', width: 'fit-content' }}>
                                    Active Mesh
                                </div>
                            </div>
                        </div>

                        {/* Background Design Element */}
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '30%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.03))', pointerEvents: 'none' }} />
                    </div>

                    {/* Operational Guard Card */}
                    <div className="bento-item glass-v3" style={{ gridColumn: 'span 4', padding: '2.5rem', background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white', border: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '2rem' }}>
                            <div style={{ padding: '0.8rem', background: 'rgba(14, 165, 233, 0.2)', borderRadius: '15px', color: '#0ea5e9' }}>
                                <Shield size={24} />
                            </div>
                            <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>Security & Status</h4>
                        </div>
                        <p style={{ fontSize: '0.9rem', opacity: 0.6, fontWeight: 500, lineHeight: 1.6, marginBottom: '2rem' }}>
                            All hospital systems are running normally and data is protected.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="pulse-dot" />
                            <span style={{ fontSize: '0.8rem', fontWeight: 900, letterSpacing: '1px' }}>SYSTEM IS SECURE</span>
                        </div>
                    </div>

                    {/* Bed Dynamics Visualization */}
                    <div className="bento-item glass-v3" style={{ gridColumn: 'span 5', padding: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <h4 style={{ margin: 0, fontWeight: 950, fontSize: '1.4rem', letterSpacing: '-0.5px' }}>Bed Availability</h4>
                            <div style={{ padding: '0.6rem 1.2rem', borderRadius: '50px', background: 'rgba(14, 165, 233, 0.08)', color: '#0ea5e9', fontSize: '0.75rem', fontWeight: 900 }}>BED STATUS</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                            {[
                                { label: 'Empty Beds', val: stats.available_beds, max: 100, color: '#10b981' },
                                { label: 'Occupied Beds', val: stats.occupied_beds, max: 100, color: '#ef4444' },
                                { label: 'Beds Being Cleaned', val: stats.beds_cleaning, max: 100, color: '#f59e0b' }
                            ].map((b, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 800, color: '#64748b', marginBottom: '0.6rem' }}>
                                        <span>{b.label}</span>
                                        <span style={{ color: b.color }}>{b.val} UNITS</span>
                                    </div>
                                    <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(b.val / b.max) * 100}%` }}
                                            transition={{ duration: 1.5, ease: 'circOut' }}
                                            style={{ height: '100%', background: b.color, borderRadius: '5px', boxShadow: `0 0 10px ${b.color}20` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Logistics Command View */}
                    <div className="bento-item glass-v3" style={{ gridColumn: 'span 7', padding: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                            <h4 style={{ margin: 0, fontWeight: 950, fontSize: '1.4rem', letterSpacing: '-0.5px' }}>Department Links</h4>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#64748b', opacity: 0.2 }} />
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#64748b', opacity: 0.2 }} />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                            {[
                                { icon: <Server size={22} />, title: "Systems", path: "/admin/microservices", color: "#0ea5e9", text: "Software Parts" },
                                { icon: <Building size={22} />, title: "Building", path: "/admin/infrastructure", color: "#8b5cf6", text: "Facility Manager" },
                                { icon: <Activity size={22} />, title: "Emergencies", path: "/admin/emergency", color: "#f59e0b", text: "ER Command" }
                            ].map((command, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    onClick={() => window.location.href = command.path}
                                    className="glass-v3"
                                    style={{ padding: '1.8rem', cursor: 'pointer', textAlign: 'center', border: '1px solid rgba(14, 165, 233, 0.08)', background: 'rgba(255,255,255,0.5)' }}
                                >
                                    <div style={{ color: command.color, marginBottom: '1.2rem', display: 'flex', justifyContent: 'center' }}>
                                        <div style={{ padding: '0.9rem', borderRadius: '14px', background: `${command.color}10` }}>{command.icon}</div>
                                    </div>
                                    <div style={{ fontWeight: 950, fontSize: '0.95rem', color: '#0f172a', letterSpacing: '-0.3px', marginBottom: '0.4rem' }}>{command.title}</div>
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{command.text}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* HR Analytics Snippet */}
                    <div className="bento-item glass-v3" style={{ gridColumn: 'span 4', padding: '2.5rem' }}>
                        <h4 style={{ margin: '0 0 2rem 0', fontWeight: 950, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>Staff Presence</h4>
                        <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.8rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Attendance</span>
                                <span style={{ fontSize: '1.8rem', fontWeight: 950, color: '#10b981', lineHeight: 1 }}>{hrStats.attendance_rate}%</span>
                            </div>
                            <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${hrStats.attendance_rate}%` }}
                                    style={{ height: '100%', background: '#10b981', borderRadius: '4px', boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)' }}
                                />
                            </div>
                        </div>
                        <div
                            className="glass-v3"
                            style={{
                                padding: '1.2rem 1.5rem',
                                border: '1px solid rgba(245, 158, 11, 0.1)',
                                background: 'rgba(245, 158, 11, 0.02)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer'
                            }}
                            onClick={() => window.location.href = '/admin/leaves'}
                        >
                            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                <div style={{ color: '#f59e0b' }}><Bell size={18} /></div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>{hrStats.pending_leaves} Leaves Pending</span>
                            </div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 950, color: '#f59e0b', textTransform: 'uppercase' }}>Review</span>
                        </div>
                    </div>

                    {/* Infrastructure Summary Snippet */}
                    <div className="bento-item glass-v3" style={{ gridColumn: 'span 8', padding: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                            <div style={{ padding: '1.2rem', borderRadius: '24px', background: 'var(--grad-main)', color: 'white', boxShadow: '0 10px 20px rgba(14, 165, 233, 0.2)' }}>
                                <Database size={32} />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontWeight: 950, fontSize: '1.6rem', letterSpacing: '-0.8px' }}>System Health</h4>
                                <p style={{ margin: '0.4rem 0 0 0', opacity: 0.6, fontSize: '1rem', fontWeight: 500, maxWidth: '500px' }}>
                                    All hospital systems for data and patient flow are working perfectly.
                                </p>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: '0 15px 30px rgba(14, 165, 233, 0.3)' }}
                            whileTap={{ scale: 0.95 }}
                            style={{ padding: '1.2rem 2.8rem', borderRadius: '18px', background: '#0f172a', color: 'white', fontWeight: 950, fontSize: '0.9rem', cursor: 'pointer', border: 'none', letterSpacing: '1px' }}>
                            SYSTEM CHECK
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
};

export default AdminDashboard;

