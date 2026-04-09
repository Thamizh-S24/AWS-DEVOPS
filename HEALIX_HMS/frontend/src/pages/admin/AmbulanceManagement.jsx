import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ambulance, User, MapPin, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from './SectionHeader';
import api from '../../services/api';

const AmbulanceManagement = ({ searchTerm }) => {
    const navigate = useNavigate();
    const [ambulances, setAmbulances] = useState([]);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/ambulance/ambulances');
            setAmbulances(res.data);
        } catch (err) { console.error("Ambulance fetch failed"); }
    };

    const filteredAmbulances = ambulances.filter(a =>
        a.vehicle_number?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
        a.driver_name?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
    );

    return (
        <DashboardLayout role="admin">
            <SectionHeader
                title="Ambulance Hub"
                subtitle="Manage ambulances and track their status"
                action={
                    <button onClick={() => navigate('/admin/ambulance/new')} className="btn-vitalize" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem' }}>
                        <Ambulance size={18} /> ADD AMBULANCE
                    </button>
                }
            />

            <div className="stat-card-white" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                        <thead>
                            <tr style={{ background: 'linear-gradient(to bottom, #f8fafc, white)', borderBottom: '1px solid rgba(14, 165, 233, 0.08)' }}>
                                <th style={{ padding: '1.2rem 2.5rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1px' }}>Ambulance ID</th>
                                <th style={{ padding: '1.2rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1px' }}>Driver</th>
                                <th style={{ padding: '1.2rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1px' }}>Status</th>
                                <th style={{ padding: '1.2rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1px' }}>Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAmbulances.map((a) => (
                                <tr key={a._id} style={{ borderBottom: '1px solid rgba(14, 165, 233, 0.04)' }}>
                                    <td style={{ padding: '1.5rem 2.5rem' }}>
                                        <div style={{ fontWeight: 950, color: '#0f172a', fontSize: '1rem', letterSpacing: '-0.3px' }}>{a.vehicle_number}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, marginTop: '0.1rem' }}>{a.type?.toUpperCase() || 'ADVANCED LIFE SUPPORT'}</div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                            <div style={{ padding: '0.5rem', background: 'rgba(100, 116, 139, 0.05)', borderRadius: '10px' }}>
                                                <User size={16} color="#64748b" />
                                            </div>
                                            <span style={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>{a.driver_name || 'Standby Personnel'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '12px', background: a.status === 'Available' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)', color: a.status === 'Available' ? '#10b981' : '#ef4444', width: 'fit-content', border: a.status === 'Available' ? '1px solid rgba(16, 185, 129, 0.1)' : '1px solid rgba(239, 68, 68, 0.1)' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', boxShadow: `0 0 8px currentColor` }} />
                                            <span style={{ fontSize: '0.7rem', fontWeight: 950 }}>{a.status.toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <MapPin size={14} color="#94a3b8" />
                                            LOCATION: <span style={{ color: '#0f172a' }}>North Wing B1</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredAmbulances.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>No ambulance units match your search</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {msg && <p style={{ textAlign: 'center', marginTop: '2rem', color: '#10b981', fontWeight: 800 }}>{msg}</p>}
        </DashboardLayout>
    );
};

export default AmbulanceManagement;
