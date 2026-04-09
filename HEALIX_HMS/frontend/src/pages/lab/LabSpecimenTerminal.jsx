import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Loader2, PlayCircle, CheckCircle, Beaker } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

const LabSpecimenTerminal = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchQueue();
    }, []);

    const fetchQueue = async () => {
        try {
            const res = await api.get('/lab/requests');
            // Only show Pending or Processing specimens
            setTests((res.data || []).filter(t => t?.status !== 'Completed'));
            setLoading(false);
        } catch (err) {
            console.error("Terminal sync failure");
            setLoading(false);
        }
    };

    const handleProcess = async (id) => {
        try {
            setProcessingId(id);
            await api.patch(`/lab/requests/${id}/process`);
            fetchQueue();
            setProcessingId(null);
        } catch (err) {
            alert("Analysis Initiation Failed");
            setProcessingId(null);
        }
    };

    return (
        <DashboardLayout role="lab_tech">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>Specimen Analysis Terminal</h2>
                        <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.4rem', fontWeight: 500 }}>Initiate and monitor active laboratory analysis</p>
                    </div>
                    <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Beaker size={24} />
                        <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>ACTIVE ANALYSIS: {(tests || []).filter(t => t?.status === 'Processing').length}</span>
                    </div>
                </div>

                {loading ? (
                    <div className="glass-v3" style={{ padding: '5rem', textAlign: 'center' }}>
                        <Loader2 className="animate-spin" size={48} color="#8b5cf6" />
                        <p style={{ marginTop: '1.5rem', fontWeight: 800, color: '#1e293b' }}>BOOTING TERMINAL...</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                        {tests.map((test) => (
                            <motion.div
                                key={test._id}
                                layout
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="glass-v3"
                                style={{
                                    padding: '2rem',
                                    background: test.status === 'Processing' ? 'linear-gradient(135deg, #ffffff 0%, #f5f3ff 100%)' : 'white',
                                    border: test.status === 'Processing' ? '2px solid #ddd6fe' : '1px solid #e2e8f0',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {test.status === 'Processing' && (
                                    <div style={{ position: 'absolute', top: 0, right: 0, padding: '0.5rem 1rem', background: '#8b5cf6', color: 'white', fontSize: '0.6rem', fontWeight: 900, borderRadius: '0 0 0 12px' }}>
                                        ANALYZING
                                    </div>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ padding: '0.8rem', borderRadius: '14px', background: test.status === 'Processing' ? '#ddd6fe' : '#f1f5f9', color: test.status === 'Processing' ? '#7c3aed' : '#64748b' }}>
                                        <FlaskConical size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>{test.test_type}</h4>
                                        <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>CASE: {test._id.slice(-8).toUpperCase()}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                        <span style={{ color: '#64748b', fontWeight: 600 }}>Patient ID</span>
                                        <span style={{ fontWeight: 800 }}>{test.patient_id}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                        <span style={{ color: '#64748b', fontWeight: 600 }}>Priority</span>
                                        <span style={{ fontWeight: 800, color: test.priority === 'Urgent' ? '#ef4444' : '#0f172a' }}>{test.priority}</span>
                                    </div>
                                    {test.instructions && (
                                        <div style={{ padding: '0.8rem', background: '#f8fafc', borderRadius: '12px', fontSize: '0.75rem', color: '#475569', fontWeight: 500, fontStyle: 'italic' }}>
                                            "{test.instructions}"
                                        </div>
                                    )}
                                </div>

                                {test.status === 'Pending' ? (
                                    <button
                                        onClick={() => handleProcess(test._id)}
                                        className="btn-vitalize"
                                        style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}
                                    >
                                        {processingId === test._id ? <Loader2 className="animate-spin" size={18} /> : <PlayCircle size={18} />}
                                        INITIATE ANALYSIS
                                    </button>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f5f3ff', borderRadius: '16px', color: '#8b5cf6' }}>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span style={{ fontWeight: 900, fontSize: '0.8rem' }}>PROCESSING SPECIMEN...</span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                        {tests.length === 0 && (
                            <div className="glass-v3" style={{ gridColumn: '1/-1', padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                                <CheckCircle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                <p style={{ fontWeight: 700 }}>Terminal Clear. No specimens awaiting analysis.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default LabSpecimenTerminal;
