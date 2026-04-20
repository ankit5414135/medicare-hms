// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { facilityAPI, usersAPI } from '../utils/api';
// import { useAuth } from '../context/AuthContext';
// import { getSocket } from '../utils/socket';
// import toast from 'react-hot-toast';

// const TYPE_CFG = {
//   OT:        { icon:'🔪', color:'#ef4444', label:'Operation Theater' },
//   ICU:       { icon:'❤️', color:'#dc2626', label:'ICU' },
//   Ward:      { icon:'🛏️', color:'#0891b2', label:'Ward' },
//   General:   { icon:'🏥', color:'#059669', label:'General' },
//   Emergency: { icon:'🚨', color:'#f97316', label:'Emergency' },
//   Recovery:  { icon:'💚', color:'#16a34a', label:'Recovery' },
// };
// const STATUS_CFG = {
//   available:   { bg:'#dcfce7', color:'#15803d', label:'Available',   dot:'#22c55e' },
//   occupied:    { bg:'#fee2e2', color:'#dc2626', label:'Occupied',     dot:'#ef4444' },
//   maintenance: { bg:'#fef3c7', color:'#92400e', label:'Maintenance',  dot:'#f59e0b' },
//   cleaning:    { bg:'#e0f2fe', color:'#0369a1', label:'Cleaning',     dot:'#0ea5e9' },
//   reserved:    { bg:'#f5f3ff', color:'#6d28d9', label:'Reserved',     dot:'#7c3aed' },
// };
// const SHIFTS = { morning:'🌅 08:00–16:00', afternoon:'🌇 14:00–22:00', night:'🌙 22:00–08:00', full:'☀️ Full Day' };
// const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// function getWeekDates(offset=0) {
//   const now = new Date();
//   const day = now.getDay();
//   const monday = new Date(now); monday.setDate(now.getDate() - day + 1 + offset*7);
//   return Array.from({length:7},(_,i) => { const d = new Date(monday); d.setDate(monday.getDate()+i); return d; });
// }

// export default function RoomsPage() {
//   const { user } = useAuth();
//   const [rooms, setRooms] = useState([]);
//   const [schedules, setSchedules] = useState([]);
//   const [allUsers, setAllUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('rooms');
//   const [filterType, setFilterType] = useState('All');
//   const [filterStatus, setFilterStatus] = useState('All');
//   const [weekOffset, setWeekOffset] = useState(0);
//   const [showRoomModal, setShowRoomModal] = useState(false);
//   const [showScheduleModal, setShowScheduleModal] = useState(false);
//   const [editRoom, setEditRoom] = useState(null);
//   const [roomForm, setRoomForm] = useState({ name:'', type:'OT', number:'', floor:1, capacity:1, equipment:'', notes:'' });
//   const [scheduleForm, setScheduleForm] = useState({ user:'', role:'doctor', date:'', shift:'morning', department:'', task:'', notes:'' });
//   const [saving, setSaving] = useState(false);

//   const isAdmin = user?.role === 'admin';
//   const weekDates = getWeekDates(weekOffset);
//   const ac = '#2563eb';

//   const load = async () => {
//     setLoading(true);
//     try {
//       const [rRes, sRes, uRes] = await Promise.all([
//         facilityAPI.getRooms(),
//         facilityAPI.getSchedules({ week: weekDates[0].toISOString() }),
//         isAdmin ? usersAPI.getAll({ status:'approved' }) : Promise.resolve({ data:{ data:[] } }),
//       ]);
//       setRooms(rRes.data.data || []);
//       setSchedules(sRes.data.data || []);
//       setAllUsers(uRes.data.data || []);
//     } catch { toast.error('Failed to load data'); }
//     setLoading(false);
//   };

//   useEffect(() => { load(); }, [weekOffset]);

//   // Real-time room updates
//   useEffect(() => {
//     const socket = getSocket();
//     if (!socket) return;
//     const handler = ({ roomId, status }) => {
//       setRooms(rs => rs.map(r => r._id === roomId ? { ...r, status } : r));
//     };
//     socket.on('room_updated', handler);
//     return () => socket.off('room_updated', handler);
//   }, []);

//   const handleRoomStatusChange = async (id, status) => {
//     try {
//       await facilityAPI.updateRoom(id, { status });
//       toast.success(`Room marked as ${status}`);
//       load();
//     } catch { toast.error('Update failed'); }
//   };

//   const handleSaveRoom = async () => {
//     setSaving(true);
//     try {
//       const data = { ...roomForm, equipment: roomForm.equipment ? roomForm.equipment.split(',').map(e=>e.trim()) : [] };
//       if (editRoom) {
//         await facilityAPI.updateRoom(editRoom._id, data);
//         toast.success('Room updated!');
//       } else {
//         await facilityAPI.createRoom(data);
//         toast.success('Room created!');
//       }
//       setShowRoomModal(false);
//       setEditRoom(null);
//       setRoomForm({ name:'', type:'OT', number:'', floor:1, capacity:1, equipment:'', notes:'' });
//       load();
//     } catch(e) { toast.error(e.response?.data?.error || 'Save failed'); }
//     setSaving(false);
//   };

//   const handleSaveSchedule = async () => {
//     setSaving(true);
//     try {
//       await facilityAPI.createSchedule(scheduleForm);
//       toast.success('Schedule added!');
//       setShowScheduleModal(false);
//       setScheduleForm({ user:'', role:'doctor', date:'', shift:'morning', department:'', task:'', notes:'' });
//       load();
//     } catch(e) { toast.error(e.response?.data?.error || 'Save failed'); }
//     setSaving(false);
//   };

//   const handleDeleteRoom = async (id) => {
//     if (!window.confirm('Delete this room?')) return;
//     try { await facilityAPI.deleteRoom(id); toast.success('Deleted'); load(); }
//     catch { toast.error('Delete failed'); }
//   };

//   const filteredRooms = rooms.filter(r => (filterType==='All'||r.type===filterType) && (filterStatus==='All'||r.status===filterStatus));
//   const stats = Object.keys(STATUS_CFG).map(s => ({ status:s, count:rooms.filter(r=>r.status===s).length }));

//   return (
//     <div style={{ fontFamily:"'Outfit',system-ui,sans-serif" }}>
//       <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');`}</style>

//       {/* Header */}
//       <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:10 }}>
//         <div>
//           <h1 style={{ fontSize:22, fontWeight:800, color:'#0f172a', margin:0 }}>🏥 Rooms & OT Management</h1>
//           <p style={{ color:'#94a3b8', fontSize:13, marginTop:3 }}>Real-time room availability, OT schedule & staff timetable</p>
//         </div>
//         <div style={{ display:'flex', gap:8 }}>
//           {isAdmin && activeTab==='rooms' && <button onClick={()=>setShowRoomModal(true)} style={{ padding:'9px 18px', borderRadius:12, border:'none', background:'#2563eb', color:'#fff', fontFamily:'inherit', fontWeight:700, fontSize:13, cursor:'pointer' }}>+ Add Room</button>}
//           {isAdmin && activeTab==='timetable' && <button onClick={()=>setShowScheduleModal(true)} style={{ padding:'9px 18px', borderRadius:12, border:'none', background:'#059669', color:'#fff', fontFamily:'inherit', fontWeight:700, fontSize:13, cursor:'pointer' }}>+ Add Schedule</button>}
//         </div>
//       </div>

