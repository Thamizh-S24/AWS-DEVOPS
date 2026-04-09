import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Wind, Smile, Cloud, Sun, 
    Play, Pause, Award, MessageCircle, Heart
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

const PatientMentalHealth = () => {
    const [mood, setMood] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const moods = [
        { icon: <Smile size={32} />, label: 'Great', color: '#10b981' },
        { icon: <Sun size={32} />, label: 'Stable', color: '#0ea5e9' },
        { icon: <Cloud size={32} />, label: 'Low', color: '#8b5cf6' },
        { icon: <Wind size={32} />, label: 'Anxious', color: '#f59e0b' }
    ];

    return (
        <PatientLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                <PatientSectionHeader 
                    title="Cognitive Wellness Space" 
                    subtitle="A sanctuary for mental clarity, guided mindfulness, and emotional resilience tracking"
                />

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 1.2fr', gap: '3.5rem' }}>
                    
                    {/* Left Column: Mood & Meditation */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        
                        {/* Daily Reflection */}
                        <div className="stat-card-white" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, white, #f0f9ff)' }}>
                            <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: 950, fontSize: '1.4rem', color: '#0f172a', letterSpacing: '-0.5px' }}>Daily Reflection</h3>
                            <p style={{ color: '#64748b', fontWeight: 600, marginBottom: '2rem' }}>How would you describe your current emotional frequency?</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                                {moods.map((m, i) => (
                                    <motion.button
                                        key={i}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setMood(i)}
                                        style={{ 
                                            padding: '1.5rem 1rem', borderRadius: '20px', 
                                            background: mood === i ? m.color : 'white', 
                                            border: mood === i ? 'none' : '1px solid #f1f5f9',
                                            color: mood === i ? 'white' : '#94a3b8',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                            boxShadow: mood === i ? `0 10px 20px ${m.color}30` : 'none'
                                        }}
                                    >
                                        {m.icon}
                                        <span style={{ fontSize: '0.8rem', fontWeight: 950, textTransform: 'uppercase' }}>{m.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Meditation Player */}
                        <div className="stat-card-white" style={{ padding: '2.5rem', background: '#0f172a', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.3px' }}>Midnight Rainfall</h3>
                                    <p style={{ margin: '0.4rem 0 0 0', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>15 MINUTE DEEP SLEEP PREPARATION</p>
                                </div>
                                <div style={{ padding: '0.5rem 1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', fontSize: '0.75rem', fontWeight: 900, color: '#8b5cf6' }}>
                                    AUDIO CALIBRATED
                                </div>
                            </div>

                            <div style={{ position: 'relative', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', marginBottom: '2.5rem' }}>
                                {[...Array(40)].map((_, i) => (
                                    <motion.div 
                                        key={i}
                                        animate={{ height: isPlaying ? [10, Math.random() * 80 + 20, 10] : 10 }}
                                        transition={{ repeat: Infinity, duration: 0.5 + Math.random(), ease: "easeInOut" }}
                                        style={{ width: '4px', background: 'rgba(139, 92, 246, 0.4)', borderRadius: '2px' }}
                                    />
                                ))}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
                                <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#8b5cf6', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)' }}
                                >
                                    {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" style={{ marginLeft: '4px' }} />}
                                </motion.button>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Progress & Support */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        
                        <div className="stat-card-white" style={{ padding: '2.5rem', borderTop: '6px solid #8b5cf6' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <Award color="#8b5cf6" size={24} />
                                    <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1.2rem', color: '#0f172a' }}>Mental Resilience Score</h3>
                                </div>
                                <span style={{ fontSize: '1.4rem', fontWeight: 950, color: '#8b5cf6' }}>8.4</span>
                            </div>

                            <div style={{ height: '8px', width: '100%', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '84%' }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    style={{ height: '100%', background: 'linear-gradient(to right, #8b5cf6, #d946ef)', borderRadius: '10px' }}
                                />
                            </div>

                            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontWeight: 600 }}>
                                You have completed 12 consecutive days of mindfulness. Your heart rate variability indicates a 15% improvement in parasympathetic nervous system activity.
                            </p>
                        </div>

                        <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: '30px', padding: '2.5rem', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.03)' }}>
                            <h4 style={{ margin: '0 0 2rem 0', fontWeight: 950, color: '#0f172a', fontSize: '1.1rem' }}>Upcoming Counselor Video Briefing</h4>
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1.5rem', background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '15px', overflow: 'hidden' }}>
                                    <img src="https://images.unsplash.com/photo-1559839734-2b71ef159950?q=80&w=2670&auto=format&fit=crop" alt="Counselor" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h5 style={{ margin: 0, fontWeight: 950, fontSize: '1rem', color: '#0f172a' }}>Dr. Amelia Vance</h5>
                                    <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>CLINICAL PSYCHOLOGIST</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: '#0ea5e9', fontWeight: 950, fontSize: '0.9rem' }}>TOMORROW</div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>10:00 AM</div>
                                </div>
                            </div>

                            <button style={{ width: '100%', marginTop: '2.5rem', padding: '1.2rem', borderRadius: '15px', background: 'var(--grad-main)', color: 'white', border: 'none', fontWeight: 950, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', cursor: 'pointer' }}>
                                <MessageCircle size={18} /> OPEN CALMING CHAT
                            </button>
                        </div>

                        <div style={{ marginTop: 'auto', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.1)', borderRadius: '25px', padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <Heart size={24} color="#8b5cf6" />
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.5 }}>
                                "The greatest weapon against stress is our ability to choose one thought over another." — William James
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </PatientLayout>
    );
};

export default PatientMentalHealth;
