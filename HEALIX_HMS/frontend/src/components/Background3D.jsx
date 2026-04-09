import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, PerspectiveCamera, Float, Line } from '@react-three/drei';
import * as THREE from 'three';

const PulseCross = ({ position }) => {
    const meshRef = useRef();
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            // Pulsing opacity: "appearing and going"
            meshRef.current.children[0].material.opacity = (Math.sin(t * 1.5 + position[0]) + 1) / 2 * 0.4;
            meshRef.current.children[1].material.opacity = (Math.sin(t * 1.5 + position[0]) + 1) / 2 * 0.4;
        }
    });

    return (
        <group ref={meshRef} position={position}>
            <mesh>
                <boxGeometry args={[0.8, 0.15, 0.15]} />
                <meshStandardMaterial color="#FFFFFF" transparent opacity={0.4} emissive="#FFFFFF" emissiveIntensity={2} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <boxGeometry args={[0.8, 0.15, 0.15]} />
                <meshStandardMaterial color="#FFFFFF" transparent opacity={0.4} emissive="#FFFFFF" emissiveIntensity={2} />
            </mesh>
        </group>
    );
};

const MedicalHubHologram = () => {
    const groupRef = useRef();
    const ring1 = useRef();
    const ring2 = useRef();
    const ring3 = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.y = t * 0.1;
        }
        if (ring1.current) ring1.current.rotation.x = t * 0.3;
        if (ring2.current) ring2.current.rotation.y = t * 0.2;
        if (ring3.current) ring3.current.rotation.z = t * 0.4;
    });

    const nodePositions = useMemo(() => {
        const p = [];
        for (let i = 0; i < 50; i++) {
            const phi = Math.acos(-1 + (2 * i) / 50);
            const theta = Math.sqrt(50 * Math.PI) * phi;
            p.push([Math.sin(phi) * Math.cos(theta) * 4, Math.sin(phi) * Math.sin(theta) * 4, Math.cos(phi) * 4]);
        }
        return p;
    }, []);

    const crossPositions = useMemo(() => {
        return Array.from({ length: 12 }).map(() => [
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 15
        ]);
    }, []);

    return (
        <group ref={groupRef}>
            {/* Core Neural Sphere */}
            <mesh>
                <sphereGeometry args={[4.2, 64, 64]} />
                <meshStandardMaterial color="#00D4FF" wireframe transparent opacity={0.05} />
            </mesh>

            {/* Orbiting Nodes with Dual Color */}
            {nodePositions.map((pos, i) => (
                <Float key={i} speed={2} rotationIntensity={1} floatIntensity={1}>
                    <mesh position={pos}>
                        <sphereGeometry args={[0.1, 16, 16]} />
                        <meshStandardMaterial
                            color={i % 2 === 0 ? "#00D4FF" : "#a855f7"}
                            emissive={i % 2 === 0 ? "#00D4FF" : "#a855f7"}
                            emissiveIntensity={2}
                        />
                    </mesh>
                </Float>
            ))}

            {/* Data Rings - Attractive Dual Tone */}
            <mesh ref={ring1} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[6, 0.03, 16, 100]} />
                <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1.5} />
            </mesh>
            <mesh ref={ring2} rotation={[0, Math.PI / 2, 0]}>
                <torusGeometry args={[6.5, 0.03, 16, 100]} />
                <meshStandardMaterial color="#00D4FF" emissive="#00D4FF" emissiveIntensity={1.5} />
            </mesh>
            <mesh ref={ring3}>
                <torusGeometry args={[7, 0.03, 16, 100]} />
                <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.5} transparent opacity={0.2} />
            </mesh>

            {/* Floating Medical Crosses with "Appearing and Going" effect */}
            {crossPositions.map((pos, i) => (
                <Float key={`cross-${i}`} speed={1.5}>
                    <PulseCross position={pos} />
                </Float>
            ))}
        </group>
    );
};

const BioHelix = () => {
    const helixRef = useRef();
    useFrame((state) => {
        helixRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    });

    const spheres = useMemo(() => {
        const p = [];
        for (let i = 0; i < 40; i++) {
            const y = (i - 20) * 0.3;
            const angle = i * 0.4;
            p.push([Math.cos(angle) * 2, y, Math.sin(angle) * 2]);
            p.push([Math.cos(angle + Math.PI) * 2, y, Math.sin(angle + Math.PI) * 2]);
        }
        return p;
    }, []);

    return (
        <group ref={helixRef}>
            {spheres.map((pos, i) => (
                <mesh key={i} position={pos}>
                    <sphereGeometry args={[0.15, 16, 16]} />
                    <meshStandardMaterial color={i % 2 === 0 ? "#00D4FF" : "#a855f7"} emissive={i % 2 === 0 ? "#00D4FF" : "#a855f7"} emissiveIntensity={2} />
                </mesh>
            ))}
            <Stars radius={50} count={2000} factor={4} />
        </group>
    );
};

