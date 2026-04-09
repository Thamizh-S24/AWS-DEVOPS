import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ShieldCheck, ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from './SectionHeader';
import api from '../../services/api';

const PersonnelCRUD = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const editData = location.state?.user;

    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        username: editData?.username || '',
        password: '',
        role: editData?.role || 'doctor',
        email: editData?.email || '',
        department: editData?.department_id || '',
        full_name: editData?.full_name || '',
        contact: editData?.contact || '',
        specialization: editData?.specialization || ''
    });
    const [isEditing] = useState(!!editData);
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/hr/departments');
            setDepartments(res.data);
        } catch (err) { console.error("Failed to fetch departments"); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing) {
                await api.put(`/hr/staff/${formData.username}`, {
                    full_name: formData.full_name,
                    contact: formData.contact,
                    role: formData.role,
                    department_id: formData.department,
                    specialization: formData.specialization
                });
                setMsg('Personnel profile updated successfully');
            } else {
                await api.post('/auth/register', {
                    username: formData.username,
                    password: formData.password,
                    role: formData.role,
                    email: formData.email
                });

                await api.post('/hr/staff', {
                    username: formData.username,
                    full_name: formData.full_name,
                    contact: formData.contact,
                    role: formData.role,
                    department_id: formData.department,
                    specialization: formData.specialization,
                    status: 'Active'
                });

                if (formData.role === 'doctor' && formData.department) {
                    await api.post('/hr/doctor-dept', {
                        doctor_id: formData.username,
                        department_id: formData.department
                    });
                }
                setMsg('Personnel profile synchronized and provisioned');
            }
            setTimeout(() => navigate('/admin/registry'), 2000);
        } catch (err) {
            setMsg(isEditing ? 'Update failed' : 'Provisioning failed. Check if username/email already exists.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="admin">
            <SectionHeader
                title={isEditing ? "Modify Personnel Index" : "Provision New Identity"}
                subtitle="Synchronize staff records with active hospital directory"
                action={
                    <button
                        onClick={() => navigate('/admin/registry')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            padding: '1rem 2rem',
                            borderRadius: '16px',
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            color: '#64748b',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={e => e.currentTarget.style.borderColor = '#0ea5e9'}
                        onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                    >
                        <ArrowLeft size={20} /> RETURN TO REGISTRY
                    </button>
                }
            />

            <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '5rem' }}>
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="glass-v3"
                    style={{ padding: '4rem', position: 'relative', overflow: 'hidden' }}
                >
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'var(--grad-main)', opacity: 0.03, borderRadius: '0 0 0 100%' }} />

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem' }}>
                            <div style={{ padding: '0.8rem', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', borderRadius: '12px' }}>
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 950, color: '#0f172a', letterSpacing: '-0.5px' }}>Authentication Identity</h3>
                                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Global access credentials and security level</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>System Username</label>
                                <input
                                    placeholder="e.g. jdoe_clinical"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    style={{
                                        padding: '1.2rem',
                                        borderRadius: '16px',
                                        border: '1.5px solid #f1f5f9',
                                        background: isEditing ? '#f8fafc' : 'white',
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        color: '#0f172a'
                                    }}
                                    className="input-focus-aura"
                                    required
                                    readOnly={isEditing}
                                />
                            </div>
                            {!isEditing && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Security Token (Password)</label>
                                    <input
                                        type="password"
                                        placeholder="Encrypted string..."
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        style={{ padding: '1.2rem', borderRadius: '16px', border: '1.5px solid #f1f5f9', fontSize: '1rem' }}
                                        className="input-focus-aura"
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem', marginTop: '1rem' }}>
                            <div style={{ padding: '0.8rem', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '12px' }}>
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 950, color: '#0f172a', letterSpacing: '-0.5px' }}>Bio-Demographic Data</h3>
                                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Personal information and clinical assignment</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Full Legal Name</label>
                                <input
                                    placeholder="Prof. Jane Maria Doe"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    style={{ padding: '1.2rem', borderRadius: '16px', border: '1.5px solid #f1f5f9', fontWeight: 700, fontSize: '1rem' }}
                                    className="input-focus-aura"
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Communication Email</label>
                                <input
                                    placeholder="j.doe@aura.health"
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    style={{ padding: '1.2rem', borderRadius: '16px', border: '1.5px solid #f1f5f9', fontSize: '1rem' }}
                                    className="input-focus-aura"
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Contact Uplink</label>
                                <input
                                    placeholder="+1 (555) 900-3400"
                                    value={formData.contact}
                                    onChange={e => setFormData({ ...formData, contact: e.target.value })}
                                    style={{ padding: '1.2rem', borderRadius: '16px', border: '1.5px solid #f1f5f9', fontSize: '1rem' }}
                                    className="input-focus-aura"
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Logistics Role</label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '1.5px solid #f1f5f9', fontWeight: 800, appearance: 'none', background: 'white', color: '#0f172a', cursor: 'pointer' }}
                                        className="input-focus-aura"
                                    >
                                        <option value="doctor">Medical Physician</option>
                                        <option value="nurse">Clinical Nurse</option>
                                        <option value="receptionist">Support Logistics</option>
                                        <option value="pharmacist">Pharmacy Node</option>
                                        <option value="lab_tech">Laboratory Node</option>
                                        <option value="maintenance">Facility Maintenance</option>
                                    </select>
                                    <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }}>▼</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Assigned Segment (Department)</label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        value={formData.department}
                                        onChange={e => setFormData({ ...formData, department: e.target.value })}
                                        style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '1.5px solid #f1f5f9', fontWeight: 700, appearance: 'none', background: 'white', cursor: 'pointer' }}
                                        className="input-focus-aura"
                                    >
                                        <option value="">Select Operational Hub...</option>
                                        {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                                    </select>
                                    <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }}>▼</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Micro-Specialization</label>
                            <input
                                placeholder="e.g. Critical Care, Neuro-Oncology, Facility Power Grid"
                                value={formData.specialization}
                                onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                                style={{ padding: '1.2rem', borderRadius: '16px', border: '1.5px solid #f1f5f9', fontSize: '1rem', fontWeight: 600 }}
                                className="input-focus-aura"
                            />
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <motion.button
                                whileHover={{ scale: 1.01, boxShadow: '0 20px 40px rgba(14, 165, 233, 0.2)' }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={loading}
                                className="btn-vitalize"
                                style={{
                                    padding: '1.5rem',
                                    borderRadius: '20px',
                                    fontSize: '1.1rem',
                                    fontWeight: 950,
                                    letterSpacing: '1px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '1rem',
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? 'SYNCHRONIZING...' : <><Save size={22} /> {isEditing ? 'COMMIT CHANGES' : 'AUTHORIZE STAFF'}</>}
                            </motion.button>

                            {msg && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{
                                        padding: '1.5rem',
                                        borderRadius: '18px',
                                        background: msg.includes('fail') ? '#fee2e2' : '#dcfce7',
                                        color: msg.includes('fail') ? '#ef4444' : '#10b981',
                                        textAlign: 'center',
                                        fontWeight: 900,
                                        fontSize: '0.95rem',
                                        border: `1px solid ${msg.includes('fail') ? '#fecaca' : '#bbf7d0'}`,
                                        letterSpacing: '-0.3px'
                                    }}
                                >
                                    {msg}
                                </motion.div>
                            )}
                        </div>
                    </form>
                </motion.div>
            </div>
        </DashboardLayout>
    );
};

export default PersonnelCRUD;
