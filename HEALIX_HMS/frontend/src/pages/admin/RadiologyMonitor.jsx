import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Camera, Shield, Clock } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader, { StatCard } from './SectionHeader';
import api from '../../services/api';
import { useSearch } from '../../context/SearchContext';

const RadiologyMonitor = () => {
    const { searchTerm } = useSearch();
    const [scans, setScans] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/radiology/requests');
            setScans(res.data);
        } catch (err) { console.error("Radiology fetch failed"); }
    };

    const utilization = scans.length > 0 ? Math.min(Math.round(scans.length * 8.5), 100) : 0;

    const filteredScans = scans.filter(s =>
        s.scan_type?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
        s.patient_id?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
    );

    return (
        <DashboardLayout role="admin">
            <SectionHeader title="Radiology Hub" subtitle="Manage X-rays, MRIs, and CT scans" />

            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
                <div className="stat-card-white" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0 }}>Scan Queue</h3>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ background: 'linear-gradient(to bottom, #f8fafc, white)', borderBottom: '1px solid rgba(139, 92, 246, 0.08)' }}>
                                    <th style={{ padding: '1.2rem 2.5rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1px' }}>Scan Type</th>
                                    <th style={{ padding: '1.2rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1px' }}>Priority</th>
                                    <th style={{ padding: '1.2rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredScans.map((s) => (
                                    <tr key={s._id} style={{ borderBottom: '1px solid rgba(139, 92, 246, 0.04)' }}>
                                        <td style={{ padding: '1.5rem 2.5rem' }}>
                                            <div style={{ fontWeight: 950, color: '#0f172a', fontSize: '1rem', letterSpacing: '-0.3px' }}>{s.scan_type}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, marginTop: '0.1rem' }}>PATIENT ID: <span style={{ color: '#8b5cf6' }}>{s.patient_id}</span></div>
                                        </td>
                                        <td style={{ padding: '1.5rem 2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: s.priority === 'High' ? '#ef4444' : '#64748b', fontWeight: 900, fontSize: '0.7rem' }}>
                                                {s.priority === 'High' && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />}
                                                {s.priority.toUpperCase()}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem 2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '12px', background: s.status === 'Completed' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(100, 116, 139, 0.08)', color: s.status === 'Completed' ? '#10b981' : '#64748b', width: 'fit-content', border: s.status === 'Completed' ? '1px solid rgba(16, 185, 129, 0.1)' : '1px solid rgba(100, 116, 139, 0.1)' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
                                                <span style={{ fontSize: '0.7rem', fontWeight: 950 }}>{s.status.toUpperCase()}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredScans.length === 0 && <tr><td colSpan="3" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No active imaging requests match your search</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="stat-card-white" style={{ background: '#0f172a', color: 'white', border: 'none', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ padding: '1rem', background: 'rgba(14, 165, 233, 0.15)', borderRadius: '18px', color: '#0ea5e9' }}>
                                <Camera size={24} />
                            </div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#0ea5e9', letterSpacing: '1px', background: 'rgba(14, 165, 233, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>REAL-TIME</span>
                        </div>
                        <div style={{ marginTop: '2rem' }}>
                            <h4 style={{ margin: '0 0 0.4rem 0', fontWeight: 950, fontSize: '1.1rem', letterSpacing: '-0.3px' }}>Scanner Utilization</h4>
                            <p style={{ margin: '0 0 2rem 0', opacity: 0.6, fontSize: '0.8rem', fontWeight: 500 }}>Global throughput efficiency tracking across MRI, CT, and X-Ray modalities.</p>

                            <div style={{ fontSize: '3.2rem', fontWeight: 950, marginBottom: '0.8rem', letterSpacing: '-2px' }}>{utilization}<span style={{ fontSize: '1.5rem', opacity: 0.5, marginLeft: '0.2rem' }}>%</span></div>
                            <div style={{ height: '10px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${utilization}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    style={{ height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #6366f1)', boxShadow: '0 0 15px rgba(14, 165, 233, 0.5)' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="stat-card-white">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#8b5cf6', marginBottom: '1rem' }}>
                            <Monitor size={20} />
                            <div style={{ fontWeight: 800 }}>Scanner Network</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Network Integration</span>
                            <span style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', background: '#dcfce7', color: '#10b981', fontSize: '0.65rem', fontWeight: 900 }}>SECURE</span>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default RadiologyMonitor;

