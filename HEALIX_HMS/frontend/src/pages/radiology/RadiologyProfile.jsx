import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Mail, ShieldCheck, Building, Camera, Zap } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const RadiologyProfile = () => {
    const { user } = useAuth();
    const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });
    const [msg, setMsg] = useState('');
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/auth/users');
            const myProfile = res.data.find(u => u.username === user.username);
            setProfile(myProfile);
        } catch (err) { console.error("Failed to fetch profile"); }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passData.new !== passData.confirm) return setMsg('Passwords do not match');
        try {
            await api.patch('/auth/profile/password', { password: passData.new });
            setMsg('Clinical credentials updated successfully');
            setPassData({ current: '', new: '', confirm: '' });
            setTimeout(() => setMsg(''), 3000);
        } catch (err) { setMsg('Update failed'); }
    };

    return (
        <DashboardLayout role="radiologist">
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>Radiology Specialist Profile</h2>
                <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.4rem', fontWeight: 500 }}>Secure management of your clinical identity and credentials</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem' }}>
                <div className="glass-v3" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '40px',
                        background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                        color: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        border: '1px solid #bfdbfe',
                        boxShadow: '0 10px 20px rgba(59, 130, 246, 0.1)'
                    }}>
                        <User size={60} />
                    </div>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 950, margin: 0, color: '#0f172a' }}>{profile?.full_name || 'Dr. ' + (profile?.first_name || user.username)}</h3>
                    <p style={{ color: '#3b82f6', fontSize: '0.9rem', fontWeight: 800, marginBottom: '2.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Senior Radiologist</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', background: '#f8fafc', borderRadius: '18px', border: '1px solid #f1f5f9' }}>
                            <Mail size={18} color="#64748b" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user.username}@healix.clinical</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', background: '#f8fafc', borderRadius: '18px', border: '1px solid #f1f5f9' }}>
                            <ShieldCheck size={18} color="#10b981" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>PACS Authorization Verified</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', background: '#f8fafc', borderRadius: '18px', border: '1px solid #f1f5f9' }}>
                            <Camera size={18} color="#3b82f6" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Imaging Unit - Wing B</span>
                        </div>
                    </div>
                </div>

                <div className="glass-v3" style={{ padding: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                        <div style={{ padding: '0.8rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '14px' }}>
                            <Lock size={20} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 950, color: '#0f172a' }}>Security Credentials</h3>
                    </div>

                    <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Clinical Passcode</label>
                            <input
                                type="password"
                                value={passData.current}
                                onChange={e => setPassData({ ...passData, current: e.target.value })}
                                placeholder="••••••••"
                                style={{ padding: '1.2rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 700, outline: 'none' }}
                                required
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>New Vault Secret</label>
                                <input
                                    type="password"
                                    value={passData.new}
                                    onChange={e => setPassData({ ...passData, new: e.target.value })}
                                    placeholder="Min 8 characters"
                                    style={{ padding: '1.2rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 700, outline: 'none' }}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Confirm Secret</label>
                                <input
                                    type="password"
                                    value={passData.confirm}
                                    onChange={e => setPassData({ ...passData, confirm: e.target.value })}
                                    placeholder="Repeat secret"
                                    style={{ padding: '1.2rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 700, outline: 'none' }}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-vitalize" style={{ padding: '1.4rem', fontSize: '1rem', fontWeight: 950, borderRadius: '18px', marginTop: '1rem', background: '#3b82f6' }}>
                            <Zap size={18} /> SYNCHRONIZE CLINICAL ACCESS
                        </button>
                    </form>
                    {msg && <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', marginTop: '2rem', color: msg.includes('updated') ? '#10b981' : '#ef4444', fontWeight: 950, fontSize: '0.95rem' }}
                    >{msg}</motion.p>}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default RadiologyProfile;
