import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Users, UserCheck, UserX, Clock, 
    Wrench, Trash2, Truck, Zap,
    Shield, Briefcase, Award, TrendingUp,
    Phone, Mail, Calendar, Search
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

const StaffCard = ({ staff, tickets }) => {
    const roleIcons = {
        technician: <Wrench size={18} />,
        cleaner: <Trash2 size={18} />,
        porter: <Truck size={18} />,
        biomed_engineer: <Zap size={18} />
    };

    const statusColors = {
        Active: '#10b981',
        'On Task': '#0ea5e9',
        Busy: '#f59e0b',
        'Off Duty': '#94a3b8'
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="stat-card-white"
            style={{ padding: '2rem' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative' }}>
                    <div style={{ 
                        width: '60px', height: '60px', borderRadius: '18px', 
                        background: '#f8fafc', border: '1px solid #e2e8f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#0ea5e9'
                    }}>
                        {roleIcons[staff.role] || <Users size={24} />}
                    </div>
                    <div style={{ 
                        position: 'absolute', bottom: '-4px', right: '-4px',
                        width: '16px', height: '16px', borderRadius: '50%',
                        background: statusColors[staff.status] || '#94a3b8',
                        border: '3px solid white'
                    }} />
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Task Load</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 950, color: '#0f172a' }}>{tickets} <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Active</span></div>
                </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>{staff.full_name}</h3>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{staff.role.replace('_', ' ').toUpperCase()}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontSize: '0.8rem' }}>
                    <Phone size={14} /> {staff.contact || '+1-202-555-0143'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontSize: '0.8rem' }}>
                    <Award size={14} /> {staff.specialization || 'Certified Specialist'}
                </div>
            </div>

            <div style={{ pt: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '0.5rem' }}>
                <button style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.7rem', fontWeight: 800, color: '#64748b', cursor: 'pointer' }}>
                    Details
                </button>
                <button style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.1)', border: 'none', fontSize: '0.7rem', fontWeight: 800, color: '#0ea5e9', cursor: 'pointer' }}>
                    Assign
                </button>
            </div>
        </motion.div>
    );
};

const MaintenanceStaff = () => {
    const [staffList, setStaffList] = useState([]);
    const [stats, setStats] = useState({ active: 0, busy: 0, off: 0 });
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const [activeTickets, setActiveTickets] = useState({});

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const [staffRes, tasksRes] = await Promise.all([
                api.get('/hr/staff'),
                api.get('/maintenance/tasks')
            ]);
            
            const operationalRoles = ['technician', 'porter', 'cleaner', 'biomed_engineer', 'maintenance'];
            const opsStaff = staffRes.data.filter(s => operationalRoles.includes(s.role.toLowerCase()));
            
            // Tally tickets per staff (mocking assignment for UI)
            const tally = {};
            tasksRes.data.forEach(t => {
                if (t.assigned_to) tally[t.assigned_to] = (tally[t.assigned_to] || 0) + 1;
            });
            
            // Randomly assign some tasks if data is sparse for UI demo
            opsStaff.forEach(s => {
                if (!tally[s.username]) tally[s.username] = Math.floor(Math.random() * 4);
                // Randomize status for UI
                const statuses = ['Active', 'On Task', 'Busy', 'Off Duty'];
                s.status = statuses[Math.floor(Math.random() * statuses.length)];
            });

            setStaffList(opsStaff);
            setActiveTickets(tally);
            
            setStats({
                active: opsStaff.filter(s => s.status === 'Active').length,
                busy: opsStaff.filter(s => s.status === 'Busy' || s.status === 'On Task').length,
                off: opsStaff.filter(s => s.status === 'Off Duty').length
            });
        } catch (err) {
            console.error("Failed to sync workforce data");
        } finally {
            setLoading(false);
        }
    };

    const filteredStaff = staffList.filter(s => {
        const matchesFilter = filter === 'All' || s.role.toLowerCase().includes(filter.toLowerCase());
        const matchesSearch = s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             s.username.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <DashboardLayout role="maintenance">
            <div style={{ padding: '0 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.4rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>Workforce Hub</h1>
                        <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 500 }}>
                            Operational staff monitoring and task allocation
                        </p>
                    </div>
                </div>

                {/* Metrics Bar */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                    <div className="stat-card-white" style={{ background: '#0ea5e9', color: 'white' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.8, textTransform: 'uppercase' }}>Total Workforce</div>
                        <div style={{ fontSize: '2rem', fontWeight: 950, marginTop: '0.5rem' }}>{staffList.length}</div>
                    </div>
                    <div className="stat-card-white" style={{ borderLeft: '4px solid #10b981' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Ready / Active</div>
                        <div style={{ fontSize: '2rem', fontWeight: 950, color: '#0f172a', marginTop: '0.5rem' }}>{stats.active}</div>
                    </div>
                    <div className="stat-card-white" style={{ borderLeft: '4px solid #f59e0b' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>On Task / Busy</div>
                        <div style={{ fontSize: '2rem', fontWeight: 950, color: '#0f172a', marginTop: '0.5rem' }}>{stats.busy}</div>
                    </div>
                    <div className="stat-card-white" style={{ borderLeft: '4px solid #94a3b8' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Off Duty</div>
                        <div style={{ fontSize: '2rem', fontWeight: 950, color: '#0f172a', marginTop: '0.5rem' }}>{stats.off}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    {/* Controls */}
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                            <Search style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                            <input 
                                placeholder="Search by name or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ 
                                    padding: '1rem 1.2rem 1rem 3.5rem', width: '100%', 
                                    borderRadius: '16px', border: '1px solid #e2e8f0',
                                    background: 'white', fontSize: '0.9rem', outline: 'none'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                            {['All', 'Technician', 'Biomed', 'Porter', 'Cleaner'].map(role => (
                                <button
                                    key={role}
                                    onClick={() => setFilter(role)}
                                    style={{ 
                                        padding: '0.8rem 1.5rem', borderRadius: '14px',
                                        fontSize: '0.8rem', fontWeight: 800,
                                        background: filter === role ? '#0ea5e9' : 'white',
                                        color: filter === role ? 'white' : '#64748b',
                                        border: filter === role ? 'none' : '1px solid #e2e8f0',
                                        cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Staff Grid */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '5rem', color: '#94a3b8', fontWeight: 700 }}>VERIFYING WORKFORCE STATUS...</div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                            {filteredStaff.map(s => (
                                <StaffCard key={s.username} staff={s} tickets={activeTickets[s.username] || 0} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MaintenanceStaff;
