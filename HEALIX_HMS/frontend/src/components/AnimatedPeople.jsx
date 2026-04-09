import React from 'react';
import { motion } from 'framer-motion';

const AuraCharacter = ({ isOn, type = 'patient', delay = 0 }) => {
    // Colors based on state
    const skinColor = "#e2e8f0";
    const clothesColor = isOn
        ? (type === 'patient' ? "#0d9488" : "#0ea5e9")
        : "#64748b";
    const highlightColor = isOn ? "#ffffff" : "#475569";

    return (
        <motion.div
            initial={false}
            animate={{
                rotateY: isOn ? [0, 10, -10, 0] : 0,
                y: isOn ? [0, -5, 0] : 0,
                filter: isOn ? 'grayscale(0%)' : 'grayscale(100%) brightness(0.7)',
                scale: isOn ? 1.1 : 1
            }}
            transition={{
                rotateY: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
                y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay },
                filter: { duration: 1 },
                scale: { duration: 1 }
            }}
            style={{
                perspective: '1000px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '120px',
                position: 'relative'
            }}
        >
            <svg width="100" height="150" viewBox="0 0 100 150">
                {/* Head */}
                <motion.circle
                    cx="50" cy="30" r="15"
                    fill={skinColor}
                    animate={{ y: isOn ? [0, -2, 0] : 0 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                />

                {/* Body (3D simulated with gradients) */}
                <motion.path
                    d="M35 50 Q 50 45, 65 50 L 70 100 Q 50 110, 30 100 Z"
                    fill={clothesColor}
                    stroke={highlightColor}
                    strokeWidth="0.5"
                    animate={{ d: isOn ? "M30 45 Q 50 40, 70 45 L 75 100 Q 50 115, 25 100 Z" : "M35 50 Q 50 45, 65 50 L 70 100 Q 50 110, 30 100 Z" }}
                />

                {/* Arms */}
                <motion.path
                    d="M35 50 L 20 80"
                    stroke={skinColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                    animate={{ rotate: isOn ? [-10, -40, -10] : 10 }}
                    transition={{ repeat: Infinity, duration: 2, delay }}
                />
                <motion.path
                    d="M65 50 L 80 80"
                    stroke={skinColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                    animate={{ rotate: isOn ? [10, 40, 10] : -10 }}
                    transition={{ repeat: Infinity, duration: 2, delay: delay + 0.5 }}
                />

                {/* Eyes */}
                <circle cx="45" cy="28" r="1.5" fill="#0f172a" />
                <circle cx="55" cy="28" r="1.5" fill="#0f172a" />

                {/* Mouth */}
                <motion.path
                    d={isOn ? "M42 35 Q 50 40, 58 35" : "M42 38 Q 50 35, 58 38"}
                    stroke="#0f172a"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                />
            </svg>

            {/* Shadow */}
            <motion.div
                animate={{
                    width: isOn ? '60px' : '40px',
                    opacity: isOn ? 0.3 : 0.1
                }}
                style={{
                    height: '10px',
                    background: 'black',
                    borderRadius: '50%',
                    marginTop: '-10px',
                    filter: 'blur(4px)'
                }}
            />
        </motion.div>
    );
};

const AnimatedPeople = ({ isOn }) => {
    return (
        <div style={{
            display: 'flex',
            gap: '3rem',
            justifyContent: 'center',
            alignItems: 'flex-end',
            height: '200px',
            marginBottom: '2rem'
        }}>
            <AuraCharacter isOn={isOn} type="patient" delay={0} />
            <AuraCharacter isOn={isOn} type="doctor" delay={0.3} />
            <AuraCharacter isOn={isOn} type="patient" delay={0.6} />
        </div>
    );
};

export default AnimatedPeople;