//       {/* Tabs */}
//       <div style={{ display:'flex', gap:6, marginBottom:20, background:'#f1f5f9', borderRadius:14, padding:4, width:'fit-content' }}>
//         {[['rooms','🏥 Rooms & OT'],['timetable','📆 Timetable']].map(([k,l]) => (
//           <button key={k} onClick={()=>setActiveTab(k)}
//             style={{ padding:'9px 20px', borderRadius:11, border:'none', background:activeTab===k?'#fff':'transparent', color:activeTab===k?'#0f172a':'#64748b', fontFamily:'inherit', fontWeight:700, fontSize:13, cursor:'pointer', boxShadow:activeTab===k?'0 2px 8px rgba(0,0,0,.08)':'none', transition:'all .2s' }}>
//             {l}
//           </button>
//         ))}
//       </div>

//       {activeTab === 'rooms' && (
//         <>
//           {/* Stats */}
//           <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:10, marginBottom:20 }}>
//             {stats.map(s => (
//               <div key={s.status} style={{ background:'#fff', border:'1px solid #e8edf3', borderRadius:12, padding:'12px 14px', display:'flex', alignItems:'center', gap:10 }}>
//                 <div style={{ width:10, height:10, borderRadius:'50%', background:STATUS_CFG[s.status]?.dot, flexShrink:0 }} />
//                 <div>
//                   <div style={{ fontSize:18, fontWeight:800, color:'#0f172a' }}>{s.count}</div>
//                   <div style={{ fontSize:11, color:'#94a3b8', textTransform:'capitalize' }}>{s.status}</div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Filters */}
//           <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
//             {['All',...Object.keys(TYPE_CFG)].map(t => (
//               <button key={t} onClick={()=>setFilterType(t)}
//                 style={{ padding:'5px 14px', borderRadius:20, border:`1.5px solid ${filterType===t?ac:'#e2e8f0'}`, background:filterType===t?ac:'#fff', color:filterType===t?'#fff':'#64748b', fontFamily:'inherit', fontSize:12, fontWeight:600, cursor:'pointer', transition:'all .15s' }}>
//                 {t==='All'?'All Types':`${TYPE_CFG[t]?.icon} ${t}`}
//               </button>
//             ))}
//             <div style={{ width:1, background:'#e2e8f0', margin:'0 4px' }} />
//             {['All','available','occupied','cleaning','maintenance'].map(s => (
//               <button key={s} onClick={()=>setFilterStatus(s)}
//                 style={{ padding:'5px 14px', borderRadius:20, border:`1.5px solid ${filterStatus===s?(STATUS_CFG[s]?.dot||ac):'#e2e8f0'}`, background:filterStatus===s?(STATUS_CFG[s]?.dot||ac):'#fff', color:filterStatus===s?'#fff':'#64748b', fontFamily:'inherit', fontSize:12, fontWeight:600, cursor:'pointer', transition:'all .15s' }}>
//                 {s==='All'?'All Status':s.charAt(0).toUpperCase()+s.slice(1)}
//               </button>
//             ))}
//           </div>

//           {/* Room Grid */}
//           {loading ? (
//             <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12 }}>
//               {Array(8).fill(0).map((_,i)=><div key={i} style={{ height:200, background:'#f1f5f9', borderRadius:14 }} />)}
//             </div>
//           ) : filteredRooms.length === 0 ? (
//             <div style={{ textAlign:'center', padding:64, color:'#94a3b8' }}><div style={{ fontSize:48,marginBottom:12 }}>🏥</div><div style={{ fontWeight:700 }}>No rooms found</div></div>
//           ) : (
//             <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12 }}>
//               {filteredRooms.map((room,i) => {
//                 const tc = TYPE_CFG[room.type] || TYPE_CFG.General;
//                 const sc = STATUS_CFG[room.status] || STATUS_CFG.available;
//                 return (
//                   <motion.div key={room._id} initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*.04 }}
//                     style={{ background:'#fff', border:'1.5px solid #e8edf3', borderRadius:14, overflow:'hidden', transition:'all .2s' }}
//                     onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,.1)';e.currentTarget.style.transform='translateY(-2px)';}}
//                     onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='none';}}>
//                     {/* Top bar */}
//                     <div style={{ height:4, background:`linear-gradient(90deg,${tc.color},${tc.color}80)` }} />
//                     <div style={{ padding:'16px' }}>
//                       <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
//                         <div>
//                           <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
//                             <span style={{ fontSize:20 }}>{tc.icon}</span>
//                             <div>
//                               <div style={{ fontWeight:800, color:'#0f172a', fontSize:14 }}>{room.name}</div>
//                               <div style={{ fontSize:11, color:'#94a3b8' }}>Room {room.number} · Floor {room.floor}</div>
//                             </div>
//                           </div>
//                           <span style={{ display:'inline-block', padding:'2px 8px', borderRadius:20, fontSize:10.5, fontWeight:700, background:tc.color+'15', color:tc.color }}>{room.type}</span>
//                         </div>
//                         <span style={{ padding:'3px 9px', borderRadius:20, fontSize:11, fontWeight:700, background:sc.bg, color:sc.color, display:'flex', alignItems:'center', gap:4 }}>
//                           <div style={{ width:6,height:6,borderRadius:'50%',background:sc.dot }} />{sc.label}
//                         </span>
//                       </div>

//                       {/* Occupancy bar */}
//                       <div style={{ marginBottom:10 }}>
//                         <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
//                           <span style={{ fontSize:11, color:'#64748b' }}>Occupancy</span>
//                           <span style={{ fontSize:11, fontWeight:700, color:'#0f172a' }}>{room.occupiedBeds}/{room.capacity}</span>
//                         </div>
//                         <div style={{ height:6, background:'#f1f5f9', borderRadius:3 }}>
//                           <div style={{ height:'100%', background: room.occupiedBeds===room.capacity?'#ef4444':tc.color, borderRadius:3, width:`${(room.occupiedBeds/room.capacity)*100}%`, transition:'width .3s' }} />
//                         </div>
//                       </div>

//                       {room.assignedPatient && (
//                         <div style={{ background:'#fef2f2', borderRadius:8, padding:'6px 9px', fontSize:11.5, color:'#dc2626', marginBottom:8, display:'flex', alignItems:'center', gap:5 }}>
//                           👤 <span style={{ fontWeight:600 }}>{room.assignedPatient.name}</span>
//                         </div>
//                       )}
//                       {room.assignedDoctor && (
//                         <div style={{ background:'#ecfeff', borderRadius:8, padding:'6px 9px', fontSize:11.5, color:'#0891b2', marginBottom:8, display:'flex', alignItems:'center', gap:5 }}>
//                           ⚕️ Dr. {room.assignedDoctor.name}
//                         </div>
//                       )}

