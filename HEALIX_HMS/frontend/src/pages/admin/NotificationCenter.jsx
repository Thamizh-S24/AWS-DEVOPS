import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Send, Users, Shield, Filter, CheckCircle, AlertTriangle, User, Group, Trash2, Maximize2 } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader, { StatCard } from './SectionHeader';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const NotificationCenter = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [users, setUsers] = useState([]);
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        recipient_type: 'all',
        recipient_id: '',
        message: '',
        subject: 'System Maintenance Alert',
        send_email: false
    });

    useEffect(() => {
        fetchNotifications();
        fetchUsers();

        // WebSocket logic
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
        } catch (err) { console.error("Failed to sync notifications"); }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/auth/users');
            setUsers(res.data);
        } catch (err) { console.error("Failed to sync personnel"); }
    };

    const handleDispatch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/notification/send', {
                ...formData,
                sender: user?.username
            });
            setMsg('Notification broadcasted successfully');
            setFormData({ ...formData, message: '' });
            setTimeout(() => setMsg(''), 3000);
            fetchNotifications();
        } catch (err) { setMsg('Dispatch failed'); }
        finally { setLoading(false); }
    };

    const [selectedNotif, setSelectedNotif] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notification/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (err) { console.error("Update failed"); }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/notification/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
            setConfirmDeleteId(null);
        } catch (err) {
            console.error("Delete failed", err);
            setMsg('Failed to delete notification');
            setTimeout(() => setMsg(''), 3000);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'all': return <Shield size={18} />;
            case 'role': return <Group size={18} />;
            default: return <User size={18} />;
        }
    };

    return (
        <DashboardLayout role="admin">
            <SectionHeader
                title="Notification Command"
                subtitle="Real-time clinical broadcast & personnel coordination"
            />

            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) 450px', gap: '3.5rem' }}>

                {/* Notification Feed */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-v3" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 950, color: '#0f172a' }}>Live Feed</h3>
                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                                <div style={{ padding: '0.5rem 1rem', borderRadius: '50px', background: '#f8fafc', color: '#64748b', fontSize: '0.75rem', fontWeight: 900, border: '1px solid #f1f5f9' }}>{notifications.length} MESSAGES</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <AnimatePresence>
                                {notifications.map((n) => (
                                    <motion.div
                                        key={n._id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="glass-v3"
                                        style={{
                                            padding: '1.8rem',
                                            background: n.read ? 'rgba(255,255,255,0.3)' : 'white',
                                            borderLeft: `4px solid ${n.read ? '#e2e8f0' : '#0ea5e9'}`,
                                            opacity: n.read ? 0.8 : 1,
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                                                <div style={{
                                                    padding: '0.8rem',
                                                    borderRadius: '12px',
                                                    background: n.read ? '#f1f5f9' : 'rgba(14, 165, 233, 0.1)',
                                                    color: n.read ? '#64748b' : '#0ea5e9'
                                                }}>
                                                    {getIcon(n.recipient_type)}
                                                </div>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#1e293b' }}>{n.subject}</h4>
                                                        {!n.read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ec4899' }}></span>}
                                                    </div>
                                                    <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                                                        SENT BY {n.sender} • {new Date(n.timestamp).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.8rem', position: 'relative', zIndex: 10 }}>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedNotif(n); }}
                                                    title="View Message"
                                                    style={{ background: 'rgba(14, 165, 233, 0.1)', border: 'none', color: '#0ea5e9', cursor: 'pointer', padding: '0.7rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                                >
                                                    <Maximize2 size={18} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(n._id); }}
                                                    title="Delete"
                                                    style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.7rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '1.2rem', fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, fontWeight: 500 }}>
                                            {n.message.slice(0, 120)}{n.message.length > 120 && '...'}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {notifications.length === 0 && (
                                <div style={{ padding: '5rem', textAlign: 'center', color: '#94a3b8' }}>
                                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                                        <div style={{ padding: '1.5rem', borderRadius: '30px', background: '#f8fafc' }}><Bell size={48} opacity={0.3} /></div>
                                    </div>
                                    <h4 style={{ margin: 0, fontWeight: 800 }}>No active communications</h4>
                                    <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>All clinical nodes are currently synchronized</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* VIEW MODAL */}
                <AnimatePresence>
                    {selectedNotif && (
                        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedNotif(null)}
                                style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(8px)' }}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="glass-v3"
                                style={{ width: '100%', maxWidth: '600px', padding: '3rem', zIndex: 1001, position: 'relative' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                        <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}>
                                            {getIcon(selectedNotif.recipient_type)}
                                        </div>
                                        <div>
                                            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 950, color: '#0f172a' }}>{selectedNotif.subject}</h2>
                                            <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
                                                SECURE BROADCAST • {new Date(selectedNotif.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9', marginBottom: '2.5rem' }}>
                                    <div style={{ fontSize: '1.05rem', color: '#334155', lineHeight: 1.8, fontWeight: 500, whiteSpace: 'pre-wrap' }}>
                                        {selectedNotif.message}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>
                                        SENDER IDENTITY: <span style={{ color: '#0ea5e9' }}>{selectedNotif.sender.toUpperCase()}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button
                                            onClick={() => { setConfirmDeleteId(selectedNotif._id); setSelectedNotif(null); }}
                                            style={{ padding: '1rem 1.5rem', borderRadius: '14px', border: '1.5px solid #ef4444', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', fontWeight: 900, cursor: 'pointer', fontSize: '0.8rem' }}
                                        >
                                            DELETE
                                        </button>
                                        {!selectedNotif.read && (
                                            <button
                                                onClick={() => { markAsRead(selectedNotif._id); setSelectedNotif(null); }}
                                                className="btn-vitalize"
                                                style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', width: 'auto' }}
                                            >
                                                ACKNOWLEDGE
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setSelectedNotif(null)}
                                            style={{ padding: '1rem 1.5rem', borderRadius: '14px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 900, cursor: 'pointer', fontSize: '0.8rem', color: '#64748b' }}
                                        >
                                            CLOSE
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* DELETE CONFIRMATION MODAL */}
                <AnimatePresence>
                    {confirmDeleteId && (
                        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setConfirmDeleteId(null)}
                                style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)' }}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                className="glass-v3"
                                style={{ width: '100%', maxWidth: '420px', padding: '3rem', zIndex: 1101, position: 'relative', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                            >
                                <div style={{ width: '70px', height: '70px', borderRadius: '22px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 20px rgba(239, 68, 68, 0.1)' }}>
                                    <Trash2 size={32} />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 950, color: '#0f172a', letterSpacing: '-0.5px' }}>Confirm Deletion</h3>
                                <p style={{ margin: '1rem 0 2.5rem 0', fontSize: '0.95rem', color: '#64748b', fontWeight: 500, lineHeight: 1.6 }}>
                                    Are you sure you want to remove this notification? This action is permanent and cannot be undone.
                                </p>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        onClick={() => setConfirmDeleteId(null)}
                                        style={{ flex: 1, padding: '1.2rem', borderRadius: '16px', border: '1.5px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 900, cursor: 'pointer', transition: 'all 0.2s' }}
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        onClick={() => handleDelete(confirmDeleteId)}
                                        style={{ flex: 1, padding: '1.2rem', borderRadius: '16px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 900, cursor: 'pointer', boxShadow: '0 8px 16px rgba(239, 68, 68, 0.2)', transition: 'all 0.2s' }}
                                    >
                                        YES, DELETE
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Dispatch Panel */}
                <div>
                    <motion.div
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="glass-v3"
                        style={{ padding: '3rem', position: 'sticky', top: '2rem' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                            <div style={{ padding: '0.8rem', background: 'var(--grad-main)', color: 'white', borderRadius: '14px', boxShadow: '0 8px 16px rgba(14, 165, 233, 0.2)' }}>
                                <Send size={22} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 950, color: '#0f172a', letterSpacing: '-0.5px' }}>Broadcast Command</h3>
                                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Dispatch secure clinical updates</p>
                            </div>
                        </div>

                        <form onSubmit={handleDispatch} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Recipient Mesh</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                    {['all', 'role', 'user'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, recipient_type: type, recipient_id: '' })}
                                            style={{
                                                padding: '0.8rem',
                                                borderRadius: '12px',
                                                border: '1.5px solid',
                                                borderColor: formData.recipient_type === type ? '#0ea5e9' : '#f1f5f9',
                                                background: formData.recipient_type === type ? 'rgba(14, 165, 233, 0.05)' : 'white',
                                                color: formData.recipient_type === type ? '#0ea5e9' : '#64748b',
                                                fontSize: '0.75rem',
                                                fontWeight: 900,
                                                textTransform: 'uppercase',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {formData.recipient_type !== 'all' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        {formData.recipient_type === 'role' ? 'Select Logistics Role' : 'Select Target Identity'}
                                    </label>
                                    <select
                                        value={formData.recipient_id}
                                        onChange={e => setFormData({ ...formData, recipient_id: e.target.value })}
                                        style={{ padding: '1rem', borderRadius: '14px', border: '1.5px solid #f1f5f9', fontWeight: 700 }}
                                        required
                                    >
                                        <option value="">Choose target...</option>
                                        {formData.recipient_type === 'role' ? (
                                            ['admin', 'doctor', 'nurse', 'pharmacist', 'lab_tech', 'receptionist', 'maintenance'].map(r => (
                                                <option key={r} value={r}>{r.toUpperCase()}</option>
                                            ))
                                        ) : (
                                            users.map(u => (
                                                <option key={u.username} value={u.username}>{u.full_name} (@{u.username})</option>
                                            ))
                                        )}
                                    </select>
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Message Header</label>
                                <input
                                    placeholder="Brief subject line..."
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    style={{ padding: '1rem', borderRadius: '14px', border: '1.5px solid #f1f5f9', fontWeight: 700 }}
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Broadcast Pay-load</label>
                                <textarea
                                    placeholder="Synthesize the mission critical information here..."
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    style={{ padding: '1.2rem', borderRadius: '16px', border: '1.5px solid #f1f5f9', minHeight: '150px', resize: 'none', fontWeight: 500, lineHeight: 1.6 }}
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '16px' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.send_email}
                                    onChange={e => setFormData({ ...formData, send_email: e.target.checked })}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Synchronize with External Mail (SMTP)</span>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-vitalize"
                                style={{ padding: '1.4rem', borderRadius: '18px', fontSize: '1rem', fontWeight: 950, letterSpacing: '1px', opacity: loading ? 0.7 : 1 }}
                            >
                                {loading ? 'BROADCASTING...' : 'DISPATCH SECURE ALERT'}
                            </button>
                        </form>
                        {msg && <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ textAlign: 'center', fontSize: '0.85rem', fontWeight: 900, color: '#10b981', marginTop: '1.5rem' }}>{msg}</motion.p>}
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default NotificationCenter;
