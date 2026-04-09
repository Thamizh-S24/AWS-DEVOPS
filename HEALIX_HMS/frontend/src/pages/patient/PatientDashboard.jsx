import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
    Heart, Activity, Calendar, Clock, Clipboard,
    Search, Plus, Star, TrendingUp, Shield,
    FileText, User, Bell, ChevronRight, IndianRupee, Pill,
    Monitor, CheckCircle, AlertTriangle
} from 'lucide-react';
import PatientLayout from '../../components/PatientLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../admin/SectionHeader';

const PatientSectionHeader = ({ title, subtitle, action }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 950, color: '#1e3a8a', margin: 0, letterSpacing: '-1px' }}>{title}</h2>
            <div style={{ height: '5px', width: '80px', background: 'linear-gradient(90deg, #1e40af, #3b82f6)', borderRadius: '2px', margin: '0.8rem 0' }} />
            <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.4rem', fontWeight: 500 }}>{subtitle}</p>
        </div>
        {action}
    </div>
);

const PatientDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [records, setRecords] = useState([]);
    const [billing, setBilling] = useState([]);
    const [vitals, setVitals] = useState(null);
    const [admission, setAdmission] = useState(null);
    const [formData, setFormData] = useState({ doctor_id: '', date: '', time: '', reason: '' });
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (user) {
            fetchAppointments();
            fetchRecords();
            fetchBilling();
            fetchVitals();
            fetchAdmission();
        }
    }, [user]);

    const fetchRecords = async () => {
        try {
            const res = await api.get(`/patient/records/${user.username}`);
            setRecords(res.data);
        } catch (err) {
            console.error("Error fetching records");
        }
    };

    const fetchAppointments = async () => {
        try {
            const res = await api.get(`/appointment/patient/${user.username}`);
            setAppointments(res.data);
        } catch (err) {
            console.error("Error fetching appointments");
        }
    };

    const fetchBilling = async () => {
        try {
            const res = await api.get(`/billing/history/${user.username}`);
            setBilling(res.data);
        } catch (err) {
            console.error("Error fetching billing");
        }
    };

    const fetchVitals = async () => {
        try {
            const res = await api.get(`/patient/vitals/${user.username}`);
            if (res.data && res.data.length > 0) {
                setVitals(res.data[0]); // Latest record
            }
        } catch (err) {
            console.error("Error fetching vitals");
        }
    };

    const fetchAdmission = async () => {
        try {
            const res = await api.get(`/patient/ward-status/${user.username}`);
            setAdmission(res.data);
        } catch (err) {
            console.error("Patient currently not admitted to any ward");
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>

                {/* Royal Hero Section */}
                <div style={{ 
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                    borderRadius: '35px',
                    padding: '3.5rem',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 25px 60px rgba(30, 58, 138, 0.25)',
                    marginBottom: '1rem'
                }}>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                            <div style={{ padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.1)', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 900, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Clinical Status: Synchronized
                            </div>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                        </div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 950, letterSpacing: '-2.5px', margin: 0, lineHeight: 1 }}>Welcome back, {user?.username}</h1>
                        <p style={{ fontSize: '1.25rem', marginTop: '1.2rem', opacity: 0.8, fontWeight: 500, maxWidth: '650px', lineHeight: 1.6 }}>Your personal health command center. View your records, book visits, and check your health data with ease.</p>
                        
                        {admission && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ marginTop: '2rem', padding: '1.2rem 2rem', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', display: 'inline-flex', alignItems: 'center', gap: '1.5rem' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                                    <span style={{ fontWeight: 950, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Hospital Stay</span>
                                </div>
                                <div style={{ height: '20px', width: '1px', background: 'rgba(255,255,255,0.2)' }} />
                                <div style={{ display: 'flex', gap: '2rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.7 }}>WARD</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 950 }}>{admission.ward_id || "General"}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.7 }}>BED UNIT</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 950 }}>{admission.bed_id || "B-12"}</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                    {/* Decorative Background Elements */}
                    <div style={{ position: 'absolute', right: '-60px', bottom: '-60px', opacity: 0.08, transform: 'rotate(-15deg)', color: 'white' }}>
                         <Activity size={320} />
                    </div>
                    <div style={{ position: 'absolute', left: '-20px', top: '-20px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', filter: 'blur(40px)' }} />
                </div>

                {/* Wellness Metrics Strip */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                    <StatCard
                        icon={<Heart />}
                        label="Heart & Pulse"
                        value={vitals ? `${vitals.heart_rate} BPM` : "72 BPM"}
                        trend="Normal"
                        color="#1e40af"
                        subtext="Last synced from device"
                        onClick={() => navigate('/patient/vitals')}
                    />
                    <StatCard
                        icon={<Activity />}
                        label="Daily Movement"
                        value={vitals ? vitals.steps.toLocaleString() : "8,432"}
                        trend="+12%"
                        color="#1e3a8a"
                        subtext="Steps tracked today"
                        onClick={() => navigate('/patient/vitals')}
                    />
                    <StatCard
                        icon={<Star />}
                        label="Wellness Grade"
                        value="92/100"
                        trend="A+"
                        color="#1d4ed8"
                        subtext="Your overall health score"
                        onClick={() => navigate('/patient/aura')}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '3.5rem' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                        {/* Appointments Section */}
                        <section>
                            <PatientSectionHeader
                                title="My Consultations"
                                subtitle="Upcoming medical appointments and therapeutic care schedule"
                            />
                            <motion.div 
                                whileHover={{ y: -5, borderColor: '#1e40af', boxShadow: '0 15px 35px rgba(30, 58, 138, 0.1)' }}
                                onClick={() => navigate('/patient/appointments')}
                                className="stat-card-white" 
                                style={{ padding: '2.5rem', cursor: 'pointer', borderLeft: '6px solid #1e40af' }}
                            >
                                {appointments.length === 0 ? (
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
                                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.8rem 2rem', borderRadius: '20px', background: 'white', border: '1px solid rgba(14, 165, 233, 0.08)', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.02)', transition: 'all 0.3s ease' }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                                    <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg, #0ea5e910, #0ea5e905)', border: '1px solid rgba(14, 165, 233, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, color: '#0ea5e9', fontSize: '1.1rem' }}>
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
                            </motion.div>
                        </section>

                        {/* EHR Section */}
                        <section>
                            <PatientSectionHeader
                                title="Clinical Records"
                                subtitle="Access your verified longitudinal diagnostic history and prescriptions"
                            />
                            <motion.div 
                                whileHover={{ y: -5, borderColor: '#1e3a8a', boxShadow: '0 15px 35px rgba(30, 58, 138, 0.1)' }}
                                onClick={() => navigate('/patient/records')}
                                className="stat-card-white" 
                                style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', borderLeft: '6px solid #1e3a8a' }}
                            >
                                {records.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '6rem 3rem' }}>
                                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                            <FileText size={40} color="#8b5cf6" style={{ opacity: 0.4 }} />
                                        </div>
                                        <h4 style={{ fontWeight: 950, color: '#0f172a', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Records Vault Empty</h4>
                                        <p style={{ color: '#64748b', fontWeight: 500 }}>Verified clinical reports will appear here once processed by hospital nodes.</p>
                                    </div>
                                ) : (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                            <thead>
                                                <tr style={{ background: 'linear-gradient(to bottom, #f8fafc, white)', borderBottom: '1px solid rgba(14, 165, 233, 0.08)' }}>
                                                    <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 950, letterSpacing: '1px' }}>Encounter Date</th>
                                                    <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 950, letterSpacing: '1px' }}>Clinical Diagnosis</th>
                                                    <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 950, letterSpacing: '1px' }}>Prescribed Pathway</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {records.map(r => (
                                                    <tr key={r._id} style={{ borderBottom: '1px solid rgba(14, 165, 233, 0.04)' }}>
                                                        <td style={{ padding: '1.8rem 2rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontWeight: 950, fontSize: '0.9rem' }}>
                                                                <Calendar size={14} color="#0ea5e9" /> {r.date}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.8rem 2rem' }}>
                                                            <div style={{ fontWeight: 950, color: '#0f172a', fontSize: '1rem', letterSpacing: '-0.3px' }}>{r.diagnosis}</div>
                                                        </td>
                                                        <td style={{ padding: '1.8rem 2rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                                                <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.05)', color: '#0ea5e9' }}><Pill size={16} /></div>
                                                                <div style={{ color: '#475569', fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.5 }}>{r.prescription}</div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </motion.div>
                        </section>

                        <section>
                            <PatientSectionHeader
                                title="My Healthcare Bills"
                                subtitle="View your recent payments and hospital charges"
                            />
                            <motion.div 
                                whileHover={{ y: -5, borderColor: '#1d4ed8', boxShadow: '0 15px 35px rgba(30, 58, 138, 0.1)' }}
                                onClick={() => navigate('/patient/billing')}
                                className="stat-card-white" 
                                style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', borderLeft: '6px solid #1d4ed8' }}
                            >
                                {billing.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '6rem 3rem' }}>
                                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                            <Shield size={40} color="#10b981" style={{ opacity: 0.4 }} />
                                        </div>
                                        <h4 style={{ fontWeight: 950, color: '#0f172a', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Clear Financial Status</h4>
                                        <p style={{ color: '#64748b', fontWeight: 500 }}>No outstanding invoices or historical settlement data detected.</p>
                                    </div>
                                ) : (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                            <thead>
                                                <tr style={{ background: 'linear-gradient(to bottom, #f8fafc, white)', borderBottom: '1px solid rgba(16, 185, 129, 0.08)' }}>
                                                    <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 950, letterSpacing: '1px' }}>Service Description</th>
                                                    <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 950, letterSpacing: '1px' }}>Clinical Category</th>
                                                    <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 950, letterSpacing: '1px' }}>Valuation</th>
                                                    <th style={{ padding: '1.5rem 2rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 950, letterSpacing: '1px' }}>Settlement</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {billing.map(bill => (
                                                    <tr key={bill._id} style={{ borderBottom: '1px solid rgba(16, 185, 129, 0.04)' }}>
                                                        <td style={{ padding: '1.8rem 2rem' }}>
                                                            {bill.items.map((it, i) => <div key={i} style={{ fontWeight: 950, color: '#0f172a', fontSize: '1rem', letterSpacing: '-0.3px' }}>{it.description}</div>)}
                                                        </td>
                                                        <td style={{ padding: '1.8rem 2rem' }}>
                                                            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                                {bill.items[0]?.category}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.8rem 2rem' }}>
                                                            <div style={{ fontSize: '1.1rem', fontWeight: 950, color: '#0f172a' }}>
                                                                <IndianRupee size={16} />{bill.total_amount.toLocaleString()}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1.8rem 2rem' }}>
                                                            <div style={{
                                                                padding: '0.6rem 1.2rem',
                                                                borderRadius: '12px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 950,
                                                                width: 'fit-content',
                                                                background: bill.status === 'Paid' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                                                                color: bill.status === 'Paid' ? '#10b981' : '#f59e0b',
                                                                border: bill.status === 'Paid' ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid rgba(245, 158, 11, 0.15)'
                                                            }}>
                                                                {bill.status.toUpperCase()}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </motion.div>
                        </section>
                    </div>

                    {/* Booking Panel */}
                    <aside>
                        <PatientSectionHeader title="Clinical Access" subtitle="Secure diagnostic time" />
                        <div className="stat-card-white" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, white, #f8fafc)', borderRight: '6px solid #1e40af' }}>
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
                                <button type="submit" className="btn-vitalize" style={{ padding: '1.2rem', fontSize: '1rem', fontWeight: 950, background: 'linear-gradient(95deg, #1e3a8a, #1e40af)' }}>
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

                {/* Patient Health Hub Strip */}
                {/* Patient Health Hub Strip */}
                <motion.div 
                    whileHover={{ y: -8, scale: 1.01, boxShadow: '0 30px 60px rgba(30, 58, 138, 0.3)' }}
                    onClick={() => navigate('/patient/settings')}
                    className="stat-card-white" 
                    style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)', color: 'white', border: 'none', padding: '2.5rem', boxShadow: '0 20px 40px rgba(30, 58, 138, 0.2)', cursor: 'pointer' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                            <div style={{ padding: '1.2rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '22px', color: 'white', backdropFilter: 'blur(10px)' }}>
                                <Shield size={36} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1.6rem', letterSpacing: '-0.5px' }}>Your Data Security</h3>
                                <p style={{ margin: '0.5rem 0 0 0', opacity: 0.7, fontSize: '1.05rem', fontWeight: 500, maxWidth: '600px', lineHeight: 1.5 }}>Your medical data is encrypted and protected by advanced security protocols. Only authorized personnel can access your history.</p>
                            </div>
                        </div>
                        <div
                            style={{ padding: '1rem 2rem', borderRadius: '15px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: 950, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.8rem', letterSpacing: '0.5px' }}>
                            AUDIT ACCESS LOGS <ChevronRight size={18} color="white" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </PatientLayout>
    );
};

export default PatientDashboard;

