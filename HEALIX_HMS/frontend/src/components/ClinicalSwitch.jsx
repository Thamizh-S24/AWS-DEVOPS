import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Power } from 'lucide-react';

const ClinicalSwitch = ({ isOn, onToggle }) => {
    const audioRef = useRef(new Audio("https://assets.codepen.io/605876/click.mp3"));

    const handleToggle = () => {
        audioRef.current.play().catch(() => { });
        onToggle(!isOn);
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '2rem',
            position: 'relative',
            zIndex: 10
        }}>
            <motion.div
                onClick={handleToggle}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                    width: '60px',
                    height: '100px',
                    background: '#0f172a',
                    border: `2px solid ${isOn ? '#00D4FF' : '#334155'}`,
                    borderRadius: '30px',
                    padding: '5px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: isOn ? 'flex-start' : 'flex-end',
                    alignItems: 'center',
                    boxShadow: isOn ? '0 0 20px rgba(0, 212, 255, 0.3)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
            >
                <motion.div
                    layout
                    style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: isOn ? 'linear-gradient(135deg, #00D4FF, #0082AD)' : '#1e293b',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: isOn ? 'white' : '#64748b'
                    }}
                >
                    <Power size={20} />
                </motion.div>
            </motion.div>
            <span style={{
                fontSize: '0.7rem',
                fontWeight: 900,
                letterSpacing: '2px',
                color: isOn ? '#00D4FF' : '#334155',
                textTransform: 'uppercase',
                marginTop: '0.5rem'
            }}>
                {isOn ? "Active" : "Standby"}
            </span>
        </div>
    );
};

export default ClinicalSwitch;