const SecureShield = () => {
    const shieldRef = useRef();
    useFrame((state) => {
        shieldRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    });

    return (
        <group ref={shieldRef}>
            <mesh>
                <cylinderGeometry args={[4, 4, 0.5, 6, 1]} />
                <meshStandardMaterial color="#00D4FF" wireframe transparent opacity={0.1} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[4.5, 0.05, 16, 100]} />
                <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2} />
            </mesh>
            <Stars radius={100} count={3000} />
        </group>
    );
};

const SupplyFlow = () => {
    const pointsRef = useRef();
    useFrame((state) => {
        pointsRef.current.rotation.z = state.clock.getElapsedTime() * 0.2;
    });

    return (
        <group ref={pointsRef}>
            {Array.from({ length: 20 }).map((_, i) => (
                <Float key={i} speed={2} position={[(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10]}>
                    <mesh>
                        <capsuleGeometry args={[0.2, 0.5, 4, 8]} />
                        <meshStandardMaterial color={i % 2 === 0 ? "#00D4FF" : "#a855f7"} emissive={i % 2 === 0 ? "#00D4FF" : "#a855f7"} emissiveIntensity={1} />
                    </mesh>
                </Float>
            ))}
            <Stars radius={50} count={1000} />
        </group>
    );
};

const GlobalNetwork = () => {
    const globeRef = useRef();
    useFrame((state) => {
        globeRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    });

    return (
        <group ref={globeRef}>
            <mesh>
                <sphereGeometry args={[5, 32, 32]} />
                <meshStandardMaterial color="#00D4FF" wireframe transparent opacity={0.1} />
            </mesh>
            <mesh>
                <sphereGeometry args={[5.2, 32, 32]} />
                <meshStandardMaterial color="#a855f7" wireframe transparent opacity={0.05} />
            </mesh>
            <Stars radius={100} count={5000} />
        </group>
    );
};

const HeartbeatLine = () => {
    const lineRef = useRef();
    const points = useMemo(() => {
        const p = [];
        for (let x = -20; x < 20; x += 0.2) {
            let y = 0;
            const modX = (x + 20) % 10;
            if (modX > 1 && modX < 1.2) y = 1.5;
            else if (modX >= 1.2 && modX < 1.3) y = -0.5;
            else if (modX >= 1.3 && modX < 1.5) y = 4;
            else if (modX >= 1.5 && modX < 1.6) y = -1;
            else if (modX >= 1.6 && modX < 2) y = 0.5;
            p.push(new THREE.Vector3(x, y, 0));
        }
        return p;
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (lineRef.current) {
            lineRef.current.position.x = ((t * 2) % 10) - 5;
        }
    });

    return (
        <group>
            <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
                <Line ref={lineRef} points={points} color="#00D4FF" lineWidth={2} transparent opacity={0.4} />
            </Float>
            <Stars radius={50} depth={50} count={1000} factor={2} saturation={0} fade speed={1} />
        </group>
    );
};

const Background3D = ({ variant = 'default', sceneIndex: initialSceneIndex = 0 }) => {
    const isLanding = variant === 'landing';
    const [sceneIndex, setSceneIndex] = React.useState(initialSceneIndex);

    React.useEffect(() => {
        const handleSceneChange = (e) => {
            if (isLanding) setSceneIndex(e.detail);
        };
        window.addEventListener('hms-scene-change', handleSceneChange);
        return () => window.removeEventListener('hms-scene-change', handleSceneChange);
    }, [isLanding]);

    const renderLandingScene = () => {
        switch (sceneIndex) {
            case 0: return <MedicalHubHologram />;
            case 1: return <BioHelix />;
            case 2: return <HeartbeatLine />;
            case 3: return <SecureShield />;
            case 4: return <SupplyFlow />;
            case 5: return <GlobalNetwork />;
            default: return <MedicalHubHologram />;
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -1,
            background: isLanding ? '#02040a' : 'transparent',
            pointerEvents: 'none',
            transition: 'background 1s ease'
        }}>
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 15]} />
                <ambientLight intensity={0.7} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                {isLanding ? (
                    <>
                        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                        {renderLandingScene()}
                    </>
                ) : (
                    <HeartbeatLine />
                )}
            </Canvas>
        </div>
    );
};

export default Background3D;

