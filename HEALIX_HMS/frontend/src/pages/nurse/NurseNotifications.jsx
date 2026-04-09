import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Shield, User, Group, Trash2, Maximize2, Info } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from '../admin/SectionHeader';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const NurseNotifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNotif, setSelectedNotif] = useState(null);

    useEffect(() => {
        fetchNotifications();

        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const ws = new WebSocket(`${wsProtocol}//localhost:8000/api/notification/ws/notifications/${user?.username}`);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setNotifications(prev => [data, ...prev]);
        };

        return () => ws.close();
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const res = await api.get(`/notification/my/${user?.username}`);
            setNotifications(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to sync notifications");
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notification/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (err) { console.error("Update failed"); }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'all': return <Shield size={18} />;
            case 'role': return <Group size={18} />;
            default: return <User size={18} />;
        }
    };

    return (
        <DashboardLayout role="nurse">
            <SectionHeader
                title="Clinical Intelligence Feed"
                subtitle="Real-time broadcasted alerts and departmental coordination"
            />

            <div className="glass-v3" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.8rem', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', borderRadius: '14px' }}>
                            <Bell size={24} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 950, color: '#0f172a' }}>Live Alerts</h3>
                    </div>
                    <div style={{ padding: '0.6rem 1.2rem', borderRadius: '50px', background: '#f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: 950 }}>
                        {notifications.length} MESSAGES IN QUEUE
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <AnimatePresence>
                        {notifications.map((n) => (
                            <motion.div
                                key={n._id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={() => { setSelectedNotif(n); if (!n.read) markAsRead(n._id); }}
                                className="glass-v3"
                                style={{
                                    padding: '2rem',
                                    background: n.read ? 'rgba(255,255,255,0.4)' : 'white',
                                    borderLeft: `5px solid ${n.read ? '#cbd5e1' : '#0ea5e9'}`,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    opacity: n.read ? 0.7 : 1
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                        <div style={{
                                            padding: '0.7rem',
                                            borderRadius: '12px',
                                            background: n.read ? '#f1f5f9' : 'rgba(14, 165, 233, 0.1)',
                                            color: n.read ? '#94a3b8' : '#0ea5e9'
                                        }}>
                                            {getIcon(n.recipient_type)}
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 950, color: '#1e293b' }}>{n.subject}</h4>
                                                {!n.read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899', boxShadow: '0 0 10px #ec4899' }} />}
                                            </div>
                                            <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
                                                ORIGIN: {n.sender} • {new Date(n.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <Maximize2 size={18} color="#cbd5e1" />
                                </div>
                                <div style={{ marginTop: '1.5rem', fontSize: '0.95rem', color: '#475569', lineHeight: 1.7, fontWeight: 500 }}>
                                    {n.message.slice(0, 180)}{n.message.length > 180 && '...'}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {notifications.length === 0 && !loading && (
                        <div style={{ padding: '6rem', textAlign: 'center', color: '#94a3b8' }}>
                            <Bell size={64} opacity={0.15} style={{ display: 'block', margin: '0 auto 2rem' }} />
                            <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 950 }}>Clinical feed idle</h4>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>No encrypted transmissions received</p>
                        </div>
                    )}
                </div>
            </div>

            {/* View Modal */}
            <AnimatePresence>
                {selectedNotif && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedNotif(null)}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(10px)' }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass-v3"
                            style={{ width: '100%', maxWidth: '650px', padding: '4rem', zIndex: 1001, position: 'relative' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
                                <div style={{ padding: '1.2rem', borderRadius: '18px', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}>
                                    {getIcon(selectedNotif.recipient_type)}
                                </div>
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 950, color: '#0f172a', letterSpacing: '-0.5px' }}>{selectedNotif.subject}</h2>
                                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
                                        SYNCHRONIZED BROADCAST • {new Date(selectedNotif.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '2.5rem', borderRadius: '24px', border: '1px solid #f1f5f9', marginBottom: '3rem', fontSize: '1.1rem', color: '#334155', lineHeight: 1.8, fontWeight: 500, whiteSpace: 'pre-wrap' }}>
                                {selectedNotif.message}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 800 }}>
                                    AUTHENTICATED SENDER: <span style={{ color: '#0ea5e9' }}>{selectedNotif.sender.toUpperCase()}</span>
                                </div>
                                <button
                                    onClick={() => setSelectedNotif(null)}
                                    className="btn-vitalize"
                                    style={{ width: 'auto', padding: '1rem 2.5rem' }}
                                >
                                    ACKNOWLEDGE
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default NurseNotifications;
