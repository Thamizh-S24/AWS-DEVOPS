import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Map, User, ChevronRight } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from '../admin/SectionHeader';
import api from '../../services/api';

const NurseWardMap = () => {
    const [wards, setWards] = useState([]);
    const [msg, setMsg] = useState('');
    const [patientNames, setPatientNames] = useState({});

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/ward/status');
            const wardsData = res.data;
            setWards(wardsData);

            const allFetchedBeds = wardsData.flatMap(w => w.rooms.flatMap(r => r.beds));
            const occupied = allFetchedBeds.filter(b => b.status === 'Occupied' && b.patient_id);

            const namesToUpdate = {};
            await Promise.all(occupied.map(async (bed) => {
                try {
                    const pRes = await api.get(`/patient/records/${bed.patient_id}`);
                    namesToUpdate[bed.patient_id] = `${pRes.data.first_name} ${pRes.data.last_name}`;
                } catch (e) {
                    namesToUpdate[bed.patient_id] = 'Unknown Patient';
                }
            }));

            setPatientNames(prev => ({ ...prev, ...namesToUpdate }));
        } catch (err) {
            console.error("Error fetching ward data");
        }
    };

    const calculateWardStayCost = (wardType) => {
        const rates = { 'ICU': 1500, 'General': 500, 'Private': 1000 };
        return rates[wardType] || 500;
    };

    const handleDischarge = async (patientId, bedId) => {
        try {
            const bed = allBeds.find(b => b.id === bedId);
            await api.post('/ward/discharge', null, { params: { patient_id: patientId, bed_id: bedId } });
            await api.post('/billing/invoice/create', {
                patient_id: patientId,
                items: [{
                    description: `Ward Stay - Bed ${bedId} (${bed?.ward_name})`,
                    amount: calculateWardStayCost(bed?.ward_type),
                    category: 'Ward Stay'
                }],
                total_amount: calculateWardStayCost(bed?.ward_type),
                status: 'Unpaid'
            });
            setMsg(`Patient ${patientId} discharged. Billing trigger engaged.`);
            fetchData();
            setTimeout(() => setMsg(''), 5000);
        } catch (err) { setMsg('Discharge execution failed'); }
    };

    const allBeds = wards.flatMap(w =>
        w.rooms.flatMap(r =>
            r.beds.map(b => ({ ...b, room_id: r.id, ward_name: w.name, ward_type: w.type }))
        )
    );

    return (
        <DashboardLayout role="nurse">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <SectionHeader title="Ward Occupancy Grid" subtitle="Live clinical allocation topography" />
                    {msg && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                            style={{ padding: '0.8rem 1.5rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderRadius: '12px', fontWeight: 800, border: '1px solid rgba(16, 185, 129, 0.3)', backdropFilter: 'blur(10px)' }}>
                            {msg}
                        </motion.div>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {allBeds.map((bed, idx) => (
                        <motion.div
                            key={bed.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ y: -5, boxShadow: `0 20px 40px -10px ${bed.status === 'Occupied' ? '#10b981' : bed.status === 'Cleaning' ? '#f59e0b' : '#94a3b8'}40` }}
                            className="glass-v3"
                            style={{
                                position: 'relative', overflow: 'hidden', padding: '1.5rem',
                                borderTop: `4px solid ${bed.status === 'Occupied' ? '#10b981' : bed.status === 'Cleaning' ? '#f59e0b' : '#cbd5e1'}`,
                                background: `linear-gradient(to bottom right, #ffffff, ${bed.status === 'Occupied' ? '#f0fdf4' : bed.status === 'Cleaning' ? '#fffbeb' : '#f8fafc'})`
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <div style={{ fontWeight: 950, fontSize: '1.4rem', color: '#0f172a', letterSpacing: '-0.5px' }}>Bed {bed.id}</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: bed.status === 'Occupied' ? '#10b981' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', padding: '0.2rem 0.8rem', background: bed.status === 'Occupied' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.1)', borderRadius: '20px' }}>
                                    {bed.ward_name}
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ width: '55px', height: '55px', borderRadius: '18px', background: bed.status === 'Occupied' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.1)', border: `1px solid ${bed.status === 'Occupied' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: bed.status === 'Occupied' ? '0 8px 16px rgba(16, 185, 129, 0.2)' : 'none' }}>
                                    <User size={28} color={bed.status === 'Occupied' ? '#10b981' : '#94a3b8'} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: bed.status === 'Occupied' ? '#0f172a' : '#94a3b8' }}>
                                        {bed.status === 'Occupied' ? (patientNames[bed.patient_id] || bed.patient_id || 'In-Ward Patient') : 'Empty Suite'}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: bed.status === 'Occupied' ? '#0ea5e9' : '#64748b', letterSpacing: '0.5px', marginTop: '0.2rem' }}>
                                        {bed.status.toUpperCase()} {bed.status === 'Occupied' && `• ${bed.patient_id}`}
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.7)', padding: '1rem', borderRadius: '14px', fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ color: '#64748b', marginRight: '0.5rem' }}>ROOM:</span>
                                    <span>{bed.room_id}</span>
                                </div>
                                {bed.status === 'Occupied' && (
                                    <button
                                        onClick={() => handleDischarge(bed.patient_id, bed.id)}
                                        style={{ padding: '0.5rem 1rem', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.5px' }}
                                        onMouseOver={e => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
                                        onMouseOut={e => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                                    >
                                        DISCHARGE
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </DashboardLayout>
    );
};

export default NurseWardMap;
