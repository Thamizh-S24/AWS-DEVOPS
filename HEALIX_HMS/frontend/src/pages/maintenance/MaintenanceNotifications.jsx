import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Bell, AlertTriangle, Zap, Flame, 
    ShieldAlert, Info, CheckCircle2, 
    Clock, Filter, Trash2, Settings, 
    ChevronRight, ExternalLink
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const AlertItem = ({ alert, onAcknowledge }) => {
    const typeConfig = {
        CRITICAL: { color: '#ef4444', bg: '#fef2f2', icon: <AlertTriangle size={20} /> },
        SYSTEM: { color: '#0ea5e9', bg: '#f0f9ff', icon: <Settings size={20} /> },
        SECURITY: { color: '#6366f1', bg: '#f5f3ff', icon: <ShieldAlert size={20} /> },
        ENVIRONMENT: { color: '#10b981', bg: '#f0fdf4', icon: <Zap size={20} /> }
    };

    const config = typeConfig[alert.type] || typeConfig.SYSTEM;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="stat-card-white"
            style={{ padding: '1.5rem 2rem', borderLeft: `6px solid ${config.color}`, display: 'flex', gap: '2rem', alignItems: 'center' }}
        >
            <div style={{ 
                padding: '1rem', borderRadius: '14px', 
                background: config.bg, color: config.color 
            }}>
                {config.icon}
            </div>
            
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.4rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>{alert.title}</h3>
                    <span style={{ fontSize: '0.7rem', fontWeight: 900, color: config.color, background: config.bg, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                        {alert.type}
                    </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>{alert.message}</p>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.8rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={14} /> {alert.time}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Info size={14} /> {alert.sector}
                    </span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                    onClick={() => onAcknowledge(alert.id)}
                    style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                >
                    Acknowledge
                </button>
                <button style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', background: config.color, color: 'white', border: 'none', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Dispatch <ChevronRight size={16} />
                </button>
            </div>
        </motion.div>
    );
};

const MaintenanceNotifications = () => {
    const [alerts, setAlerts] = useState([
        { id: 1, title: 'Medical Oxygen Pressure Low', message: 'Main supply tank shows pressure drop below 50 PSI in North Wing line.', type: 'CRITICAL', time: '14:20 PM', sector: 'Sector 4 - ICU' },
        { id: 2, title: 'Server Room Temp Alert', message: 'Core Data Center HVAC unit #2 reported outlet temp at 28°C.', type: 'SYSTEM', time: '13:45 PM', sector: 'IT Mainframe' },
        { id: 3, title: 'Unauthorized Vault Access', message: 'Biometric failure detected twice at High-Security Pharma vault.', type: 'SECURITY', time: '13:30 PM', sector: 'Pharmacy' },
        { id: 4, title: 'Filter Saturation Warning', message: 'HEPA filtration index reached 85% in Sterile Zone OT-1.', type: 'ENVIRONMENT', time: '12:10 PM', sector: 'Operating Theaters' },
    ]);

    const handleAcknowledge = (id) => {
        setAlerts(alerts.filter(a => a.id !== id));
    };

    return (
        <DashboardLayout role="maintenance">
            <div style={{ padding: '0 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.4rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>Incident Alert Center</h1>
                        <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 500 }}>
                            Real-time facility incidents and critical system alerts
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button style={{ padding: '0.8rem 1.5rem', borderRadius: '14px', background: 'white', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <Bell size={18} /> Notification Settings
                        </button>
                        <button style={{ padding: '0.8rem 1.5rem', borderRadius: '14px', background: '#0f172a', color: 'white', border: 'none', fontWeight: 800, fontSize: '0.85rem' }}>
                            View Archive
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3.5rem' }}>
                    
                    {/* Active Feed */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '4rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Active Incidents</h2>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                                LIVE FEED ACTIVE
                            </div>
                        </div>

                        <AnimatePresence>
                            {alerts.length === 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    style={{ textAlign: 'center', padding: '10rem', background: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0' }}
                                >
                                    <CheckCircle2 size={64} color="#10b981" style={{ marginBottom: '1.5rem', margin: '0 auto' }} />
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>All Clear!</h3>
                                    <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 500 }}>No urgent incidents require immediate attention.</p>
                                </motion.div>
                            ) : (
                                alerts.map(a => <AlertItem key={a.id} alert={a} onAcknowledge={handleAcknowledge} />)
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Rail: Ops Integrity */}
                    <aside style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <div className="stat-card-white" style={{ background: '#0f172a', color: 'white', border: 'none' }}>
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.1rem' }}>Sector Integrity</h3>
                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', opacity: 0.6 }}>Facility health composite index</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.6rem' }}>
                                        <span>NORTH WING (Clinical)</span>
                                        <span style={{ color: '#ef4444' }}>84%</span>
                                    </div>
                                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                                        <div style={{ width: '84%', height: '100%', background: '#ef4444' }} />
                                    </div>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.6rem' }}>
                                        <span>SOUTH WING (Ops)</span>
                                        <span style={{ color: '#10b981' }}>99%</span>
                                    </div>
                                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                                        <div style={{ width: '99%', height: '100%', background: '#10b981' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card-white">
                            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', marginBottom: '2rem' }}>Quick Dispatch</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <button style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', fontWeight: 800, fontSize: '0.8rem', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    Assign Porter Team <ExternalLink size={14} />
                                </button>
                                <button style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', fontWeight: 800, fontSize: '0.8rem', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    Dispatch Housekeeping <ExternalLink size={14} />
                                </button>
                                <button style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', fontWeight: 800, fontSize: '0.8rem', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    Summon HVAC Tech <ExternalLink size={14} />
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MaintenanceNotifications;
