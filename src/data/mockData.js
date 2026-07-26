export const initialPersonnel = [
  {
    pNo: "P101",
    name: "Rajesh Kumar",
    rank: "Constable",
    department: "Traffic & Patrol Division",
    status: "Available", // Available, On Duty, Leave, Suspended
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    phone: "+91 98765 43210",
    email: "rajesh.kumar@police.gov.in",
    station: "Central Reserve Station",
    lastDuty: "Night Beat Patrol Sector 2"
  },
  {
    pNo: "P102",
    name: "Vikram Singh",
    rank: "Head Constable",
    department: "Special Operations",
    status: "On Duty",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    phone: "+91 98765 43211",
    email: "vikram.singh@police.gov.in",
    station: "Central Reserve Station",
    lastDuty: "VIP Convoy Escort"
  },
  {
    pNo: "P103",
    name: "Amit Sharma",
    rank: "Constable",
    department: "Crowd Control Squad",
    status: "Available",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    phone: "+91 98765 43212",
    email: "amit.sharma@police.gov.in",
    station: "Sector 5 Reserve Barracks",
    lastDuty: "Strikeforce Delta Deployment"
  },
  {
    pNo: "P104",
    name: "Priya Patel",
    rank: "Sub-Inspector",
    department: "Quick Response Team (QRT)",
    status: "On Duty",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    phone: "+91 98765 43213",
    email: "priya.patel@police.gov.in",
    station: "HQ Control Room",
    lastDuty: "Emergency Distress Dispatch"
  },
  {
    pNo: "P105",
    name: "Sanjay Dutta",
    rank: "Constable",
    department: "General Reserve",
    status: "Leave",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    phone: "+91 98765 43214",
    email: "sanjay.dutta@police.gov.in",
    station: "Sector 5 Reserve Barracks",
    lastDuty: "Perimeter Security Post 1"
  }
];

export const initialDuties = [
  {
    id: "D-2026-001",
    pNo: "P101",
    dutyType: "Market Crowd Control",
    date: "2026-07-26",
    reportingTime: "10:30 AM",
    location: "Chowk Bazaar Central Circle",
    reportingOfficer: "Inspector V. Sharma",
    instructions: "Monitor heavy Sunday crowd. Ensure pedestrian flow remains clear. Check street vendor licenses if layout causes obstruction.",
    priority: "Medium",
    status: "Pending",
    report: null
  },
  {
    id: "D-2026-002",
    pNo: "P102",
    dutyType: "VIP Escort & Highway Guard",
    date: "2026-07-26",
    reportingTime: "08:00 AM",
    location: "National Highway 44 Access Route",
    reportingOfficer: "DSP Amit Kumar",
    instructions: "Provide security clearance at the flyover gate. Keep lane 1 reserved for ministerial convoy passing at 09:15 AM.",
    priority: "High",
    status: "Accepted",
    report: null
  },
  {
    id: "D-2026-003",
    pNo: "P104",
    dutyType: "Night Beat Patrol",
    date: "2026-07-26",
    reportingTime: "10:00 PM",
    location: "Industrial Area Phase 2 & 3",
    reportingOfficer: "Inspector V. Sharma",
    instructions: "Coordinate vehicular patrolling. Pay extra attention to closed factory warehouses and ATMs.",
    priority: "Medium",
    status: "Accepted",
    report: null
  },
  {
    id: "D-2026-004",
    pNo: "P101",
    dutyType: "Stadium Perimeter Security",
    date: "2026-07-25",
    reportingTime: "02:00 PM",
    location: "Netaji Sports Arena - Gate 4",
    reportingOfficer: "Inspector S. Deshmukh",
    instructions: "Guard the gate entry points. Coordinate ticket checks. Ensure fire exits are unlocked.",
    priority: "High",
    status: "Completed",
    report: {
      rawNotes: "Crowd of 8000 entered smoothly. One minor brawl over ticket entry at 3 PM was de-escalated quickly. Gate 4 cleared by 8 PM.",
      aiSummary: "The stadium perimeter duty at Netaji Sports Arena (Gate 4) was successfully executed. Heavy spectator traffic (approx. 8,000) was managed. A minor dispute regarding entry tickets at 15:00 hours was resolved peacefully without force. No other incident occurred, and the perimeter remained secured until final clearance at 20:00 hours.",
      approved: true,
      timestamp: "2026-07-25T20:30:00Z"
    }
  }
];

export const initialAnnouncements = [
  {
    id: "A-001",
    title: "VVIP Movement Protocol Update",
    category: "Daily Orders",
    content: "All units on VIP route duty must strictly adhere to the revised tactical parking configuration. No officers are permitted to use mobile phones during convoy transit.",
    date: "2026-07-26",
    sender: "HQ Operations Center",
    urgent: true
  },
  {
    id: "A-002",
    title: "Annual Physical Evaluation Schedule",
    category: "Circulars",
    content: "The reserve batch evaluation runs from Aug 1st to Aug 5th at the Police Academy grounds. Shift-wise allocations will be published next week.",
    date: "2026-07-25",
    sender: "Training Division",
    urgent: false
  },
  {
    id: "A-003",
    title: "Monsoon Preparedness Protocol",
    category: "Emergency Notices",
    content: "Red alert issued for torrential rain. All emergency deployment teams must prepare safety gear, torches, and water rescue equipment.",
    date: "2026-07-24",
    sender: "Disaster Management Cell",
    urgent: true
  }
];

export const aiTemplates = [
  {
    input: "about 500 people. simple dispute over parking, sorted it out. no injuries.",
    output: "Conducted crowd management for approximately 500 citizens. Resolved a vehicular parking dispute amicably between two parties. Zero casualties, zero property damage, area stabilized successfully."
  },
  {
    input: "patrolled area, all shopkeepers closed by 11pm. caught one drunk person wandering around. warned and sent home.",
    output: "Conducted night-beat patrolling. Ensured commercial establishments closed on time by 23:00 hours. Apprehended an intoxicated individual displaying disorderly conduct. Dispersed the individual with a stern warning after verifying identification."
  },
  {
    input: "vip route. cars cleared out. no problems.",
    output: "Assigned to VIP route security. Cleared non-essential parking along the designated highway corridor. Ensured the convoy passed with zero impediments or security hazards. Route remained secure throughout."
  }
];
