import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Calendar, Activity, Monitor } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from '../admin/SectionHeader';
import api from '../../services/api';

const NursePatientSummary = () => {
    const [searchId, setSearchId] = useState('');
    const [records, setRecords] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');
        setProfile(null);
        try {
            const [recordsRes, ehrRes] = await Promise.all([
                api.get(`/patient/records/${searchId}`),
                api.get(`/patient/ehr/${searchId}`).catch(() => ({ data: null }))
            ]);
            setRecords(recordsRes.data);
            setProfile(ehrRes.data);
            setLoading(false);
        } catch (err) {
            setError('Patient ID not found or records unavailable.');
            setRecords([]);
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="nurse">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '1000px', margin: '0 auto' }}
            >
                <SectionHeader title="Clinical Context Lookup" subtitle="Immediate access to longitudinal patient health summaries" />

                <div className="glass-v3" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Search style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
                            <input
                                placeholder="Scan or Enter Patient UID (e.g., P-001)..."
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                style={{ width: '100%', padding: '1.1rem 1.1rem 1.1rem 3.5rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontWeight: 700, fontSize: '1rem' }}
                            />
                        </div>
                        <button type="submit" className="btn-vitalize" style={{ padding: '1.1rem 2.5rem', width: 'auto' }}>
                            FETCH RECORDS
                        </button>
                    </form>
                    {error && <p style={{ margin: 0, color: '#ef4444', fontWeight: 800, fontSize: '0.9rem' }}>{error}</p>}
                </div>

                {!loading && profile && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        <div className="glass-v3" style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.03)', borderLeft: '4px solid #ef4444' }}>
                            <h4 style={{ margin: '0 0 1rem 0', color: '#ef4444', fontSize: '0.85rem', fontWeight: 950, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Activity size={16} /> Known Allergies / Precautions
                            </h4>
                            {profile.allergies && profile.allergies.length > 0 ? (
                                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.6 }}>
                                    {profile.allergies.map((a, i) => <li key={i}>{a}</li>)}
                                </ul>
                            ) : (
                                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>No known allergies documented.</div>
                            )}
                        </div>

                        <div className="glass-v3" style={{ padding: '1.5rem', background: 'rgba(14, 165, 233, 0.03)', borderLeft: '4px solid #0ea5e9' }}>
                            <h4 style={{ margin: '0 0 1rem 0', color: '#0ea5e9', fontSize: '0.85rem', fontWeight: 950, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Monitor size={16} /> Active Diagnoses
                            </h4>
                            {profile.diagnosis && profile.diagnosis.length > 0 ? (
                                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.6 }}>
                                    {profile.diagnosis.map((d, i) => <li key={i}>{d}</li>)}
                                </ul>
                            ) : (
                                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>No active chronic diagnoses.</div>
                            )}
                        </div>
                    </div>
                )}

                {!loading && records.length > 0 && (
                    <div className="glass-v3" style={{ padding: '2rem' }}>
                        <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: 950, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar size={20} color="#0ea5e9" /> Recent Nursing & Clinical Notes
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {records.slice(0, 5).map((r, i) => (
                                <div key={i} style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                        <span style={{ fontWeight: 800, color: '#0ea5e9', fontSize: '0.85rem' }}>{r.date}</span>
                                        <span style={{ fontWeight: 800, color: '#64748b', fontSize: '0.85rem' }}>Author: {r.doctor_id}</span>
                                    </div>
                                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: 700, color: '#0f172a' }}>{r.diagnosis}</p>
                                    <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem', lineHeight: 1.5 }}>{r.prescription}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!loading && profile === null && records.length === 0 && searchId && !error && (
                    <div style={{ padding: '4rem', textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                            <FileText size={40} color="#0ea5e9" style={{ opacity: 0.3 }} />
                        </div>
                        <h4 style={{ fontWeight: 950, color: '#0f172a', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Awaiting Search Query</h4>
                        <p style={{ color: '#64748b', fontWeight: 500 }}>Enter a Patient UID to securely pull their clinical context.</p>
                    </div>
                )}

            </motion.div>
        </DashboardLayout>
    );
};

export default NursePatientSummary;
