// import React, { useState, useEffect, useCallback } from 'react';
// import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAuth } from '../../context/AuthContext';
// import { getSocket } from '../../utils/socket';
// import { alertsAPI } from '../../utils/api';
// import toast from 'react-hot-toast';

// // ── NAV CONFIG PER ROLE ──────────────────────────────────────────────
// const NAV_CONFIG = {
//   admin: [
//     { sec: 'Overview', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'analytics', icon: '📈', label: 'Analytics' }] },
//     { sec: 'Management', items: [{ id: 'patients', icon: '👥', label: 'Patients' }, { id: 'doctors', icon: '🩺', label: 'Doctors' }, { id: 'user-approval', icon: '👤', label: 'Approvals', badge: 'pending' }, { id: 'appointments', icon: '📅', label: 'Appointments' }] },
//     { sec: 'Hospital', items: [{ id: 'pharmacy', icon: '💊', label: 'Pharmacy' }, { id: 'orders', icon: '🛒', label: 'Orders' }, { id: 'records', icon: '📋', label: 'Records' }, { id: 'emergency', icon: '🚨', label: 'Emergency', badge: 'alerts' }] },
//     { sec: 'Tools', items: [{ id: 'reminders', icon: '⏰', label: 'Reminders' }, { id: 'symptom-checker', icon: '🤖', label: 'AI Checker' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   doctor: [
//     { sec: 'My Practice', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'appointments', icon: '📅', label: 'Appointments' }, { id: 'patients', icon: '👥', label: 'My Patients' }] },
//     { sec: 'Clinical', items: [{ id: 'records', icon: '📋', label: 'Records' }, { id: 'prescriptions', icon: '📝', label: 'Prescriptions' }, { id: 'emergency', icon: '🚨', label: 'Alerts', badge: 'alerts' }] },
//     { sec: 'Tools', items: [{ id: 'symptom-checker', icon: '🤖', label: 'AI Checker' }, { id: 'reminders', icon: '⏰', label: 'Reminders' }, { id: 'analytics', icon: '📈', label: 'Analytics' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   patient: [
//     { sec: 'My Health', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'appointments', icon: '📅', label: 'Book Appointment' }, { id: 'records', icon: '📋', label: 'My Records' }] },
//     { sec: 'Pharmacy', items: [{ id: 'pharmacy', icon: '💊', label: 'Order Medicine' }, { id: 'orders', icon: '🛒', label: 'My Orders' }, { id: 'reminders', icon: '⏰', label: 'Reminders' }] },
//     { sec: 'Emergency', items: [{ id: 'emergency', icon: '🚨', label: 'SOS Emergency' }, { id: 'symptom-checker', icon: '🤖', label: 'AI Checker' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   nurse: [
//     { sec: 'Ward', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'patients', icon: '👥', label: 'Patients' }, { id: 'reminders', icon: '⏰', label: 'Reminders' }] },
//     { sec: 'Clinical', items: [{ id: 'records', icon: '📋', label: 'Records' }, { id: 'emergency', icon: '🚨', label: 'Alerts' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   pharmacist: [
//     { sec: 'Pharmacy', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'pharmacy', icon: '💊', label: 'Inventory' }, { id: 'orders', icon: '🛒', label: 'Orders' }] },
//     { sec: 'Tools', items: [{ id: 'reminders', icon: '⏰', label: 'Reminders' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
// };

// const ROLE_LABELS = { admin: 'Administrator', doctor: 'Doctor', patient: 'Patient', nurse: 'Nurse', pharmacist: 'Pharmacist', wardboy: 'Ward Boy' };

// export default function Layout() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [collapsed, setCollapsed] = useState(false);
//   const [notifsOpen, setNotifsOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [alertCount, setAlertCount] = useState(0);

//   const currentPage = location.pathname.replace('/', '');

//   useEffect(() => {
//     const socket = getSocket();
//     if (!socket) return;
//     socket.on('emergency_alert', (data) => {
//       toast.error(`🚨 SOS: ${data.patientName} – ${data.message}`, { duration: 8000 });
//       setAlertCount(c => c + 1);
//       setNotifications(prev => [{ id: Date.now(), title: 'Emergency SOS', msg: `${data.patientName} – ${data.message}`, time: 'just now', icon: '🚨', bg: '#fef2f2', read: false }, ...prev.slice(0, 19)]);
//     });
//     socket.on('new_appointment', (data) => {
//       toast(`📅 New appointment: ${data.patient}`, { icon: '📅' });
//       setNotifications(prev => [{ id: Date.now(), title: 'New Appointment', msg: `${data.patient} booked for ${data.date}`, time: 'just now', icon: '📅', bg: '#e8effe', read: false }, ...prev.slice(0, 19)]);
//     });
//     socket.on('medication_reminder', (data) => {
//       if (user?.role === 'patient' || user?.role === 'nurse') {
//         toast(`💊 ${data.medicine} – ${data.dose}`, { icon: '⏰', duration: 6000 });
//       }
//     });
//     socket.on('low_stock_alert', (data) => {
//       if (['admin', 'pharmacist'].includes(user?.role)) {
//         toast.error(`⚠️ Low stock: ${data.count} item(s)`, { duration: 6000 });
//       }
//     });
//     return () => { socket.off('emergency_alert'); socket.off('new_appointment'); socket.off('medication_reminder'); socket.off('low_stock_alert'); };
//   }, [user]);

//   const triggerSOS = useCallback(async () => {
//     try {
//       await alertsAPI.create({ type: 'SOS', severity: 'critical', message: 'Emergency SOS triggered via HMS dashboard' });
//       toast.error('🚨 SOS ACTIVATED – Emergency team alerted!', { duration: 8000 });
//     } catch {
//       toast.error('SOS sent!');
//     }
//   }, []);

//   const navConfig = NAV_CONFIG[user?.role] || NAV_CONFIG.patient;
//   const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
//   const unreadCount = notifications.filter(n => !n.read).length;

//   return (
//     <div className="hms-layout">
//       {/* ── SIDEBAR ── */}
//       <motion.aside
//         animate={{ width: collapsed ? 56 : 220 }}
//         transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
//         style={{ background: '#0c1f4a', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', flexShrink: 0, zIndex: 10 }}
//       >
//         {/* Logo */}
//         <div style={{ padding: '18px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,.06)', minHeight: 62 }}>
//           <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#2563eb,#0891b2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>🏥</div>
//           {!collapsed && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, overflow: 'hidden' }}>
//               <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>MediCare</div>
//               <div style={{ color: '#94a3c8', fontSize: 10.5, whiteSpace: 'nowrap' }}>HMS v3.0</div>
//             </motion.div>
//           )}
//           <button onClick={() => setCollapsed(c => !c)} style={{ background: 'none', border: 'none', color: '#94a3c8', cursor: 'pointer', padding: 5, borderRadius: 6, fontSize: 16, flexShrink: 0, transition: 'color .18s' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#94a3c8'}>
//             ☰
//           </button>
//         </div>

//         {/* Nav */}
//         <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 0' }}>
//           {navConfig.map((section) => (
//             <div key={section.sec}>
//               {!collapsed && <div style={{ color: '#94a3c8', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', padding: '10px 18px 4px', whiteSpace: 'nowrap' }}>{section.sec}</div>}
//               {section.items.map((item) => {
//                 const isActive = currentPage === item.id || (item.id === 'dashboard' && currentPage === '');
//                 return (
//                   <button key={item.id} onClick={() => navigate(`/${item.id}`)}
//                     style={{ display: 'flex', alignItems: 'center', gap: 9, padding: collapsed ? '9px' : '9px 14px', cursor: 'pointer', borderRadius: 7, transition: 'all .18s', color: isActive ? '#60a5fa' : '#94a3c8', background: isActive ? 'rgba(59,130,246,.18)' : 'transparent', border: 'none', width: 'calc(100% - 12px)', margin: '1px 6px', fontSize: 13, fontWeight: 600, position: 'relative', justifyContent: collapsed ? 'center' : 'flex-start' }}
//                     onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.color = '#e2e8f0'; } }}
//                     onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3c8'; } }}
//                   >
//                     {isActive && <span style={{ position: 'absolute', left: -6, top: '50%', transform: 'translateY(-50%)', width: 3, height: 16, background: '#3b82f6', borderRadius: '0 3px 3px 0' }} />}
//                     <span style={{ fontSize: 15, width: 18, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
//                     {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
//                     {!collapsed && item.badge === 'alerts' && alertCount > 0 && <span style={{ background: '#dc2626', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 10, marginLeft: 'auto' }}>{alertCount}</span>}
//                   </button>
//                 );
//               })}
//             </div>
//           ))}
//         </nav>

//         {/* User footer */}
//         <div style={{ padding: 10, borderTop: '1px solid rgba(255,255,255,.06)' }}>
//           <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: 9, borderRadius: 8, cursor: 'pointer', transition: 'background .18s', border: 'none', background: 'transparent', width: '100%', justifyContent: collapsed ? 'center' : 'flex-start' }}
//             onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.07)'}
//             onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
//           >
//             <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{initials}</div>
//             {!collapsed && (
//               <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
//                 <div style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
//                 <div style={{ color: '#94a3c8', fontSize: 10, whiteSpace: 'nowrap' }}>{ROLE_LABELS[user?.role]}</div>
//               </div>
//             )}
//             {!collapsed && <span style={{ color: '#94a3c8', fontSize: 12 }}>🚪</span>}
//           </button>
//         </div>
//       </motion.aside>

//       {/* ── MAIN ── */}
//       <div className="content-area">
//         {/* Topbar */}
//         <header style={{ height: 60, background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, flexShrink: 0, zIndex: 9, boxShadow: '0 1px 4px rgba(15,23,42,.04)' }}>
//           <div style={{ flex: 1, maxWidth: 320, position: 'relative' }}>
//             <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 14 }}>🔍</span>
//             <input className="form-input" style={{ paddingLeft: 34, borderRadius: 22, background: '#f8fafc', fontSize: 13 }} placeholder="Search patients, doctors, medicines…" />
//           </div>
//           <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
//             {/* SOS */}
//             <button onClick={triggerSOS} className="sos-button sos-button-sm" title="Emergency SOS (Ctrl+E)">🚨<span>SOS</span></button>

//             {/* Notifications */}
//             <div style={{ position: 'relative' }}>
//               <button onClick={() => setNotifsOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 7, borderRadius: 8, fontSize: 17, color: '#475569', transition: 'all .18s', position: 'relative' }}
//                 onMouseEnter={e => { e.currentTarget.style.background = '#f1f5fb'; }}
//                 onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
//               >
//                 🔔
//                 {unreadCount > 0 && <span style={{ position: 'absolute', top: 5, right: 5, width: 7, height: 7, background: '#dc2626', borderRadius: '50%', border: '1.5px solid #fff', animation: 'pulse 2s infinite' }} />}
//               </button>
//               <AnimatePresence>
//                 {notifsOpen && (
//                   <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
//                     style={{ position: 'absolute', top: 44, right: 0, width: 320, background: '#fff', borderRadius: 14, boxShadow: '0 16px 48px rgba(15,23,42,.16)', border: '1px solid #e2e8f0', zIndex: 50 }}
//                   >
//                     <div style={{ padding: '12px 14px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <span style={{ fontWeight: 700, fontSize: 14 }}>Notifications</span>
//                       <button className="btn btn-ghost btn-xs" onClick={() => { setNotifications(n => n.map(x => ({ ...x, read: true }))); }}>Mark all read</button>
//                     </div>
//                     <div style={{ maxHeight: 340, overflowY: 'auto' }}>
//                       {notifications.length === 0 ? (
//                         <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No notifications yet</div>
//                       ) : notifications.map(n => (
//                         <div key={n.id} style={{ padding: '11px 14px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: 10, cursor: 'pointer', background: n.read ? 'transparent' : '#f8faff', transition: 'background .12s' }}
//                           onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; }}
//                           onMouseLeave={e => { e.currentTarget.style.background = n.read ? 'transparent' : '#f8faff'; }}
//                         >
//                           <div style={{ width: 34, height: 34, borderRadius: '50%', background: n.bg || '#e8effe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{n.icon}</div>
//                           <div style={{ flex: 1, minWidth: 0 }}>
//                             <div style={{ fontSize: 12.5, fontWeight: 700 }}>{n.title}</div>
//                             <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.msg}</div>
//                           </div>
//                           <div style={{ fontSize: 10.5, color: '#94a3b8', whiteSpace: 'nowrap' }}>{n.time}</div>
//                         </div>
//                       ))}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             <div style={{ width: 1, height: 22, background: '#e2e8f0', margin: '0 4px' }} />

