import React, { useState } from 'react';
import { User, Lock, Mail, Phone, ShieldCheck } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from './SectionHeader';
import api from '../../services/api';

const AdminProfile = () => {
    const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });
    const [msg, setMsg] = useState('');

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passData.new !== passData.confirm) return setMsg('Passwords do not match');
        try {
            await api.patch('/auth/profile/password', { password: passData.new });
            setMsg('Credential security updated');
            setPassData({ current: '', new: '', confirm: '' });
        } catch (err) { setMsg('Update failed'); }
    };

    return (
        <DashboardLayout role="admin">
            <SectionHeader title="My Profile" subtitle="View your details and update your password" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem' }}>
                <div className="stat-card-white" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '30px', background: '#f1f5f9', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid #e2e8f0' }}>
                        <User size={48} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 950, margin: 0 }}>Administrator</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>Super Admin</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '15px' }}>
                            <Mail size={18} color="#64748b" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>admin@aurahms.enterprise</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '15px' }}>
                            <ShieldCheck size={18} color="#10b981" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>Multi-Factor Active</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card-white" style={{ padding: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '2rem' }}>Change Password</h3>
                    <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b' }}>Current Secret</label>
                            <input type="password" value={passData.current} onChange={e => setPassData({ ...passData, current: e.target.value })} style={{ padding: '0.8rem', borderRadius: '12px', border: '1px solid #e2e8f0' }} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b' }}>New Password</label>
                                <input type="password" value={passData.new} onChange={e => setPassData({ ...passData, new: e.target.value })} style={{ padding: '0.8rem', borderRadius: '12px', border: '1px solid #e2e8f0' }} required />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b' }}>Confirm New</label>
                                <input type="password" value={passData.confirm} onChange={e => setPassData({ ...passData, confirm: e.target.value })} style={{ padding: '0.8rem', borderRadius: '12px', border: '1px solid #e2e8f0' }} required />
                            </div>
                        </div>
                        <button type="submit" className="btn-vitalize" style={{ marginTop: '1rem' }}>Update Password</button>
                    </form>
                    {msg && <p style={{ textAlign: 'center', marginTop: '1.5rem', color: msg.includes('updated') ? '#10b981' : '#ef4444', fontWeight: 800 }}>{msg}</p>}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminProfile;
