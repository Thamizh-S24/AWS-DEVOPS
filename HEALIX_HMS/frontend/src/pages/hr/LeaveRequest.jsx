import React, { useState } from 'react';
import { Calendar, FileText, Send, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from '../admin/SectionHeader';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const LeaveRequest = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        start_date: '',
        end_date: '',
        reason: ''
    });
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/hr/leaves/request', {
                staff_id: user.username,
                ...formData,
                status: 'Pending'
            });
            setStatus('Application submitted for clinical review');
            setFormData({ start_date: '', end_date: '', reason: '' });
            setTimeout(() => setStatus(''), 5000);
        } catch (err) {
            alert("Submission to HR Service failed");
        }
    };

    return (
        <DashboardLayout role={user?.role}>
            <SectionHeader
                title="Leave Management Terminal"
                subtitle="Submit and track digital leave applications for clinical approval"
            />

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="stat-card-white" style={{ padding: '3rem' }}>
                    {status ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#dcfce7', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                <CheckCircle size={40} />
                            </div>
                            <h2 style={{ fontWeight: 900, color: '#0f172a' }}>Request Received</h2>
                            <p style={{ color: '#64748b', fontSize: '1rem' }}>{status}</p>
                            <button className="btn-vitalize" onClick={() => setStatus('')} style={{ width: 'auto', padding: '0.8rem 2rem', marginTop: '2rem' }}>NEW REQUEST</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar size={14} /> COMMENCEMENT DATE
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.start_date}
                                        onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                                        style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 700 }}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar size={14} /> CONCLUSION DATE
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.end_date}
                                        onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                                        style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 700 }}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FileText size={14} /> CLINICAL RATIONALE
                                </label>
                                <textarea
                                    placeholder="Provide detailed justification for leave request..."
                                    value={formData.reason}
                                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                    style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, minHeight: '150px', resize: 'vertical' }}
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn-vitalize" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem' }}>
                                    <Send size={18} /> SUBMIT FOR REVIEW
                                </button>
                                <button type="button" className="btn-vitalize" style={{ background: '#f1f5f9', color: '#475569', border: 'none', width: 'auto', padding: '0 2rem' }}>CANCEL</button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="stat-card-white" style={{ background: '#f1f5f9', border: 'none', marginTop: '3rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '1.5rem' }}>Clinical Policy Notice</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6' }}>
                        Leave requests are subject to clinical workload assessment. Ensure all handover protocols are documented prior to commencement. Emergency leave bypasses standard review through Chief Medical Officer oversight.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default LeaveRequest;