//             <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/settings')}>
//               <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#1648c9,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>{initials}</div>
//               <div>
//                 <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
//                 <div style={{ fontSize: 10.5, color: '#94a3b8' }}>{ROLE_LABELS[user?.role]}</div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Page content */}
//         <main className="page-content">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={location.pathname}
//               initial={{ opacity: 0, y: 14 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//               transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
//             >
//               <Outlet />
//             </motion.div>
//           </AnimatePresence>
//         </main>
//       </div>

//       {/* Click-outside close for notifs */}
//       {notifsOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setNotifsOpen(false)} />}
//     </div>
//   );
// }


// import React, { useState, useEffect, useCallback } from 'react';
// import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAuth } from '../../context/AuthContext';
// import { getSocket } from '../../utils/socket';
// import { alertsAPI } from '../../utils/api';
// import toast from 'react-hot-toast';
// import SupportBot from "../SupportBot";


// // ── NAV CONFIG PER ROLE ──────────────────────────────────────────────
// const NAV_CONFIG = {
//   admin: [
//     { sec: 'Overview', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'analytics', icon: '📈', label: 'Analytics' }] },
//     { sec: 'Management', items: [{ id: 'patients', icon: '👥', label: 'Patients' }, { id: 'doctors', icon: '🩺', label: 'Doctors' }, { id: 'user-approval', icon: '👤', label: 'Approvals', badge: 'pending' }, { id: 'appointments', icon: '📅', label: 'Appointments' }] },
//     { sec: 'Hospital', items: [{ id: 'pharmacy', icon: '💊', label: 'Pharmacy' }, { id: 'orders', icon: '🛒', label: 'Orders' }, { id: 'records', icon: '📋', label: 'Records' }, { id: 'emergency', icon: '🚨', label: 'Emergency', badge: 'alerts' }] },
//     { sec: 'Facility', items: [{ id: 'rooms', icon: '🏥', label: 'Rooms & OT' }, { id: 'chat', icon: '💬', label: 'Chat', badge:'new' }] },
//     { sec: 'Tools', items: [{ id: 'reminders', icon: '⏰', label: 'Reminders' }, { id: 'symptom-checker', icon: '🤖', label: 'AI Checker' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   doctor: [
//     { sec: 'My Practice', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'appointments', icon: '📅', label: 'Appointments' }, { id: 'patients', icon: '👥', label: 'My Patients' }] },
//     { sec: 'Clinical', items: [{ id: 'records', icon: '📋', label: 'Records' }, { id: 'prescriptions', icon: '📝', label: 'Prescriptions' }, { id: 'emergency', icon: '🚨', label: 'Alerts', badge: 'alerts' }] },
//     { sec: 'Facility', items: [{ id: 'rooms', icon: '🏥', label: 'Rooms & OT' }, { id: 'chat', icon: '💬', label: 'Chat', badge:'new' }] },
//     { sec: 'Tools', items: [{ id: 'symptom-checker', icon: '🤖', label: 'AI Checker' }, { id: 'reminders', icon: '⏰', label: 'Reminders' }, { id: 'analytics', icon: '📈', label: 'Analytics' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   patient: [
//     { sec: 'My Health', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'appointments', icon: '📅', label: 'Book Appointment' }, { id: 'records', icon: '📋', label: 'My Records' }] },
//     { sec: 'Pharmacy', items: [{ id: 'pharmacy', icon: '💊', label: 'Order Medicine' }, { id: 'orders', icon: '🛒', label: 'My Orders' }, { id: 'reminders', icon: '⏰', label: 'Reminders' }] },
//     { sec: 'Emergency', items: [{ id: 'emergency', icon: '🚨', label: 'SOS Emergency' }, { id: 'symptom-checker', icon: '🤖', label: 'AI Checker' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   nurse: [
//     { sec: 'Ward', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'patients', icon: '👥', label: 'Patients' }, { id: 'reminders', icon: '⏰', label: 'Reminders' }] },
//     { sec: 'Facility', items: [{ id: 'rooms', icon: '🏥', label: 'Rooms & OT' }, { id: 'chat', icon: '💬', label: 'Chat' }] },
//     { sec: 'Clinical', items: [{ id: 'records', icon: '📋', label: 'Records' }, { id: 'emergency', icon: '🚨', label: 'Alerts' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   pharmacist: [
//     { sec: 'Pharmacy', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'pharmacy', icon: '💊', label: 'Inventory' }, { id: 'orders', icon: '🛒', label: 'Orders' }] },
//     { sec: 'Tools', items: [{ id: 'rooms', icon: '🏥', label: 'Rooms' }, { id: 'chat', icon: '💬', label: 'Chat' }, { id: 'reminders', icon: '⏰', label: 'Reminders' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   wardboy: [
//     { sec: 'My Work', items: [{ id: 'staff-dashboard', icon: '🛏️', label: 'My Dashboard' }, { id: 'rooms', icon: '🏥', label: 'Rooms' }] },
//     { sec: 'Communication', items: [{ id: 'chat', icon: '💬', label: 'Chat' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   sweeper: [
//     { sec: 'My Work', items: [{ id: 'staff-dashboard', icon: '🧹', label: 'My Dashboard' }, { id: 'rooms', icon: '🏥', label: 'Rooms' }] },
//     { sec: 'Communication', items: [{ id: 'chat', icon: '💬', label: 'Chat' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   otboy: [
//     { sec: 'My Work', items: [{ id: 'staff-dashboard', icon: '🔪', label: 'My Dashboard' }, { id: 'rooms', icon: '🏥', label: 'OT Rooms' }] },
//     { sec: 'Communication', items: [{ id: 'chat', icon: '💬', label: 'Chat' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
// };

// const ROLE_LABELS = { admin: 'Administrator', doctor: 'Doctor', patient: 'Patient', nurse: 'Nurse', pharmacist: 'Pharmacist', wardboy: 'Ward Boy', sweeper: 'Sweeper', otboy: 'OT Boy' };

// export default function Layout() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [collapsed, setCollapsed] = useState(false);
//   const [notifsOpen, setNotifsOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [alertCount, setAlertCount] = useState(0);

//   const currentPage = location.pathname.replace('/', '');

//   useEffect(() => {
//     const socket = getSocket();
//     if (!socket) return;
//     socket.on('emergency_alert', (data) => {
//       toast.error(`🚨 SOS: ${data.patientName} – ${data.message}`, { duration: 8000 });
//       setAlertCount(c => c + 1);
//       setNotifications(prev => [{ id: Date.now(), title: 'Emergency SOS', msg: `${data.patientName} – ${data.message}`, time: 'just now', icon: '🚨', bg: '#fef2f2', read: false }, ...prev.slice(0, 19)]);
//     });
//     socket.on('new_appointment', (data) => {
//       toast(`📅 New appointment: ${data.patient}`, { icon: '📅' });
//       setNotifications(prev => [{ id: Date.now(), title: 'New Appointment', msg: `${data.patient} booked for ${data.date}`, time: 'just now', icon: '📅', bg: '#e8effe', read: false }, ...prev.slice(0, 19)]);
//     });
//     socket.on('medication_reminder', (data) => {
//       if (user?.role === 'patient' || user?.role === 'nurse') {
//         toast(`💊 ${data.medicine} – ${data.dose}`, { icon: '⏰', duration: 6000 });
//       }
//     });
//     socket.on('low_stock_alert', (data) => {
//       if (['admin', 'pharmacist'].includes(user?.role)) {
//         toast.error(`⚠️ Low stock: ${data.count} item(s)`, { duration: 6000 });
//       }
//     });
//     return () => { socket.off('emergency_alert'); socket.off('new_appointment'); socket.off('medication_reminder'); socket.off('low_stock_alert'); };
//   }, [user]);

//   const triggerSOS = useCallback(async () => {
//     try {
//       await alertsAPI.create({ type: 'SOS', severity: 'critical', message: 'Emergency SOS triggered via HMS dashboard' });
//       toast.error('🚨 SOS ACTIVATED – Emergency team alerted!', { duration: 8000 });
//     } catch {
//       toast.error('SOS sent!');
//     }
//   }, []);

//   const navConfig = NAV_CONFIG[user?.role] || NAV_CONFIG.patient;
//   const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
//   const unreadCount = notifications.filter(n => !n.read).length;

//   return (
//     <div className="hms-layout">
//       {/* ── SIDEBAR ── */}
//       <motion.aside
//         animate={{ width: collapsed ? 56 : 220 }}
//         transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
//         style={{ background: '#0c1f4a', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', flexShrink: 0, zIndex: 10 }}
//       >
//         {/* Logo */}
//         <div style={{ padding: '18px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,.06)', minHeight: 62 }}>
//           <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#2563eb,#0891b2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>🏥</div>
//           {!collapsed && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, overflow: 'hidden' }}>
//               <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>MediCare</div>
//               <div style={{ color: '#94a3c8', fontSize: 10.5, whiteSpace: 'nowrap' }}>HMS v3.0</div>
//             </motion.div>
//           )}
//           <button onClick={() => setCollapsed(c => !c)} style={{ background: 'none', border: 'none', color: '#94a3c8', cursor: 'pointer', padding: 5, borderRadius: 6, fontSize: 16, flexShrink: 0, transition: 'color .18s' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#94a3c8'}>
//             ☰
//           </button>
//         </div>

//         {/* Nav */}
//         <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 0' }}>
//           {navConfig.map((section) => (
//             <div key={section.sec}>
//               {!collapsed && <div style={{ color: '#94a3c8', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', padding: '10px 18px 4px', whiteSpace: 'nowrap' }}>{section.sec}</div>}
//               {section.items.map((item) => {
//                 const isActive = currentPage === item.id || (item.id === 'dashboard' && currentPage === '');
//                 return (
//                   <button key={item.id} onClick={() => navigate(`/${item.id}`)}
//                     style={{ display: 'flex', alignItems: 'center', gap: 9, padding: collapsed ? '9px' : '9px 14px', cursor: 'pointer', borderRadius: 7, transition: 'all .18s', color: isActive ? '#60a5fa' : '#94a3c8', background: isActive ? 'rgba(59,130,246,.18)' : 'transparent', border: 'none', width: 'calc(100% - 12px)', margin: '1px 6px', fontSize: 13, fontWeight: 600, position: 'relative', justifyContent: collapsed ? 'center' : 'flex-start' }}
//                     onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.color = '#e2e8f0'; } }}
//                     onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3c8'; } }}
//                   >
//                     {isActive && <span style={{ position: 'absolute', left: -6, top: '50%', transform: 'translateY(-50%)', width: 3, height: 16, background: '#3b82f6', borderRadius: '0 3px 3px 0' }} />}
//                     <span style={{ fontSize: 15, width: 18, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
//                     {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
//                     {!collapsed && item.badge === 'alerts' && alertCount > 0 && <span style={{ background: '#dc2626', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 10, marginLeft: 'auto' }}>{alertCount}</span>}
//                   </button>
//                 );
//               })}
//             </div>
//           ))}
//         </nav>

