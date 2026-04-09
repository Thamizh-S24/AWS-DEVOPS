import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar, Clock, Search, CheckCircle, AlertTriangle
} from 'lucide-react';
import PatientLayout from '../../components/PatientLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PatientSectionHeader = ({ title, subtitle }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 950, color: '#1e3a8a', margin: 0, letterSpacing: '-1px' }}>{title}</h2>
            <div style={{ height: '5px', width: '80px', background: 'linear-gradient(90deg, #1e40af, #3b82f6)', borderRadius: '2px', margin: '0.8rem 0' }} />
            <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.4rem', fontWeight: 500 }}>{subtitle}</p>
        </div>
    </div>
);

const PatientAppointments = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ doctor_id: '', date: '', time: '', reason: '' });
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (user) {
            fetchAppointments();
        }
    }, [user]);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/appointment/patient/${user.username}`);
            setAppointments(res.data);
        } catch (err) {
            console.error("Error fetching appointments");
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async (e) => {
        e.preventDefault();
        try {
            await api.post('/appointment/create', { ...formData, patient_id: user.username });
            setMsg('Appointment request broadcasted');
            setFormData({ doctor_id: '', date: '', time: '', reason: '' });
            fetchAppointments();
            setTimeout(() => setMsg(''), 4000);
        } catch (err) {
            setMsg('Service temporarily unavailable');
        }
    };

    return (
        <PatientLayout>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '3.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                    {/* Appointments Section */}
                    <section>
                        <PatientSectionHeader
                            title="My Consultations"
                            subtitle="Upcoming medical appointments and therapeutic care schedule"
                        />
                        <div className="stat-card-white" style={{ padding: '2.5rem' }}>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8', fontWeight: 700 }}>SYNCING APPOINTMENT LEDGER...</div>
                            ) : appointments.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                        <Calendar size={40} color="#0ea5e9" style={{ opacity: 0.4 }} />
                                    </div>
                                    <h4 style={{ fontWeight: 950, color: '#0f172a', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Awaiting Consultations</h4>
                                    <p style={{ color: '#64748b', fontWeight: 500 }}>No upcoming clinical sessions found in your active schedule.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gap: '1.5rem' }}>
                                    {appointments.map((a, i) => (
                                        <div
                                            key={a._id}
                                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.8rem 2rem', borderRadius: '20px', background: 'white', border: '1px solid #dbeafe', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.05)', transition: 'all 0.3s ease' }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                                <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, color: '#1e40af', fontSize: '1.1rem' }}>
                                                    DR
                                                </div>
                                                <div>
                                                    <h4 style={{ margin: 0, fontWeight: 950, color: '#0f172a', fontSize: '1.1rem', letterSpacing: '-0.3px' }}>Dr. {a.doctor_id}</h4>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.4rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                                                            <Calendar size={14} /> {a.date}
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0ea5e9', fontSize: '0.85rem', fontWeight: 950 }}>
                                                            <Clock size={14} /> {a.time}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ padding: '0.6rem 1.2rem', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.08)', color: '#10b981', fontSize: '0.75rem', fontWeight: 950, letterSpacing: '1px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                                {a.status.toUpperCase()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Booking Panel */}
                <aside>
                    <PatientSectionHeader title="Clinical Access" subtitle="Secure diagnostic time" />
                    <div className="stat-card-white" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, white, #f8fafc)', borderRight: '6px solid #0ea5e9' }}>
                        <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Clinical Specialist UID</label>
                                <div style={{ position: 'relative' }}>
                                    <Search style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
                                    <input
                                        placeholder="Enter Practitioner ID..."
                                        value={formData.doctor_id}
                                        onChange={e => setFormData({ ...formData, doctor_id: e.target.value })}
                                        style={{ padding: '1.1rem 1.1rem 1.1rem 3.2rem', width: '100%', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 950, color: '#0f172a', outline: 'none' }}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Preferred Date</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        style={{ padding: '1.1rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 950, color: '#0f172a', outline: 'none' }}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Available Slot</label>
                                    <input
                                        type="time"
                                        value={formData.time}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                        style={{ padding: '1.1rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 950, color: '#0f172a', outline: 'none' }}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Clinical Context / Reason</label>
                                <textarea
                                    placeholder="Briefly describe your symptomatic condition..."
                                    value={formData.reason}
                                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                    style={{ padding: '1.2rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 600, minHeight: '140px', color: '#1e293b', outline: 'none', resize: 'none', lineHeight: 1.6 }}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-vitalize" style={{ padding: '1.2rem', fontSize: '1rem', fontWeight: 950, background: 'var(--grad-main)' }}>
                                <CheckCircle size={20} /> AUTHORIZE CARE REQUEST
                            </button>
                            {msg && <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ textAlign: 'center', color: '#10b981', fontWeight: 950, fontSize: '0.9rem', background: 'rgba(16, 185, 129, 0.08)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                {msg.toUpperCase()}
                            </motion.p>}
                        </form>
                    </div>
                </aside>
            </div>
        </PatientLayout>
    );
};

export default PatientAppointments;
