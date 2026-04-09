import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const MedicalParticles = ({ isOn }) => {
    const particleCount = 20;
    const particles = useMemo(() => {
        return Array.from({ length: particleCount }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 20 + 10,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5,
            type: Math.random() > 0.5 ? 'plus' : 'dot'
        }));
    }, []);

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: 0
        }}>
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: isOn ? [0, 0.4, 0] : 0,
                        y: ['0%', '-100%'],
                        x: [`${p.x}%`, `${p.x + (Math.random() * 10 - 5)}%`],
                        scale: isOn ? [1, 1.5, 1] : 1
                    }}
                    transition={{
                        opacity: { duration: 2, repeat: Infinity, delay: p.delay },
                        y: { duration: p.duration, repeat: Infinity, ease: 'linear', delay: p.delay },
                        x: { duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.delay },
                        scale: { duration: 3, repeat: Infinity }
                    }}
                    style={{
                        position: 'absolute',
                        top: '100%',
                        color: isOn ? '#10B981' : '#334155',
                        fontSize: p.size,
                        filter: isOn ? 'drop-shadow(0 0 5px rgba(16, 185, 129, 0.5))' : 'none'
                    }}
                >
                    {p.type === 'plus' ? '+' : '•'}
                </motion.div>
            ))}
        </div>
    );
};

export default MedicalParticles;