//         {/* User footer */}
//         <div style={{ padding: 10, borderTop: '1px solid rgba(255,255,255,.06)' }}>
//           <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: 9, borderRadius: 8, cursor: 'pointer', transition: 'background .18s', border: 'none', background: 'transparent', width: '100%', justifyContent: collapsed ? 'center' : 'flex-start' }}
//             onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.07)'}
//             onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
//           >
//             <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{initials}</div>
//             {!collapsed && (
//               <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
//                 <div style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
//                 <div style={{ color: '#94a3c8', fontSize: 10, whiteSpace: 'nowrap' }}>{ROLE_LABELS[user?.role]}</div>
//               </div>
//             )}
//             {!collapsed && <span style={{ color: '#94a3c8', fontSize: 12 }}>🚪</span>}
//           </button>
//         </div>
//       </motion.aside>

//       {/* ── MAIN ── */}
//       <div className="content-area">
//         {/* Topbar */}
//         <header style={{ height: 60, background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, flexShrink: 0, zIndex: 9, boxShadow: '0 1px 4px rgba(15,23,42,.04)' }}>
//           <div style={{ flex: 1, maxWidth: 320, position: 'relative' }}>
//             <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 14 }}>🔍</span>
//             <input className="form-input" style={{ paddingLeft: 34, borderRadius: 22, background: '#f8fafc', fontSize: 13 }} placeholder="Search patients, doctors, medicines…" />
//           </div>
//           <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
//             {/* SOS */}
//             <button onClick={triggerSOS} className="sos-button sos-button-sm" title="Emergency SOS (Ctrl+E)">🚨<span>SOS</span></button>

//             {/* Notifications */}
//             <div style={{ position: 'relative' }}>
//               <button onClick={() => setNotifsOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 7, borderRadius: 8, fontSize: 17, color: '#475569', transition: 'all .18s', position: 'relative' }}
//                 onMouseEnter={e => { e.currentTarget.style.background = '#f1f5fb'; }}
//                 onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
//               >
//                 🔔
//                 {unreadCount > 0 && <span style={{ position: 'absolute', top: 5, right: 5, width: 7, height: 7, background: '#dc2626', borderRadius: '50%', border: '1.5px solid #fff', animation: 'pulse 2s infinite' }} />}
//               </button>
//               <AnimatePresence>
//                 {notifsOpen && (
//                   <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
//                     style={{ position: 'absolute', top: 44, right: 0, width: 320, background: '#fff', borderRadius: 14, boxShadow: '0 16px 48px rgba(15,23,42,.16)', border: '1px solid #e2e8f0', zIndex: 50 }}
//                   >
//                     <div style={{ padding: '12px 14px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <span style={{ fontWeight: 700, fontSize: 14 }}>Notifications</span>
//                       <button className="btn btn-ghost btn-xs" onClick={() => { setNotifications(n => n.map(x => ({ ...x, read: true }))); }}>Mark all read</button>
//                     </div>
//                     <div style={{ maxHeight: 340, overflowY: 'auto' }}>
//                       {notifications.length === 0 ? (
//                         <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No notifications yet</div>
//                       ) : notifications.map(n => (
//                         <div key={n.id} style={{ padding: '11px 14px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: 10, cursor: 'pointer', background: n.read ? 'transparent' : '#f8faff', transition: 'background .12s' }}
//                           onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; }}
//                           onMouseLeave={e => { e.currentTarget.style.background = n.read ? 'transparent' : '#f8faff'; }}
//                         >
//                           <div style={{ width: 34, height: 34, borderRadius: '50%', background: n.bg || '#e8effe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{n.icon}</div>
//                           <div style={{ flex: 1, minWidth: 0 }}>
//                             <div style={{ fontSize: 12.5, fontWeight: 700 }}>{n.title}</div>
//                             <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.msg}</div>
//                           </div>
//                           <div style={{ fontSize: 10.5, color: '#94a3b8', whiteSpace: 'nowrap' }}>{n.time}</div>
//                         </div>
//                       ))}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             <div style={{ width: 1, height: 22, background: '#e2e8f0', margin: '0 4px' }} />

//             <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/settings')}>
//               <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#1648c9,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>{initials}</div>
//               <div>
//                 <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
//                 <div style={{ fontSize: 10.5, color: '#94a3b8' }}>{ROLE_LABELS[user?.role]}</div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Page content */}
//         <main className="page-content">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={location.pathname}
//               initial={{ opacity: 0, y: 14 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//               transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
//             >
//               <Outlet />
//       <SupportBot/>
//             </motion.div>
//           </AnimatePresence>
//         </main>
//       </div>

//       {/* Click-outside close for notifs */}
//       {notifsOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setNotifsOpen(false)} />}
//     </div>
//   );
// }


// import React, { useState, useEffect, useCallback } from 'react';
// import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAuth } from '../../context/AuthContext';
// import { getSocket } from '../../utils/socket';
// import { alertsAPI } from '../../utils/api';
// import toast from 'react-hot-toast';
// import SupportBot from '../SupportBot';

// // ── NAV CONFIG PER ROLE ──────────────────────────────────────────────
// const NAV_CONFIG = {
//   admin: [
//     { sec: 'Overview', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'analytics', icon: '📈', label: 'Analytics' }] },
//     { sec: 'Management', items: [{ id: 'patients', icon: '👥', label: 'Patients' }, { id: 'doctors', icon: '🩺', label: 'Doctors' }, { id: 'user-approval', icon: '👤', label: 'Approvals', badge: 'pending' }, { id: 'appointments', icon: '📅', label: 'Appointments' }] },
//     { sec: 'Hospital', items: [{ id: 'pharmacy', icon: '💊', label: 'Pharmacy' }, { id: 'orders', icon: '🛒', label: 'Orders' }, { id: 'records', icon: '📋', label: 'Records' }, { id: 'emergency', icon: '🚨', label: 'Emergency', badge: 'alerts' }] },
//     { sec: 'Facility', items: [{ id: 'rooms', icon: '🏥', label: 'Rooms & OT' }, { id: 'chat', icon: '💬', label: 'Chat', badge:'new' }] },
//     { sec: 'Tools', items: [{ id: 'notice-board', icon: '📢', label: 'Notice Board' }, { id: 'reminders', icon: '⏰', label: 'Reminders' }, { id: 'symptom-checker', icon: '🤖', label: 'AI Checker' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   doctor: [
//     { sec: 'My Practice', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'appointments', icon: '📅', label: 'Appointments' }, { id: 'patients', icon: '👥', label: 'My Patients' }] },
//     { sec: 'Clinical', items: [{ id: 'records', icon: '📋', label: 'Records' }, { id: 'prescriptions', icon: '📝', label: 'Prescriptions' }, { id: 'emergency', icon: '🚨', label: 'Alerts', badge: 'alerts' }] },
//     { sec: 'Facility', items: [{ id: 'rooms', icon: '🏥', label: 'Rooms & OT' }, { id: 'chat', icon: '💬', label: 'Chat', badge:'new' }] },
//     { sec: 'Tools', items: [{ id: 'notice-board', icon: '📢', label: 'Notice Board' }, { id: 'symptom-checker', icon: '🤖', label: 'AI Checker' }, { id: 'reminders', icon: '⏰', label: 'Reminders' }, { id: 'analytics', icon: '📈', label: 'Analytics' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   patient: [
//     { sec: 'My Health', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'appointments', icon: '📅', label: 'Book Appointment' }, { id: 'records', icon: '📋', label: 'My Records' }] },
//     { sec: 'Pharmacy', items: [{ id: 'pharmacy', icon: '💊', label: 'Order Medicine' }, { id: 'orders', icon: '🛒', label: 'My Orders' }, { id: 'reminders', icon: '⏰', label: 'Reminders' }] },
//     { sec: 'Emergency', items: [{ id: 'emergency', icon: '🚨', label: 'SOS Emergency' }, { id: 'notice-board', icon: '📢', label: 'Notice Board' }, { id: 'symptom-checker', icon: '🤖', label: 'AI Checker' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   nurse: [
//     { sec: 'Ward', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'patients', icon: '👥', label: 'Patients' }, { id: 'reminders', icon: '⏰', label: 'Reminders' }] },
//     { sec: 'Facility', items: [{ id: 'rooms', icon: '🏥', label: 'Rooms & OT' }, { id: 'chat', icon: '💬', label: 'Chat' }] },
//     { sec: 'Clinical', items: [{ id: 'records', icon: '📋', label: 'Records' }, { id: 'emergency', icon: '🚨', label: 'Alerts' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   pharmacist: [
//     { sec: 'Pharmacy', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'pharmacy', icon: '💊', label: 'Inventory' }, { id: 'orders', icon: '🛒', label: 'Orders' }] },
//     { sec: 'Tools', items: [{ id: 'rooms', icon: '🏥', label: 'Rooms' }, { id: 'chat', icon: '💬', label: 'Chat' }, { id: 'reminders', icon: '⏰', label: 'Reminders' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   wardboy: [
//     { sec: 'My Work', items: [{ id: 'staff-dashboard', icon: '🛏️', label: 'My Dashboard' }, { id: 'rooms', icon: '🏥', label: 'Rooms' }] },
//     { sec: 'Communication', items: [{ id: 'notice-board', icon: '📢', label: 'Notice Board' }, { id: 'chat', icon: '💬', label: 'Chat' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   sweeper: [
//     { sec: 'My Work', items: [{ id: 'staff-dashboard', icon: '🧹', label: 'My Dashboard' }, { id: 'rooms', icon: '🏥', label: 'Rooms' }] },
//     { sec: 'Communication', items: [{ id: 'chat', icon: '💬', label: 'Chat' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   otboy: [
//     { sec: 'My Work', items: [{ id: 'staff-dashboard', icon: '🔪', label: 'My Dashboard' }, { id: 'rooms', icon: '🏥', label: 'OT Rooms' }] },
//     { sec: 'Communication', items: [{ id: 'chat', icon: '💬', label: 'Chat' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
// };

// const ROLE_LABELS = { admin: 'Administrator', doctor: 'Doctor', patient: 'Patient', nurse: 'Nurse', pharmacist: 'Pharmacist', wardboy: 'Ward Boy', sweeper: 'Sweeper', otboy: 'OT Boy' };

// export default function Layout() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [collapsed, setCollapsed] = useState(false);
//   const [notifsOpen, setNotifsOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [alertCount, setAlertCount] = useState(0);

//   const currentPage = location.pathname.replace('/', '');

//   useEffect(() => {
//     const socket = getSocket();
//     if (!socket) return;
//     socket.on('emergency_alert', (data) => {
//       toast.error(`🚨 SOS: ${data.patientName} – ${data.message}`, { duration: 8000 });
//       setAlertCount(c => c + 1);
//       setNotifications(prev => [{ id: Date.now(), title: 'Emergency SOS', msg: `${data.patientName} – ${data.message}`, time: 'just now', icon: '🚨', bg: '#fef2f2', read: false }, ...prev.slice(0, 19)]);
//     });
//     socket.on('new_appointment', (data) => {
//       toast(`📅 New appointment: ${data.patient}`, { icon: '📅' });
//       setNotifications(prev => [{ id: Date.now(), title: 'New Appointment', msg: `${data.patient} booked for ${data.date}`, time: 'just now', icon: '📅', bg: '#e8effe', read: false }, ...prev.slice(0, 19)]);
//     });
//     socket.on('medication_reminder', (data) => {
//       if (user?.role === 'patient' || user?.role === 'nurse') {
//         toast(`💊 ${data.medicine} – ${data.dose}`, { icon: '⏰', duration: 6000 });
//       }
//     });
//     socket.on('low_stock_alert', (data) => {
//       if (['admin', 'pharmacist'].includes(user?.role)) {
//         toast.error(`⚠️ Low stock: ${data.count} item(s)`, { duration: 6000 });
//       }
//     });
//     return () => { socket.off('emergency_alert'); socket.off('new_appointment'); socket.off('medication_reminder'); socket.off('low_stock_alert'); };
//   }, [user]);

