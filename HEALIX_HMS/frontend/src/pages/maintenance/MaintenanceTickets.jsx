import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ClipboardList, Wrench, Trash2, Clock, 
    AlertCircle, CheckCircle2, Plus, 
    Filter, Search, User, MapPin, 
    Zap, Pill, Truck, ShieldCheck, Monitor
} from 'lucide-react';

import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

const CategoryBadge = ({ category }) => {
    const config = {
        Technical: { color: '#0ea5e9', bg: '#f0f9ff', icon: <Wrench size={12} /> },
        Sanitation: { color: '#10b981', bg: '#f0fdf4', icon: <Trash2 size={12} /> },
        Biomed: { color: '#a855f7', bg: '#faf5ff', icon: <Zap size={12} /> },
        Portering: { color: '#f59e0b', bg: '#fffbeb', icon: <Truck size={12} /> },
        IT: { color: '#6366f1', bg: '#f5f3ff', icon: <Monitor size={12} /> }
    };
    const c = config[category] || config.Technical;
    return (
        <span style={{ 
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.3rem 0.6rem', borderRadius: '8px',
            fontSize: '0.65rem', fontWeight: 800,
            color: c.color, background: c.bg
        }}>
            {c.icon} {category.toUpperCase()}
        </span>
    );
};

const PriorityBadge = ({ priority }) => {
    const config = {
        High: { color: '#ef4444', bg: '#fef2f2' },
        Medium: { color: '#f59e0b', bg: '#fffbeb' },
        Low: { color: '#64748b', bg: '#f8fafc' }
    };
    const p = config[priority] || config.Low;
    return (
        <span style={{ 
            padding: '0.2rem 0.5rem', borderRadius: '6px',
            fontSize: '0.6rem', fontWeight: 900,
            color: p.color, background: p.bg,
            border: `1px solid ${p.color}20`
        }}>
            {priority.toUpperCase()}
        </span>
    );
};

