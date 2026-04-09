import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, Heart, Clipboard, Pill } from 'lucide-react';

const icons = [Activity, Shield, Heart, Clipboard, Pill];

const MedicalBackground2D = () => {
    // Generate random icons with floating animations
    const floatingIcons = useMemo(() => {
        return Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            Icon: icons[i % icons.length],
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 20 + 20,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5,
        }));
    }, []);

    // Generate pulse paths
    const pulsePaths = useMemo(() => {
        return Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 90}%`,
            left: `${Math.random() * 80}%`,
            width: `${Math.random() * 200 + 150}px`,
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 5,
        }));
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -1,
            background: 'hsl(var(--background))',
            overflow: 'hidden',
            pointerEvents: 'none'
        }}>
            {/* Technical Grid Overlay - Softened for Light Mode */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `
                    linear-gradient(rgba(14, 165, 233, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(14, 165, 233, 0.05) 1px, transparent 1px)
                `,
                backgroundSize: '100px 100px',
                opacity: 0.5
            }} />

            {/* Subtle radial gradients for depth */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                width: '80vw',
                height: '80vw',
                background: 'radial-gradient(circle, rgba(0, 212, 255, 0.07), transparent 70%)',
                opacity: 0.6
            }} />
            <div style={{
                position: 'absolute',
                bottom: '10%',
                right: '0%',
                width: '70vw',
                height: '70vw',
                background: 'radial-gradient(circle, rgba(168, 85, 247, 0.07), transparent 70%)',
                opacity: 0.6
            }} />

            {/* Floating Clinical Symbols */}
            {floatingIcons.map(({ id, Icon, x, y, size, duration, delay }) => (
                <motion.div
                    key={`icon-${id}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0.1, 0.3, 0.1],
                        y: [`${y}%`, `${y - 12}%`, `${y}%`],
                        rotate: [0, 15, -15, 0],
                        scale: 1,
                    }}
                    transition={{
                        duration: duration,
                        repeat: Infinity,
                        delay: delay,
                        ease: "linear"
                    }}
                    style={{
                        position: 'absolute',
                        left: `${x}%`,
                        top: `${y}%`,
                        color: id % 2 === 0 ? '#0ea5e9' : '#0d9488',
                        filter: 'drop-shadow(0 0 5px rgba(14, 165, 233, 0.1))'
                    }}
                >
                    <Icon size={size} strokeWidth={1.5} />
                </motion.div>
            ))}

            {/* Heartbeat Pulses */}
            {pulsePaths.map(({ id, top, left, width, duration, delay }) => (
                <div
                    key={`pulse-${id}`}
                    style={{
                        position: 'absolute',
                        top: top,
                        left: left,
                        width: width,
                        height: '1px',
                        overflow: 'hidden',
                        opacity: 0.15
                    }}
                >
                    <motion.div
                        animate={{
                            x: ['-100%', '250%'],
                        }}
                        transition={{
                            duration: duration,
                            repeat: Infinity,
                            delay: delay,
                            ease: "easeInOut"
                        }}
                        style={{
                            width: '40%',
                            height: '100%',
                            background: `linear-gradient(90deg, transparent, ${id % 2 === 0 ? '#0ea5e9' : '#0d9488'}, transparent)`,
                            boxShadow: `0 0 10px ${id % 2 === 0 ? '#0ea5e9' : '#0d9488'}`
                        }}
                    />
                </div>
            ))}

            {/* Background scanner lines (Very subtle) */}
            <motion.div
                animate={{
                    y: ['0%', '100%']
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.1), transparent)',
                    opacity: 0.2
                }}
            />
        </div>
    );
};

export default MedicalBackground2D;

