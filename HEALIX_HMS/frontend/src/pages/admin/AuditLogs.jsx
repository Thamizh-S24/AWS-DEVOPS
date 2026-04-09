import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, Shield, Lock, User, FileText } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from './SectionHeader';
import api from '../../services/api';
import { useSearch } from '../../context/SearchContext';

const AuditLogs = () => {
    const { searchTerm } = useSearch();
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/analytics/audit-logs');
            setLogs(res.data);
        } catch (err) { console.error("Audit log sync failed"); }
    };

    const getActionColor = (action) => {
        if (action.includes('LOGIN')) return '#0ea5e9';
        if (action.includes('DELETE')) return '#ef4444';
        if (action.includes('UPDATE')) return '#f59e0b';
        return '#10b981';
    };

    const filteredLogs = logs.filter(l =>
        l.username?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
        l.action?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
        l.details?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
    );

    return (
        <DashboardLayout role="admin">
            <SectionHeader title="System Activity Logs" subtitle="Record of all system-wide activity" />

            <div className="stat-card-white" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <History size={20} color="#64748b" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0 }}>Activity Journal</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f8fafc' }}>
                        <tr>
                            <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800 }}>Timestamp</th>
                            <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800 }}>User</th>
                            <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800 }}>Action</th>
                            <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800 }}>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map((log) => (
                            <tr key={log._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '1.2rem 2rem', fontSize: '0.8rem', color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td style={{ padding: '1.2rem 2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                        <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}><User size={14} /></div>
                                        <span style={{ fontWeight: 800, color: '#334155' }}>{log.username}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1.2rem 2rem' }}>
                                    <span style={{ fontWeight: 900, color: getActionColor(log.action), fontSize: '0.75rem' }}>{log.action}</span>
                                </td>
                                <td style={{ padding: '1.2rem 2rem', fontSize: '0.8rem', color: '#64748b' }}>
                                    {log.details || 'System automated event'}
                                </td>
                            </tr>
                        ))}
                        {logs.length === 0 && <tr><td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>No logs found yet.</td></tr>}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default AuditLogs;
