import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FlaskConical, Clipboard, FileText, Upload, CheckCircle,
    Clock, TrendingUp, Shield, Beaker, Zap,
    Microscope, ChevronRight, AlertTriangle, Loader2,
    Database, Activity, Search
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

const LabTechDashboard = () => {
    const [tests, setTests] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [testRes, invRes] = await Promise.all([
                api.get('/lab/requests'),
                api.get('/lab/inventory')
            ]);
            setTests(Array.isArray(testRes.data) ? testRes.data : []);
            setInventory(Array.isArray(invRes.data) ? invRes.data : []);
            setLoading(false);
        } catch (err) {
            console.error("Clinical sync failure");
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="lab_tech">
            <div id="diagnostic-lab-hub" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <SectionHeader
                    title="Lab Dashboard"
                    subtitle="Manage lab tests, results, and supplies"
                />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' }}>
                    <StatCard
                        icon={<FlaskConical />}
                        label="Tests to be Done"
                        value={(tests || []).filter(t => t?.status !== 'Completed').length}
                        trend="Live List"
                        color="#8b5cf6"
                        subtext="Patient tests in progress"
                    />
                    <StatCard
                        icon={<Beaker />}
                        label="Low Lab Supplies"
                        value={(inventory || []).filter(i => (i?.stock || 0) < 10).length}
                        trend={(inventory || []).filter(i => (i?.stock || 0) < 10).length > 0 ? "Alert" : "Okay"}
                        color={(inventory || []).filter(i => (i?.stock || 0) < 10).length > 0 ? "#ef4444" : "#10b981"}
                        subtext="Supply check"
                    />
                    <StatCard
                        icon={<Zap />}
                        label="Tests Completed Today"
                        value="98%"
                        trend="Steady"
                        color="#0ea5e9"
                        subtext="Daily progress"
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2.5rem' }}>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass-v3"
                        style={{ padding: '2.5rem', background: 'white', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid #e2e8f0' }}
                    >
                        <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', width: 'fit-content' }}>
                            <Clipboard size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 950 }}>Incoming Lab Tests</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 500 }}>View and sort test requests from doctors across the hospital.</p>
                        </div>
                        <Link to="/lab/queue" className="btn-vitalize" style={{ width: 'fit-content', textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center' }}>
                            OPEN QUEUE <ChevronRight size={16} />
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass-v3"
                        style={{ padding: '2.5rem', background: 'white', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid #e2e8f0' }}
                    >
                        <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', width: 'fit-content' }}>
                            <Microscope size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 950 }}>Process Lab Samples</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 500 }}>Open the lab terminal to start analyzing patient samples.</p>
                        </div>
                        <Link to="/lab/terminal" className="btn-vitalize" style={{ width: 'fit-content', textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center' }}>
                            INITIATE ANALYSIS <ChevronRight size={16} />
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass-v3"
                        style={{ padding: '2.5rem', background: 'white', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid #e2e8f0' }}
                    >
                        <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: 'fit-content' }}>
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 950 }}>Enter Lab Results</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 500 }}>Type in lab findings and send the results to doctors.</p>
                        </div>
                        <Link to="/lab/reports" className="btn-vitalize" style={{ width: 'fit-content', textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center' }}>
                            AUTHORIZE REPORTS <ChevronRight size={16} />
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass-v3"
                        style={{ padding: '2.5rem', background: 'white', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid #e2e8f0' }}
                    >
                        <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', width: 'fit-content' }}>
                            <Database size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 950 }}>Lab Supplies</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 500 }}>Check and manage lab chemicals, tools, and inventory.</p>
                        </div>
                        <Link to="/lab/inventory" className="btn-vitalize" style={{ width: 'fit-content', textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center' }}>
                            MANAGE STOCK <ChevronRight size={16} />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default LabTechDashboard;
