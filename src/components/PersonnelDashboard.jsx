import React, { useState, useEffect } from 'react';
import { Shield, Clock, MapPin, AlertCircle, Compass, FileText, Check, Sparkles, Send, Volume2, MessageSquare, Radio, Megaphone } from 'lucide-react';
import CommunicationHub from './CommunicationHub';
import { aiTemplates } from '../data/mockData';

function PersonnelDashboard({ activeUser, duties, announcements, onUpdateStatus }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, comms, history, ai-report
  const [countdown, setCountdown] = useState('02h 45m 12s');
  
  // AI report states
  const [rawNotes, setRawNotes] = useState('');
  const [generatedReport, setGeneratedReport] = useState('');
  const [selectedDutyForReport, setSelectedDutyForReport] = useState(null);
  const [generating, setGenerating] = useState(false);

  // Simulated countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      const hours = Math.floor(Math.random() * 3) + 1;
      const minutes = Math.floor(Math.random() * 59);
      const seconds = Math.floor(Math.random() * 59);
      setCountdown(`${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Today's active duty
  const todayDuty = duties.find(d => d.date === '2026-07-26' && (d.status === 'Pending' || d.status === 'Accepted'));
  const completedDuties = duties.filter(d => d.status === 'Completed');

  // Handle AI Report Generation
  const handleGenerateReport = () => {
    if (!rawNotes) return;
    setGenerating(true);
    
    setTimeout(() => {
      // Find matches in templates or build generic structured format
      const match = aiTemplates.find(t => 
        rawNotes.toLowerCase().includes('parking') || 
        rawNotes.toLowerCase().includes('drunk') ||
        rawNotes.toLowerCase().includes('vip')
      );

      let resultText = "";
      if (match) {
        resultText = match.output;
      } else {
        // Fallback procedural AI generation
        resultText = `Official Patrol Report:
----------------------------------------
- Situation Review: Personnel performed duty at designated location (${selectedDutyForReport?.location || 'General Area'}).
- Observation Log: ${rawNotes.trim()}
- Event Assessment: Under the supervision of ${selectedDutyForReport?.reportingOfficer || 'Duty Supervisor'}, safety guidelines were enforced.
- Status Resolution: Incident closed with zero damage or escalation reported.`;
      }
      
      setGeneratedReport(resultText);
      setGenerating(false);
    }, 1500);
  };

  const submitReport = () => {
    if (!selectedDutyForReport || !generatedReport) return;
    
    const reportObj = {
      rawNotes,
      aiSummary: generatedReport,
      approved: false, // Supervisor needs to approve
      timestamp: new Date().toISOString()
    };

    onUpdateStatus(selectedDutyForReport.id, 'Completed', reportObj);
    alert('Report submitted successfully to supervisor for approval.');
    
    // Clear states
    setRawNotes('');
    setGeneratedReport('');
    setSelectedDutyForReport(null);
    setActiveTab('overview');
  };

  return (
    <div className="dashboard-grid">
      {/* Sidebar Navigation */}
      <div className="sidebar-panel">
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ position: 'relative' }}>
            <img 
              src={activeUser.avatar} 
              alt={activeUser.name} 
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-blue)', boxShadow: 'var(--glow-blue)' }} 
            />
            <span style={{ position: 'absolute', bottom: '2px', right: '2px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--accent-green)', border: '2px solid var(--bg-secondary)', boxShadow: 'var(--glow-green)' }}></span>
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>{activeUser.name}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{activeUser.rank}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{activeUser.pNo}</p>
          </div>
        </div>

        <nav className="glass-panel" style={{ padding: '12px' }}>
          <div className="sidebar-menu">
            <button 
              className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Shield size={18} /> Overview
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'comms' ? 'active' : ''}`}
              onClick={() => setActiveTab('comms')}
            >
              <Radio size={18} /> Voice / Comms
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'ai-report' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai-report')}
            >
              <FileText size={18} /> AI Duty Report
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <Clock size={18} /> Duty History
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content Pane */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {activeTab === 'overview' && (
          <>
            {/* Live Duty assignment alert */}
            {todayDuty ? (
              <div className="glass-panel" style={{ borderLeft: '6px solid var(--accent-blue)', background: 'rgba(59, 130, 246, 0.03)' }}>
                <div className="card-title-row">
                  <span className="badge badge-blue">Active Deployment Today</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)' }}>
                    <Clock size={16} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Reporting in: {countdown}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '8px', color: 'var(--text-primary)' }}>{todayDuty.dutyType}</h2>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', margin: '16px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> {todayDuty.location}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} /> Report: {todayDuty.reportingTime}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Shield size={16} /> Reporting Officer: {todayDuty.reportingOfficer}</span>
                    </div>

                    <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <strong>Orders & Instructions:</strong>
                      <p style={{ marginTop: '6px', lineHeight: 1.5 }}>{todayDuty.instructions}</p>
                    </div>

                    {todayDuty.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                        <button 
                          className="button-primary"
                          onClick={() => onUpdateStatus(todayDuty.id, 'Accepted')}
                        >
                          <Check size={18} /> Accept Deployment
                        </button>
                        <button className="button-secondary">Decline Request (Emergency Only)</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '12px', marginTop: '20px', alignItems: 'center' }}>
                        <span className="badge badge-green">Duty Accepted</span>
                        <button 
                          className="button-primary"
                          style={{ background: 'linear-gradient(135deg, var(--accent-green) 0%, #059669 100%)', boxShadow: 'var(--glow-green)' }}
                          onClick={() => {
                            setSelectedDutyForReport(todayDuty);
                            setActiveTab('ai-report');
                          }}
                        >
                          <FileText size={18} /> Complete & Write Report
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Mock Map View */}
                  <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      <span>SECTOR DISPATCH MAP</span>
                      <Compass size={14} className="spinning" />
                    </div>
                    {/* Visualizing simple glowing map graphic */}
                    <div style={{ position: 'relative', height: '140px', background: '#070a13', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ position: 'absolute', top: 0, bottom: 0, left: '30%', width: '1px', background: 'rgba(6, 182, 212, 0.15)' }}></div>
                      <div style={{ position: 'absolute', top: 0, bottom: 0, left: '60%', width: '1px', background: 'rgba(6, 182, 212, 0.15)' }}></div>
                      <div style={{ position: 'absolute', left: 0, right: 0, top: '40%', height: '1px', background: 'rgba(6, 182, 212, 0.15)' }}></div>
                      
                      {/* Grid Points */}
                      <div style={{ position: 'absolute', left: '28%', top: '38%', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-blue)', boxShadow: 'var(--glow-blue)' }}></div>
                      <span style={{ position: 'absolute', left: '34%', top: '34%', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Station HQ</span>

                      {/* Destination Point */}
                      <div style={{ position: 'absolute', left: '58%', top: '65%', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-red)', boxShadow: 'var(--glow-red)', animation: 'pulse-red 1.5s infinite' }}></div>
                      <span style={{ position: 'absolute', left: '64%', top: '61%', fontSize: '0.65rem', color: 'var(--accent-red)', fontWeight: 'bold' }}>Deployment Point</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Map is updated coordinates via GPS link.</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-panel" style={{ textAlign: 'center', padding: '40px' }}>
                <Shield size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.4 }} />
                <h3>No active deployments today</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Your schedule is clear. Check upcoming or history tags.</p>
              </div>
            )}

            {/* Announcements Panel */}
            <div className="glass-panel">
              <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Megaphone size={18} /> Central Announcement Board</h3>
              <div>
                {announcements.map(ann => (
                  <div key={ann.id} className={`announcement-item ${ann.urgent ? 'urgent' : ''}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{ann.title}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ann.date}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{ann.content}</p>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>Sender: {ann.sender}</span>
                      <span>•</span>
                      <span>Category: {ann.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'comms' && (
          <div className="glass-panel">
            <h3 style={{ marginBottom: '16px' }}>Secure Duty Communication Room</h3>
            <CommunicationHub currentOfficer={activeUser} />
          </div>
        )}

        {activeTab === 'ai-report' && (
          <div className="glass-panel">
            <h3 style={{ marginBottom: '8px' }}>AI Duty Report Assistant</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Convert informal duty observation notes into formatted professional structures automatically.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Left Column: Note Entry */}
              <div>
                <div className="form-group">
                  <label>Select Deployment Duty to Report</label>
                  <select 
                    className="form-control"
                    value={selectedDutyForReport ? selectedDutyForReport.id : ''}
                    onChange={(e) => {
                      const selected = duties.find(d => d.id === e.target.value);
                      setSelectedDutyForReport(selected);
                    }}
                  >
                    <option value="">-- Choose Duty --</option>
                    {duties.filter(d => d.status !== 'Completed').map(d => (
                      <option key={d.id} value={d.id}>{d.dutyType} - {d.location} ({d.date})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Enter Raw Operational Notes</label>
                  <textarea 
                    className="form-control" 
                    rows={6}
                    placeholder="Example: Crowd was 500 people. Small parking issue sorted out. No damage done."
                    value={rawNotes}
                    onChange={(e) => setRawNotes(e.target.value)}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Provide simple observations. The LLM will structure it.</span>
                </div>

                <button 
                  className="ai-glow-btn"
                  onClick={handleGenerateReport}
                  disabled={generating || !rawNotes || !selectedDutyForReport}
                  style={{ opacity: (!rawNotes || !selectedDutyForReport) ? 0.6 : 1 }}
                >
                  <Sparkles size={16} /> 
                  {generating ? 'Processing with AI...' : 'Convert to Professional Report'}
                </button>
              </div>

              {/* Right Column: AI Output */}
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={16} /> AI Output Summary</h4>
                
                {generatedReport ? (
                  <>
                    <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', flex: 1, fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                      {generatedReport}
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                        className="button-primary"
                        onClick={submitReport}
                      >
                        <Send size={16} /> Submit to Supervisor
                      </button>
                      <button 
                        className="button-secondary"
                        onClick={() => {
                          setGeneratedReport('');
                          setRawNotes('');
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1, color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>
                    <Sparkles size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
                    <p style={{ fontSize: '0.85rem' }}>Select a duty, enter raw notes and click generate to view structured summary output.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="glass-panel">
            <h3 style={{ marginBottom: '20px' }}>Your Completed Deployments History</h3>
            
            {completedDuties.length > 0 ? (
              <div className="timeline-list">
                {completedDuties.map(d => (
                  <div key={d.id} className="timeline-item">
                    <div className="timeline-marker completed"></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ fontSize: '1.1rem' }}>{d.dutyType}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          Location: {d.location} | Date: {d.date}
                        </p>
                        
                        {d.report && (
                          <div style={{ marginTop: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>AI Summary Report</span>
                              <span className={`badge ${d.report.approved ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                                {d.report.approved ? 'Approved by supervisor' : 'Awaiting Approval'}
                              </span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.4 }}>"{d.report.aiSummary}"</p>
                          </div>
                        )}
                      </div>
                      <span className="badge badge-green">Completed</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No completed duties on record.</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default PersonnelDashboard;
