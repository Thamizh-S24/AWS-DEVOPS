import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Lock, Activity, ArrowLeft } from 'lucide-react';
import StorytellingAuthLayout from '../components/StorytellingAuthLayout';
import RegistrationScenario from '../components/RegistrationScenario';
import api from '../services/api';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '', password: '', email: '', role: 'patient'
    });
    const [msg, setMsg] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg('');
        setIsError(false);
        try {
            await api.post('/auth/register', formData);
            setMsg('Account created successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            setIsError(true);
            setMsg('Registration failed. Username or email may already be in use.');
        }
    };

    return (
        <StorytellingAuthLayout leftContent={<RegistrationScenario />}>
            <div
                className="glass-v3 neon-border-pulse responsive-card-padding"
                style={{ width: '100%', maxWidth: '500px', border: '1px solid rgba(0, 212, 255, 0.2)', padding: '2.5rem' }}
            >
                <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00D4FF', textDecoration: 'none', marginBottom: '2.5rem', fontSize: '0.9rem', fontWeight: 800 }}>
                    <ArrowLeft size={16} /> RETURN TO PORTAL
                </Link>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ marginBottom: '1rem', display: 'inline-block', padding: '1rem', borderRadius: '50%', background: 'rgba(0, 212, 255, 0.1)', color: '#00D4FF', boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)' }}>
                        <UserPlus size={32} />
                    </div>
                    <h2 className="text-gradient" style={{ fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-1px' }}>Clinic Enrollment</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Initialize your secure healthcare workspace</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="input-diagnostic-wrapper">
                        <User style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, color: '#00D4FF', zIndex: 6 }} size={18} />
                        <input
                            placeholder="Full Name / Handle"
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                            className="input-diagnostic"
                            required
                        />
                        <div className="scan-line" />
                    </div>

                    <div className="input-diagnostic-wrapper">
                        <Mail style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, color: '#00D4FF', zIndex: 6 }} size={18} />
                        <input
                            type="email"
                            placeholder="Aura-Linked Email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="input-diagnostic"
                            required
                        />
                        <div className="scan-line" />
                    </div>

                    <div className="input-diagnostic-wrapper">
                        <Lock style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, color: '#00D4FF', zIndex: 6 }} size={18} />
                        <input
                            type="password"
                            placeholder="Master Security Key"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            className="input-diagnostic"
                            required
                        />
                        <div className="scan-line" />
                    </div>

                    <button type="submit" className="btn-vitalize" style={{ marginTop: '1.5rem' }}>
                        Create Medical Profile
                    </button>

                    {msg && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                textAlign: 'center',
                                padding: '1rem',
                                borderRadius: '12px',
                                background: isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 212, 255, 0.1)',
                                color: isError ? '#ef4444' : '#00D4FF',
                                fontSize: '0.9rem',
                                border: `1px solid ${isError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 212, 255, 0.2)'}`,
                                fontWeight: 700
                            }}
                        >
                            {msg}
                        </motion.div>
                    )}
                </form>
            </div>
        </StorytellingAuthLayout>
    );
};

export default RegisterPage;

