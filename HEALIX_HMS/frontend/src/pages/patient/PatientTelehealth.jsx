import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Mic, MicOff, VideoOff, PhoneOff, Users, MessageSquare, Monitor } from 'lucide-react';
import PatientLayout from '../../components/PatientLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PatientSectionHeader = ({ title, subtitle }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 950, color: '#1e3a8a', margin: 0, letterSpacing: '-px' }}>{title}</h2>
            <div style={{ height: '5px', width: '80px', background: 'linear-gradient(90deg, #1e40af, #3b82f6)', borderRadius: '2px', margin: '0.8rem 0' }} />
            <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.4rem', fontWeight: 500 }}>{subtitle}</p>
        </div>
    </div>
);

const PatientTelehealth = () => {
    const { user } = useAuth();
    const [inCall, setInCall] = useState(false);
    const [micOn, setMicOn] = useState(true);
    const [videoOn, setVideoOn] = useState(true);
    const [waiting, setWaiting] = useState(true);

    useEffect(() => {
        // Simulate waiting room connection, then doctor joins
        if (inCall && waiting) {
            const timer = setTimeout(() => {
                setWaiting(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [inCall, waiting]);

    const joinVideoConsultation = () => {
        setInCall(true);
        setWaiting(true);
    };

    const leaveCall = () => {
        setInCall(false);
    };

    return (
        <PatientLayout>
            <PatientSectionHeader
                title="Virtual Doctor Visit"
                subtitle="High-quality secure video chat with your clinical team"
            />
            
            {!inCall ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3.5rem' }}>
                    <div className="stat-card-white" style={{ padding: '4rem', textAlign: 'center' }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem' }}>
                            <Video size={50} color="#0ea5e9" />
                        </div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: 950, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.5px' }}>Start Virtual Care Session</h3>
                        <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 3rem', fontWeight: 500 }}>
                            Connect instantly with your assigned clinical specialist. Audio and video are transmitted over end-to-end encrypted WebRTC streams to ensure absolute HIPAA compliance.
                        </p>
                        
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={joinVideoConsultation}
                                className="btn-vitalize" 
                                style={{ padding: '1.2rem 2.5rem', fontSize: '1rem', fontWeight: 950, background: 'var(--grad-main)', borderRadius: '15px' }}
                            >
                                <Video size={18} /> START VIDEO VISIT
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="stat-card-white" style={{ padding: '2.5rem' }}>
                            <h4 style={{ margin: '0 0 1.5rem 0', fontWeight: 950, color: '#0f172a', fontSize: '1.1rem' }}>Pre-Consultation Checklist</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                                    <span style={{ fontWeight: 600, color: '#475569' }}>Camera & Microphone Permissions</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                                    <span style={{ fontWeight: 600, color: '#475569' }}>High-Speed Connection Active</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>!</div>
                                    <span style={{ fontWeight: 600, color: '#475569' }}>Find a quiet, well-lit environment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ background: '#0f172a', borderRadius: '30px', overflow: 'hidden', height: '70vh', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                    {/* Main Video Stream (Simulated Doctor) */}
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1e293b, #0f172a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {waiting ? (
                            <div style={{ textAlign: 'center', color: '#64748b' }}>
                                <div style={{ padding: '2.5rem', background: '#eff6ff', borderRadius: '24px', border: '1px solid #dbeafe', textAlign: 'center' }}>
                                    <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', border: '1px solid #bfdbfe' }}>
                                        <Monitor size={40} color="#1e40af" />
                                    </div>
                                    <h3 style={{ fontWeight: 950, color: '#1e40af', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Awaiting Doctor Connection</h3>
                                    <p style={{ fontWeight: 500, fontSize: '0.9rem', color: '#64748b' }}>Please hold. You will be connected automatically.</p>
                                </div>
                            </div>
                        ) : (
                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2670&auto=format&fit=crop" alt="Doctor Stream" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                                <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', padding: '0.8rem 1.5rem', borderRadius: '15px', color: 'white', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                                    <div>
                                        <div style={{ fontWeight: 900, fontSize: '0.9rem' }}>Dr. Sarah Jenkins</div>
                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Attending Cardiologist</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Self Video Stream PIP */}
                    <div style={{ position: 'absolute', top: '2rem', right: '2rem', width: '240px', height: '160px', background: '#334155', borderRadius: '20px', border: '2px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                        {videoOn ? (
                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2576&auto=format&fit=crop" alt="Patient Stream" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                <VideoOff size={32} />
                            </div>
                        )}
                        <div style={{ position: 'absolute', bottom: '0.8rem', left: '0.8rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '0.4rem 0.8rem', borderRadius: '8px', color: 'white', fontSize: '0.7rem', fontWeight: 800 }}>
                            You (Simulated)
                        </div>
                    </div>

                    {/* Call Controls */}
                    <div style={{ position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '1.5rem', background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(20px)', padding: '1rem 2rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <button 
                            onClick={() => setMicOn(!micOn)}
                            style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: micOn ? 'rgba(255,255,255,0.1)' : '#ef4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            {micOn ? <Mic size={22} /> : <MicOff size={22} />}
                        </button>
                        <button 
                            onClick={() => setVideoOn(!videoOn)}
                            style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: videoOn ? 'rgba(255,255,255,0.1)' : '#ef4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            {videoOn ? <Video size={22} /> : <VideoOff size={22} />}
                        </button>
                        <button 
                            style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            <MessageSquare size={22} />
                        </button>
                        <button 
                            onClick={leaveCall}
                            style={{ width: '70px', height: '50px', borderRadius: '25px', border: 'none', background: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)' }}
                        >
                            <PhoneOff size={22} />
                        </button>
                    </div>
                </div>
            )}
        </PatientLayout>
    );
};

export default PatientTelehealth;
