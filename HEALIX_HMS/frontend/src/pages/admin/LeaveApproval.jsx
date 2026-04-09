import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Check, X, Clock, User } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from '../admin/SectionHeader';
import api from '../../services/api';

const LeaveApproval = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaves = async () => {
        try {
            const [leavesRes, staffRes] = await Promise.all([
                api.get('/hr/leaves'),
                api.get('/hr/staff')
            ]);
            const merged = leavesRes.data.map(l => {
                const s = staffRes.data.find(st => st.username === l.staff_id) || {};
                return { ...l, staff_name: s.full_name || l.staff_id, role: s.role };
            });
            setLeaves(merged.filter(l => l.status === 'Pending'));
            setLoading(false);
        } catch (err) { console.error("Fetch failed"); }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleStatus = async (id, status) => {
        try {
            await api.patch(`/hr/leaves/${id}/approve?status=${status}`);
            fetchLeaves();
        } catch (err) { alert("Status update failed"); }
    };

    return (
        <DashboardLayout role="admin">
            <SectionHeader title="Leave Approvals" subtitle="Review and manage staff leave requests" />
            <div className="stat-card-white" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                            <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>STAFF MEMBER</th>
                            <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>DURATION</th>
                            <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>REASON</th>
                            <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', fontWeight: 700 }}>Scanning clinical leave queue...</td>
                            </tr>
                        ) : leaves.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', fontWeight: 700 }}>No pending adjudications found. All staff operational.</td>
                            </tr>
                        ) : leaves.map((l) => (
                            <tr key={l._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1.5rem 2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '35px', height: '35px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{l.staff_name[0]}</div>
                                        <div>
                                            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>{l.staff_name}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>{l.role.toUpperCase()} • ID: {l.staff_id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.5rem 2rem' }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{l.start_date} <span style={{ color: '#94a3b8' }}>to</span> {l.end_date}</div>
                                </td>
                                <td style={{ padding: '1.5rem 2rem' }}>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.reason}</p>
                                </td>
                                <td style={{ padding: '1.5rem 2rem' }}>
                                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                                        <button onClick={() => handleStatus(l._id, 'Approved')} style={{ background: '#dcfce7', color: '#10b981', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}><Check size={18} /></button>
                                        <button onClick={() => handleStatus(l._id, 'Rejected')} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}><X size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default LeaveApproval;