//   const triggerSOS = useCallback(async () => {
//     try {
//       await alertsAPI.create({ type: 'SOS', severity: 'critical', message: 'Emergency SOS triggered via HMS dashboard' });
//       toast.error('🚨 SOS ACTIVATED – Emergency team alerted!', { duration: 8000 });
//     } catch {
//       toast.error('SOS sent!');
//     }
//   }, []);

//   const navConfig = NAV_CONFIG[user?.role] || NAV_CONFIG.patient;
//   const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
//   const unreadCount = notifications.filter(n => !n.read).length;

//   return (
//     <div className="hms-layout">
//       {/* ── SIDEBAR ── */}
//       <motion.aside
//         animate={{ width: collapsed ? 56 : 220 }}
//         transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
//         style={{ background: '#0c1f4a', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', flexShrink: 0, zIndex: 10 }}
//       >
//         {/* Logo */}
//         <div style={{ padding: '18px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,.06)', minHeight: 62 }}>
//           <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#2563eb,#0891b2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>🏥</div>
//           {!collapsed && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, overflow: 'hidden' }}>
//               <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>MediCare</div>
//               <div style={{ color: '#94a3c8', fontSize: 10.5, whiteSpace: 'nowrap' }}>HMS v3.0</div>
//             </motion.div>
//           )}
//           <button onClick={() => setCollapsed(c => !c)} style={{ background: 'none', border: 'none', color: '#94a3c8', cursor: 'pointer', padding: 5, borderRadius: 6, fontSize: 16, flexShrink: 0, transition: 'color .18s' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#94a3c8'}>
//             ☰
//           </button>
//         </div>

//         {/* Nav */}
//         <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 0' }}>
//           {navConfig.map((section) => (
//             <div key={section.sec}>
//               {!collapsed && <div style={{ color: '#94a3c8', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', padding: '10px 18px 4px', whiteSpace: 'nowrap' }}>{section.sec}</div>}
//               {section.items.map((item) => {
//                 const isActive = currentPage === item.id || (item.id === 'dashboard' && currentPage === '');
//                 return (
//                   <button key={item.id} onClick={() => navigate(`/${item.id}`)}
//                     style={{ display: 'flex', alignItems: 'center', gap: 9, padding: collapsed ? '9px' : '9px 14px', cursor: 'pointer', borderRadius: 7, transition: 'all .18s', color: isActive ? '#60a5fa' : '#94a3c8', background: isActive ? 'rgba(59,130,246,.18)' : 'transparent', border: 'none', width: 'calc(100% - 12px)', margin: '1px 6px', fontSize: 13, fontWeight: 600, position: 'relative', justifyContent: collapsed ? 'center' : 'flex-start' }}
//                     onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.color = '#e2e8f0'; } }}
//                     onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3c8'; } }}
//                   >
//                     {isActive && <span style={{ position: 'absolute', left: -6, top: '50%', transform: 'translateY(-50%)', width: 3, height: 16, background: '#3b82f6', borderRadius: '0 3px 3px 0' }} />}
//                     <span style={{ fontSize: 15, width: 18, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
//                     {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
//                     {!collapsed && item.badge === 'alerts' && alertCount > 0 && <span style={{ background: '#dc2626', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 10, marginLeft: 'auto' }}>{alertCount}</span>}
//                   </button>
//                 );
//               })}
//             </div>
//           ))}
//         </nav>

//         {/* User footer */}
//         <div style={{ padding: 10, borderTop: '1px solid rgba(255,255,255,.06)' }}>
//           <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: 9, borderRadius: 8, cursor: 'pointer', transition: 'background .18s', border: 'none', background: 'transparent', width: '100%', justifyContent: collapsed ? 'center' : 'flex-start' }}
//             onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.07)'}
//             onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
//           >
//             <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{initials}</div>
//             {!collapsed && (
//               <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
//                 <div style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
//                 <div style={{ color: '#94a3c8', fontSize: 10, whiteSpace: 'nowrap' }}>{ROLE_LABELS[user?.role]}</div>
//               </div>
//             )}
//             {!collapsed && <span style={{ color: '#94a3c8', fontSize: 12 }}>🚪</span>}
//           </button>
//         </div>
//       </motion.aside>

//       {/* ── MAIN ── */}
//       <div className="content-area">
//         {/* Topbar */}
//         <header style={{ height: 60, background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, flexShrink: 0, zIndex: 9, boxShadow: '0 1px 4px rgba(15,23,42,.04)' }}>
//           <div style={{ flex: 1, maxWidth: 320, position: 'relative' }}>
//             <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 14 }}>🔍</span>
//             <input className="form-input" style={{ paddingLeft: 34, borderRadius: 22, background: '#f8fafc', fontSize: 13 }} placeholder="Search patients, doctors, medicines…" />
//           </div>
//           <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
//             {/* SOS */}
//             <button onClick={triggerSOS} className="sos-button sos-button-sm" title="Emergency SOS (Ctrl+E)">🚨<span>SOS</span></button>

//             {/* Notifications */}
//             <div style={{ position: 'relative' }}>
//               <button onClick={() => setNotifsOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 7, borderRadius: 8, fontSize: 17, color: '#475569', transition: 'all .18s', position: 'relative' }}
//                 onMouseEnter={e => { e.currentTarget.style.background = '#f1f5fb'; }}
//                 onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
//               >
//                 🔔
//                 {unreadCount > 0 && <span style={{ position: 'absolute', top: 5, right: 5, width: 7, height: 7, background: '#dc2626', borderRadius: '50%', border: '1.5px solid #fff', animation: 'pulse 2s infinite' }} />}
//               </button>
//               <AnimatePresence>
//                 {notifsOpen && (
//                   <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
//                     style={{ position: 'absolute', top: 44, right: 0, width: 320, background: '#fff', borderRadius: 14, boxShadow: '0 16px 48px rgba(15,23,42,.16)', border: '1px solid #e2e8f0', zIndex: 50 }}
//                   >
//                     <div style={{ padding: '12px 14px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <span style={{ fontWeight: 700, fontSize: 14 }}>Notifications</span>
//                       <button className="btn btn-ghost btn-xs" onClick={() => { setNotifications(n => n.map(x => ({ ...x, read: true }))); }}>Mark all read</button>
//                     </div>
//                     <div style={{ maxHeight: 340, overflowY: 'auto' }}>
//                       {notifications.length === 0 ? (
//                         <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No notifications yet</div>
//                       ) : notifications.map(n => (
//                         <div key={n.id} style={{ padding: '11px 14px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: 10, cursor: 'pointer', background: n.read ? 'transparent' : '#f8faff', transition: 'background .12s' }}
//                           onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; }}
//                           onMouseLeave={e => { e.currentTarget.style.background = n.read ? 'transparent' : '#f8faff'; }}
//                         >
//                           <div style={{ width: 34, height: 34, borderRadius: '50%', background: n.bg || '#e8effe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{n.icon}</div>
//                           <div style={{ flex: 1, minWidth: 0 }}>
//                             <div style={{ fontSize: 12.5, fontWeight: 700 }}>{n.title}</div>
//                             <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.msg}</div>
//                           </div>
//                           <div style={{ fontSize: 10.5, color: '#94a3b8', whiteSpace: 'nowrap' }}>{n.time}</div>
//                         </div>
//                       ))}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             <div style={{ width: 1, height: 22, background: '#e2e8f0', margin: '0 4px' }} />

//             <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/settings')}>
//               <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#1648c9,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>{initials}</div>
//               <div>
//                 <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
//                 <div style={{ fontSize: 10.5, color: '#94a3b8' }}>{ROLE_LABELS[user?.role]}</div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Page content */}
//         <main className="page-content">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={location.pathname}
//               initial={{ opacity: 0, y: 14 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//               transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
//             >
//               <Outlet />
//       <SupportBot />
//             </motion.div>
//           </AnimatePresence>
//         </main>
//       </div>

//       {/* Click-outside close for notifs */}
//       {notifsOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setNotifsOpen(false)} />}
//     </div>
//   );
// }


// import React, { useState, useEffect, useCallback } from 'react';
// import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAuth } from '../../context/AuthContext';
// import { getSocket } from '../../utils/socket';
// import { alertsAPI } from '../../utils/api';
// import toast from 'react-hot-toast';
// import SupportBot from '../SupportBot';

// // ── NAV CONFIG PER ROLE ──────────────────────────────────────────────
// const NAV_CONFIG = {
//   admin: [
//     { sec: 'Overview', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'analytics', icon: '📈', label: 'Analytics' }] },
//     { sec: 'Management', items: [{ id: 'patients', icon: '👥', label: 'Patients' }, { id: 'doctors', icon: '🩺', label: 'Doctors' }, { id: 'user-approval', icon: '👤', label: 'Approvals', badge: 'pending' }, { id: 'appointments', icon: '📅', label: 'Appointments' }] },
//     { sec: 'Hospital', items: [{ id: 'pharmacy', icon: '💊', label: 'Pharmacy' }, { id: 'orders', icon: '🛒', label: 'Orders' }, { id: 'records', icon: '📋', label: 'Records' }, { id: 'emergency', icon: '🚨', label: 'Emergency', badge: 'alerts' }] },
//     { sec: 'Facility', items: [{ id: 'rooms', icon: '🏥', label: 'Rooms & OT' }, { id: 'chat', icon: '💬', label: 'Chat', badge:'new' }] },
//     { sec: 'HR', items: [{ id: 'leaves', icon: '🌴', label: 'Leave Mgmt', badge:'new' }] },
//     { sec: 'Tools', items: [{ id: 'notice-board', icon: '📢', label: 'Notice Board' }, { id: 'reminders', icon: '⏰', label: 'Reminders' }, { id: 'symptom-checker', icon: '🤖', label: 'AI Checker' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   doctor: [
//     { sec: 'My Practice', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'appointments', icon: '📅', label: 'Appointments' }, { id: 'patients', icon: '👥', label: 'My Patients' }] },
//     { sec: 'Clinical', items: [{ id: 'records', icon: '📋', label: 'Records' }, { id: 'prescriptions', icon: '📝', label: 'Prescriptions' }, { id: 'emergency', icon: '🚨', label: 'Alerts', badge: 'alerts' }] },
//     { sec: 'Facility', items: [{ id: 'rooms', icon: '🏥', label: 'Rooms & OT' }, { id: 'chat', icon: '💬', label: 'Chat', badge:'new' }] },
//     { sec: 'HR', items: [{ id: 'leaves', icon: '🌴', label: 'My Leaves' }] },
//     { sec: 'Tools', items: [{ id: 'notice-board', icon: '📢', label: 'Notice Board' }, { id: 'symptom-checker', icon: '🤖', label: 'AI Checker' }, { id: 'reminders', icon: '⏰', label: 'Reminders' }, { id: 'analytics', icon: '📈', label: 'Analytics' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   patient: [
//     { sec: 'My Health', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'appointments', icon: '📅', label: 'Book Appointment' }, { id: 'records', icon: '📋', label: 'My Records' }] },
//     { sec: 'Pharmacy', items: [{ id: 'pharmacy', icon: '💊', label: 'Order Medicine' }, { id: 'orders', icon: '🛒', label: 'My Orders' }, { id: 'reminders', icon: '⏰', label: 'Reminders' }] },
//     { sec: 'Support', items: [{ id: 'leaves', icon: '🌴', label: 'Leave Request' }] },
//     { sec: 'Emergency', items: [{ id: 'emergency', icon: '🚨', label: 'SOS Emergency' }, { id: 'notice-board', icon: '📢', label: 'Notice Board' }, { id: 'symptom-checker', icon: '🤖', label: 'AI Checker' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   nurse: [
//     { sec: 'Ward', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'patients', icon: '👥', label: 'Patients' }, { id: 'reminders', icon: '⏰', label: 'Reminders' }] },
//     { sec: 'Facility', items: [{ id: 'rooms', icon: '🏥', label: 'Rooms & OT' }, { id: 'chat', icon: '💬', label: 'Chat' }] },
//     { sec: 'HR', items: [{ id: 'leaves', icon: '🌴', label: 'My Leaves' }] },
//     { sec: 'Clinical', items: [{ id: 'records', icon: '📋', label: 'Records' }, { id: 'emergency', icon: '🚨', label: 'Alerts' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   pharmacist: [
//     { sec: 'Pharmacy', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'pharmacy', icon: '💊', label: 'Inventory' }, { id: 'orders', icon: '🛒', label: 'Orders' }] },
//     { sec: 'Tools', items: [{ id: 'rooms', icon: '🏥', label: 'Rooms' }, { id: 'chat', icon: '💬', label: 'Chat' }, { id: 'reminders', icon: '⏰', label: 'Reminders' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   wardboy: [
//     { sec: 'My Work', items: [{ id: 'staff-dashboard', icon: '🛏️', label: 'My Dashboard' }, { id: 'rooms', icon: '🏥', label: 'Rooms' }] },
//     { sec: 'HR', items: [{ id: 'leaves', icon: '🌴', label: 'My Leaves' }] },
//     { sec: 'Communication', items: [{ id: 'notice-board', icon: '📢', label: 'Notice Board' }, { id: 'chat', icon: '💬', label: 'Chat' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   sweeper: [
//     { sec: 'My Work', items: [{ id: 'staff-dashboard', icon: '🧹', label: 'My Dashboard' }, { id: 'rooms', icon: '🏥', label: 'Rooms' }] },
//     { sec: 'Communication', items: [{ id: 'chat', icon: '💬', label: 'Chat' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   otboy: [
//     { sec: 'My Work', items: [{ id: 'staff-dashboard', icon: '🔪', label: 'My Dashboard' }, { id: 'rooms', icon: '🏥', label: 'OT Rooms' }] },
//     { sec: 'Communication', items: [{ id: 'chat', icon: '💬', label: 'Chat' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
// };

