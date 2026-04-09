import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Info, ShieldAlert, Camera, CheckCircle2, Search, X } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const RadiologyNotifications = () => {
    const { user } = useAuth();
    const [notifs, setNotifs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get(`/notification/my/${user.username}`);
            setNotifs(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (err) {
            console.error("Transmission error");
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notification/read/${id}`);
            setNotifs(notifs.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (err) { console.error("Update failed"); }
    };

    const deleteNotif = async (id) => {
        try {
            await api.delete(`/notification/${id}`);
            setNotifs(notifs.filter(n => n._id !== id));
        } catch (err) { console.error("Deletion failed"); }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'emergency': return <ShieldAlert size={20} color="#ef4444" />;
            case 'lab': return <Camera size={20} color="#3b82f6" />;
            default: return <Info size={20} color="#64748b" />;
        }
    };

    return (
        <DashboardLayout role="radiologist">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>Clinical Alert Hub</h2>
                    <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.4rem', fontWeight: 500 }}>Real-time telemetry and imaging dispatch notifications</p>
                </div>
                <div className="glass-v3" style={{ padding: '0.5rem 1.5rem', background: '#3b82f6', color: 'white', fontWeight: 900, fontSize: '0.8rem', borderRadius: '12px' }}>
                    {notifs.filter(n => !n.read).length} UNREAD ALERTS
                </div>
            </div>

            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem' }}>
                        <div className="animate-spin" style={{ display: 'inline-block' }}><Bell size={48} color="#3b82f6" strokeWidth={1} /></div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <AnimatePresence>
                            {notifs.map(notif => (
                                <motion.div
                                    key={notif._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="glass-v3"
                                    style={{
                                        padding: '1.5rem 2rem',
                                        background: notif.read ? 'rgba(248, 250, 252, 0.5)' : '#ffffff',
                                        border: notif.read ? '1px solid #f1f5f9' : '1px solid #dbeafe',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1.5rem',
                                        position: 'relative',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div style={{
                                        padding: '1rem',
                                        borderRadius: '16px',
                                        background: notif.read ? '#f8fafc' : '#eff6ff',
                                        color: '#3b82f6'
                                    }}>
                                        {getIcon(notif.type)}
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: notif.read ? '#64748b' : '#1e1b4b' }}>{notif.title}</h4>
                                            <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800 }}>{new Date(notif.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                        <p style={{ margin: '0.4rem 0 0', fontSize: '0.9rem', color: notif.read ? '#94a3b8' : '#475569', fontWeight: 600 }}>{notif.message}</p>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {!notif.read && (
                                            <button
                                                onClick={() => markAsRead(notif._id)}
                                                style={{ border: 'none', background: 'transparent', color: '#10b981', cursor: 'pointer', padding: '0.5rem' }}
                                                title="Mark as Read"
                                            >
                                                <CheckCircle2 size={20} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotif(notif._id)}
                                            style={{ border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', padding: '0.5rem' }}
                                            title="Archive Alert"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {notifs.length === 0 && (
                            <div className="glass-v3" style={{ padding: '5rem', textAlign: 'center', background: '#f8fafc' }}>
                                <div style={{ opacity: 0.2, marginBottom: '1.5rem' }}><Bell size={64} /></div>
                                <h3 style={{ margin: 0, fontWeight: 950 }}>Telemetric Silence</h3>
                                <p style={{ color: '#64748b', fontWeight: 600 }}>No active clinical alerts detected for this workstation.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default RadiologyNotifications;
