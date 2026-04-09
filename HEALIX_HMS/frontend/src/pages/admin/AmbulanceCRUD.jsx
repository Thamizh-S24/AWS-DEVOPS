import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ambulance, ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from './SectionHeader';
import api from '../../services/api';

const AmbulanceCRUD = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ vehicle_number: '', type: 'Advanced', status: 'Available' });
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/ambulance/ambulances', formData);
            setMsg('Ambulance commissioned successfully');
            setTimeout(() => navigate('/admin/ambulance'), 2000);
        } catch (err) {
            setMsg('Vehicle registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="admin">
            <SectionHeader
                title="Add Ambulance"
                subtitle="Register a new ambulance in the system"
                action={
                    <button onClick={() => navigate('/admin/ambulance')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 800, cursor: 'pointer' }}>
                        <ArrowLeft size={18} /> BACK TO AMBULANCES
                    </button>
                }
            />

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="stat-card-white"
                    style={{ padding: '3.5rem' }}
                >
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b' }}>Ambulance Plate Number</label>
                            <input
                                placeholder="e.g. AMB-2024-001"
                                value={formData.vehicle_number}
                                onChange={e => setFormData({ ...formData, vehicle_number: e.target.value })}
                                style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', fontWeight: 700, fontSize: '1.2rem' }}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b' }}>Unit Type</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', fontWeight: 700, background: 'white' }}
                                >
                                    <option value="Basic">Basic Life Support</option>
                                    <option value="Advanced">Advanced Life Support</option>
                                    <option value="ICU">Mobile ICU</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b' }}>Initial Status</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', fontWeight: 700, background: 'white' }}
                                >
                                    <option value="Available">Available</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Out of Service">Out of Service</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-vitalize"
                            style={{ marginTop: '1rem', opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? 'SAVING...' : 'ADD AMBULANCE'}
                        </button>

                        {msg && (
                            <div style={{
                                padding: '1rem',
                                borderRadius: '12px',
                                background: msg.includes('fail') ? '#fee2e2' : '#dcfce7',
                                color: msg.includes('fail') ? '#ef4444' : '#10b981',
                                textAlign: 'center',
                                fontWeight: 700
                            }}>
                                {msg}
                            </div>
                        )}
                    </form>
                </motion.div>
            </div>
        </DashboardLayout>
    );
};

export default AmbulanceCRUD;
