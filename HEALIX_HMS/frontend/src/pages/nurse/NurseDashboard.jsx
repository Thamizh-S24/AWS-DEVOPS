import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Shield, Map, CheckSquare, Thermometer,
    User, Heart, AlertCircle, TrendingUp, Plus,
    ClipboardList, ChevronRight
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const StatCard = ({ icon, label, value, trend, color, subtext, gradient }) => (
    <motion.div
        whileHover={{ y: -6, boxShadow: `0 20px 40px -10px ${color}30` }}
        className="glass-v3"
        style={{ position: 'relative', overflow: 'hidden', padding: '2rem', borderTop: `4px solid ${color}` }}
    >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: gradient || `linear-gradient(135deg, ${color}05, transparent)`, zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', borderRadius: '18px', background: `${color}15`, color: color, backdropFilter: 'blur(10px)', border: `1px solid ${color}30` }}>
                {icon}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <TrendingUp size={14} />
                {trend}
            </div>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{label}</p>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 950, color: '#0f172a', margin: 0, letterSpacing: '-1px' }}>{value}</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.8rem', fontWeight: 500 }}>{subtext}</p>
        </div>

        <div style={{ position: 'absolute', right: '-5%', bottom: '-15%', opacity: 0.04, color: color, transform: 'rotate(-10deg)', zIndex: 0 }}>
            {React.cloneElement(icon, { size: 140 })}
        </div>
    </motion.div>
);

const SectionHeader = ({ title, subtitle, action }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>{title}</h2>
            <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.4rem', fontWeight: 500 }}>{subtitle}</p>
        </div>
        {action}
    </div>
);


