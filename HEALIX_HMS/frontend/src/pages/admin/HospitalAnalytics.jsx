import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, PieChart, Users, IndianRupee, Calendar, History } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader, { StatCard } from './SectionHeader';
import api from '../../services/api';

const HospitalAnalytics = ({ searchTerm }) => {
    const [stats, setStats] = useState({
        revenue: 0,
        admission_velocity: 0,
        patient_satisfaction: 0,
        avg_stay: 0,
        efficiency_score: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/analytics/overview');
            setStats(res.data);
        } catch (err) { console.error("Analytics fetch failed"); }
    };

    return (
        <DashboardLayout role="admin">
            <SectionHeader title="Hospital Reports" subtitle="View hospital performance and growth metrics" />

            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '3.5rem' }}>
                <StatCard icon={<IndianRupee />} label="Total Earnings (Monthly)" value={`₹${(stats.revenue / 1000).toFixed(1)}K`} trend="+8.5%" color="#0ea5e9" subtext="Calculated from billing" />
                <StatCard icon={<TrendingUp />} label="Patient Growth" value={`${stats.admission_velocity > 0 ? '+' : ''}${stats.admission_velocity}%`} trend="Up" color="#8b5cf6" subtext="Live patient tracking" />
                <StatCard icon={<Users />} label="Happy Patients" value={`${stats.patient_satisfaction}/5`} trend="Great" color="#10b981" subtext="Overall satisfaction score" />
                <StatCard icon={<Calendar />} label="Avg Stay Time" value={`${stats.avg_stay} Days`} trend="Good" color="#f59e0b" subtext="Average time patients stay" />
            </div>

            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
                <div className="stat-card-white mobile-auto-height" style={{ height: '400px', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(14, 165, 233, 0.1)', background: 'linear-gradient(135deg, white, #f8fafc)' }}>
                    <div style={{ textAlign: 'center', padding: '2rem', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(14, 165, 233, 0.1), transparent 70%)', zIndex: 0 }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <PieChart size={64} color="#0ea5e9" style={{ opacity: 0.8 }} />
                            <div style={{ marginTop: '1.5rem', fontWeight: 950, color: '#0f172a', fontSize: '1.2rem', letterSpacing: '-0.5px' }}>Hospital Data Engine</div>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '300px', marginTop: '0.5rem' }}>Showing real-time data from all hospital services and payments.</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="stat-card-white">
                        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <History size={20} color="#64748b" />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0 }}>Performance Stats</h3>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#10b981' }}>{stats.efficiency_score} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ 100</span></div>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1rem' }}>Score based on speed, accuracy, and how well we use our resources.</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default HospitalAnalytics;
