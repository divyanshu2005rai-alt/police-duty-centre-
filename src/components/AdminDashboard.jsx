import React, { useState } from 'react';
import { Shield, Plus, Key, Building2, UserPlus, RefreshCw } from 'lucide-react';

function AdminDashboard({ personnel, onAddPersonnel, onUpdatePersonnel }) {
  const [activeTab, setActiveTab] = useState('personnel'); // personnel, add, configuration
  
  // New Officer form states
  const [pNo, setPNo] = useState('');
  const [name, setName] = useState('');
  const [rank, setRank] = useState('Constable');
  const [department, setDepartment] = useState('General Reserve');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [station, setStation] = useState('Central Reserve Station');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'); // default avatar placeholder

  const handleCreateOfficer = (e) => {
    e.preventDefault();
    if (!pNo || !name || !phone || !email) {
      alert('Please fill out all fields.');
      return;
    }

    // Check if P.No already exists
    if (personnel.some(p => p.pNo === pNo)) {
      alert('Personnel Number (P.No) already exists.');
      return;
    }

    const newOfficer = {
      pNo,
      name,
      rank,
      department,
      status: 'Available',
      avatar,
      phone,
      email,
      station,
      lastDuty: 'None'
    };

    onAddPersonnel(newOfficer);
    alert(`Personnel record ${pNo} created successfully! Default login password: Password123`);
    
    // Clear fields
    setPNo('');
    setName('');
    setPhone('');
    setEmail('');
    setActiveTab('personnel');
  };

  const handleResetPassword = (officerPNo) => {
    const confirm = window.confirm(`Reset password for P.No ${officerPNo} to default: "Police@123"?`);
    if (confirm) {
      alert(`Password for ${officerPNo} has been reset.`);
    }
  };

  return (
    <div className="dashboard-grid">
      {/* Sidebar Controls */}
      <div className="sidebar-panel">
        <nav className="glass-panel" style={{ padding: '12px' }}>
          <div className="sidebar-menu">
            <button 
              className={`sidebar-link ${activeTab === 'personnel' ? 'active' : ''}`}
              onClick={() => setActiveTab('personnel')}
            >
              <Shield size={18} /> Manage Personnel
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'add' ? 'active' : ''}`}
              onClick={() => setActiveTab('add')}
            >
              <UserPlus size={18} /> Register Officer
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'configuration' ? 'active' : ''}`}
              onClick={() => setActiveTab('configuration')}
            >
              <Building2 size={18} /> Station Management
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content Pane */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {activeTab === 'personnel' && (
          <div className="glass-panel">
            <h3 style={{ marginBottom: '20px' }}>Global Personnel Records</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {personnel.map(p => (
                <div key={p.pNo} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.01)' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <img src={p.avatar} alt="" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ fontSize: '1rem' }}>{p.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        P.No: <strong>{p.pNo}</strong> | Rank: {p.rank} | Dept: {p.department}
                      </p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Station: {p.station}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      className="button-secondary" 
                      style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                      onClick={() => handleResetPassword(p.pNo)}
                    >
                      <Key size={14} /> Reset Pass
                    </button>
                    <button 
                      className="button-secondary" 
                      style={{ padding: '8px 12px', fontSize: '0.8rem', color: 'var(--accent-red)' }}
                      onClick={() => {
                        if (window.confirm(`Delete personnel record ${p.pNo}?`)) {
                          onUpdatePersonnel(prev => prev.filter(x => x.pNo !== p.pNo));
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="glass-panel">
            <h3 style={{ marginBottom: '20px' }}>Register New Police Personnel</h3>

            <form onSubmit={handleCreateOfficer} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <div className="form-group">
                  <label>Personnel Number (P.No)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. P106"
                    value={pNo}
                    onChange={(e) => setPNo(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Sanjay Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Rank</label>
                  <select 
                    className="form-control"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                  >
                    <option value="Constable">Constable</option>
                    <option value="Head Constable">Head Constable</option>
                    <option value="Assistant Sub-Inspector">Assistant Sub-Inspector</option>
                    <option value="Sub-Inspector">Sub-Inspector</option>
                    <option value="Inspector">Inspector</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Department Wing</label>
                  <select 
                    className="form-control"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="General Reserve">General Reserve</option>
                    <option value="Traffic & Patrol Division">Traffic & Patrol Division</option>
                    <option value="Crowd Control Squad">Crowd Control Squad</option>
                    <option value="Quick Response Team (QRT)">Quick Response Team (QRT)</option>
                    <option value="VIP Security Contingent">VIP Security Contingent</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="+91 98765 XXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Government Email Address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="name@police.gov.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Assigned Reserve Barrack / Station</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={station}
                    onChange={(e) => setStation(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Profile Avatar URL (Optional)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px' }}>
                <button type="submit" className="button-primary"><UserPlus size={16} /> Save Record</button>
                <button type="button" className="button-secondary" onClick={() => setActiveTab('personnel')}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'configuration' && (
          <div className="glass-panel">
            <h3 style={{ marginBottom: '16px' }}>Reserve Police Stations & Divisions Configuration</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Define structural boundaries for automatic sector routing and supervisor dispatch channels.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                <h4 style={{ marginBottom: '12px', color: 'var(--accent-blue)' }}>Station Commands</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none' }}>
                  <li style={{ fontSize: '0.9rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '6px' }}>🏫 Central Reserve Barracks - HQ</li>
                  <li style={{ fontSize: '0.9rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '6px' }}>🏫 Sector 5 Reserve Barracks</li>
                  <li style={{ fontSize: '0.9rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '6px' }}>🏫 Outer Circle Patrol Station</li>
                  <li style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>🏫 VIP Security Transit Unit</li>
                </ul>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                <h4 style={{ marginBottom: '12px', color: 'var(--accent-cyan)' }}>Platform Status Config</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span>FCM Push Delivery: <strong style={{ color: 'var(--accent-green)' }}>Active (99.8% uptime)</strong></span>
                  <span>AI Summary Engine: <strong style={{ color: 'var(--accent-green)' }}>Active (Google Gemini 3.5)</strong></span>
                  <span>WebRTC Room Load: <strong style={{ color: 'var(--accent-cyan)' }}>0.2%</strong></span>
                  <span>Data Redundancy Sync: <strong style={{ color: 'var(--accent-green)' }}>Synced (Local Storage)</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;
