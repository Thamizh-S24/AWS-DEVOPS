import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Thermometer, Shield } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from '../admin/SectionHeader';
import api from '../../services/api';

const NurseVitals = () => {
    const [msg, setMsg] = useState('');
    const [vitalsForm, setVitalsForm] = useState({ patient_id: '', temp: '', bp: '', notes: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleVitals = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.patch(`/clinical/records/${vitalsForm.patient_id}/vitals`, {
                temperature: vitalsForm.temp,
                blood_pressure: vitalsForm.bp,
                notes: vitalsForm.notes
            });
            setMsg('Vitals successfully synchronized with Central EMR');
            setVitalsForm({ patient_id: '', temp: '', bp: '', notes: '' });
            setTimeout(() => setMsg(''), 4000);
        } catch (err) {
            setMsg('EMR Synchronization failed. Verify Patient ID.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout role="nurse">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}
            >
                <SectionHeader title="Bedside Vitals Capture" subtitle="Secure clinical data entry gateway" />

                <div className="glass-v3" style={{ padding: '3.5rem', background: 'linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(241, 245, 249, 0.4))', border: '1px solid rgba(14, 165, 233, 0.1)', boxShadow: '0 25px 50px -12px rgba(14, 165, 233, 0.15)' }}>
                    <form onSubmit={handleVitals} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>Verify Patient UID</label>
                            <input
                                value={vitalsForm.patient_id}
                                onChange={e => setVitalsForm({ ...vitalsForm, patient_id: e.target.value })}
                                placeholder="e.g., P-001"
                                className="input-v3"
                                style={{ padding: '1.2rem', borderRadius: '16px', border: '2px solid rgba(14, 165, 233, 0.2)', background: 'rgba(255, 255, 255, 0.8)', fontWeight: 900, fontSize: '1.1rem', transition: 'all 0.3s ease', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>Core Temperature (°C)</label>
                                <div style={{ position: 'relative' }}>
                                    <Thermometer style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#0ea5e9' }} size={22} />
                                    <input
                                        value={vitalsForm.temp}
                                        onChange={e => setVitalsForm({ ...vitalsForm, temp: e.target.value })}
                                        placeholder="36.5"
                                        className="input-v3"
                                        style={{ padding: '1.2rem 1.2rem 1.2rem 3.5rem', width: '100%', borderRadius: '16px', border: '1px solid rgba(14, 165, 233, 0.2)', background: 'rgba(255, 255, 255, 0.7)', outline: 'none', fontWeight: 800, fontSize: '1.2rem', color: '#0f172a' }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>Blood Pressure (mmHg)</label>
                                <div style={{ position: 'relative' }}>
                                    <Activity style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#ef4444' }} size={22} />
                                    <input
                                        value={vitalsForm.bp}
                                        onChange={e => setVitalsForm({ ...vitalsForm, bp: e.target.value })}
                                        placeholder="120/80"
                                        className="input-v3"
                                        style={{ padding: '1.2rem 1.2rem 1.2rem 3.5rem', width: '100%', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(255, 255, 255, 0.7)', outline: 'none', fontWeight: 800, fontSize: '1.2rem', color: '#0f172a' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>Nursing Observations & Interventions</label>
                            <textarea
                                value={vitalsForm.notes}
                                onChange={e => setVitalsForm({ ...vitalsForm, notes: e.target.value })}
                                placeholder="Document subjective patient reports and objective bedside observations..."
                                className="input-v3"
                                style={{ padding: '1.5rem', borderRadius: '18px', border: '1px solid rgba(14, 165, 233, 0.2)', background: 'rgba(255, 255, 255, 0.7)', outline: 'none', minHeight: '160px', resize: 'vertical', fontWeight: 500, fontSize: '1.1rem', lineHeight: '1.6', color: '#334155' }}
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: '0 15px 30px -10px rgba(14, 165, 233, 0.5)' }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={submitting}
                            className="btn-vitalize"
                            style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', padding: '1.4rem', fontSize: '1.1rem', borderRadius: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', border: 'none', color: 'white', fontWeight: 900, letterSpacing: '1px', marginTop: '1rem' }}
                        >
                            <Shield size={24} /> {submitting ? 'Encrypting & Transmitting...' : 'AUTHORIZE & SYNCHRONIZE RECORD'}
                        </motion.button>

                        {msg && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', color: msg.includes('failed') ? '#ef4444' : '#10b981', fontWeight: 800, padding: '1rem', background: msg.includes('failed') ? '#fee2e2' : '#dcfce7', borderRadius: '12px' }}>
                                {msg}
                            </motion.div>
                        )}
                    </form>
                </div>
            </motion.div>
        </DashboardLayout>
    );
};

export default NurseVitals;
