import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertCircle, UserCheck, MapPin, Clock, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from './SectionHeader';
import api from '../../services/api';
import { useSearch } from '../../context/SearchContext';

const AdminEmergency = () => {
    const { searchTerm } = useSearch();
    const [cases, setCases] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [casesRes, docsRes] = await Promise.all([
                api.get('/emergency/cases'),
                api.get('/hr/staff?role=doctor')
            ]);
            setCases(casesRes.data);
            setDoctors(docsRes.data);
        } catch (err) { console.error("Emergency sync failed"); }
    };

    const handleAssignDoctor = async (caseId, doctorId) => {
        try {
            await api.patch(`/emergency/case/${caseId}/assign`, null, { params: { doctor_id: doctorId } });
            setMsg('Doctor dispatched to emergency terminal');
            fetchData();
            setTimeout(() => setMsg(''), 3000);
        } catch (err) { setMsg('Assignment failed'); }
    };

    const getTriageColor = (level) => {
        const colors = {
            1: '#ef4444', // Immediate
            2: '#f97316', // Emergent
            3: '#f59e0b', // Urgent
            4: '#10b981', // Less Urgent
            5: '#6366f1'  // Non-Urgent
        };
        return colors[level] || '#94a3b8';
    };

    const filteredCases = cases.filter(c =>
        c.patient_name?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
        c.status?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
    );

    return (
        <DashboardLayout role="admin">
            <SectionHeader
                title="Critical Care Monitor"
                subtitle="Live emergency triage & physician coordination mesh"
            />

            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) 400px', gap: '3.5rem' }}>
                {/* Active Emergency Queue */}
                <div className="glass-v3" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                    <div style={{ padding: '1.8rem 2.5rem', background: 'rgba(239, 68, 68, 0.02)', borderBottom: '1px solid rgba(239, 68, 68, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 950, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Live Emergency Queue</h3>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, margin: '0.3rem 0 0 0' }}>{filteredCases.length} Critical incidents being handled</p>
                        </div>
                        <div className="pulse-dot" style={{ background: '#ef4444', boxShadow: '0 0 12px #ef4444' }} />
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
                            <thead>
                                <tr style={{ background: 'white', borderBottom: '1.5px solid #f1f5f9' }}>
                                    <th style={{ padding: '1.5rem 2.5rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1.5px' }}>Patient Identity</th>
                                    <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1.5px' }}>Triage Priority</th>
                                    <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1.5px' }}>Medical Lead</th>
                                    <th style={{ padding: '1.5rem 2.5rem', textAlign: 'right', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1.5px' }}>Clinical Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filteredCases.map((c) => (
                                        <motion.tr
                                            key={c._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            whileHover={{ background: 'rgba(239, 68, 68, 0.01)' }}
                                            style={{ borderBottom: '1px solid #fbfcfe' }}
                                        >
                                            <td style={{ padding: '1.8rem 2.5rem' }}>
                                                <div style={{ fontWeight: 950, color: '#0f172a', fontSize: '1.05rem', letterSpacing: '-0.3px' }}>{c.patient_name || 'Anonymous Patient'}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, marginTop: '0.3rem' }}>ID: {c._id?.slice(-8).toUpperCase() || 'EXTERNAL'}</div>
                                            </td>
                                            <td style={{ padding: '1.8rem 2rem' }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.6rem',
                                                    padding: '0.6rem 1.2rem',
                                                    borderRadius: '50px',
                                                    background: `${getTriageColor(c.priority)}15`,
                                                    color: getTriageColor(c.priority),
                                                    width: 'fit-content',
                                                    border: `1px solid ${getTriageColor(c.priority)}20`,
                                                    fontWeight: 950,
                                                    fontSize: '0.75rem',
                                                    letterSpacing: '0.5px'
                                                }}>
                                                    <AlertTriangle size={14} />
                                                    {(c.priority || 'unknown').toUpperCase()}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.8rem 2rem' }}>
                                                <div style={{ position: 'relative' }}>
                                                    <select
                                                        value={c.doctor_id || ''}
                                                        onChange={(e) => handleAssignDoctor(c._id, e.target.value)}
                                                        style={{
                                                            padding: '0.8rem 1.2rem',
                                                            borderRadius: '12px',
                                                            border: '1.5px solid #f1f5f9',
                                                            fontSize: '0.85rem',
                                                            fontWeight: 800,
                                                            background: 'white',
                                                            color: '#334155',
                                                            cursor: 'pointer',
                                                            width: '100%',
                                                            minWidth: '200px'
                                                        }}
                                                        className="input-focus-aura"
                                                    >
                                                        <option value="">Awaiting Physician...</option>
                                                        {doctors.map(d => <option key={d.username} value={d.username}>DR. {d.full_name?.toUpperCase()}</option>)}
                                                    </select>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.8rem 2.5rem', textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8rem', padding: '0.6rem 1.2rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                                    <div className="pulse-dot" style={{ width: '8px', height: '8px', background: '#3b82f6', boxShadow: '0 0 8px rgba(59, 130, 246, 0.4)' }} />
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#334155', letterSpacing: '0.5px' }}>{(c.status || 'waiting').toUpperCase()}</span>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {cases.length === 0 && (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>No active emergency cases reported</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="stat-card-white" style={{ background: '#0f172a', color: 'white', border: 'none' }}>
                        <h4 style={{ margin: '0 0 1.5rem 0', fontWeight: 900, fontSize: '1rem' }}>ER Utilization</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.4rem', opacity: 0.6 }}>
                                    <span>Active Resuscitation</span>
                                    <span>{cases.filter(c => c.triage_level === 1).length} Cases</span>
                                </div>
                                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                                    <div style={{ height: '100%', width: '40%', background: '#ef4444', borderRadius: '3px' }} />
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.4rem', opacity: 0.6 }}>
                                    <span>Waiting Queue</span>
                                    <span>{cases.filter(c => c.status === 'Waiting').length} Cases</span>
                                </div>
                                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                                    <div style={{ height: '100%', width: '65%', background: '#0ea5e9', borderRadius: '3px' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card-white" style={{ background: '#f8fafc', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#ef4444' }}>
                            <div style={{ padding: '0.6rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px' }}>
                                <AlertCircle size={24} />
                            </div>
                            <div style={{ fontWeight: 950, fontSize: '1rem', letterSpacing: '-0.3px' }}>HEC Protocol Active</div>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '1.2rem 0', fontWeight: 500, lineHeight: 1.5 }}>High Emergency Load detected: Redirecting non-urgent cases to general consultation terminal.</p>
                        <button style={{ width: '100%', padding: '0.9rem', borderRadius: '14px', background: 'white', border: '1px solid rgba(14, 165, 233, 0.1)', color: '#0f172a', fontWeight: 900, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>UPDATE ER GUIDELINES</button>
                    </div>
                </div>
            </div>
            {msg && <p style={{ textAlign: 'center', marginTop: '2rem', color: '#10b981', fontWeight: 800 }}>{msg}</p>}
        </DashboardLayout>
    );
};

export default AdminEmergency;

