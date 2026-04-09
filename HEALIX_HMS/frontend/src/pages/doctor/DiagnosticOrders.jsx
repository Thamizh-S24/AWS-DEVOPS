import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Monitor, Search, User, Clipboard, CheckCircle, IndianRupee, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from '../admin/SectionHeader';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const DiagnosticOrders = () => {
    const { user } = useAuth();
    const [labForm, setLabForm] = useState({ patient_id: '', test_type: 'Complete Blood Count (CBC)', priority: 'Normal' });
    const [radForm, setRadForm] = useState({ patient_id: '', scan_type: 'Chest X-Ray', priority: 'Normal' });
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLabRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const labPricing = {
                'Complete Blood Count (CBC)': 45,
                'Basic Metabolic Panel (BMP)': 65,
                'Lipid Panel': 55,
                'Liver Function Test': 80,
                'Urinalysis': 30
            };
            await api.post('/lab/request', { ...labForm, doctor_id: user.username });
            await api.post('/billing/invoice/create', {
                patient_id: labForm.patient_id,
                items: [{ description: `Diagnostic Lab: ${labForm.test_type}`, amount: labPricing[labForm.test_type] || 50, category: 'Diagnostics' }],
                total_amount: labPricing[labForm.test_type] || 50,
                status: 'Unpaid'
            });
            setMsg('Lab diagnostic order dispatched and billed.');
            setLabForm({ ...labForm, patient_id: '' });
            setLoading(false);
            setTimeout(() => setMsg(''), 3000);
        } catch (err) { setMsg('Lab request synchronization failed.'); setLoading(false); }
    };

    const handleRadRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const radPricing = { 'Chest X-Ray': 120, 'MRI Brain': 1200, 'CT Abdomen': 850, 'Ultrasound Pelvis': 250, 'Bone Scan': 400 };
            await api.post('/radiology/request', { ...radForm, doctor_id: user.username });
            await api.post('/billing/invoice/create', {
                patient_id: radForm.patient_id,
                items: [{ description: `Radiology Imaging: ${radForm.scan_type}`, amount: radPricing[radForm.scan_type] || 150, category: 'Diagnostics' }],
                total_amount: radPricing[radForm.scan_type] || 150,
                status: 'Unpaid'
            });
            setMsg('Radiology scan scheduled and billed.');
            setRadForm({ ...radForm, patient_id: '' });
            setLoading(false);
            setTimeout(() => setMsg(''), 3000);
        } catch (err) { setMsg('Radiology request synchronization failed.'); setLoading(false); }
    };

    return (
        <DashboardLayout role="doctor">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
            >
                <SectionHeader title="Diagnostic Ordering Portal" subtitle="Synergized pathology and radiology diagnostic workflows" />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                    {/* Lab Section */}
                    <div className="glass-v3" style={{ padding: '2.5rem', borderLeft: '6px solid #8b5cf6' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <Activity size={24} color="#8b5cf6" />
                            <h3 style={{ margin: 0, fontWeight: 950, color: '#0f172a' }}>Clinical Pathology</h3>
                        </div>
                        <form onSubmit={handleLabRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase' }}>Patient UID</label>
                                <input value={labForm.patient_id} onChange={e => setLabForm({ ...labForm, patient_id: e.target.value })} placeholder="P-XXXX" style={{ padding: '1.1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 950 }} required />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase' }}>Test Categorization</label>
                                <select value={labForm.test_type} onChange={e => setLabForm({ ...labForm, test_type: e.target.value })} style={{ padding: '1.1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 950, outline: 'none' }}>
                                    <option>Complete Blood Count (CBC)</option>
                                    <option>Basic Metabolic Panel (BMP)</option>
                                    <option>Lipid Panel</option>
                                    <option>Liver Function Test</option>
                                    <option>Urinalysis</option>
                                </select>
                            </div>
                            <button type="submit" disabled={loading} className="btn-vitalize" style={{ background: '#8b5cf6', padding: '1.2rem', fontWeight: 950 }}>ORDER LAB ANALYSIS</button>
                        </form>
                    </div>

                    {/* Radiology Section */}
                    <div className="glass-v3" style={{ padding: '2.5rem', borderLeft: '6px solid #3b82f6' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <Monitor size={24} color="#3b82f6" />
                            <h3 style={{ margin: 0, fontWeight: 950, color: '#0f172a' }}>Diagnostic Imaging</h3>
                        </div>
                        <form onSubmit={handleRadRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase' }}>Patient UID</label>
                                <input value={radForm.patient_id} onChange={e => setRadForm({ ...radForm, patient_id: e.target.value })} placeholder="P-XXXX" style={{ padding: '1.1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 950 }} required />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase' }}>Scan/Procedure Protocol</label>
                                <select value={radForm.scan_type} onChange={e => setRadForm({ ...radForm, scan_type: e.target.value })} style={{ padding: '1.1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 950, outline: 'none' }}>
                                    <option>Chest X-Ray</option>
                                    <option>MRI Brain</option>
                                    <option>CT Abdomen</option>
                                    <option>Ultrasound Pelvis</option>
                                    <option>Bone Scan</option>
                                </select>
                            </div>
                            <button type="submit" disabled={loading} className="btn-vitalize" style={{ background: '#3b82f6', padding: '1.2rem', fontWeight: 950 }}>SCHEDULE SCAN</button>
                        </form>
                    </div>
                </div>

                {msg && (
                    <div className="glass-v3" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', color: '#10b981', fontWeight: 950, border: '1px solid #10b981' }}>
                        <CheckCircle size={20} />
                        {msg}
                    </div>
                )}

                <div className="glass-v3" style={{ padding: '2rem', background: 'rgba(239, 68, 68, 0.03)', color: '#ef4444', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <AlertCircle size={32} />
                    <div>
                        <h4 style={{ margin: 0, fontWeight: 950 }}>Auto-Billing Integration</h4>
                        <p style={{ margin: '0.4rem 0 0 0', fontWeight: 600, fontSize: '0.9rem', opacity: 0.8 }}>Executing a diagnostic order will automatically generate a tripartite invoice and transmit it to the billing department.</p>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
};

export default DiagnosticOrders;
