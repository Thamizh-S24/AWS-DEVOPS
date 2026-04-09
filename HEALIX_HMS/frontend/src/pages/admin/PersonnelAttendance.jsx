import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Search, Filter, Clock, CheckCircle2, XCircle, Calendar, User } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from './SectionHeader';
import api from '../../services/api';

const PersonnelAttendance = () => {
    const [logs, setLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ present: 0, total: 0 });

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const [logsRes, statsRes] = await Promise.all([
                api.get('/hr/attendance/logs'),
                api.get('/hr/stats')
            ]);
            setLogs(logsRes.data);
            setStats({
                present: statsRes.data.active_shifts,
                total: statsRes.data.total_staff
            });
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch attendance data", err);
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log =>
        log.staff_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="admin">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
            >
                <SectionHeader
                    title="Attendance Registry"
                    subtitle="Real-time personnel clock-in telemetry and shift records"
                />

                {/* Stats Banner */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                    <div className="glass-v3" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '16px' }}>
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: 950, color: '#0f172a' }}>{stats.present}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 900, textTransform: 'uppercase' }}>On Duty Today</div>
                        </div>
                    </div>
                    <div className="glass-v3" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', borderRadius: '16px' }}>
                            <User size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: 950, color: '#0f172a' }}>{stats.total}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 900, textTransform: 'uppercase' }}>Total Workforce</div>
                        </div>
                    </div>
                    <div className="glass-v3" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ padding: '1rem', background: 'var(--grad-main)', color: 'white', borderRadius: '16px' }}>
                            <Clock size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: 950, color: '#0f172a' }}>{((stats.present / stats.total) * 100).toFixed(1)}%</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 900, textTransform: 'uppercase' }}>Attendance Rate</div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="glass-v3" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
                        <input
                            placeholder="Enter clinician ID or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }}
                        />
                    </div>
                    <button className="glass-v3" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#64748b' }}>
                        <Filter size={18} /> FILTER
                    </button>
                    <button
                        onClick={fetchLogs}
                        style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', background: '#0f172a', color: 'white', border: 'none', fontWeight: 900, cursor: 'pointer' }}
                    >
                        REFRESH LIVE
                    </button>
                </div>

                {/* Table */}
                <div className="glass-v3" style={{ overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                    <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Staff ID</th>
                                    <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Timestamp</th>
                                    <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Protocol</th>
                                    <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.length > 0 ? filteredLogs.map((log, idx) => (
                                    <tr key={log._id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'white' : 'rgba(248, 250, 252, 0.5)' }}>
                                        <td style={{ padding: '1.2rem 2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                                                    {log.staff_id[0].toUpperCase()}
                                                </div>
                                                <span style={{ fontWeight: 800, color: '#0f172a' }}>{log.staff_id}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.2rem 2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
                                                <Calendar size={14} />
                                                {new Date(log.timestamp).toLocaleDateString()}
                                                <Clock size={14} style={{ marginLeft: '0.5rem' }} />
                                                {new Date(log.timestamp).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.2rem 2rem' }}>
                                            <span style={{
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '50px',
                                                fontSize: '0.7rem',
                                                fontWeight: 900,
                                                background: log.type === 'check-in' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                                                color: log.type === 'check-in' ? '#10b981' : '#ef4444'
                                            }}>
                                                {log.type.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.2rem 2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 800 }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                                                Verified
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>
                                            {loading ? 'Decrypting shift records...' : 'No telemetry data found for the selected query.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
};

export default PersonnelAttendance;
