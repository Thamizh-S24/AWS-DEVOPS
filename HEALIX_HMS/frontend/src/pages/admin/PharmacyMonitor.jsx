import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Pill, AlertTriangle, TrendingUp, Filter, IndianRupee } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader, { StatCard } from './SectionHeader';
import api from '../../services/api';

const PharmacyMonitor = ({ searchTerm }) => {
    const [inventory, setInventory] = useState([]);
    const [totalValue, setTotalValue] = useState(0);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/pharmacy/inventory');
            setInventory(res.data);
            const total = res.data.reduce((acc, item) => acc + (item.price * item.stock), 0);
            setTotalValue(total);
        } catch (err) { console.error("Pharmacy inventory sync failed"); }
    };

    const filteredInventory = inventory.filter(item =>
        item.name?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
        item.id?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
    );

    return (
        <DashboardLayout role="admin">
            <SectionHeader title="Medicine Stock" subtitle="View hospital medicines and check stock levels" />

            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3.5rem' }}>
                <StatCard icon={<Package />} label="Total Medicines" value={inventory.length} trend="+4" color="#0ea5e9" subtext="Count of different items" />
                <StatCard icon={<AlertTriangle />} label="Low Stock Alerts" value={inventory.filter(i => i.stock < 20).length} trend="Low" color="#ef4444" subtext="Items that need ordering" />
                <StatCard icon={<IndianRupee />} label="Stock Value" value={`₹${(totalValue / 1000).toFixed(1)}K`} trend="+2.3%" color="#f59e0b" subtext="Current estimated value" />
            </div>

            <div className="stat-card-white" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0 }}>Medicine List</h3>
                    <button style={{ padding: '0.5rem 1rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Filter size={14} /> Filter List
                    </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: 'linear-gradient(to bottom, #f8fafc, white)', borderBottom: '1px solid rgba(14, 165, 233, 0.08)' }}>
                                <th style={{ padding: '1.2rem 2.5rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1px' }}>Medicine Name</th>
                                <th style={{ padding: '1.2rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1px' }}>Stock Level</th>
                                <th style={{ padding: '1.2rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1px' }}>Expiry Date</th>
                                <th style={{ padding: '1.2rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1px' }}>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInventory.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid rgba(14, 165, 233, 0.04)' }}>
                                    <td style={{ padding: '1.5rem 2.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                            <div style={{ padding: '0.7rem', borderRadius: '14px', background: 'rgba(14, 165, 233, 0.08)', border: '1px solid rgba(14, 165, 233, 0.1)' }}><Pill size={20} color="#0ea5e9" /></div>
                                            <div>
                                                <div style={{ fontWeight: 950, color: '#0f172a', fontSize: '1rem', letterSpacing: '-0.3px' }}>{item.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 800, marginTop: '0.2rem' }}>ID: {item.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                            <div style={{ flex: 1, height: '8px', background: '#f1f5f9', borderRadius: '4px', width: '100px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${Math.min(item.stock, 100)}%`, background: item.stock < 20 ? 'linear-gradient(90deg, #ef4444, #f87171)' : 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: '4px', boxShadow: `0 0 10px ${item.stock < 20 ? '#ef444450' : '#10b98150'}` }} />
                                            </div>
                                            <span style={{ fontWeight: 950, fontSize: '0.9rem', color: '#0f172a' }}>{item.stock}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #f1f5f9', width: 'fit-content' }}>
                                            <TrendingUp size={14} color="#64748b" />
                                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155' }}>{item.expiry_date}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <div style={{ fontWeight: 950, color: '#0f172a', fontSize: '1rem' }}>₹{item.price}</div>
                                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Per Unit</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PharmacyMonitor;

