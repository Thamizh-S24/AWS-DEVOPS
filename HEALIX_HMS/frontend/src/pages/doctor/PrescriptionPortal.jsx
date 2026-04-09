import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pill, User, Clipboard, CheckCircle, AlertTriangle, Search, Info, Plus } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from '../admin/SectionHeader';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PrescriptionPortal = () => {
    const { user } = useAuth();
    const [patientId, setPatientId] = useState('');
    const [medications, setMedications] = useState([{ name: '', dosage: '', duration: '', notes: '', stockStatus: null }]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const checkStock = async (med, index) => {
        if (!med || med.length < 3) return;
        try {
            const res = await api.get(`/pharmacy/check-stock/${med}`);
            let status = null;
            if (res.data.status === 'not_found' || res.data.stock <= 0) {
                status = { type: 'error', msg: 'CRITICAL: Medication unavailable.' };
            } else if (res.data.stock < 15) {
                status = { type: 'warning', msg: `Low stock: ${res.data.stock} units.` };
            } else {
                status = { type: 'success', msg: `Available (${res.data.stock} units).` };
            }
            const updated = [...medications];
            updated[index].stockStatus = status;
            setMedications(updated);
        } catch (err) {
            const updated = [...medications];
            updated[index].stockStatus = null;
            setMedications(updated);
        }
    };

    const addMedication = () => {
        setMedications([...medications, { name: '', dosage: '', duration: '', notes: '', stockStatus: null }]);
    };

    const removeMedication = (index) => {
        if (medications.length > 1) {
            setMedications(medications.filter((_, i) => i !== index));
        }
    };

    const updateMedication = (index, field, value) => {
        const updated = [...medications];
        updated[index][field] = value;
        setMedications(updated);
        if (field === 'name') {
            checkStock(value, index);
        }
    };

    const handlePrescribe = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/doctor/prescription', {
                patient_id: patientId,
                doctor_id: user.username,
                medications: medications.map(m => ({ name: m.name, dosage: m.dosage, duration: m.duration })),
                notes: medications.map(m => m.notes).join(' | ')
            });
            setMsg('Multi-RX E-Prescription authorized and transmitted.');
            setPatientId('');
            setMedications([{ name: '', dosage: '', duration: '', notes: '', stockStatus: null }]);
            setLoading(false);
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            setMsg('Prescription authorization failed.');
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
                    title="Advanced e-Prescription Portal"
                    subtitle="Multi-medicine clinical RX authorization with real-time stock sync"
                />

                <div className="glass-v3" style={{ padding: '3rem', borderTop: '6px solid #0ea5e9' }}>
                    <form onSubmit={handlePrescribe} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Patient Identity (UID)</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    value={patientId}
                                    onChange={e => setPatientId(e.target.value)}
                                    placeholder="P-XXXX"
                                    style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 950, color: '#0f172a', outline: 'none' }}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {medications.map((med, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="glass-v3"
                                    style={{ padding: '2rem', border: '1px solid rgba(14, 165, 233, 0.1)', background: 'rgba(248, 250, 252, 0.3)' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                            <div style={{ padding: '0.5rem', background: '#0ea5e9', color: 'white', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 950 }}>MED #{idx + 1}</div>
                                            <h4 style={{ margin: 0, fontWeight: 950, color: '#0f172a' }}>Pharma SKU Entry</h4>
                                        </div>
                                        {medications.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeMedication(idx)}
                                                style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
                                            >
                                                REMOVE
                                            </button>
                                        )}
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                        <div style={{ position: 'relative' }}>
                                            <Pill size={16} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                            <input
                                                value={med.name}
                                                onChange={e => updateMedication(idx, 'name', e.target.value)}
                                                placeholder="Medication Name..."
                                                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, outline: 'none' }}
                                                required
                                            />
                                        </div>
                                        <input
                                            value={med.dosage}
                                            onChange={e => updateMedication(idx, 'dosage', e.target.value)}
                                            placeholder="Dosage (e.g. 500mg BID)"
                                            style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, outline: 'none' }}
                                            required
                                        />
                                        <input
                                            value={med.duration}
                                            onChange={e => updateMedication(idx, 'duration', e.target.value)}
                                            placeholder="Duration (e.g. 7 Days)"
                                            style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, outline: 'none' }}
                                            required
                                        />
                                    </div>
                                    <input
                                        value={med.notes}
                                        onChange={e => updateMedication(idx, 'notes', e.target.value)}
                                        placeholder="Instructional caveats / notes..."
                                        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 600, outline: 'none' }}
                                    />

                                    {med.stockStatus && (
                                        <div style={{
                                            marginTop: '1rem',
                                            padding: '0.8rem 1.2rem',
                                            borderRadius: '10px',
                                            background: med.stockStatus.type === 'error' ? 'rgba(239, 68, 68, 0.05)' : med.stockStatus.type === 'warning' ? 'rgba(245, 158, 11, 0.05)' : 'rgba(16, 185, 129, 0.05)',
                                            color: med.stockStatus.type === 'error' ? '#ef4444' : med.stockStatus.type === 'warning' ? '#f59e0b' : '#10b981',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.8rem',
                                            fontWeight: 800,
                                            fontSize: '0.85rem'
                                        }}>
                                            <Info size={16} />
                                            {med.stockStatus.msg}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <button
                                type="button"
                                onClick={addMedication}
                                style={{ flex: 1, padding: '1.5rem', borderRadius: '16px', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', border: '2px dashed #0ea5e9', fontWeight: 950, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
                            >
                                <Plus size={20} /> ADD ANOTHER MEDICINE
                            </button>

                            <button
                                type="submit"
                                disabled={loading || medications.some(m => m.stockStatus?.type === 'error')}
                                style={{
                                    flex: 1.5,
                                    padding: '1.5rem',
                                    borderRadius: '16px',
                                    background: 'var(--grad-main)',
                                    color: 'white',
                                    border: 'none',
                                    fontWeight: 950,
                                    fontSize: '1.2rem',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '1rem',
                                    boxShadow: '0 10px 30px rgba(14, 165, 233, 0.2)'
                                }}
                            >
                                <CheckCircle size={24} />
                                {loading ? 'AUTHORIZING MULTI-RX...' : 'AUTHORIZE CLINICAL RX SUITE'}
                            </button>
                        </div>
                    </form>
                    {msg && <p style={{ textAlign: 'center', color: '#10b981', fontWeight: 950, marginTop: '2rem', fontSize: '1.1rem' }}>{msg}</p>}
                </div>
            </motion.div>
        </DashboardLayout>
    );
};

export default PrescriptionPortal;
