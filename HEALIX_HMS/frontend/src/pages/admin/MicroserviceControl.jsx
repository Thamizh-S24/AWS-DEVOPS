import React, { useState, useEffect } from 'react';
import { Server, Activity, Shield, RefreshCw, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from './SectionHeader';
import api from '../../services/api';

const MicroserviceControl = () => {
    const [nodes, setNodes] = useState([
        { id: 'auth', name: 'Login Service', port: 8001, status: 'Online', uptime: '99.95%', load: '8%', latency: '12ms' },
        { id: 'patient', name: 'Patient Records', port: 8002, status: 'Online', uptime: '99.90%', load: '15%', latency: '18ms' },
        { id: 'doctor', name: 'Doctor Portal', port: 8003, status: 'Online', uptime: '99.98%', load: '5%', latency: '10ms' },
        { id: 'appointment', name: 'Appointment System', port: 8004, status: 'Online', uptime: '99.85%', load: '22%', latency: '25ms' },
        { id: 'billing', name: 'Billing & Payments', port: 8005, status: 'Online', uptime: '99.99%', load: '4%', latency: '8ms' },
        { id: 'pharmacy', name: 'Medicine Stock', port: 8006, status: 'Online', uptime: '99.92%', load: '10%', latency: '15ms' },
        { id: 'lab', name: 'Lab Tests', port: 8007, status: 'Online', uptime: '98.50%', load: '12%', latency: '20ms' },
        { id: 'ward', name: 'Ward Manager', port: 8008, status: 'Online', uptime: '99.99%', load: '12%', latency: '14ms' },
        { id: 'emergency', name: 'Emergency Center', port: 8009, status: 'Online', uptime: '100%', load: '2%', latency: '9ms' },
        { id: 'hr', name: 'Staff Manager', port: 8011, status: 'Online', uptime: '99.99%', load: '3%', latency: '11ms' },
        { id: 'analytics', name: 'Data Reports', port: 8015, status: 'Online', uptime: '99.50%', load: '40%', latency: '35ms' },
    ]);

    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const interval = setInterval(checkHealth, 10000);
        return () => clearInterval(interval);
    }, []);

    const checkHealth = async () => {
        setIsSyncing(true);
        // Simulate real health check delay
        setTimeout(() => {
            setNodes(prev => prev.map(n => ({
                ...n,
                latency: `${Math.floor(Math.random() * 30) + 5}ms`,
                load: `${Math.floor(Math.random() * 20) + 5}%`
            })));
            setIsSyncing(false);
        }, 800);
    };

    return (
        <DashboardLayout role="admin">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <SectionHeader
                    title="System Settings"
                    subtitle="Check and manage hospital server connections"
                    action={
                        <button
                            onClick={checkHealth}
                            disabled={isSyncing}
                            className="btn-vitalize"
                            style={{ width: 'auto', padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
                            {isSyncing ? 'Checking...' : 'Refresh Status'}
                        </button>
                    }
                />

                <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                    {nodes.map(node => (
                        <div key={node.id} className="stat-card-white" style={{ position: 'relative', borderLeft: '6px solid #10b981', background: 'white', transition: 'transform 0.3s ease', cursor: 'default' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                    <div style={{ padding: '0.8rem', borderRadius: '14px', background: 'rgba(100, 116, 139, 0.05)', color: '#64748b', border: '1px solid rgba(14, 165, 233, 0.08)' }}>
                                        <Server size={22} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 950, color: '#0f172a', fontSize: '1rem', letterSpacing: '-0.3px' }}>{node.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, marginTop: '0.1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>NODE: {node.id} <span style={{ opacity: 0.3 }}>•</span> P: {node.port}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.08)', padding: '0.4rem 0.8rem', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 950, letterSpacing: '0.5px' }}>
                                    <ShieldCheck size={12} /> ONLINE
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>SPEED</div>
                                    <div style={{ fontWeight: 950, color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.1rem' }}>
                                        <Activity size={14} /> {node.latency}
                                    </div>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>USAGE</div>
                                    <div style={{ fontWeight: 950, color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.1rem' }}>
                                        <Activity size={14} /> {node.load}
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <button style={{ padding: '0.7rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.06)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.1)', fontWeight: 900, fontSize: '0.7rem', cursor: 'pointer', transition: 'all 0.2s ease' }}>STOP</button>
                                <button style={{ padding: '0.7rem', borderRadius: '12px', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', fontWeight: 900, fontSize: '0.7rem', cursor: 'pointer', transition: 'all 0.2s ease' }}>RESTART</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="stat-card-white" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white', border: 'none', padding: '2.5rem', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                                <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1.5rem', letterSpacing: '-0.5px' }}>Hospital System Active</h3>
                            </div>
                            <p style={{ margin: 0, opacity: 0.6, fontSize: '1rem', fontWeight: 500, maxWidth: '600px' }}>Server is running correctly. All features are working as expected.</p>
                        </div>
                        <div className="mobile-full-width" style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn-vitalize" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', width: '100%', padding: '1rem 2rem', fontWeight: 950, fontSize: '0.9rem' }}>EMERGENCY STOP ALL</button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MicroserviceControl;

