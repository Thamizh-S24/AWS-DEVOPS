import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, User, Activity, CheckCircle, Save, Database, ClipboardCheck } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from '../admin/SectionHeader';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const SessionTerminal = () => {
    const { user } = useAuth();
    const [form, setForm] = useState({ patient_id: '', diagnosis: '', clinical_notes: '' });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/patient/records', {
                patient_id: form.patient_id,
                doctor_id: user.username,
                diagnosis: form.diagnosis,
                prescription: form.clinical_notes,
                date: new Date().toLocaleDateString()
            });
            setMsg('Clinical encounter synchronized to master registry.');
            setForm({ patient_id: '', diagnosis: '', clinical_notes: '' });
            setLoading(false);
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            setMsg('Registry synchronization failed.');
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="doctor">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
            >
                <SectionHeader
                    title="Clinical Session Terminal"
                    subtitle="Finalize encounter documentation and registry synchronization"
                />

                <div className="glass-v3" style={{ padding: '3rem', borderLeft: '8px solid #0d9488', background: 'linear-gradient(135deg, white, #f8fafc)' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Encounter Patient UID</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    placeholder="P-XXXX"
                                    value={form.patient_id}
                                    onChange={e => setForm({ ...form, patient_id: e.target.value })}
                                    style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 950, color: '#0f172a', outline: 'none' }}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Principal Clinical Diagnosis (ICD-10)</label>
                            <div style={{ position: 'relative' }}>
                                <Activity size={18} color="#0d9488" style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    placeholder="Enter clinical categorization..."
                                    value={form.diagnosis}
                                    onChange={e => setForm({ ...form, diagnosis: e.target.value })}
                                    style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 950, color: '#0f172a', outline: 'none' }}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Clinical Observations & Care Narrative</label>
                            <textarea
                                placeholder="Document findings, symptoms, and longitudinal care plan..."
                                value={form.clinical_notes}
                                onChange={e => setForm({ ...form, clinical_notes: e.target.value })}
                                style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 600, minHeight: '220px', color: '#1e293b', lineHeight: 1.7, resize: 'none', outline: 'none' }}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '1.5rem',
                                borderRadius: '16px',
                                background: 'var(--grad-main)',
                                color: 'white',
                                border: 'none',
                                fontWeight: 950,
                                fontSize: '1.1rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '1rem'
                            }}
                        >
                            <Database size={24} />
                            {loading ? 'SYNCHRONIZING...' : 'SYNC TO MASTER REGISTRY'}
                        </button>
                    </form>
                    {msg && (
                        <div style={{ marginTop: '2rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', color: '#10b981', fontWeight: 950 }}>
                            <ClipboardCheck size={20} />
                            {msg}
                        </div>
                    )}
                </div>
            </motion.div>
        </DashboardLayout>
    );
};

export default SessionTerminal;
