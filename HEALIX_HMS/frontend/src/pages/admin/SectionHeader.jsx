import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export const StatCard = ({ icon, label, value, trend, color, subtext, onClick }) => (
    <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        onClick={onClick}
        className="glass-v3"
        style={{
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: onClick ? 'pointer' : 'default'
        }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
            <div style={{
                padding: '1rem',
                borderRadius: '20px',
                background: `linear-gradient(135deg, ${color}15, ${color}05)`,
                color: color,
                boxShadow: `0 8px 16px ${color}10`,
                border: `1px solid ${color}20`
            }}>
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: color,
                background: `${color}10`,
                padding: '0.6rem 1rem',
                borderRadius: '50px',
                fontSize: '0.75rem',
                fontWeight: 900,
                letterSpacing: '0.5px',
                border: `1px solid ${color}15`
            }}>
                <TrendingUp size={14} />
                {trend}
            </div>
        </div>

        <div style={{ zIndex: 1, marginTop: '2rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 800, marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '1.5px', opacity: 0.8 }}>{label}</p>
            <h3 style={{ fontSize: '2.8rem', fontWeight: 950, color: '#0f172a', margin: 0, letterSpacing: '-2px', lineHeight: 1 }}>{value}</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.8rem', fontWeight: 600, letterSpacing: '-0.2px' }}>{subtext}</p>
        </div>

        {/* Decorative Background Icon */}
        <div style={{
            position: 'absolute',
            right: '-15%',
            bottom: '-15%',
            opacity: 0.03,
            color: color,
            pointerEvents: 'none',
            transform: 'rotate(-15deg)'
        }}>
            {React.cloneElement(icon, { size: 180 })}
        </div>

        {/* Subtle Bottom Glow */}
        <div style={{
            position: 'absolute',
            bottom: 0,
            left: '10%',
            right: '10%',
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
            filter: 'blur(2px)'
        }} />
    </motion.div>
);

const SectionHeader = ({ title, subtitle, action }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem', padding: '0 0.5rem' }}>
        <div style={{ position: 'relative' }}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: '80px' }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{
                    height: '6px',
                    background: 'var(--grad-main)',
                    borderRadius: '3px',
                    marginBottom: '1.2rem',
                    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.2)'
                }}
            />
            <h2 style={{ fontSize: '2.8rem', fontWeight: 950, color: '#0f172a', margin: 0, letterSpacing: '-1.5px', lineHeight: 1 }}>{title}</h2>
            <p style={{ color: '#64748b', fontSize: '1.2rem', marginTop: '1rem', fontWeight: 600, opacity: 0.8, letterSpacing: '-0.3px' }}>{subtitle}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {action}
        </div>
    </div>
);

export default SectionHeader;

