import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, Activity } from 'lucide-react';
import StorytellingAuthLayout from '../components/StorytellingAuthLayout';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login/', { username, password });
            login(response.data.access);
        } catch (err) {
            setError('Invalid credentials. Please check your username and password.');
        }
    };

    return (
        <StorytellingAuthLayout>
            <div
                className="glass-v3 neon-border-pulse responsive-card-padding"
                style={{ width: '100%', maxWidth: '450px', position: 'relative', padding: '2.5rem' }}
            >
                <div className="desktop-only" style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05, color: '#00D4FF' }}>
                    <Activity size={150} />
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
                    <h2 className="text-gradient" style={{ fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-1px' }}>Portal Login</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Authorized Personnel Access Point</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                    <div className="input-diagnostic-wrapper">
                        <User style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, color: '#00D4FF', zIndex: 6 }} size={18} />
                        <input
                            type="text"
                            placeholder="Clinical ID / Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input-diagnostic"
                            required
                        />
                        <div className="scan-line" />
                    </div>

                    <div className="input-diagnostic-wrapper">
                        <Lock style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, color: '#00D4FF', zIndex: 6 }} size={18} />
                        <input
                            type="password"
                            placeholder="Security Key"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-diagnostic"
                            required
                        />
                        <div className="scan-line" />
                    </div>

                    <button type="submit" className="btn-vitalize" style={{ marginTop: '1rem' }}>
                        <LogIn size={20} /> Initialize Session
                    </button>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                color: '#ef4444',
                                fontSize: '0.85rem',
                                textAlign: 'center',
                                background: 'rgba(239, 68, 68, 0.1)',
                                padding: '0.8rem',
                                borderRadius: '10px',
                                border: '1px solid rgba(239, 68, 68, 0.2)'
                            }}
                        >
                            {error}
                        </motion.div>
                    )}
                </form>

                <div style={{ textAlign: 'center', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                        Unregistered? <Link to="/register" style={{ color: '#00D4FF', textDecoration: 'none', fontWeight: 800, borderBottom: '1px solid rgba(0, 212, 255, 0.3)' }}>Enroll Clinic</Link>
                    </p>
                </div>
            </div>
        </StorytellingAuthLayout>
    );
};

export default LoginPage;
