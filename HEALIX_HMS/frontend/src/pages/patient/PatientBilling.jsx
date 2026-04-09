import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Shield } from 'lucide-react';
import PatientLayout from '../../components/PatientLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PatientSectionHeader = ({ title, subtitle }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 950, color: '#1e3a8a', margin: 0, letterSpacing: '-1px' }}>{title}</h2>
            <div style={{ height: '5px', width: '80px', background: 'linear-gradient(90deg, #1e40af, #3b82f6)', borderRadius: '2px', margin: '0.8rem 0' }} />
            <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.4rem', fontWeight: 500 }}>{subtitle}</p>
        </div>
    </div>
);

const PatientBilling = () => {
    const { user } = useAuth();
    const [billing, setBilling] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchBilling();
        }
    }, [user]);

    const fetchBilling = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/billing/patient/${user.username}`);
            setBilling(res.data);
        } catch (err) {
            console.error("Error fetching billing records");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PatientLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                <section>
                    <PatientSectionHeader
                        title="Financial Ledger"
                        subtitle="Consolidated medical expenditure and settlement lifecycle"
                    />
                    <div className="stat-card-white" style={{ padding: 0, overflow: 'hidden' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '6rem 3rem', color: '#94a3b8', fontWeight: 700 }}>RETRIEVING INVOICES...</div>
                        ) : billing.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '6rem 3rem' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                    <Shield size={40} color="#10b981" style={{ opacity: 0.4 }} />
                                </div>
                                <h4 style={{ fontWeight: 950, color: '#0f172a', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Clear Financial Status</h4>
                                <p style={{ color: '#64748b', fontWeight: 500 }}>No outstanding invoices or historical settlement data detected.</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ background: 'linear-gradient(to bottom, #f8fafc, white)', borderBottom: '1px solid rgba(16, 185, 129, 0.08)' }}>
                                            <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 950, letterSpacing: '1px' }}>Service Description</th>
                                            <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 950, letterSpacing: '1px' }}>Clinical Category</th>
                                            <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 950, letterSpacing: '1px' }}>Valuation</th>
                                            <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 950, letterSpacing: '1px' }}>Settlement</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {billing.map((bill, i) => (
                                            <tr key={bill._id || i} style={{ borderBottom: '1px solid rgba(16, 185, 129, 0.04)' }}>
                                                <td style={{ padding: '1.8rem 2rem' }}>
                                                    {bill.items.map((it, j) => <div key={j} style={{ fontWeight: 950, color: '#0f172a', fontSize: '1rem', letterSpacing: '-0.3px' }}>{it.description}</div>)}
                                                </td>
                                                <td style={{ padding: '1.8rem 2rem' }}>
                                                    <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                        {bill.items[0]?.category || 'General'}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1.8rem 2rem' }}>
                                                    <div style={{ fontSize: '1.1rem', fontWeight: 950, color: '#0f172a' }}>
                                                        <IndianRupee size={16} />{bill.total_amount?.toLocaleString() || 0}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1.8rem 2rem' }}>
                                                    <div style={{
                                                        padding: '0.6rem 1.2rem',
                                                        borderRadius: '12px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 950,
                                                        width: 'fit-content',
                                                        background: bill.status === 'Paid' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                                                        color: bill.status === 'Paid' ? '#10b981' : '#f59e0b',
                                                        border: bill.status === 'Paid' ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid rgba(245, 158, 11, 0.15)'
                                                    }}>
                                                        {bill.status ? bill.status.toUpperCase() : 'PENDING'}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </PatientLayout>
    );
};

export default PatientBilling;
