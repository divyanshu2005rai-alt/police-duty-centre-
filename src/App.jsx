import React, { useState, useEffect } from 'react';
import { Shield, Users, Calendar, Megaphone, Radio, Settings, Sun, Moon, Bell, Plus, CheckCircle, RefreshCw } from 'lucide-react';
import RoleSwitcher from './components/RoleSwitcher';
import PersonnelDashboard from './components/PersonnelDashboard';
import SupervisorDashboard from './components/SupervisorDashboard';
import AdminDashboard from './components/AdminDashboard';
import { initialPersonnel, initialDuties, initialAnnouncements } from './data/mockData';

function App() {
  // Database States
  const [personnel, setPersonnel] = useState(() => {
    const saved = localStorage.getItem('police_personnel');
    return saved ? JSON.parse(saved) : initialPersonnel;
  });

  const [duties, setDuties] = useState(() => {
    const saved = localStorage.getItem('police_duties');
    return saved ? JSON.parse(saved) : initialDuties;
  });

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('police_announcements');
    return saved ? JSON.parse(saved) : initialAnnouncements;
  });

  // UI States
  const [activeRole, setActiveRole] = useState('personnel'); // personnel, supervisor, admin
  const [currentPersonnelNo, setCurrentPersonnelNo] = useState('P101'); // Rajesh Kumar default
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New announcement broadcasted', time: '5m ago', read: false },
    { id: 2, title: 'Duty updated: Night Beat Sector 2', time: '1h ago', read: true }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('police_personnel', JSON.stringify(personnel));
  }, [personnel]);

  useEffect(() => {
    localStorage.setItem('police_duties', JSON.stringify(duties));
  }, [duties]);

  useEffect(() => {
    localStorage.setItem('police_announcements', JSON.stringify(announcements));
  }, [announcements]);

  // Set Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Add Duty Function
  const handleAddDuty = (newDuty) => {
    const updated = [newDuty, ...duties];
    setDuties(updated);
    
    // Add real-time notification
    const officer = personnel.find(p => p.pNo === newDuty.pNo);
    const notificationText = `Duty assigned to P.No ${newDuty.pNo}: ${newDuty.dutyType} at ${newDuty.location}`;
    
    setNotifications(prev => [
      { id: Date.now(), title: notificationText, time: 'Just now', read: false },
      ...prev
    ]);
  };

  // Update Duty Status (Accept / Complete)
  const handleUpdateDutyStatus = (dutyId, status, reportData = null) => {
    setDuties(prev => prev.map(duty => {
      if (duty.id === dutyId) {
        const updatedDuty = { ...duty, status };
        if (reportData) {
          updatedDuty.report = reportData;
        }
        return updatedDuty;
      }
      return duty;
    }));
  };

  // Approve AI report
  const handleApproveReport = (dutyId) => {
    setDuties(prev => prev.map(duty => {
      if (duty.id === dutyId && duty.report) {
        return {
          ...duty,
          report: {
            ...duty.report,
            approved: true
          }
        };
      }
      return duty;
    }));
  };

  // Add Personnel Function
  const handleAddPersonnel = (newOfficer) => {
    setPersonnel(prev => [...prev, newOfficer]);
  };

  // Add Announcement
  const handleAddAnnouncement = (newAnnouncement) => {
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    setNotifications(prev => [
      { id: Date.now(), title: `New Announcement: ${newAnnouncement.title}`, time: 'Just now', read: false },
      ...prev
    ]);
  };

  // Active user details
  const activeUser = personnel.find(p => p.pNo === currentPersonnelNo) || personnel[0];

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="main-header">
        <div className="brand-section">
          <div className="brand-icon">🛡️</div>
          <div>
            <h1 className="brand-name">Reserve Police Duty Management Portal</h1>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '2px' }}>
              <span className="system-status">
                <span className="status-dot"></span> Secure Connection
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Active: {activeUser.name} ({activeUser.rank} | {activeUser.pNo})
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="button-secondary" 
            style={{ padding: '8px 12px', borderRadius: '50%', minWidth: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} style={{ color: 'var(--accent-amber)' }} /> : <Moon size={18} />}
          </button>

          {/* Notifications Trigger */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="button-secondary" 
              style={{ padding: '8px 12px', borderRadius: '50%', minWidth: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
            >
              <Bell size={18} />
              {notifications.some(n => !n.read) && (
                <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-red)', boxShadow: 'var(--glow-red)' }}></span>
              )}
            </button>

            {showNotifications && (
              <div className="glass-panel" style={{ position: 'absolute', right: 0, top: '50px', width: '320px', zIndex: 100, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Alerts Hub
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto' }}>
                  {notifications.map(n => (
                    <div key={n.id} style={{ padding: '8px', borderRadius: '6px', background: n.read ? 'transparent' : 'rgba(59, 130, 246, 0.05)', borderBottom: '1px solid var(--glass-border)' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{n.title}</p>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.time}</span>
                    </div>
                  ))}
                </div>
                <button 
                  className="button-secondary" 
                  style={{ width: '100%', padding: '6px', fontSize: '0.8rem' }}
                  onClick={() => {
                    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                    setShowNotifications(false);
                  }}
                >
                  Mark all read
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Grid Layout based on Active Role */}
      {activeRole === 'personnel' && (
        <PersonnelDashboard 
          activeUser={activeUser}
          duties={duties.filter(d => d.pNo === activeUser.pNo)}
          announcements={announcements}
          onUpdateStatus={handleUpdateDutyStatus}
        />
      )}

      {activeRole === 'supervisor' && (
        <SupervisorDashboard 
          personnel={personnel}
          duties={duties}
          announcements={announcements}
          onAddDuty={handleAddDuty}
          onApproveReport={handleApproveReport}
          onAddAnnouncement={handleAddAnnouncement}
        />
      )}

      {activeRole === 'admin' && (
        <AdminDashboard 
          personnel={personnel}
          onAddPersonnel={handleAddPersonnel}
          onUpdatePersonnel={setPersonnel}
        />
      )}

      {/* Floating Role Switcher */}
      <RoleSwitcher 
        activeRole={activeRole} 
        setActiveRole={setActiveRole} 
        personnel={personnel}
        currentPersonnelNo={currentPersonnelNo}
        setCurrentPersonnelNo={setCurrentPersonnelNo}
      />
    </div>
  );
}

export default App;