// const ROLE_LABELS = { admin: 'Administrator', doctor: 'Doctor', patient: 'Patient', nurse: 'Nurse', pharmacist: 'Pharmacist', wardboy: 'Ward Boy', sweeper: 'Sweeper', otboy: 'OT Boy' };

// export default function Layout() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [collapsed, setCollapsed] = useState(false);
//   const [notifsOpen, setNotifsOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [alertCount, setAlertCount] = useState(0);

//   const currentPage = location.pathname.replace('/', '');

//   useEffect(() => {
//     const socket = getSocket();
//     if (!socket) return;
//     socket.on('emergency_alert', (data) => {
//       toast.error(`🚨 SOS: ${data.patientName} – ${data.message}`, { duration: 8000 });
//       setAlertCount(c => c + 1);
//       setNotifications(prev => [{ id: Date.now(), title: 'Emergency SOS', msg: `${data.patientName} – ${data.message}`, time: 'just now', icon: '🚨', bg: '#fef2f2', read: false }, ...prev.slice(0, 19)]);
//     });
//     socket.on('new_appointment', (data) => {
//       toast(`📅 New appointment: ${data.patient}`, { icon: '📅' });
//       setNotifications(prev => [{ id: Date.now(), title: 'New Appointment', msg: `${data.patient} booked for ${data.date}`, time: 'just now', icon: '📅', bg: '#e8effe', read: false }, ...prev.slice(0, 19)]);
//     });
//     socket.on('medication_reminder', (data) => {
//       if (user?.role === 'patient' || user?.role === 'nurse') {
//         toast(`💊 ${data.medicine} – ${data.dose}`, { icon: '⏰', duration: 6000 });
//       }
//     });
//     socket.on('low_stock_alert', (data) => {
//       if (['admin', 'pharmacist'].includes(user?.role)) {
//         toast.error(`⚠️ Low stock: ${data.count} item(s)`, { duration: 6000 });
//       }
//     });
//     return () => { socket.off('emergency_alert'); socket.off('new_appointment'); socket.off('medication_reminder'); socket.off('low_stock_alert'); };
//   }, [user]);

//   const triggerSOS = useCallback(async () => {
//     try {
//       await alertsAPI.create({ type: 'SOS', severity: 'critical', message: 'Emergency SOS triggered via HMS dashboard' });
//       toast.error('🚨 SOS ACTIVATED – Emergency team alerted!', { duration: 8000 });
//     } catch {
//       toast.error('SOS sent!');
//     }
//   }, []);

//   const navConfig = NAV_CONFIG[user?.role] || NAV_CONFIG.patient;
//   const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
//   const unreadCount = notifications.filter(n => !n.read).length;

//   return (
//     <div className="hms-layout">
//       {/* ── SIDEBAR ── */}
//       <motion.aside
//         animate={{ width: collapsed ? 56 : 220 }}
//         transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
//         style={{ background: '#0c1f4a', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', flexShrink: 0, zIndex: 10 }}
//       >
//         {/* Logo */}
//         <div style={{ padding: '18px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,.06)', minHeight: 62 }}>
//           <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#2563eb,#0891b2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>🏥</div>
//           {!collapsed && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, overflow: 'hidden' }}>
//               <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>MediCare</div>
//               <div style={{ color: '#94a3c8', fontSize: 10.5, whiteSpace: 'nowrap' }}>HMS v3.0</div>
//             </motion.div>
//           )}
//           <button onClick={() => setCollapsed(c => !c)} style={{ background: 'none', border: 'none', color: '#94a3c8', cursor: 'pointer', padding: 5, borderRadius: 6, fontSize: 16, flexShrink: 0, transition: 'color .18s' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#94a3c8'}>
//             ☰
//           </button>
//         </div>

//         {/* Nav */}
//         <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 0' }}>
//           {navConfig.map((section) => (
//             <div key={section.sec}>
//               {!collapsed && <div style={{ color: '#94a3c8', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', padding: '10px 18px 4px', whiteSpace: 'nowrap' }}>{section.sec}</div>}
//               {section.items.map((item) => {
//                 const isActive = currentPage === item.id || (item.id === 'dashboard' && currentPage === '');
//                 return (
//                   <button key={item.id} onClick={() => navigate(`/${item.id}`)}
//                     style={{ display: 'flex', alignItems: 'center', gap: 9, padding: collapsed ? '9px' : '9px 14px', cursor: 'pointer', borderRadius: 7, transition: 'all .18s', color: isActive ? '#60a5fa' : '#94a3c8', background: isActive ? 'rgba(59,130,246,.18)' : 'transparent', border: 'none', width: 'calc(100% - 12px)', margin: '1px 6px', fontSize: 13, fontWeight: 600, position: 'relative', justifyContent: collapsed ? 'center' : 'flex-start' }}
//                     onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.color = '#e2e8f0'; } }}
//                     onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3c8'; } }}
//                   >
//                     {isActive && <span style={{ position: 'absolute', left: -6, top: '50%', transform: 'translateY(-50%)', width: 3, height: 16, background: '#3b82f6', borderRadius: '0 3px 3px 0' }} />}
//                     <span style={{ fontSize: 15, width: 18, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
//                     {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
//                     {!collapsed && item.badge === 'alerts' && alertCount > 0 && <span style={{ background: '#dc2626', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 10, marginLeft: 'auto' }}>{alertCount}</span>}
//                   </button>
//                 );
//               })}
//             </div>
//           ))}
//         </nav>

//         {/* User footer */}
//         <div style={{ padding: 10, borderTop: '1px solid rgba(255,255,255,.06)' }}>
//           <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: 9, borderRadius: 8, cursor: 'pointer', transition: 'background .18s', border: 'none', background: 'transparent', width: '100%', justifyContent: collapsed ? 'center' : 'flex-start' }}
//             onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.07)'}
//             onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
//           >
//             <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{initials}</div>
//             {!collapsed && (
//               <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
//                 <div style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
//                 <div style={{ color: '#94a3c8', fontSize: 10, whiteSpace: 'nowrap' }}>{ROLE_LABELS[user?.role]}</div>
//               </div>
//             )}
//             {!collapsed && <span style={{ color: '#94a3c8', fontSize: 12 }}>🚪</span>}
//           </button>
//         </div>
//       </motion.aside>

//       {/* ── MAIN ── */}
//       <div className="content-area">
//         {/* Topbar */}
//         <header style={{ height: 60, background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, flexShrink: 0, zIndex: 9, boxShadow: '0 1px 4px rgba(15,23,42,.04)' }}>
//           <div style={{ flex: 1, maxWidth: 320, position: 'relative' }}>
//             <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 14 }}>🔍</span>
//             <input className="form-input" style={{ paddingLeft: 34, borderRadius: 22, background: '#f8fafc', fontSize: 13 }} placeholder="Search patients, doctors, medicines…" />
//           </div>
//           <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
//             {/* SOS */}
//             <button onClick={triggerSOS} className="sos-button sos-button-sm" title="Emergency SOS (Ctrl+E)">🚨<span>SOS</span></button>

//             {/* Notifications */}
//             <div style={{ position: 'relative' }}>
//               <button onClick={() => setNotifsOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 7, borderRadius: 8, fontSize: 17, color: '#475569', transition: 'all .18s', position: 'relative' }}
//                 onMouseEnter={e => { e.currentTarget.style.background = '#f1f5fb'; }}
//                 onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
//               >
//                 🔔
//                 {unreadCount > 0 && <span style={{ position: 'absolute', top: 5, right: 5, width: 7, height: 7, background: '#dc2626', borderRadius: '50%', border: '1.5px solid #fff', animation: 'pulse 2s infinite' }} />}
//               </button>
//               <AnimatePresence>
//                 {notifsOpen && (
//                   <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
//                     style={{ position: 'absolute', top: 44, right: 0, width: 320, background: '#fff', borderRadius: 14, boxShadow: '0 16px 48px rgba(15,23,42,.16)', border: '1px solid #e2e8f0', zIndex: 50 }}
//                   >
//                     <div style={{ padding: '12px 14px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <span style={{ fontWeight: 700, fontSize: 14 }}>Notifications</span>
//                       <button className="btn btn-ghost btn-xs" onClick={() => { setNotifications(n => n.map(x => ({ ...x, read: true }))); }}>Mark all read</button>
//                     </div>
//                     <div style={{ maxHeight: 340, overflowY: 'auto' }}>
//                       {notifications.length === 0 ? (
//                         <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No notifications yet</div>
//                       ) : notifications.map(n => (
//                         <div key={n.id} style={{ padding: '11px 14px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: 10, cursor: 'pointer', background: n.read ? 'transparent' : '#f8faff', transition: 'background .12s' }}
//                           onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; }}
//                           onMouseLeave={e => { e.currentTarget.style.background = n.read ? 'transparent' : '#f8faff'; }}
//                         >
//                           <div style={{ width: 34, height: 34, borderRadius: '50%', background: n.bg || '#e8effe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{n.icon}</div>
//                           <div style={{ flex: 1, minWidth: 0 }}>
//                             <div style={{ fontSize: 12.5, fontWeight: 700 }}>{n.title}</div>
//                             <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.msg}</div>
//                           </div>
//                           <div style={{ fontSize: 10.5, color: '#94a3b8', whiteSpace: 'nowrap' }}>{n.time}</div>
//                         </div>
//                       ))}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             <div style={{ width: 1, height: 22, background: '#e2e8f0', margin: '0 4px' }} />

//             <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/settings')}>
//               <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#1648c9,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>{initials}</div>
//               <div>
//                 <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
//                 <div style={{ fontSize: 10.5, color: '#94a3b8' }}>{ROLE_LABELS[user?.role]}</div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Page content */}
//         <main className="page-content">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={location.pathname}
//               initial={{ opacity: 0, y: 14 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//               transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
//             >
//               <Outlet />
//       <SupportBot />
//             </motion.div>
//           </AnimatePresence>
//         </main>
//       </div>

//       {/* Click-outside close for notifs */}
//       {notifsOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setNotifsOpen(false)} />}
//     </div>
//   );
// }


// import React, { useState, useEffect, useCallback } from 'react';
// import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAuth } from '../../context/AuthContext';
// import { getSocket } from '../../utils/socket';
// import { alertsAPI } from '../../utils/api';
// import toast from 'react-hot-toast';
// import SupportBot from '../SupportBot';

