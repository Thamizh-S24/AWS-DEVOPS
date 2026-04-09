import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    LayoutDashboard, ClipboardList, Users, 
    Beaker, Database, Activity, 
    Shield, Bell, UserCircle,
    Zap, Wind, AlertTriangle, CheckCircle2,
    ArrowUpRight, TrendingUp, Monitor
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

const ModuleTile = ({ icon, label, description, to, color, stats }) => (
    <Link to={to} style={{ textDecoration: 'none' }}>
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className="stat-card-white"
            style={{ 
                height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem',
                borderBottom: `4px solid ${color}40`, padding: '2.5rem'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ padding: '1rem', borderRadius: '18px', background: `${color}10`, color: color }}>
                    {icon}
                </div>
                {stats && (
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Current</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 950, color: '#0f172a' }}>{stats}</div>
                    </div>
                )}
            </div>
            <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 950, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {label} <ArrowUpRight size={16} color="#94a3b8" />
                </h3>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 500, lineHeight: 1.5 }}>
                    {description}
                </p>
            </div>
        </motion.div>
    </Link>
);

const MaintenanceDashboard = () => {
    const [opsStats, setOpsStats] = useState({
        tickets: 4,
        staff: 12,
        health: '98.4%',
        incidents: 1
    });

    return (
        <DashboardLayout role="maintenance">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: '2.8rem', fontWeight: 950, color: '#0f172a', margin: 0, letterSpacing: '-1px' }}>Maintenance Dashboard</h1>
                        <p style={{ color: '#64748b', fontSize: '1.2rem', marginTop: '0.6rem', fontWeight: 500 }}>
                            Track equipment, repairs, and safety checks for the hospital
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>System Status</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 950, color: '#10b981' }}>{opsStats.health} <span style={{ fontSize: '0.9rem' }}>Ready</span></div>
                        </div>
                    </div>
                </div>

                {/* Critical KPIs Strip */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                    <div className="stat-card-white" style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', background: '#0f172a', color: 'white', border: 'none' }}>
                        <Zap size={24} color="#0ea5e9" />
                        <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6 }}>ELECTRICITY</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>STABLE (1.2MW)</div>
                        </div>
                    </div>
                    <div className="stat-card-white" style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                        <Activity size={24} color="#10b981" />
                        <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8' }}>MEDICAL GAS</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>OKAY (52 PSI)</div>
                        </div>
                    </div>
                    <div className="stat-card-white" style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                        <Wind size={24} color="#f59e0b" />
                        <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8' }}>HVAC STATUS</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>88% CAPACITY</div>
                        </div>
                    </div>
                    <div className="stat-card-white" style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', borderLeft: '4px solid #ef4444' }}>
                        <Bell size={24} color="#ef4444" />
                        <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8' }}>ACTIVE ISSUES</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ef4444' }}>{opsStats.incidents} ALERTS</div>
                        </div>
                    </div>
                </div>

                {/* Operations Grid */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Operational Modules</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 700 }}>
                            <Monitor size={16} /> Real-time Sync Active
                        </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2.5rem' }}>
                        <ModuleTile 
                            icon={<ClipboardList size={24} />} 
                            label="Repairs & Tasks" 
                            description="Fixes, staff moves, and cleaning tasks"
                            to="/maintenance/tickets"
                            color="#0ea5e9"
                            stats={`${opsStats.tickets} Jobs`}
                        />
                        <ModuleTile 
                            icon={<Users size={24} />} 
                            label="Staff Management" 
                            description="Technicians and cleaners"
                            to="/maintenance/staff"
                            color="#6366f1"
                            stats={`${opsStats.staff} Staff`}
                        />
                        <ModuleTile 
                            icon={<Beaker size={24} />} 
                            label="Medical Tools" 
                            description="Checking and fixing medical equipment"
                            to="/maintenance/biomed"
                            color="#a855f7"
                            stats="99% Ready"
                        />
                        <ModuleTile 
                            icon={<Database size={24} />} 
                            label="Building & Parts" 
                            description="List of hospital equipment and buildings"
                            to="/maintenance/assets"
                            color="#ec4899"
                            stats="12 Nodes"
                        />
                        <ModuleTile 
                            icon={<Activity size={24} />} 
                            label="Cleaning & AC" 
                            description="Checking air quality and room cleaning"
                            to="/maintenance/facility"
                            color="#06b6d4"
                            stats="Clean"
                        />
                        <ModuleTile 
                            icon={<Shield size={24} />} 
                            label="Safety & Fire" 
                            description="Cameras and fire safety systems"
                            to="/maintenance/safety"
                            color="#f43f5e"
                            stats="Secure"
                        />
                        <ModuleTile 
                            icon={<Bell size={24} />} 
                            label="Urgent Alerts" 
                            description="List of urgent issues to fix"
                            to="/maintenance/notifications"
                            color="#ef4444"
                            stats="1 Alert"
                        />
                        <ModuleTile 
                            icon={<UserCircle size={24} />} 
                            label="My Schedule" 
                            description="My jobs and work hours"
                            to="/maintenance/profile"
                            color="#64748b"
                            stats="Active"
                        />
                    </div>
                </div>

                {/* System Activity Strip */}
                <div className="stat-card-white" style={{ background: '#f8fafc', padding: '2rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px dashed #cbd5e1' }}>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <TrendingUp size={32} color="#0ea5e9" />
                        <div>
                            <h4 style={{ margin: 0, fontWeight: 900, color: '#0f172a' }}>System Load Check</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>All hospital systems are running normally today.</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                        {[...Array(8)].map((_, i) => (
                            <div key={i} style={{ width: '12px', height: `${20 + Math.random() * 40}px`, background: '#e2e8f0', borderRadius: '4px' }} />
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MaintenanceDashboard;


