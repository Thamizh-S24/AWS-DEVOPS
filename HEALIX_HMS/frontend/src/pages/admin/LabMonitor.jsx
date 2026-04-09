import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, ClipboardList, Activity, User } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader, { StatCard } from './SectionHeader';
import api from '../../services/api';
import { useSearch } from '../../context/SearchContext';

const LabMonitor = () => {
    const { searchTerm } = useSearch();
    const [tests, setTests] = useState([]);
    const [stats, setStats] = useState({ total_tests: 0, pending_reports: 0 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [testRes, statRes] = await Promise.all([
                api.get('/lab/tests'),
                api.get('/lab/stats')
            ]);
            setTests(testRes.data);
            setStats(statRes.data);
        } catch (err) { console.error("Lab sync failed"); }
    };

    const completionRate = tests.length > 0
        ? Math.round((tests.filter(t => t.status === 'Completed').length / tests.length) * 100)
        : 0;

    const filteredTests = tests.filter(t =>
        t.test_type?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
        t.patient_id?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
        t.doctor_id?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
    );

    return (
        <DashboardLayout role="admin">
            <SectionHeader title="Lab Overview" subtitle="Track medical tests and report status" />

            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3.5rem' }}>
                <StatCard icon={<FlaskConical />} label="Tests Today" value={stats.total_tests} trend="+15%" color="#0ea5e9" subtext="Total lab tests performed" />
                <StatCard icon={<ClipboardList />} label="Pending Reports" value={stats.pending_reports} trend="Sync" color="#f59e0b" subtext="Tests pending results" />
                <StatCard icon={<Activity />} label="Approve Completion Rate" value={`${completionRate}%`} trend="High" color="#10b981" subtext="TAT (Turnaround Time) metrics" />
            </div>

            <div className="stat-card-white" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0 }}>Test List</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                        <thead>
                            <tr style={{ background: 'linear-gradient(to bottom, #f8fafc, white)', borderBottom: '1px solid rgba(14, 165, 233, 0.08)' }}>
                                <th style={{ padding: '1.2rem 2.5rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1px' }}>Test Type</th>
                                <th style={{ padding: '1.2rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1px' }}>Patient</th>
                                <th style={{ padding: '1.2rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1px' }}>Requested By</th>
                                <th style={{ padding: '1.2rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTests.map((t) => (
                                <tr key={t._id} style={{ borderBottom: '1px solid rgba(14, 165, 233, 0.04)' }}>
                                    <td style={{ padding: '1.5rem 2.5rem' }}>
                                        <div style={{ fontWeight: 950, color: '#0f172a', fontSize: '1rem', letterSpacing: '-0.3px' }}>{t.test_type}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 800, marginTop: '0.15rem' }}>REF: {t._id.slice(-6).toUpperCase()}</div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <div style={{ fontWeight: 800, color: '#334155', fontSize: '0.9rem' }}>ID: {t.patient_id}</div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <div style={{ padding: '0.4rem', background: 'rgba(100, 116, 139, 0.05)', borderRadius: '8px' }}>
                                                <User size={14} color="#64748b" />
                                            </div>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{t.doctor_id}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '12px', background: t.status === 'Completed' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)', color: t.status === 'Completed' ? '#10b981' : '#f59e0b', width: 'fit-content', border: t.status === 'Completed' ? '1px solid rgba(16, 185, 129, 0.1)' : '1px solid rgba(245, 158, 11, 0.1)' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', boxShadow: `0 0 8px currentColor` }} />
                                            <span style={{ fontSize: '0.7rem', fontWeight: 950 }}>{t.status.toUpperCase()}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default LabMonitor;
