import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Pill, Truck, Clock, CheckCircle, Package, 
    AlertCircle, RefreshCw, MapPin, Phone, Shield
} from 'lucide-react';
import PatientLayout from '../../components/PatientLayout';

const PatientSectionHeader = ({ title, subtitle }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 950, color: '#1e3a8a', margin: 0, letterSpacing: '-1px' }}>{title}</h2>
            <div style={{ height: '5px', width: '80px', background: 'linear-gradient(90deg, #1e40af, #3b82f6)', borderRadius: '2px', margin: '0.8rem 0' }} />
            <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.4rem', fontWeight: 500 }}>{subtitle}</p>
        </div>
    </div>
);

const PatientPharmacy = () => {
    const [prescriptions] = useState([
        { id: 1, name: 'Amoxicillin 500mg', dosage: '1 tablet twice daily', doctor: 'Dr. Sarah Jenkins', refills: 2, expiry: '2026-05-12', status: 'Delivered' },
        { id: 2, name: 'Lisinopril 10mg', dosage: '1 tablet every morning', doctor: 'Dr. Michael Chen', refills: 0, expiry: '2026-04-01', status: 'In Transit' },
        { id: 3, name: 'Metformin 850mg', dosage: '1 tablet with dinner', doctor: 'Dr. Sarah Jenkins', refills: 5, expiry: '2026-08-20', status: 'Processing' }
    ]);

    const deliveryStages = [
        { label: 'Order Confirmed', color: '#10b981', date: 'Today, 10:30 AM' },
        { label: 'Processing', color: '#10b981', date: 'Today, 11:45 AM' },
        { label: 'Out for Delivery', color: '#0ea5e9', date: 'Estimated 2:00 PM' },
        { label: 'Delivered', color: '#94a3b8', date: '-' }
    ];

    return (
        <PatientLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                <PatientSectionHeader 
                    title="Prescription Delivery Hub" 
                    subtitle="Manage active medications and track home delivery status in real-time"
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '3.5rem' }}>
                    
                    {/* Active Prescriptions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <Pill color="#0ea5e9" size={24} />
                            <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1.4rem', color: '#0f172a' }}>Active Prescriptions</h3>
                        </div>

                        {prescriptions.map((p) => (
                            <motion.div 
                                key={p.id}
                                whileHover={{ y: -5 }}
                                className="stat-card-white"
                                style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                    <div style={{ width: '60px', height: '60px', borderRadius: '15px', background: 'rgba(14, 165, 233, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
                                        <Package size={28} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontWeight: 950, fontSize: '1.2rem', color: '#0f172a' }}>{p.name}</h4>
                                        <p style={{ margin: '0.3rem 0', color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>{p.dosage}</p>
                                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.8rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>
                                                <RefreshCw size={14} /> {p.refills} REFILLS LEFT
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>
                                                <Clock size={14} /> EXPIRES {p.expiry}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                                    <div style={{ 
                                        padding: '0.5rem 1rem', borderRadius: '10px', 
                                        background: p.status === 'Delivered' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(14, 165, 233, 0.08)',
                                        color: p.status === 'Delivered' ? '#10b981' : '#0ea5e9',
                                        fontSize: '0.75rem', fontWeight: 950, letterSpacing: '1px'
                                    }}>
                                        {p.status.toUpperCase()}
                                    </div>
                                    <button style={{ 
                                        padding: '0.6rem 1.2rem', borderRadius: '10px', 
                                        background: p.refills > 0 ? '#0f172a' : '#f1f5f9', 
                                        color: p.refills > 0 ? 'white' : '#94a3b8',
                                        border: 'none', fontWeight: 800, fontSize: '0.8rem',
                                        cursor: p.refills > 0 ? 'pointer' : 'not-allowed',
                                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                                    }}>
                                        <RefreshCw size={14} /> REQUEST REFILL
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Live Delivery Tracking */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <Truck color="#0ea5e9" size={24} />
                            <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1.4rem', color: '#0f172a' }}>Live Tracking</h3>
                        </div>

                        <div className="stat-card-white" style={{ padding: '2.5rem', borderLeft: '6px solid #0ea5e9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                                <div>
                                    <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>Shipment ID</div>
                                    <h4 style={{ margin: 0, fontWeight: 950, fontSize: '1.25rem', color: '#0f172a' }}>#HM-PHARM-8821</h4>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>Arrival Time</div>
                                    <h4 style={{ margin: 0, fontWeight: 950, fontSize: '1.25rem', color: '#0ea5e9' }}>14:30 PM</h4>
                                </div>
                            </div>

                            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                <div style={{ position: 'absolute', left: '15px', top: '15px', bottom: '15px', width: '2px', background: '#f1f5f9' }} />
                                
                                {deliveryStages.map((stage, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '2rem', position: 'relative', zIndex: 1 }}>
                                        <div style={{ 
                                            width: '32px', height: '32px', borderRadius: '50%', 
                                            background: i < 3 ? stage.color : 'white', 
                                            border: i < 3 ? 'none' : `2px solid #f1f5f9`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: i < 3 ? 'white' : '#cbd5e1',
                                            boxShadow: i < 3 ? `0 0 15px ${stage.color}40` : 'none'
                                        }}>
                                            {i < 3 ? <CheckCircle size={16} /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#cbd5e1' }} />}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 950, fontSize: '0.95rem', color: i < 3 ? '#0f172a' : '#94a3b8' }}>{stage.label}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginTop: '0.2rem' }}>{stage.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ padding: '2.5rem', background: '#eff6ff', borderRadius: '32px', border: '1px solid #dbeafe', textAlign: 'center' }}>
                                <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', border: '1px solid #bfdbfe' }}>
                                    <Shield size={32} color="#1e40af" />
                                </div>
                                <div>
                                    <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '1px' }}>Delivery Destination</div>
                                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e293b' }}>124 Medical Park Ave, Floor 4</div>
                                </div>
                            </div>

                            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '1.5rem' }}>
                                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                    <MapPin size={22} />
                                </div>
                                <div>
                                    <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '1px' }}>Delivery Destination</div>
                                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e293b' }}>124 Medical Park Ave, Floor 4</div>
                                </div>
                            </div>
                        </div>

                        {/* Pharmacy Support */}
                        <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: '25px', padding: '2rem', color: 'white', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
                                <Phone size={24} />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1.1rem' }}>Pharmacy Direct Line</h4>
                                <p style={{ margin: '0.2rem 0 0 0', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>Need help with your dosage? Talk to a pharmacist.</p>
                                <button style={{ marginTop: '1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                                    CALL 1-800-HEALIX-RX
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Important Warnings */}
                <div style={{ background: 'rgba(245, 158, 11, 0.03)', border: '1px solid rgba(245, 158, 11, 0.1)', borderRadius: '25px', padding: '2.5rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                    <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '18px', color: '#f59e0b' }}>
                        <AlertCircle size={32} />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1.4rem', color: '#f59e0b', letterSpacing: '-0.5px' }}>Important Medication Advisory</h3>
                        <p style={{ margin: '0.8rem 0 0 0', color: '#475569', fontSize: '1.05rem', lineHeight: 1.6, fontWeight: 500, maxWidth: '900px' }}>
                            Please do not ingest any medication that differs significantly in appearance from your previous supply without consulting Dr. Jenkins. If you experience unexpected breathing difficulty, dizziness, or severe nausea, use the <strong>EMERGENCY SOS</strong> button on your dashboard immediately.
                        </p>
                    </div>
                </div>
            </div>
        </PatientLayout>
    );
};

export default PatientPharmacy;