//                       {/* Actions */}
//                       <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginTop:8 }}>
//                         {room.status !== 'available' && (
//                           <button onClick={() => handleRoomStatusChange(room._id,'available')}
//                             style={{ flex:1, padding:'6px', borderRadius:8, border:'1px solid #bbf7d0', background:'#f0fdf4', color:'#15803d', fontFamily:'inherit', fontSize:11, fontWeight:700, cursor:'pointer' }}>
//                             ✓ Mark Available
//                           </button>
//                         )}
//                         {room.status === 'available' && (
//                           <button onClick={() => handleRoomStatusChange(room._id,'occupied')}
//                             style={{ flex:1, padding:'6px', borderRadius:8, border:'1px solid #fecaca', background:'#fef2f2', color:'#dc2626', fontFamily:'inherit', fontSize:11, fontWeight:700, cursor:'pointer' }}>
//                             Mark Occupied
//                           </button>
//                         )}
//                         <button onClick={() => handleRoomStatusChange(room._id,'cleaning')}
//                           style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #bae6fd', background:'#f0f9ff', color:'#0369a1', fontFamily:'inherit', fontSize:11, fontWeight:700, cursor:'pointer' }}>
//                           🧹
//                         </button>
//                         {isAdmin && (
//                           <>
//                             <button onClick={() => { setEditRoom(room); setRoomForm({ name:room.name, type:room.type, number:room.number, floor:room.floor, capacity:room.capacity, equipment:(room.equipment||[]).join(', '), notes:room.notes }); setShowRoomModal(true); }}
//                               style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #e2e8f0', background:'#f8fafc', color:'#374151', fontFamily:'inherit', fontSize:11, fontWeight:700, cursor:'pointer' }}>✏️</button>
//                             <button onClick={() => handleDeleteRoom(room._id)}
//                               style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #fecaca', background:'#fef2f2', color:'#dc2626', fontFamily:'inherit', fontSize:11, fontWeight:700, cursor:'pointer' }}>🗑</button>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </div>
//           )}
//         </>
//       )}

//       {activeTab === 'timetable' && (
//         <div>
//           {/* Week nav */}
//           <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
//             <button onClick={()=>setWeekOffset(w=>w-1)} style={{ padding:'7px 14px', borderRadius:10, border:'1px solid #e2e8f0', background:'#fff', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:600 }}>← Prev</button>
//             <div style={{ fontWeight:700, color:'#0f172a', fontSize:14 }}>
//               {weekDates[0].toLocaleDateString('en',{month:'short',day:'numeric'})} – {weekDates[6].toLocaleDateString('en',{month:'short',day:'numeric',year:'numeric'})}
//             </div>
//             <button onClick={()=>setWeekOffset(w=>w+1)} style={{ padding:'7px 14px', borderRadius:10, border:'1px solid #e2e8f0', background:'#fff', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:600 }}>Next →</button>
//             <button onClick={()=>setWeekOffset(0)} style={{ padding:'7px 14px', borderRadius:10, border:'1px solid #2563eb', background:'#eff6ff', color:'#2563eb', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:700 }}>Today</button>
//           </div>

//           {/* Timetable grid */}
//           <div style={{ background:'#fff', border:'1px solid #e8edf3', borderRadius:16, overflow:'hidden' }}>
//             <div style={{ display:'grid', gridTemplateColumns:'160px repeat(7,1fr)', borderBottom:'2px solid #f1f5f9' }}>
//               <div style={{ padding:'12px 14px', fontWeight:700, color:'#64748b', fontSize:12, background:'#f8fafc' }}>Staff</div>
//               {weekDates.map((d,i) => {
//                 const isToday = d.toDateString() === new Date().toDateString();
//                 return (
//                   <div key={i} style={{ padding:'12px 8px', textAlign:'center', background: isToday?'#eff6ff':'#f8fafc', borderLeft:'1px solid #f1f5f9' }}>
//                     <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600 }}>{DAYS[d.getDay()]}</div>
//                     <div style={{ fontSize:16, fontWeight:800, color: isToday?'#2563eb':'#0f172a', marginTop:2 }}>{d.getDate()}</div>
//                     {isToday && <div style={{ width:6,height:6,borderRadius:'50%',background:'#2563eb',margin:'3px auto 0' }} />}
//                   </div>
//                 );
//               })}
//             </div>
//             {loading ? (
//               <div style={{ padding:40,textAlign:'center',color:'#94a3b8' }}>Loading schedules…</div>
//             ) : schedules.length === 0 ? (
//               <div style={{ padding:48, textAlign:'center', color:'#94a3b8' }}>
//                 <div style={{ fontSize:36, marginBottom:8 }}>📆</div>
//                 <div style={{ fontWeight:700 }}>No schedules this week</div>
//                 {isAdmin && <div style={{ fontSize:12, marginTop:4 }}>Click "+ Add Schedule" to add staff shifts</div>}
//               </div>
//             ) : (() => {
//               const staffMap = {};
//               schedules.forEach(s => {
//                 const uid = s.user?._id;
//                 if (!uid) return;
//                 if (!staffMap[uid]) staffMap[uid] = { user:s.user, days:{} };
//                 const day = new Date(s.date).toDateString();
//                 if (!staffMap[uid].days[day]) staffMap[uid].days[day] = [];
//                 staffMap[uid].days[day].push(s);
//               });
//               return Object.values(staffMap).map((staff, si) => (
//                 <div key={si} style={{ display:'grid', gridTemplateColumns:'160px repeat(7,1fr)', borderBottom:'1px solid #f1f5f9' }}>
//                   <div style={{ padding:'12px 14px', display:'flex', alignItems:'center', gap:8, background:'#fafbfc' }}>
//                     <div style={{ width:30,height:30,borderRadius:'50%',background:`linear-gradient(135deg,#2563eb,#0ea5e9)`,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:12,flexShrink:0 }}>
//                       {staff.user?.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
//                     </div>
//                     <div>
//                       <div style={{ fontSize:12, fontWeight:700, color:'#0f172a' }}>{staff.user?.name?.split(' ')[0]}</div>
//                       <div style={{ fontSize:10, color:'#94a3b8', textTransform:'capitalize' }}>{staff.user?.role}</div>
//                     </div>
//                   </div>
//                   {weekDates.map((d,di) => {
//                     const day = d.toDateString();
//                     const daySchedules = staff.days[day] || [];
//                     const isToday = d.toDateString() === new Date().toDateString();
//                     return (
//                       <div key={di} style={{ padding:5, borderLeft:'1px solid #f1f5f9', background:isToday?'#f8fbff':undefined, minHeight:60 }}>
//                         {daySchedules.map((s,ssi) => (
//                           <div key={ssi} style={{ padding:'4px 6px', borderRadius:7, marginBottom:3, fontSize:11, fontWeight:600,
//                             background: s.shift==='morning'?'#dcfce7':s.shift==='afternoon'?'#fef3c7':s.shift==='night'?'#e0e7ff':'#f0fdf4',
//                             color: s.shift==='morning'?'#15803d':s.shift==='afternoon'?'#92400e':s.shift==='night'?'#3730a3':'#15803d',
//                             display:'flex', alignItems:'center', gap:3 }}>
//                             <span>{s.shift==='morning'?'🌅':s.shift==='afternoon'?'🌇':s.shift==='night'?'🌙':'☀️'}</span>
//                             {s.department||s.task||s.shift}
//                           </div>
//                         ))}
//                       </div>
//                     );
//                   })}
//                 </div>
//               ));
//             })()}
//           </div>
//         </div>
//       )}

