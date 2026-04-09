import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ReactTyped } from 'react-typed';
import CountUp from 'react-countup';
import Tilt from 'react-parallax-tilt';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Activity, Shield, Zap, ClipboardList,
    BarChart3, Truck, UserCircle, LogIn, ArrowRight, CheckCircle2,
    Globe, Database, Laptop, HeartBeat, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import MedicalBackground2D from '../components/MedicalBackground2D';
import HeroCommand from '../assets/hero-command.png';
import HeroImage3 from '../assets/hero-visual-3.png';
import HeroImage5 from '../assets/hero-visual-5.png';
import MainHero from '../assets/imagey.png';
import { AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const HeroTitle = () => {
    return (
        <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '140%',
                    height: '180%',
                    background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                    zIndex: -1
                }} />

            <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    fontWeight: 950,
                    lineHeight: 1.05,
                    margin: 0,
                    textAlign: 'center',
                    fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                    letterSpacing: '-0.04em',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <span style={{
                    color: '#0f172a',
                    display: 'block'
                }}>
                    HEALIX THE
                </span>
                <span style={{
                    background: 'linear-gradient(135deg, #0ea5e9, #0d9488)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'block'
                }}>
                    SMART HOSPITAL
                </span>
            </motion.h1>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc, color = "#0ea5e9" }) => (
    <Tilt perspective={2000} scale={1.02} transitionSpeed={1000} glareEnable glareMaxOpacity={0.1} glareColor="#ffffff" glarePosition="all">
        <div className="glass-v3" style={{
            padding: '3.5rem 2.8rem',
            height: '100%',
            borderRadius: '35px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.8rem',
            border: `1px solid rgba(14, 165, 233, 0.1)`,
            background: 'rgba(255,255,255,0.7)',
            boxShadow: '0 20px 40px rgba(14, 165, 233, 0.05)',
            transition: 'all 0.4s ease'
        }}>
            <div style={{ background: `${color}10`, width: 'fit-content', padding: '1.4rem', borderRadius: '22px', border: `1px solid ${color}20` }}>
                <Icon color={color} size={36} strokeWidth={2.5} />
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>{title}</h3>
            <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.8, fontWeight: 500 }}>{desc}</p>
        </div>
    </Tilt>
);

const RoleCard = ({ role, preview, color = "#0ea5e9" }) => (
    <div className="role-card-3d" style={{ height: '400px', width: '100%', zIndex: 1 }}>
        <div className="role-card-inner" style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d' }}>
            {/* Front Face */}
            <div className="role-face glass-v3" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderTop: `6px solid ${color}`,
                zIndex: 2,
                transform: 'translateZ(1px)',
                background: 'white',
                backfaceVisibility: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center'
            }}>
                <div style={{ padding: '2rem', borderRadius: '30px', background: `${color}08`, marginBottom: '1.5rem', border: `1px solid ${color}1A` }}>
                    <UserCircle size={64} color={color} />
                </div>
                <h4 style={{ fontSize: '2.2rem', fontWeight: 950, letterSpacing: '-1px', color: '#0f172a' }}>{role}</h4>
                <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: color, fontWeight: 950, fontSize: '0.75rem', letterSpacing: '1px' }}>
                    VIEW CAPABILITIES <ArrowRight size={14} />
                </div>
            </div>
            {/* Back Face */}
            <div className="role-face role-back" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `linear-gradient(135deg, #0f172a, ${color})`,
                padding: '3rem',
                transform: 'rotateY(180deg) translateZ(1px)',
                backfaceVisibility: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center'
            }}>
                <h4 style={{ marginBottom: '1.5rem', fontWeight: 950, fontSize: '1.8rem', color: 'white', letterSpacing: '-0.5px' }}>{role} Portal</h4>
                <p style={{ fontSize: '1.1rem', fontWeight: 500, opacity: 0.9, color: 'white', lineHeight: 1.6 }}>{preview}</p>
                <div style={{ marginTop: 'auto', width: '100%' }}>
                    <button className="btn-vitalize" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>ACCESS TERMINAL</button>
                </div>
            </div>
        </div>
    </div>
);