const NurseDashboard = () => {
    const { user } = useAuth();
    const [msg, setMsg] = useState('');
    const [wards, setWards] = useState([]);
    const [emergencyAlerts, setEmergencyAlerts] = useState([]);
    const [attendance, setAttendance] = useState(null);
    const [vitalsForm, setVitalsForm] = useState({ patient_id: '', temp: '', bp: '', notes: '' });

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [wardRes, emRes, attRes] = await Promise.all([
                api.get('/ward/status'),
                api.get('/emergency/cases'),
                api.get(`/hr/attendance/${user?.username}`).catch(() => ({ data: [] }))
            ]);
            setWards(wardRes.data);
            setEmergencyAlerts(emRes.data.filter(c => c.triage_level <= 2 && c.status === 'Waiting'));

            const logs = Array.isArray(attRes.data) ? attRes.data : [];
            const todayLog = logs.find(l => l.date === new Date().toISOString().split('T')[0]);
            setAttendance(todayLog);
        } catch (err) {
            console.error("Error fetching nurse data");
        }
    };

    // Flatten beds from all wards
    const allBeds = wards.flatMap(w =>
        w.rooms.flatMap(r =>
            r.beds.map(b => ({ ...b, room_id: r.id, ward_name: w.name, ward_type: w.type }))
        )
    );

    const occupiedBeds = allBeds.filter(b => b.status === 'Occupied');
    const criticalBeds = allBeds.filter(b => b.status === 'Priority' || b.status === 'Critical');

    // Calculate Shift Progress
    let shiftDisplay = 'Off Duty';
    let shiftTrend = 'Standby';
    let shiftColor = '#64748b';
    if (attendance && attendance.status === 'Present') {
        const checkInTime = new Date(attendance.timestamp);
        const now = new Date();
        const diffHrs = (now - checkInTime) / (1000 * 60 * 60);
        shiftDisplay = `${diffHrs.toFixed(1)}h`;
        shiftTrend = diffHrs > 8 ? 'Overtime' : 'On Shift';
        shiftColor = diffHrs > 8 ? '#f59e0b' : '#0d9488';
    }

    return (
        <DashboardLayout role="nurse">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>

                {/* Ward Metrics Strip */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' }}>
                    <StatCard
                        icon={<Map />}
                        label="Beds & Rooms"
                        value={`${occupiedBeds.length}/${allBeds.length}`}
                        trend="Live"
                        color="#0ea5e9"
                        gradient="linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(14, 165, 233, 0.15) 100%)"
                        subtext="Total beds currently in use"
                    />
                    <StatCard
                        icon={<Activity />}
                        label="Priority Checks"
                        value={criticalBeds.length}
                        trend={criticalBeds.length > 0 ? "Quick Review" : "All Stable"}
                        color={criticalBeds.length > 0 ? "#ef4444" : "#10b981"}
                        gradient={criticalBeds.length > 0 ? "linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.15) 100%)" : "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.15) 100%)"}
                        subtext="Patients needing quick check-ups"
                    />
                    <StatCard
                        icon={<Heart />}
                        label="Shift Progress"
                        value={shiftDisplay}
                        trend={shiftTrend}
                        color={shiftColor}
                        gradient={`linear-gradient(135deg, ${shiftColor}05 0%, ${shiftColor}15 100%)`}
                        subtext="Consecutive hours logged today"
                    />
                </div>

                {/* Modular Navigation Panel */}
                <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                    <motion.div
                        whileHover={{ scale: 1.02, y: -5, boxShadow: '0 25px 50px -12px rgba(14, 165, 233, 0.25)' }}
                        onClick={() => window.location.href = '/nurse/wards'}
                        className="glass-v3"
                        style={{ padding: '3.5rem 2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', cursor: 'pointer', textAlign: 'center', border: '1px solid rgba(14, 165, 233, 0.2)', background: 'linear-gradient(to bottom right, #ffffff, #f0f9ff)' }}
                    >
                        <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(14, 165, 233, 0.4)' }}>
                            <Map size={45} />
                        </div>
                        <div>
                            <h3 style={{ margin: '0 0 0.8rem 0', fontWeight: 950, color: '#0f172a', fontSize: '1.6rem', letterSpacing: '-0.5px' }}>Bed Map & Wards</h3>
                            <p style={{ margin: 0, color: '#475569', fontWeight: 500, lineHeight: 1.6, fontSize: '1rem' }}>See which beds are free, assign new patients, and handle patient discharge steps easily.</p>
                        </div>
                        <div style={{ marginTop: 'auto', padding: '1rem 2.5rem', background: '#0f172a', color: 'white', borderRadius: '14px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1rem', letterSpacing: '0.5px' }}>
                            Access Grid <ChevronRight size={20} />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02, y: -5, boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.25)' }}
                        onClick={() => window.location.href = '/nurse/vitals'}
                        className="glass-v3"
                        style={{ padding: '3.5rem 2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', cursor: 'pointer', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.2)', background: 'linear-gradient(to bottom right, #ffffff, #ecfdf5)' }}
                    >
                        <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)' }}>
                            <Activity size={45} />
                        </div>
                        <div>
                            <h3 style={{ margin: '0 0 0.8rem 0', fontWeight: 950, color: '#0f172a', fontSize: '1.6rem', letterSpacing: '-0.5px' }}>Patient Health Reading</h3>
                            <p style={{ margin: 0, color: '#475569', fontWeight: 500, lineHeight: 1.6, fontSize: '1rem' }}>Log heart rate, temperature, and nurse notes directly to the patient's medical record.</p>
                        </div>
                        <div style={{ marginTop: 'auto', padding: '1rem 2.5rem', background: '#0f172a', color: 'white', borderRadius: '14px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1rem', letterSpacing: '0.5px' }}>
                            Open Gateway <ChevronRight size={20} />
                        </div>
                    </motion.div>
                </section>

                {/* Nursing Alert Strip */}
                {emergencyAlerts.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-v3"
                        style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 20px 40px -10px rgba(239, 68, 68, 0.5)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                <div style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.15)', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>
                                    <AlertCircle size={32} color="white" />
                                </div>
                                <div>
                                    <h3 style={{ margin: '0 0 0.3rem 0', fontWeight: 950, fontSize: '1.4rem' }}>Urgent Admission Needed</h3>
                                    <p style={{ margin: 0, opacity: 0.9, fontSize: '1rem', fontWeight: 600 }}>
                                        {emergencyAlerts[0].patient_name} (Level {emergencyAlerts[0].triage_level}) waiting for a bed.
                                    </p>
                                </div>
                            </div>
                            <button className="btn-vitalize" style={{ background: 'white', color: '#ef4444', width: 'auto', padding: '1rem 2.5rem', fontWeight: 950, fontSize: '1rem' }}>
                                ACKNOWLEDGE & REVIEW
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="glass-v3" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem 2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                <div style={{ padding: '1.2rem', background: 'radial-gradient(circle at top right, #0ea5e9, #0284c7)', borderRadius: '20px', boxShadow: '0 10px 20px rgba(14, 165, 233, 0.3)' }}>
                                    <Shield size={28} color="white" />
                                </div>
                                <div>
                                    <h3 style={{ margin: '0 0 0.3rem 0', fontWeight: 950, fontSize: '1.2rem', letterSpacing: '0.5px' }}>All Monitors Normal</h3>
                                    <p style={{ margin: 0, opacity: 0.7, fontSize: '0.95rem', fontWeight: 500 }}>All beds are stable. No urgent alerts at this time.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default NurseDashboard;

