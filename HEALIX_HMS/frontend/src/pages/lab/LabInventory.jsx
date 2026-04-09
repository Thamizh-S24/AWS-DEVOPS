import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FlaskConical, Plus, Search, Filter, AlertTriangle,
    Trash2, Edit3, Save, X, Database, TrendingUp,
    Calendar, Hash, DollarSign, Shield, Info, Activity,
    Beaker
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

const StatCard = ({ icon, label, value, trend, color, subtext }) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="glass-v3"
        style={{
            padding: '2rem',
            background: 'white',
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.8rem', borderRadius: '16px', background: `${color}10`, color: color }}>
                {icon}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', background: '#dcfce7', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                {trend || 'Active'}
            </div>
        </div>
        <div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '0.4rem' }}>{label}</p>
            <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{value}</h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>{subtext}</p>
        </div>
    </motion.div>
);

const SectionHeader = ({ title, subtitle, action }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>{title}</h2>
            <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.4rem', fontWeight: 500 }}>{subtitle}</p>
        </div>
        {action}
    </div>
);

const LabInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        lowStock: 0,
        expiringCount: 0
    });
    const [formData, setFormData] = useState({
        id: '', name: '', stock: 0, expiry_date: '', price: 0
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const res = await api.get('/lab/inventory');
            const data = Array.isArray(res.data) ? res.data : [];
            setInventory(data);

            const low = data.filter(i => i.stock < 10).length; // Lower threshold for lab reagents
            const expiring = data.filter(i => {
                if (!i.expiry_date) return false;
                const exp = new Date(i.expiry_date);
                const soon = new Date();
                soon.setMonth(soon.getMonth() + 2); // 2 months warning
                return exp < soon;
            }).length;

            setStats({
                total: data.length,
                lowStock: low,
                expiringCount: expiring
            });
            setLoading(false);
        } catch (err) {
            console.error("Failed to sync clinical database");
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/lab/inventory', formData);
            fetchInventory();
            setShowAddModal(false);
            setFormData({ id: '', name: '', stock: 0, expiry_date: '', price: 0 });
        } catch (err) { alert("Authorization Error: Resource Collision"); }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/lab/inventory/${editingItem.id}`, formData);
            fetchInventory();
            setEditingItem(null);
        } catch (err) { alert("Sync Error: Modification Rejection"); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("CRITICAL: Permanent Resource Deletion. Authorize?")) return;
        try {
            await api.delete(`/lab/inventory/${id}`);
            fetchInventory();
        } catch (err) { alert("Deletion Authority Denied"); }
    };

    const filtered = (Array.isArray(inventory) ? inventory : []).filter(i =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="lab_tech">
            <SectionHeader
                title="Pathology Strategic Reserve"
                subtitle="Reagent analytics and diagnostic resource tracking"
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem', marginBottom: '3rem' }}>
                <StatCard
                    icon={<FlaskConical />}
                    label="Active Reagents"
                    value={stats.total}
                    trend="Synchronized"
                    color="#8b5cf6"
                    subtext="Diagnostic entities tracked"
                />
                <StatCard
                    icon={<AlertTriangle />}
                    label="Supply Shortage"
                    value={stats.lowStock}
                    trend={stats.lowStock > 0 ? "Urgent" : "Stable"}
                    color={stats.lowStock > 0 ? "#ef4444" : "#10b981"}
                    subtext="Items below safety threshold"
                />
                <StatCard
                    icon={<Activity />}
                    label="Expiry Monitoring"
                    value={stats.expiringCount}
                    trend="Verified"
                    color="#f59e0b"
                    subtext="Critical lifecycle audit"
                />
            </div>

            <div className="glass-v3" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div className="search-container" style={{ width: '450px' }}>
                        <Search size={20} className="search-icon" />
                        <input
                            className="search-input"
                            placeholder="Enter Reagent ID or Nomenclature..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-vitalize"
                        style={{ width: 'auto', padding: '1rem 2.5rem', display: 'flex', gap: '0.8rem', alignItems: 'center' }}
                    >
                        <Plus size={20} /> REGISTER RESOURCE
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 1rem' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: '#64748b', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>
                                <th style={{ padding: '0 2rem' }}>Clinical Identifier</th>
                                <th style={{ padding: '0 2rem' }}>Resource Status</th>
                                <th style={{ padding: '0 2rem' }}>Safety Compliance</th>
                                <th style={{ padding: '0 2rem' }}>Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((item) => (
                                <motion.tr
                                    key={item.id}
                                    layout
                                    style={{ background: 'white', borderRadius: '18px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}
                                >
                                    <td style={{ padding: '2rem' }}>
                                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, marginTop: '0.3rem' }}>REF: {item.id}</div>
                                    </td>
                                    <td style={{ padding: '2rem' }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.6rem',
                                            color: item.stock < 10 ? '#ef4444' : '#8b5cf6',
                                            fontWeight: 900
                                        }}>
                                            <Beaker size={16} /> {item.stock} UNITS
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <Calendar size={12} /> EXP: {item.expiry_date}
                                        </div>
                                    </td>
                                    <td style={{ padding: '2rem' }}>
                                        <span style={{
                                            padding: '0.6rem 1.2rem',
                                            borderRadius: '12px',
                                            fontSize: '0.7rem',
                                            fontWeight: 900,
                                            background: item.stock < 10 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                            color: item.stock < 10 ? '#ef4444' : '#10b981',
                                            border: `1px solid ${item.stock < 10 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <Shield size={12} />
                                            {item.stock < 10 ? 'CRITICAL DEPLETION' : 'RESERVE SECURE'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '2rem' }}>
                                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                                            <button
                                                onClick={() => { setEditingItem(item); setFormData(item); }}
                                                style={{ padding: '0.6rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#64748b', cursor: 'pointer' }}
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                style={{ padding: '0.6rem', background: '#f8fafc', border: '1px solid #fee2e2', borderRadius: '10px', color: '#ef4444', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {(showAddModal || editingItem) && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { setShowAddModal(false); setEditingItem(null); }}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(10px)' }}
                        />
                        <motion.div
                            className="glass-v3"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            style={{ width: '100%', maxWidth: '600px', padding: '4rem', zIndex: 1001, background: 'white', borderRadius: '32px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>
                                        {editingItem ? 'RESOURCE UPDATE' : 'NEW RESOURCE'}
                                    </h2>
                                    <p style={{ color: '#64748b', fontWeight: 600, marginTop: '0.5rem' }}>Authorize clinical asset synchronization</p>
                                </div>
                                <div style={{ padding: '1rem', borderRadius: '18px', background: '#f1f5f9', color: '#8b5cf6' }}>
                                    <FlaskConical size={24} />
                                </div>
                            </div>

                            <form onSubmit={editingItem ? handleUpdate : handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Reagent Nomenclature</label>
                                    <input
                                        required
                                        placeholder="e.g., Sodium Citrate 3.2%"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 700, marginTop: '0.8rem', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Unique ID</label>
                                    <input
                                        required
                                        disabled={!!editingItem}
                                        placeholder="RGT-XXXXX"
                                        value={formData.id}
                                        onChange={e => setFormData({ ...formData, id: e.target.value })}
                                        style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: editingItem ? '#f1f5f9' : '#f8fafc', fontWeight: 700, marginTop: '0.8rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Expiry Threshold</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.expiry_date}
                                        onChange={e => setFormData({ ...formData, expiry_date: e.target.value })}
                                        style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 700, marginTop: '0.8rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Volume Count</label>
                                    <div style={{ position: 'relative' }}>
                                        <Hash size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        <input
                                            type="number"
                                            required
                                            value={formData.stock}
                                            onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                            style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 700, marginTop: '0.8rem' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Cost Per Unit</label>
                                    <div style={{ position: 'relative' }}>
                                        <DollarSign size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#10b981' }} />
                                        <input
                                            type="number"
                                            required
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                            style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 700, marginTop: '0.8rem' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => { setShowAddModal(false); setEditingItem(null); }}
                                        style={{ flex: 1, padding: '1.2rem', borderRadius: '16px', background: '#f1f5f9', border: 'none', color: '#64748b', fontWeight: 800, cursor: 'pointer' }}
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-vitalize"
                                        style={{ flex: 1, padding: '1.2rem', borderRadius: '16px', fontSize: '1rem' }}
                                    >
                                        <Shield size={20} /> AUTHORIZE RESOURCE
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default LabInventory;