// // ── NAV CONFIG PER ROLE ──────────────────────────────────────────────
// const NAV_CONFIG = {
//   admin: [
//     { sec: 'Overview', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'analytics', icon: '📈', label: 'Analytics' }] },
//     { sec: 'Management', items: [{ id: 'patients', icon: '👥', label: 'Patients' }, { id: 'doctors', icon: '🩺', label: 'Doctors' }, { id: 'user-approval', icon: '👤', label: 'Approvals', badge: 'pending' }, { id: 'appointments', icon: '📅', label: 'Appointments' }] },
//     { sec: 'Hospital', items: [{ id: 'pharmacy', icon: '💊', label: 'Pharmacy' }, { id: 'orders', icon: '🛒', label: 'Orders' }, { id: 'records', icon: '📋', label: 'Records' }, { id: 'emergency', icon: '🚨', label: 'Emergency', badge: 'alerts' }] },
//     { sec: 'Facility', items: [{ id: 'rooms', icon: '🏥', label: 'Rooms & OT' }, { id: 'my-timetable', icon: '📅', label: 'Timetable' }, { id: 'chat', icon: '💬', label: 'Chat' }] },
//     { sec: 'HR & Staff', items: [{ id: 'leaves', icon: '🌴', label: 'Leave Management' }, { id: 'notice-board', icon: '📢', label: 'Notice Board' }] },
//     { sec: 'Tools', items: [{ id: 'reminders', icon: '⏰', label: 'Reminders' }, { id: 'symptom-checker', icon: '🤖', label: 'AI Checker' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   doctor: [
//     { sec: 'My Practice', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'appointments', icon: '📅', label: 'Appointments' }, { id: 'patients', icon: '👥', label: 'My Patients' }] },
//     { sec: 'Clinical', items: [{ id: 'records', icon: '📋', label: 'Records' }, { id: 'prescriptions', icon: '📝', label: 'Prescriptions' }, { id: 'emergency', icon: '🚨', label: 'Alerts', badge: 'alerts' }] },
//     { sec: 'My Schedule', items: [{ id: 'my-timetable', icon: '📅', label: 'My Timetable' }, { id: 'rooms', icon: '🏥', label: 'Rooms & OT' }, { id: 'chat', icon: '💬', label: 'Chat' }] },
//     { sec: 'HR', items: [{ id: 'leaves', icon: '🌴', label: 'My Leaves' }, { id: 'notice-board', icon: '📢', label: 'Notice Board' }] },
//     { sec: 'Tools', items: [{ id: 'symptom-checker', icon: '🤖', label: 'AI Checker' }, { id: 'reminders', icon: '⏰', label: 'Reminders' }, { id: 'analytics', icon: '📈', label: 'Analytics' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   patient: [
//     { sec: 'My Health', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'appointments', icon: '📅', label: 'Appointments' }, { id: 'records', icon: '📋', label: 'My Records' }] },
//     { sec: 'Pharmacy', items: [{ id: 'pharmacy', icon: '💊', label: 'Order Medicine' }, { id: 'orders', icon: '🛒', label: 'My Orders' }, { id: 'reminders', icon: '⏰', label: 'Reminders' }] },
//     { sec: 'Emergency', items: [{ id: 'emergency', icon: '🚨', label: 'SOS Emergency' }, { id: 'symptom-checker', icon: '🤖', label: 'AI Checker' }] },
//     { sec: 'More', items: [{ id: 'leaves', icon: '🌴', label: 'Leave Request' }, { id: 'notice-board', icon: '📢', label: 'Notice Board' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   nurse: [
//     { sec: 'Ward', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'patients', icon: '👥', label: 'Patients' }, { id: 'reminders', icon: '⏰', label: 'Reminders' }] },
//     { sec: 'My Schedule', items: [{ id: 'my-timetable', icon: '📅', label: 'My Timetable' }, { id: 'rooms', icon: '🏥', label: 'Rooms & OT' }, { id: 'chat', icon: '💬', label: 'Chat' }] },
//     { sec: 'HR', items: [{ id: 'leaves', icon: '🌴', label: 'My Leaves' }, { id: 'notice-board', icon: '📢', label: 'Notice Board' }] },
//     { sec: 'Clinical', items: [{ id: 'records', icon: '📋', label: 'Records' }, { id: 'emergency', icon: '🚨', label: 'Alerts' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   pharmacist: [
//     { sec: 'Pharmacy', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'pharmacy', icon: '💊', label: 'Inventory' }, { id: 'orders', icon: '🛒', label: 'Orders' }] },
//     { sec: 'My Schedule', items: [{ id: 'my-timetable', icon: '📅', label: 'My Timetable' }, { id: 'chat', icon: '💬', label: 'Chat' }] },
//     { sec: 'HR', items: [{ id: 'leaves', icon: '🌴', label: 'My Leaves' }, { id: 'notice-board', icon: '📢', label: 'Notice Board' }] },
//     { sec: 'Tools', items: [{ id: 'reminders', icon: '⏰', label: 'Reminders' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   wardboy: [
//     { sec: 'My Work', items: [{ id: 'staff-dashboard', icon: '🛏️', label: 'My Dashboard' }, { id: 'rooms', icon: '🏥', label: 'Rooms' }] },
//     { sec: 'My Schedule', items: [{ id: 'my-timetable', icon: '📅', label: 'My Timetable' }] },
//     { sec: 'HR', items: [{ id: 'leaves', icon: '🌴', label: 'My Leaves' }, { id: 'notice-board', icon: '📢', label: 'Notice Board' }] },
//     { sec: 'Communication', items: [{ id: 'chat', icon: '💬', label: 'Chat' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   sweeper: [
//     { sec: 'My Work', items: [{ id: 'staff-dashboard', icon: '🧹', label: 'My Dashboard' }, { id: 'rooms', icon: '🏥', label: 'Rooms' }] },
//     { sec: 'My Schedule', items: [{ id: 'my-timetable', icon: '📅', label: 'My Timetable' }] },
//     { sec: 'HR', items: [{ id: 'leaves', icon: '🌴', label: 'My Leaves' }, { id: 'notice-board', icon: '📢', label: 'Notice Board' }] },
//     { sec: 'Communication', items: [{ id: 'chat', icon: '💬', label: 'Chat' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
//   otboy: [
//     { sec: 'My Work', items: [{ id: 'staff-dashboard', icon: '🔪', label: 'My Dashboard' }, { id: 'rooms', icon: '🏥', label: 'OT Rooms' }] },
//     { sec: 'My Schedule', items: [{ id: 'my-timetable', icon: '📅', label: 'My Timetable' }] },
//     { sec: 'HR', items: [{ id: 'leaves', icon: '🌴', label: 'My Leaves' }, { id: 'notice-board', icon: '📢', label: 'Notice Board' }] },
//     { sec: 'Communication', items: [{ id: 'chat', icon: '💬', label: 'Chat' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
//   ],
// };

// const ROLE_LABELS = { admin: 'Administrator', doctor: 'Doctor', patient: 'Patient', nurse: 'Nurse', pharmacist: 'Pharmacist', wardboy: 'Ward Boy', sweeper: 'Sweeper', otboy: 'OT Boy' };

// export default function Layout() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [collapsed, setCollapsed] = useState(false);
//   const [notifsOpen, setNotifsOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [alertCount, setAlertCount] = useState(0);

//   const currentPage = location.pathname.replace('/', '');

//   useEffect(() => {
//     const socket = getSocket();
//     if (!socket) return;
//     socket.on('emergency_alert', (data) => {
//       toast.error(`🚨 SOS: ${data.patientName} – ${data.message}`, { duration: 8000 });
//       setAlertCount(c => c + 1);
//       setNotifications(prev => [{ id: Date.now(), title: 'Emergency SOS', msg: `${data.patientName} – ${data.message}`, time: 'just now', icon: '🚨', bg: '#fef2f2', read: false }, ...prev.slice(0, 19)]);
//     });
//     socket.on('new_appointment', (data) => {
//       toast(`📅 New appointment: ${data.patient}`, { icon: '📅' });
//       setNotifications(prev => [{ id: Date.now(), title: 'New Appointment', msg: `${data.patient} booked for ${data.date}`, time: 'just now', icon: '📅', bg: '#e8effe', read: false }, ...prev.slice(0, 19)]);
//     });
//     socket.on('medication_reminder', (data) => {
//       if (user?.role === 'patient' || user?.role === 'nurse') {
//         toast(`💊 ${data.medicine} – ${data.dose}`, { icon: '⏰', duration: 6000 });
//       }
//     });
//     socket.on('leave_reviewed', (data) => {
//       if (data.status === 'approved') {
//         const isToday = new Date(data.from) <= new Date() && new Date(data.to) >= new Date();
//         const msg = isToday
//           ? `🏖️ ${data.userName} is on ${data.type} leave today`
//           : `✅ Your ${data.type} leave was ${data.status}`;
//         toast(`${data.status==='approved'?'✅':'❌'} Leave ${data.status}: ${data.userName}`, { duration:5000 });
//         setNotifications(prev => [{ id:Date.now(), title:`Leave ${data.status}`, msg:`${data.userName} — ${data.type} leave ${data.from?new Date(data.from).toLocaleDateString('en-IN',{day:'numeric',month:'short'}):''}`, time:'just now', icon:'🌴', bg:'#f0fdf4', read:false }, ...prev.slice(0,19)]);
//       }
//     });
//     socket.on('task_assigned', (data) => {
//       toast(`📋 New task: ${data.title}`, { duration: 5000 });
//       setNotifications(prev => [{ id:Date.now(), title:'New Task Assigned', msg:data.title, time:'just now', icon:'✅', bg:'#eff6ff', read:false }, ...prev.slice(0,19)]);
//     });
//     socket.on('schedule_assigned', (data) => {
//       toast(`📅 New shift scheduled: ${new Date(data.date).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})}`, { duration:5000 });
//       setNotifications(prev => [{ id:Date.now(), title:'Shift Scheduled', msg:`New shift on ${new Date(data.date).toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'short'})}`, time:'just now', icon:'📅', bg:'#eff6ff', read:false }, ...prev.slice(0,19)]);
//     });
//     socket.on('low_stock_alert', (data) => {
//       if (['admin', 'pharmacist'].includes(user?.role)) {
//         toast.error(`⚠️ Low stock: ${data.count} item(s)`, { duration: 6000 });
//       }
//     });
//     return () => { socket.off('emergency_alert'); socket.off('new_appointment'); socket.off('medication_reminder'); socket.off('low_stock_alert'); socket.off('leave_reviewed'); socket.off('task_assigned'); socket.off('schedule_assigned'); };
//   }, [user]);

//   const triggerSOS = useCallback(async () => {
//     try {
//       await alertsAPI.create({ type: 'SOS', severity: 'critical', message: 'Emergency SOS triggered via HMS dashboard' });
//       toast.error('🚨 SOS ACTIVATED – Emergency team alerted!', { duration: 8000 });
//     } catch {
//       toast.error('SOS sent!');
//     }
//   }, []);

//   const navConfig = NAV_CONFIG[user?.role] || NAV_CONFIG.patient;
//   const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
//   const unreadCount = notifications.filter(n => !n.read).length;

//   return (
//     <div className="hms-layout">
//       {/* ── SIDEBAR ── */}
//       <motion.aside
//         animate={{ width: collapsed ? 56 : 220 }}
//         transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
//         style={{ background: '#0c1f4a', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', flexShrink: 0, zIndex: 10 }}
//       >
//         {/* Logo */}
//         <div style={{ padding: '18px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,.06)', minHeight: 62 }}>
//           <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#2563eb,#0891b2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>🏥</div>
//           {!collapsed && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, overflow: 'hidden' }}>
//               <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>MediCare</div>
//               <div style={{ color: '#94a3c8', fontSize: 10.5, whiteSpace: 'nowrap' }}>HMS v3.0</div>
//             </motion.div>
//           )}
//           <button onClick={() => setCollapsed(c => !c)} style={{ background: 'none', border: 'none', color: '#94a3c8', cursor: 'pointer', padding: 5, borderRadius: 6, fontSize: 16, flexShrink: 0, transition: 'color .18s' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#94a3c8'}>
//             ☰
//           </button>
//         </div>

