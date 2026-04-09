import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, LogIn, UserPlus } from 'lucide-react';

const FloatingAuthNav = ({ isOn }) => {
    const location = useLocation();

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Login', path: '/login', icon: LogIn },
        { name: 'Register', path: '/register', icon: UserPlus },
    ];

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{
                position: 'absolute',
                top: '1.5rem',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 100,
                display: 'flex',
                gap: '0.5rem',
                background: 'rgba(10, 15, 25, 0.6)',
                backdropFilter: 'blur(15px)',
                padding: '0.4rem',
                borderRadius: '50px',
                border: `1px solid ${isOn ? 'rgba(0, 212, 255, 0.3)' : 'rgba(255,255,255,0.1)'}`,
                boxShadow: isOn ? '0 0 20px rgba(0, 212, 255, 0.2)' : '0 10px 30px rgba(0,0,0,0.4)',
                transition: 'all 0.5s ease',
                width: 'max-content',
                maxWidth: '90vw'
            }}
        >
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className="nav-item-auth"
                        style={{
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '25px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: isActive ? '#00D4FF' : '#94a3b8',
                            background: isActive ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                            transition: 'all 0.3s ease',
                            position: 'relative'
                        }}
                    >
                        <item.icon size={16} />
                        <span className="desktop-only" style={{ fontSize: '0.8rem' }}>{item.name}</span>
                        {isActive && (
                            <motion.div
                                layoutId="nav-glow"
                                style={{
                                    position: 'absolute',
                                    bottom: '-2px',
                                    left: '20%',
                                    right: '20%',
                                    height: '2px',
                                    background: '#00D4FF',
                                    borderRadius: '2px',
                                    boxShadow: '0 0 10px #00D4FF'
                                }}
                            />
                        )}
                    </Link>
                );
            })}
            <style>{`
                @media (max-width: 768px) {
                    .nav-item-auth {
                        padding: 0.6rem !important;
                        gap: 0 !important;
                    }
                }
            `}</style>
        </motion.nav>
    );
};

export default FloatingAuthNav;

