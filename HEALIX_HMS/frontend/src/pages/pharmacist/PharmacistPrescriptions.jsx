import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClipboardList, ShoppingBag, Search, CheckCircle,
    Clock, User, Shield, Info, AlertCircle, Package,
    CheckSquare, AlertTriangle, Loader2
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

const PharmacistPrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPres, setSelectedPres] = useState(null);
    const [stock, setStock] = useState([]);
    const [msg, setMsg] = useState('');
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [presRes, stockRes] = await Promise.all([
                api.get('/doctor/prescriptions/all'),
                api.get('/pharmacy/inventory')
            ]);
            setPrescriptions(Array.isArray(presRes.data) ? presRes.data.filter(p => p.status === 'Pending') : []);
            setStock(Array.isArray(stockRes.data) ? stockRes.data : []);
            setLoading(false);
        } catch (err) {
            console.error("Clinical sync failure");
            setLoading(false);
        }
    };

    const checkStockAvailability = (medications) => {
        if (!Array.isArray(medications)) return { available: false, missing: [] };
        const missing = medications.filter(med => {
            const stockItem = stock.find(s => s.name === med.name || s.id === med.id);
            return !stockItem || stockItem.stock < 1;
        });
        return { available: missing.length === 0, missing };
    };

    const handleDispense = async (pres) => {
        if (!verified) {
            alert("Clinical Protocol: Please complete the medication review before authorization.");
            return;
        }

        const { available, missing } = checkStockAvailability(pres.medications);
        if (!available) {
            alert(`Stock Shortage: Insufficient units for ${missing.map(m => m.name).join(', ')}`);
            return;
        }

        try {
            setProcessing(true);
            for (const med of pres.medications) {
                const stockItem = stock.find(s => s.name === med.name || s.id === med.id);
                if (stockItem) {
                    await api.post('/pharmacy/dispense', null, {
                        params: {
                            medicine_id: stockItem.id,
                            quantity: 1,
                            patient_id: pres.patient_id,
                            prescription_id: pres._id
                        }
                    });

                    await api.post('/billing/invoice/create', {
                        patient_id: pres.patient_id,
                        items: [{
                            description: `Fulfillment: ${stockItem.name}`,
                            amount: stockItem.price,
                            category: 'Pharmacy'
                        }],
                        total_amount: stockItem.price,
                        status: 'Unpaid'
                    });
                }
            }

            await api.patch(`/doctor/prescriptions/${pres._id}/status`, null, { params: { status: 'Fulfilled' } });

            setMsg(`Protocol authorized for patient ${pres.patient_id}`);
            fetchData();
            setSelectedPres(null);
            setVerified(false);
            setProcessing(false);
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            setProcessing(false);
            alert("Authorization Refused: Check inventory levels or credentials");
        }
    };

    const filtered = (Array.isArray(prescriptions) ? prescriptions : []).filter(p =>
        (p?.patient_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p?._id || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="pharmacist">
            <SectionHeader
                title="Electronic Prescription Queue"
                subtitle="Authorized medical orders awaiting verification and clinical fulfillment"
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem', marginBottom: '3rem' }}>
                <StatCard
                    icon={<ClipboardList />}
                    label="Pending Fulfillments"
                    value={prescriptions.length}
                    trend="Queue Active"
                    color="#f59e0b"
                    subtext="Medical orders requiring review"
                />
                <StatCard
                    icon={<Shield />}
                    label="Safety Compliance"
                    value="Active"
                    trend="Secured"
                    color="#10b981"
                    subtext="Double-check protocols active"
                />
                <StatCard
                    icon={<Package />}
                    label="Dispense Velocity"
                    value="Stable"
                    trend="Optimal"
                    color="#0ea5e9"
                    subtext="System throughput monitoring"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '3rem' }}>
                <div className="glass-v3" style={{ padding: '2.5rem' }}>
                    <div className="search-container" style={{ marginBottom: '2.5rem' }}>
                        <Search size={20} className="search-icon" />
                        <input
                            className="search-input"
                            placeholder="Enter Case ID or Rx Reference..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <AnimatePresence>
                            {filtered.map((p) => (
                                <motion.div
                                    key={p._id}
                                    layout
                                    onClick={() => { setSelectedPres(p); setVerified(false); }}
                                    className="glass-v3"
                                    style={{
                                        padding: '1.8rem',
                                        background: selectedPres?._id === p._id ? 'rgba(14, 165, 233, 0.05)' : 'white',
                                        borderLeft: `5px solid ${selectedPres?._id === p._id ? '#0ea5e9' : '#f1f5f9'}`,
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                            <div style={{ padding: '0.8rem', borderRadius: '14px', background: '#f8fafc', color: '#64748b' }}>
                                                <ClipboardList size={22} />
                                            </div>
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 950, color: '#1e293b' }}>{p.patient_id}</h4>
                                                <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.3rem' }}>
                                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>REF: {p._id.toUpperCase()}</span>
                                                    <span style={{ fontSize: '0.7rem', color: '#0ea5e9', fontWeight: 800 }}>• DOCTOR: {p.doctor_id}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontSize: '0.7rem', fontWeight: 900 }}>
                                            <Clock size={12} /> PENDING
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {(Array.isArray(p.medications) ? p.medications : []).map((m, i) => (
                                            <span key={i} style={{ padding: '0.3rem 0.8rem', borderRadius: '8px', background: '#f1f5f9', color: '#64748b', fontSize: '0.7rem', fontWeight: 700 }}>
                                                {m.name}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {filtered.length === 0 && !loading && (
                            <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                                <CheckCircle size={48} opacity={0.2} style={{ display: 'block', margin: '0 auto 1.5rem' }} />
                                <h4 style={{ margin: 0, fontWeight: 950 }}>Queue Status: Synchronized</h4>
                                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>No pending prescriptions detected</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="sticky-sidebar">
                    <AnimatePresence mode="wait">
                        {selectedPres ? (
                            <motion.div
                                key={selectedPres._id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="glass-v3"
                                style={{ padding: '3rem', background: 'white', borderRadius: '32px' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                    <div style={{ padding: '1rem', borderRadius: '18px', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}>
                                        <User size={28} />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 950, color: '#0f172a' }}>Order Review</h3>
                                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>VERIFYING CASE: {selectedPres.patient_id}</p>
                                    </div>
                                </div>

                                <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '24px', marginBottom: '2.5rem', border: '1px solid #e2e8f0' }}>
                                    <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '0.85rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Package size={14} /> Clinical Item List
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        {(Array.isArray(selectedPres.medications) ? selectedPres.medications : []).map((m, i) => {
                                            const stockItem = stock.find(s => s.name === m.name || s.id === m.id);
                                            const isOut = !stockItem || stockItem.stock < 1;
                                            return (
                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <div>
                                                        <div style={{ fontWeight: 800, color: isOut ? '#ef4444' : '#1e293b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                            {m.name} {isOut && <AlertTriangle size={14} />}
                                                        </div>
                                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginTop: '0.2rem' }}>{m.instructions}</div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ color: '#0ea5e9', fontWeight: 900, fontSize: '0.9rem' }}>{m.dosage}</div>
                                                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: isOut ? '#ef4444' : '#10b981', marginTop: '0.2rem' }}>
                                                            {isOut ? 'OUT OF STOCK' : `SECURE: ${stockItem.stock}U`}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '2.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#64748b', fontSize: '0.85rem' }}>
                                        <Shield size={16} />
                                        <span>Authorized by <strong style={{ color: '#0f172a' }}>Dr. {selectedPres.doctor_id}</strong></span>
                                    </div>
                                    <div
                                        onClick={() => setVerified(!verified)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.8rem',
                                            color: verified ? '#10b981' : '#f59e0b',
                                            fontSize: '0.9rem',
                                            marginTop: '1.5rem',
                                            cursor: 'pointer',
                                            padding: '1rem',
                                            borderRadius: '16px',
                                            background: verified ? 'rgba(16, 185, 129, 0.05)' : 'rgba(245, 158, 11, 0.05)',
                                            border: `1px solid ${verified ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                                            fontWeight: 800
                                        }}
                                    >
                                        {verified ? <CheckSquare size={18} /> : <div style={{ width: 18, height: 18, border: '2px solid #f59e0b', borderRadius: '4px' }} />}
                                        Mark Medications as Reviewed
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDispense(selectedPres)}
                                    disabled={processing || !verified || !checkStockAvailability(selectedPres.medications).available}
                                    className="btn-vitalize"
                                    style={{
                                        padding: '1.2rem',
                                        fontSize: '1rem',
                                        opacity: (!verified || !checkStockAvailability(selectedPres.medications).available) ? 0.5 : 1,
                                        cursor: processing ? 'wait' : (verified ? 'pointer' : 'not-allowed')
                                    }}
                                >
                                    {processing ? (
                                        <><Loader2 size={20} className="animate-spin" /> DISPENSING...</>
                                    ) : (
                                        <><ShoppingBag size={20} /> AUTHORIZE FULFILLMENT</>
                                    )}
                                </button>
                                {msg && <p style={{ textAlign: 'center', color: '#10b981', fontWeight: 800, marginTop: '1.5rem' }}>{msg}</p>}
                            </motion.div>
                        ) : (
                            <div style={{ padding: '6rem 3rem', textAlign: 'center', color: '#94a3b8' }}>
                                <AlertCircle size={64} opacity={0.1} style={{ display: 'block', margin: '0 auto 2rem' }} />
                                <h3 style={{ margin: 0, fontWeight: 950 }}>Queue Active</h3>
                                <p style={{ marginTop: '0.5rem', fontSize: '1rem' }}>Select an order from the queue to start the verification protocol.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PharmacistPrescriptions;
