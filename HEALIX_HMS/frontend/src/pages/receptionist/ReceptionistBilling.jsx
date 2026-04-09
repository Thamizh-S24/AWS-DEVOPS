import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, CreditCard } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from '../admin/SectionHeader';
import api from '../../services/api';

const ReceptionistBilling = () => {
    const [invoices, setInvoices] = useState([]);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetchUnpaidInvoices();
        const intv = setInterval(fetchUnpaidInvoices, 15000);
        return () => clearInterval(intv);
    }, []);

    const fetchUnpaidInvoices = async () => {
        try {
            const res = await api.get('/billing/unpaid');
            setInvoices(res.data);
        } catch (err) { console.error("Error fetching unpaid invoices"); }
    };

    const handleSettle = async (invoiceId) => {
        try {
            await api.patch(`/billing/invoice/${invoiceId}/pay`);
            setMsg('Invoice officially settled & receipt generated');
            fetchUnpaidInvoices();
            setTimeout(() => setMsg(''), 4000);
        } catch (err) {
            setMsg('Settlement sequence failed');
        }
    };

    return (
        <DashboardLayout role="receptionist">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <SectionHeader title="Billing & Settlement Deck" subtitle="Process clinical payments and outstanding departmental invoices" />
                    <AnimatePresence>
                        {msg && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                style={{ padding: '0.8rem 1.5rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderRadius: '14px', fontWeight: 900, border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckCircle size={18} /> {msg}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="glass-v3" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'linear-gradient(to right, #f8fafc, #f1f5f9)' }}>
                            <tr>
                                <th style={{ padding: '1.5rem 2.5rem', fontSize: '0.75rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>Identity Log</th>
                                <th style={{ padding: '1.5rem 2.5rem', fontSize: '0.75rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>Charge Context</th>
                                <th style={{ padding: '1.5rem 2.5rem', fontSize: '0.75rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>Amount Due</th>
                                <th style={{ padding: '1.5rem 2.5rem', fontSize: '0.75rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>Clearance action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '5rem', textAlign: 'center', color: '#94a3b8' }}>
                                        <CheckCircle size={48} opacity={0.2} style={{ margin: '0 auto 1.5rem', display: 'block' }} />
                                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#64748b' }}>Clean ledger. All outstandings collected.</div>
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((inv, i) => (
                                    <motion.tr
                                        key={inv._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        whileHover={{ backgroundColor: 'rgba(248, 250, 252, 0.5)' }}
                                        style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}
                                    >
                                        <td style={{ padding: '1.5rem 2.5rem', fontWeight: 900, color: '#0f172a', fontSize: '1.1rem' }}>{inv.patient_id}</td>
                                        <td style={{ padding: '1.5rem 2.5rem', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                                            {inv.items.map((item, idx) => (
                                                <div key={idx} style={{ marginBottom: idx !== inv.items.length - 1 ? '0.4rem' : 0 }}>
                                                    • {item.description}
                                                </div>
                                            ))}
                                        </td>
                                        <td style={{ padding: '1.5rem 2.5rem' }}>
                                            <span style={{
                                                fontSize: '1.2rem',
                                                fontWeight: 950,
                                                color: '#10b981',
                                                background: 'rgba(16, 185, 129, 0.1)',
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '12px'
                                            }}>
                                                ${inv.total_amount.toFixed(2)}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.5rem 2.5rem' }}>
                                            <button
                                                onClick={() => handleSettle(inv._id)}
                                                className="btn-vitalize"
                                                style={{ padding: '0.8rem 1.5rem', width: 'auto', background: '#10b981', display: 'flex', gap: '0.5rem', alignItems: 'center', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}
                                            >
                                                <CreditCard size={16} /> AUTHORIZE SETTLEMENT
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </DashboardLayout>
    );
};

export default ReceptionistBilling;
