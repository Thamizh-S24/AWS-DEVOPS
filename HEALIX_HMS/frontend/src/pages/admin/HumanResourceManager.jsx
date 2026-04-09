import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCog, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from './SectionHeader';
import api from '../../services/api';

const HumanResourceManager = ({ searchTerm }) => {
    const [attendance, setAttendance] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [attRes, leafRes] = await Promise.all([
                api.get('/hr/attendance'),
                api.get('/hr/leaves')
            ]);
            setAttendance(attRes.data);
            setLeaves(leafRes.data.filter(l => l.status === 'Pending'));
        } catch (err) { console.error("HR sync failed"); }
    };

    const handleLeaveAction = async (id, action) => {
        try {
            await api.patch(`/hr/leaves/${id}/status`, null, { params: { status: action } });
            setMsg(`Leave request ${action.toLowerCase()}ed`);
            fetchData();
            setTimeout(() => setMsg(''), 3000);
        } catch (err) { setMsg('Action failed'); }
    };

    const filteredLeaves = leaves.filter(l =>
        l.username?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
        l.reason?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
    );

    const filteredAttendance = attendance.filter(a =>
        a.username?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
    );

    return (
        <DashboardLayout role="admin">
            <SectionHeader title="Staff Attendance" subtitle="Monitor staff shifts and approve leave requests" />

            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3rem' }}>
                {/* Leave Approval Section */}
                <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1.5rem' }}>Pending Leave Requests</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        {filteredLeaves.map((l) => (
                            <div key={l._id} className="stat-card-white" style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{l.username}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>{l.role?.toUpperCase()} • {l.days} DAYS</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => handleLeaveAction(l._id, 'Approved')} style={{ color: '#10b981', background: 'none', border: 'none', cursor: 'pointer' }}><CheckCircle size={20} /></button>
                                        <button onClick={() => handleLeaveAction(l._id, 'Rejected')} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><XCircle size={20} /></button>
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>"{l.reason}"</div>
                            </div>
                        ))}
                        {filteredLeaves.length === 0 && <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>{searchTerm ? "No pending leaves match search" : "No pending leave requests"}</p>}
                    </div>
                </div>

                {/* Attendance Monitor */}
                <div className="stat-card-white" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0 }}>Live Attendance Log</h3>
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#10b981' }}>{filteredAttendance.length} STAFF DISPLAYED</span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '400px' }}>
                            <thead style={{ background: '#f8fafc' }}>
                                <tr>
                                    <th style={{ padding: '1.2rem 2rem', color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800 }}>Staff Name</th>
                                    <th style={{ padding: '1.2rem 2rem', color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800 }}>Shift Start</th>
                                    <th style={{ padding: '1.2rem 2rem', color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800 }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAttendance.map((a) => (
                                    <tr key={a._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                        <td style={{ padding: '1rem 2rem' }}>
                                            <div style={{ fontWeight: 800, color: '#0f172a' }}>{a.username}</div>
                                            <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>Terminal Active</div>
                                        </td>
                                        <td style={{ padding: '1rem 2rem', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{new Date(a.check_in).toLocaleTimeString()}</td>
                                        <td style={{ padding: '1rem 2rem' }}>
                                            <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#10b981' }}>ON-SHIFT</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {msg && <p style={{ textAlign: 'center', marginTop: '2rem', color: '#10b981', fontWeight: 800 }}>{msg}</p>}
        </DashboardLayout>
    );
};

export default HumanResourceManager;

