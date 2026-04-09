import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Trash2 } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from './SectionHeader';
import api from '../../services/api';
import { useSearch } from '../../context/SearchContext';

const DepartmentManagement = () => {
    const { searchTerm } = useSearch();
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '', head_id: '' });
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/hr/departments');
            setDepartments(res.data);
        } catch (err) { console.error("Dept fetch failed"); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/hr/departments', formData);
            setMsg('Department created successfully');
            setFormData({ name: '', description: '', head_id: '' });
            fetchData();
            setTimeout(() => setMsg(''), 3000);
        } catch (err) { setMsg('Creation failed'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Decommission this department? This will orphan all assigned staff.")) return;
        try {
            await api.delete(`/hr/departments/${id}`);
            fetchData();
        } catch (err) { alert("Deletion failed"); }
    };

    const filteredDepts = departments.filter(d =>
        d.name?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
        d.description?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
    );

    return (
        <DashboardLayout role="admin">
            <SectionHeader title="Hospital Units" subtitle="Orchestrate hospital departments and segment leads" />

            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) 400px', gap: '3.5rem' }}>
                <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignContent: 'start' }}>
                    <AnimatePresence>
                        {filteredDepts.map((d) => (
                            <motion.div
                                key={d._id}
                                layout
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(14, 165, 233, 0.15)' }}
                                className="glass-v3"
                                style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}
                            >
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                        <div style={{ padding: '1rem', borderRadius: '18px', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}>
                                            <Building size={24} />
                                        </div>
                                        <button
                                            onClick={() => handleDelete(d._id)}
                                            style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '0.5rem', borderRadius: '10px', transition: 'all 0.2s' }}
                                            onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                                            onMouseOut={e => e.currentTarget.style.color = '#cbd5e1'}
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                    <h4 style={{ fontSize: '1.4rem', fontWeight: 950, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>{d.name}</h4>
                                    <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500, margin: '0.8rem 0 2rem 0', minHeight: '3rem', lineHeight: 1.5 }}>{d.description}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1.2rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                                        <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#475569', letterSpacing: '0.5px' }}>NODE OPERATIONAL</span>
                                    </div>
                                </div>

                                {/* Abstract Background ID */}
                                <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', fontSize: '5rem', fontWeight: 950, color: '#0ea5e9', opacity: 0.03, pointerEvents: 'none' }}>
                                    {(d.name || '??').substring(0, 2).toUpperCase()}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Provisioning Side Panel */}
                <div>
                    <motion.div
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="glass-v3"
                        style={{ padding: '3rem', position: 'sticky', top: '2rem' }}
                    >
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 950, color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>Segment Provisioning</h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500, marginBottom: '2.5rem' }}>Add new structural unit to hospital mesh</p>

                        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Department Name</label>
                                <input
                                    placeholder="e.g. Cardiology"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    style={{ padding: '1.1rem', borderRadius: '14px', border: '1.5px solid #f1f5f9', fontWeight: 700 }}
                                    className="input-focus-aura"
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Functional Scope</label>
                                <textarea
                                    placeholder="Define the structural role of this department..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    style={{ padding: '1.1rem', borderRadius: '14px', border: '1.5px solid #f1f5f9', minHeight: '120px', resize: 'none', fontWeight: 500, lineHeight: 1.5 }}
                                    className="input-focus-aura"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-vitalize" style={{ padding: '1.2rem', borderRadius: '16px', fontWeight: 950, fontSize: '0.95rem', letterSpacing: '0.5px', marginTop: '1rem' }}>
                                PROVISION SEGMENT
                            </button>
                            {msg && <p style={{ textAlign: 'center', fontSize: '0.85rem', fontWeight: 900, color: '#10b981', marginTop: '1rem' }}>{msg}</p>}
                        </form>
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DepartmentManagement;
