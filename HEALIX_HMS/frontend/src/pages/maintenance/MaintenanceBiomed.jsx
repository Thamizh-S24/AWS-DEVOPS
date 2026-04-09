import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
     Zap, Activity, ShieldCheck, Clock,
     AlertTriangle, CheckCircle2, Sliders,
     Database, Thermometer, Droplets, Gauge,
     Settings, FileText, ChevronRight, PenTool
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

const DeviceCard = ({ device }) => {
    const healthColor = device.health > 90 ? '#10b981' : device.health > 70 ? '#f59e0b' : '#ef4444';
    
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="stat-card-white"
            style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ 
                    padding: '0.8rem', borderRadius: '16px', 
                    background: `${healthColor}10`, color: healthColor
                }}>
                    <Activity size={24} />
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Health Index</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 950, color: healthColor }}>{device.health}%</div>
                </div>
            </div>

            <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>{device.name}</h3>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>ID: {device.serial} | Sector: {device.sector}</p>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700 }}>
                    <span style={{ color: '#64748b' }}>Last Calibration</span>
                    <span style={{ color: '#0f172a' }}>{device.lastCal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700 }}>
                    <span style={{ color: '#64748b' }}>Next Due</span>
                    <span style={{ color: device.daysRemaining < 7 ? '#ef4444' : '#0f172a' }}>
                        {device.nextCal} ({device.daysRemaining}d)
                    </span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', background: 'white', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>
                    View Logs
                </button>
                <button style={{ flex: 1.5, padding: '0.8rem', borderRadius: '12px', background: '#0ea5e9', border: 'none', color: 'white', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Sliders size={16} /> Calibrate
                </button>
            </div>
        </motion.div>
    );
};

const MaintenanceBiomed = () => {
    const [devices] = useState([
        { id: 1, name: 'Advanced Ventilator V9', serial: 'SN-V9-801', sector: 'ICU-A', health: 98, lastCal: '2026-03-01', nextCal: '2026-06-01', daysRemaining: 74 },
        { id: 2, name: 'Precision MRI Gen-X', serial: 'SN-MRI-44', sector: 'Radiology', health: 84, lastCal: '2026-02-15', nextCal: '2026-03-25', daysRemaining: 5 },
        { id: 3, name: 'Patient Monitor M12', serial: 'SN-M12-902', sector: 'Emergency', health: 92, lastCal: '2026-01-10', nextCal: '2026-07-10', daysRemaining: 112 },
        { id: 4, name: 'Infusion Pump Alpha', serial: 'SN-IP-001', sector: 'General Ward', health: 76, lastCal: '2025-12-20', nextCal: '2026-03-30', daysRemaining: 10 },
        { id: 5, name: 'Defibrillator Pro', serial: 'SN-DEF-12', sector: 'Emergency', health: 100, lastCal: '2026-03-10', nextCal: '2026-09-10', daysRemaining: 174 },
        { id: 6, name: 'CT Scanner Prime', serial: 'SN-CT-02', sector: 'Radiology', health: 88, lastCal: '2026-01-20', nextCal: '2026-04-20', daysRemaining: 31 },
    ]);

    const [filter, setFilter] = useState('All');

    return (
        <DashboardLayout role="maintenance">
            <div style={{ padding: '0 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.4rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>Clinical Biomed Hub</h1>
                        <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 500 }}>
                            Medical device calibration and maintenance tracking
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        {['All', 'ICU', 'Radiology', 'Emergency'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                style={{ 
                                    padding: '0.6rem 1.2rem', borderRadius: '12px', border: 'none',
                                    background: filter === cat ? 'white' : 'transparent',
                                    color: filter === cat ? '#0ea5e9' : '#64748b',
                                    fontWeight: 800, fontSize: '0.8rem',
                                    boxShadow: filter === cat ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '3rem' }}>
                    {/* Device Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                        {devices.filter(d => filter === 'All' || d.sector.includes(filter)).map(d => (
                            <DeviceCard key={d.id} device={d} />
                        ))}
                    </div>

                    {/* Right Rail: Compliance & Critical Alerts */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <div className="stat-card-white" style={{ position: 'relative', overflow: 'hidden' }}>
                            <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: 0, fontWeight: 900, color: '#0f172a' }}>Regulatory Status</h3>
                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Compliance with Medical Standards</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dcfce7', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>ISO 13485:2016</div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Medical Device QMS Verified</div>
                                    </div>
                                    <CheckCircle2 size={18} color="#10b981" />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>Equipment Recalls</div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>1 Device model under review</div>
                                    </div>
                                    <ChevronRight size={18} color="#94a3b8" />
                                </div>
                            </div>
                        </div>

                        <div className="stat-card-white" style={{ background: '#0f172a', color: 'white', border: 'none' }}>
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ margin: 0, fontWeight: 900 }}>Maintenance Duty</h3>
                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', opacity: 0.6 }}>On-call Biomed Engineers</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>JS</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>James Simmonds</div>
                                        <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>Primary Responder (ICU)</div>
                                    </div>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>AK</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>Arun Kumar</div>
                                        <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>Imaging Specialist</div>
                                    </div>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                                </div>
                            </div>
                            <button style={{ width: '100%', marginTop: '2.5rem', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>
                                Contact Ops Center
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MaintenanceBiomed;
