import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Activity, ClipboardList, FileText, Upload, CheckCircle,
    Monitor, Shield, ExternalLink, Camera, Zap,
    ChevronRight, Microscope, Database, Beaker
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

const StatCard = ({ icon, label, value, trend, color, subtext }) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="glass-v3"
        style={{
            padding: '2rem',
            background: 'white',
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.8rem', borderRadius: '16px', background: `${color}10`, color: color }}>
                {icon}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', background: '#dcfce7', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                {trend || 'Active'}
            </div>
        </div>
        <div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '0.4rem' }}>{label}</p>
            <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{value}</h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>{subtext}</p>
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

const RadiologyDashboard = () => {
    const [stats, setStats] = useState({ total_scans: 0, completed_scans: 0, utilization_rate: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/radiology/stats');
            setStats(res.data || { total_scans: 0, completed_scans: 0, utilization_rate: 0 });
            setLoading(false);
        } catch (err) {
            console.error("Clinical telemetry failure");
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="radiologist">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <SectionHeader
                    title="Radiology Dashboard"
                    subtitle="Manage X-rays, scans, and patient images"
                />

                {/* Metrics Overlay */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                    <StatCard
                        icon={<Activity />}
                        label="Pending Scans"
                        value={stats.total_scans - stats.completed_scans}
                        trend="Live"
                        color="#3b82f6"
                        subtext="Patients waiting for scans"
                    />
                    <StatCard
                        icon={<Camera />}
                        label="Machine Usage"
                        value={`${stats.utilization_rate}%`}
                        trend="Normal"
                        color="#10b981"
                        subtext="How busy the machines are"
                    />
                    <StatCard
                        icon={<Monitor />}
                        label="Saved Scans"
                        value={stats.completed_scans}
                        trend="Safe"
                        color="#8b5cf6"
                        subtext="Total scans completed"
                    />
                    <StatCard
                        icon={<Shield />}
                        label="Radiation Safety"
                        value="Level 1"
                        trend="Safe"
                        color="#f59e0b"
                        subtext="Monitoring safe limits"
                    />
                </div>

                {/* Operations Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2.5rem' }}>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass-v3"
                        style={{ padding: '2.5rem', background: 'white', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                    >
                        <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', width: 'fit-content' }}>
                            <ClipboardList size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 950 }}>List of Scans</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 500 }}>Manage and prioritize scheduled X-rays and scans for patients.</p>
                        </div>
                        <Link to="/radiology/worklist" className="btn-vitalize" style={{ width: 'fit-content', textDecoration: 'none', background: '#3b82f6' }}>
                            OPEN WORKLIST <ChevronRight size={16} />
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass-v3"
                        style={{ padding: '2.5rem', background: 'white', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                    >
                        <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', width: 'fit-content' }}>
                            <Monitor size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 950 }}>Start Scan</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 500 }}>Control machines and take patient images for their records.</p>
                        </div>
                        <Link to="/radiology/terminal" className="btn-vitalize" style={{ width: 'fit-content', textDecoration: 'none', background: '#8b5cf6' }}>
                            LAUNCH TERMINAL <ChevronRight size={16} />
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass-v3"
                        style={{ padding: '2.5rem', background: 'white', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                    >
                        <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: 'fit-content' }}>
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 950 }}>Enter Results</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 500 }}>Type in scan findings and send the results to doctors.</p>
                        </div>
                        <Link to="/radiology/archive" className="btn-vitalize" style={{ width: 'fit-content', textDecoration: 'none', background: '#10b981' }}>
                            ACCESS ARCHIVE <ChevronRight size={16} />
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass-v3"
                        style={{ padding: '2.5rem', background: 'white', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                    >
                        <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', width: 'fit-content' }}>
                            <Database size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 950 }}>Supplies</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 500 }}>Manage medical supplies and check the scanning machines.</p>
                        </div>
                        <Link to="/radiology/inventory" className="btn-vitalize" style={{ width: 'fit-content', textDecoration: 'none', background: '#f59e0b' }}>
                            MANAGE REGISTRY <ChevronRight size={16} />
                        </Link>
                    </motion.div>
                </div>

                {/* Connection Status */}
                <div className="glass-v3" style={{ background: '#0f172a', padding: '1.5rem 2.5rem', color: 'white', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <Zap size={24} color="#f59e0b" />
                            <div>
                                <p style={{ margin: 0, fontWeight: 900, fontSize: '0.9rem' }}>SYSTEM CONNECTED</p>
                                <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.6 }}>Image syncing is active. All scan data is securely saved.</p>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981' }}>LATENCY: 4ms</div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default RadiologyDashboard;
