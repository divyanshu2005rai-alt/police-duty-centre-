import React, { useState } from 'react';
import { Radio, Mic, MicOff, Video, VideoOff, Send, Volume2, Shield } from 'lucide-react';

function CommunicationHub({ currentOfficer }) {
  const [inCall, setInCall] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Inspector V. Sharma', content: 'Sector 2 patrol squad, report position.', time: '10:15 AM' },
    { id: 2, sender: 'P102 Vikram Singh', content: 'At NH44 access checkpoint. All vehicles passing security clearance.', time: '10:17 AM' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const toggleCall = () => {
    setInCall(!inCall);
    if (!inCall) {
      setVideoActive(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage) return;

    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: `${currentOfficer.rank} ${currentOfficer.name}`,
        content: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setNewMessage('');
  };

  return (
    <div className="comm-hub-panel">
      {/* Voice/Video Area */}
      <div>
        <div 
          className="glass-panel" 
          style={{ 
            background: inCall ? '#070a13' : 'rgba(255,255,255,0.01)', 
            border: inCall ? '1px solid var(--accent-green)' : '1px solid var(--glass-border)',
            padding: '20px', 
            borderRadius: 'var(--radius-md)', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px',
            boxShadow: inCall ? 'var(--glow-green)' : 'none'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Radio size={20} style={{ color: inCall ? 'var(--accent-green)' : 'var(--text-muted)' }} />
              <div>
                <h4 style={{ fontSize: '1rem' }}>Active Channel: Dispatch Bravo</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Secure Encryption Enabled</p>
              </div>
            </div>
            <button 
              className={inCall ? 'button-secondary' : 'button-primary'} 
              style={{ background: inCall ? 'var(--accent-red)' : '', color: inCall ? 'white' : '' }}
              onClick={toggleCall}
            >
              {inCall ? 'Disconnect Radio' : 'Connect Radio'}
            </button>
          </div>

          {inCall ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Feeds */}
              <div className="video-grid">
                {/* My Feed */}
                <div className="video-feed" style={{ border: micActive ? '2px solid var(--accent-green)' : '1px solid var(--glass-border)' }}>
                  {videoActive ? (
                    <img src={currentOfficer.avatar} alt="" />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
                      <Shield size={32} style={{ opacity: 0.3 }} />
                      <span style={{ fontSize: '0.8rem', marginTop: '6px' }}>Audio Only Connected</span>
                    </div>
                  )}
                  {micActive && <div className="audio-pulse"></div>}
                  <span className="video-feed-label">You ({currentOfficer.name})</span>
                </div>

                {/* Dispatch Operator Feed */}
                <div className="video-feed">
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
                    <Shield size={32} style={{ opacity: 0.3 }} />
                    <span style={{ fontSize: '0.8rem', marginTop: '6px' }}>Supervisor (V. Sharma)</span>
                  </div>
                  <div className="audio-pulse"></div>
                  <span className="video-feed-label">HQ Dispatcher</span>
                </div>
              </div>

              {/* Call Controls */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button 
                  className="button-secondary" 
                  style={{ borderRadius: '50%', minWidth: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: micActive ? 'var(--bg-tertiary)' : 'rgba(239, 68, 68, 0.2)' }}
                  onClick={() => setMicActive(!micActive)}
                  title="Toggle Microphone"
                >
                  {micActive ? <Mic size={18} /> : <MicOff size={18} style={{ color: 'var(--accent-red)' }} />}
                </button>
                <button 
                  className="button-secondary" 
                  style={{ borderRadius: '50%', minWidth: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: videoActive ? 'var(--bg-tertiary)' : 'rgba(255, 255, 255, 0.05)' }}
                  onClick={() => setVideoActive(!videoActive)}
                  title="Toggle Camera"
                >
                  {videoActive ? <Video size={18} /> : <VideoOff size={18} />}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '0.9rem' }}>Click Connect Radio above to join the secure real-time duty audio room.</p>
            </div>
          )}
        </div>
      </div>

      {/* Dispatch Text Logs */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '360px' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Volume2 size={16} /> Radio Text Logs</h4>
        
        {/* Messages List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
          {messages.map(m => (
            <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 'bold' }}>
                <span style={{ color: m.sender.includes('Inspector') ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}>{m.sender}</span>
                <span style={{ color: 'var(--text-muted)' }}>{m.time}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', background: 'rgba(255, 255, 255, 0.02)', padding: '8px', borderRadius: '6px', border: '1px solid var(--glass-border)' }}>
                {m.content}
              </p>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            className="form-control"
            style={{ flex: 1, height: '36px', fontSize: '0.85rem' }}
            placeholder="Type transmission..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="button-primary" style={{ padding: '8px 12px', height: '36px', minWidth: '40px' }}>
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default CommunicationHub;
