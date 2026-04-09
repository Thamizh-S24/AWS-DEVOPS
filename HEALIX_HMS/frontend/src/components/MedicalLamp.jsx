import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Activity } from 'lucide-react';
import gsap from 'gsap';

const MedicalLamp = ({ children, onToggle }) => {
    const [isOn, setIsOn] = useState(false);
    const cordRef = useRef(null);
    const audioRef = useRef(new Audio("https://assets.codepen.io/605876/click.mp3"));

    // Motion values for the pull cord
    const dragY = useMotionValue(0);
    const springY = useSpring(dragY, { stiffness: 300, damping: 30 });

    // Limits for dragging
    const dragConstraints = { top: 0, bottom: 60 };

    const handleDragEnd = (_, info) => {
        if (info.offset.y > 40) {
            const newState = !isOn;
            setIsOn(newState);
            audioRef.current.play().catch(() => { });
            if (onToggle) onToggle(newState);
        }
        dragY.set(0);
    };

    // Colors based on state
    const themeColor = isOn ? "#00D4FF" : "#334155";
    const glowIntensity = isOn ? "0 0 30px rgba(0, 212, 255, 0.4)" : "none";

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
            width: '100%',
            maxWidth: '500px',
            position: 'relative',
        }}>
            {/* The Medical Lamp SVG */}
            <svg
                width="200"
                height="280"
                viewBox="0 0 200 280"
                style={{ overflow: 'visible', filter: `drop-shadow(${glowIntensity})` }}
            >
                {/* Lamp Head (Technical/Medical look) */}
                <motion.g animate={{ y: isOn ? -5 : 0 }}>
                    <path
                        d="M40 120 C 40 40, 160 40, 160 120 L 180 160 L 20 160 Z"
                        fill={isOn ? "#1e293b" : "#0f172a"}
                        stroke={themeColor}
                        strokeWidth="2"
                    />
                    {/* Inner Lens Glow */}
                    <motion.ellipse
                        cx="100"
                        cy="160"
                        rx="70"
                        ry="10"
                        animate={{
                            fill: isOn ? "rgba(0, 212, 255, 0.8)" : "rgba(255,255,255,0.05)",
                            opacity: isOn ? [0.8, 1, 0.8] : 0.2
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />

                    {/* Face Plate */}
                    <rect x="80" y="80" width="40" height="20" rx="10" fill="#020617" stroke={themeColor} strokeWidth="1" />
                    <Activity
                        x="90"
                        y="82"
                        size={16}
                        color={isOn ? "#00D4FF" : "#1e293b"}
                        style={{ transition: 'color 0.3s' }}
                    />
                </motion.g>

                {/* The Pull Cord */}
                <g>
                    {/* Fixed line */}
                    <line x1="165" y1="140" x2="165" y2="180" stroke="#475569" strokeWidth="2" />

                    {/* Draggable part */}
                    <motion.g
                        drag="y"
                        dragConstraints={dragConstraints}
                        dragElastic={0.2}
                        onDragEnd={handleDragEnd}
                        style={{ y: dragY }}
                    >
                        {/* Interactive Cord Line */}
                        <motion.line
                            x1="165"
                            y1="180"
                            x2="165"
                            y2="240"
                            stroke={isOn ? "#00D4FF" : "#475569"}
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        {/* Pull Handle */}
                        <circle
                            cx="165"
                            cy="245"
                            r="8"
                            fill={isOn ? "#00D4FF" : "#1e293b"}
                            stroke={themeColor}
                            strokeWidth="2"
                            style={{ cursor: 'grab' }}
                        />
                    </motion.g>
                </g>

                {/* Base / Support */}
                <path d="M90 40 L 110 40 L 110 0 L 90 0 Z" fill="#334155" />
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
                    top: '160px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '600px',
                    height: '800px',
                    background: 'radial-gradient(ellipse at top, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0
                }}
            />

            {/* Content Slot (The Form) */}
            <motion.div
                initial={false}
                animate={{
                    opacity: isOn ? 1 : 0.05,
                    filter: isOn ? 'blur(0px)' : 'blur(4px)',
                    y: isOn ? 0 : 20,
                    pointerEvents: isOn ? 'all' : 'none'
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ width: '100%', zIndex: 1, position: 'relative' }}
            >
                {children}
            </motion.div>

            {/* Helper Hint */}
            {!isOn && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{
                        position: 'absolute',
                        top: '260px',
                        color: '#00D4FF',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        letterSpacing: '1px'
                    }}
                >
                    PULL CORD TO INITIALIZE
                </motion.p>
            )}
        </div>
    );
};

export default MedicalLamp;

