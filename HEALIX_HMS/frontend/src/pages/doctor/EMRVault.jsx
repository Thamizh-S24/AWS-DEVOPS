import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Calendar, Activity, Monitor, User, Database, Brain, Heart } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SectionHeader from '../admin/SectionHeader';
import api from '../../services/api';

const EMRVault = () => {
    const [searchId, setSearchId] = useState('');
    const [records, setRecords] = useState([]);
    const [triageHistory, setTriageHistory] = useState([]);
    const [vitalsHistory, setVitalsHistory] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');
        setProfile(null);
        try {
            const [recordsRes, ehrRes, triageRes, vitalsRes] = await Promise.all([
                api.get(`/patient/records/${searchId}`),
                api.get(`/patient/ehr/${searchId}`).catch(() => ({ data: null })),
                api.get(`/patient/triage/${searchId}`).catch(() => ({ data: [] })),
                api.get(`/patient/vitals/${searchId}`).catch(() => ({ data: [] }))
            ]);
            setRecords(recordsRes.data);
            setProfile(ehrRes.data);
            setTriageHistory(triageRes.data || []);
            setVitalsHistory(vitalsRes.data || []);
            setLoading(false);
        } catch (err) {
            setError('Patient UID not found or clinical records encrypted.');
            setRecords([]);
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="doctor">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
            >
                <SectionHeader
                    title="EMR Clinical Vault"
                    subtitle="Centralized longitudinal Electronic Health Records and diagnostic history"
                />

                <div className="glass-v3" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Database size={24} color="#0ea5e9" />
                        <h3 style={{ margin: 0, fontWeight: 950, color: '#0f172a' }}>Global Registry Query</h3>
                    </div>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Search style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
                            <input
                                placeholder="Enter Patient UID (e.g., P-001)..."
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                style={{ width: '100%', padding: '1.1rem 1.1rem 1.1rem 3.5rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontWeight: 700, fontSize: '1rem' }}
                            />
                        </div>
                        <button
                            type="submit"
                            style={{ padding: '1.1rem 2.5rem', borderRadius: '14px', background: '#0f172a', color: 'white', border: 'none', fontWeight: 950, cursor: 'pointer', transition: 'all 0.3s ease' }}
                        >
                            PULL RECORDS
                        </button>
                    </form>
                    {error && <p style={{ margin: 0, color: '#ef4444', fontWeight: 800, fontSize: '0.9rem' }}>{error}</p>}
                </div>

                {!loading && profile && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        <div className="glass-v3" style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.03)', borderLeft: '4px solid #ef4444' }}>
                            <h4 style={{ margin: '0 0 1rem 0', color: '#ef4444', fontSize: '0.85rem', fontWeight: 950, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Activity size={16} /> Known Allergies / Precautions
                            </h4>
                            {profile.allergies && profile.allergies.length > 0 ? (
                                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.6 }}>
                                    {profile.allergies.map((a, i) => <li key={i}>{a}</li>)}
                                </ul>
                            ) : (
                                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>No known allergies documented.</div>
                            )}
                        </div>

                        <div className="glass-v3" style={{ padding: '1.5rem', background: 'rgba(14, 165, 233, 0.03)', borderLeft: '4px solid #0ea5e9' }}>
                            <h4 style={{ margin: '0 0 1rem 0', color: '#0ea5e9', fontSize: '0.85rem', fontWeight: 950, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Monitor size={16} /> Active Problems / Diagnoses
                            </h4>
                            {profile.diagnosis && profile.diagnosis.length > 0 ? (
                                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.6 }}>
                                    {profile.diagnosis.map((d, i) => <li key={i}>{d}</li>)}
                                </ul>
                            ) : (
                                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>No active chronic diagnoses.</div>
                            )}
                        </div>

                        <div className="glass-v3" style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.03)', borderLeft: '4px solid #10b981' }}>
                            <h4 style={{ margin: '0 0 1rem 0', color: '#10b981', fontSize: '0.85rem', fontWeight: 950, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FileText size={16} /> Current Treatment Plan
                            </h4>
                            {profile.treatment ? (
                                <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.6 }}>{profile.treatment}</div>
                            ) : (
                                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>No active ongoing medications scheduled.</div>
                            )}
                        </div>
                    </div>
                )}

                <div className="glass-v3" style={{ padding: 0, overflow: 'hidden' }}>
                    {loading ? (
                        <div style={{ padding: '6rem', textAlign: 'center' }}>
                            <div className="aura-loader" style={{ margin: '0 auto 2rem' }} />
                            <p style={{ color: '#64748b', fontWeight: 800 }}>Decrypting Clinical Blobs...</p>
                        </div>
                    ) : records.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                        <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase' }}>Timeline</th>
                                        <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase' }}>Diagnosis & Care Plan</th>
                                        <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: 950, color: '#64748b', textTransform: 'uppercase' }}>Diagnostics</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((r, idx) => (
                                        <tr key={r._id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'white' : 'rgba(248, 250, 252, 0.5)' }}>
                                            <td style={{ padding: '1.8rem 2rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#0ea5e9', fontWeight: 950 }}>
                                                    <Calendar size={16} />
                                                    {r.date}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.8rem 2rem' }}>
                                                <div style={{ fontWeight: 950, color: '#0f172a', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{r.diagnosis}</div>
                                                <div style={{ fontSize: '0.95rem', color: '#475569', fontWeight: 500, lineHeight: 1.6 }}>{r.prescription}</div>
                                            </td>
                                            <td style={{ padding: '1.8rem 2rem' }}>
                                                <div style={{ display: 'flex', gap: '0.8rem' }}>
                                                    {r.lab_results && (
                                                        <div style={{ padding: '0.5rem 1rem', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', fontSize: '0.75rem', fontWeight: 950, border: '1px solid rgba(139, 92, 246, 0.2)' }}>LABS</div>
                                                    )}
                                                    {r.rad_results && (
                                                        <div style={{ padding: '0.5rem 1rem', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', fontSize: '0.75rem', fontWeight: 950, border: '1px solid rgba(14, 165, 233, 0.2)' }}>IMAGING</div>
                                                    )}
                                                    {!r.lab_results && !r.rad_results && <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>No attachments</span>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ padding: '6rem', textAlign: 'center' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                <FileText size={40} color="#0ea5e9" style={{ opacity: 0.3 }} />
                            </div>
                            <h4 style={{ fontWeight: 950, color: '#0f172a', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Medical Repository Access</h4>
                            <p style={{ color: '#64748b', fontWeight: 500, maxWidth: '400px', margin: '0 auto' }}>Navigate clinical history by querying the central database via Patient UID.</p>
                        </div>
                    )}
                </div>
                {!loading && (triageHistory.length > 0 || vitalsHistory.length > 0) && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginBottom: '2.5rem' }}>
                        {/* Triage History */}
                        <div className="glass-v3" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <Brain color="#8b5cf6" size={24} />
                                <h3 style={{ margin: 0, fontWeight: 950, color: '#0f172a', fontSize: '1.1rem' }}>AI Triage Insights (AURA)</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {triageHistory.map((t) => (
                                    <div key={t._id} style={{ padding: '1.2rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 950, color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{t.urgency.toUpperCase()}</span>
                                            <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800 }}>{new Date(t.timestamp).toLocaleDateString()}</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', fontWeight: 600, lineHeight: 1.5 }}>{t.summary}</p>
                                        <div style={{ marginTop: '0.8rem', fontSize: '0.7rem', fontWeight: 900, color: '#64748b' }}>ROUTED TO: {t.suggested_specialty}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Vitals History */}
                        <div className="glass-v3" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <Heart color="#ef4444" size={24} />
                                <h3 style={{ margin: 0, fontWeight: 950, color: '#0f172a', fontSize: '1.1rem' }}>Clinical IoT Vitals History</h3>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <th style={{ padding: '1rem 0.5rem', color: '#64748b', fontWeight: 800 }}>Date</th>
                                            <th style={{ padding: '1rem 0.5rem', color: '#64748b', fontWeight: 800 }}>BPM</th>
                                            <th style={{ padding: '1rem 0.5rem', color: '#64748b', fontWeight: 800 }}>Steps</th>
                                            <th style={{ padding: '1rem 0.5rem', color: '#64748b', fontWeight: 800 }}>Sleep</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vitalsHistory.map((v) => (
                                            <tr key={v._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                                <td style={{ padding: '0.8rem 0.5rem', fontWeight: 700 }}>{new Date(v.timestamp).toLocaleDateString()}</td>
                                                <td style={{ padding: '0.8rem 0.5rem', fontWeight: 800, color: '#ef4444' }}>{v.heart_rate}</td>
                                                <td style={{ padding: '0.8rem 0.5rem', fontWeight: 800, color: '#10b981' }}>{v.steps}</td>
                                                <td style={{ padding: '0.8rem 0.5rem', fontWeight: 800, color: '#8b5cf6' }}>{v.sleep_hours}h</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </DashboardLayout>
    );
};

export default EMRVault;
