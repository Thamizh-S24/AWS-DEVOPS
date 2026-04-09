import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    User, Mail, Phone, MapPin, 
    Award, Clock, Calendar, Briefcase,
    TrendingUp, CheckCircle2, ShieldCheck, Settings,
    Edit2, Camera, Star
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const MaintenanceProfile = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ completed: 124, rating: 4.9, active: 3, uptime: '99.2%' });

    return (
        <DashboardLayout role="maintenance">
            <div style={{ padding: '0 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.4rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>Personnel Portal</h1>
                        <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 500 }}>
                            Technical credentials and operational performance tracking
                        </p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3.5rem' }}>
                    {/* Left: Identity Card */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <div className="stat-card-white" style={{ padding: '3rem', textAlign: 'center' }}>
                            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 2rem' }}>
                                <div style={{ 
                                    width: '100%', height: '100%', borderRadius: '40px', 
                                    background: '#f8fafc', border: '1px solid #e2e8f0',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9'
                                }}>
                                    <User size={64} />
                                </div>
                                <button style={{ 
                                    position: 'absolute', bottom: '0', right: '0',
                                    padding: '0.6rem', borderRadius: '12px', background: '#0ea5e9',
                                    color: 'white', border: '3px solid white', cursor: 'pointer'
                                }}>
                                    <Camera size={16} />
                                </button>
                            </div>
                            <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 950, color: '#0f172a' }}>{user?.full_name || 'Senior Technician'}</h2>
                            <p style={{ margin: '0.4rem 0 2rem', fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Lead Operational Engineer (Sector 4)</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.4rem', fontWeight: 950, color: '#0f172a' }}>{stats.completed}</div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8' }}>TOTAL TASKS</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.4rem', fontWeight: 950, color: '#10b981' }}>{stats.rating}</div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8' }}>AVG RATING</div>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card-white">
                            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.5rem' }}>Certifications</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ padding: '0.6rem', borderRadius: '10px', background: '#f5f3ff', color: '#6366f1' }}>
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 850 }}>HVAC Level 3 Specialist</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Certified Apr 2025</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ padding: '0.6rem', borderRadius: '10px', background: '#f0fdf4', color: '#10b981' }}>
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 850 }}>MEP Safety (Clinical)</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Certified Nov 2025</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Duty & Detailed Stats */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <div className="stat-card-white" style={{ padding: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.2rem' }}>Duty Schedule</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 1rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: 800, color: '#64748b' }}>
                                    <Calendar size={16} /> March 2026
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.8rem' }}>
                                {[...Array(14)].map((_, i) => (
                                    <div key={i} style={{ 
                                        aspectRatio: '1', borderRadius: '12px', 
                                        background: [1, 3, 5, 8, 10, 12].includes(i) ? '#0ea5e9' : '#f8fafc',
                                        color: [1, 3, 5, 8, 10, 12].includes(i) ? 'white' : '#94a3b8',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.9rem', fontWeight: 900, border: '1px solid #f1f5f9'
                                    }}>
                                        {i + 20}
                                    </div>
                                ))}
                            </div>
                            <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                                * Next Shift: 24th March, 08:00 AM (Central Plant)
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div className="stat-card-white">
                                <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.5rem' }}>Response Metrics</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <TrendingUp size={32} color="#10b981" />
                                    <div>
                                        <div style={{ fontSize: '1.8rem', fontWeight: 950 }}>14m</div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>AVG RESPONSE TIME</div>
                                    </div>
                                </div>
                            </div>
                            <div className="stat-card-white">
                                <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.5rem' }}>Asset Up-time</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <CheckCircle2 size={32} color="#0ea5e9" />
                                    <div>
                                        <div style={{ fontSize: '1.8rem', fontWeight: 950 }}>{stats.uptime}</div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>ZONE STABILITY</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card-white" style={{ background: '#0f172a', color: 'white', border: 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#0ea5e9' }}>
                                        <Settings size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontWeight: 900 }}>Preferences & Bio</h4>
                                        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6 }}>Manage operational role details</p>
                                    </div>
                                </div>
                                <button style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 800 }}>
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MaintenanceProfile;
