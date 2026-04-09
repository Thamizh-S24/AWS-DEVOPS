import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, ClipboardList, Clock, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { useSearch } from '../../context/SearchContext';

const RadiologyWorklist = () => {
    const { searchTerm: globalSearch } = useSearch();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [localSearch, setLocalSearch] = useState('');

    const activeSearch = globalSearch || localSearch;

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/radiology/requests');
            setRequests(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (err) {
            console.error("Worklist sync failure");
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Urgent': return '#ef4444';
            case 'Stat': return '#8b5cf6';
            case 'Routine': return '#64748b';
            default: return '#64748b';
        }
    };

    const filteredRequests = (requests || []).filter(r =>
        r?.patient_id?.toLowerCase()?.includes(activeSearch?.toLowerCase() || '') ||
        r?.scan_type?.toLowerCase()?.includes(activeSearch?.toLowerCase() || '')
    );

    return (
        <DashboardLayout role="radiologist">
            <div className="glass-v3" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>Imaging Worklist</h2>
                        <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.4rem', fontWeight: 500 }}>Manage and prioritize clinical imaging requests</p>
                    </div>
                    {!globalSearch && (
                        <div className="search-container" style={{ width: '400px' }}>
                            <Search size={18} className="search-icon" />
                            <input
                                className="search-input"
                                placeholder="Filter by Patient ID or Modality..."
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem' }}>
                        <Loader2 className="animate-spin" size={48} color="#3b82f6" />
                        <p style={{ marginTop: '1rem', fontWeight: 800, color: '#1e293b' }}>SYNCING DICOM STREAM...</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 1rem' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', color: '#64748b', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>
                                    <th style={{ padding: '0 1.5rem' }}>Patient / Case ID</th>
                                    <th style={{ padding: '0 1.5rem' }}>Imaging Modality</th>
                                    <th style={{ padding: '0 1.5rem' }}>Clinical Urgency</th>
                                    <th style={{ padding: '0 1.5rem' }}>Workflow Stage</th>
                                    <th style={{ padding: '0 1.5rem' }}>Entry Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests.map((req) => (
                                    <motion.tr
                                        key={req._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        style={{ background: '#f8fafc', borderRadius: '16px' }}
                                    >
                                        <td style={{ padding: '1.5rem' }}>
                                            <div style={{ fontWeight: 800, color: '#0f172a' }}>{req.patient_id}</div>
                                            <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>UID: {req._id.slice(-8).toUpperCase()}</div>
                                        </td>
                                        <td style={{ padding: '1.5rem' }}>
                                            <div style={{ color: '#3b82f6', fontWeight: 900, fontSize: '0.85rem' }}>{req.scan_type.toUpperCase()}</div>
                                        </td>
                                        <td style={{ padding: '1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: getPriorityColor(req.priority), fontWeight: 900, fontSize: '0.75rem' }}>
                                                {req.priority === 'Urgent' && <AlertTriangle size={14} />}
                                                {req.priority.toUpperCase()}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem' }}>
                                            <span style={{
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '10px',
                                                fontSize: '0.7rem',
                                                fontWeight: 900,
                                                background: req.status === 'Scheduled' ? '#dbeafe' : req.status === 'Scanned' ? '#fef9c3' : '#dcfce7',
                                                color: req.status === 'Scheduled' ? '#3b82f6' : req.status === 'Scanned' ? '#a16207' : '#10b981'
                                            }}>
                                                {req.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.5rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Clock size={12} />
                                                {req.ordered_at ? new Date(req.ordered_at).toLocaleTimeString() : 'N/A'}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                                {filteredRequests.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8', fontWeight: 700 }}>
                                            No diagnostic requests found in current worklist segment.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default RadiologyWorklist;