//       {/* Room Modal */}
//       <AnimatePresence>
//         {showRoomModal && (
//           <div onClick={e=>{if(e.target===e.currentTarget)setShowRoomModal(false)}} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:16 }}>
//             <motion.div initial={{ opacity:0,y:20,scale:.96 }} animate={{ opacity:1,y:0,scale:1 }} exit={{ opacity:0,y:20,scale:.96 }}
//               style={{ background:'#fff',borderRadius:20,padding:'28px',width:'100%',maxWidth:480,boxShadow:'0 24px 60px rgba(0,0,0,.2)' }}>
//               <h3 style={{ fontSize:18,fontWeight:800,color:'#0f172a',marginBottom:20 }}>{editRoom?'✏️ Edit Room':'🏥 Add New Room'}</h3>
//               <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
//                 {[['Room Name','name','text'],['Room Number','number','text']].map(([l,k,t]) => (
//                   <div key={k}><label style={{ display:'block',fontSize:11,fontWeight:700,color:'#374151',marginBottom:5,letterSpacing:.4,textTransform:'uppercase' }}>{l}</label>
//                   <input type={t} value={roomForm[k]} onChange={e=>setRoomForm(f=>({...f,[k]:e.target.value}))} style={{ width:'100%',padding:'10px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontFamily:'inherit',fontSize:13.5,outline:'none',boxSizing:'border-box' }} /></div>
//                 ))}
//                 <div><label style={{ display:'block',fontSize:11,fontWeight:700,color:'#374151',marginBottom:5,letterSpacing:.4,textTransform:'uppercase' }}>Type</label>
//                 <select value={roomForm.type} onChange={e=>setRoomForm(f=>({...f,type:e.target.value}))} style={{ width:'100%',padding:'10px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontFamily:'inherit',fontSize:13.5,outline:'none',background:'#fff',boxSizing:'border-box' }}>
//                   {Object.keys(TYPE_CFG).map(t=><option key={t}>{t}</option>)}</select></div>
//                 <div><label style={{ display:'block',fontSize:11,fontWeight:700,color:'#374151',marginBottom:5,letterSpacing:.4,textTransform:'uppercase' }}>Capacity (Beds)</label>
//                 <input type="number" value={roomForm.capacity} onChange={e=>setRoomForm(f=>({...f,capacity:e.target.value}))} style={{ width:'100%',padding:'10px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontFamily:'inherit',fontSize:13.5,outline:'none',boxSizing:'border-box' }} /></div>
//                 <div style={{ gridColumn:'1/-1' }}><label style={{ display:'block',fontSize:11,fontWeight:700,color:'#374151',marginBottom:5,letterSpacing:.4,textTransform:'uppercase' }}>Equipment (comma-separated)</label>
//                 <input type="text" value={roomForm.equipment} onChange={e=>setRoomForm(f=>({...f,equipment:e.target.value}))} placeholder="Ventilator, ECG Machine, Defibrillator" style={{ width:'100%',padding:'10px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontFamily:'inherit',fontSize:13.5,outline:'none',boxSizing:'border-box' }} /></div>
//                 <div style={{ gridColumn:'1/-1' }}><label style={{ display:'block',fontSize:11,fontWeight:700,color:'#374151',marginBottom:5,letterSpacing:.4,textTransform:'uppercase' }}>Notes</label>
//                 <textarea value={roomForm.notes} onChange={e=>setRoomForm(f=>({...f,notes:e.target.value}))} rows={2} style={{ width:'100%',padding:'10px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontFamily:'inherit',fontSize:13.5,outline:'none',resize:'none',boxSizing:'border-box' }} /></div>
//               </div>
//               <div style={{ display:'flex',gap:10,marginTop:20 }}>
//                 <button onClick={()=>{setShowRoomModal(false);setEditRoom(null);}} style={{ flex:1,padding:'11px',borderRadius:12,border:'1.5px solid #e2e8f0',background:'#fff',fontFamily:'inherit',fontWeight:700,cursor:'pointer' }}>Cancel</button>
//                 <button onClick={handleSaveRoom} disabled={saving} style={{ flex:2,padding:'11px',borderRadius:12,border:'none',background:'#2563eb',color:'#fff',fontFamily:'inherit',fontWeight:700,cursor:'pointer' }}>{saving?'Saving…':'💾 Save Room'}</button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* Schedule Modal */}
//       <AnimatePresence>
//         {showScheduleModal && (
//           <div onClick={e=>{if(e.target===e.currentTarget)setShowScheduleModal(false)}} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:16 }}>
//             <motion.div initial={{ opacity:0,y:20,scale:.96 }} animate={{ opacity:1,y:0,scale:1 }} exit={{ opacity:0,y:20,scale:.96 }}
//               style={{ background:'#fff',borderRadius:20,padding:'28px',width:'100%',maxWidth:460,boxShadow:'0 24px 60px rgba(0,0,0,.2)' }}>
//               <h3 style={{ fontSize:18,fontWeight:800,color:'#0f172a',marginBottom:20 }}>📆 Add Staff Schedule</h3>
//               <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
//                 <div><label style={{ display:'block',fontSize:11,fontWeight:700,color:'#374151',marginBottom:5,letterSpacing:.4,textTransform:'uppercase' }}>Staff Member</label>
//                 <select value={scheduleForm.user} onChange={e=>setScheduleForm(f=>({...f,user:e.target.value}))} style={{ width:'100%',padding:'10px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontFamily:'inherit',fontSize:13.5,outline:'none',background:'#fff',boxSizing:'border-box' }}>
//                   <option value="">Select staff…</option>
//                   {allUsers.filter(u=>u.role!=='patient').map(u=><option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
//                 </select></div>
//                 <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
//                   <div><label style={{ display:'block',fontSize:11,fontWeight:700,color:'#374151',marginBottom:5,letterSpacing:.4,textTransform:'uppercase' }}>Date</label>
//                   <input type="date" value={scheduleForm.date} onChange={e=>setScheduleForm(f=>({...f,date:e.target.value}))} style={{ width:'100%',padding:'10px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontFamily:'inherit',fontSize:13.5,outline:'none',boxSizing:'border-box' }} /></div>
//                   <div><label style={{ display:'block',fontSize:11,fontWeight:700,color:'#374151',marginBottom:5,letterSpacing:.4,textTransform:'uppercase' }}>Shift</label>
//                   <select value={scheduleForm.shift} onChange={e=>setScheduleForm(f=>({...f,shift:e.target.value}))} style={{ width:'100%',padding:'10px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontFamily:'inherit',fontSize:13.5,outline:'none',background:'#fff',boxSizing:'border-box' }}>
//                     {Object.entries(SHIFTS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
//                   </select></div>
//                 </div>
//                 {[['Department','department','text','e.g. Cardiology'],['Task','task','text','e.g. ICU monitoring']].map(([l,k,t,p]) => (
//                   <div key={k}><label style={{ display:'block',fontSize:11,fontWeight:700,color:'#374151',marginBottom:5,letterSpacing:.4,textTransform:'uppercase' }}>{l}</label>
//                   <input type={t} value={scheduleForm[k]} onChange={e=>setScheduleForm(f=>({...f,[k]:e.target.value}))} placeholder={p} style={{ width:'100%',padding:'10px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontFamily:'inherit',fontSize:13.5,outline:'none',boxSizing:'border-box' }} /></div>
//                 ))}
//               </div>
//               <div style={{ display:'flex',gap:10,marginTop:20 }}>
//                 <button onClick={()=>setShowScheduleModal(false)} style={{ flex:1,padding:'11px',borderRadius:12,border:'1.5px solid #e2e8f0',background:'#fff',fontFamily:'inherit',fontWeight:700,cursor:'pointer' }}>Cancel</button>
//                 <button onClick={handleSaveSchedule} disabled={saving} style={{ flex:2,padding:'11px',borderRadius:12,border:'none',background:'#059669',color:'#fff',fontFamily:'inherit',fontWeight:700,cursor:'pointer' }}>{saving?'Saving…':'📆 Add Schedule'}</button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { facilityAPI, usersAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../utils/socket';
import toast from 'react-hot-toast';

