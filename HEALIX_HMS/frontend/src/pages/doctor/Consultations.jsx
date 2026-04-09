import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Search, ClipboardList, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from '../admin/SectionHeader';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Consultations = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/appointment/doctor/all');
            setAppointments(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch appointments", err);
            setLoading(false);
        }
    };

    const filtered = appointments.filter(a =>
        a.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="doctor">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
            >
                <SectionHeader
                    title="Clinical Consultations"
                    subtitle="Live patient queue and scheduled encounter management"
                />

                <div className="glass-v3" style={{ padding: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
                        <input
                            placeholder="Filter queue by Patient ID or reason..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontWeight: 600 }}
                        />
                    </div>
                    <button
                        onClick={fetchAppointments}
                        style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', background: '#0f172a', color: 'white', border: 'none', fontWeight: 900, cursor: 'pointer' }}
                    >
                        REFRESH QUEUE
                    </button>
                </div>

                <div className="glass-v3" style={{ overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase' }}>Patient identity</th>
                                <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase' }}>Scheduled Time</th>
                                <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase' }}>Clinical Context</th>
                                <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase' }}>Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>Synchronizing clinical queue...</td></tr>
                            ) : filtered.length > 0 ? filtered.map((a, idx) => (
                                <tr key={a._id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'white' : 'rgba(248, 250, 252, 0.5)' }}>
                                    <td style={{ padding: '1.2rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                            <div style={{ padding: '0.6rem', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', borderRadius: '10px' }}><User size={18} /></div>
                                            <span style={{ fontWeight: 800, color: '#0f172a' }}>{a.patient_id}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.2rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0ea5e9', fontWeight: 800 }}>
                                            <Clock size={16} /> {a.time}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.2rem 2rem' }}>
                                        <div style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>{a.reason}</div>
                                    </td>
                                    <td style={{ padding: '1.2rem 2rem' }}>
                                        <span style={{ padding: '0.4rem 0.8rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 900, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                                            SCHEDULED
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.2rem 2rem' }}>
                                        <button
                                            onClick={() => window.location.href = `/doctor/emr?id=${a.patient_id}`}
                                            style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', background: '#0f172a', color: 'white', border: 'none', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer' }}
                                        >
                                            OPEN EMR
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>No appointments registered for the current session.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </DashboardLayout>
    );
};

export default Consultations;
