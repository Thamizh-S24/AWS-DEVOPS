import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    User, Lock, Bell, Eye, 
    Smartphone, ShieldCheck, LogOut, ChevronRight,
    Search, CreditCard, HelpCircle
} from 'lucide-react';
import PatientLayout from '../../components/PatientLayout';
import { useAuth } from '../../context/AuthContext';

const PatientSectionHeader = ({ title, subtitle }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 950, color: '#1e3a8a', margin: 0, letterSpacing: '-1px' }}>{title}</h2>
            <div style={{ height: '5px', width: '80px', background: 'linear-gradient(90deg, #1e40af, #3b82f6)', borderRadius: '2px', margin: '0.8rem 0' }} />
            <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.4rem', fontWeight: 500 }}>{subtitle}</p>
        </div>
    </div>
);

const SettingItem = ({ icon: Icon, label, value, color }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${color}10`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} />
            </div>
            <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 950, color: '#0f172a' }}>{label}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginTop: '0.2rem' }}>{value}</div>
            </div>
        </div>
        <ChevronRight size={18} color="#94a3b8" />
    </div>
);

const ToggleSetting = ({ label, description, checked }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
        <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 950, color: '#0f172a' }}>{label}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginTop: '0.3rem' }}>{description}</div>
        </div>
        <div style={{ width: '50px', height: '26px', background: checked ? '#10b981' : '#e2e8f0', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
            <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: checked ? '27px' : '3px', transition: 'left 0.2s' }} />
        </div>
    </div>
);

const PatientSettings = () => {
    const { user, logout } = useAuth();

    return (
        <PatientLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                <PatientSectionHeader 
                    title="Privacy & Profile Settings" 
                    subtitle="Manage your clinical identity, security parameters, and communication preferences"
                />

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '3.5rem' }}>
                    
                    {/* Left Column: Profile Card */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="stat-card-white" style={{ padding: '3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100px', background: 'var(--grad-main)', opacity: 0.1 }} />
                            <div style={{ width: '100px', height: '100px', borderRadius: '30px', border: '4px solid white', background: '#f8fafc', margin: '0 auto 2rem', position: 'relative', overflow: 'hidden', zIndex: 1 }}>
                                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <h3 style={{ margin: 0, fontWeight: 950, color: '#0f172a', fontSize: '1.5rem', letterSpacing: '-0.5px' }}>{user?.username || 'Jane Cooper'}</h3>
                            <p style={{ margin: '0.5rem 0 2rem 0', color: '#64748b', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Patient ID: #HM-44821</p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <button style={{ padding: '1.1rem', borderRadius: '15px', background: 'linear-gradient(95deg, #1e3a8a, #1e40af)', color: 'white', border: 'none', fontWeight: 950, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', boxShadow: '0 8px 16px rgba(30, 58, 138, 0.15)' }}>
                                    <User size={18} /> EDIT PROFILE
                                </button>
                                <button 
                                    onClick={logout}
                                    style={{ padding: '1.1rem', borderRadius: '15px', background: 'white', border: '1px solid #ef4444', color: '#ef4444', fontWeight: 950, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}
                                >
                                    <LogOut size={18} /> TERMINATE SESSION
                                </button>
                            </div>
                        </div>

                        <div className="stat-card-white" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h4 style={{ margin: '0 0 1rem 0', fontWeight: 950, fontSize: '1rem', color: '#0f172a' }}>Quick Navigation</h4>
                            <button style={{ padding: '1rem', borderRadius: '12px', background: '#f8fafc', border: 'none', color: '#64748b', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                                <CreditCard size={18} /> BILLING & PAYMENTS
                            </button>
                            <button style={{ padding: '1rem', borderRadius: '12px', background: '#f8fafc', border: 'none', color: '#64748b', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                                <HelpCircle size={18} /> PATIENT SUPPORT HUB
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Detailed Settings */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        
                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ padding: '0.8rem', borderRadius: '14px', background: 'rgba(30, 58, 138, 0.1)', color: '#1e40af' }}>
                                    <ShieldCheck size={22} />
                                </div>
                                <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1.4rem', color: '#0f172a' }}>Security & Privacy</h3>
                            </div>
                            
                            <div className="stat-card-white" style={{ padding: '2.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
                                    <SettingItem icon={Lock} label="Password Security" value="Last updated 3 months ago" color="#1e40af" />
                                    <SettingItem icon={Smartphone} label="Two-Factor Auth" value="Active | +1 (•••) •••-4291" color="#10b981" />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <ToggleSetting 
                                        label="Clinical Data Sharing" 
                                        description="Allow verified external practitioners to view your longitudinal EHR via FHIR nodes."
                                        checked={true}
                                    />
                                    <ToggleSetting 
                                        label="Anonymous Research" 
                                        description="Donate anonymized health telemetry to the Healix Clinical Research Wing."
                                        checked={false}
                                    />
                                    <ToggleSetting 
                                        label="Biometric Login" 
                                        description="Utilize FaceID/TouchID for expedited clinical dashboard access."
                                        checked={true}
                                    />
                                </div>
                            </div>
                        </section>

                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ padding: '0.8rem', borderRadius: '14px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                                    <Bell size={22} />
                                </div>
                                <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1.4rem', color: '#0f172a' }}>Notification Logic</h3>
                            </div>
                            
                            <div className="stat-card-white" style={{ padding: '2.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '1.5rem', lineHeight: '1.6' }}>
                                        Food allergies or religious dietary requirements? Please update your <span style={{ color: '#1e40af', fontWeight: 950, textDecoration: 'underline', cursor: 'pointer' }}>Care Settings</span> to notify the kitchen node.
                                    </p>
                                    <ToggleSetting 
                                        label="Emergency Critical Alerts" 
                                        description="Instant push notifications for lab findings that require immediate clinical action."
                                        checked={true}
                                    />
                                    <ToggleSetting 
                                        label="Medication Reminders" 
                                        description="Scheduled alerts for your prescribed pharmacy delivery cycles."
                                        checked={true}
                                    />
                                    <ToggleSetting 
                                        label="Telehealth Room Ready" 
                                        description="Notify me when a practitioner enters the Virtual Care Room."
                                        checked={true}
                                    />
                                </div>
                            </div>
                        </section>

                    </div>

                </div>
            </div>
        </PatientLayout>
    );
};

export default PatientSettings;
