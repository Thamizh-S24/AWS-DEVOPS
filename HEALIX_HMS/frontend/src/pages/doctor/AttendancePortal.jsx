import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, LogOut, Calendar, History, ShieldCheck, User } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader, { StatCard } from '../admin/SectionHeader';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AttendancePortal = () => {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ present_days: 0, late_entries: 0 });
    const [currentStatus, setCurrentStatus] = useState('unknown'); // 'in' | 'out' | 'unknown'

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [logsRes, statusRes] = await Promise.all([
                api.get('/hr/attendance/logs'),
                api.get(`/hr/attendance/status/${user.username}`)
            ]);

            const myLogs = (logsRes.data || []).filter(l => l.staff_id === user.username);
            const sorted = myLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setLogs(sorted);
            setCurrentStatus(statusRes.data.status);

            const uniqueDays = new Set(myLogs.map(l => new Date(l.timestamp).toDateString()));
            setStats({ present_days: uniqueDays.size, late_entries: 0 });
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch attendance data");
            setLoading(false);
        }
    };

    const handleClockAction = async (type) => {
        try {
            setLoading(true);
            const res = await api.post(`/hr/attendance/${type}?username=${user.username}`);

            // Immediately trust the backend's confirmed status in the response
            if (res.data && res.data.status) {
                setCurrentStatus(res.data.status);
            } else {
                setCurrentStatus(type === 'check-in' ? 'in' : 'out');
            }

            // Wait a moment for DB consistency before refreshing the history table
            setTimeout(() => {
                fetchData();
            }, 1000);

        } catch (err) {
            console.error("Attendance failure", err);
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="doctor">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
            >
                <SectionHeader
                    title="Clinical Workforce Telemetry"
                    subtitle="Real-time shift tracking and clinical duty history"
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="glass-v3" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, #0f172a, #1cb5e0)', color: 'white', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.1), transparent)', zIndex: 0 }} />

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <ShieldCheck size={28} color="#00f2fe" />
                                        <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1.4rem' }}>Node Status</h3>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.2)' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: currentStatus === 'in' ? '#10b981' : '#ef4444', boxShadow: currentStatus === 'in' ? '0 0 10px #10b981' : 'none' }} className={currentStatus === 'in' ? 'pulse-slow' : ''} />
                                        <span style={{ fontSize: '0.75rem', fontWeight: 950, letterSpacing: '1px' }}>{currentStatus === 'in' ? 'CLOCKED IN' : 'CLOCKED OUT'}</span>
                                    </div>
                                </div>
                                <p style={{ opacity: 0.8, marginBottom: '2.5rem', fontWeight: 500, lineHeight: 1.6, fontSize: '0.9rem' }}>Secure clinical session management. Shift telemetry is synchronized with the master HR node in real-time.</p>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        onClick={() => handleClockAction('check-in')}
                                        disabled={currentStatus === 'in'}
                                        style={{ flex: 1, padding: '1.2rem', borderRadius: '14px', background: currentStatus === 'in' ? 'rgba(255,255,255,0.1)' : '#10b981', color: 'white', border: 'none', fontWeight: 950, fontSize: '0.95rem', cursor: currentStatus === 'in' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', opacity: currentStatus === 'in' ? 0.5 : 1 }}
                                    >
                                        <CheckCircle2 size={20} /> START
                                    </button>
                                    <button
                                        onClick={() => handleClockAction('check-out')}
                                        disabled={currentStatus === 'out'}
                                        style={{ flex: 1, padding: '1.2rem', borderRadius: '14px', background: currentStatus === 'out' ? 'rgba(255,255,255,0.1)' : '#ef4444', color: 'white', border: 'none', fontWeight: 950, fontSize: '0.95rem', cursor: currentStatus === 'out' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', opacity: currentStatus === 'out' ? 0.5 : 1 }}
                                    >
                                        <LogOut size={20} /> END
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="glass-v3" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', borderRadius: '16px' }}>
                                <Calendar size={28} />
                            </div>
                            <div>
                                <div style={{ fontSize: '2.2rem', fontWeight: 950, color: '#0f172a' }}>{stats.present_days}</div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 900, textTransform: 'uppercase' }}>Duty Days This Month</div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-v3" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <History size={20} color="#64748b" />
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Shift Telemetry Feed</h3>
                        </div>
                        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', position: 'sticky', top: 0, zIndex: 10 }}>
                                        <th style={{ padding: '1.2rem 2rem', fontSize: '0.7rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase' }}>Timestamp</th>
                                        <th style={{ padding: '1.2rem 2rem', fontSize: '0.7rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase' }}>Protocol</th>
                                        <th style={{ padding: '1.2rem 2rem', fontSize: '0.7rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="3" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>Pulling history...</td></tr>
                                    ) : logs.length > 0 ? logs.map((log, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '1.2rem 2rem' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{new Date(log.timestamp).toLocaleDateString()}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{new Date(log.timestamp).toLocaleTimeString()}</div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.2rem 2rem' }}>
                                                <span style={{ padding: '0.4rem 0.8rem', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 950, background: log.type === 'check-in' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: log.type === 'check-in' ? '#10b981' : '#ef4444' }}>
                                                    {log.type.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.2rem 2rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 800 }}>
                                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                                                    VERIFIED
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="3" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>No shift records found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
};

export default AttendancePortal;
