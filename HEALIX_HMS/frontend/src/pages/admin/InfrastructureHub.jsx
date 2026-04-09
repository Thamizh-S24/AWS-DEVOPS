import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building, TrendingUp, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from './SectionHeader';
import api from '../../services/api';

const InfrastructureHub = ({ searchTerm }) => {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [wards, setWards] = useState([]);
    const [msg, setMsg] = useState('');

    const [selectedWard, setSelectedWard] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        fetchDepartments();
        fetchWards();
    }, []);

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/hr/departments');
            setDepartments(res.data);
        } catch (err) { console.error("Failed to fetch departments"); }
    };

    const fetchWards = async () => {
        try {
            const res = await api.get('/ward/status');
            setWards(res.data);
        } catch (err) { console.error("Failed to fetch wards"); }
    };

    const handleUpdateBedStatus = async (bedId, newStatus) => {
        try {
            await api.patch(`/ward/bed/${bedId}/status`, null, { params: { status: newStatus } });
            fetchWards();
            setMsg(`Bed ${bedId} status updated to ${newStatus}`);
        } catch (err) { setMsg('Status update failed'); }
    };

    const filteredDepartments = departments.filter(d =>
        d.name?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
        d.description?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
    );

    const filteredWards = wards.filter(w =>
        w.name?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
        w.type?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
    );

    return (
        <DashboardLayout role="admin">
            <SectionHeader
                title="Building Manager"
                subtitle="View rooms, wards, and check which beds are free"
                action={
                    <button onClick={() => navigate('/admin/infrastructure/new')} className="btn-vitalize" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem' }}>
                        <Map size={18} /> MANAGE BUILDING
                    </button>
                }
            />

            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem' }}>
                {/* Department Oversight */}
                {!selectedWard && (
                    <div className="stat-card-white" style={{ padding: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Hospital Departments</h3>
                            <Building size={24} color="#0ea5e9" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {filteredDepartments.map(d => (
                                <div key={d._id} style={{ padding: '1.2rem', borderRadius: '16px', background: 'linear-gradient(135deg, white, #f8fafc)', border: '1px solid rgba(14, 165, 233, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>{d.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem', fontWeight: 500 }}>{d.description || 'Specialized service'}</div>
                                    </div>
                                    <div style={{ padding: '0.6rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '10px' }}>
                                        <TrendingUp size={16} color="#10b981" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Ward & Capacity Monitoring */}
                <div className="stat-card-white responsive-card-padding" style={{ padding: '2.5rem', gridColumn: selectedWard ? 'span 2' : 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0 }}>
                            {selectedWard ? `Details: ${selectedWard.name}` : 'Ward Occupancy'}
                        </h3>
                        {selectedWard && (
                            <button onClick={() => { setSelectedWard(null); setSelectedRoom(null); }} style={{ padding: '0.6rem 1.2rem', borderRadius: '12px', background: '#f1f5f9', border: 'none', fontWeight: 800, color: '#64748b', cursor: 'pointer' }}>BACK TO HUB</button>
                        )}
                    </div>

                    {!selectedWard ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {filteredWards.map(w => (
                                <motion.div
                                    whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(139, 92, 246, 0.1)' }}
                                    key={w._id}
                                    onClick={() => setSelectedWard(w)}
                                    style={{ padding: '1.8rem', borderRadius: '24px', background: 'white', border: '1px solid rgba(139, 92, 246, 0.1)', cursor: 'pointer', transition: 'all 0.3s ease' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.8rem' }}>
                                        <div style={{ padding: '0.8rem', background: 'rgba(139, 92, 246, 0.08)', color: '#8b5cf6', borderRadius: '14px' }}><Map size={20} /></div>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#8b5cf6', letterSpacing: '1px', background: 'rgba(139, 92, 246, 0.05)', padding: '0.4rem 0.8rem', borderRadius: '10px' }}>{w.type.toUpperCase()} AREA</span>
                                    </div>
                                    <div style={{ fontWeight: 950, fontSize: '1.3rem', color: '#0f172a', letterSpacing: '-0.5px' }}>{w.name}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '2rem' }}>
                                        <div>
                                            <div style={{ fontSize: '1.6rem', fontWeight: 950, color: '#0f172a' }}>{w.rooms?.length || 0}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800 }}>ACTIVE ROOMS</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1.6rem', fontWeight: 950, color: '#10b981' }}>{w.rooms?.reduce((acc, r) => acc + (r.beds?.filter(b => b.status === 'Available').length || 0), 0)}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800 }}>FREE BEDS</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
                            {/* Room Monitoring List */}
                            <div>
                                <h4 style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: '1.5rem', color: '#94a3b8', letterSpacing: '1px' }}>ROOMS</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    {selectedWard.rooms?.map(r => (
                                        <div key={r.id} onClick={() => setSelectedRoom(r)} style={{ padding: '1.2rem', borderRadius: '16px', background: selectedRoom?.id === r.id ? '#f0f9ff' : 'white', border: selectedRoom?.id === r.id ? '1px solid #0ea5e9' : '1px solid rgba(14, 165, 233, 0.08)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s ease', boxShadow: selectedRoom?.id === r.id ? '0 8px 20px rgba(14, 165, 233, 0.08)' : 'none' }}>
                                            <div>
                                                <span style={{ fontWeight: 850, color: '#0f172a', fontSize: '0.95rem' }}>Room {r.id}</span>
                                                <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800 }}>{r.beds?.length || 0} BEDS REGISTERED</div>
                                            </div>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: r.beds?.some(b => b.status === 'Available') ? '#10b981' : '#ef4444', boxShadow: `0 0 10px ${r.beds?.some(b => b.status === 'Available') ? '#10b981' : '#ef4444'}` }}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bed Utilization Status */}
                            <div>
                                <h4 style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: '1.5rem', color: '#94a3b8', letterSpacing: '1px' }}>
                                    {selectedRoom ? `BEDS IN ROOM ${selectedRoom.id}` : 'SELECT A ROOM TO SEE BEDS'}
                                </h4>
                                {selectedRoom && (
                                    <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1.2rem' }}>
                                        {selectedRoom.beds?.map(b => (
                                            <div key={b.id} style={{ padding: '1.5rem 1rem', borderRadius: '18px', background: '#f8fafc', border: `1px solid ${b.status === 'Maintenance' ? '#fecaca' : b.status === 'Cleaning' ? '#fef3c7' : '#f1f5f9'}`, textAlign: 'center' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'white', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' }}>
                                                    <span style={{ fontWeight: 900, fontSize: '0.8rem', color: '#0ea5e9' }}>{b.id}</span>
                                                </div>
                                                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: b.status === 'Available' ? '#10b981' : b.status === 'Maintenance' ? '#ef4444' : '#f59e0b', marginBottom: '1rem' }}>{b.status.toUpperCase()}</div>

                                                <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                                                    {b.status === 'Available' ? (
                                                        <button onClick={() => handleUpdateBedStatus(b.id, 'Maintenance')} style={{ padding: '0.4rem', borderRadius: '8px', background: '#fee2e2', border: 'none', color: '#ef4444', fontSize: '0.6rem', fontWeight: 900, cursor: 'pointer' }}>MAINTENANCE</button>
                                                    ) : (
                                                        <button onClick={() => handleUpdateBedStatus(b.id, 'Available')} style={{ padding: '0.4rem', borderRadius: '8px', background: '#dcfce7', border: 'none', color: '#10b981', fontSize: '0.6rem', fontWeight: 900, cursor: 'pointer' }}>RESTORE</button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {msg && <p style={{ textAlign: 'center', marginTop: '2rem', color: '#0ea5e9', fontWeight: 700 }}>{msg}</p>}
        </DashboardLayout>
    );
};

export default InfrastructureHub;

