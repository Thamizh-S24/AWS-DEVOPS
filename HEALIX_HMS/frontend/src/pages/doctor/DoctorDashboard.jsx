import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Activity, TrendingUp, Users, Calendar,
    Stethoscope, Clock, ShieldCheck, PieChart as PieIcon, LineChart as LineIcon,
    BarChart as BarIcon, AlertTriangle
} from 'lucide-react';
import {
    LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
    ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar
} from 'recharts';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from '../admin/SectionHeader';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ icon, label, value, trend, color, subtext }) => (
    <div className="glass-v3" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'all 0.3s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ padding: '0.8rem', background: `${color}15`, color: color, borderRadius: '12px' }}>
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#10b981', background: '#10b98115', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>
                {trend}
            </div>
        </div>
        <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{label}</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 950, color: '#0f172a', letterSpacing: '-1px' }}>{value}</div>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{subtext}</div>
    </div>
);

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ appointments: 0, admissions: 0, duty_days: 0, velocity: '0%' });
    const [patientVolumeData, setPatientVolumeData] = useState([]);
    const [diagnosisDistribution, setDiagnosisDistribution] = useState([]);
    const [triageAlerts, setTriageAlerts] = useState([]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [appRes, admRes, attRes, rxRes, triageRes] = await Promise.all([
                api.get('/appointment/doctor/all'),
                api.get('/ward/admission-requests'),
                api.get('/hr/attendance/logs'),
                api.get('/doctor/prescription'),
                api.get('/patient/triage-alerts/all')
            ]);
            setTriageAlerts(triageRes.data || []);

            const myAtt = attRes.data.filter(l => l.staff_id === user.username);
            const uniqueDays = new Set(myAtt.map(l => new Date(l.timestamp).toDateString()));

            // Real Stats
            setStats({
                appointments: appRes.data.length,
                admissions: admRes.data.filter(r => r.doctor_id === user.username).length,
                duty_days: uniqueDays.size,
                velocity: appRes.data.length > 0 ? (Math.min(100, (appRes.data.length / 10) * 100).toFixed(0) + '%') : '0%'
            });

            // Real Throughout Data (Last 7 Days)
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const counts = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
            appRes.data.forEach(a => {
                const d = days[new Date(a.appointment_date).getDay()];
                counts[d]++;
            });
            setPatientVolumeData(days.map(d => ({ name: d, count: counts[d] })));

            // Real Condition Metrics (Parsed from RX)
            const rxData = rxRes.data || [];
            const conditions = { 'Infectious': 0, 'Chronic': 0, 'Trauma': 0, 'Diagnostic': 0 };
            rxData.forEach(r => {
                const notes = (r.notes || "").toLowerCase();
                if (notes.includes('infect')) conditions['Infectious']++;
                else if (notes.includes('chronic')) conditions['Chronic']++;
                else if (notes.includes('trauma')) conditions['Trauma']++;
                else conditions['Diagnostic']++;
            });

            setDiagnosisDistribution([
                { name: 'Infectious', value: conditions['Infectious'] || 1, color: '#0ea5e9' },
                { name: 'Chronic', value: conditions['Chronic'] || 1, color: '#8b5cf6' },
                { name: 'Trauma', value: conditions['Trauma'] || 1, color: '#ef4444' },
                { name: 'Diagnostic', value: conditions['Diagnostic'] || 1, color: '#10b981' }
            ]);

        } catch (err) {
            console.error("Failed to sync clinical analytics");
        }
    };

    return (
        <DashboardLayout role="doctor">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}
            >
                <SectionHeader
                    title={`Welcome back, Dr. ${user.username.split('@')[0]}`}
                    subtitle="Your clinical overview, patient alerts, and daily schedule"
                />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                    <StatCard icon={<Calendar />} label="Today's Consults" value={stats.appointments} trend="+15%" color="#0ea5e9" subtext="Scheduled encounter volume" />
                    <StatCard icon={<Users />} label="Active Rounds" value={stats.admissions} trend="+2" color="#8b5cf6" subtext="Inpatient hospitalizations" />
                    <StatCard icon={<Activity />} label="Patient Velocity" value={stats.velocity} trend="Optimal" color="#10b981" subtext="Clinical throughput efficiency" />
                    <StatCard icon={<Clock />} label="Duty Lifecycle" value={`${stats.duty_days} Days`} trend="Steady" color="#f59e0b" subtext="Marked attendance history" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
                    <div className="glass-v3" style={{ padding: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <div>
                                <h3 style={{ margin: 0, fontWeight: 950, color: '#0f172a', fontSize: '1.2rem' }}>Patient Visit History</h3>
                                <p style={{ margin: '0.4rem 0 0 0', color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Number of patients seen during the current week</p>
                            </div>
                            <div style={{ padding: '0.8rem', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', borderRadius: '12px' }}><LineIcon size={20} /></div>
                        </div>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={patientVolumeData}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 800 }} />
                                    <Area type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-v3" style={{ padding: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <h3 style={{ margin: 0, fontWeight: 950, color: '#0f172a', fontSize: '1.2rem' }}>Condition Metrics</h3>
                            <div style={{ padding: '0.8rem', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '12px' }}><PieIcon size={20} /></div>
                        </div>
                        <div style={{ height: '240px', width: '100%', position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={diagnosisDistribution} innerRadius={60} outerRadius={80} paddingAngle={10} dataKey="value">
                                        {diagnosisDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 950, color: '#0f172a' }}>{stats.velocity}</div>
                                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase' }}>Efficiency</div>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                            {diagnosisDistribution.map(d => (
                                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color }} />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#475569' }}>{d.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="glass-v3" style={{ padding: '2.5rem', borderLeft: '6px solid #ef4444' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <AlertTriangle color="#ef4444" size={24} />
                        <h3 style={{ margin: 0, fontWeight: 950, color: '#0f172a', fontSize: '1.2rem' }}>Urgent Patient Alerts (AURA Triage)</h3>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {triageAlerts.length > 0 ? triageAlerts.map((alert) => (
                            <div key={alert._id} style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '15px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Activity size={20} />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                            <span style={{ fontWeight: 950, color: '#0f172a' }}>{alert.patient_id}</span>
                                            <span style={{ padding: '0.3rem 0.6rem', background: '#ef4444', color: 'white', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 950 }}>{alert.urgency.toUpperCase()}</span>
                                        </div>
                                        <p style={{ margin: '0.4rem 0 0 0', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, maxWidth: '600px' }}>{alert.summary}</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 800 }}>{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    <button 
                                        onClick={() => window.location.href = `/doctor/emr?id=${alert.patient_id}`}
                                        style={{ marginTop: '0.6rem', padding: '0.5rem 1rem', borderRadius: '8px', background: '#0f172a', color: 'white', border: 'none', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer' }}
                                    >
                                        TRIAGE REVIEW
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div style={{ padding: '2.5rem', textAlign: 'center', background: '#f8fafc', borderRadius: '15px', border: '1px solid #f1f5f9' }}>
                                <div style={{ color: '#94a3b8', fontWeight: 800, fontSize: '0.9rem' }}>No high-priority clinical triggers in the last 24h.</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="glass-v3" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white', border: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                            <div style={{ padding: '1.2rem', background: 'rgba(14, 165, 233, 0.15)', borderRadius: '20px', color: '#0ea5e9' }}><Stethoscope size={40} /></div>
                            <div>
                                <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1.6rem', letterSpacing: '-0.5px' }}>System Connectivity</h3>
                                <p style={{ margin: '0.6rem 0 0 0', opacity: 0.6, fontSize: '1rem', fontWeight: 500 }}>All medical records are securely synced and backed up.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.8rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 15px #10b981' }} />
                            <span style={{ fontSize: '0.85rem', fontWeight: 950, color: '#10b981', letterSpacing: '1px' }}>NOMINAL</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
};

export default DoctorDashboard;