const HERO_IMAGES = [MainHero, HeroCommand, HeroImage3, HeroImage5];

const HeroCarousel = () => {
    const [index, setIndex] = React.useState(0);
    const [isTransitioning, setIsTransitioning] = React.useState(false);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setIndex((current) => (current + 1) % HERO_IMAGES.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const startTransition = (newIndex) => {
        if (newIndex === index || isTransitioning) return;
        setIndex(newIndex);
    };

    return (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', maxHeight: '700px', borderRadius: '50px', overflow: 'visible' }}>
            {/* Command-Center Aesthetic Frame */}
            <div style={{ position: 'absolute', inset: '-10px', padding: '10px', borderRadius: '60px', border: '1px solid rgba(14, 165, 233, 0.2)', background: 'linear-gradient(rgba(255,255,255,0.05), transparent)', zIndex: 0 }} />

            <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(14, 165, 233, 0.2)', background: '#f8fafc' }}>
                <AnimatePresence>
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, filter: 'blur(40px) brightness(1.2)' }}
                        animate={{ opacity: 1, filter: 'blur(0px) brightness(1)' }}
                        exit={{
                            filter: 'blur(40px) brightness(0.8)',
                            opacity: 0,
                            transition: { duration: 1.5, ease: "easeOut" }
                        }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        onAnimationStart={() => setIsTransitioning(true)}
                        onAnimationComplete={() => setIsTransitioning(false)}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                    >
                        {/* The Tilt container is slightly larger than parent to hide edges during rotation */}
                        <Tilt
                            perspective={2500}
                            scale={1.05}
                            transitionSpeed={1200}
                            glareEnable
                            glareMaxOpacity={0.05}
                            style={{
                                height: '110%',
                                width: '110%',
                                position: 'absolute',
                                top: '-5%',
                                left: '-5%'
                            }}
                        >
                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                {/* New Image (Base Layer - Next Slide) */}
                                <img
                                    src={HERO_IMAGES[index]}
                                    alt="Aura Display"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        display: 'block',
                                        imageRendering: 'crisp-edges'
                                    }}
                                />
                            </div>
                        </Tilt>
                    </motion.div>
                </AnimatePresence>

                {/* Subtle Cinematic HUD Overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(14, 165, 233, 0.015), transparent)', pointerEvents: 'none', zIndex: 5 }} />

                {/* Carousel Nav Dots - Industrial Pill Style */}
                <div style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '1.2rem', zIndex: 30, background: 'rgba(255,255,255,0.1)', padding: '0.8rem 1.5rem', borderRadius: '100px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {HERO_IMAGES.map((_, i) => (
                        <div
                            key={i}
                            onClick={() => startTransition(i)}
                            style={{
                                width: i === index ? '45px' : '10px',
                                height: '10px',
                                borderRadius: '5px',
                                background: i === index ? '#0ea5e9' : 'rgba(148, 163, 184, 0.4)',
                                boxShadow: i === index ? '0 0 20px rgba(14, 165, 233, 0.4)' : 'none',
                                transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                                cursor: 'pointer',
                                border: i === index ? 'none' : '1px solid rgba(255,255,255,0.1)'
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const LandingPage = () => {
    const workflowRef = useRef(null);
            const stats = {
                active_emergency_cases: 12,
            bed_occupancy: "84%",
            total_staff: 156,
            diagnostic_yield: "99.2%"
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
                gsap.utils.toArray('.workflow-step').forEach((step, i) => {
                    gsap.from(step, {
                        x: i % 2 === 0 ? -150 : 150,
                        opacity: 0,
                        filter: "blur(10px)",
                        duration: 1.5,
                        scrollTrigger: {
                            trigger: step,
                            start: 'top 85%',
                            end: 'top 40%',
                            scrub: 1.5
                        }
                    });
                });
        }, workflowRef);
        return () => ctx.revert();
    }, []);

            return (
            <div className="landing-root" style={{ background: 'transparent', position: 'relative', overflow: 'hidden' }}>
                <MedicalBackground2D />
                {/* Background Aesthetic Glows - Adjusted for Light Theme */}
                <div style={{ position: 'fixed', top: '10%', left: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(14, 165, 233, 0.1), transparent 70%)', zIndex: 0 }} />
                <div style={{ position: 'fixed', bottom: '10%', right: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(13, 148, 136, 0.1), transparent 70%)', zIndex: 0 }} />

                {/* Header / Nav */}
                <nav style={{ position: 'fixed', top: '1.25rem', left: '50%', transform: 'translateX(-50%)', width: '94%', maxWidth: '1400px', zIndex: 1000 }}>
                    <div className="glass-v4" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.6rem 2.2rem',
                        borderRadius: '100px',
                        border: '1px solid rgba(14, 165, 233, 0.1)',
                        background: 'rgba(255,255,255,0.8)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                        backdropFilter: 'blur(20px) saturate(180%)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ background: 'linear-gradient(135deg, #0ea5e9, #0d9488)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, boxShadow: '0 8px 16px rgba(14, 165, 233, 0.3)' }}>H</div>
                            <span style={{ fontWeight: 950, fontSize: '1.3rem', letterSpacing: '-0.5px', color: '#0f172a' }}>Healix</span>
                        </div>
                        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                            <a href="#global-network" className="desktop-only" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Network</a>
                            <a href="#compliance" className="desktop-only" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Compliance</a>
                            <Link to="/login">
                                <button style={{
                                    background: '#0f172a',
                                    border: 'none',
                                    padding: '1rem 2rem',
                                    borderRadius: '50px',
                                    color: 'white',
                                    fontWeight: 950,
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    boxShadow: '0 10px 20px rgba(15, 23, 42, 0.2)',
                                    letterSpacing: '0.5px'
                                }}>ENTER SYSTEM</button>
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Hero Section - Split Layout */}
                <section style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', padding: '0 5%', position: 'relative', zIndex: 1, paddingTop: '10rem', paddingBottom: '4rem' }}>
                    <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'center', width: '100%' }}>
                        <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        >
                            <HeroTitle />
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0ea5e9', margin: '1.5rem 0 2.5rem', textAlign: 'center', width: '100%', letterSpacing: '0.5px' }}>
                                <ReactTyped
                                    strings={[
                                        "Orchestrating Patient Lifecycles",
                                        "Empowering Clinical Intelligence",
                                        "Optimizing Hospital Infrastructure"
                                    ]}
                                    typeSpeed={60}
                                    backSpeed={40}
                                    loop
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                <p style={{ fontSize: '1.2rem', color: '#64748b', fontWeight: 500, maxWidth: '600px', marginBottom: '3.5rem', lineHeight: 1.8, textAlign: 'center' }} className="text-balance">
                                    Elevating clinical operations to an art form. Healix orchestrates the entire hospital lifecycle with real-time intelligence and cinematic precision.
                                </p>
                                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                                    <Link to="/login" style={{ textDecoration: 'none' }}>
                                        <button className="btn-neon-premium" style={{ borderRadius: '100px', padding: '1.1rem 2.8rem', fontSize: '1rem', background: '#0ea5e9', boxShadow: '0 15px 30px rgba(14, 165, 233, 0.25)' }}>SYSTEM DEPLOYMENT <ArrowRight style={{ marginLeft: '12px' }} size={20} /></button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                            style={{ position: 'relative', width: '100%', height: '100%' }}
                        >
                            <div style={{ position: 'absolute', inset: '-20px', background: 'var(--grad-main)', opacity: 0.1, filter: 'blur(60px)', borderRadius: '40px' }} />
                            <HeroCarousel />
                        </motion.div>
                    </div>
                </section>

                {/* Partners Logo Marquee */}
                <section id="global-network" style={{ borderTop: '1px solid rgba(14, 165, 233, 0.08)', borderBottom: '1px solid rgba(14, 165, 233, 0.08)', padding: '2rem 0', background: 'rgba(255,255,255,0.3)', zIndex: 1, position: 'relative' }}>
                    <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>
                        <motion.div
                            animate={{ x: [0, -1000] }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            style={{ display: 'flex', gap: '6rem', alignItems: 'center' }}
                        >
                            {[...Array(20)].map((_, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#64748b', fontWeight: 950, fontSize: '0.9rem', letterSpacing: '2px', opacity: 0.5 }}>
                                    <Shield size={20} /> CERTIFIED HMS PARTNER
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Advanced Metrics / Analytics (Emerald Theme) */}
                <section className="section-padding" style={{ padding: '4rem 5%', position: 'relative', zIndex: 1 }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05), transparent 70%)', zIndex: -1 }} />
                    <div className="glass-v2 responsive-card-padding" style={{ padding: '4rem 3rem', borderRadius: '60px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                        <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '4rem', textAlign: 'center' }}>
                            {[
                                { label: "Active Admissions", val: 14500, color: "#0ea5e9" },
                                { label: "Available Capacity", val: 580, color: "#0d9488" },
                                { label: "Critical Response", val: 92, color: "#ef4444" },
                                { label: "Diagnostic Yield", val: 5690, color: "#0ea5e9" }
                            ].map((stat, i) => (
                                <div key={i}>
                                    <h2 style={{ fontSize: '4.5rem', color: stat.color, fontWeight: 950, marginBottom: '0.5rem' }}>
                                        <CountUp end={stat.val} duration={4} enableScrollSpy />
                                        {stat.val > 1000 ? "+" : ""}
                                    </h2>
                                    <p style={{ textTransform: 'uppercase', letterSpacing: '4px', opacity: 0.5, fontWeight: 800, fontSize: '0.9rem' }}>{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Bento Grid Showcase */}
                <section className="section-padding" style={{ padding: '6rem 5%', maxWidth: '1600px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 950, letterSpacing: '-3px', color: '#0f172a', marginBottom: '1.2rem', lineHeight: 1 }}>Infrastructure Intelligence</h2>
                        <p style={{ fontSize: '1.4rem', color: '#64748b', maxWidth: '800px', fontWeight: 500 }}>A decentralized orchestration layer built for clinical precision and high-fidelity logistics.</p>
                    </div>

                    <div className="bento-grid">
                        <div className="bento-item" style={{ gridColumn: 'span 8', gridRow: 'span 2', padding: '4rem' }}>
                            <div style={{ background: 'rgba(14, 165, 233, 0.1)', width: '80px', height: '80px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem' }}>
                                <Zap color="#0ea5e9" size={40} />
                            </div>
                            <h3 style={{ fontSize: '2.8rem', fontWeight: 950, marginBottom: '1.5rem', letterSpacing: '-1px' }}>Emergency Neural Network</h3>
                            <p style={{ fontSize: '1.2rem', color: '#475569', maxWidth: '500px', lineHeight: 1.6 }}>Predictive triage and automated emergency response protocols that adapt in real-time to casualty surges and infrastructure load.</p>
                            <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem' }}>
                                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '15px', border: '1px solid #e2e8f0', flex: 1 }}>
                                    <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 950, color: '#0ea5e9' }}>{stats.active_emergency_cases}</span>
                                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 800 }}>LIVE ER LOAD</span>
                                </div>
                                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '15px', border: '1px solid #e2e8f0', flex: 1 }}>
                                    <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 950, color: '#10b981' }}>99.9%</span>
                                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 800 }}>RESPONSE TRUTH</span>
                                </div>
                            </div>
                        </div>

                        <div className="bento-item" style={{ gridColumn: 'span 4', padding: '3rem' }}>
                            <Shield color="#0d9488" size={32} style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ fontSize: '2.2rem', fontWeight: 950, marginBottom: '1rem', letterSpacing: '-0.5px' }}>Quantum EHR</h3>
                            <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 500 }}>Distributed ledger security for patient health records.</p>
                        </div>

                        <div className="bento-item" style={{ gridColumn: 'span 4', padding: '3rem' }}>
                            <Activity color="#ef4444" size={32} style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ fontSize: '2.2rem', fontWeight: 950, marginBottom: '1rem', letterSpacing: '-0.5px' }}>Precision Diagnostics</h3>
                            <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 500 }}>AI-driven imaging analysis with zero-latency sync.</p>
                        </div>

                        <div className="bento-item" style={{ gridColumn: 'span 4', padding: '3rem' }}>
                            <BarChart3 color="#8b5cf6" size={32} style={{ marginBottom: '1.5rem' }} />
                            <h4 style={{ fontSize: '1.6rem', fontWeight: 950, marginBottom: '1rem' }}>BI-Engine</h4>
                            <div style={{ height: '60px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                                {[40, 70, 45, 90, 65, 80].map((h, i) => <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} style={{ width: '15%', background: '#8b5cf6', borderRadius: '4px 4px 0 0', opacity: 0.3 + (i * 0.1) }} />)}
                            </div>
                        </div>

                        <div className="bento-item" style={{ gridColumn: 'span 4', padding: '3rem' }}>
                            <Truck color="#f59e0b" size={32} style={{ marginBottom: '1.5rem' }} />
                            <h4 style={{ fontSize: '1.6rem', fontWeight: 950, marginBottom: '1rem' }}>Fleet-Sync</h4>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Real-time GPS ambulance dispatch.</p>
                        </div>

                        <div className="bento-item" style={{ gridColumn: 'span 4', padding: '3rem' }}>
                            <ClipboardList color="#0ea5e9" size={32} style={{ marginBottom: '1.5rem' }} />
                            <h4 style={{ fontSize: '1.6rem', fontWeight: 950, marginBottom: '1rem' }}>Auto-Scale</h4>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Neural bed mapping and resource optimization.</p>
                        </div>
                    </div>
                </section>

                {/* Workflow Pipeline - Refined */}
                <section ref={workflowRef} className="section-padding" style={{ padding: '6rem 5%', display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.03), transparent 80%)', zIndex: -1 }} />
                    <div className="workflow-line" style={{ left: '50%', width: '1px', opacity: 0.1 }} />

                    <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                        <h2 style={{ fontSize: '4.5rem', fontWeight: 950, letterSpacing: '-2px', color: '#0f172a' }}>The Care Pipeline</h2>
                        <p style={{ fontSize: '1.2rem', color: '#64748b', fontWeight: 500 }}>High-precision diagnostic orchestration across the clinical lifecycle.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                        {[
                            { title: "Patient Admission", desc: "Biometric check-in and automated triage classification using neural modeling.", side: "left", icon: <UserCircle /> },
                            { title: "Clinical Analysis", desc: "Digital vitals acquisition and specialist coordination via the Aura mesh.", side: "right", icon: <Activity /> },
                            { title: "Resource Mapping", desc: "Automated room assignment and synchronized nursing link-up.", side: "left", icon: <Database /> },
                            { title: "Treatment Cycle", desc: "Intelligent medication dispensing and 24/7 holographic monitoring.", side: "right", icon: <Shield /> }
                        ].map((step, idx) => (
                            <div key={idx} className={`workflow-step ${step.side}`} style={{ position: 'relative', display: 'flex', justifyContent: step.side === 'left' ? 'flex-start' : 'flex-end', width: '100%' }}>
                                <div className="glass-v3" style={{ width: '45%', padding: '3.5rem', borderRadius: '40px', borderLeft: step.side === 'left' ? '6px solid #0ea5e9' : 'none', borderRight: step.side === 'right' ? '6px solid #0d9488' : 'none' }}>
                                    <div style={{ color: step.side === 'left' ? '#0ea5e9' : '#0d9488', marginBottom: '2rem' }}>{step.icon && React.cloneElement(step.icon, { size: 48 })}</div>
                                    <h3 style={{ fontSize: '2rem', fontWeight: 950, marginBottom: '1.5rem', color: '#0f172a' }}>{step.title}</h3>
                                    <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.7, fontWeight: 500 }}>{step.desc}</p>
                                </div>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '24px', height: '24px', borderRadius: '50%', background: 'white', border: `4px solid ${step.side === 'left' ? '#0ea5e9' : '#0d9488'}`, boxShadow: `0 0 20px ${step.side === 'left' ? '#0ea5e944' : '#0d948844'}` }} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Role Flip Grid - Refined */}
                <section className="section-padding" style={{ padding: '6rem 5%', maxWidth: '1600px', margin: '0 auto', position: 'relative' }}>
                    <div style={{ position: 'absolute', bottom: '0', left: '0', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(14, 165, 233, 0.05), transparent 70%)', zIndex: -1 }} />
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: 950, letterSpacing: '-2px', color: '#0f172a' }}>Enterprise Role Hub</h2>
                        <p style={{ fontSize: '1.2rem', color: '#64748b', fontWeight: 500 }}>Bespoke access tiers for every clinical and administrative stakeholder.</p>
                    </div>
                    <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '3rem' }}>
                        <RoleCard role="SuperAdmin" preview="Centralized system control and operational governance." color="#0ea5e9" />
                        <RoleCard role="Consultant" preview="Clinical decision support and patient timeline view." color="#0ea5e9" />
                        <RoleCard role="Clinical Nurse" preview="Point-of-care vital entry and ward status monitoring." color="#0ea5e9" />
                        <RoleCard role="Coordinator" preview="Patient scheduling and revenue cycle management." color="#0ea5e9" />
                        <RoleCard role="Inventory Lead" preview="Automated stock replenishment and pharmacy control." color="#0ea5e9" />
                        <RoleCard role="Pathologist" preview="Digital test reporting and laboratory throughput." color="#0ea5e9" />
                    </div>
                </section>

                {/* System Integrity Widget Section */}
                <section id="compliance" style={{ padding: '4rem 5%', background: 'white', position: 'relative', zIndex: 1 }}>
                    <div className="glass-v3" style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem', borderRadius: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4rem' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#10b981', fontWeight: 950, fontSize: '0.85rem', letterSpacing: '2px', marginBottom: '1.5rem' }}>
                                <ShieldCheck size={20} /> GLOBAL CLUSTER STATUS: OPERATIONAL
                            </div>
                            <h2 style={{ fontSize: '3rem', fontWeight: 950, color: '#0f172a', marginBottom: '1.5rem', letterSpacing: '-1px' }}>System Integrity First</h2>
                            <p style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: 500, lineHeight: 1.6 }}>Enterprise-grade encryption and multi-node synchronization ensure your clinical data remains indestructible and accessible across all global clusters.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '3rem' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#0f172a' }}>99.99%</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 800 }}>UPTIME SLA</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#0f172a' }}>12ms</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 800 }}>AVG LATENCY</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#0f172a' }}>256+</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 800 }}>ACTIVE NODES</div>
                            </div>
                        </div>
                    </div>
                </section>

                <section style={{ padding: '6rem 5% 10rem', textAlign: 'center' }}>
                    <div className="glass-v3" style={{ padding: '6rem 2rem', borderRadius: '80px', background: 'radial-gradient(circle at top center, rgba(14, 165, 233, 0.1), transparent)', border: 'none' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 950, marginBottom: '1.5rem', color: '#0f172a', letterSpacing: '-3px' }}>Ready for Deployment?</h2>
                        <p style={{ fontSize: '1.3rem', opacity: 0.7, marginBottom: '3rem', maxWidth: '800px', margin: '0 auto 3rem', color: '#1e293b', fontWeight: 500 }}>Join the next generation of healthcare infrastructure with Healix.</p>
                        <Link to="/login">
                            <button className="btn-neon-premium" style={{ fontSize: '1.2rem', padding: '1.2rem 4rem' }}>LOGIN TO SYSTEM SPACE</button>
                        </Link>
                    </div>
                </section>
            </div>
            );
};

            export default LandingPage;

