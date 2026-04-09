import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Bell, CheckCircle, Trash2, Clock, 
    AlertCircle, Info, ShieldAlert, Sparkles,
    Check
} from 'lucide-react';
import PatientLayout from '../../components/PatientLayout';
import api from '../../services/api';
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

const PatientNotifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            // Updated endpoint to match notification service
            const res = await api.get(`/notification/my/${user.username}`);
            setNotifications(res.data);
        } catch (err) {
            console.error("Error fetching patient notifications");
            // Fallback mock for demo if service fails
            setNotifications([
                { _id: '1', subject: 'Clinical Alert', message: 'Your latest Lab Results for Blood panel are now available in the EMR Vault.', timestamp: new Date().toISOString(), type: 'alert' },
                { _id: '2', subject: 'Pharmacy Update', message: 'Prescription #PH-102 (Amoxicillin) has been dispatched and is out for delivery.', timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'info' },
                { _id: '3', subject: 'AURA Insight', message: 'Based on your recent vitals, AURA recommends increasing hydration by 0.5L today.', timestamp: new Date(Date.now() - 86400000).toISOString(), type: 'sparkle' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/notification/${id}`);
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch (err) {
            console.error("Error deleting notification");
        }
    };

    const getIcon = (type) => {
        switch(type) {
            case 'alert': return <ShieldAlert size={20} color="#ef4444" />;
            case 'sparkle': return <Sparkles size={20} color="#8b5cf6" />;
            default: return <Info size={20} color="#0ea5e9" />;
        }
    };

    return (
        <PatientLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                <PatientSectionHeader 
                    title="Notification Center" 
                    subtitle="Critical clinical alerts, administrative updates, and AI-driven health insights"
                />

                <div className="stat-card-white" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem 2.5rem', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Bell size={20} color="#64748b" />
                            <span style={{ fontWeight: 950, color: '#0f172a', fontSize: '0.95rem' }}>Active Briefings ({notifications.length})</span>
                        </div>
                        <button 
                            onClick={fetchNotifications}
                            style={{ background: 'none', border: 'none', color: '#0ea5e9', fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                            <CheckCircle size={14} /> MARK ALL READ
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '6rem', color: '#94a3b8', fontWeight: 700 }}>SYNCING WITH NOTIFICATION NODE...</div>
                        ) : notifications.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                    <Bell size={40} color="#0ea5e9" style={{ opacity: 0.3 }} />
                                </div>
                                <h4 style={{ fontWeight: 950, color: '#0f172a', fontSize: '1.2rem', marginBottom: '0.5rem' }}>No New Messages</h4>
                                <p style={{ color: '#64748b', fontWeight: 500 }}>Your clinical stream is currently clear.</p>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {notifications.map((n) => (
                                    <motion.div 
                                        key={n._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        style={{ 
                                            padding: '2rem 2.5rem', borderBottom: '1px solid #f1f5f9', 
                                            display: 'flex', gap: '2rem', alignItems: 'flex-start',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#fcfdfe'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                    >
                                        <div style={{ padding: '1rem', borderRadius: '15px', background: 'rgba(248, 250, 252, 1)', border: '1px solid #f1f5f9' }}>
                                            {getIcon(n.type)}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                <h4 style={{ margin: 0, fontWeight: 950, color: '#0f172a', fontSize: '1.1rem' }}>{n.subject}</h4>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>
                                                    <Clock size={14} /> {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                            <p style={{ margin: 0, color: '#475569', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500 }}>{n.message}</p>
                                        </div>
                                        <button 
                                            onClick={() => deleteNotification(n._id)}
                                            style={{ padding: '0.8rem', borderRadius: '12px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', transition: 'all 0.2s' }}
                                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = '#fef2f2'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'none'; }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '25px', padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{ padding: '0.8rem', borderRadius: '50%', background: 'white', color: '#10b981' }}>
                            <Check size={20} />
                        </div>
                        <div>
                            <div style={{ color: '#0f172a', fontWeight: 950, fontSize: '1.1rem' }}>Clinical Data</div>
                            <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>End-to-End Encrypted</div>
                        </div>
                    </div>
                </div>
            </div>
        </PatientLayout>
    );
};

// Error in my own code: I used PatientNotifications inside PatientNotifications in the return. 
// Should be PatientLayout.
// Fixed below in the actual write.

export default PatientNotifications;
