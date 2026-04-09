import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Shield, Search, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { useSearch } from '../../context/SearchContext';

const RadiologyArchive = () => {
    const { searchTerm: globalSearch } = useSearch();
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedScan, setSelectedScan] = useState(null);
    const [localSearch, setLocalSearch] = useState('');

    // Structured Findings (fpr)
    const [report, setReport] = useState({
        indication: '',
        findings: '',
        impression: '',
        dose: '',
        technicals: ''
    });

    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetchScans();
    }, []);

    const fetchScans = async () => {
        try {
            const res = await api.get('/radiology/requests');
            setScans(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (err) {
            console.error("Archive sync failure");
            setLoading(false);
        }
    };

    const handleRelease = async (e) => {
        e.preventDefault();
        if (!selectedScan) return;

        try {
            setSubmitting(true);
            const formattedFindings = `
INDICATION: ${report.indication}
FINDINGS: ${report.findings}
IMPRESSION: ${report.impression}
RADIATION DOSE: ${report.dose}
MODALITY TECHNICALS: ${report.technicals}
            `.trim();

            await api.patch(`/radiology/requests/${selectedScan._id}/upload`, {
                findings: formattedFindings,
                image_url: "pacs_stable_production_id_7782.jpg"
            });
            setMsg('Radiologic findings authorized and synced with EMR');
            setReport({ indication: '', findings: '', impression: '', dose: '', technicals: '' });
            setSelectedScan(null);
            fetchScans();
            setSubmitting(false);
            setTimeout(() => setMsg(''), 4000);
        } catch (err) {
            setMsg('Authorization protocol failed');
            setSubmitting(false);
        }
    };

    const activeSearch = globalSearch || localSearch;
    const filteredPending = (scans || [])
        .filter(s => s.status === 'Scanned')
        .filter(s =>
            s.patient_id?.toLowerCase()?.includes(activeSearch?.toLowerCase() || '') ||
            s.scan_type?.toLowerCase()?.includes(activeSearch?.toLowerCase() || '')
        );
    const completedScans = (scans || []).filter(s => s.status === 'Result Ready');

    return (
        <DashboardLayout role="radiologist">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '3rem' }}>

                {/* Pending Reports Segment */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>Result Authorization</h2>
                        <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.4rem', fontWeight: 500 }}>Finalize and release radiologic reports</p>
                    </div>

                    <div className="glass-v3" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 900, margin: 0, color: '#1e293b' }}>Active Studies</h3>
                            {!globalSearch && (
                                <div className="input-diagnostic-wrapper" style={{ width: '150px', marginBottom: 0 }}>
                                    <Search size={14} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                    <input
                                        placeholder="Search..."
                                        value={localSearch}
                                        onChange={e => setLocalSearch(e.target.value)}
                                        style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2.2rem', fontSize: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                                    />
                                </div>
                            )}
                        </div>
                        {loading ? (
                            <Loader2 size={24} className="animate-spin" color="#3b82f6" />
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {filteredPending.map(scan => (
                                    <motion.div
                                        key={scan._id}
                                        onClick={() => {
                                            setSelectedScan(scan);
                                            setReport({ ...report, indication: scan.clinical_data || '' });
                                        }}
                                        whileHover={{ x: 5 }}
                                        style={{
                                            padding: '1.2rem',
                                            borderRadius: '16px',
                                            background: selectedScan?._id === scan._id ? '#eff6ff' : '#f8fafc',
                                            border: selectedScan?._id === scan._id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{scan.scan_type}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>PATIENT: {scan.patient_id}</span>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: scan.priority === 'Urgent' ? '#ef4444' : '#94a3b8' }}>{scan.priority.toUpperCase()}</span>
                                        </div>
                                    </motion.div>
                                ))}
                                {filteredPending.length === 0 && (
                                    <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>Zero studies awaiting reports.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Quick Access Completed */}
                    <div className="glass-v3" style={{ padding: '2rem', background: '#f8fafc' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 900, marginBottom: '1rem', color: '#64748b' }}>Recent Historical Studies</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {completedScans.slice(0, 5).map(scan => (
                                <div key={scan._id} style={{ fontSize: '0.75rem', fontWeight: 700, display: 'flex', justifyContent: 'space-between', color: '#1e293b' }}>
                                    <span>{scan.scan_type} ({scan.patient_id})</span>
                                    <CheckCircle size={14} color="#10b981" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Reporting Worksheet */}
                <div className="glass-v3" style={{ padding: '3.5rem', minHeight: '700px', display: 'flex', flexDirection: 'column' }}>
                    {!selectedScan ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#cbd5e1', gap: '2rem' }}>
                            <FileText size={80} style={{ opacity: 0.1 }} />
                            <p style={{ fontWeight: 800, fontSize: '1.2rem', textAlign: 'center', maxWidth: '300px' }}>Load a study from the queue to generate clinical findings</p>
                        </div>
                    ) : (
                        <form onSubmit={handleRelease} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '2rem', borderBottom: '1px solid #f1f5f9' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 950 }}>{selectedScan.scan_type} ANALYSIS</h3>
                                    <p style={{ margin: '0.4rem 0 0 0', fontWeight: 700, color: '#3b82f6', fontSize: '0.9rem' }}>PATIENT CASE: {selectedScan.patient_id}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ background: '#f1f5f9', padding: '0.6rem 1rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 950 }}>
                                        PACS STUDY ID: {selectedScan._id.slice(-10).toUpperCase()}
                                    </div>
                                    <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>CAPTURE DATE: {new Date(selectedScan.ordered_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase' }}>Clinical Indication</label>
                                        <input
                                            value={report.indication}
                                            onChange={e => setReport({ ...report, indication: e.target.value })}
                                            placeholder="e.g. Chronic headaches, trauma"
                                            style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600 }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase' }}>Radiation Dose Metadata</label>
                                        <input
                                            value={report.dose}
                                            onChange={e => setReport({ ...report, dose: e.target.value })}
                                            placeholder="e.g. 5.2 mSv"
                                            style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600 }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Detailed Findings</label>
                                    <textarea
                                        required
                                        value={report.findings}
                                        onChange={e => setReport({ ...report, findings: e.target.value })}
                                        placeholder="Exhaustive clinical observations..."
                                        style={{ minHeight: '180px', padding: '1.5rem', borderRadius: '18px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.95rem', fontWeight: 600, outline: 'none', resize: 'none' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 950, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px' }}>Radiologic Impression (Conclusion)</label>
                                    <textarea
                                        required
                                        value={report.impression}
                                        onChange={e => setReport({ ...report, impression: e.target.value })}
                                        placeholder="Final summary diagnosis and clinical recommendations..."
                                        style={{ minHeight: '100px', padding: '1.5rem', borderRadius: '18px', border: '2px solid #dbeafe', background: '#eff6ff', fontSize: '0.95rem', fontWeight: 700, outline: 'none', resize: 'none' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase' }}>Modality Technical Parameters</label>
                                    <input
                                        value={report.technicals}
                                        onChange={e => setReport({ ...report, technicals: e.target.value })}
                                        placeholder="e.g. T1 Space weighted, axial-coronal-sagittal"
                                        style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600 }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: 'auto' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid #fef08a', background: '#fffbeb', borderRadius: '16px', color: '#854d0e', fontSize: '0.75rem' }}>
                                    <AlertCircle size={18} />
                                    <span style={{ fontWeight: 800 }}>Authorization will trigger real-time EMR synchronization for clinical review.</span>
                                </div>
                                <button
                                    type="submit"
                                    className="btn-vitalize"
                                    disabled={submitting}
                                    style={{ width: '100%', padding: '1.4rem', background: '#3b82f6', gap: '1rem' }}
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <Shield size={20} />}
                                    AUTHORIZE CLINICAL RELEASE
                                </button>
                                {msg && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{ textAlign: 'center', color: msg.includes('failed') ? '#ef4444' : '#10b981', fontWeight: 900, marginTop: '1rem' }}
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

export default RadiologyArchive;
