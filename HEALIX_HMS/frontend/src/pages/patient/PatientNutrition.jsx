import React from 'react';
import { motion } from 'framer-motion';
import { 
    Utensils, Droplet, Apple, Scale, 
    Calendar, CheckCircle, ChevronRight, Info
} from 'lucide-react';
import PatientLayout from '../../components/PatientLayout';

const PatientSectionHeader = ({ title, subtitle }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 950, color: '#1e3a8a', margin: 0, letterSpacing: '-px' }}>{title}</h2>
            <div style={{ height: '5px', width: '80px', background: 'linear-gradient(90deg, #1e40af, #3b82f6)', borderRadius: '2px', margin: '0.8rem 0' }} />
            <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.4rem', fontWeight: 500 }}>{subtitle}</p>
        </div>
    </div>
);

const MealCard = ({ time, name, description, calories, macros, type }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="stat-card-white" 
        style={{ padding: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `6px solid ${type === 'clinical' ? '#10b981' : '#f1f5f9'}` }}
    >
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: type === 'clinical' ? 'rgba(16, 185, 129, 0.05)' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: type === 'clinical' ? '#10b981' : '#94a3b8' }}>
                <Utensils size={28} />
            </div>
            <div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.3rem' }}>{time}</div>
                <h4 style={{ margin: 0, fontWeight: 950, fontSize: '1.25rem', color: '#0f172a' }}>{name}</h4>
                <p style={{ margin: '0.4rem 0 0 0', color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>{description}</p>
            </div>
        </div>
        
        <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 950, color: '#0f172a' }}>{calories} <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>KCAL</span></div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: '#64748b' }}>
                <span>P: {macros.p}g</span>
                <span>C: {macros.c}g</span>
                <span>F: {macros.f}g</span>
            </div>
        </div>
    </motion.div>
);

const PatientNutrition = () => {
    return (
        <PatientLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                <PatientSectionHeader 
                    title="Dietary & Wellness" 
                    subtitle="Scientifically curated nutritional plans synchronized with your clinical recovery"
                />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                    <div className="stat-card-white" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Scale size={24} />
                        </div>
                        <div>
                            <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 950 }}>TARGET CALORIES</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 950, color: '#0f172a' }}>2,150 <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>KCAL</span></div>
                        </div>
                    </div>
                    <div className="stat-card-white" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Droplet size={24} />
                        </div>
                        <div>
                            <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 950 }}>HYDRATION STATUS</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 950, color: '#0f172a' }}>1.8 / 3.0 <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>LITERS</span></div>
                        </div>
                    </div>
                    <div className="stat-card-white" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Calendar size={24} />
                        </div>
                        <div>
                            <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 950 }}>PLAN DURATION</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 950, color: '#0f172a' }}>DAY 12 <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>OF 30</span></div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '3.5rem' }}>
                    
                    {/* Meal Schedule */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Utensils color="#10b981" size={24} />
                                <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1.4rem', color: '#0f172a' }}>Today's Clinical Menu</h3>
                            </div>
                            <div style={{ padding: '0.5rem 1rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.05)', color: '#10b981', fontSize: '0.75rem', fontWeight: 950, border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                LOW SODIUM | GLUTEN FREE
                            </div>
                        </div>

                        <MealCard 
                            time="Breakfast | 08:30 AM"
                            name="Steel Cut Oats & Berry Bowl"
                            description="Enriched with chia seeds, organic blueberries, and a drizzle of manuka honey. Supports slow energy release."
                            calories="420"
                            macros={{ p: 12, c: 64, f: 14 }}
                            type="clinical"
                        />
                        <MealCard 
                            time="Lunch | 13:00 PM"
                            name="Grilled Salmon & Quinoa Salad"
                            description="Omega-3 rich salmon with roasted zucchini, cherry tomatoes, and lemon-tahini dressing."
                            calories="580"
                            macros={{ p: 42, c: 38, f: 26 }}
                            type="clinical"
                        />
                        <MealCard 
                            time="Dinner | 19:30 PM"
                            name="Lentil & Sweet Potato Stew"
                            description="High fiber plant-based protein with turmeric and ginger for anti-inflammatory benefits."
                            calories="510"
                            macros={{ p: 28, c: 72, f: 8 }}
                            type="clinical"
                        />
                    </div>

                    {/* Nutrition Advisory */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <Apple color="#ef4444" size={24} />
                            <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1.4rem', color: '#0f172a' }}>Nutritionist Insights</h3>
                        </div>

                        <div className="stat-card-white" style={{ padding: '2.5rem', background: 'linear-gradient(to bottom, white, #f8fafc)', borderTop: '6px solid #10b981' }}>
                            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden' }}>
                                    <img src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2574&auto=format&fit=crop" alt="Nutritionist" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div>
                                    <h5 style={{ margin: 0, fontWeight: 950, color: '#0f172a', fontSize: '1.1rem' }}>Dr. Elena Rossi</h5>
                                    <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.8rem', fontWeight: 800 }}>CHIEF CLINICAL DIETITIAN</p>
                                </div>
                            </div>

                            <div style={{ padding: '1.5rem', background: 'white', border: '1px solid #f1f5f9', borderRadius: '20px', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '-10px', left: '20px', width: '20px', height: '20px', background: 'white', borderLeft: '1px solid #f1f5f9', borderTop: '1px solid #f1f5f9', transform: 'rotate(45deg)' }} />
                                <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 600 }}>
                                    "Your recent lab reports show a mild deficiency in Magnesium. I have adjusted your dinner menu to include more leafy greens and pumpkin seeds. Your hydration is slightly below target today—aim for 2 more glasses before 6 PM."
                                </p>
                            </div>

                            <button style={{ width: '100%', marginTop: '2.5rem', padding: '1.2rem', borderRadius: '15px', background: '#10b981', color: 'white', border: 'none', fontWeight: 950, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)' }}>
                                <CheckCircle size={18} /> CONFIRM MEAL PREFERENCE
                            </button>
                        </div>

                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '25px', padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ padding: '0.8rem', borderRadius: '50%', background: 'white', border: '1px solid #e2e8f0', color: '#64748b' }}>
                                <Info size={20} />
                            </div>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.5 }}>
                                Food allergies or religious dietary requirements? Please update your <span style={{ color: '#0ea5e9', fontWeight: 950, textDecoration: 'underline' }}>Care Settings</span> to notify the kitchen node.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </PatientLayout>
    );
};

export default PatientNutrition;