const TYPE_CFG = {
  OT:        { icon:'🔪', color:'#ef4444', label:'Operation Theater' },
  ICU:       { icon:'❤️', color:'#dc2626', label:'ICU' },
  Ward:      { icon:'🛏️', color:'#0891b2', label:'Ward' },
  General:   { icon:'🏥', color:'#059669', label:'General' },
  Emergency: { icon:'🚨', color:'#f97316', label:'Emergency' },
  Recovery:  { icon:'💚', color:'#16a34a', label:'Recovery' },
};
const STATUS_CFG = {
  available:   { bg:'#dcfce7', color:'#15803d', label:'Available',   dot:'#22c55e' },
  occupied:    { bg:'#fee2e2', color:'#dc2626', label:'Occupied',     dot:'#ef4444' },
  maintenance: { bg:'#fef3c7', color:'#92400e', label:'Maintenance',  dot:'#f59e0b' },
  cleaning:    { bg:'#e0f2fe', color:'#0369a1', label:'Cleaning',     dot:'#0ea5e9' },
  reserved:    { bg:'#f5f3ff', color:'#6d28d9', label:'Reserved',     dot:'#7c3aed' },
};
const SHIFTS = { morning:'🌅 08:00–16:00', afternoon:'🌇 14:00–22:00', night:'🌙 22:00–08:00', full:'☀️ Full Day' };
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function getWeekDates(offset=0) {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now); monday.setDate(now.getDate() - day + 1 + offset*7);
  return Array.from({length:7},(_,i) => { const d = new Date(monday); d.setDate(monday.getDate()+i); return d; });
}

