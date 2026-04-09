import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Thermometer, Droplets, Wind, Gauge,
    Activity, Shield, AlertTriangle, CheckCircle2,
    Map, Layers, Info, History, BarChart2, Zap
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const VitalGauge = ({ icon, label, value, unit, color, status }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="stat-card-white"
        style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderLeft: `6px solid ${color}` }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ padding: '0.8rem', borderRadius: '14px', background: `${color}10`, color: color }}>
                {icon}
            </div>
            <span style={{ 
                fontSize: '0.7rem', fontWeight: 900, 
                padding: '0.3rem 0.6rem', borderRadius: '6px',
                background: status === 'Optimal' ? '#dcfce7' : '#fef2f2',
                color: status === 'Optimal' ? '#10b981' : '#ef4444'
            }}>
                {status.toUpperCase()}
            </span>
        </div>
        <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', marginBottom: '0.3rem' }}>{label}</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#0f172a' }}>
                {value}<span style={{ fontSize: '1rem', color: '#94a3b8', marginLeft: '0.4rem' }}>{unit}</span>
            </div>
        </div>
        <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
            <motion.div 
                initial={{ width: 0 }} animate={{ width: '70%' }}
                style={{ height: '100%', background: color }} 
            />
        </div>
    </motion.div>
);

const SectorStatus = ({ name, pressure, airQuality, temp, status }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', background: 'white', borderRadius: '18px', border: '1px solid #f1f5f9' }}>
        <div style={{ 
            width: '12px', height: '40px', borderRadius: '6px', 
            background: status === 'Safe' ? '#10b981' : '#f59e0b' 
        }} />
        <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>{name}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Pressure: {pressure} Pa | {temp}°C</div>
        </div>
        <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>AQI Index</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 950, color: airQuality < 50 ? '#10b981' : '#f59e0b' }}>{airQuality}</div>
        </div>
    </div>
);

const MaintenanceFacility = () => {
    const [stats] = useState([
        { id: 1, label: 'Average Temp', value: '22.4', unit: '°C', color: '#0ea5e9', icon: <Thermometer size={20} />, status: 'Optimal' },
        { id: 2, label: 'Rel. Humidity', value: '48', unit: '%', color: '#06b6d4', icon: <Droplets size={20} />, status: 'Optimal' },
        { id: 3, label: 'Air Flow Rate', value: '14.2', unit: 'ACH', color: '#10b981', icon: <Wind size={20} />, status: 'Optimal' },
        { id: 4, label: 'CO2 Levels', value: '412', unit: 'ppm', color: '#f59e0b', icon: <Activity size={20} />, status: 'Warning' },
    ]);

    const [sectors] = useState([
        { name: 'Operation Theater 1 (OT-1)', pressure: '+25', airQuality: 12, temp: 19.5, status: 'Safe' },
        { name: 'ICU Isolation Ward (IS-01)', pressure: '-15', airQuality: 44, temp: 22.0, status: 'Safe' },
        { name: 'Neonatal Care Sector', pressure: '+10', airQuality: 18, temp: 26.5, status: 'Safe' },
        { name: 'Radiology Suite A', pressure: '+5', airQuality: 62, temp: 21.0, status: 'Warning' },
    ]);

    return (
        <DashboardLayout role="maintenance">
            <div style={{ padding: '0 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.4rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>Environmental Command</h1>
                        <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 500 }}>
                            Real-time OT/ICU telemetry and infection control monitoring
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-vitalize" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <Layers size={18} /> Floor Map
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
                    {stats.map(s => <VitalGauge key={s.id} {...s} />)}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3.5rem' }}>
                    {/* Sector Monitoring */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Critical Sectors</h2>
                            <button style={{ color: '#0ea5e9', background: 'none', border: 'none', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>View All Hubs</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {sectors.map((s, i) => <SectorStatus key={i} {...s} />)}
                        </div>

                        {/* Infection Control Card */}
                        <div className="stat-card-white" style={{ background: '#0f172a', color: 'white', border: 'none', padding: '3rem' }}>
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                <div style={{ padding: '1.5rem', borderRadius: '24px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                                    <Shield size={40} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 950 }}>Infection Control Protocol</h3>
                                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.95rem', opacity: 0.6, lineHeight: 1.6 }}>
                                        All HEPA filtration units in Surgical Sectors are currently performing within specified clinical tolerances. Zero pressure breaches detected in the last 24h.
                                    </p>
                                </div>
                                <button style={{ padding: '1rem 2rem', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 800 }}>
                                    Full Audit Log
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Rail: Logs and Alerts */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <div className="stat-card-white">
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', marginBottom: '2rem' }}>Incident Log (Environmental)</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', marginTop: '4px' }} />
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 850, color: '#0f172a' }}>Humidity Spike in Archive</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Sector 9B | 14:15 PM</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', marginTop: '4px' }} />
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 850, color: '#0f172a' }}>Auto-Sanitization Cycle Complete</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>OT-3 | Sterile Zone | 12:40 PM</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', marginTop: '4px' }} />
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 850, color: '#0f172a' }}>Filter Exchange Verified</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>ICU-Main HEPA-01 | 10:22 AM</div>
                                    </div>
                                </div>
                            </div>
                            <button style={{ width: '100%', marginTop: '2.5rem', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>
                                Schedule New Audit
                            </button>
                        </div>

                        <div className="stat-card-white" style={{ background: `linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)`, color: 'white', border: 'none' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <BarChart2 size={32} style={{ opacity: 0.4 }} />
                            </div>
                            <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.2rem' }}>Climate Forecasting</h3>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.5 }}>
                                Predictive HVAC optimization expects a 15% load increase within the next 2 hours based on hospital occupancy trends.
                            </p>
                            <button style={{ width: '100%', marginTop: '2rem', padding: '0.8rem', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: 800, fontSize: '0.8rem' }}>
                                Adjust Optimization
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MaintenanceFacility;
