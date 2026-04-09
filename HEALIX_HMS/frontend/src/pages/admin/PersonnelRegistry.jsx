import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShieldCheck, Trash2, Edit3, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from './SectionHeader';
import api from '../../services/api';
import { useSearch } from '../../context/SearchContext';

const PersonnelRegistry = () => {
    const { searchTerm } = useSearch();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchDepartments();
    }, []);

    const fetchUsers = async () => {
        try {
            const [userRes, staffRes] = await Promise.all([
                api.get('/auth/users'),
                api.get('/hr/staff')
            ]);
            setUsers(userRes.data.map(u => ({
                ...u,
                ...(staffRes.data.find(s => s.username === u.username) || {})
            })));
        } catch (err) { console.error("Failed to fetch personnel"); }
    };

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/hr/departments');
            setDepartments(res.data);
        } catch (err) { console.error("Failed to fetch departments"); }
    };

    const getDeptName = (id) => {
        const d = departments.find(dept => dept._id === id);
        return d ? d.name : 'Unassigned Hub';
    };

    const handleResetPassword = async (username) => {
        if (!window.confirm(`Reset password for ${username} to 'Reset@123'?`)) return;
        try {
            await api.patch(`/auth/users/${username}/reset-password/`, { password: 'Reset@123' });
            setMsg(`Password reset to default for ${username}`);
            setTimeout(() => setMsg(''), 3000);
        } catch (err) { alert("Reset failed"); }
    };

    const handleActivate = async (username, currentStatus) => {
        try {
            await api.patch(`/auth/users/${username}/activate/`, { is_active: !currentStatus });
            fetchUsers();
        } catch (err) { alert("Status update failed"); }
    };

    const handleDelete = async (username) => {
        if (!window.confirm(`Remove staff access for ${username}?`)) return;
        try {
            await api.delete(`/auth/users/${username}`);
            fetchUsers();
        } catch (err) { alert("Error revoking access"); }
    };

    const filteredUsers = users.filter(u =>
        u.username?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
        u.full_name?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
        u.email?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
        u.role?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
    );

    return (
        <DashboardLayout role="admin">
            <SectionHeader
                title="Clinical Registry"
                subtitle="Manage hospital-wide staff hierarchy and access nodes"
                action={
                    <button
                        onClick={() => navigate('/admin/registry/new')}
                        className="btn-vitalize"
                        style={{ width: 'auto', padding: '1rem 2rem', borderRadius: '18px' }}
                    >
                        <Users size={20} /> PROVISION NEW STAFF
                    </button>
                }
            />

            <div className="stat-card-white" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(14, 165, 233, 0.1)' }}>
                <div style={{ padding: '1.8rem 2.5rem', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 950, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Staff Directory</h3>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, margin: '0.2rem 0 0 0' }}>{filteredUsers.length} Active personnel records synchronized</p>
                    </div>
                    {searchTerm && (
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0ea5e9', background: 'rgba(14, 165, 233, 0.08)', padding: '0.5rem 1rem', borderRadius: '50px', border: '1px solid rgba(14, 165, 233, 0.1)' }}>
                            FILTERING: "{searchTerm?.toUpperCase() || ''}"
                        </div>
                    )}
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
                        <thead>
                            <tr style={{ background: 'white', borderBottom: '1.5px solid #f1f5f9' }}>
                                <th style={{ padding: '1.5rem 2.5rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1.5px' }}>Identity & Role</th>
                                <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1.5px' }}>Department</th>
                                <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1.5px' }}>Status</th>
                                <th style={{ padding: '1.5rem 2.5rem', textAlign: 'right', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1.5px' }}>Administration</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredUsers.map((user, idx) => (
                                    <motion.tr
                                        key={user.username}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        whileHover={{ background: '#f8fafc' }}
                                        style={{ borderBottom: '1px solid #fbfcfe' }}
                                    >
                                        <td style={{ padding: '1.8rem 2.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                                <div style={{ width: '45px', height: '45px', borderRadius: '15px', background: 'var(--grad-main)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 900, boxShadow: '0 4px 12px rgba(14, 165, 233, 0.2)' }}>
                                                    {user.full_name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 950, color: '#0f172a', fontSize: '1.05rem', letterSpacing: '-0.3px' }}>{user.full_name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginTop: '0.2rem', display: 'flex', gap: '0.8rem' }}>
                                                        <span style={{ color: '#0ea5e9' }}>@{user.username || 'unknown'}</span>
                                                        <span>•</span>
                                                        <span style={{ textTransform: 'uppercase' }}>{(user.role || 'staff').replace('_', ' ')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.8rem 2rem' }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#334155' }}>
                                                {getDeptName(user.department_id)}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, marginTop: '0.2rem' }}>{user.specialization || 'General Services'}</div>
                                        </td>
                                        <td style={{ padding: '1.8rem 2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 1rem', borderRadius: '50px', background: user.status === 'Active' ? '#dcfce7' : '#fee2e2', color: user.status === 'Active' ? '#10b981' : '#ef4444', width: 'fit-content', border: `1px solid ${user.status === 'Active' ? '#bbf7d0' : '#fecaca'}` }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', boxShadow: '0 0 8px currentColor' }} />
                                                <span style={{ fontSize: '0.7rem', fontWeight: 950, letterSpacing: '0.5px' }}>{(user.status || 'inactive').toUpperCase()}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.8rem 2.5rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}>
                                                <button
                                                    onClick={() => navigate('/admin/registry/new', { state: { user } })}
                                                    title="Edit Identity"
                                                    style={{ padding: '0.8rem', borderRadius: '12px', background: 'white', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer', transition: 'all 0.2s' }}
                                                    onMouseOver={e => e.currentTarget.style.color = '#0ea5e9'}
                                                    onMouseOut={e => e.currentTarget.style.color = '#64748b'}
                                                >
                                                    <ShieldCheck size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.username)}
                                                    title="Decommission Access"
                                                    style={{ padding: '0.8rem', borderRadius: '12px', background: 'white', border: '1px solid #fee2e2', color: '#ef4444', cursor: 'pointer', transition: 'all 0.2s' }}
                                                    onMouseOver={e => e.currentTarget.style.background = '#fee2e2'}
                                                    onMouseOut={e => e.currentTarget.style.background = 'white'}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div style={{ padding: '6rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                            <div style={{ padding: '1.5rem', borderRadius: '30px', background: '#f8fafc', color: '#cbd5e1' }}><Users size={48} /></div>
                        </div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>No Staff Records Found</h3>
                        <p style={{ fontSize: '1rem', color: '#94a3b8', marginTop: '0.6rem', fontWeight: 500 }}>No personnel records match your current search parameters in the clinical database.</p>
                        <button onClick={() => window.location.reload()} style={{ marginTop: '2rem', background: 'none', border: 'none', color: '#0ea5e9', fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>RESET SEARCH FILTER</button>
                    </div>
                )}
            </div>
            {msg && <p style={{ textAlign: 'center', marginTop: '2rem', color: '#10b981', fontWeight: 800 }}>{msg}</p>}
        </DashboardLayout >
    );
};

export default PersonnelRegistry;
