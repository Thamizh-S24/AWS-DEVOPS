import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Brain, Send, User, Bot, Sparkles, 
    AlertTriangle, Shield, ChevronRight, Stethoscope
} from 'lucide-react';
import PatientLayout from '../../components/PatientLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PatientSectionHeader = ({ title, subtitle }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 950, color: '#1e3a8a', margin: 0, letterSpacing: '-1px' }}>{title}</h2>
            <div style={{ height: '5px', width: '80px', background: 'linear-gradient(90deg, #1e40af, #3b82f6)', borderRadius: '2px', margin: '0.8rem 0' }} />
            <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.4rem', fontWeight: 500 }}>{subtitle}</p>
        </div>
    </div>
);

const PatientAura = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        { id: 1, role: 'aura', content: `Hello ${user?.username || 'Patient'}. I am AURA, your Clinical Triage Assistant. How are you feeling today? Please describe any symptoms or health concerns.` }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = { id: Date.now(), role: 'user', content: input };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput('');
        setIsTyping(true);

        try {
            // Call Real OpenRouter LLM via Backend
            const res = await api.post('/patient/aura/chat', {
                messages: updatedMessages.map(m => ({
                    role: m.role === 'aura' ? 'assistant' : 'user',
                    content: m.content
                }))
            });

            const auraContent = res.data.content;
            const auraMsg = { id: Date.now() + 1, role: 'aura', content: auraContent };
            setMessages(prev => [...prev, auraMsg]);
            setIsTyping(false);

            // Persist Clinical Triage to Healix Repository
            // We use simple logic to determine urgency from the LLM response
            const isHigh = auraContent.toLowerCase().includes("emergency") || auraContent.toLowerCase().includes("immediate");
            
            api.post('/patient/triage', {
                patient_id: user?.username || 'P-001',
                summary: auraContent,
                urgency: isHigh ? "High" : "Medium",
                suggested_specialty: auraContent.toLowerCase().includes("heart") ? "Cardiology" : 
                                    auraContent.toLowerCase().includes("bone") ? "Orthopedics" : "General Medicine"
            }).catch(err => console.error("Triage Save Error", err));

        } catch (err) {
            console.error("AI Node Error", err);
            setMessages(prev => [...prev, { id: Date.now(), role: 'aura', content: "I'm having trouble connecting to the medical cloud. Please try again in 1 minute." }]);
            setIsTyping(false);
        }
    };

    return (
        <PatientLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', height: 'calc(100vh - 200px)' }}>
                <PatientSectionHeader 
                    title="AURA Health Chat" 
                    subtitle="Describe your symptoms for a quick check-up and advice"
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem', flex: 1, minHeight: 0 }}>
                    
                    {/* Chat Interface */}
                    <div style={{ display: 'flex', flexDirection: 'column', background: 'white', borderRadius: '30px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.05)' }}>
                        <div style={{ padding: '1.5rem 2.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(to right, #f8fafc, white)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                        <Brain size={22} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontWeight: 950, color: '#0f172a', fontSize: '1.1rem' }}>AURA Health Assistant</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                                            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b' }}>ONLINE | SECURE</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ padding: '0.5rem 1rem', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.05)', color: '#8b5cf6', fontSize: '0.75rem', fontWeight: 950 }}>
                                    ENCRYPTED CHAT
                                </div>
                        </div>

                        {/* Messages Area */}
                        <div 
                            ref={scrollRef}
                            style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}
                        >
                            {messages.map((m) => (
                                <motion.div 
                                    key={m.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ 
                                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                        maxWidth: '80%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: m.role === 'user' ? 'flex-end' : 'flex-start',
                                        gap: '0.8rem'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                                        <div style={{ 
                                            width: '32px', height: '32px', borderRadius: '10px', 
                                            background: m.role === 'user' ? '#0f172a' : 'rgba(139, 92, 246, 0.1)',
                                            color: m.role === 'user' ? 'white' : '#8b5cf6',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                        </div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 950, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            {m.role === 'user' ? 'You' : 'AURA'}
                                        </span>
                                    </div>
                                    <div style={{ 
                                        padding: '1.2rem 1.6rem', 
                                        borderRadius: '20px', 
                                        borderBottomRightRadius: m.role === 'user' ? '4px' : '20px',
                                        borderBottomLeftRadius: m.role === 'aura' ? '4px' : '20px',
                                        background: m.role === 'user' ? '#0ea5e9' : '#f8fafc',
                                        color: m.role === 'user' ? 'white' : '#1e293b',
                                        fontSize: '1rem',
                                        lineHeight: 1.6,
                                        fontWeight: 600,
                                        boxShadow: m.role === 'user' ? '0 10px 20px rgba(14, 165, 233, 0.2)' : 'none',
                                        border: m.role === 'aura' ? '1px solid #f1f5f9' : 'none'
                                    }}>
                                        {m.content}
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <div style={{ display: 'flex', gap: '0.4rem', padding: '1rem' }}>
                                    {[0, 1, 2].map(i => (
                                        <motion.div 
                                            key={i}
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                                            style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} style={{ padding: '2rem 2.5rem', background: 'white', borderTop: '1px solid #f1f5f9' }}>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Describe your symptoms or ask a medical question..."
                                    style={{ 
                                        width: '100%', padding: '1.2rem 1.5rem', paddingRight: '4rem',
                                        borderRadius: '18px', border: '2px solid #f1f5f9',
                                        background: '#f8fafc', fontSize: '1rem', fontWeight: 600,
                                        outline: 'none', transition: 'border-color 0.2s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                                    onBlur={(e) => e.target.style.borderColor = '#f1f5f9'}
                                />
                                <button 
                                    type="submit"
                                    style={{ 
                                        position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                                        width: '40px', height: '40px', borderRadius: '12px', background: '#8b5cf6',
                                        color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.scale = 1.05}
                                    onMouseLeave={(e) => e.currentTarget.style.scale = 1}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            <p style={{ margin: '1rem 0 0 0', textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 800 }}>
                                AURA is a triage tool and not a substitute for clinical diagnosis. In case of emergency, call 911.
                            </p>
                        </form>
                    </div>

                    {/* Sidebar: Insights & Escalation */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="stat-card-white" style={{ padding: '2rem', borderLeft: '6px solid #ef4444' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#ef4444', marginBottom: '1rem' }}>
                                <AlertTriangle size={20} />
                                <h4 style={{ margin: 0, fontWeight: 950, fontSize: '1rem' }}>Important Warning</h4>
                            </div>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.5 }}>
                                AURA is for check-ups only. If you have an emergency like chest pain or extreme breathing trouble, please call emergency services immediately.
                            </p>
                        </div>

                        <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: '25px', padding: '2.5rem', color: 'white' }}>
                            <Sparkles color="#8b5cf6" size={24} style={{ marginBottom: '1.5rem' }} />
                            <h4 style={{ margin: 0, fontWeight: 950, fontSize: '1.2rem', lineHeight: 1.3 }}>Smart Triage Check</h4>
                            <p style={{ margin: '1rem 0 2rem 0', color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, fontWeight: 600 }}>
                                Your session is securely shared with your doctor so they can review your history before your next visit.
                            </p>
                            
                            <div style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 900, marginBottom: '0.8rem' }}>
                                    <span style={{ color: '#94a3b8' }}>SYSTEM STATUS</span>
                                    <span style={{ color: '#8b5cf6' }}>98.2%</span>
                                </div>
                                <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                                    <div style={{ width: '98%', height: '100%', background: '#8b5cf6', borderRadius: '10px' }} />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: 'auto' }}>
                            <button style={{ width: '100%', padding: '1.2rem', borderRadius: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', fontWeight: 950, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', cursor: 'pointer' }}>
                                <Stethoscope size={20} color="#0ea5e9" /> FAST-BOOK SPECIALIST
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </PatientLayout>
    );
};

export default PatientAura;
