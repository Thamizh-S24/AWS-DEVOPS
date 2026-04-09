import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Shield, ShieldAlert, Camera, Lock, 
    Bell, Flame, AlertCircle, CheckCircle2,
    Eye, MoreVertical, MapPin, Activity,
    Zap, Wifi, Info, RotateCcw
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const CameraFeed = ({ name, status, location }) => (
    <div className="stat-card-white" style={{ padding: '1rem', background: '#0f172a', border: 'none', color: 'white' }}>
        <div style={{ position: 'relative', aspectRatio: '16/9', background: '#1e293b', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', fontSize: '0.65rem', fontWeight: 800 }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: status === 'Live' ? '#ef4444' : '#94a3b8' }} />
                {status.toUpperCase()}
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.1 }}>
                <Camera size={48} />
            </div>
            {/* Visual scanline effect */}
            <motion.div 
                animate={{ top: ['0%', '100%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.05)', zIndex: 1 }}
            />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{name}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{location}</div>
            </div>
            <button style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none' }}>
                <Eye size={16} />
            </button>
        </div>
    </div>
);

const MaintenanceSafety = () => {
    const [feeds] = useState([
        { name: 'Main Lobby Entrance', location: 'Ground Floor', status: 'Live' },
        { name: 'ICU Corridor A', location: 'Level 3', status: 'Live' },
        { name: 'Pharmacy Depot', location: 'Level 1', status: 'Standby' },
        { name: 'ER Emergency Bay', location: 'Ground Floor', status: 'Live' },
    ]);

    return (
        <DashboardLayout role="maintenance">
            <div style={{ padding: '0 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.4rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>Security & Fire Hub</h1>
                        <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 500 }}>
                            Facility safety monitoring and surveillance command
                        </p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '3.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        
                        {/* Surveillance Grid */}
                        <section>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>Surveillance Grid</h2>
                                <button style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 800, fontSize: '0.75rem' }}>View Map View</button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                {feeds.map((f, i) => <CameraFeed key={i} {...f} />)}
                            </div>
                        </section>

                        {/* Fire Safety Hub */}
                        <section className="stat-card-white" style={{ background: '#fef2f2', border: '1px solid #fee2e2' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ padding: '0.8rem', borderRadius: '14px', background: '#ef4444', color: 'white' }}>
                                        <Flame size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontWeight: 950, color: '#991b1b' }}>Fire Safety Systems</h3>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#b91c1c', fontWeight: 600 }}>114 Active Sensors | Next Test: 48h</p>
                                    </div>
                                </div>
                                <button style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', background: 'rgba(153, 27, 27, 0.05)', border: '1px solid #f87171', color: '#991b1b', fontWeight: 800, fontSize: '0.75rem' }}>Full Diagnosis</button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                <div style={{ background: 'white', padding: '1.2rem', borderRadius: '14px', border: '1px solid #fee2e2' }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Suppressors</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 950, color: '#0f172a', marginTop: '0.4rem' }}>Pressure OK</div>
                                </div>
                                <div style={{ background: 'white', padding: '1.2rem', borderRadius: '14px', border: '1px solid #fee2e2' }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Gas Leak Detectors</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 950, color: '#0f172a', marginTop: '0.4rem' }}>0 Detected</div>
                                </div>
                                <div style={{ background: 'white', padding: '1.2rem', borderRadius: '14px', border: '1px solid #fee2e2' }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Network Link</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 950, color: '#10b981', marginTop: '0.4rem' }}>Secure</div>
                                </div>
                            </div>
                        </section>

                    </div>

                    <aside style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        {/* Access Control Logs */}
                        <div className="stat-card-white">
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <Lock size={20} color="#6366f1" /> Access Control Log
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 850 }}>Entry Authorized</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>HOD-Radiology | Sector 4B</div>
                                    </div>
                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>14:22</span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 850, color: '#ef4444' }}>Invalid Badge</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Pharma Vault-02 | Ground</div>
                                    </div>
                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>13:50</span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 850 }}>Manual Unlock</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Loading Dock 1 | Service</div>
                                    </div>
                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>13:10</span>
                                </div>
                            </div>
                            <button style={{ width: '100%', marginTop: '2.5rem', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>
                                Full Access Audit
                            </button>
                        </div>

                        {/* Emergency Protocols */}
                        <div className="stat-card-white" style={{ background: '#0f172a', color: 'white', border: 'none' }}>
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.1rem' }}>Emergency Protocols</h3>
                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', opacity: 0.6 }}>Incident Response Command</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <button style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', fontWeight: 900, fontSize: '0.85rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <ShieldAlert size={20} /> INITIATE LOCKDOWN
                                </button>
                                <button style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 800, fontSize: '0.8rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <Bell size={18} /> Public Broadcast
                                </button>
                                <button style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 800, fontSize: '0.8rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <RotateCcw size={18} /> Evacuation Plan
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MaintenanceSafety;
