import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, CheckCircle, Clock } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

const LabRequestQueue = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const res = await api.get('/lab/requests');
            setTests(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch lab queue");
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return '#f59e0b';
            case 'Processing': return '#8b5cf6';
            case 'Completed': return '#10b981';
            default: return '#64748b';
        }
    };

    const filteredTests = (tests || []).filter(t =>
        t?.patient_id?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '') ||
        t?.test_type?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '')
    );

    return (
        <DashboardLayout role="lab_tech">
            <div className="glass-v3" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>Diagnostic Order Queue</h2>
                        <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.4rem', fontWeight: 500 }}>Manage and filter incoming laboratory requests</p>
                    </div>
                    <div className="search-container" style={{ width: '350px' }}>
                        <Search size={18} className="search-icon" />
                        <input
                            className="search-input"
                            placeholder="Search Patient ID or Test..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem' }}>
                        <Loader2 className="animate-spin" size={48} color="#0ea5e9" />
                        <p style={{ marginTop: '1rem', fontWeight: 600, color: '#64748b' }}>Syncing Order Stream...</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.8rem' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', color: '#64748b', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>
                                    <th style={{ padding: '0 1.5rem' }}>Specimen / ID</th>
                                    <th style={{ padding: '0 1.5rem' }}>Procedure</th>
                                    <th style={{ padding: '0 1.5rem' }}>Priority</th>
                                    <th style={{ padding: '0 1.5rem' }}>Lifecycle Stage</th>
                                    <th style={{ padding: '0 1.5rem' }}>Time Ordered</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTests.map((test) => (
                                    <motion.tr
                                        key={test._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{ background: '#f8fafc', borderRadius: '16px' }}
                                    >
                                        <td style={{ padding: '1.5rem' }}>
                                            <div style={{ fontWeight: 800, color: '#1e293b' }}>{test.patient_id}</div>
                                            <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>REF: {test._id.slice(-8).toUpperCase()}</div>
                                        </td>
                                        <td style={{ padding: '1.5rem', color: '#475569', fontWeight: 700 }}>{test.test_type}</td>
                                        <td style={{ padding: '1.5rem' }}>
                                            <span style={{
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '10px',
                                                fontSize: '0.7rem',
                                                fontWeight: 900,
                                                background: test.priority === 'Urgent' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                                                color: test.priority === 'Urgent' ? '#ef4444' : '#64748b'
                                            }}>
                                                {test.priority.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: getStatusColor(test.status), fontWeight: 900, fontSize: '0.75rem' }}>
                                                {test.status === 'Processing' && <Loader2 size={14} className="animate-spin" />}
                                                {test.status === 'Completed' && <CheckCircle size={14} />}
                                                {test.status === 'Pending' && <Clock size={14} />}
                                                {test.status.toUpperCase()}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>
                                            {test?.ordered_at ? new Date(test.ordered_at).toLocaleString() : 'N/A'}
                                        </td>
                                    </motion.tr>
                                ))}
                                {filteredTests.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', fontWeight: 600 }}>
                                            No diagnostic requests found matching current filter.
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

export default LabRequestQueue;
