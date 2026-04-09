import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, Plus, Search, Filter, AlertTriangle,
    Trash2, Edit3, Save, X, Database, TrendingUp,
    Calendar, Hash, DollarSign, Shield, Info, Activity
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

const PharmacistInventory = () => {
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
        id: '', name: '', stock: 0, expiry_date: '', price: 0, batch: '', manufacturer: ''
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const res = await api.get('/pharmacy/inventory');
            const data = Array.isArray(res.data) ? res.data : [];
            setInventory(data);

            // Calculate Stats
            const low = data.filter(i => i.stock < 20).length;
            const expiring = data.filter(i => {
                if (!i.expiry_date) return false;
                const exp = new Date(i.expiry_date);
                const soon = new Date();
                soon.setMonth(soon.getMonth() + 3); // 3 months warning
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
            await api.post('/pharmacy/inventory', formData);
            fetchInventory();
            setShowAddModal(false);
            setFormData({ id: '', name: '', stock: 0, expiry_date: '', price: 0, batch: '', manufacturer: '' });
        } catch (err) { alert("Authorization Error: SKU Collision"); }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/pharmacy/inventory/${editingItem.id}`, formData);
            fetchInventory();
            setEditingItem(null);
        } catch (err) { alert("Sync Error: Modification Rejected"); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("CRITICAL: Permanent Stock Deletion. Authorize?")) return;
        try {
            await api.delete(`/pharmacy/inventory/${id}`);
            fetchInventory();
        } catch (err) { alert("Deletion Authority Denied"); }
    };

    const filtered = (Array.isArray(inventory) ? inventory : []).filter(i =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="pharmacist">
            <SectionHeader
                title="Pharmaceutical Strategic Reserve"
                subtitle="Advanced stocks management and inventory compliance terminal"
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem', marginBottom: '3rem' }}>
                <StatCard
                    icon={<Database />}
                    label="Total Inventory SKUs"
                    value={stats.total}
                    trend="Synchronized"
                    color="#0ea5e9"
                    subtext="Unique clinical entities registered"
                />
                <StatCard
                    icon={<AlertTriangle />}
                    label="Low Stock Alerts"
                    value={stats.lowStock}
                    trend={stats.lowStock > 0 ? "Critical" : "Secure"}
                    color={stats.lowStock > 0 ? "#ef4444" : "#10b981"}
                    subtext="SKUs falling below safety threshold"
                />
                <StatCard
                    icon={<Activity />}
                    label="Expiring (3 Months)"
                    value={stats.expiringCount}
                    trend="Monitoring"
                    color="#f59e0b"
                    subtext="Items requiring lifecycle audit"
                />
            </div>

            <div className="glass-v3" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div className="search-container" style={{ width: '450px' }}>
                        <Search size={20} className="search-icon" />
                        <input
                            className="search-input"
                            placeholder="Enter SKU or Medication name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-vitalize"
                        style={{ width: 'auto', padding: '1rem 2.5rem', display: 'flex', gap: '0.8rem', alignItems: 'center' }}
                    >
                        <Plus size={20} /> REGISTER NEW SKU
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 1rem' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: '#64748b', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>
                                <th style={{ padding: '0 2rem' }}>Clinical Identifier</th>
                                <th style={{ padding: '0 2rem' }}>Logistics Status</th>
                                <th style={{ padding: '0 2rem' }}>Financial & Batch</th>
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
                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, marginTop: '0.3rem' }}>SKU ID: {item.id}</div>
                                    </td>
                                    <td style={{ padding: '2rem' }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.6rem',
                                            color: item.stock < 20 ? '#ef4444' : item.stock < 50 ? '#f59e0b' : '#0ea5e9',
                                            fontWeight: 900
                                        }}>
                                            <Database size={16} /> {item.stock} UNITS
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <Calendar size={12} /> EXP: {item.expiry_date}
                                        </div>
                                    </td>
                                    <td style={{ padding: '2rem' }}>
                                        <div style={{ fontWeight: 800, color: '#10b981' }}>${(item.price || 0).toFixed(2)} / UNIT</div>
                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, marginTop: '0.4rem' }}>
                                            BATCH: {item.batch || 'DEFAULT'} • MFR: {item.manufacturer || 'GENERIC'}
                                        </div>
                                    </td>
                                    <td style={{ padding: '2rem' }}>
                                        <span style={{
                                            padding: '0.6rem 1.2rem',
                                            borderRadius: '12px',
                                            fontSize: '0.7rem',
                                            fontWeight: 900,
                                            background: item.stock < 20 ? 'rgba(239, 68, 68, 0.1)' : item.stock < 50 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                            color: item.stock < 20 ? '#ef4444' : item.stock < 50 ? '#f59e0b' : '#10b981',
                                            border: `1px solid ${item.stock < 20 ? 'rgba(239, 68, 68, 0.2)' : item.stock < 50 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <Shield size={12} />
                                            {item.stock < 20 ? 'CRITICAL DEPLETION' : item.stock < 50 ? 'REORDER WARNING' : 'STOCK SECURE'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '2rem' }}>
                                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                                            <button
                                                onClick={() => { setEditingItem(item); setFormData(item); }}
                                                whileHover={{ scale: 1.1 }}
                                                as={motion.button}
                                                style={{ padding: '0.6rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#64748b', cursor: 'pointer' }}
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                whileHover={{ scale: 1.1 }}
                                                as={motion.button}
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

            {/* Add/Edit Modal */}
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
                            style={{ width: '100%', maxWidth: '650px', padding: '4rem', zIndex: 1001, background: 'white', borderRadius: '32px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>
                                        {editingItem ? 'SKU MODIFICATION' : 'SKU REGISTRATION'}
                                    </h2>
                                    <p style={{ color: '#64748b', fontWeight: 600, marginTop: '0.5rem' }}>Authorize clinical inventory synchronization</p>
                                </div>
                                <div style={{ padding: '1rem', borderRadius: '18px', background: '#f1f5f9', color: '#64748b' }}>
                                    <Database size={24} />
                                </div>
                            </div>

                            <form onSubmit={editingItem ? handleUpdate : handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Medication Nomenclature</label>
                                    <input
                                        required
                                        placeholder="e.g., Amoxicillin 500mg"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 700, marginTop: '0.8rem', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Clinical SKU ID</label>
                                    <input
                                        required
                                        disabled={!!editingItem}
                                        placeholder="SKU-XXXXX"
                                        value={formData.id}
                                        onChange={e => setFormData({ ...formData, id: e.target.value })}
                                        style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: editingItem ? '#f1f5f9' : '#f8fafc', fontWeight: 700, marginTop: '0.8rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Expiration Lifecycle</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.expiry_date}
                                        onChange={e => setFormData({ ...formData, expiry_date: e.target.value })}
                                        style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 700, marginTop: '0.8rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Unit Volume Count</label>
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
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Unit Valuation ($)</label>
                                    <div style={{ position: 'relative' }}>
                                        <DollarSign size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#10b981' }} />
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                            style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 700, marginTop: '0.8rem' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Manufacturer & Batch</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '0.8rem' }}>
                                        <input
                                            placeholder="Batch ID"
                                            value={formData.batch}
                                            onChange={e => setFormData({ ...formData, batch: e.target.value })}
                                            style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 700 }}
                                        />
                                        <input
                                            placeholder="Manufacturer"
                                            value={formData.manufacturer}
                                            onChange={e => setFormData({ ...formData, manufacturer: e.target.value })}
                                            style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 700 }}
                                        />
                                    </div>
                                </div>

                                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => { setShowAddModal(false); setEditingItem(null); }}
                                        style={{ flex: 1, padding: '1.2rem', borderRadius: '16px', background: '#f1f5f9', border: 'none', color: '#64748b', fontWeight: 800, cursor: 'pointer' }}
                                    >
                                        TERMINATE
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-vitalize"
                                        style={{ flex: 1, padding: '1.2rem', borderRadius: '16px', fontSize: '1rem' }}
                                    >
                                        <Shield size={20} /> AUTHORIZE SYNC
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

export default PharmacistInventory;