const MaintenanceTickets = () => {
    const [tasks, setTasks] = useState([]);
    const [sanitations, setSanitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewTicket, setShowNewTicket] = useState(false);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const [form, setForm] = useState({
        title: '',
        location: '',
        category: 'Technical',
        priority: 'Medium',
        description: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [tasksRes, wardsRes] = await Promise.all([
                api.get('/maintenance/tasks'),
                api.get('/ward/status')
            ]);
            
            setTasks(tasksRes.data);
            
            // Extract sanitation tasks from ward beds
            const sanitationTasks = (wardsRes.data || []).flatMap(w => 
                w.rooms.flatMap(r => 
                    r.beds.filter(b => b.status === 'Cleaning').map(b => ({
                        id: b.id,
                        title: `Sanitize Bed ${b.id}`,
                        location: `${w.name} - Room ${r.id}`,
                        category: 'Sanitation',
                        priority: 'High',
                        status: 'Pending',
                        created_at: new Date().toISOString()
                    }))
                )
            );
            setSanitations(sanitationTasks);
        } catch (err) {
            console.error("Failed to fetch operational queue");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try {
            await api.post('/maintenance/tasks', form);
            setShowNewTicket(false);
            setForm({ title: '', location: '', category: 'Technical', priority: 'Medium', description: '' });
            fetchData();
        } catch (err) { console.error("Ticket creation failed"); }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.patch(`/maintenance/task/${id}`, null, { params: { status } });
            fetchData();
        } catch (err) { console.error("Status update failed"); }
    };

    const handleResolveSanitation = async (bedId) => {
        try {
            await api.post('/ward/bed/restore', null, { params: { bed_id: bedId } });
            fetchData();
        } catch (err) { console.error("Sanitation resolution failed"); }
    };

    const allQueueItems = [...tasks, ...sanitations].filter(item => {
        const matchesFilter = filter === 'All' || item.category === filter;
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             item.location.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return (
        <DashboardLayout role="maintenance">
            <div style={{ padding: '0 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.4rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>Unified Service Desk</h1>
                        <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 500 }}>
                            Integrated technical and housekeeping operational queue
                        </p>
                    </div>
                    <button 
                        onClick={() => setShowNewTicket(true)}
                        className="btn-vitalize" 
                        style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem 2rem' }}
                    >
                        <Plus size={20} /> New Service Ticket
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
                    {/* Filters & Search */}
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                            <Search style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                            <input 
                                placeholder="Search by task or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ 
                                    padding: '1rem 1.2rem 1rem 3.5rem', width: '100%', 
                                    borderRadius: '16px', border: '1px solid #e2e8f0',
                                    background: 'white', fontSize: '0.9rem', outline: 'none'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                            {['All', 'Technical', 'Sanitation', 'Biomed', 'Portering'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    style={{ 
                                        padding: '0.8rem 1.5rem', borderRadius: '14px',
                                        fontSize: '0.8rem', fontWeight: 800,
                                        background: filter === cat ? '#0ea5e9' : 'white',
                                        color: filter === cat ? 'white' : '#64748b',
                                        border: filter === cat ? 'none' : '1px solid #e2e8f0',
                                        cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Task List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '5rem', color: '#94a3b8', fontWeight: 700 }}>SYNCING OPERATIONAL DATA...</div>
                        ) : allQueueItems.length === 0 ? (
                            <div className="stat-card-white" style={{ textAlign: 'center', padding: '5rem' }}>
                                <ClipboardList size={48} style={{ color: '#e2e8f0', marginBottom: '1rem' }} />
                                <p style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: 600 }}>No active tickets in this category</p>
                            </div>
                        ) : (
                            allQueueItems.map(item => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={item.id || item._id}
                                    className="stat-card-white"
                                    style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}
                                >
                                    <div style={{ 
                                        width: '50px', height: '50px', borderRadius: '14px', 
                                        background: item.status === 'Resolved' ? '#dcfce7' : '#f8fafc',
                                        color: item.status === 'Resolved' ? '#10b981' : '#64748b',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {item.status === 'Resolved' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.4rem' }}>
                                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 850, color: '#0f172a' }}>{item.title}</h3>
                                            <CategoryBadge category={item.category} />
                                            <PriorityBadge priority={item.priority} />
                                        </div>
                                        <div style={{ display: 'flex', gap: '1.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <MapPin size={14} /> {item.location}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Clock size={14} /> Reported {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                                        {item.category === 'Sanitation' ? (
                                            <button 
                                                onClick={() => handleResolveSanitation(item.id)}
                                                style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', background: '#10b981', color: 'white', border: 'none', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                                            >
                                                Complete Sanitation
                                            </button>
                                        ) : (
                                            <>
                                                {item.status === 'Pending' && (
                                                    <button 
                                                        onClick={() => handleUpdateStatus(item._id, 'In Progress')}
                                                        style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', background: '#0ea5e9', color: 'white', border: 'none', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                                                    >
                                                        Accept Job
                                                    </button>
                                                )}
                                                {item.status === 'In Progress' && (
                                                    <button 
                                                        onClick={() => handleUpdateStatus(item._id, 'Resolved')}
                                                        style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', background: '#10b981', color: 'white', border: 'none', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                                                    >
                                                        Mark Resolved
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* New Ticket Modal */}
            <AnimatePresence>
                {showNewTicket && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowNewTicket(false)} 
                            style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)' }} 
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="stat-card-white" 
                            style={{ width: '100%', maxWidth: '600px', padding: '3rem', position: 'relative', zIndex: 1001 }}
                        >
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 950, color: '#0f172a', marginBottom: '2rem' }}>Log Operational Ticket</h2>
                            <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>TASK TITLE</label>
                                        <input 
                                            required placeholder="e.g., Leak in Sector 4 plumbing"
                                            value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
                                            style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>CATEGORY</label>
                                        <select 
                                            value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}
                                            style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontWeight: 600 }}
                                        >
                                            <option>Technical</option>
                                            <option>Biomed</option>
                                            <option>Portering</option>
                                            <option>IT</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>LOCATION</label>
                                        <input 
                                            required placeholder="e.g., ICU-Room 302"
                                            value={form.location} onChange={(e) => setForm({...form, location: e.target.value})}
                                            style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>PRIORITY</label>
                                        <select 
                                            value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value})}
                                            style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontWeight: 600 }}
                                        >
                                            <option>High</option>
                                            <option>Medium</option>
                                            <option>Low</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>SCOPE OF WORK</label>
                                    <textarea 
                                        placeholder="Detailed description of the issue..."
                                        value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
                                        style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', minHeight: '100px', resize: 'none' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="submit" className="btn-vitalize" style={{ flex: 1, padding: '1rem' }}>Authorize Ticket</button>
                                    <button type="button" onClick={() => setShowNewTicket(false)} style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: '#f1f5f9', border: 'none', color: '#64748b', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default MaintenanceTickets;
