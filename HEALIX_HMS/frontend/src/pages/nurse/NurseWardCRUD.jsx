import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Plus, Trash2, Map } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from '../admin/SectionHeader';
import api from '../../services/api';

const NurseWardCRUD = () => {
    const [wards, setWards] = useState([]);
    const [msg, setMsg] = useState('');
    const [form, setForm] = useState({ name: '', type: 'General' });

    useEffect(() => {
        fetchWards();
    }, []);

    const fetchWards = async () => {
        try {
            const res = await api.get('/ward/status');
            setWards(res.data);
        } catch (err) {
            console.error("Failed to fetch wards", err);
        }
    };

    const handleCreateWard = async (e) => {
        e.preventDefault();
        try {
            // Note: Assuming endpoint exists in ward_service/main.py. 
            // The infrastructure hub previously handled this generically.
            await api.post('/ward/create', form);
            setMsg('Ward architecture updated successfully.');
            setForm({ name: '', type: 'General' });
            fetchWards();
            setTimeout(() => setMsg(''), 3000);
        } catch (error) {
            setMsg('Failed to provision new ward cluster. Verify permissions.');
        }
    };

    return (
        <DashboardLayout role="nurse">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '1000px', margin: '0 auto' }}
            >
                <SectionHeader title="Ward Architecture Management" subtitle="Provision and modify clinical footprint and capacity" />

                <div className="glass-v3" style={{ padding: '2.5rem', background: 'linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(248, 250, 252, 0.4))', border: '1px solid rgba(13, 148, 136, 0.15)', boxShadow: '0 25px 50px -12px rgba(13, 148, 136, 0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                        <div style={{ padding: '0.8rem', background: 'rgba(13, 148, 136, 0.1)', borderRadius: '14px', border: '1px solid rgba(13, 148, 136, 0.2)' }}>
                            <Settings size={28} color="#0d9488" />
                        </div>
                        <h3 style={{ margin: 0, fontWeight: 950, color: '#0f172a', fontSize: '1.4rem', letterSpacing: '-0.5px' }}>Provision New Ward Architecture</h3>
                    </div>
                    <form onSubmit={handleCreateWard} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>Ward Designation (Name)</label>
                            <input
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="e.g., North Wing Alpha"
                                className="input-v3"
                                style={{ padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(13, 148, 136, 0.2)', background: 'rgba(255, 255, 255, 0.8)', fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}
                                required
                            />
                        </div>
                        <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>Care Level Classification</label>
                            <select
                                value={form.type}
                                onChange={e => setForm({ ...form, type: e.target.value })}
                                className="input-v3"
                                style={{ padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(13, 148, 136, 0.2)', background: 'rgba(255, 255, 255, 0.8)', fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', outline: 'none' }}
                            >
                                <option>General</option>
                                <option>ICU</option>
                                <option>Private</option>
                                <option>Maternity</option>
                            </select>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: '0 15px 30px -10px rgba(13, 148, 136, 0.5)' }}
                            whileTap={{ scale: 0.98 }}
                            type="submit" className="btn-vitalize" style={{ background: 'linear-gradient(135deg, #0d9488, #0f766e)', width: 'auto', padding: '1.2rem 2.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', border: 'none', borderRadius: '16px', fontSize: '1rem', fontWeight: 900, letterSpacing: '0.5px' }}>
                            <Plus size={20} /> INITIALIZE PROVISIONING
                        </motion.button>
                    </form>
                    {msg && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '2rem', color: msg.includes('Failed') ? '#ef4444' : '#10b981', fontWeight: 800, background: msg.includes('Failed') ? '#fee2e2' : '#dcfce7', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: `1px solid ${msg.includes('Failed') ? '#fca5a5' : '#86efac'}` }}>{msg}</motion.p>}
                </div>

                <div className="glass-v3" style={{ padding: '0', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 15px 35px -15px rgba(0,0,0,0.1)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'linear-gradient(to right, #f8fafc, #f1f5f9)', borderBottom: '2px solid #e2e8f0' }}>
                                <th style={{ padding: '1.5rem 2rem', fontSize: '0.8rem', fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>Ward Infrastructure Identification</th>
                                <th style={{ padding: '1.5rem 2rem', fontSize: '0.8rem', fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>Clinical Stratification Level</th>
                                <th style={{ padding: '1.5rem 2rem', fontSize: '0.8rem', fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>Operational Capacity Matrix</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wards.map((w, idx) => (
                                <tr key={w.id || idx} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'white' : 'rgba(248, 250, 252, 0.5)' }}>
                                    <td style={{ padding: '1.5rem 2rem', fontWeight: 950, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '1.2rem', fontSize: '1.1rem' }}>
                                        <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(13, 148, 136, 0.1)', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 10px rgba(13, 148, 136, 0.15)', border: '1px solid rgba(13, 148, 136, 0.2)' }}>
                                            <Map size={24} />
                                        </div>
                                        {w.name}
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <span style={{ padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 800, background: w.type === 'ICU' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(148, 163, 184, 0.1)', color: w.type === 'ICU' ? '#ef4444' : '#475569', border: `1px solid ${w.type === 'ICU' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(148, 163, 184, 0.2)'}` }}>
                                            {w.type.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem', fontWeight: 800, color: '#64748b', fontSize: '1.05rem' }}>
                                        <span style={{ color: '#0f172a', fontWeight: 900, marginRight: '0.4rem' }}>{w.rooms?.length || 0}</span> Fully Functional Blocks
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {wards.length === 0 && (
                        <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', fontWeight: 700, fontSize: '1.1rem' }}>Zero active operational wards located in the registry database.</div>
                    )}
                </div>

            </motion.div>
        </DashboardLayout>
    );
};

export default NurseWardCRUD;
