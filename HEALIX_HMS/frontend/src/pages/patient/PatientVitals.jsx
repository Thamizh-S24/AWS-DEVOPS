import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Heart, Activity, Moon, Droplets, 
    Smartphone, Watch, RefreshCw, ChevronRight,
    ArrowUpRight, ArrowDownRight, Zap
} from 'lucide-react';
import PatientLayout from '../../components/PatientLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PatientSectionHeader = ({ title, subtitle }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 950, color: '#1e3a8a', margin: 0, letterSpacing: '-1px' }}>{title}</h2>
            <div style={{ height: '5px', width: '80px', background: 'linear-gradient(90deg, #1e40af, #3b82f6)', borderRadius: '2px', margin: '0.8rem 0' }} />
            <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.4rem', fontWeight: 500 }}>{subtitle}</p>
        </div>
    </div>
);

const VitalCard = ({ icon, label, value, unit, trend, trendValue, color, chartData }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="stat-card-white" 
        style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderBottom: `4px solid ${color}` }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: `${color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
                {icon}
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: trend === 'up' ? '#ef4444' : '#10b981', fontSize: '0.85rem', fontWeight: 950 }}>
                    {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {trendValue}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.2rem' }}>Since Yesterday</div>
            </div>
        </div>
        
        <div>
            <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.3rem' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 950, color: '#0f172a', letterSpacing: '-1px' }}>{value}</span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#64748b' }}>{unit}</span>
            </div>
        </div>

        {/* Minimalist Sparkline Chart Logic */}
        <div style={{ height: '40px', display: 'flex', alignItems: 'flex-end', gap: '3px', marginTop: '0.5rem' }}>
            {chartData.map((h, i) => (
                <div 
                    key={i} 
                    style={{ 
                        flex: 1, 
                        height: `${h}%`, 
                        background: color, 
                        opacity: 0.1 + (i / chartData.length) * 0.4, 
                        borderRadius: '2px' 
                    }} 
                />
            ))}
        </div>
    </motion.div>
);

const PatientVitals = () => {
    const { user } = useAuth();
    const [lastSync, setLastSync] = useState('Today, 10:45 AM');
    const [syncing, setSyncing] = useState(false);

    const handleSync = async () => {
        setSyncing(true);
        try {
            // Persist to Healix Clinical Repository
            await api.post('/patient/vitals', {
                patient_id: user?.username || 'P-001',
                heart_rate: 72,
                steps: 8420,
                sleep_hours: 8.4
            });
            setLastSync('Just now');
        } catch (err) {
            console.error("IoT Node Failover: Sync interrupted by clinical gateway", err);
        } finally {
            setSyncing(false);
        }
    };

    return (
        <PatientLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <PatientSectionHeader 
                        title="My Health Device Sync" 
                        subtitle="Automatic updates from your smart watch and health devices"
                    />
                    <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSync}
                        style={{ 
                            padding: '1rem 2rem', borderRadius: '15px', 
                            background: '#0f172a', color: 'white', 
                            border: 'none', fontWeight: 950, fontSize: '0.9rem',
                            display: 'flex', alignItems: 'center', gap: '0.8rem',
                            cursor: 'pointer', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.2)'
                        }}
                    >
                        <RefreshCw size={18} className={syncing ? 'spin' : ''} /> 
                        {syncing ? 'SYNCING DATA...' : 'FORCE CLOUD SYNC'}
                    </motion.button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                    <VitalCard 
                        icon={<Heart size={24} />}
                        label="Heart Rate"
                        value="72"
                        unit="BPM"
                        trend="down"
                        trendValue="2%"
                        color="#1e40af"
                        chartData={[40, 55, 45, 60, 50, 65, 55, 70, 60, 75]}
                    />
                    <VitalCard 
                        icon={<Activity size={24} />}
                        label="Blood Pressure"
                        value="118/72"
                        unit="mmHg"
                        trend="down"
                        trendValue="4%"
                        color="#1e3a8a"
                        chartData={[70, 65, 72, 68, 70, 65, 68, 70, 65, 60]}
                    />
                    <VitalCard 
                        icon={<Moon size={24} />}
                        label="Sleep Quality"
                        value="8.4"
                        unit="Hours"
                        trend="up"
                        trendValue="12%"
                        color="#1d4ed8"
                        chartData={[30, 40, 50, 45, 60, 70, 65, 80, 75, 90]}
                    />
                    <VitalCard 
                        icon={<Droplets size={24} />}
                        label="SpO2 Level"
                        value="98"
                        unit="%"
                        trend="up"
                        trendValue="0.5%"
                        color="#2563eb"
                        chartData={[95, 96, 95, 97, 96, 98, 97, 98, 97, 99]}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3.5rem' }}>
                    
                    {/* Device Management */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <Zap color="#0ea5e9" size={24} />
                            <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1.4rem', color: '#0f172a' }}>Connected Devices</h3>
                        </div>

                        <div className="stat-card-white" style={{ padding: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '2rem', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '15px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>
                                        <Watch size={28} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontWeight: 950, fontSize: '1.1rem', color: '#0f172a' }}>Apple Watch Ultra 2</h4>
                                        <p style={{ margin: '0.2rem 0 0 0', color: '#10b981', fontSize: '0.85rem', fontWeight: 900 }}>CONNECTED & CALIBRATED</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 800 }}>BATTERY</div>
                                    <div style={{ color: '#0f172a', fontWeight: 950, fontSize: '1rem' }}>84%</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '15px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>
                                        <Smartphone size={28} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontWeight: 950, fontSize: '1.1rem', color: '#0f172a' }}>Google Pixel 8 Pro</h4>
                                        <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>LAST SYNCED: {lastSync}</p>
                                    </div>
                                </div>
                                <button style={{ padding: '0.6rem 1rem', borderRadius: '10px', background: '#f1f5f9', border: 'none', color: '#64748b', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
                                    CONFIGURE
                                </button>
                            </div>
                        </div>

                        <div style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', borderRadius: '25px', padding: '2.5rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ margin: 0, fontWeight: 950, fontSize: '1.3rem' }}>Add New Medical Node</h4>
                                <p style={{ margin: '0.5rem 0 0 0', opacity: 0.8, fontSize: '0.95rem', fontWeight: 600, maxWidth: '400px' }}>Pair hospital-issued Continuous Glucose Monitors (CGM) or specialized EKG patches.</p>
                            </div>
                            <button style={{ background: 'white', color: '#0ea5e9', border: 'none', padding: '1rem 1.5rem', borderRadius: '12px', fontWeight: 950, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                SCAN FOR DEVICES <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Clinical Insights */}
                    <aside>
                        <div className="stat-card-white" style={{ padding: '2.5rem', background: 'linear-gradient(to bottom, white, #f8fafc)', height: '100%', borderLeft: '6px solid #8b5cf6' }}>
                            <h4 style={{ margin: '0 0 2rem 0', fontWeight: 950, color: '#0f172a', fontSize: '1.2rem', letterSpacing: '-0.5px' }}>Automated Clinical Insights</h4>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ padding: '0.8rem', borderRadius: '15px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', height: 'fit-content' }}>
                                        <Moon size={20} />
                                    </div>
                                    <div>
                                        <h5 style={{ margin: 0, fontWeight: 950, color: '#0f172a', fontSize: '1rem' }}>Sleep Deficiency Alert</h5>
                                        <p style={{ margin: '0.4rem 0 0 0', color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5, fontWeight: 600 }}>Your deep sleep phase has decreased by 14% over the last 3 days. AURA recommends a cooler room temperature (18°C) tonight.</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ padding: '0.8rem', borderRadius: '15px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', height: 'fit-content' }}>
                                        <Activity size={20} />
                                    </div>
                                    <div>
                                        <h5 style={{ margin: 0, fontWeight: 950, color: '#0f172a', fontSize: '1rem' }}>VO2 Max Improvement</h5>
                                        <p style={{ margin: '0.4rem 0 0 0', color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5, fontWeight: 600 }}>Consistent morning walks are reflecting in your cardiovascular efficiency score. Keep it up!</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto', paddingTop: '3rem' }}>
                                <div style={{ background: '#f1f5f9', borderRadius: '15px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <Watch size={20} color="#94a3b8" />
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Data is protected by hardware-level TEE (Trusted Execution Environment).</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </PatientLayout>
    );
};

export default PatientVitals;
