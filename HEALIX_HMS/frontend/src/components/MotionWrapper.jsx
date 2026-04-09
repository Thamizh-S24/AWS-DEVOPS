import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const drapeVariants = {
    initial: {
        y: '-100%',
        opacity: 0,
    },
    in: {
        y: 0,
        opacity: 1,
    },
    out: {
        y: '100%',
        opacity: 0,
    },
};

const standardVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
};

const MotionWrapper = ({ children }) => {
    const location = useLocation();

    // Define routes that use the drape effect
    const drapeRoutes = ['/login', '/register'];
    const isDrapeRoute = drapeRoutes.includes(location.pathname);

    return (
        <div style={{ width: '100%', minHeight: '100vh', overflowX: 'hidden', background: '#fdfdfd', position: 'relative' }}>
            <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={isDrapeRoute ? drapeVariants : standardVariants}
                transition={{
                    type: 'tween',
                    ease: 'easeInOut',
                    duration: 0.6
                }}
                style={{
                    width: '100%',
                    minHeight: '100vh',
                    position: 'relative',
                    zIndex: isDrapeRoute ? 10 : 1
                }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default MotionWrapper;