//         {/* Nav */}
//         <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 0' }}>
//           {navConfig.map((section) => (
//             <div key={section.sec}>
//               {!collapsed && <div style={{ color: '#94a3c8', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', padding: '10px 18px 4px', whiteSpace: 'nowrap' }}>{section.sec}</div>}
//               {section.items.map((item) => {
//                 const isActive = currentPage === item.id || (item.id === 'dashboard' && currentPage === '');
//                 return (
//                   <button key={item.id} onClick={() => navigate(`/${item.id}`)}
//                     style={{ display: 'flex', alignItems: 'center', gap: 9, padding: collapsed ? '9px' : '9px 14px', cursor: 'pointer', borderRadius: 7, transition: 'all .18s', color: isActive ? '#60a5fa' : '#94a3c8', background: isActive ? 'rgba(59,130,246,.18)' : 'transparent', border: 'none', width: 'calc(100% - 12px)', margin: '1px 6px', fontSize: 13, fontWeight: 600, position: 'relative', justifyContent: collapsed ? 'center' : 'flex-start' }}
//                     onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.color = '#e2e8f0'; } }}
//                     onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3c8'; } }}
//                   >
//                     {isActive && <span style={{ position: 'absolute', left: -6, top: '50%', transform: 'translateY(-50%)', width: 3, height: 16, background: '#3b82f6', borderRadius: '0 3px 3px 0' }} />}
//                     <span style={{ fontSize: 15, width: 18, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
//                     {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
//                     {!collapsed && item.badge === 'alerts' && alertCount > 0 && <span style={{ background: '#dc2626', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 10, marginLeft: 'auto' }}>{alertCount}</span>}
//                   </button>
//                 );
//               })}
//             </div>
//           ))}
//         </nav>

//         {/* User footer */}
//         <div style={{ padding: 10, borderTop: '1px solid rgba(255,255,255,.06)' }}>
//           <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: 9, borderRadius: 8, cursor: 'pointer', transition: 'background .18s', border: 'none', background: 'transparent', width: '100%', justifyContent: collapsed ? 'center' : 'flex-start' }}
//             onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.07)'}
//             onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
//           >
//             <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{initials}</div>
//             {!collapsed && (
//               <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
//                 <div style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
//                 <div style={{ color: '#94a3c8', fontSize: 10, whiteSpace: 'nowrap' }}>{ROLE_LABELS[user?.role]}</div>
//               </div>
//             )}
//             {!collapsed && <span style={{ color: '#94a3c8', fontSize: 12 }}>🚪</span>}
//           </button>
//         </div>
//       </motion.aside>

//       {/* ── MAIN ── */}
//       <div className="content-area">
//         {/* Topbar */}
//         <header style={{ height: 60, background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, flexShrink: 0, zIndex: 9, boxShadow: '0 1px 4px rgba(15,23,42,.04)' }}>
//           <div style={{ flex: 1, maxWidth: 320, position: 'relative' }}>
//             <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 14 }}>🔍</span>
//             <input className="form-input" style={{ paddingLeft: 34, borderRadius: 22, background: '#f8fafc', fontSize: 13 }} placeholder="Search patients, doctors, medicines…" />
//           </div>
//           <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
//             {/* SOS */}
//             <button onClick={triggerSOS} className="sos-button sos-button-sm" title="Emergency SOS (Ctrl+E)">🚨<span>SOS</span></button>

//             {/* Notifications */}
//             <div style={{ position: 'relative' }}>
//               <button onClick={() => setNotifsOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 7, borderRadius: 8, fontSize: 17, color: '#475569', transition: 'all .18s', position: 'relative' }}
//                 onMouseEnter={e => { e.currentTarget.style.background = '#f1f5fb'; }}
//                 onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
//               >
//                 🔔
//                 {unreadCount > 0 && <span style={{ position: 'absolute', top: 5, right: 5, width: 7, height: 7, background: '#dc2626', borderRadius: '50%', border: '1.5px solid #fff', animation: 'pulse 2s infinite' }} />}
//               </button>
//               <AnimatePresence>
//                 {notifsOpen && (
//                   <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
//                     style={{ position: 'absolute', top: 44, right: 0, width: 320, background: '#fff', borderRadius: 14, boxShadow: '0 16px 48px rgba(15,23,42,.16)', border: '1px solid #e2e8f0', zIndex: 50 }}
//                   >
//                     <div style={{ padding: '12px 14px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <span style={{ fontWeight: 700, fontSize: 14 }}>Notifications</span>
//                       <button className="btn btn-ghost btn-xs" onClick={() => { setNotifications(n => n.map(x => ({ ...x, read: true }))); }}>Mark all read</button>
//                     </div>
//                     <div style={{ maxHeight: 340, overflowY: 'auto' }}>
//                       {notifications.length === 0 ? (
//                         <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No notifications yet</div>
//                       ) : notifications.map(n => (
//                         <div key={n.id} style={{ padding: '11px 14px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: 10, cursor: 'pointer', background: n.read ? 'transparent' : '#f8faff', transition: 'background .12s' }}
//                           onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; }}
//                           onMouseLeave={e => { e.currentTarget.style.background = n.read ? 'transparent' : '#f8faff'; }}
//                         >
//                           <div style={{ width: 34, height: 34, borderRadius: '50%', background: n.bg || '#e8effe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{n.icon}</div>
//                           <div style={{ flex: 1, minWidth: 0 }}>
//                             <div style={{ fontSize: 12.5, fontWeight: 700 }}>{n.title}</div>
//                             <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.msg}</div>
//                           </div>
//                           <div style={{ fontSize: 10.5, color: '#94a3b8', whiteSpace: 'nowrap' }}>{n.time}</div>
//                         </div>
//                       ))}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             <div style={{ width: 1, height: 22, background: '#e2e8f0', margin: '0 4px' }} />

//             <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/settings')}>
//               <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#1648c9,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>{initials}</div>
//               <div>
//                 <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
//                 <div style={{ fontSize: 10.5, color: '#94a3b8' }}>{ROLE_LABELS[user?.role]}</div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Page content */}
//         <main className="page-content">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={location.pathname}
//               initial={{ opacity: 0, y: 14 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//               transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
//             >
//               <Outlet />
//       <SupportBot />
//             </motion.div>
//           </AnimatePresence>
//         </main>
//       </div>

//       {/* Click-outside close for notifs */}
//       {notifsOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setNotifsOpen(false)} />}
//     </div>
//   );
// }

