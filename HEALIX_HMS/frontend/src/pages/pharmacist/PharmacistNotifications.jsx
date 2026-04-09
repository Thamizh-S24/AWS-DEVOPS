import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Shield, Package, Trash2, Maximize2, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from '../admin/SectionHeader';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PharmacistNotifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNotif, setSelectedNotif] = useState(null);

    useEffect(() => {
        fetchNotifications();
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const ws = new WebSocket(`${wsProtocol}//${window.location.hostname}:8000/api/notification/ws/notifications/${user?.username}`);
        ws.onmessage = (event) => setNotifications(prev => [JSON.parse(event.data), ...prev]);
        return () => ws.close();
    }, [user]);

    const fetchNotifications = async () => {
        try {
            if (!user?.username) return;
            const res = await api.get(`/notification/my/${user.username}`);
            setNotifications(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (err) { setLoading(false); }
    };

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notification/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (err) { }
    };

    return (
        <DashboardLayout role="pharmacist">
            <SectionHeader
                title="Clinical Intelligence Feed"
                subtitle="Real-time clinical broadcasts and inventory depletion alerts"
            />

            <div className="glass-v3" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <AnimatePresence>
                        {(Array.isArray(notifications) ? notifications : []).map((n) => (
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
                                    borderLeft: `5px solid ${n.read ? '#cbd5e1' : '#ec4899'}`,
                                    cursor: 'pointer',
                                    opacity: n.read ? 0.7 : 1
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                        <div style={{
                                            padding: '0.7rem',
                                            borderRadius: '12px',
                                            background: n.read ? '#f1f5f9' : 'rgba(236, 72, 153, 0.1)',
                                            color: n.read ? '#94a3b8' : '#ec4899'
                                        }}>
                                            {n.subject.toLowerCase().includes('stock') ? <Package size={18} /> : <AlertTriangle size={18} />}
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 950, color: '#1e293b' }}>{n.subject}</h4>
                                            <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
                                                ORIGIN: {n.sender} • {new Date(n.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <Maximize2 size={18} color="#cbd5e1" />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {(Array.isArray(notifications) ? notifications : []).length === 0 && !loading && (
                        <div style={{ padding: '6rem', textAlign: 'center', color: '#94a3b8' }}>
                            <Bell size={64} opacity={0.15} style={{ display: 'block', margin: '0 auto 2rem' }} />
                            <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 950 }}>Secure line idle</h4>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>No clinical alerts in queue</p>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {selectedNotif && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedNotif(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(10px)' }} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-v3" style={{ width: '100%', maxWidth: '600px', padding: '3.5rem', zIndex: 1001, background: 'white' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 950, marginBottom: '2rem' }}>{selectedNotif.subject}</h2>
                            <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '20px', marginBottom: '2.5rem', lineHeight: 1.8 }}>
                                {selectedNotif.message}
                            </div>
                            <button onClick={() => setSelectedNotif(null)} className="btn-vitalize">ACKNOWLEDGE</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default PharmacistNotifications;
