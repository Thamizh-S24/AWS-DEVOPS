import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Pill, Shield } from 'lucide-react';
import PatientLayout from '../../components/PatientLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PatientSectionHeader = ({ title, subtitle }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 950, color: '#1e3a8a', margin: 0, letterSpacing: '-1px' }}>{title}</h2>
            <div style={{ height: '5px', width: '80px', background: 'linear-gradient(90deg, #1e40af, #3b82f6)', borderRadius: '2px', margin: '0.8rem 0' }} />
            <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.4rem', fontWeight: 500 }}>{subtitle}</p>
        </div>
    </div>
);

const PatientRecords = () => {
    const { user } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchRecords();
        }
    }, [user]);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/patient/records/${user.username}`);
            setRecords(res.data);
        } catch (err) {
            console.error("Error fetching patient records");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PatientLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                <section>
                    <PatientSectionHeader
                        title="My Health Records"
                        subtitle="Access your medical history, test results, and prescriptions in one place"
                    />
                    <div className="stat-card-white" style={{ padding: 0, overflow: 'hidden' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '6rem 3rem', color: '#94a3b8', fontWeight: 700 }}>VERIFYING EHR DATABASE...</div>
                        ) : records.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '6rem 3rem' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                    <FileText size={40} color="#8b5cf6" style={{ opacity: 0.4 }} />
                                </div>
                                <h4 style={{ fontWeight: 950, color: '#0f172a', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Records Vault Empty</h4>
                                <p style={{ color: '#64748b', fontWeight: 500 }}>Verified clinical reports will appear here once processed by hospital nodes.</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ background: 'linear-gradient(to bottom, #f8fafc, white)', borderBottom: '1px solid rgba(14, 165, 233, 0.08)' }}>
                                            <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 950, letterSpacing: '1px' }}>Date of Visit</th>
                                            <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 950, letterSpacing: '1px' }}>What the Doctor Found</th>
                                            <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 950, letterSpacing: '1px' }}>Doctor's Advice</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records.map((r, i) => (
                                            <tr key={r._id || i} style={{ borderBottom: '1px solid rgba(14, 165, 233, 0.04)' }}>
                                                <td style={{ padding: '1.8rem 2rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontWeight: 950, fontSize: '0.9rem' }}>
                                                        <Calendar size={14} color="#0ea5e9" /> {r.date}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1.8rem 2rem' }}>
                                                    <div style={{ fontWeight: 950, color: '#0f172a', fontSize: '1rem', letterSpacing: '-0.3px' }}>{r.diagnosis}</div>
                                                </td>
                                                <td style={{ padding: '1.8rem 2rem' }}>
                                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.6rem 1.2rem', background: '#eff6ff', borderRadius: '12px', border: '1px solid #dbeafe', color: '#1e40af', fontWeight: 950, fontSize: '0.75rem' }}>
                                                                <Shield size={16} /> DOCTOR-VERIFIED
                                                            </div>
                                                            {r.lab_results && (
                                                                <div style={{ padding: '0.6rem 1.2rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)', color: '#8b5cf6', fontWeight: 950, fontSize: '0.75rem' }}>
                                                                    LAB DATA ATTACHED
                                                                </div>
                                                            )}
                                                            {r.rad_results && (
                                                                <div style={{ padding: '0.6rem 1.2rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '12px', border: '1px solid rgba(14, 165, 233, 0.2)', color: '#0ea5e9', fontWeight: 950, fontSize: '0.75rem' }}>
                                                                    IMAGING SYNCED
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div style={{ color: '#475569', fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.5 }}>{r.prescription}</div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </PatientLayout>
    );
};

export default PatientRecords;
