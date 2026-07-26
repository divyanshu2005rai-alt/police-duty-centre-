import React from 'react';
import { Shield, Eye, Settings, Users } from 'lucide-react';

function RoleSwitcher({ activeRole, setActiveRole, personnel, currentPersonnelNo, setCurrentPersonnelNo }) {
  return (
    <div className="role-switcher-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '8px', borderRight: '1px solid rgba(255, 255, 255, 0.12)' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Role Simulator:
        </span>
      </div>

      {/* Personnel Button */}
      <button 
        className={`role-btn ${activeRole === 'personnel' ? 'active' : ''}`}
        onClick={() => setActiveRole('personnel')}
      >
        <Shield size={14} /> Personnel
      </button>

      {/* Supervisor Button */}
      <button 
        className={`role-btn ${activeRole === 'supervisor' ? 'active' : ''}`}
        onClick={() => setActiveRole('supervisor')}
      >
        <Users size={14} /> Supervisor
      </button>

      {/* Admin Button */}
      <button 
        className={`role-btn ${activeRole === 'admin' ? 'active' : ''}`}
        onClick={() => setActiveRole('admin')}
      >
        <Settings size={14} /> Administrator
      </button>

      {/* Officer Switcher (visible when in Personnel role) */}
      {activeRole === 'personnel' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '8px', paddingLeft: '8px', borderLeft: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <Eye size={12} style={{ color: 'var(--text-muted)' }} />
          <select 
            value={currentPersonnelNo}
            onChange={(e) => setCurrentPersonnelNo(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.8rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {personnel.map(p => (
              <option key={p.pNo} value={p.pNo} style={{ background: 'var(--bg-secondary)', color: 'white' }}>
                {p.name} ({p.pNo})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export default RoleSwitcher;
