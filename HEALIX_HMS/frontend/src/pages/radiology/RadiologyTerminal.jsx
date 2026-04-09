import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Loader2, PlayCircle, CheckCircle, Monitor, Zap, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

const RadiologyTerminal = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeScan, setActiveScan] = useState(null);
    const [scanProgress, setScanProgress] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchScheduled();
    }, []);

    const fetchScheduled = async () => {
        try {
            const res = await api.get('/radiology/requests');
            setRequests((res.data || []).filter(r => r?.status === 'Scheduled'));
            setLoading(false);
        } catch (err) {
            console.error("Terminal sync failure");
            setLoading(false);
        }
    };

    const handleStartScan = (id) => {
        setActiveScan(id);
        setScanProgress(0);

        // Simulating the imaging acquisition process
        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 10;
            });
        }, 800);
    };

    return (
        <DashboardLayout role="radiologist">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 1.5fr', gap: '2.5rem' }}>

                {/* Modality Worklist Sidebar */}
                <div className="glass-v3" style={{ padding: '2rem', height: 'fit-content' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '0.8rem', borderRadius: '12px', background: '#dbeafe', color: '#3b82f6' }}>
                            <Monitor size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 950 }}>Modality Worklist</h3>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Awaiting Image Acquisition</p>
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <Loader2 className="animate-spin" size={32} color="#3b82f6" />
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {requests.map(req => (
                                <motion.div
                                    key={req._id}
                                    onClick={() => !activeScan && handleStartScan(req._id)}
                                    whileHover={!activeScan ? { scale: 1.02, x: 5 } : {}}
                                    style={{
                                        padding: '1.5rem',
                                        borderRadius: '16px',
                                        background: activeScan === req._id ? 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)' : '#f8fafc',
                                        border: activeScan === req._id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                        cursor: activeScan ? 'not-allowed' : 'pointer',
                                        opacity: activeScan && activeScan !== req._id ? 0.5 : 1
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#3b82f6' }}>{req.scan_type.toUpperCase()}</span>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 1000, color: req.priority === 'Urgent' ? '#ef4444' : '#64748b' }}>{req.priority.toUpperCase()}</span>
                                    </div>
                                    <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '1rem' }}>ID: {req.patient_id}</div>
                                    <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.2rem' }}>REF: {req._id.slice(-8).toUpperCase()}</div>
                                </motion.div>
                            ))}
                            {requests.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 700 }}>
                                    No scans currently scheduled.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Acquisition Terminal Control */}
                <div className="glass-v3" style={{ padding: '3rem', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
                    {!activeScan ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#94a3b8', gap: '2rem', textAlign: 'center' }}>
                            <Camera size={80} style={{ opacity: 0.1 }} />
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#94a3b8' }}>SYSTEM READY</h3>
                                <p style={{ fontWeight: 600, maxWidth: '300px' }}>Select a patient from the modality worklist to initiate image acquisition.</p>
                            </div>
                        </div>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <span style={{ padding: '0.4rem 1rem', background: '#3b82f6', color: 'white', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 950 }}>SCAN IN-PROGRESS</span>
                                    <h2 style={{ marginTop: '1rem', fontSize: '2rem', fontWeight: 950, color: '#0f172a' }}>
                                        {requests.find(r => r._id === activeScan)?.scan_type}
                                    </h2>
                                    <p style={{ fontWeight: 700, color: '#64748b' }}>PATIENT ID: {requests.find(r => r._id === activeScan)?.patient_id}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '16px' }}>
                                    <Zap color="#f59e0b" size={20} />
                                    <div>
                                        <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 900 }}>KVp: 120 | mAs: 250</p>
                                        <p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>Optimal Exposure Verified</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ flex: 1, background: '#0f172a', borderRadius: '32px', position: 'relative', overflow: 'hidden', border: '8px solid #1e293b' }}>
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {scanProgress < 100 ? (
                                        <motion.div
                                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                            style={{ textAlign: 'center', color: 'white' }}
                                        >
                                            <Camera size={48} style={{ marginBottom: '1rem' }} />
                                            <div style={{ fontSize: '1.5rem', fontWeight: 950 }}>ACQUIRING {scanProgress}%</div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            style={{ textAlign: 'center', color: '#10b981' }}
                                        >
                                            <CheckCircle size={64} style={{ marginBottom: '1rem' }} />
                                            <div style={{ fontSize: '1.5rem', fontWeight: 950 }}>CAPTURE COMPLETE</div>
                                            <p style={{ color: 'white', opacity: 0.6, fontSize: '0.8rem' }}>Image cached in local PACS buffer</p>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Progress Bar Animation */}
                                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '8px', background: '#1e293b' }}>
                                    <motion.div
                                        style={{ height: '100%', background: '#3b82f6', width: `${scanProgress}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <button
                                    className="btn-vitalize"
                                    style={{ background: '#f1f5f9', color: '#64748b' }}
                                    onClick={() => { setActiveScan(null); setScanProgress(0); }}
                                >
                                    ABORT PROCEDURE
                                </button>
                                <button
                                    className="btn-vitalize"
                                    style={{ background: '#10b981' }}
                                    disabled={scanProgress < 100 || submitting}
                                    onClick={async () => {
                                        try {
                                            setSubmitting(true);
                                            await api.patch(`/radiology/requests/${activeScan}/status`, { status: 'Scanned' });
                                            window.location.href = '/radiology/archive';
                                        } catch (err) {
                                            console.error("Status update failed");
                                            setSubmitting(false);
                                        }
                                    }}
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={20} /> : 'PUSH TO PACS & EXIT'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* System Advisories */}
                <div style={{ gridColumn: '1/ -1' }}>
                    <div className="glass-v3" style={{ background: '#fefce8', border: '1px solid #fef08a', padding: '1.5rem 2rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <AlertCircle size={24} color="#f59e0b" />
                        <div>
                            <p style={{ margin: 0, fontWeight: 900, fontSize: '0.85rem', color: '#854d0e' }}>SAFETY ADVISORY: RADIATION DOSAGE</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#a16207', fontWeight: 600 }}>Ensure lead shielding is correctly positioned on non-target zones before initiating exposure.</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default RadiologyTerminal;
