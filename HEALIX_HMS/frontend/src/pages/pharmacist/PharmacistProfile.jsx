import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Mail, Building, UserCircle, Briefcase, Lock } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from '../admin/SectionHeader';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const PharmacistProfile = () => {
    const { user } = useAuth();
    const [pwdData, setPwdData] = useState({ current: '', new: '', confirm: '' });
    const [msg, setMsg] = useState('');

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            await api.patch('/auth/profile/password', pwdData);
            setMsg('Authorization credentials rotated successfully.');
            setPwdData({ current: '', new: '', confirm: '' });
            setTimeout(() => setMsg(''), 3000);
        } catch (err) { alert("Credential update failed"); }
    };

    return (
        <DashboardLayout role="pharmacist">
            <SectionHeader
                title="Pharmacist Identity & Security"
                subtitle="Manage clinical authorization protocols and personal credentials"
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)', gap: '4rem' }}>
                <div className="glass-v3" style={{ padding: '3.5rem', background: 'white' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '35px',
                            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                            margin: '0 auto 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 10px 25px rgba(14, 165, 233, 0.3)'
                        }}>
                            <UserCircle size={64} />
                        </div>
                        <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 950, color: '#0f172a' }}>{user?.username?.toUpperCase() || 'PHARMACIST'}</h2>
                        <span style={{ fontSize: '0.8rem', color: '#0ea5e9', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginTop: '0.5rem', display: 'block' }}>
                            LICENSED PHARMACIST
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.2rem', background: '#f8fafc', borderRadius: '18px' }}>
                            <Mail size={18} color="#64748b" />
                            <div>
                                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Clinical Email</div>
                                <div style={{ fontWeight: 700, color: '#1e293b' }}>{user?.email || 'authenticated@healix.internal'}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.2rem', background: '#f8fafc', borderRadius: '18px' }}>
                            <Building size={18} color="#64748b" />
                            <div>
                                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Department</div>
                                <div style={{ fontWeight: 700, color: '#1e293b' }}>Central Medical Pharmacy</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.2rem', background: '#f8fafc', borderRadius: '18px' }}>
                            <Briefcase size={18} color="#64748b" />
                            <div>
                                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Auth Level</div>
                                <div style={{ fontWeight: 700, color: '#0ea5e9' }}>Class 1 - Controlled Substances</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-v3" style={{ padding: '3.5rem', background: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '3rem' }}>
                        <div style={{ padding: '0.8rem', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                            <Lock size={24} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 950, color: '#1e293b' }}>Security Handshake</h3>
                    </div>

                    <form onSubmit={handlePasswordChange} style={{ display: 'grid', gap: '2rem' }}>
                        <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Current Auth Key</label>
                            <input
                                type="password"
                                required
                                value={pwdData.current}
                                onChange={e => setPwdData({ ...pwdData, current: e.target.value })}
                                style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 700, marginTop: '0.6rem' }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>New Auth Key</label>
                                <input
                                    type="password"
                                    required
                                    value={pwdData.new}
                                    onChange={e => setPwdData({ ...pwdData, new: e.target.value })}
                                    style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 700, marginTop: '0.6rem' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Confirm Key</label>
                                <input
                                    type="password"
                                    required
                                    value={pwdData.confirm}
                                    onChange={e => setPwdData({ ...pwdData, confirm: e.target.value })}
                                    style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 700, marginTop: '0.6rem' }}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-vitalize" style={{ padding: '1.2rem', marginTop: '1rem' }}>
                            ROTATE AUTHENTICATION KEYS
                        </button>
                        {msg && <p style={{ textAlign: 'center', color: '#10b981', fontWeight: 800 }}>{msg}</p>}
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PharmacistProfile;
