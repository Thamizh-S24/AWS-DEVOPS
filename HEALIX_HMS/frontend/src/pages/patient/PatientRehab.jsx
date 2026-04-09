import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Accessibility, ArrowRight, CheckCircle, 
    TrendingUp, Dumbbell, Clock, MessageSquare, History, Activity
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

const ExerciseCard = ({ name, reps, sets, duration, status, icon: Icon }) => (
    <motion.div 
        whileHover={{ x: 10 }}
        className="stat-card-white" 
        style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: status === 'Completed' ? '6px solid #10b981' : '1px solid #f1f5f9' }}
    >
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '15px', background: status === 'Completed' ? 'rgba(16, 185, 129, 0.05)' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: status === 'Completed' ? '#10b981' : '#94a3b8' }}>
                <Icon size={24} />
            </div>
            <div>
                <h4 style={{ margin: 0, fontWeight: 950, fontSize: '1.2rem', color: '#0f172a' }}>{name}</h4>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.4rem' }}>
                    <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>{sets} SETS × {reps} REPS</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 700 }}>{duration} MINS</div>
                </div>
            </div>
        </div>
        <div>
            {status === 'Completed' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 950, fontSize: '0.8rem' }}>
                    <CheckCircle size={18} /> DONE
                </div>
            ) : (
                <button style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', background: '#0f172a', border: 'none', color: 'white', fontWeight: 950, fontSize: '0.8rem', cursor: 'pointer' }}>
                    START
                </button>
            )}
        </div>
    </motion.div>
);

const PatientRehab = () => {
    return (
        <PatientLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                <PatientSectionHeader 
                    title="Physiotherapy Tracker" 
                    subtitle="Proprioceptive rehabilitation and musculoskeletal recovery trajectory"
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3.5rem' }}>
                    
                    {/* Active Routine */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <Dumbbell color="#0ea5e9" size={24} />
                            <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1.4rem', color: '#0f172a' }}>Assigned Post-Op Routine</h3>
                        </div>

                        <ExerciseCard 
                            name="Quadriceps Setting"
                            reps="10"
                            sets="3"
                            duration="5"
                            status="Completed"
                            icon={Accessibility}
                        />
                        <ExerciseCard 
                            name="Straight Leg Raise"
                            reps="15"
                            sets="3"
                            duration="10"
                            status="Pending"
                            icon={TrendingUp}
                        />
                        <ExerciseCard 
                            name="Ankle Pumps"
                            reps="20"
                            sets="2"
                            duration="3"
                            status="Pending"
                            icon={Activity}
                        />
                    </div>

                    {/* Recovery Metrics */}
                    <aside style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        
                        <div className="stat-card-white" style={{ padding: '2.5rem', borderTop: '6px solid #0ea5e9' }}>
                            <h4 style={{ margin: '0 0 2rem 0', fontWeight: 950, color: '#0f172a', fontSize: '1.1rem' }}>Recovery Velocity</h4>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 800 }}>ROM (KNEE FLEXION)</div>
                                    <div style={{ color: '#0ea5e9', fontWeight: 950 }}>112° <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>/ 125°</span></div>
                                </div>
                                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: '85%', height: '100%', background: '#0ea5e9', borderRadius: '4px' }} />
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 800 }}>MUSCLE STRENGTH (M4+)</div>
                                    <div style={{ color: '#0ea5e9', fontWeight: 950 }}>80% <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>TARGET</span></div>
                                </div>
                                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: '80%', height: '100%', background: '#0ea5e9', borderRadius: '4px' }} />
                                </div>
                            </div>

                            <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(14, 165, 233, 0.03)', borderRadius: '20px', border: '1px solid rgba(14, 165, 233, 0.08)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.8rem' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0ea5e9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <TrendingUp size={16} />
                                    </div>
                                    <h5 style={{ margin: 0, fontWeight: 950, color: '#0f172a', fontSize: '0.9rem' }}>Projected Recovery</h5>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, fontWeight: 600 }}>
                                    Based on your current trajectory, you are 3 days ahead of the standard protocol. Expect full weight-bearing clearance by April 12th.
                                </p>
                            </div>
                        </div>

                        <div className="stat-card-white" style={{ padding: '2.5rem', background: '#f8fafc' }}>
                            <h4 style={{ margin: '0 0 1.5rem 0', fontWeight: 950, color: '#0f172a', fontSize: '1.1rem' }}>Clinical Contact</h4>
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem' }}>
                                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                    <Accessibility size={22} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 950, color: '#0f172a', fontSize: '0.95rem' }}>Robert Vance, DPT</div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800 }}>SENIOR PHYSIOTHERAPIST</div>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <button style={{ padding: '0.8rem', borderRadius: '12px', background: 'white', border: '1px solid #e2e8f0', color: '#0f172a', fontWeight: 900, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <MessageSquare size={16} color="#0ea5e9" /> CHAT
                                </button>
                                <button style={{ padding: '0.8rem', borderRadius: '12px', background: 'white', border: '1px solid #e2e8f0', color: '#0f172a', fontWeight: 900, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <History size={16} color="#94a3b8" /> LOGS
                                </button>
                            </div>
                        </div>

                    </aside>
                </div>
            </div>
        </PatientLayout>
    );
};

export default PatientRehab;
