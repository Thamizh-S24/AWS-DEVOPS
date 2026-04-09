import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Shield, CheckCircle, AlertTriangle, PenTool } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from './SectionHeader';
import api from '../../services/api';

const AdminMaintenance = () => {
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({ active_sanitations: 0, pending_repairs: 0 });
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [taskRes, statsRes] = await Promise.all([
                api.get('/maintenance/tasks'),
                api.get('/maintenance/stats')
            ]);
            setTasks(taskRes.data);
            setStats(statsRes.data);
        } catch (err) { console.error("Maintenance sync failed"); }
    };

    const handleUpdateTask = async (id, status) => {
        try {
            await api.patch(`/maintenance/task/${id}`, null, { params: { status } });
            setMsg('Maintenance log updated');
            fetchData();
            setTimeout(() => setMsg(''), 3000);
        } catch (err) { setMsg('Update failed'); }
    };

    return (
        <DashboardLayout role="admin">
            <SectionHeader title="Maintenance & Cleaning" subtitle="Manage hospital cleaning and equipment repairs" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '3.5rem' }}>
                <div className="stat-card-white">
                    <div style={{ color: '#0ea5e9', marginBottom: '0.8rem' }}><Shield size={24} /></div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>Active Sanitations</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>{stats.active_sanitations}</div>
                </div>
                <div className="stat-card-white">
                    <div style={{ color: '#ef4444', marginBottom: '0.8rem' }}><Wrench size={24} /></div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>Pending Repairs</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>{stats.pending_repairs}</div>
                </div>
                {/* Placeholder for more maintenance stats */}
            </div>

            <div className="stat-card-white" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f8fafc' }}>
                        <tr>
                            <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800 }}>Task / Item</th>
                            <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800 }}>Category</th>
                            <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800 }}>Urgency</th>
                            <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((t) => (
                            <tr key={t._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '1.2rem 2rem' }}>
                                    <div style={{ fontWeight: 800, color: '#0f172a' }}>{t.asset_id || t.title}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>LOCATION: {t.location} • LOGGED: {new Date(t.created_at).toLocaleDateString()}</div>
                                </td>
                                <td style={{ padding: '1.2rem 2rem' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>{t.category.toUpperCase()}</span>
                                </td>
                                <td style={{ padding: '1.2rem 2rem' }}>
                                    <span style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 900, background: t.priority === 'High' ? '#fee2e2' : '#f1f5f9', color: t.priority === 'High' ? '#ef4444' : '#64748b' }}>
                                        {t.priority.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '1.2rem 2rem' }}>
                                    <button onClick={() => handleUpdateTask(t._id, 'Resolved')} style={{ color: '#10b981', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '0.7rem' }}>COMPLETE</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {msg && <p style={{ textAlign: 'center', marginTop: '2rem', color: '#10b981', fontWeight: 800 }}>{msg}</p>}
        </DashboardLayout>
    );
};

export default AdminMaintenance;

