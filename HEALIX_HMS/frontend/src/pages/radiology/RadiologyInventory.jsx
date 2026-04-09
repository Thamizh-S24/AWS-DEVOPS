import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Plus, Trash2, Edit3, Save, X, Loader2, Beaker, Zap, Shield, Camera } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

const RadiologyInventory = ({ searchTerm: globalSearch }) => {
    const [tab, setTab] = useState('inventory'); // 'inventory' or 'types'
    const [inventory, setInventory] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form States
    const [showAdd, setShowAdd] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', stock: 0, category: 'Contrast' });
    const [newType, setNewType] = useState({ name: '', price: 0, description: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [invRes, typeRes] = await Promise.all([
                api.get('/radiology/inventory'),
                api.get('/radiology/types')
            ]);
            setInventory(Array.isArray(invRes.data) ? invRes.data : []);
            setTypes(Array.isArray(typeRes.data) ? typeRes.data : []);
            setLoading(false);
        } catch (err) {
            console.error("Resource sync failure");
            setLoading(false);
        }
    };

    const handleAddInventory = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/radiology/inventory', newItem);
            setShowAdd(false);
            setNewItem({ name: '', stock: 0, category: 'Contrast' });
            fetchData();
        } catch (err) { alert("Addition Failed"); }
        setSubmitting(false);
    };

    const handleAddType = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/radiology/types', newType);
            setShowAdd(false);
            setNewType({ name: '', price: 0, description: '' });
            fetchData();
        } catch (err) { alert("Modality Addition Failed"); }
        setSubmitting(false);
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm("Confirm deletion of this resource?")) return;
        try {
            await api.delete(`/radiology/${type}/${id}`);
            fetchData();
        } catch (err) { alert("Deletion Refused"); }
    };

    return (
        <DashboardLayout role="radiologist">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>Resource & Modality Registry</h2>
                        <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.4rem', fontWeight: 500 }}>Manage radiology inventory and scan modality definitions</p>
                    </div>
                    <button
                        onClick={() => setShowAdd(true)}
                        className="btn-vitalize"
                        style={{ width: 'auto', padding: '0.8rem 1.5rem', background: '#3b82f6' }}
                    >
                        <Plus size={18} /> REGISTER {tab === 'inventory' ? 'SUPPLY' : 'MODALITY'}
                    </button>
                </div>

                {/* Registry Navigation */}
                <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                    <button
                        onClick={() => setTab('inventory')}
                        style={{
                            padding: '0.8rem 1.5rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: tab === 'inventory' ? '#eff6ff' : 'transparent',
                            color: tab === 'inventory' ? '#3b82f6' : '#64748b',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem'
                        }}
                    >
                        <Beaker size={18} /> CLINICAL SUPPLIES
                    </button>
                    <button
                        onClick={() => setTab('types')}
                        style={{
                            padding: '0.8rem 1.5rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: tab === 'types' ? '#eff6ff' : 'transparent',
                            color: tab === 'types' ? '#3b82f6' : '#64748b',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem'
                        }}
                    >
                        <Camera size={18} /> SCAN MODALITIES
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem' }}>
                        <Loader2 className="animate-spin" size={48} color="#3b82f6" />
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        <AnimatePresence>
                            {tab === 'inventory' ? (
                                (inventory || []).map(item => (
                                    <motion.div
                                        key={item._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="glass-v3"
                                        style={{ padding: '2rem', background: 'white', position: 'relative' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ padding: '0.6rem', borderRadius: '12px', background: '#f8fafc', color: '#3b82f6' }}>
                                                {item.category === 'Shielding' ? <Shield size={20} /> : <Beaker size={20} />}
                                            </div>
                                            <button
                                                onClick={() => handleDelete(item._id, 'inventory')}
                                                style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div style={{ marginTop: '1.5rem' }}>
                                            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>{item.name}</h4>
                                            <p style={{ margin: '0.2rem 0 1rem 0', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>{(item.category || 'N/A').toUpperCase()}</p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ fontSize: '1.8rem', fontWeight: 950, color: item.stock < 10 ? '#ef4444' : '#0f172a' }}>{item.stock}</div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748b', fontWeight: 800 }}>ON-HAND STOCK</p>
                                                    <p style={{ margin: 0, fontSize: '0.55rem', color: '#94a3b8', fontWeight: 700 }}>AUDIT: {item.last_audit ? new Date(item.last_audit).toLocaleDateString() : 'NEVER'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                (types || []).map(type => (
                                    <motion.div
                                        key={type._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="glass-v3"
                                        style={{ padding: '2.2rem', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', border: '1px solid #e2e8f0' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                                                <Camera size={20} />
                                            </div>
                                            <button
                                                onClick={() => handleDelete(type._id, 'types')}
                                                style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div style={{ marginTop: '1.5rem' }}>
                                            <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 950 }}>{type.name}</h4>
                                            <p style={{ margin: '0.5rem 0 1.5rem 0', fontSize: '0.8rem', color: '#64748b', fontWeight: 500, lineHeight: 1.5 }}>{type.description || 'No clinical description provided for this modality.'}</p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px ridge #f1f5f9' }}>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94a3b8' }}>SERVICE RATE</span>
                                                <span style={{ fontSize: '1.2rem', fontWeight: 1000, color: '#0ea5e9' }}>${Number(type.price || 0).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Add Dialog */}
                <AnimatePresence>
                    {showAdd && (
                        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-v3"
                                style={{ padding: '3rem', width: '500px', background: 'white' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                    <h3 style={{ margin: 0, fontWeight: 950 }}>Register New {tab === 'inventory' ? 'Supply' : 'Modality'}</h3>
                                    <button onClick={() => setShowAdd(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}><X size={24} /></button>
                                </div>

                                <form onSubmit={tab === 'inventory' ? handleAddInventory : handleAddType} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {tab === 'inventory' ? (
                                        <>
                                            <div className="input-diagnostic-wrapper">
                                                <input
                                                    className="search-input"
                                                    placeholder="Resource Name (e.g., Iodine Contrast)"
                                                    required
                                                    value={newItem.name}
                                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                                    style={{ width: '100%', paddingLeft: '1rem' }}
                                                />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <input
                                                    type="number"
                                                    className="search-input"
                                                    placeholder="Stock Level"
                                                    required
                                                    value={newItem.stock}
                                                    onChange={e => setNewItem({ ...newItem, stock: parseInt(e.target.value) })}
                                                    style={{ width: '100%', paddingLeft: '1rem' }}
                                                />
                                                <select
                                                    className="search-input"
                                                    value={newItem.category}
                                                    onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                                    style={{ width: '100%', paddingLeft: '1rem' }}
                                                >
                                                    <option value="Contrast">Contrast</option>
                                                    <option value="Shielding">Shielding</option>
                                                    <option value="Equipment">Equipment</option>
                                                </select>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                className="search-input"
                                                placeholder="Modality Name (e.g., CT Cardiac)"
                                                required
                                                value={newType.name}
                                                onChange={e => setNewType({ ...newType, name: e.target.value })}
                                                style={{ width: '100%', paddingLeft: '1rem' }}
                                            />
                                            <input
                                                type="number"
                                                className="search-input"
                                                placeholder="Procedure Rate ($)"
                                                required
                                                value={newType.price}
                                                onChange={e => setNewType({ ...newType, price: parseFloat(e.target.value) })}
                                                style={{ width: '100%', paddingLeft: '1rem' }}
                                            />
                                            <textarea
                                                placeholder="Clinical Description..."
                                                value={newType.description}
                                                onChange={e => setNewType({ ...newType, description: e.target.value })}
                                                style={{ padding: '1rem', borderRadius: '15px', border: '1px solid #e2e8f0', minHeight: '100px', outline: 'none' }}
                                            />
                                        </>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="btn-vitalize"
                                        style={{ background: '#3b82f6', marginTop: '1rem' }}
                                    >
                                        {submitting ? <Loader2 className="animate-spin" /> : <Save size={18} />} AUTHORIZE REGISTRATION
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
};

export default RadiologyInventory;
