import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from '../admin/SectionHeader';

const ReceptionistRegistry = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await api.get('/patient/all');
                setPatients(res.data || []);
            } catch (err) {
                console.error("Failed to fetch patients:", err);
                setError("Clinical database offline");
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    return (
        <DashboardLayout role="receptionist">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
            >
                <SectionHeader
                    title="Front Desk Registry"
                    subtitle="Manage patient check-ins and clinical routing"
                    action={
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ position: 'relative' }}>
                                <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
                                <input
                                    placeholder="Find patient file..."
                                    style={{ padding: '0.6rem 1rem 0.6rem 2.8rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.85rem' }}
                                />
                            </div>
                        </div>
                    }
                />

                <div className="glass-v3" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'linear-gradient(to right, #f8fafc, #f1f5f9)' }}>
                            <tr>
                                <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800 }}>Identity / Case ID</th>
                                <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800 }}>Visit Type</th>
                                <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800 }}>Timeline</th>
                                <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800 }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', fontWeight: 700 }}>
                                        <div className="pulse-dot" style={{ margin: '0 auto 1rem' }} />
                                        SYNCING CLINICAL DATABASE...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: '#ef4444', fontWeight: 700 }}>
                                        {error}
                                    </td>
                                </tr>
                            ) : patients.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', fontWeight: 700 }}>
                                        NO PATIENTS REGISTERED IN SYSTEM
                                    </td>
                                </tr>
                            ) : (
                                patients.map((p, i) => (
                                    <motion.tr
                                        key={p._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        whileHover={{ backgroundColor: 'rgba(241, 245, 249, 0.5)' }}
                                        style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}
                                    >
                                        <td style={{ padding: '1.5rem 2rem' }}>
                                            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem' }}>{p.name}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.5px' }}>CASE ID: {p._id.toUpperCase()}</div>
                                        </td>
                                        <td style={{ padding: '1.5rem 2rem' }}>
                                            <span style={{
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '10px',
                                                fontSize: '0.7rem',
                                                fontWeight: 900,
                                                background: 'rgba(241, 245, 249, 0.8)',
                                                color: '#64748b',
                                                border: '1px solid #e2e8f0'
                                            }}>
                                                GENERAL {p.gender?.toUpperCase() || 'N/A'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.5rem 2rem', color: '#0ea5e9', fontWeight: 800 }}>
                                            {p.age} YEARS OLD
                                        </td>
                                        <td style={{ padding: '1.5rem 2rem' }}>
                                            <span style={{
                                                padding: '0.4rem 1rem',
                                                borderRadius: '12px',
                                                background: 'rgba(16, 185, 129, 0.1)',
                                                color: '#10b981',
                                                fontSize: '0.7rem',
                                                fontWeight: 900,
                                                border: '1px solid rgba(16, 185, 129, 0.2)'
                                            }}>
                                                RECORD ACTIVE
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </DashboardLayout>
    );
};

export default ReceptionistRegistry;
