import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, Plus } from 'lucide-react';
import ClinicalSwitch from './ClinicalSwitch';
import AnimatedPeople from './AnimatedPeople';
import MedicalParticles from './MedicalParticles';
import FloatingAuthNav from './FloatingAuthNav';

const DiagnosticLight = ({ isOn }) => {
    const themeColor = isOn ? "#0ea5e9" : "#334155";
    const glowIntensity = isOn ? "0 0 30px rgba(14, 165, 233, 0.4)" : "none";

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 5
        }}>
            {/* The Lamp Cable (Coming from top) */}
            <div style={{ width: '2px', height: '40px', background: '#334155' }} />

            <svg
                width="160"
                height="120"
                viewBox="0 0 160 120"
                style={{ overflow: 'visible', filter: `drop-shadow(${glowIntensity})` }}
            >
                <motion.g animate={{ y: isOn ? -2 : 0 }}>
                    <path
                        d="M20 100 C 20 20, 140 20, 140 100 L 150 110 L 10 110 Z"
                        fill={isOn ? "#1e293b" : "#0f172a"}
                        stroke={themeColor}
                        strokeWidth="2"
                    />
                    {/* Inner Lens Glow */}
                    <motion.ellipse
                        cx="80"
                        cy="110"
                        rx="60"
                        ry="8"
                        animate={{
                            fill: isOn ? "rgba(0, 212, 255, 0.8)" : "rgba(255,255,255,0.05)",
                            opacity: isOn ? [0.8, 1, 0.8] : 0.2
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />

                    {/* Face Plate icon */}
                    <Activity
                        x="72"
                        y="60"
                        size={16}
                        color={isOn ? "#0ea5e9" : "#1e293b"}
                        style={{ transition: 'color 0.3s' }}
                    />
                </motion.g>
            </svg>

            {/* Light Cone Effect */}
            <motion.div
                initial={false}
                animate={{
                    opacity: isOn ? 1 : 0,
                    scale: isOn ? 1 : 0.8,
                }}
                transition={{ duration: 0.5 }}
                style={{
                    position: 'absolute',
                    top: '100px',
                    width: '500px',
                    height: '600px',
                    background: 'radial-gradient(ellipse at top, rgba(14, 165, 233, 0.1) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: -1
                }}
            />
        </div>
    );
};

const StorytellingAuthLayout = ({ children, leftContent }) => {
    const [isLightOn, setIsLightOn] = useState(false);

    return (
        <div className="dark-theme" style={{
            display: 'flex',
            minHeight: '100vh',
            width: '100%',
            background: '#02040a',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Global Particle Background */}
            <MedicalParticles isOn={isLightOn} />

            {/* Floating Navigation */}
            <FloatingAuthNav isOn={isLightOn} />

            {/* Left Side: Aura Impact Story */}
            <div className="impact-sidebar" style={{
                flex: 1.2,
                display: 'flex',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(2, 4, 10, 0.9)',
                position: 'relative'
            }}>
                {/* Diagnostic Lamp on Left */}
                <DiagnosticLight isOn={isLightOn} />

                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '14rem 4rem 4rem 4rem', // Clear the navbar and diagnostic lamp
                    position: 'relative',
                    zIndex: 2
                }}>
                    {leftContent ? (
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {React.cloneElement(leftContent, { isOn: isLightOn })}

                            <div style={{ marginTop: '3rem' }}>
                                <ClinicalSwitch isOn={isLightOn} onToggle={setIsLightOn} />
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Transforming Characters */}
                            <AnimatedPeople isOn={isLightOn} />

                            {/* Story Text */}
                            <div style={{ maxWidth: '450px', textAlign: 'center', marginTop: '1rem' }}>
                                <motion.h3
                                    animate={{
                                        color: isLightOn ? '#FFFFFF' : '#475569',
                                        textShadow: isLightOn ? '0 0 20px rgba(14, 165, 233, 0.5)' : 'none'
                                    }}
                                    style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-1px' }}
                                >
                                    {isLightOn ? "Professional Clinical Hub" : "Clinical Standby"}
                                </motion.h3>
                                <motion.p
                                    animate={{ opacity: isLightOn ? 0.9 : 0.3 }}
                                    style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#94a3b8', marginBottom: '3rem' }}
                                >
                                    {isLightOn
                                        ? "Welcome to Aura medical management. Our professional hospital grid is active and ready for your clinical session."
                                        : "The hospital management system is in secure standby. Initialize the diagnostic link to proceed."
                                    }
                                </motion.p>
                            </div>

                            {/* The Switch */}
                            <ClinicalSwitch isOn={isLightOn} onToggle={setIsLightOn} />
                        </>
                    )}

                    {/* Status Indicator */}
                    <motion.div
                        animate={{ opacity: isLightOn ? 1 : 0.2 }}
                        style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
                    >
                        <Activity size={16} color={isLightOn ? "#00D4FF" : "#334155"} />
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '4px', color: '#64748b', textTransform: 'uppercase' }}>
                            Aura Medical Systems v4.0
                        </span>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Auth Portal */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '1.5rem',
                position: 'relative',
                background: isLightOn ? 'radial-gradient(circle at center, rgba(0, 212, 255, 0.05), transparent 70%)' : 'none',
                transition: 'background 1s ease'
            }}>
                <div className="auth-mobile-switch" style={{ marginBottom: '2rem' }}>
                    <ClinicalSwitch isOn={isLightOn} onToggle={setIsLightOn} />
                </div>

                <motion.div
                    initial={false}
                    animate={{
                        opacity: isLightOn ? 1 : 0.05,
                        filter: isLightOn ? 'blur(0px)' : 'blur(10px)',
                        scale: isLightOn ? 1 : 0.95,
                        pointerEvents: isLightOn ? 'all' : 'none'
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                >
                    {children}
                </motion.div>

                {/* Light Leak from Left */}
                <AnimatePresence>
                    {isLightOn && (
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 0.2, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: '200px',
                                background: 'linear-gradient(to right, rgba(14, 165, 233, 0.2), transparent)',
                                pointerEvents: 'none'
                            }}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Responsive Overrides */}
            <style>{`
                @media (max-width: 1024px) {
                    .impact-sidebar {
                        display: none !important;
                    }
                    .auth-portal-side {
                        padding: 1rem !important;
                    }
                    .auth-mobile-switch {
                        display: block !important;
                    }
                }
                .auth-mobile-switch {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default StorytellingAuthLayout;

