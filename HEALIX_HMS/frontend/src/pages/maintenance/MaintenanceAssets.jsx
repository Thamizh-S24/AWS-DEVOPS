import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Database, Zap, Wind, Droplets, 
    HardDrive, Activity, Bell, Shield,
    Settings, History, AlertTriangle, CheckCircle2,
    ChevronRight, Info, BarChart3, Radio
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const AssetCard = ({ asset }) => {
    const statusColor = asset.status === 'Operational' ? '#10b981' : asset.status === 'Warning' ? '#f59e0b' : '#ef4444';
    
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="stat-card-white"
            style={{ padding: '2rem' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div style={{ 
                    padding: '1rem', borderRadius: '18px', 
                    background: `${asset.color}10`, color: asset.color,
                    boxShadow: `0 8px 16px ${asset.color}10`
                }}>
                    {asset.icon}
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Current Load</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 950, color: '#0f172a' }}>{asset.load}%</div>
                </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 950, color: '#0f172a' }}>{asset.name}</h3>
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>ID: {asset.serial} | Sector: {asset.sector}</p>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.5rem' }}>
                        <span>Capacity Utilization</span>
                        <span style={{ color: '#0f172a' }}>{asset.load}% / 100%</span>
                    </div>
                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div 
                            initial={{ width: 0 }} animate={{ width: `${asset.load}%` }}
                            style={{ height: '100%', background: asset.color }} 
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: statusColor }}>{asset.status.toUpperCase()}</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Uptime: {asset.uptime}</span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}>
                    Manual Override
                </button>
                <button style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', background: 'white', border: '1px solid #e2e8f0', color: '#0ea5e9', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                    <History size={14} /> Log
                </button>
            </div>
        </motion.div>
    );
};

const MaintenanceAssets = () => {
    const [assets] = useState([
        { id: 1, name: 'Main Power Grid (MV)', serial: 'ELC-HUB-01', sector: 'Central Plant', load: 64, status: 'Operational', uptime: '99.99%', icon: <Zap size={24} />, color: '#0ea5e9' },
        { id: 2, name: 'Medical Oxygen Supply', serial: 'GAS-OX-90', sector: 'Clinical Support', load: 88, status: 'Operational', uptime: '100%', icon: <Radio size={24} />, color: '#10b981' },
        { id: 3, name: 'Chiller Plant #4', serial: 'HVAC-CH-04', sector: 'Sector 4 Roof', load: 92, status: 'Warning', uptime: '94.2%', icon: <Wind size={24} />, color: '#f59e0b' },
        { id: 4, name: 'Backup Gen-Set 1', serial: 'GEN-AT-102', sector: 'Basement Ops', load: 0, status: 'Operational', uptime: 'Ready', icon: <Activity size={24} />, color: '#6366f1' },
        { id: 5, name: 'Water Filtration System', serial: 'WTR-PR-02', sector: 'Facility Basement', load: 45, status: 'Operational', uptime: '99.8%', icon: <Droplets size={24} />, color: '#06b6d4' },
        { id: 6, name: 'Data Center HVAC', serial: 'HVAC-DC-01', sector: 'Data Center', load: 78, status: 'Operational', uptime: '100%', icon: <HardDrive size={24} />, color: '#ec4899' },
    ]);

    return (
        <DashboardLayout role="maintenance">
            <div style={{ padding: '0 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.4rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>Infrastructure MEP Registry</h1>
                        <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 500 }}>
                            Real-time management of mechanical, electrical, and plumbing assets
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Total Capacity Load</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 950, color: '#ef4444' }}>74.2% <span style={{ fontSize: '0.9rem', color: '#10b981' }}>▲ High</span></div>
                        </div>
                        <div style={{ width: '1px', height: '40px', background: '#e2e8f0' }} />
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Asset Uptime</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 950, color: '#10b981' }}>99.98%</div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3.5rem' }}>
                    {/* Assets Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                        {assets.map(a => <AssetCard key={a.id} asset={a} />)}
                    </div>

                    {/* Right Rail: System Integrity */}
                    <aside style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <div className="stat-card-white" style={{ background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <BarChart3 size={18} color="#0ea5e9" /> Peak Analysis
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.5rem' }}>Power Consumption (Peak 2PM)</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ flex: 1, height: '40px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', gap: '2px', padding: '0 4px' }}>
                                            {[20, 45, 60, 30, 80, 50, 90, 40].map((h, i) => (
                                                <div key={i} style={{ flex: 1, height: `${h}%`, background: h > 80 ? '#ef4444' : '#0ea5e9', borderRadius: '2px 2px 0 0' }} />
                                            ))}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 950, color: '#ef4444' }}>Alert</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card-white">
                            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.5rem' }}>Critical Dependencies</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '10px', height: '100%', background: '#10b981', borderRadius: '5px' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 850, color: '#0f172a' }}>Backflow Preventer-01</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Maintained 4d ago</div>
                                    </div>
                                    <Shield size={18} color="#10b981" />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '10px', height: '100%', background: '#ef4444', borderRadius: '5px' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 850, color: '#0f172a' }}>UPS Battery Cluster B</div>
                                        <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>REPLACEMENT REQUIRED</div>
                                    </div>
                                    <AlertTriangle size={18} color="#ef4444" />
                                </div>
                            </div>
                            <button style={{ width: '100%', marginTop: '2.5rem', padding: '1rem', borderRadius: '12px', background: '#0f172a', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                                Order Spare Parts
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MaintenanceAssets;