import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getSocket } from '../../utils/socket';
import { alertsAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import SupportBot from '../SupportBot';

// ── NAV CONFIG PER ROLE ──────────────────────────────────────────────
const NAV_CONFIG = {
  admin: [
    { sec: 'Overview', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'analytics', icon: '📈', label: 'Analytics' }] },
    { sec: 'Management', items: [{ id: 'patients', icon: '👥', label: 'Patients' }, { id: 'doctors', icon: '🩺', label: 'Doctors' }, { id: 'user-approval', icon: '👤', label: 'Approvals', badge: 'pending' }, { id: 'appointments', icon: '📅', label: 'Appointments' }] },
    { sec: 'Hospital', items: [{ id: 'pharmacy', icon: '💊', label: 'Pharmacy' }, { id: 'orders', icon: '🛒', label: 'Orders' }, { id: 'records', icon: '📋', label: 'Records' }, { id: 'emergency', icon: '🚨', label: 'Emergency', badge: 'alerts' }] },
    { sec: 'Facility', items: [{ id: 'rooms', icon: '🏥', label: 'Rooms & OT' }, { id: 'my-timetable', icon: '📅', label: 'Timetable' }, { id: 'chat', icon: '💬', label: 'Chat' }] },
    { sec: 'HR & Staff', items: [{ id: 'leaves', icon: '🌴', label: 'Leave Management' }, { id: 'salary', icon: '💰', label: 'Salary Management' }, { id: 'notice-board', icon: '📢', label: 'Notice Board' }] },
    { sec: 'Tools', items: [{ id: 'reminders', icon: '⏰', label: 'Reminders' }, { id: 'symptom-checker', icon: '🤖', label: 'AI Checker' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
  ],
  doctor: [
    { sec: 'My Practice', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'appointments', icon: '📅', label: 'Appointments' }, { id: 'patients', icon: '👥', label: 'My Patients' }] },
    { sec: 'Clinical', items: [{ id: 'records', icon: '📋', label: 'Records' }, { id: 'prescriptions', icon: '📝', label: 'Prescriptions' }, { id: 'emergency', icon: '🚨', label: 'Alerts', badge: 'alerts' }] },
    { sec: 'My Schedule', items: [{ id: 'my-timetable', icon: '📅', label: 'My Timetable' }, { id: 'rooms', icon: '🏥', label: 'Rooms & OT' }, { id: 'chat', icon: '💬', label: 'Chat' }] },
    { sec: 'HR', items: [{ id: 'leaves', icon: '🌴', label: 'My Leaves' }, { id: 'salary', icon: '💰', label: 'My Salary' }, { id: 'notice-board', icon: '📢', label: 'Notice Board' }] },
    { sec: 'Tools', items: [{ id: 'symptom-checker', icon: '🤖', label: 'AI Checker' }, { id: 'reminders', icon: '⏰', label: 'Reminders' }, { id: 'analytics', icon: '📈', label: 'Analytics' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
  ],
  patient: [
    { sec: 'My Health', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'appointments', icon: '📅', label: 'Appointments' }, { id: 'records', icon: '📋', label: 'My Records' }] },
    { sec: 'Pharmacy', items: [{ id: 'pharmacy', icon: '💊', label: 'Order Medicine' }, { id: 'orders', icon: '🛒', label: 'My Orders' }, { id: 'reminders', icon: '⏰', label: 'Reminders' }] },
    { sec: 'Emergency', items: [{ id: 'emergency', icon: '🚨', label: 'SOS Emergency' }, { id: 'symptom-checker', icon: '🤖', label: 'AI Checker' }] },
    { sec: 'More', items: [{ id: 'leaves', icon: '🌴', label: 'Leave Request' }, { id: 'notice-board', icon: '📢', label: 'Notice Board' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
  ],
  nurse: [
    { sec: 'Ward', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'patients', icon: '👥', label: 'Patients' }, { id: 'reminders', icon: '⏰', label: 'Reminders' }] },
    { sec: 'My Schedule', items: [{ id: 'my-timetable', icon: '📅', label: 'My Timetable' }, { id: 'rooms', icon: '🏥', label: 'Rooms & OT' }, { id: 'chat', icon: '💬', label: 'Chat' }] },
    { sec: 'HR', items: [{ id: 'leaves', icon: '🌴', label: 'My Leaves' }, { id: 'salary', icon: '💰', label: 'My Salary' }, { id: 'notice-board', icon: '📢', label: 'Notice Board' }] },
    { sec: 'Clinical', items: [{ id: 'records', icon: '📋', label: 'Records' }, { id: 'emergency', icon: '🚨', label: 'Alerts' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
  ],
  pharmacist: [
    { sec: 'Pharmacy', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'pharmacy', icon: '💊', label: 'Inventory' }, { id: 'orders', icon: '🛒', label: 'Orders' }] },
    { sec: 'My Schedule', items: [{ id: 'my-timetable', icon: '📅', label: 'My Timetable' }, { id: 'chat', icon: '💬', label: 'Chat' }] },
    { sec: 'HR', items: [{ id: 'leaves', icon: '🌴', label: 'My Leaves' }, { id: 'salary', icon: '💰', label: 'My Salary' }, { id: 'notice-board', icon: '📢', label: 'Notice Board' }] },
    { sec: 'Tools', items: [{ id: 'reminders', icon: '⏰', label: 'Reminders' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
  ],
  wardboy: [
    { sec: 'My Work', items: [{ id: 'staff-dashboard', icon: '🛏️', label: 'My Dashboard' }, { id: 'rooms', icon: '🏥', label: 'Rooms' }] },
    { sec: 'My Schedule', items: [{ id: 'my-timetable', icon: '📅', label: 'My Timetable' }] },
    { sec: 'HR', items: [{ id: 'leaves', icon: '🌴', label: 'My Leaves' }, { id: 'salary', icon: '💰', label: 'My Salary' }, { id: 'notice-board', icon: '📢', label: 'Notice Board' }] },
    { sec: 'Communication', items: [{ id: 'chat', icon: '💬', label: 'Chat' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
  ],
  sweeper: [
    { sec: 'My Work', items: [{ id: 'staff-dashboard', icon: '🧹', label: 'My Dashboard' }, { id: 'rooms', icon: '🏥', label: 'Rooms' }] },
    { sec: 'My Schedule', items: [{ id: 'my-timetable', icon: '📅', label: 'My Timetable' }] },
    { sec: 'HR', items: [{ id: 'leaves', icon: '🌴', label: 'My Leaves' }, { id: 'salary', icon: '💰', label: 'My Salary' }, { id: 'notice-board', icon: '📢', label: 'Notice Board' }] },
    { sec: 'Communication', items: [{ id: 'chat', icon: '💬', label: 'Chat' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
  ],
  otboy: [
    { sec: 'My Work', items: [{ id: 'staff-dashboard', icon: '🔪', label: 'My Dashboard' }, { id: 'rooms', icon: '🏥', label: 'OT Rooms' }] },
    { sec: 'My Schedule', items: [{ id: 'my-timetable', icon: '📅', label: 'My Timetable' }] },
    { sec: 'HR', items: [{ id: 'leaves', icon: '🌴', label: 'My Leaves' }, { id: 'salary', icon: '💰', label: 'My Salary' }, { id: 'notice-board', icon: '📢', label: 'Notice Board' }] },
    { sec: 'Communication', items: [{ id: 'chat', icon: '💬', label: 'Chat' }, { id: 'settings', icon: '⚙️', label: 'Settings' }] },
  ],
};

const ROLE_LABELS = { admin: 'Administrator', doctor: 'Doctor', patient: 'Patient', nurse: 'Nurse', pharmacist: 'Pharmacist', wardboy: 'Ward Boy', sweeper: 'Sweeper', otboy: 'OT Boy' };

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [alertCount, setAlertCount] = useState(0);

  const currentPage = location.pathname.replace('/', '');

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    socket.on('emergency_alert', (data) => {
      toast.error(`🚨 SOS: ${data.patientName} – ${data.message}`, { duration: 8000 });
      setAlertCount(c => c + 1);
      setNotifications(prev => [{ id: Date.now(), title: 'Emergency SOS', msg: `${data.patientName} – ${data.message}`, time: 'just now', icon: '🚨', bg: '#fef2f2', read: false }, ...prev.slice(0, 19)]);
    });
    socket.on('new_appointment', (data) => {
      toast(`📅 New appointment: ${data.patient}`, { icon: '📅' });
      setNotifications(prev => [{ id: Date.now(), title: 'New Appointment', msg: `${data.patient} booked for ${data.date}`, time: 'just now', icon: '📅', bg: '#e8effe', read: false }, ...prev.slice(0, 19)]);
    });
    socket.on('medication_reminder', (data) => {
      if (user?.role === 'patient' || user?.role === 'nurse') {
        toast(`💊 ${data.medicine} – ${data.dose}`, { icon: '⏰', duration: 6000 });
      }
    });
    socket.on('leave_reviewed', (data) => {
      if (data.status === 'approved') {
        const isToday = new Date(data.from) <= new Date() && new Date(data.to) >= new Date();
        const msg = isToday
          ? `🏖️ ${data.userName} is on ${data.type} leave today`
          : `✅ Your ${data.type} leave was ${data.status}`;
        toast(`${data.status==='approved'?'✅':'❌'} Leave ${data.status}: ${data.userName}`, { duration:5000 });
        setNotifications(prev => [{ id:Date.now(), title:`Leave ${data.status}`, msg:`${data.userName} — ${data.type} leave ${data.from?new Date(data.from).toLocaleDateString('en-IN',{day:'numeric',month:'short'}):''}`, time:'just now', icon:'🌴', bg:'#f0fdf4', read:false }, ...prev.slice(0,19)]);
      }
    });
    socket.on('task_assigned', (data) => {
      toast(`📋 New task: ${data.title}`, { duration: 5000 });
      setNotifications(prev => [{ id:Date.now(), title:'New Task Assigned', msg:data.title, time:'just now', icon:'✅', bg:'#eff6ff', read:false }, ...prev.slice(0,19)]);
    });
    socket.on('schedule_assigned', (data) => {
      toast(`📅 New shift scheduled: ${new Date(data.date).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})}`, { duration:5000 });
      setNotifications(prev => [{ id:Date.now(), title:'Shift Scheduled', msg:`New shift on ${new Date(data.date).toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'short'})}`, time:'just now', icon:'📅', bg:'#eff6ff', read:false }, ...prev.slice(0,19)]);
    });
    socket.on('low_stock_alert', (data) => {
      if (['admin', 'pharmacist'].includes(user?.role)) {
        toast.error(`⚠️ Low stock: ${data.count} item(s)`, { duration: 6000 });
      }
    });
    return () => { socket.off('emergency_alert'); socket.off('new_appointment'); socket.off('medication_reminder'); socket.off('low_stock_alert'); socket.off('leave_reviewed'); socket.off('task_assigned'); socket.off('schedule_assigned'); };
  }, [user]);

  const triggerSOS = useCallback(async () => {
    try {
      await alertsAPI.create({ type: 'SOS', severity: 'critical', message: 'Emergency SOS triggered via HMS dashboard' });
      toast.error('🚨 SOS ACTIVATED – Emergency team alerted!', { duration: 8000 });
    } catch {
      toast.error('SOS sent!');
    }
  }, []);

  const navConfig = NAV_CONFIG[user?.role] || NAV_CONFIG.patient;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="hms-layout">
      {/* ── SIDEBAR ── */}
      <motion.aside
        animate={{ width: collapsed ? 56 : 220 }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        style={{ background: '#0c1f4a', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', flexShrink: 0, zIndex: 10 }}
      >
        {/* Logo */}
        <div style={{ padding: '18px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,.06)', minHeight: 62 }}>
          <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#2563eb,#0891b2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>🏥</div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>MediCare</div>
              <div style={{ color: '#94a3c8', fontSize: 10.5, whiteSpace: 'nowrap' }}>HMS v3.0</div>
            </motion.div>
          )}
          <button onClick={() => setCollapsed(c => !c)} style={{ background: 'none', border: 'none', color: '#94a3c8', cursor: 'pointer', padding: 5, borderRadius: 6, fontSize: 16, flexShrink: 0, transition: 'color .18s' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#94a3c8'}>
            ☰
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 0' }}>
          {navConfig.map((section) => (
            <div key={section.sec}>
              {!collapsed && <div style={{ color: '#94a3c8', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', padding: '10px 18px 4px', whiteSpace: 'nowrap' }}>{section.sec}</div>}
              {section.items.map((item) => {
                const isActive = currentPage === item.id || (item.id === 'dashboard' && currentPage === '');
                return (
                  <button key={item.id} onClick={() => navigate(`/${item.id}`)}
                    style={{ display: 'flex', alignItems: 'center', gap: 9, padding: collapsed ? '9px' : '9px 14px', cursor: 'pointer', borderRadius: 7, transition: 'all .18s', color: isActive ? '#60a5fa' : '#94a3c8', background: isActive ? 'rgba(59,130,246,.18)' : 'transparent', border: 'none', width: 'calc(100% - 12px)', margin: '1px 6px', fontSize: 13, fontWeight: 600, position: 'relative', justifyContent: collapsed ? 'center' : 'flex-start' }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.color = '#e2e8f0'; } }}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3c8'; } }}
                  >
                    {isActive && <span style={{ position: 'absolute', left: -6, top: '50%', transform: 'translateY(-50%)', width: 3, height: 16, background: '#3b82f6', borderRadius: '0 3px 3px 0' }} />}
                    <span style={{ fontSize: 15, width: 18, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                    {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
                    {!collapsed && item.badge === 'alerts' && alertCount > 0 && <span style={{ background: '#dc2626', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 10, marginLeft: 'auto' }}>{alertCount}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div style={{ padding: 10, borderTop: '1px solid rgba(255,255,255,.06)' }}>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: 9, borderRadius: 8, cursor: 'pointer', transition: 'background .18s', border: 'none', background: 'transparent', width: '100%', justifyContent: collapsed ? 'center' : 'flex-start' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.07)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{initials}</div>
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <div style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                <div style={{ color: '#94a3c8', fontSize: 10, whiteSpace: 'nowrap' }}>{ROLE_LABELS[user?.role]}</div>
              </div>
            )}
            {!collapsed && <span style={{ color: '#94a3c8', fontSize: 12 }}>🚪</span>}
          </button>
        </div>
      </motion.aside>

      {/* ── MAIN ── */}
      <div className="content-area">
        {/* Topbar */}
        <header style={{ height: 60, background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, flexShrink: 0, zIndex: 9, boxShadow: '0 1px 4px rgba(15,23,42,.04)' }}>
          <div style={{ flex: 1, maxWidth: 320, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 14 }}>🔍</span>
            <input className="form-input" style={{ paddingLeft: 34, borderRadius: 22, background: '#f8fafc', fontSize: 13 }} placeholder="Search patients, doctors, medicines…" />
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* SOS */}
            <button onClick={triggerSOS} className="sos-button sos-button-sm" title="Emergency SOS (Ctrl+E)">🚨<span>SOS</span></button>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setNotifsOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 7, borderRadius: 8, fontSize: 17, color: '#475569', transition: 'all .18s', position: 'relative' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f1f5fb'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                🔔
                {unreadCount > 0 && <span style={{ position: 'absolute', top: 5, right: 5, width: 7, height: 7, background: '#dc2626', borderRadius: '50%', border: '1.5px solid #fff', animation: 'pulse 2s infinite' }} />}
              </button>
              <AnimatePresence>
                {notifsOpen && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
                    style={{ position: 'absolute', top: 44, right: 0, width: 320, background: '#fff', borderRadius: 14, boxShadow: '0 16px 48px rgba(15,23,42,.16)', border: '1px solid #e2e8f0', zIndex: 50 }}
                  >
                    <div style={{ padding: '12px 14px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>Notifications</span>
                      <button className="btn btn-ghost btn-xs" onClick={() => { setNotifications(n => n.map(x => ({ ...x, read: true }))); }}>Mark all read</button>
                    </div>
                    <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No notifications yet</div>
                      ) : notifications.map(n => (
                        <div key={n.id} style={{ padding: '11px 14px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: 10, cursor: 'pointer', background: n.read ? 'transparent' : '#f8faff', transition: 'background .12s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = n.read ? 'transparent' : '#f8faff'; }}
                        >
                          <div style={{ width: 34, height: 34, borderRadius: '50%', background: n.bg || '#e8effe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{n.icon}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 700 }}>{n.title}</div>
                            <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.msg}</div>
                          </div>
                          <div style={{ fontSize: 10.5, color: '#94a3b8', whiteSpace: 'nowrap' }}>{n.time}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div style={{ width: 1, height: 22, background: '#e2e8f0', margin: '0 4px' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/settings')}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#1648c9,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>{initials}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
                <div style={{ fontSize: 10.5, color: '#94a3b8' }}>{ROLE_LABELS[user?.role]}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
      <SupportBot />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Click-outside close for notifs */}
      {notifsOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setNotifsOpen(false)} />}
    </div>
  );
}