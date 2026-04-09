import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from '../admin/SectionHeader';
import api from '../../services/api';

const ReceptionistEmergency = () => {
    const [emForm, setEmForm] = useState({ patient_name: '', triage_level: 3 });
    const [msg, setMsg] = useState('');

    const handleEmergencyArrival = async (e) => {
        e.preventDefault();
        try {
            const fees = { 1: 1500, 2: 1000, 3: 500, 4: 250, 5: 100 };
            const res = await api.post('/emergency/case', {
                patient_name: emForm.patient_name,
                triage_level: parseInt(emForm.triage_level),
                status: 'Waiting'
            });

            // Synergy: Trigger Billing
            await api.post('/billing/invoice/create', {
                patient_id: 'EM-' + Date.now().toString().slice(-4),
                items: [{
                    description: `Emergency Triage (Level ${emForm.triage_level})`,
                    amount: fees[emForm.triage_level],
                    category: 'Emergency'
                }],
                total_amount: fees[emForm.triage_level],
                status: 'Unpaid'
            });

            setMsg(`Emergency alert broadcasted. Bill generated: $${fees[emForm.triage_level]}`);
            setEmForm({ patient_name: '', triage_level: 3 });
            setTimeout(() => setMsg(''), 5000);
        } catch (err) { setMsg('Emergency registration failed'); }
    };

    const getTriageColor = (level) => {
        const colors = { 1: '#ef4444', 2: '#f97316', 3: '#f59e0b', 4: '#eab308', 5: '#84cc16' };
        return colors[level] || '#0ea5e9';
    };

    return (
        <DashboardLayout role="receptionist">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)', boxShadow: '0 10px 25px rgba(239, 68, 68, 0.15)' }}>
                        <AlertTriangle size={40} />
                    </div>
                    <SectionHeader title="Emergency Arrival Terminal" subtitle="Broadcast triage alerts & initiate clinical records immediately" />
                </div>

                <AnimatePresence>
                    {msg && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            style={{ padding: '1rem 1.5rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderRadius: '16px', fontWeight: 900, border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '0.8rem', justifyContent: 'center' }}>
                            <CheckCircle size={20} /> {msg}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="glass-v3" style={{ padding: '3rem', borderTop: `6px solid ${getTriageColor(emForm.triage_level)}`, transition: 'border-color 0.3s' }}>
                    <form onSubmit={handleEmergencyArrival} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 950, color: '#64748b', letterSpacing: '1px' }}>PATIENT NAME OR PROVISIONAL ID</label>
                            <input
                                placeholder="e.g. Unknown Male / Alice Wong"
                                value={emForm.patient_name}
                                onChange={e => setEmForm({ ...emForm, patient_name: e.target.value })}
                                style={{ padding: '1.2rem', borderRadius: '16px', border: '2px solid #e2e8f0', background: '#f8fafc', fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', outline: 'none', transition: 'border-color 0.2s' }}
                                onFocus={e => e.target.style.borderColor = '#0ea5e9'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 950, color: '#64748b', letterSpacing: '1px' }}>TRIAGE PRIORITY CLASSIFICATION</label>
                            <select
                                value={emForm.triage_level}
                                onChange={e => setEmForm({ ...emForm, triage_level: e.target.value })}
                                style={{ padding: '1.2rem', borderRadius: '16px', border: '2px solid #e2e8f0', background: '#f8fafc', fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', outline: 'none', appearance: 'none', cursor: 'pointer' }}
                            >
                                <option value={1}>Level 1 - Resuscitation (Immediate)</option>
                                <option value={2}>Level 2 - Emergent (Within 15 mins)</option>
                                <option value={3}>Level 3 - Urgent (Within 30 mins)</option>
                                <option value={4}>Level 4 - Less Urgent (Within 60 mins)</option>
                                <option value={5}>Level 5 - Non-Urgent (Within 120 mins)</option>
                            </select>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="btn-vitalize"
                            style={{
                                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                padding: '1.2rem',
                                marginTop: '1rem',
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '0.8rem',
                                fontSize: '1.1rem',
                                boxShadow: '0 10px 20px rgba(239, 68, 68, 0.3)'
                            }}
                        >
                            <Activity size={24} /> INITIATE EMERGENCY PROTOCOL
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </DashboardLayout>
    );
};

export default ReceptionistEmergency;
