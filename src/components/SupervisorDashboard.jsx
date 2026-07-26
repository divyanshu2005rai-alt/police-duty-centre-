import React, { useState } from 'react';
import { Search, Shield, Plus, Megaphone, Check, Users, MapPin, Calendar, FileText, AlertCircle, Trash } from 'lucide-react';

function SupervisorDashboard({ personnel, duties, announcements, onAddDuty, onApproveReport, onAddAnnouncement }) {
  const [activeTab, setActiveTab] = useState('deployment'); // deployment, assign, announcements, reports
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState(null);

  // New Duty state
  const [dutyType, setDutyType] = useState('Patrol');
  const [dutyDate, setDutyDate] = useState('2026-07-26');
  const [reportingTime, setReportingTime] = useState('09:00 AM');
  const [location, setLocation] = useState('');
  const [reportingOfficer, setReportingOfficer] = useState('Inspector V. Sharma');
  const [instructions, setInstructions] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignmentPNo, setAssignmentPNo] = useState('');

  // New Announcement state
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState('Daily Orders');
  const [annContent, setAnnContent] = useState('');
  const [annUrgent, setAnnUrgent] = useState(false);

  // Search filter
  const filteredPersonnel = personnel.filter(p => 
    p.pNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Analytics counts
  const totalOfficers = personnel.length;
  const deployedCount = personnel.filter(p => p.status === 'On Duty' || duties.some(d => d.pNo === p.pNo && d.date === '2026-07-26' && d.status === 'Accepted')).length;
  const pendingAcceptance = duties.filter(d => d.status === 'Pending').length;
  const activeReportsToApprove = duties.filter(d => d.report && !d.report.approved);

  // Handlers
  const handleAssignDuty = (e) => {
    e.preventDefault();
    if (!assignmentPNo || !location || !instructions) {
      alert('Please fill out all fields.');
      return;
    }

    const newDuty = {
      id: `D-${Date.now()}`,
      pNo: assignmentPNo,
      dutyType,
      date: dutyDate,
      reportingTime,
      location,
      reportingOfficer,
      instructions,
      priority,
      status: 'Pending',
      report: null
    };

    onAddDuty(newDuty);
    alert(`Duty successfully assigned and dispatched to ${assignmentPNo}`);
    
    // reset form
    setLocation('');
    setInstructions('');
    setActiveTab('deployment');
  };

  const handleBroadcastAnnouncement = (e) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    const newAnnouncement = {
      id: `A-${Date.now()}`,
      title: annTitle,
      category: annCategory,
      content: annContent,
      date: new Date().toISOString().split('T')[0],
      sender: 'Supervisor Console',
      urgent: annUrgent
    };

    onAddAnnouncement(newAnnouncement);
    alert('Announcement broadcasted successfully to all personnel.');
    
    setAnnTitle('');
    setAnnContent('');
    setAnnUrgent(false);
    setActiveTab('deployment');
  };

  return (
    <div className="dashboard-grid">
      {/* Sidebar Controls */}
      <div className="sidebar-panel">
        <nav className="glass-panel" style={{ padding: '12px' }}>
          <div className="sidebar-menu">
            <button 
              className={`sidebar-link ${activeTab === 'deployment' ? 'active' : ''}`}
              onClick={() => setActiveTab('deployment')}
            >
              <Users size={18} /> Live Deployment
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'assign' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('assign');
                if (selectedOfficer) setAssignmentPNo(selectedOfficer.pNo);
              }}
            >
              <Plus size={18} /> Assign Duty
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <FileText size={18} /> 
              Review AI Reports 
              {activeReportsToApprove.length > 0 && (
                <span style={{ marginLeft: 'auto', background: 'var(--accent-red)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>
                  {activeReportsToApprove.length}
                </span>
              )}
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'announcements' ? 'active' : ''}`}
              onClick={() => setActiveTab('announcements')}
            >
              <Megaphone size={18} /> Broadcasts
            </button>
          </div>
        </nav>

        {/* Selected Officer quick panel (if search clicked) */}
        {selectedOfficer && (
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>QUICK VIEW</span>
              <button 
                onClick={() => setSelectedOfficer(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontSize: '0.75rem' }}
              >
                Clear
              </button>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <img src={selectedOfficer.avatar} style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }} alt="" />
              <div>
                <h4 style={{ fontSize: '0.9rem' }}>{selectedOfficer.name}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{selectedOfficer.rank} ({selectedOfficer.pNo})</p>
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
              <span>Status: <strong style={{ color: selectedOfficer.status === 'Available' ? 'var(--accent-green)' : 'var(--accent-amber)' }}>{selectedOfficer.status}</strong></span>
              <span>Phone: {selectedOfficer.phone}</span>
              <span>Last Duty: {selectedOfficer.lastDuty}</span>
            </div>
            <button 
              className="button-primary" 
              style={{ width: '100%', padding: '8px', fontSize: '0.8rem' }}
              onClick={() => {
                setAssignmentPNo(selectedOfficer.pNo);
                setActiveTab('assign');
              }}
            >
              Assign Duty to Officer
            </button>
          </div>
        )}
      </div>

      {/* Main Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Core Analytics Counter cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Personnel Available</span>
            <span className="stat-val">{totalOfficers}</span>
          </div>
          <div className="stat-card">
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Currently Deployed</span>
            <span className="stat-val" style={{ color: 'var(--accent-cyan)' }}>{deployedCount}</span>
          </div>
          <div className="stat-card">
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Pending Acceptance</span>
            <span className="stat-val" style={{ color: 'var(--accent-amber)' }}>{pendingAcceptance}</span>
          </div>
          <div className="stat-card">
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Awaiting AI Review</span>
            <span className="stat-val" style={{ color: 'var(--accent-red)' }}>{activeReportsToApprove.length}</span>
          </div>
        </div>

        {activeTab === 'deployment' && (
          <>
            {/* Live Search and Personnel List */}
            <div className="glass-panel">
              <div className="card-title-row">
                <h3>Live Deployment Roster</h3>
                <div style={{ position: 'relative', width: '250px' }}>
                  <input 
                    type="text" 
                    placeholder="Search by P.No or Name..." 
                    className="form-control"
                    style={{ width: '100%', paddingLeft: '32px', height: '36px', fontSize: '0.85rem' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
                </div>
              </div>

              {/* Roster Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredPersonnel.map(p => {
                  const activeDuties = duties.filter(d => d.pNo === p.pNo && d.date === '2026-07-26');
                  return (
                    <div 
                      key={p.pNo} 
                      className="glass-panel" 
                      style={{ 
                        padding: '16px', 
                        display: 'grid', 
                        gridTemplateColumns: '80px 180px 1fr 120px', 
                        alignItems: 'center', 
                        gap: '16px',
                        background: 'rgba(255,255,255,0.01)'
                      }}
                      onClick={() => setSelectedOfficer(p)}
                    >
                      <img src={p.avatar} alt="" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--glass-border)' }} />
                      <div>
                        <h4 style={{ fontSize: '0.95rem' }}>{p.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p.pNo} • {p.rank}</span>
                      </div>
                      
                      <div>
                        {activeDuties.length > 0 ? (
                          activeDuties.map(d => (
                            <div key={d.id} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-blue)' }}>{d.dutyType}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location: {d.location} | Status: <strong style={{ color: d.status === 'Accepted' ? 'var(--accent-green)' : 'var(--accent-amber)' }}>{d.status}</strong></span>
                            </div>
                          ))
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No active duty today</span>
                        )}
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span className={`badge ${p.status === 'Available' ? 'badge-green' : p.status === 'On Duty' ? 'badge-blue' : 'badge-amber'}`}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {activeTab === 'assign' && (
          <div className="glass-panel">
            <h3 style={{ marginBottom: '20px' }}>Dispatch Duty & Assignment Details</h3>
            
            <form onSubmit={handleAssignDuty} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <div className="form-group">
                  <label>Personnel P.No</label>
                  <select 
                    className="form-control"
                    value={assignmentPNo}
                    onChange={(e) => setAssignmentPNo(e.target.value)}
                  >
                    <option value="">-- Choose Officer --</option>
                    {personnel.map(p => (
                      <option key={p.pNo} value={p.pNo}>{p.name} ({p.pNo}) - {p.status}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Duty Type</label>
                  <select 
                    className="form-control"
                    value={dutyType}
                    onChange={(e) => setDutyType(e.target.value)}
                  >
                    <option value="Patrol">Night Beat Patrol</option>
                    <option value="VIP Convoy Escort">VIP Convoy Escort</option>
                    <option value="Riot Squad Contingent">Riot Squad Contingent</option>
                    <option value="Crowd Control">Crowd Control</option>
                    <option value="Highway Guard Checkpost">Highway Guard Checkpost</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select 
                    className="form-control"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={dutyDate}
                    onChange={(e) => setDutyDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="form-group">
                  <label>Reporting Time</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. 10:00 PM"
                    value={reportingTime}
                    onChange={(e) => setReportingTime(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Location / Area Grid</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Sector 2 Highstreet Gate B"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Reporting Senior Officer</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={reportingOfficer}
                    onChange={(e) => setReportingOfficer(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Task Instructions</label>
                  <textarea 
                    className="form-control" 
                    rows={3}
                    placeholder="Provide rules of engagement..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px' }}>
                <button type="submit" className="button-primary"><Plus size={18} /> Deploy Assignment</button>
                <button type="button" className="button-secondary" onClick={() => setActiveTab('deployment')}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="glass-panel">
            <h3 style={{ marginBottom: '20px' }}>Review Pending AI Duty Reports</h3>

            {activeReportsToApprove.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {activeReportsToApprove.map(d => {
                  const officer = personnel.find(p => p.pNo === d.pNo);
                  return (
                    <div key={d.id} className="glass-panel" style={{ border: '1px dashed rgba(6,182,212,0.3)', background: 'rgba(6,182,212,0.01)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <img src={officer?.avatar} style={{ width: '32px', height: '32px', borderRadius: '50%' }} alt="" />
                          <div>
                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{officer?.name} ({d.pNo})</span>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Duty: {d.dutyType} at {d.location}</p>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Submitted: Just now</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '6px', fontSize: '0.8rem' }}>
                          <strong>Officer's Raw Notes:</strong>
                          <p style={{ marginTop: '6px', color: 'var(--text-secondary)' }}>"{d.report.rawNotes}"</p>
                        </div>
                        <div style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)', padding: '12px', borderRadius: '6px', fontSize: '0.8rem' }}>
                          <strong>Generated Professional Summary:</strong>
                          <p style={{ marginTop: '6px', color: 'var(--text-primary)', fontStyle: 'italic' }}>{d.report.aiSummary}</p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                          className="button-primary"
                          style={{ background: 'linear-gradient(135deg, var(--accent-green) 0%, #059669 100%)', boxShadow: 'var(--glow-green)', padding: '8px 16px', fontSize: '0.85rem' }}
                          onClick={() => {
                            onApproveReport(d.id);
                            alert('AI summary report approved and saved to permanent archives.');
                          }}
                        >
                          <Check size={16} /> Approve & File Report
                        </button>
                        <button className="button-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Send Back for Correction</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>All submitted reports have been reviewed and approved.</p>
            )}
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="glass-panel">
            <h3 style={{ marginBottom: '20px' }}>Broadcast Command Announcement</h3>
            
            <form onSubmit={handleBroadcastAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Announcement Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Traffic Reroute Plan for VIP Visit"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select 
                  className="form-control"
                  value={annCategory}
                  onChange={(e) => setAnnCategory(e.target.value)}
                >
                  <option value="Daily Orders">Daily Orders</option>
                  <option value="Circulars">Circulars</option>
                  <option value="Emergency Notices">Emergency Notices</option>
                  <option value="Policy Updates">Policy Updates</option>
                </select>
              </div>

              <div className="form-group">
                <label>Content</label>
                <textarea 
                  className="form-control" 
                  rows={4}
                  placeholder="Write clear instructions for all stations..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  id="urgent"
                  checked={annUrgent}
                  onChange={(e) => setAnnUrgent(e.target.checked)}
                />
                <label htmlFor="urgent" style={{ color: 'var(--accent-red)', cursor: 'pointer' }}>Mark as Urgent / Priority Alert</label>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="button-primary"><Megaphone size={16} /> Broadcast Announcement</button>
                <button type="button" className="button-secondary" onClick={() => setActiveTab('deployment')}>Cancel</button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

export default SupervisorDashboard;
