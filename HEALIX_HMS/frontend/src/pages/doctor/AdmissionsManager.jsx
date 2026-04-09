import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, User, Clipboard, CheckCircle, AlertTriangle, Building, Truck } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from '../admin/SectionHeader';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdmissionsManager = () => {
    const { user } = useAuth();
    const [form, setForm] = useState({ patient_id: '', priority: 'Routine', diagnosis: '' });
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/ward/admission-request', {
                ...form,
                doctor_id: user.username,
                patient_name: `Patient ${form.patient_id}`,
                status: 'Pending'
            });
            setMsg('Hospitalization request dispatched to front desk.');
            setForm({ patient_id: '', priority: 'Routine', diagnosis: '' });
            setLoading(false);
            setTimeout(() => setMsg(''), 3000);
        } catch (err) { setMsg('Admission request synchronization failed.'); setLoading(false); }
    };

    return (
        <DashboardLayout role="doctor">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
            >
                <SectionHeader title="Hospitalization Protocol" subtitle="Initiate ward allocation and patient admission requests" />

                <div className="glass-v3" style={{ padding: '3.5rem', borderTop: '8px solid #f59e0b' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase' }}>Patient identity (UID)</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input value={form.patient_id} onChange={e => setForm({ ...form, patient_id: e.target.value })} placeholder="P-XXXX" style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 950 }} required />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase' }}>Admission Severity</label>
                                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={{ padding: '1.2rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 950, outline: 'none' }}>
                                    <option value="Routine">Routine Care</option>
                                    <option value="Urgent">Urgent Ward</option>
                                    <option value="Emergency">ICU/Emergency</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase' }}>Clinical Rationale for Admission</label>
                            <textarea value={form.diagnosis} onChange={e => setForm({ ...form, diagnosis: e.target.value })} placeholder="Document clinical findings and care pathway requiring static hospitalization..." style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, minHeight: '180px', color: '#1e293b', lineHeight: 1.6, resize: 'none', outline: 'none' }} required />
                        </div>

                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'rgba(14, 165, 233, 0.05)', padding: '1.5rem', borderRadius: '16px' }}>
                            <Building size={32} color="#0ea5e9" />
                            <div>
                                <h4 style={{ margin: 0, fontWeight: 950, color: '#0f172a' }}>Bed Allocation Logic</h4>
                                <p style={{ margin: '0.3rem 0 0 0', fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>Request will be transmitted to the Building Manager for immediate room/bed synchronization.</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '1.5rem',
                                borderRadius: '16px',
                                background: '#f59e0b',
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
                            <Truck size={24} />
                            {loading ? 'DISPATCHING...' : 'INITIATE TRIPARTITE SYNC'}
                        </button>
                    </form>
                    {msg && (
                        <div style={{ marginTop: '2rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', color: '#10b981', fontWeight: 950 }}>
                            <CheckCircle size={20} />
                            {msg}
                        </div>
                    )}
                </div>
            </motion.div>
        </DashboardLayout>
    );
};

export default AdmissionsManager;
