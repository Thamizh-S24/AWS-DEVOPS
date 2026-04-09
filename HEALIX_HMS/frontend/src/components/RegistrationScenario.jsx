import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Smartphone } from 'lucide-react';

const Character = ({ isOn, type = 'staff', activity = false }) => {
    const skinColor = isOn ? "#FDE047" : "#475569";
    const clothesColor = type === 'staff'
        ? (isOn ? "#0ea5e9" : "#1e293b")
        : (isOn ? "#0d9488" : "#334155");

    return (
        <motion.div
            animate={{
                x: activity ? [0, 10, 0] : 0,
                rotateY: isOn ? [0, 5, -5, 0] : 0,
                filter: isOn ? 'grayscale(0%)' : 'grayscale(100%) brightness(0.7)',
                scale: isOn ? 1 : 0.95
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: 'relative', perspective: '1000px' }}
        >
            <svg width="120" height="180" viewBox="0 0 120 180">
                {/* Body */}
                <motion.path
                    d="M30 160 L90 160 L80 60 L40 60 Z"
                    fill={clothesColor}
                />
                {/* Head */}
                <motion.circle
                    cx="60" cy="40" r="25"
                    fill={skinColor}
                />
                {/* Arms - Handing over activity */}
                {type === 'staff' ? (
                    <motion.path
                        d="M40 70 L20 110 L50 110"
                        stroke={skinColor}
                        strokeWidth="8"
                        strokeLinecap="round"
                        fill="none"
                        animate={{
                            d: activity ? "M40 70 L80 90 L100 90" : "M40 70 L20 110 L50 110"
                        }}
                    />
                ) : (
                    <motion.path
                        d="M80 70 L100 110 L70 110"
                        stroke={skinColor}
                        strokeWidth="8"
                        strokeLinecap="round"
                        fill="none"
                        animate={{
                            d: activity ? "M80 70 L40 90 L20 90" : "M80 70 L100 110 L70 110"
                        }}
                    />
                )}
                {/* Eyes */}
                <circle cx="50" cy="35" r="2" fill="#0f172a" />
                <circle cx="70" cy="35" r="2" fill="#0f172a" />
                {/* Smile / Outh */}
                <motion.path
                    d={isOn ? "M50 45 Q 60 55 70 45" : "M50 50 Q 60 50 70 50"}
                    stroke="#0f172a"
                    strokeWidth="2"
                    fill="none"
                />
            </svg>
        </motion.div>
    );
};

const RegistrationScenario = ({ isOn }) => {
    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <motion.div
                animate={{ opacity: isOn ? 1 : 0.5 }}
                style={{ textAlign: 'center', marginBottom: '3rem' }}
            >
                <div style={{
                    display: 'inline-flex',
                    padding: '0.5rem 1rem',
                    borderRadius: '50px',
                    background: 'rgba(0, 212, 255, 0.1)',
                    color: '#00D4FF',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginBottom: '1rem'
                }}>
                    Clinical Enrollment Live Preview
                </div>
            </motion.div>

            {/* Interaction Scene */}
            <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '4rem',
                height: '300px',
                position: 'relative',
                paddingBottom: '2rem'
            }}>
                {/* Staff */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Character isOn={isOn} type="staff" activity={isOn} />
                    <span style={{
                        marginTop: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: 900,
                        color: isOn ? '#00D4FF' : '#334155',
                        textTransform: 'uppercase'
                    }}>
                        Receptionist
                    </span>
                </div>

                {/* The Digital ID Card being passed */}
                <motion.div
                    animate={{
                        opacity: isOn ? 1 : 0,
                        x: isOn ? [0, 40, 80, 120] : 0,
                        y: isOn ? [0, -10, 0] : 0,
                        rotate: isOn ? [0, 10, -10, 0] : 0,
                        scale: isOn ? 1 : 0.5
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: 'absolute',
                        left: '100px',
                        top: '120px',
                        width: '50px',
                        height: '35px',
                        background: 'linear-gradient(135deg, #00D4FF, #10B981)',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 15px rgba(0, 212, 255, 0.5)',
                        zIndex: 10
                    }}
                >
                    <CreditCard size={18} color="white" />
                </motion.div>

                {/* Patient */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Character isOn={isOn} type="patient" activity={isOn} />
                    <span style={{
                        marginTop: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: 900,
                        color: isOn ? '#EC4899' : '#334155',
                        textTransform: 'uppercase'
                    }}>
                        New Enrollee
                    </span>
                </div>

                {/* Floor Reflection */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '10%',
                    right: '10%',
                    height: '2px',
                    background: isOn ? 'linear-gradient(to right, transparent, rgba(0, 212, 255, 0.5), transparent)' : 'rgba(255,255,255,0.05)',
                    boxShadow: isOn ? '0 0 20px rgba(0, 212, 255, 0.2)' : 'none'
                }} />
            </div>

            {/* Live Status Message */}
            <motion.div
                animate={{
                    opacity: isOn ? 1 : 0.2,
                    y: isOn ? 0 : 20
                }}
                style={{
                    marginTop: '3rem',
                    textAlign: 'center',
                    maxWidth: '350px'
                }}
            >
                <div style={{ display: 'flex', justifyCenter: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <motion.div
                        animate={{ scale: isOn ? [1, 1.2, 1] : 1 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        style={{ width: '8px', height: '8px', borderRadius: '50%', background: isOn ? '#10B981' : '#334155' }}
                    />
                    <h5 style={{
                        color: isOn ? 'white' : '#475569',
                        fontSize: '1rem',
                        fontWeight: 800,
                        margin: 0
                    }}>
                        {isOn ? "ID Issued Successfully" : "Awaiting Authorization"}
                    </h5>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }}>
                    {isOn
                        ? "Universal Health Profile created. Your clinic is now connected to the Aura global healthcare grid."
                        : "Initialize the system to begin secure data onboarding and profile creation."
                    }
                </p>
            </motion.div>
        </div>
    );
};

export default RegistrationScenario;
