import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from '../admin/SectionHeader';
import api from '../../services/api';

const ReceptionistAdmissions = () => {
    const [admissionQueue, setAdmissionQueue] = useState([]);
    const [wards, setWards] = useState([]);
    const [showAllocation, setShowAllocation] = useState(null);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetchAdmissionQueue();
        fetchWards();
        const intv = setInterval(() => {
            fetchAdmissionQueue();
            fetchWards();
        }, 15000);
        return () => clearInterval(intv);
    }, []);

    const fetchAdmissionQueue = async () => {
        try {
            const res = await api.get('/ward/admission-requests');
            setAdmissionQueue(res.data.filter(r => r.status === 'Pending'));
        } catch (err) { console.error("Error fetching admission queue"); }
    };

    const fetchWards = async () => {
        try {
            const res = await api.get('/ward/status');
            setWards(res.data);
        } catch (err) { console.error("Error fetching wards"); }
    };

    const handleAllocate = async (bedId) => {
        if (!showAllocation) return;
        try {
            await api.post('/ward/allocate', null, {
                params: {
                    patient_id: showAllocation.patient_id,
                    bed_id: bedId,
                    request_id: showAllocation._id
                }
            });
            setMsg(`Patient successfully physically allocated to bed ${bedId}`);
            setShowAllocation(null);
            fetchAdmissionQueue();
            fetchWards();
            setTimeout(() => setMsg(''), 5000);
        } catch (err) { setMsg('Allocation failed to execute'); }
    };

    return (
        <DashboardLayout role="receptionist">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <SectionHeader title="Clinical Admission Queue" subtitle="Manage pending hospitalizations requested by physicians" />
                    <AnimatePresence>
                        {msg && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                style={{ padding: '0.8rem 1.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px', fontWeight: 800, border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckCircle size={18} /> {msg}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: showAllocation ? '1.2fr 1fr' : '1fr', gap: '3rem', transition: 'all 0.4s ease' }}>

                    {/* Left: Queue */}
                    <div className="glass-v3" style={{ padding: 0, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: 'linear-gradient(to right, #f8fafc, #f1f5f9)' }}>
                                <tr>
                                    <th style={{ padding: '1.2rem 2rem', fontSize: '0.75rem', color: '#64748b', fontWeight: 800 }}>PATIENT ID</th>
                                    <th style={{ padding: '1.2rem 2rem', fontSize: '0.75rem', color: '#64748b', fontWeight: 800 }}>REQ DOCTOR</th>
                                    <th style={{ padding: '1.2rem 2rem', fontSize: '0.75rem', color: '#64748b', fontWeight: 800 }}>PRIORITY</th>
                                    <th style={{ padding: '1.2rem 2rem', fontSize: '0.75rem', color: '#64748b', fontWeight: 800 }}>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admissionQueue.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>All requested admissions fulfilled</td>
                                    </tr>
                                ) : admissionQueue.map((req, i) => (
                                    <motion.tr
                                        key={req._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        style={{ borderBottom: '1px solid #f1f5f9', background: showAllocation?._id === req._id ? 'rgba(14, 165, 233, 0.05)' : 'white' }}
                                    >
                                        <td style={{ padding: '1.2rem 2rem', fontWeight: 900, color: '#0f172a' }}>{req.patient_id}</td>
                                        <td style={{ padding: '1.2rem 2rem', fontWeight: 700, color: '#64748b' }}>Dr. {req.doctor_id}</td>
                                        <td style={{ padding: '1.2rem 2rem' }}>
                                            <span style={{
                                                padding: '0.3rem 0.8rem',
                                                borderRadius: '8px',
                                                fontSize: '0.7rem',
                                                fontWeight: 900,
                                                background: req.priority === 'Emergency' ? 'rgba(239, 68, 68, 0.1)' : '#f1f5f9',
                                                color: req.priority === 'Emergency' ? '#ef4444' : '#64748b',
                                                border: req.priority === 'Emergency' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid #e2e8f0'
                                            }}>
                                                {req.priority.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.2rem 2rem' }}>
                                            <button
                                                onClick={() => setShowAllocation(req)}
                                                className="btn-vitalize"
                                                style={{ padding: '0.5rem 1rem', width: 'auto', background: showAllocation?._id === req._id ? '#0284c7' : '#0ea5e9' }}>
                                                {showAllocation?._id === req._id ? 'SELECTING BED...' : 'ALLOCATE BED'}
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Right: Interactive Ward Grid UI */}
                    <AnimatePresence>
                        {showAllocation && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="glass-v3"
                                style={{ padding: '2rem', background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 950, color: '#0f172a' }}>Bed Assignment</h3>
                                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Securing capacity for {showAllocation.patient_id}</p>
                                    </div>
                                    <button onClick={() => setShowAllocation(null)} style={{ border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {wards.map(ward => (
                                        <div key={ward.id} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', background: 'white' }}>
                                            <h4 style={{ margin: '0 0 1.2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e293b' }}>{ward.name}</span>
                                                <span style={{ fontSize: '0.7rem', color: '#0ea5e9', background: 'rgba(14, 165, 233, 0.1)', padding: '0.3rem 0.8rem', borderRadius: '12px', fontWeight: 800, textTransform: 'uppercase' }}>{ward.type}</span>
                                            </h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                                                {ward.rooms.map(room => (
                                                    <div key={room.id} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                                        <p style={{ margin: '0 0 0.8rem 0', fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8' }}>Room {room.id}</p>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                            {room.beds.map(bed => (
                                                                <button
                                                                    key={bed.id}
                                                                    disabled={bed.status !== 'Available'}
                                                                    onClick={() => handleAllocate(bed.id)}
                                                                    title={bed.status !== 'Available' ? bed.status : 'Assign physically'}
                                                                    style={{
                                                                        width: '32px', height: '32px', borderRadius: '8px',
                                                                        border: 'none',
                                                                        background: bed.status === 'Available' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.1)',
                                                                        cursor: bed.status === 'Available' ? 'pointer' : 'not-allowed',
                                                                        fontSize: '0.7rem', fontWeight: 900,
                                                                        color: bed.status === 'Available' ? '#10b981' : '#ef4444',
                                                                        transition: 'all 0.2s'
                                                                    }}
                                                                    onMouseOver={e => { if (bed.status === 'Available') e.target.style.background = 'rgba(16, 185, 129, 0.3)' }}
                                                                    onMouseOut={e => { if (bed.status === 'Available') e.target.style.background = 'rgba(16, 185, 129, 0.15)' }}
                                                                >
                                                                    {bed.id.split('-').pop()}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </DashboardLayout>
    );
};

export default ReceptionistAdmissions;
