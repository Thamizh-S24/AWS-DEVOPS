import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Search, FileText, AlertCircle, Loader2 } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

const LabReportPortal = () => {
    const [processingTests, setProcessingTests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState('');
    const [observation, setObservation] = useState('');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchProcessing();
    }, []);

    const fetchProcessing = async () => {
        try {
            const res = await api.get('/lab/requests');
            setProcessingTests((res.data || []).filter(t => t?.status === 'Processing'));
            setLoading(false);
        } catch (err) {
            console.error("Portal sync error");
            setLoading(false);
        }
    };

    const handleRelease = async (e) => {
        e.preventDefault();
        if (!selectedRequest) return;

        try {
            setSubmitting(true);
            await api.patch(`/lab/requests/${selectedRequest}/report`, {
                report: observation
            });
            setMsg('Diagnostic report authorized for release');
            setObservation('');
            setSelectedRequest('');
            fetchProcessing();
            setSubmitting(false);
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            setMsg('Release authorization failed');
            setSubmitting(false);
        }
    };

    const selectedTestData = processingTests.find(t => t._id === selectedRequest);

    return (
        <DashboardLayout role="lab_tech">
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '3rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>Result Authorization</h2>
                        <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.4rem', fontWeight: 500 }}>Authorize diagnostic release to clinic</p>
                    </div>

                    <div className="glass-v3" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '1.5rem', color: '#1e293b' }}>Active Case Selection</h3>
                        {loading ? (
                            <Loader2 size={24} className="animate-spin" color="#0ea5e9" />
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {processingTests.map(test => (
                                    <motion.div
                                        key={test._id}
                                        onClick={() => setSelectedRequest(test._id)}
                                        whileHover={{ x: 4 }}
                                        style={{
                                            padding: '1.2rem',
                                            borderRadius: '16px',
                                            background: selectedRequest === test._id ? '#f0f9ff' : '#f8fafc',
                                            border: selectedRequest === test._id ? '2px solid #0ea5e9' : '1px solid #e2e8f0',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{test.test_type}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8' }}>ID: {test.patient_id}</span>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: test.priority === 'Urgent' ? '#ef4444' : '#64748b' }}>{test.priority.toUpperCase()}</span>
                                        </div>
                                    </motion.div>
                                ))}
                                {processingTests.length === 0 && (
                                    <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>No reports pending authorization.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="glass-v3" style={{ padding: '3rem', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
                    {!selectedRequest ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#94a3b8', gap: '1.5rem' }}>
                            <FileText size={64} style={{ opacity: 0.2 }} />
                            <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>Select a case to begin reporting</p>
                        </div>
                    ) : (
                        <form onSubmit={handleRelease} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '1.5rem', borderBottom: '1px ridge #f1f5f9' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 950 }}>{selectedTestData.test_type}</h3>
                                    <p style={{ margin: '0.4rem 0 0 0', fontWeight: 700, color: '#0ea5e9', fontSize: '0.8rem' }}>PATIENT REF: {selectedTestData.patient_id}</p>
                                </div>
                                <div style={{ background: '#fef2f2', color: '#ef4444', padding: '0.6rem 1rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 900 }}>
                                    INTERNAL CODE: {selectedTestData._id.slice(-6).toUpperCase()}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <AlertCircle size={14} /> Pathological Observations & Findings
                                </label>
                                <textarea
                                    required
                                    value={observation}
                                    onChange={e => setObservation(e.target.value)}
                                    placeholder="Enter quantitative markers, qualitative observations, and clinical interpretations..."
                                    style={{
                                        width: '100%',
                                        minHeight: '300px',
                                        padding: '1.5rem',
                                        borderRadius: '20px',
                                        border: '1px solid #e2e8f0',
                                        background: '#f8fafc',
                                        fontSize: '0.95rem',
                                        lineHeight: 1.6,
                                        fontWeight: 600,
                                        outline: 'none',
                                        resize: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ marginTop: 'auto' }}>
                                <button
                                    type="submit"
                                    className="btn-vitalize"
                                    disabled={submitting}
                                    style={{ width: '100%', padding: '1.2rem', gap: '1rem' }}
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <Shield size={20} />}
                                    AUTHORIZE CLINICAL RELEASE
                                </button>
                                {msg && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{ textAlign: 'center', color: msg.includes('failed') ? '#ef4444' : '#10b981', fontWeight: 800, marginTop: '2rem' }}
                                    >
                                        {msg}
                                    </motion.p>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default LabReportPortal;
