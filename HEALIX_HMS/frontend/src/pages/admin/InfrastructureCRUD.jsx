import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, Map, ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from './SectionHeader';
import api from '../../services/api';

const InfrastructureCRUD = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState('dept'); // 'dept' or 'ward'
    const [deptForm, setDeptForm] = useState({ name: '', description: '', head_id: '' });
    const [wardForm, setWardForm] = useState({ name: '', type: 'General' });
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateDept = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/hr/departments', deptForm);
            setMsg('Department created successfully');
            setTimeout(() => navigate('/admin/infrastructure'), 2000);
        } catch (err) { setMsg('Dept creation failed'); }
        setLoading(false);
    };

    const handleCreateWard = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/ward/create', wardForm);
            setMsg('Ward commissioned successfully');
            setTimeout(() => navigate('/admin/infrastructure'), 2000);
        } catch (err) { setMsg('Ward creation failed'); }
        setLoading(false);
    };

    return (
        <DashboardLayout role="admin">
            <SectionHeader
                title="Hospital Registry"
                subtitle="Add new hospital departments or wards"
                action={
                    <button onClick={() => navigate('/admin/infrastructure')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 800, cursor: 'pointer' }}>
                        <ArrowLeft size={18} /> BACK TO HUB
                    </button>
                }
            />

            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                    <button
                        onClick={() => setMode('dept')}
                        style={{ flex: 1, padding: '1.2rem', borderRadius: '16px', border: 'none', background: mode === 'dept' ? '#0ea5e9' : '#f8fafc', color: mode === 'dept' ? 'white' : '#64748b', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <Building size={20} /> ADD DEPARTMENT
                    </button>
                    <button
                        onClick={() => setMode('ward')}
                        style={{ flex: 1, padding: '1.2rem', borderRadius: '16px', border: 'none', background: mode === 'ward' ? '#8b5cf6' : '#f8fafc', color: mode === 'ward' ? 'white' : '#64748b', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <Map size={20} /> ADD WARD
                    </button>
                </div>

                <motion.div
                    key={mode}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="stat-card-white"
                    style={{ padding: '3.5rem' }}
                >
                    {mode === 'dept' ? (
                        <form onSubmit={handleCreateDept} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b' }}>Department Name</label>
                                <input placeholder="e.g. Cardiology" value={deptForm.name} onChange={e => setDeptForm({ ...deptForm, name: e.target.value })} style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', fontWeight: 700 }} required />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b' }}>Description</label>
                                <textarea placeholder="Outline unit specialty..." value={deptForm.description} onChange={e => setDeptForm({ ...deptForm, description: e.target.value })} style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', minHeight: '120px', resize: 'none' }} />
                            </div>
                            <button type="submit" disabled={loading} className="btn-vitalize">{loading ? 'CREATING...' : 'CREATE DEPARTMENT'}</button>
                        </form>
                    ) : (
                        <form onSubmit={handleCreateWard} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b' }}>Ward Name</label>
                                <input placeholder="e.g. North Wing ICU" value={wardForm.name} onChange={e => setWardForm({ ...wardForm, name: e.target.value })} style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', fontWeight: 700 }} required />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b' }}>Unit Type</label>
                                <select value={wardForm.type} onChange={e => setWardForm({ ...wardForm, type: e.target.value })} style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', fontWeight: 700, background: 'white' }}>
                                    <option value="General">General Medical</option>
                                    <option value="ICU">Intensive Care Unit (ICU)</option>
                                    <option value="Private">Private Luxury Suit</option>
                                    <option value="Maternity">Maternity & Pediatric</option>
                                </select>
                            </div>
                            <button type="submit" disabled={loading} className="btn-vitalize" style={{ background: '#8b5cf6' }}>{loading ? 'SAVING...' : 'CREATE WARD'}</button>
                        </form>
                    )}

                    {msg && (
                        <div style={{ marginTop: '2rem', padding: '1rem', borderRadius: '12px', background: '#dcfce7', color: '#10b981', textAlign: 'center', fontWeight: 700 }}>
                            {msg}
                        </div>
                    )}
                </motion.div>
            </div>
        </DashboardLayout>
    );
};

export default InfrastructureCRUD;