export default function RoomsPage() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rooms');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [weekOffset, setWeekOffset] = useState(0);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({ name:'', type:'OT', number:'', floor:1, capacity:1, equipment:'', notes:'' });
  const [scheduleForm, setScheduleForm] = useState({ user:'', role:'doctor', date:'', shift:'morning', department:'', task:'', notes:'' });
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.role === 'admin';
  const weekDates = getWeekDates(weekOffset);
  const ac = '#2563eb';

  const load = async () => {
    setLoading(true);
    try {
      const [rRes, sRes, uRes] = await Promise.all([
        facilityAPI.getRooms(),
        facilityAPI.getSchedules({ week: weekDates[0].toISOString() }),
        isAdmin ? usersAPI.getAll({ status:'approved' }) : Promise.resolve({ data:{ data:[] } }),
      ]);
      setRooms(rRes.data.data || []);
      setSchedules(sRes.data.data || []);
      setAllUsers(uRes.data.data || []);
    } catch { toast.error('Failed to load data'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [weekOffset]);

  // Real-time room updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handler = ({ roomId, status }) => {
      setRooms(rs => rs.map(r => r._id === roomId ? { ...r, status } : r));
    };
    socket.on('room_updated', handler);
    return () => socket.off('room_updated', handler);
  }, []);

  const handleRoomStatusChange = async (id, status) => {
    try {
      await facilityAPI.updateRoom(id, { status });
      toast.success(`Room marked as ${status}`);
      load();
    } catch { toast.error('Update failed'); }
  };

  const handleSaveRoom = async () => {
    setSaving(true);
    try {
      const data = { ...roomForm, equipment: roomForm.equipment ? roomForm.equipment.split(',').map(e=>e.trim()) : [] };
      if (editRoom) {
        await facilityAPI.updateRoom(editRoom._id, data);
        toast.success('Room updated!');
      } else {
        await facilityAPI.createRoom(data);
        toast.success('Room created!');
      }
      setShowRoomModal(false);
      setEditRoom(null);
      setRoomForm({ name:'', type:'OT', number:'', floor:1, capacity:1, equipment:'', notes:'' });
      load();
    } catch(e) { toast.error(e.response?.data?.error || 'Save failed'); }
    setSaving(false);
  };

  const handleSaveSchedule = async () => {
    setSaving(true);
    try {
      await facilityAPI.createSchedule(scheduleForm);
      toast.success('Schedule added!');
      setShowScheduleModal(false);
      setScheduleForm({ user:'', role:'doctor', date:'', shift:'morning', department:'', task:'', notes:'' });
      load();
    } catch(e) { toast.error(e.response?.data?.error || 'Save failed'); }
    setSaving(false);
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    try { await facilityAPI.deleteRoom(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const filteredRooms = rooms.filter(r => (filterType==='All'||r.type===filterType) && (filterStatus==='All'||r.status===filterStatus));
  const stats = Object.keys(STATUS_CFG).map(s => ({ status:s, count:rooms.filter(r=>r.status===s).length }));

  return (
    <div style={{ fontFamily:"'Outfit',system-ui,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:10 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:'#0f172a', margin:0 }}>🏥 Rooms & OT Management</h1>
          <p style={{ color:'#94a3b8', fontSize:13, marginTop:3 }}>Real-time room availability, OT schedule & staff timetable</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {isAdmin && activeTab==='rooms' && <button onClick={()=>setShowRoomModal(true)} style={{ padding:'9px 18px', borderRadius:12, border:'none', background:'#2563eb', color:'#fff', fontFamily:'inherit', fontWeight:700, fontSize:13, cursor:'pointer' }}>+ Add Room</button>}
          {isAdmin && activeTab==='timetable' && <button onClick={()=>setShowScheduleModal(true)} style={{ padding:'9px 18px', borderRadius:12, border:'none', background:'#059669', color:'#fff', fontFamily:'inherit', fontWeight:700, fontSize:13, cursor:'pointer' }}>+ Add Schedule</button>}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:20, background:'#f1f5f9', borderRadius:14, padding:4, width:'fit-content' }}>
        {[['rooms','🏥 Rooms & OT'],['timetable','📆 Timetable']].map(([k,l]) => (
          <button key={k} onClick={()=>setActiveTab(k)}
            style={{ padding:'9px 20px', borderRadius:11, border:'none', background:activeTab===k?'#fff':'transparent', color:activeTab===k?'#0f172a':'#64748b', fontFamily:'inherit', fontWeight:700, fontSize:13, cursor:'pointer', boxShadow:activeTab===k?'0 2px 8px rgba(0,0,0,.08)':'none', transition:'all .2s' }}>
            {l}
          </button>
        ))}
      </div>

      {activeTab === 'rooms' && (
        <>
          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:10, marginBottom:20 }}>
            {stats.map(s => (
              <div key={s.status} style={{ background:'#fff', border:'1px solid #e8edf3', borderRadius:12, padding:'12px 14px', display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:STATUS_CFG[s.status]?.dot, flexShrink:0 }} />
                <div>
                  <div style={{ fontSize:18, fontWeight:800, color:'#0f172a' }}>{s.count}</div>
                  <div style={{ fontSize:11, color:'#94a3b8', textTransform:'capitalize' }}>{s.status}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
            {['All',...Object.keys(TYPE_CFG)].map(t => (
              <button key={t} onClick={()=>setFilterType(t)}
                style={{ padding:'5px 14px', borderRadius:20, border:`1.5px solid ${filterType===t?ac:'#e2e8f0'}`, background:filterType===t?ac:'#fff', color:filterType===t?'#fff':'#64748b', fontFamily:'inherit', fontSize:12, fontWeight:600, cursor:'pointer', transition:'all .15s' }}>
                {t==='All'?'All Types':`${TYPE_CFG[t]?.icon} ${t}`}
              </button>
            ))}
            <div style={{ width:1, background:'#e2e8f0', margin:'0 4px' }} />
            {['All','available','occupied','cleaning','maintenance'].map(s => (
              <button key={s} onClick={()=>setFilterStatus(s)}
                style={{ padding:'5px 14px', borderRadius:20, border:`1.5px solid ${filterStatus===s?(STATUS_CFG[s]?.dot||ac):'#e2e8f0'}`, background:filterStatus===s?(STATUS_CFG[s]?.dot||ac):'#fff', color:filterStatus===s?'#fff':'#64748b', fontFamily:'inherit', fontSize:12, fontWeight:600, cursor:'pointer', transition:'all .15s' }}>
                {s==='All'?'All Status':s.charAt(0).toUpperCase()+s.slice(1)}
              </button>
            ))}
          </div>

          {/* Room Grid */}
          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12 }}>
              {Array(8).fill(0).map((_,i)=><div key={i} style={{ height:200, background:'#f1f5f9', borderRadius:14 }} />)}
            </div>
          ) : filteredRooms.length === 0 ? (
            <div style={{ textAlign:'center', padding:64, color:'#94a3b8' }}><div style={{ fontSize:48,marginBottom:12 }}>🏥</div><div style={{ fontWeight:700 }}>No rooms found</div></div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12 }}>
              {filteredRooms.map((room,i) => {
                const tc = TYPE_CFG[room.type] || TYPE_CFG.General;
                const sc = STATUS_CFG[room.status] || STATUS_CFG.available;
                return (
                  <motion.div key={room._id} initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*.04 }}
                    style={{ background:'#fff', border:'1.5px solid #e8edf3', borderRadius:14, overflow:'hidden', transition:'all .2s' }}
                    onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,.1)';e.currentTarget.style.transform='translateY(-2px)';}}
                    onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='none';}}>
                    {/* Top bar */}
                    <div style={{ height:4, background:`linear-gradient(90deg,${tc.color},${tc.color}80)` }} />
                    <div style={{ padding:'16px' }}>
                      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                        <div>
                          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                            <span style={{ fontSize:20 }}>{tc.icon}</span>
                            <div>
                              <div style={{ fontWeight:800, color:'#0f172a', fontSize:14 }}>{room.name}</div>
                              <div style={{ fontSize:11, color:'#94a3b8' }}>Room {room.number} · Floor {room.floor}</div>
                            </div>
                          </div>
                          <span style={{ display:'inline-block', padding:'2px 8px', borderRadius:20, fontSize:10.5, fontWeight:700, background:tc.color+'15', color:tc.color }}>{room.type}</span>
                        </div>
                        <span style={{ padding:'3px 9px', borderRadius:20, fontSize:11, fontWeight:700, background:sc.bg, color:sc.color, display:'flex', alignItems:'center', gap:4 }}>
                          <div style={{ width:6,height:6,borderRadius:'50%',background:sc.dot }} />{sc.label}
                        </span>
                      </div>

                      {/* Occupancy bar */}
                      <div style={{ marginBottom:10 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                          <span style={{ fontSize:11, color:'#64748b' }}>Occupancy</span>
                          <span style={{ fontSize:11, fontWeight:700, color:'#0f172a' }}>{room.occupiedBeds}/{room.capacity}</span>
                        </div>
                        <div style={{ height:6, background:'#f1f5f9', borderRadius:3 }}>
                          <div style={{ height:'100%', background: room.occupiedBeds===room.capacity?'#ef4444':tc.color, borderRadius:3, width:`${(room.occupiedBeds/room.capacity)*100}%`, transition:'width .3s' }} />
                        </div>
                      </div>

                      {room.assignedPatient && (
                        <div style={{ background:'#fef2f2', borderRadius:8, padding:'6px 9px', fontSize:11.5, color:'#dc2626', marginBottom:8, display:'flex', alignItems:'center', gap:5 }}>
                          👤 <span style={{ fontWeight:600 }}>{room.assignedPatient.name}</span>
                        </div>
                      )}
                      {room.assignedDoctor && (
                        <div style={{ background:'#ecfeff', borderRadius:8, padding:'6px 9px', fontSize:11.5, color:'#0891b2', marginBottom:8, display:'flex', alignItems:'center', gap:5 }}>
                          ⚕️ Dr. {room.assignedDoctor.name}
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginTop:8 }}>
                        {room.status !== 'available' && (
                          <button onClick={e=>{e.stopPropagation();handleRoomStatusChange(room._id,'available');}}
                            style={{ flex:1, padding:'6px', borderRadius:8, border:'1px solid #bbf7d0', background:'#f0fdf4', color:'#15803d', fontFamily:'inherit', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                            ✓ Available
                          </button>
                        )}
                        {room.status === 'available' && (
                          <button onClick={e=>{e.stopPropagation();handleRoomStatusChange(room._id,'occupied');}}
                            style={{ flex:1, padding:'6px', borderRadius:8, border:'1px solid #fecaca', background:'#fef2f2', color:'#dc2626', fontFamily:'inherit', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                            Occupied
                          </button>
                        )}
                        {['admin','nurse','wardboy','sweeper','otboy'].includes(user?.role) && (
                          <button onClick={e=>{e.stopPropagation();handleRoomStatusChange(room._id,'cleaning');}}
                            style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #bae6fd', background:'#f0f9ff', color:'#0369a1', fontFamily:'inherit', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                            🧹
                          </button>
                        )}
                        {isAdmin && (
                          <>
                            <button onClick={e=>{e.stopPropagation();setEditRoom(room);setRoomForm({ name:room.name, type:room.type, number:room.number, floor:room.floor, capacity:room.capacity, equipment:(room.equipment||[]).join(', '), notes:room.notes });setShowRoomModal(true);}}
                              style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #e2e8f0', background:'#f8fafc', color:'#374151', fontFamily:'inherit', fontSize:11, fontWeight:700, cursor:'pointer' }}>✏️</button>
                            <button onClick={e=>{e.stopPropagation();handleDeleteRoom(room._id);}}
                              style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #fecaca', background:'#fef2f2', color:'#dc2626', fontFamily:'inherit', fontSize:11, fontWeight:700, cursor:'pointer' }}>🗑</button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeTab === 'timetable' && (
        <div>
          {/* Week nav */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
            <button onClick={()=>setWeekOffset(w=>w-1)} style={{ padding:'7px 14px', borderRadius:10, border:'1px solid #e2e8f0', background:'#fff', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:600 }}>← Prev</button>
            <div style={{ fontWeight:700, color:'#0f172a', fontSize:14 }}>
              {weekDates[0].toLocaleDateString('en',{month:'short',day:'numeric'})} – {weekDates[6].toLocaleDateString('en',{month:'short',day:'numeric',year:'numeric'})}
            </div>
            <button onClick={()=>setWeekOffset(w=>w+1)} style={{ padding:'7px 14px', borderRadius:10, border:'1px solid #e2e8f0', background:'#fff', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:600 }}>Next →</button>
            <button onClick={()=>setWeekOffset(0)} style={{ padding:'7px 14px', borderRadius:10, border:'1px solid #2563eb', background:'#eff6ff', color:'#2563eb', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:700 }}>Today</button>
          </div>

          {/* Timetable grid */}
          <div style={{ background:'#fff', border:'1px solid #e8edf3', borderRadius:16, overflow:'hidden' }}>
            <div style={{ display:'grid', gridTemplateColumns:'160px repeat(7,1fr)', borderBottom:'2px solid #f1f5f9' }}>
              <div style={{ padding:'12px 14px', fontWeight:700, color:'#64748b', fontSize:12, background:'#f8fafc' }}>Staff</div>
              {weekDates.map((d,i) => {
                const isToday = d.toDateString() === new Date().toDateString();
                return (
                  <div key={i} style={{ padding:'12px 8px', textAlign:'center', background: isToday?'#eff6ff':'#f8fafc', borderLeft:'1px solid #f1f5f9' }}>
                    <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600 }}>{DAYS[d.getDay()]}</div>
                    <div style={{ fontSize:16, fontWeight:800, color: isToday?'#2563eb':'#0f172a', marginTop:2 }}>{d.getDate()}</div>
                    {isToday && <div style={{ width:6,height:6,borderRadius:'50%',background:'#2563eb',margin:'3px auto 0' }} />}
                  </div>
                );
              })}
            </div>
            {loading ? (
              <div style={{ padding:40,textAlign:'center',color:'#94a3b8' }}>Loading schedules…</div>
            ) : schedules.length === 0 ? (
              <div style={{ padding:48, textAlign:'center', color:'#94a3b8' }}>
                <div style={{ fontSize:36, marginBottom:8 }}>📆</div>
                <div style={{ fontWeight:700 }}>No schedules this week</div>
                {isAdmin && <div style={{ fontSize:12, marginTop:4 }}>Click "+ Add Schedule" to add staff shifts</div>}
              </div>
            ) : (() => {
              const staffMap = {};
              schedules.forEach(s => {
                const uid = s.user?._id;
                if (!uid) return;
                if (!staffMap[uid]) staffMap[uid] = { user:s.user, days:{} };
                const day = new Date(s.date).toDateString();
                if (!staffMap[uid].days[day]) staffMap[uid].days[day] = [];
                staffMap[uid].days[day].push(s);
              });
              return Object.values(staffMap).map((staff, si) => (
                <div key={si} style={{ display:'grid', gridTemplateColumns:'160px repeat(7,1fr)', borderBottom:'1px solid #f1f5f9' }}>
                  <div style={{ padding:'12px 14px', display:'flex', alignItems:'center', gap:8, background:'#fafbfc' }}>
                    <div style={{ width:30,height:30,borderRadius:'50%',background:`linear-gradient(135deg,#2563eb,#0ea5e9)`,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:12,flexShrink:0 }}>
                      {staff.user?.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize:12, fontWeight:700, color:'#0f172a' }}>{staff.user?.name?.split(' ')[0]}</div>
                      <div style={{ fontSize:10, color:'#94a3b8', textTransform:'capitalize' }}>{staff.user?.role}</div>
                    </div>
                  </div>
                  {weekDates.map((d,di) => {
                    const day = d.toDateString();
                    const daySchedules = staff.days[day] || [];
                    const isToday = d.toDateString() === new Date().toDateString();
                    return (
                      <div key={di} style={{ padding:5, borderLeft:'1px solid #f1f5f9', background:isToday?'#f8fbff':undefined, minHeight:60 }}>
                        {daySchedules.map((s,ssi) => (
                          <div key={ssi} style={{ padding:'4px 6px', borderRadius:7, marginBottom:3, fontSize:11, fontWeight:600,
                            background: s.shift==='morning'?'#dcfce7':s.shift==='afternoon'?'#fef3c7':s.shift==='night'?'#e0e7ff':'#f0fdf4',
                            color: s.shift==='morning'?'#15803d':s.shift==='afternoon'?'#92400e':s.shift==='night'?'#3730a3':'#15803d',
                            display:'flex', alignItems:'center', gap:3 }}>
                            <span>{s.shift==='morning'?'🌅':s.shift==='afternoon'?'🌇':s.shift==='night'?'🌙':'☀️'}</span>
                            {s.department||s.task||s.shift}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {/* Room Modal */}
      <AnimatePresence>
        {showRoomModal && (
          <div onClick={e=>{if(e.target===e.currentTarget)setShowRoomModal(false)}} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:16 }}>
            <motion.div initial={{ opacity:0,y:20,scale:.96 }} animate={{ opacity:1,y:0,scale:1 }} exit={{ opacity:0,y:20,scale:.96 }}
              style={{ background:'#fff',borderRadius:20,padding:'28px',width:'100%',maxWidth:480,boxShadow:'0 24px 60px rgba(0,0,0,.2)' }}>
              <h3 style={{ fontSize:18,fontWeight:800,color:'#0f172a',marginBottom:20 }}>{editRoom?'✏️ Edit Room':'🏥 Add New Room'}</h3>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {[['Room Name','name','text'],['Room Number','number','text']].map(([l,k,t]) => (
                  <div key={k}><label style={{ display:'block',fontSize:11,fontWeight:700,color:'#374151',marginBottom:5,letterSpacing:.4,textTransform:'uppercase' }}>{l}</label>
                  <input type={t} value={roomForm[k]} onChange={e=>setRoomForm(f=>({...f,[k]:e.target.value}))} style={{ width:'100%',padding:'10px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontFamily:'inherit',fontSize:13.5,outline:'none',boxSizing:'border-box' }} /></div>
                ))}
                <div><label style={{ display:'block',fontSize:11,fontWeight:700,color:'#374151',marginBottom:5,letterSpacing:.4,textTransform:'uppercase' }}>Type</label>
                <select value={roomForm.type} onChange={e=>setRoomForm(f=>({...f,type:e.target.value}))} style={{ width:'100%',padding:'10px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontFamily:'inherit',fontSize:13.5,outline:'none',background:'#fff',boxSizing:'border-box' }}>
                  {Object.keys(TYPE_CFG).map(t=><option key={t}>{t}</option>)}</select></div>
                <div><label style={{ display:'block',fontSize:11,fontWeight:700,color:'#374151',marginBottom:5,letterSpacing:.4,textTransform:'uppercase' }}>Capacity (Beds)</label>
                <input type="number" value={roomForm.capacity} onChange={e=>setRoomForm(f=>({...f,capacity:e.target.value}))} style={{ width:'100%',padding:'10px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontFamily:'inherit',fontSize:13.5,outline:'none',boxSizing:'border-box' }} /></div>
                <div style={{ gridColumn:'1/-1' }}><label style={{ display:'block',fontSize:11,fontWeight:700,color:'#374151',marginBottom:5,letterSpacing:.4,textTransform:'uppercase' }}>Equipment (comma-separated)</label>
                <input type="text" value={roomForm.equipment} onChange={e=>setRoomForm(f=>({...f,equipment:e.target.value}))} placeholder="Ventilator, ECG Machine, Defibrillator" style={{ width:'100%',padding:'10px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontFamily:'inherit',fontSize:13.5,outline:'none',boxSizing:'border-box' }} /></div>
                <div style={{ gridColumn:'1/-1' }}><label style={{ display:'block',fontSize:11,fontWeight:700,color:'#374151',marginBottom:5,letterSpacing:.4,textTransform:'uppercase' }}>Notes</label>
                <textarea value={roomForm.notes} onChange={e=>setRoomForm(f=>({...f,notes:e.target.value}))} rows={2} style={{ width:'100%',padding:'10px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontFamily:'inherit',fontSize:13.5,outline:'none',resize:'none',boxSizing:'border-box' }} /></div>
              </div>
              <div style={{ display:'flex',gap:10,marginTop:20 }}>
                <button onClick={()=>{setShowRoomModal(false);setEditRoom(null);}} style={{ flex:1,padding:'11px',borderRadius:12,border:'1.5px solid #e2e8f0',background:'#fff',fontFamily:'inherit',fontWeight:700,cursor:'pointer' }}>Cancel</button>
                <button onClick={handleSaveRoom} disabled={saving} style={{ flex:2,padding:'11px',borderRadius:12,border:'none',background:'#2563eb',color:'#fff',fontFamily:'inherit',fontWeight:700,cursor:'pointer' }}>{saving?'Saving…':'💾 Save Room'}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Schedule Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <div onClick={e=>{if(e.target===e.currentTarget)setShowScheduleModal(false)}} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:16 }}>
            <motion.div initial={{ opacity:0,y:20,scale:.96 }} animate={{ opacity:1,y:0,scale:1 }} exit={{ opacity:0,y:20,scale:.96 }}
              style={{ background:'#fff',borderRadius:20,padding:'28px',width:'100%',maxWidth:460,boxShadow:'0 24px 60px rgba(0,0,0,.2)' }}>
              <h3 style={{ fontSize:18,fontWeight:800,color:'#0f172a',marginBottom:20 }}>📆 Add Staff Schedule</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                <div><label style={{ display:'block',fontSize:11,fontWeight:700,color:'#374151',marginBottom:5,letterSpacing:.4,textTransform:'uppercase' }}>Staff Member</label>
                <select value={scheduleForm.user} onChange={e=>setScheduleForm(f=>({...f,user:e.target.value}))} style={{ width:'100%',padding:'10px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontFamily:'inherit',fontSize:13.5,outline:'none',background:'#fff',boxSizing:'border-box' }}>
                  <option value="">Select staff…</option>
                  {allUsers.filter(u=>u.role!=='patient').map(u=><option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
                </select></div>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
                  <div><label style={{ display:'block',fontSize:11,fontWeight:700,color:'#374151',marginBottom:5,letterSpacing:.4,textTransform:'uppercase' }}>Date</label>
                  <input type="date" value={scheduleForm.date} onChange={e=>setScheduleForm(f=>({...f,date:e.target.value}))} style={{ width:'100%',padding:'10px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontFamily:'inherit',fontSize:13.5,outline:'none',boxSizing:'border-box' }} /></div>
                  <div><label style={{ display:'block',fontSize:11,fontWeight:700,color:'#374151',marginBottom:5,letterSpacing:.4,textTransform:'uppercase' }}>Shift</label>
                  <select value={scheduleForm.shift} onChange={e=>setScheduleForm(f=>({...f,shift:e.target.value}))} style={{ width:'100%',padding:'10px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontFamily:'inherit',fontSize:13.5,outline:'none',background:'#fff',boxSizing:'border-box' }}>
                    {Object.entries(SHIFTS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
                  </select></div>
                </div>
                {[['Department','department','text','e.g. Cardiology'],['Task','task','text','e.g. ICU monitoring']].map(([l,k,t,p]) => (
                  <div key={k}><label style={{ display:'block',fontSize:11,fontWeight:700,color:'#374151',marginBottom:5,letterSpacing:.4,textTransform:'uppercase' }}>{l}</label>
                  <input type={t} value={scheduleForm[k]} onChange={e=>setScheduleForm(f=>({...f,[k]:e.target.value}))} placeholder={p} style={{ width:'100%',padding:'10px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontFamily:'inherit',fontSize:13.5,outline:'none',boxSizing:'border-box' }} /></div>
                ))}
              </div>
              <div style={{ display:'flex',gap:10,marginTop:20 }}>
                <button onClick={()=>setShowScheduleModal(false)} style={{ flex:1,padding:'11px',borderRadius:12,border:'1.5px solid #e2e8f0',background:'#fff',fontFamily:'inherit',fontWeight:700,cursor:'pointer' }}>Cancel</button>
                <button onClick={handleSaveSchedule} disabled={saving} style={{ flex:2,padding:'11px',borderRadius:12,border:'none',background:'#059669',color:'#fff',fontFamily:'inherit',fontWeight:700,cursor:'pointer' }}>{saving?'Saving…':'📆 Add Schedule'}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
