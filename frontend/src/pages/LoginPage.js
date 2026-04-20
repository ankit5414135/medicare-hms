// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { useAuth } from '../context/AuthContext';

// const ROLES = [
//   { key: 'admin',      label: 'Admin',      email: 'admin@medicare.com',   hint: 'Full system access' },
//   { key: 'doctor',     label: 'Doctor',     email: 'doctor@medicare.com',  hint: 'Clinical management' },
//   { key: 'patient',    label: 'Patient',    email: 'patient@medicare.com', hint: 'Health & appointments' },
//   { key: 'nurse',      label: 'Nurse',      email: 'nurse@medicare.com',   hint: 'Ward management' },
//   { key: 'pharmacist', label: 'Pharmacist', email: 'pharma@medicare.com',  hint: 'Pharmacy & orders' },
// ];

// export default function LoginPage() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [selectedRole, setSelectedRole] = useState(ROLES[0]);
//   const [form, setForm] = useState({ email: ROLES[0].email, password: 'password123' });
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   const handleRoleSelect = (role) => {
//     setSelectedRole(role);
//     setForm({ email: role.email, password: 'password123' });
//     setErrors({});
//   };

//   const validate = () => {
//     const errs = {};
//     if (!form.email) errs.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
//     if (!form.password) errs.password = 'Password is required';
//     else if (form.password.length < 6) errs.password = 'Min 6 characters';
//     return errs;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const errs = validate();
//     if (Object.keys(errs).length) { setErrors(errs); return; }
//     setLoading(true);
//     const result = await login(form.email, form.password);
//     setLoading(false);
//     if (result.success) navigate('/dashboard');
//   };

//   return (
//     <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0c1f4a 0%,#1a3a7a 40%,#0c4a6e 70%,#0c1f4a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, overflow: 'hidden', position: 'relative' }}>
//       {/* Background blobs */}
//       {['#3b82f6','#0891b2','#7c3aed'].map((c, i) => (
//         <div key={i} style={{ position: 'absolute', borderRadius: '50%', opacity: .06, background: c, width: [500,350,200][i], height: [500,350,200][i], top: ['-80px','auto','40%'][i], left: ['-80px','auto','8%'][i], bottom: i===1?'-60px':'auto', right: i===1?'-60px':'auto' }} />
//       ))}

//       <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
//         style={{ background: 'rgba(255,255,255,.97)', borderRadius: 20, padding: '38px 36px', width: '100%', maxWidth: 420, boxShadow: '0 32px 80px rgba(0,0,0,.35)', position: 'relative' }}
//       >
//         {/* Logo */}
//         <div style={{ textAlign: 'center', marginBottom: 26 }}>
//           <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg,#1648c9,#0891b2)', borderRadius: 16, margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🏥</div>
//           <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a' }}>MediCare HMS</h1>
//           <p style={{ color: '#94a3b8', fontSize: 12.5, marginTop: 3 }}>Hospital Management System · v3.0</p>
//         </div>

//         {/* Role Tabs */}
//         <div style={{ display: 'flex', gap: 3, background: '#f1f5fb', borderRadius: 10, padding: 3, marginBottom: 20 }}>
//           {ROLES.map((role) => (
//             <button key={role.key} onClick={() => handleRoleSelect(role)}
//               style={{ flex: 1, padding: '6px 4px', border: 'none', background: selectedRole.key === role.key ? '#fff' : 'transparent', borderRadius: 7, cursor: 'pointer', fontSize: 11, fontWeight: 700, color: selectedRole.key === role.key ? '#1648c9' : '#94a3b8', transition: 'all .18s', boxShadow: selectedRole.key === role.key ? '0 1px 4px rgba(0,0,0,.1)' : 'none' }}
//             >{role.label}</button>
//           ))}
//         </div>

//         {/* Demo hint */}
//         <div style={{ background: '#f0f4ff', borderRadius: 8, padding: '8px 12px', marginBottom: 18, fontSize: 12, color: '#1e40af', display: 'flex', alignItems: 'center', gap: 6 }}>
//           <span>💡</span>
//           <span><strong>{selectedRole.label}:</strong> {selectedRole.hint}</span>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label className="form-label">Email Address</label>
//             <input className={`form-input${errors.email ? ' error' : ''}`} type="email" value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }} placeholder="Enter your email" />
//             {errors.email && <div className="error-text">{errors.email}</div>}
//           </div>
//           <div className="form-group">
//             <label className="form-label">Password</label>
//             <input className={`form-input${errors.password ? ' error' : ''}`} type="password" value={form.password} onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })); }} placeholder="Enter password" />
//             {errors.password && <div className="error-text">{errors.password}</div>}
//           </div>
//           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
//             <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, cursor: 'pointer' }}>
//               <input type="checkbox" defaultChecked /> Remember me
//             </label>
//             <span style={{ fontSize: 12.5, color: '#1648c9', cursor: 'pointer', fontWeight: 600 }}>Forgot password?</span>
//           </div>
//           <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
//             {loading ? <><span className="spinner-sm" /> Signing in…</> : '🔐 Sign In to HMS'}
//           </button>
//         </form>

//         <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0', fontSize: 11.5, color: '#94a3b8' }}>
//           <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} /> or <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
//         </div>
//         <div style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: '#64748b', border: '1px solid #e2e8f0', textAlign: 'center' }}>
//           All demo passwords: <strong>password123</strong>
//         </div>
//         <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: '#94a3b8' }}>
//           No account? <Link to="/register" style={{ color: '#1648c9', fontWeight: 700, textDecoration: 'none' }}>Register here</Link> · Requires admin approval
//         </div>
//       </motion.div>
//     </div>
//   );
// }


// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
// import { useAuth } from '../context/AuthContext';

// const ROLES = [
//   { key: 'admin',      label: 'Administrator', email: 'admin@medicare.com',   color: '#c084fc', glow: 'rgba(192,132,252,0.4)', icon: '⬡', desc: 'Full system control' },
//   { key: 'doctor',     label: 'Doctor',        email: 'doctor@medicare.com',  color: '#34d399', glow: 'rgba(52,211,153,0.4)',  icon: '⬡', desc: 'Clinical & records' },
//   { key: 'patient',    label: 'Patient',       email: 'patient@medicare.com', color: '#60a5fa', glow: 'rgba(96,165,250,0.4)',  icon: '⬡', desc: 'Health & bookings' },
//   { key: 'nurse',      label: 'Nurse',         email: 'nurse@medicare.com',   color: '#f472b6', glow: 'rgba(244,114,182,0.4)', icon: '⬡', desc: 'Ward management' },
//   { key: 'pharmacist', label: 'Pharmacist',    email: 'pharma@medicare.com',  color: '#fb923c', glow: 'rgba(251,146,60,0.4)',  icon: '⬡', desc: 'Pharmacy & meds' },
// ];

// const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
//   id: i,
//   x: Math.random() * 100,
//   y: Math.random() * 100,
//   size: Math.random() * 3 + 1,
//   duration: Math.random() * 12 + 8,
//   delay: Math.random() * 6,
// }));

// const PULSE_RINGS = [0, 1, 2];

// export default function LoginPage() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [selectedRole, setSelectedRole] = useState(ROLES[0]);
//   const [form, setForm] = useState({ email: ROLES[0].email, password: 'password123' });
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [showPass, setShowPass] = useState(false);
//   const [focused, setFocused] = useState(null);
//   const [loginSuccess, setLoginSuccess] = useState(false);
//   const containerRef = useRef(null);
//   const mouseX = useMotionValue(0);
//   const mouseY = useMotionValue(0);

//   const rotateX = useTransform(mouseY, [-300, 300], [6, -6]);
//   const rotateY = useTransform(mouseX, [-300, 300], [-6, 6]);

//   useEffect(() => {
//     const el = containerRef.current;
//     if (!el) return;
//     const handle = (e) => {
//       const rect = el.getBoundingClientRect();
//       mouseX.set(e.clientX - rect.left - rect.width / 2);
//       mouseY.set(e.clientY - rect.top - rect.height / 2);
//     };
//     el.addEventListener('mousemove', handle);
//     return () => el.removeEventListener('mousemove', handle);
//   }, [mouseX, mouseY]);

//   const handleRoleSelect = (role) => {
//     setSelectedRole(role);
//     setForm({ email: role.email, password: 'password123' });
//     setErrors({});
//   };

//   const validate = () => {
//     const errs = {};
//     if (!form.email) errs.email = 'Email required';
//     else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
//     if (!form.password || form.password.length < 6) errs.password = 'Min 6 characters';
//     return errs;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const errs = validate();
//     if (Object.keys(errs).length) { setErrors(errs); return; }
//     setLoading(true);
//     const result = await login(form.email, form.password);
//     if (result.success) {
//       setLoginSuccess(true);
//       setTimeout(() => navigate('/dashboard'), 900);
//     }
//     setLoading(false);
//   };

//   const ac = selectedRole.color;

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: '#030712',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
//       overflow: 'hidden',
//       position: 'relative',
//     }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
//         @keyframes floatUp {
//           0% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
//           50% { opacity: 0.8; }
//           100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
//         }
//         @keyframes pulseRing {
//           0% { transform: scale(0.8); opacity: 0.6; }
//           100% { transform: scale(2.2); opacity: 0; }
//         }
//         @keyframes scanLine {
//           0% { top: -2px; }
//           100% { top: 100%; }
//         }
//         @keyframes blink {
//           0%, 100% { opacity: 1; } 50% { opacity: 0; }
//         }
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes shimmer {
//           0% { background-position: -200% 0; }
//           100% { background-position: 200% 0; }
//         }
//         @keyframes gradientShift {
//           0%, 100% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//         }
//         .field-input {
//           width: 100%;
//           background: rgba(255,255,255,0.04);
//           border: 1.5px solid rgba(255,255,255,0.1);
//           border-radius: 14px;
//           padding: 14px 16px 14px 44px;
//           color: #fff;
//           font-size: 14px;
//           font-family: 'DM Sans', sans-serif;
//           outline: none;
//           transition: all 0.25s ease;
//           box-sizing: border-box;
//         }
//         .field-input::placeholder { color: rgba(255,255,255,0.25); }
//         .field-input:focus { border-color: var(--ac); box-shadow: 0 0 0 3px var(--ac-glow); background: rgba(255,255,255,0.07); }
//         .role-btn {
//           flex: 1;
//           padding: 10px 6px;
//           border-radius: 12px;
//           border: 1.5px solid rgba(255,255,255,0.08);
//           background: rgba(255,255,255,0.03);
//           color: rgba(255,255,255,0.4);
//           cursor: pointer;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 11px;
//           font-weight: 600;
//           transition: all 0.2s ease;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 5px;
//         }
//         .role-btn:hover { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.7); }
//         .role-btn.active { border-color: var(--ac) !important; background: var(--ac-bg) !important; color: var(--ac) !important; box-shadow: 0 0 14px var(--ac-glow); }
//         .submit-btn {
//           width: 100%;
//           padding: 15px;
//           border: none;
//           border-radius: 14px;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 15px;
//           font-weight: 700;
//           cursor: pointer;
//           position: relative;
//           overflow: hidden;
//           transition: all 0.2s ease;
//           letter-spacing: 0.3px;
//         }
//         .submit-btn:hover { transform: translateY(-1px); }
//         .submit-btn:active { transform: translateY(0); }
//         .submit-btn::before {
//           content: '';
//           position: absolute;
//           inset: 0;
//           background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
//           transform: translateX(-100%);
//           transition: transform 0.5s ease;
//         }
//         .submit-btn:hover::before { transform: translateX(100%); }
//         ::-webkit-scrollbar { display: none; }
//       `}</style>

//       {/* ── Ambient background gradients ── */}
//       <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
//         <motion.div
//           animate={{ opacity: [0.12, 0.2, 0.12] }}
//           transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
//           style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%', borderRadius: '50%', background: `radial-gradient(circle, ${ac} 0%, transparent 70%)`, filter: 'blur(80px)' }}
//         />
//         <motion.div
//           animate={{ opacity: [0.08, 0.15, 0.08] }}
//           transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
//           style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '55%', height: '55%', borderRadius: '50%', background: `radial-gradient(circle, ${ac} 0%, transparent 70%)`, filter: 'blur(100px)' }}
//         />
//         <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
//       </div>

//       {/* ── Floating particles ── */}
//       <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
//         {PARTICLES.map(p => (
//           <div key={p.id} style={{
//             position: 'absolute',
//             left: `${p.x}%`,
//             bottom: '-10px',
//             width: p.size,
//             height: p.size,
//             borderRadius: '50%',
//             background: ac,
//             animation: `floatUp ${p.duration}s ${p.delay}s linear infinite`,
//             opacity: 0,
//           }} />
//         ))}
//       </div>

//       {/* ── Branding top-left ── */}
//       <motion.div
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ delay: 0.2 }}
//         style={{ position: 'fixed', top: 28, left: 36, display: 'flex', alignItems: 'center', gap: 10, zIndex: 10 }}
//       >
//         <div style={{ position: 'relative', width: 38, height: 38 }}>
//           {PULSE_RINGS.map(i => (
//             <div key={i} style={{
//               position: 'absolute', inset: 0, borderRadius: '50%',
//               border: `1.5px solid ${ac}`,
//               animation: `pulseRing 2.5s ${i * 0.8}s ease-out infinite`,
//             }} />
//           ))}
//           <div style={{ position: 'relative', width: 38, height: 38, borderRadius: '50%', background: `linear-gradient(135deg, ${ac}, #030712)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, zIndex: 1, border: `1px solid ${ac}` }}>
//             ✚
//           </div>
//         </div>
//         <div>
//           <div style={{ color: '#fff', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: 1, lineHeight: 1 }}>MEDICARE</div>
//           <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' }}>Hospital System · v3.0</div>
//         </div>
//       </motion.div>

//       {/* ── System status top-right ── */}
//       <motion.div
//         initial={{ opacity: 0, x: 20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ delay: 0.3 }}
//         style={{ position: 'fixed', top: 28, right: 36, display: 'flex', alignItems: 'center', gap: 16, zIndex: 10 }}
//       >
//         {['LIVE', 'HIPAA', 'AES-256'].map((tag, i) => (
//           <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: 1 }}>
//             <div style={{ width: 5, height: 5, borderRadius: '50%', background: i === 0 ? '#34d399' : 'rgba(255,255,255,0.2)', ...(i === 0 ? { animation: 'blink 1.8s ease-in-out infinite' } : {}) }} />
//             {tag}
//           </div>
//         ))}
//       </motion.div>

//       {/* ── Main card with 3D tilt ── */}
//       <motion.div
//         ref={containerRef}
//         style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1200, position: 'relative', zIndex: 10 }}
//         initial={{ opacity: 0, y: 40, scale: 0.95 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
//       >
//         <div style={{
//           width: 420,
//           background: 'rgba(10,15,30,0.85)',
//           backdropFilter: 'blur(32px)',
//           borderRadius: 28,
//           border: `1px solid rgba(255,255,255,0.08)`,
//           boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.7), 0 0 60px ${selectedRole.glow}`,
//           overflow: 'hidden',
//           position: 'relative',
//           '--ac': ac,
//           '--ac-glow': selectedRole.glow,
//           '--ac-bg': `${ac}18`,
//         }}>

//           {/* Scan line effect */}
//           <div style={{ position: 'absolute', left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${ac}, transparent)`, opacity: 0.3, animation: 'scanLine 4s linear infinite', zIndex: 5, pointerEvents: 'none' }} />

//           {/* Top shimmer bar */}
//           <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${ac}, ${ac}, transparent)`, backgroundSize: '200% 100%', animation: 'shimmer 3s ease-in-out infinite' }} />

//           <div style={{ padding: '32px 32px 28px' }}>

//             {/* Header */}
//             <div style={{ marginBottom: 28 }}>
//               <motion.div
//                 key={selectedRole.key + '-header'}
//                 initial={{ opacity: 0, y: -8 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
//                   <div>
//                     <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: '#fff', margin: 0, letterSpacing: -0.5, lineHeight: 1.15 }}>
//                       Access Portal
//                     </h1>
//                     <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: '6px 0 0', fontWeight: 400 }}>
//                       Authenticated entry to MediCare HMS
//                     </p>
//                   </div>
//                   {/* Role badge */}
//                   <motion.div
//                     key={selectedRole.key}
//                     initial={{ scale: 0.8, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${ac}40`, background: `${ac}15`, color: ac, fontSize: 11, fontWeight: 700, letterSpacing: 0.5, whiteSpace: 'nowrap' }}
//                   >
//                     {selectedRole.label}
//                   </motion.div>
//                 </div>
//               </motion.div>

//               {/* Decorative line */}
//               <motion.div
//                 style={{ height: 1, background: `linear-gradient(90deg, ${ac}, transparent)`, marginTop: 16, originX: 0 }}
//                 initial={{ scaleX: 0 }}
//                 animate={{ scaleX: 1 }}
//                 transition={{ delay: 0.4, duration: 0.6 }}
//               />
//             </div>

//             {/* Role selector */}
//             <div style={{ marginBottom: 22 }}>
//               <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10, fontWeight: 600 }}>Select role</div>
//               <div style={{ display: 'flex', gap: 6 }}>
//                 {ROLES.map(role => (
//                   <button
//                     key={role.key}
//                     onClick={() => handleRoleSelect(role)}
//                     className={`role-btn${selectedRole.key === role.key ? ' active' : ''}`}
//                     style={{ '--ac': role.color, '--ac-glow': role.glow, '--ac-bg': `${role.color}18` }}
//                   >
//                     <div style={{ width: 26, height: 26, borderRadius: 8, background: selectedRole.key === role.key ? `${role.color}25` : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, transition: 'all 0.2s' }}>
//                       {role.key === 'admin' ? '🛡' : role.key === 'doctor' ? '⚕' : role.key === 'patient' ? '♡' : role.key === 'nurse' ? '✚' : '⊕'}
//                     </div>
//                     {role.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Animated role description */}
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={selectedRole.key + '-desc'}
//                 initial={{ opacity: 0, height: 0, marginBottom: 0 }}
//                 animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
//                 exit={{ opacity: 0, height: 0, marginBottom: 0 }}
//                 transition={{ duration: 0.25 }}
//                 style={{ overflow: 'hidden' }}
//               >
//                 <div style={{ padding: '10px 14px', borderRadius: 12, background: `${ac}10`, border: `1px solid ${ac}25`, display: 'flex', alignItems: 'center', gap: 10 }}>
//                   <div style={{ width: 6, height: 6, borderRadius: '50%', background: ac, flexShrink: 0, boxShadow: `0 0 8px ${ac}` }} />
//                   <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
//                     Signing in as <strong style={{ color: ac }}>{selectedRole.label}</strong> — {selectedRole.desc}. Demo password: <code style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: 4, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>password123</code>
//                   </span>
//                 </div>
//               </motion.div>
//             </AnimatePresence>

//             {/* Form */}
//             <form onSubmit={handleSubmit}>
//               {/* Email field */}
//               <div style={{ marginBottom: 14 }}>
//                 <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 7 }}>Email</label>
//                 <div style={{ position: 'relative' }}>
//                   <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, opacity: 0.4, pointerEvents: 'none' }}>✉</span>
//                   <input
//                     className="field-input"
//                     style={{ '--ac': ac, '--ac-glow': selectedRole.glow, borderColor: errors.email ? '#f87171' : focused === 'email' ? ac : 'rgba(255,255,255,0.1)' }}
//                     type="email"
//                     value={form.email}
//                     onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }}
//                     onFocus={() => setFocused('email')}
//                     onBlur={() => setFocused(null)}
//                     placeholder="you@hospital.com"
//                   />
//                 </div>
//                 {errors.email && <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 11, color: '#f87171', marginTop: 5 }}>{errors.email}</motion.div>}
//               </div>

//               {/* Password field */}
//               <div style={{ marginBottom: 18 }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
//                   <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>Password</label>
//                   <span style={{ fontSize: 11, color: ac, cursor: 'pointer', fontWeight: 500, opacity: 0.8 }}>Forgot?</span>
//                 </div>
//                 <div style={{ position: 'relative' }}>
//                   <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, opacity: 0.4, pointerEvents: 'none' }}>⚿</span>
//                   <input
//                     className="field-input"
//                     style={{ '--ac': ac, '--ac-glow': selectedRole.glow, borderColor: errors.password ? '#f87171' : focused === 'pass' ? ac : 'rgba(255,255,255,0.1)', paddingRight: 44 }}
//                     type={showPass ? 'text' : 'password'}
//                     value={form.password}
//                     onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })); }}
//                     onFocus={() => setFocused('pass')}
//                     onBlur={() => setFocused(null)}
//                     placeholder="••••••••"
//                   />
//                   <button type="button" onClick={() => setShowPass(p => !p)}
//                     style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'rgba(255,255,255,0.3)', padding: 4, transition: 'color 0.2s' }}
//                     onMouseEnter={e => e.currentTarget.style.color = ac}
//                     onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
//                   >
//                     {showPass ? '◎' : '◉'}
//                   </button>
//                 </div>
//                 {errors.password && <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 11, color: '#f87171', marginTop: 5 }}>{errors.password}</motion.div>}
//               </div>

//               {/* Submit button */}
//               <AnimatePresence mode="wait">
//                 {loginSuccess ? (
//                   <motion.div key="success"
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     style={{ width: '100%', padding: '15px', borderRadius: 14, background: 'linear-gradient(135deg, #059669, #34d399)', color: '#fff', textAlign: 'center', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
//                   >
//                     <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}>✓</motion.span>
//                     Access Granted — Redirecting…
//                   </motion.div>
//                 ) : (
//                   <motion.button key="submit"
//                     type="submit"
//                     disabled={loading}
//                     className="submit-btn"
//                     whileTap={{ scale: 0.97 }}
//                     style={{
//                       background: loading ? 'rgba(255,255,255,0.05)' : `linear-gradient(135deg, ${ac}dd, ${ac}88)`,
//                       color: loading ? 'rgba(255,255,255,0.4)' : '#fff',
//                       boxShadow: loading ? 'none' : `0 8px 28px ${selectedRole.glow}`,
//                     }}
//                   >
//                     {loading ? (
//                       <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
//                         <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.15)', borderTopColor: ac, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
//                         Authenticating…
//                       </span>
//                     ) : (
//                       <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
//                         Authenticate & Enter
//                         <motion.span animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
//                       </span>
//                     )}
//                   </motion.button>
//                 )}
//               </AnimatePresence>
//             </form>

//             {/* Footer */}
//             <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//               <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
//                 No account?{' '}
//                 <Link to="/register" style={{ color: ac, fontWeight: 600, textDecoration: 'none', opacity: 0.9 }}>
//                   Register →
//                 </Link>
//               </div>
//               <div style={{ display: 'flex', gap: 6 }}>
//                 {['🔒', '🛡', '✅'].map((icon, i) => (
//                   <div key={i} style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
//                     {icon}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Bottom color strip */}
//           <motion.div
//             key={selectedRole.key + '-strip'}
//             initial={{ scaleX: 0 }}
//             animate={{ scaleX: 1 }}
//             transition={{ duration: 0.5 }}
//             style={{ height: 3, background: `linear-gradient(90deg, transparent, ${ac}, transparent)`, originX: 0.5 }}
//           />
//         </div>
//       </motion.div>

//       {/* Bottom copyright */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 1 }}
//         style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', fontSize: 11, color: 'rgba(255,255,255,0.15)', letterSpacing: 1, whiteSpace: 'nowrap', zIndex: 10 }}
//       >
//         MEDICARE HMS · SECURE ACCESS · ALL RIGHTS RESERVED
//       </motion.div>
//     </div>
//   );
// }

// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAuth } from '../context/AuthContext';

// /* ─── Role definitions — NO auto-fill of credentials ─── */
// const ROLES = [
//   { key:'admin',      label:'Admin',       icon:'🛡️', color:'#2563eb', light:'#eff6ff', border:'#bfdbfe', desc:'Full system administration & oversight' },
//   { key:'doctor',     label:'Doctor',      icon:'⚕️',  color:'#0891b2', light:'#ecfeff', border:'#a5f3fc', desc:'Patient care, records & prescriptions' },
//   { key:'patient',    label:'Patient',     icon:'🧑‍⚕️', color:'#7c3aed', light:'#f5f3ff', border:'#ddd6fe', desc:'Appointments, health records & reports' },
//   { key:'nurse',      label:'Nurse',       icon:'💉',  color:'#be185d', light:'#fdf2f8', border:'#fbcfe8', desc:'Ward management & patient monitoring' },
//   { key:'pharmacist', label:'Pharmacist',  icon:'💊',  color:'#d97706', light:'#fffbeb', border:'#fde68a', desc:'Medications, inventory & prescriptions' },
// ];

// const FEATURES = [
//   { icon:'📋', title:'Electronic Health Records',    desc:'Complete patient histories, lab reports & diagnostic records with role-based access.' },
//   { icon:'📅', title:'Smart Appointment System',     desc:'Online booking with automated reminders. Reduces no-shows by up to 40%.' },
//   { icon:'💊', title:'Pharmacy Management',          desc:'Inventory tracking, prescriptions & low-stock alerts.' },
//   { icon:'🚨', title:'Emergency Alert System',       desc:'Real-time SOS alerts with geolocation & instant staff notification.' },
//   { icon:'📊', title:'Analytics & Reports',          desc:'Live dashboards — patient flow, revenue, performance & KPIs.' },
//   { icon:'🔒', title:'Role-Based Access Control',    desc:'Granular permissions with full audit trail compliance.' },
//   { icon:'💬', title:'Real-Time Notifications',      desc:'Socket-based alerts for appointments, lab results & critical events.' },
//   { icon:'🧪', title:'Lab & Diagnostics',            desc:'Upload and manage X-rays, MRIs, CT scans & ECGs directly in patient records.' },
//   { icon:'🏥', title:'Multi-Department Management',  desc:'Cardiology, Neurology, Pediatrics, Surgery and more — all from one hub.' },
//   { icon:'⏰', title:'Medication Reminders',         desc:'Automated push reminders with adherence tracking & compliance reports.' },
//   { icon:'📱', title:'Mobile Ready',                 desc:'Fully responsive — works on tablets and mobile for on-call staff.' },
//   { icon:'🌐', title:'HIPAA-Aligned Security',       desc:'JWT auth, encrypted transfers & session management for healthcare data.' },
// ];

// const STATS = [
//   { val:'50,000+', label:'Patients Served' },
//   { val:'1,200+',  label:'Doctors Registered' },
//   { val:'99.9%',   label:'System Uptime' },
//   { val:'24 / 7',  label:'Support Available' },
// ];

// const SOCIALS = [
//   { platform:'Facebook',  url:'https://facebook.com/medicarehms',  icon:'f',  bg:'#1877f2' },
//   { platform:'Twitter',   url:'https://twitter.com/medicarehms',   icon:'𝕏',  bg:'#000' },
//   { platform:'LinkedIn',  url:'https://linkedin.com/company/medicarehms', icon:'in', bg:'#0a66c2' },
//   { platform:'Instagram', url:'https://instagram.com/medicarehms', icon:'▣',  bg:'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' },
//   { platform:'YouTube',   url:'https://youtube.com/@medicarehms',  icon:'▶',  bg:'#ff0000' },
// ];

// export default function LoginPage() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [activeRole, setActiveRole] = useState(ROLES[0]);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPass, setShowPass] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [success, setSuccess] = useState(false);
//   const [featIdx, setFeatIdx] = useState(0);
//   const [supportOpen, setSupportOpen] = useState(false);
//   const [supportMsg, setSupportMsg] = useState('');
//   const [supportSent, setSupportSent] = useState(false);
//   const featureRef = useRef(null);
//   const autoScrollRef = useRef(null);

//   /* Auto-rotate features */
//   useEffect(() => {
//     const id = setInterval(() => setFeatIdx(i => (i + 1) % FEATURES.length), 3500);
//     return () => clearInterval(id);
//   }, []);

//   /* Auto-scroll feature list */
//   useEffect(() => {
//     const el = featureRef.current;
//     if (!el) return;
//     let raf;
//     const scroll = () => { el.scrollTop += 0.5; if (el.scrollTop + el.clientHeight >= el.scrollHeight - 4) el.scrollTop = 0; raf = requestAnimationFrame(scroll); };
//     raf = requestAnimationFrame(scroll);
//     return () => cancelAnimationFrame(raf);
//   }, []);

//   const validate = () => {
//     const e = {};
//     if (!email.trim()) e.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
//     if (!password) e.password = 'Password is required';
//     else if (password.length < 6) e.password = 'Minimum 6 characters';
//     return e;
//   };

//   const handleSubmit = async (ev) => {
//     ev.preventDefault();
//     const e = validate();
//     if (Object.keys(e).length) { setErrors(e); return; }
//     setLoading(true);
//     const res = await login(email, password);
//     setLoading(false);
//     if (res.success) { setSuccess(true); setTimeout(() => navigate('/dashboard'), 1000); }
//     else setErrors({ general: res.error || 'Invalid credentials. Please try again.' });
//   };

//   const handleSupportSend = () => {
//     if (!supportMsg.trim()) return;
//     setSupportSent(true);
//     setTimeout(() => { setSupportOpen(false); setSupportSent(false); setSupportMsg(''); }, 2500);
//   };

//   const ac = activeRole.color;

//   return (
//     <div style={{ minHeight:'100vh', display:'flex', fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", background:'#f0f4f8', overflow:'hidden', position:'relative' }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,wght@0,700;0,900;1,700&display=swap');
//         *{box-sizing:border-box;margin:0;padding:0;}
//         ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:rgba(0,0,0,.12);border-radius:4px;}
//         @keyframes spin{to{transform:rotate(360deg)}}
//         @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
//         @keyframes fadeIn{from{opacity:0}to{opacity:1}}
//         @keyframes pulse2{0%,100%{box-shadow:0 0 0 0 ${ac}40}50%{box-shadow:0 0 0 8px transparent}}
//         @keyframes heartbeat{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
//         @keyframes scan{0%{top:0}100%{top:100%}}
//         @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
//         .inp{width:100%;background:#fff;border:1.5px solid #e2e8f0;border-radius:12px;padding:12px 14px 12px 42px;font-family:inherit;font-size:14px;color:#0f172a;outline:none;transition:border-color .2s,box-shadow .2s;}
//         .inp:focus{border-color:${ac};box-shadow:0 0 0 3px ${ac}20;}
//         .inp::placeholder{color:#94a3b8;}
//         .inp.err{border-color:#ef4444;box-shadow:0 0 0 3px #ef444420;}
//         .role-pill{padding:8px 14px;border-radius:50px;border:1.5px solid #e2e8f0;background:#fff;font-family:inherit;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:6px;color:#64748b;white-space:nowrap;}
//         .role-pill:hover{border-color:#cbd5e1;background:#f8fafc;}
//         .role-pill.active{color:${ac};border-color:${ac};background:${activeRole.light};box-shadow:0 0 0 3px ${ac}18;}
//         .feat-card{background:#fff;border:1px solid #e8edf3;border-radius:14px;padding:14px 16px;display:flex;gap:12px;align-items:flex-start;transition:all .2s;cursor:default;}
//         .feat-card:hover{border-color:${ac}50;box-shadow:0 4px 16px rgba(0,0,0,.07);}
//         .submit-btn{width:100%;padding:14px;border:none;border-radius:13px;font-family:inherit;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s;letter-spacing:.2px;position:relative;overflow:hidden;}
//         .submit-btn::after{content:'';position:absolute;inset:0;background:rgba(255,255,255,0);transition:background .2s;}
//         .submit-btn:hover::after{background:rgba(255,255,255,.1);}
//         .submit-btn:active{transform:scale(.99);}
//         .social-btn{width:34px;height:34px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:800;font-family:inherit;transition:transform .2s,box-shadow .2s;}
//         .social-btn:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,.25);}
//         .support-bubble{position:fixed;bottom:28px;right:28px;z-index:999;}
//         .support-trigger{width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 8px 28px rgba(0,0,0,.2);transition:transform .2s;}
//         .support-trigger:hover{transform:scale(1.08);}
//         .support-panel{position:absolute;bottom:70px;right:0;width:300px;background:#fff;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,.18);overflow:hidden;animation:slideUp .3s ease;}
//       `}</style>

//       {/* ══════════════════════════════════════════════
//           LEFT PANEL  — Branding + Features
//       ══════════════════════════════════════════════ */}
//       <div style={{ width:'48%', background:`linear-gradient(160deg, #0a1628 0%, #0d2348 50%, #0a1628 100%)`, display:'flex', flexDirection:'column', position:'relative', overflow:'hidden', flexShrink:0 }}>

//         {/* Background grid */}
//         <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,.025) 1px,transparent 1px)', backgroundSize:'36px 36px', pointerEvents:'none' }} />
//         {/* Glow orbs */}
//         <div style={{ position:'absolute', top:'-15%', left:'-15%', width:'50%', height:'50%', borderRadius:'50%', background:`radial-gradient(circle,${ac}40 0%,transparent 70%)`, filter:'blur(60px)', pointerEvents:'none', transition:'background 0.6s' }} />
//         <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:'40%', height:'40%', borderRadius:'50%', background:`radial-gradient(circle,${ac}30 0%,transparent 70%)`, filter:'blur(80px)', pointerEvents:'none', transition:'background 0.6s' }} />
//         {/* Scan line */}
//         <div style={{ position:'absolute', left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${ac}80,transparent)`, opacity:.5, animation:'scan 5s linear infinite', pointerEvents:'none', zIndex:2 }} />

//         <div style={{ padding:'36px 36px 0', position:'relative', zIndex:3 }}>
//           {/* Logo */}
//           <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:32 }}>
//             <div style={{ width:46, height:46, borderRadius:14, background:`linear-gradient(135deg,${ac},#0ea5e9)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0, boxShadow:`0 8px 24px ${ac}50`, animation:'heartbeat 2s ease-in-out infinite' }}>✚</div>
//             <div>
//               <div style={{ fontFamily:"'Fraunces',serif", color:'#fff', fontWeight:900, fontSize:18, letterSpacing:-.3 }}>MediCare HMS</div>
//               <div style={{ color:'rgba(255,255,255,.35)', fontSize:10, letterSpacing:1.5, textTransform:'uppercase', marginTop:1 }}>Hospital Management System</div>
//             </div>
//           </motion.div>

//           {/* Hero text */}
//           <motion.div initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:.15 }}>
//             <h2 style={{ fontFamily:"'Fraunces',serif", color:'#fff', fontSize:28, fontWeight:900, lineHeight:1.2, marginBottom:10, letterSpacing:-.5 }}>
//               The Complete Platform<br/>
//               <span style={{ background:`linear-gradient(90deg,${ac},#38bdf8)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>for Modern Healthcare</span>
//             </h2>
//             <p style={{ color:'rgba(255,255,255,.45)', fontSize:13, lineHeight:1.65, maxWidth:340, marginBottom:24 }}>
//               Manage your entire hospital — from patient intake to discharge — on one secure, real-time platform trusted by 1,200+ doctors.
//             </p>
//           </motion.div>

//           {/* Stats */}
//           <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.25 }} style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:28 }}>
//             {STATS.map((s,i) => (
//               <div key={i} style={{ background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.08)', borderRadius:12, padding:'10px 6px', textAlign:'center' }}>
//                 <div style={{ color:ac, fontWeight:800, fontSize:14, fontFamily:"'Fraunces',serif", lineHeight:1 }}>{s.val}</div>
//                 <div style={{ color:'rgba(255,255,255,.4)', fontSize:9.5, marginTop:3, letterSpacing:.3 }}>{s.label}</div>
//               </div>
//             ))}
//           </motion.div>

//           <div style={{ fontSize:10, color:'rgba(255,255,255,.25)', letterSpacing:2, textTransform:'uppercase', marginBottom:12, fontWeight:600 }}>Platform Features</div>
//         </div>

//         {/* Scrollable feature list */}
//         <div ref={featureRef} style={{ flex:1, overflowY:'auto', padding:'0 36px', scrollbarWidth:'none', msOverflowStyle:'none', position:'relative', zIndex:3 }}>
//           <div style={{ display:'flex', flexDirection:'column', gap:8, paddingBottom:24 }}>
//             {FEATURES.map((f,i) => (
//               <motion.div key={i} initial={{ opacity:0,x:-10 }} animate={{ opacity:1,x:0 }} transition={{ delay:.3+i*.04 }} className="feat-card"
//                 style={{ borderColor: featIdx===i ? `${ac}60` : undefined, boxShadow: featIdx===i ? `0 4px 20px ${ac}18` : undefined }}>
//                 <div style={{ width:36, height:36, borderRadius:10, background: featIdx===i ? `${ac}20` : '#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, flexShrink:0, transition:'all .3s' }}>{f.icon}</div>
//                 <div>
//                   <div style={{ fontSize:12.5, fontWeight:700, color:'#fff', marginBottom:3 }}>{f.title}</div>
//                   <div style={{ fontSize:11.5, color:'rgba(255,255,255,.4)', lineHeight:1.5 }}>{f.desc}</div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>

//         {/* Bottom gradient fade */}
//         <div style={{ position:'absolute', bottom:0, left:0, right:0, height:40, background:'linear-gradient(to top,#0a1628,transparent)', pointerEvents:'none', zIndex:4 }} />

//         {/* Social links */}
//         <div style={{ padding:'16px 36px 28px', position:'relative', zIndex:5 }}>
//           <div style={{ fontSize:10, color:'rgba(255,255,255,.25)', letterSpacing:2, textTransform:'uppercase', marginBottom:10, fontWeight:600 }}>Follow Us</div>
//           <div style={{ display:'flex', gap:8 }}>
//             {SOCIALS.map(s => (
//               <button key={s.platform} className="social-btn"
//                 style={{ background: s.bg }}
//                 onClick={() => window.open(s.url, '_blank', 'noopener,noreferrer')}
//                 title={`Follow MediCare on ${s.platform}`}
//               >
//                 {s.icon}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ══════════════════════════════════════════════
//           RIGHT PANEL — Login Form
//       ══════════════════════════════════════════════ */}
//       <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'32px 24px', overflowY:'auto', background:'#f0f4f8', position:'relative' }}>

//         {/* Subtle bg pattern */}
//         <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(#cbd5e120 1px,transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} />

//         <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:.55, ease:[.22,1,.36,1] }}
//           style={{ width:'100%', maxWidth:420, position:'relative', zIndex:1 }}>

//           {/* Card */}
//           <div style={{ background:'#fff', borderRadius:24, boxShadow:'0 4px 6px rgba(0,0,0,.04), 0 20px 60px rgba(0,0,0,.10)', border:'1px solid #e8edf3', overflow:'hidden' }}>

//             {/* Top accent bar */}
//             <motion.div key={ac} initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ duration:.5 }}
//               style={{ height:4, background:`linear-gradient(90deg, ${ac}, #38bdf8)`, originX:0 }} />

//             <div style={{ padding:'28px 28px 24px' }}>

//               {/* Header */}
//               <div style={{ marginBottom:22 }}>
//                 <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
//                   <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:900, color:'#0f172a', letterSpacing:-.4 }}>Welcome Back</h1>
//                   {/* Live status badge */}
//                   <div style={{ display:'flex', alignItems:'center', gap:5, background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:20, padding:'4px 10px' }}>
//                     <div style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', animation:'heartbeat 1.5s ease-in-out infinite' }} />
//                     <span style={{ fontSize:10, color:'#15803d', fontWeight:700, letterSpacing:.5 }}>SYSTEM LIVE</span>
//                   </div>
//                 </div>
//                 <p style={{ color:'#94a3b8', fontSize:13 }}>Sign in to MediCare HMS. All sessions are encrypted and audited.</p>
//               </div>

//               {/* Role selector */}
//               <div style={{ marginBottom:20 }}>
//                 <div style={{ fontSize:10.5, color:'#94a3b8', fontWeight:700, letterSpacing:1, textTransform:'uppercase', marginBottom:9 }}>Select Your Role</div>
//                 <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
//                   {ROLES.map(r => (
//                     <button key={r.key} className={`role-pill${activeRole.key===r.key?' active':''}`}
//                       style={{ '--ac':r.color }}
//                       onClick={() => { setActiveRole(r); setErrors({}); setEmail(''); setPassword(''); }}
//                     >
//                       <span>{r.icon}</span>{r.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Role description */}
//               <AnimatePresence mode="wait">
//                 <motion.div key={activeRole.key} initial={{ opacity:0,y:-6 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
//                   style={{ background:activeRole.light, border:`1px solid ${activeRole.border}`, borderRadius:12, padding:'10px 14px', marginBottom:20, display:'flex', alignItems:'center', gap:10 }}>
//                   <span style={{ fontSize:20 }}>{activeRole.icon}</span>
//                   <div>
//                     <div style={{ fontSize:12, fontWeight:700, color:activeRole.color }}>{activeRole.label} Portal</div>
//                     <div style={{ fontSize:11.5, color:'#64748b' }}>{activeRole.desc}</div>
//                   </div>
//                 </motion.div>
//               </AnimatePresence>

//               {/* General error */}
//               {errors.general && (
//                 <motion.div initial={{ opacity:0,y:-4 }} animate={{ opacity:1,y:0 }}
//                   style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, padding:'10px 14px', marginBottom:16, fontSize:13, color:'#dc2626', display:'flex', alignItems:'center', gap:8 }}>
//                   ⚠️ {errors.general}
//                 </motion.div>
//               )}

//               {/* Form */}
//               <form onSubmit={handleSubmit} autoComplete="off">
//                 {/* Email */}
//                 <div style={{ marginBottom:14 }}>
//                   <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#374151', letterSpacing:.5, textTransform:'uppercase', marginBottom:6 }}>Email Address</label>
//                   <div style={{ position:'relative' }}>
//                     <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', fontSize:15, pointerEvents:'none', opacity:.45 }}>✉</span>
//                     <input className={`inp${errors.email?' err':''}`} type="email" autoComplete="new-email" name="hms-email"
//                       placeholder="Enter your email address"
//                       value={email} onChange={e => { setEmail(e.target.value); setErrors(er => ({...er,email:''})); }} />
//                   </div>
//                   {errors.email && <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ fontSize:11, color:'#ef4444', marginTop:4 }}>{errors.email}</motion.div>}
//                 </div>

//                 {/* Password */}
//                 <div style={{ marginBottom:16 }}>
//                   <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
//                     <label style={{ fontSize:11, fontWeight:700, color:'#374151', letterSpacing:.5, textTransform:'uppercase' }}>Password</label>
//                     <span style={{ fontSize:12, color:ac, cursor:'pointer', fontWeight:600 }}>Forgot password?</span>
//                   </div>
//                   <div style={{ position:'relative' }}>
//                     <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', fontSize:15, pointerEvents:'none', opacity:.45 }}>🔑</span>
//                     <input className={`inp${errors.password?' err':''}`} type={showPass?'text':'password'} autoComplete="new-password" name="hms-pass"
//                       placeholder="Enter your password"
//                       style={{ paddingRight:44 }}
//                       value={password} onChange={e => { setPassword(e.target.value); setErrors(er => ({...er,password:''})); }} />
//                     <button type="button" onClick={() => setShowPass(p=>!p)}
//                       style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:13, color:'#94a3b8', padding:4 }}>
//                       {showPass ? '🙈' : '👁️'}
//                     </button>
//                   </div>
//                   {errors.password && <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ fontSize:11, color:'#ef4444', marginTop:4 }}>{errors.password}</motion.div>}
//                 </div>

//                 {/* Submit */}
//                 <AnimatePresence mode="wait">
//                   {success ? (
//                     <motion.div key="ok" initial={{ opacity:0,scale:.95 }} animate={{ opacity:1,scale:1 }}
//                       style={{ padding:'14px', borderRadius:13, background:'linear-gradient(135deg,#059669,#34d399)', color:'#fff', fontWeight:700, fontSize:15, textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
//                       ✅ Access Granted — Loading Dashboard…
//                     </motion.div>
//                   ) : (
//                     <motion.button key="btn" type="submit" disabled={loading} className="submit-btn" whileTap={{ scale:.98 }}
//                       style={{ background: loading ? '#e2e8f0' : `linear-gradient(135deg,${ac},#0ea5e9)`, color: loading ? '#94a3b8' : '#fff', boxShadow: loading ? 'none' : `0 8px 24px ${ac}40` }}>
//                       {loading
//                         ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
//                             <div style={{ width:16,height:16,border:`2px solid #94a3b8`,borderTopColor:'#64748b',borderRadius:'50%',animation:'spin .7s linear infinite' }} />
//                             Authenticating…
//                           </span>
//                         : `Sign In as ${activeRole.label} →`
//                       }
//                     </motion.button>
//                   )}
//                 </AnimatePresence>
//               </form>

//               {/* Demo hint */}
//               <div style={{ marginTop:14, padding:'10px 14px', background:'#f8fafc', borderRadius:10, border:'1px dashed #cbd5e1', fontSize:12, color:'#64748b', display:'flex', alignItems:'center', gap:8 }}>
//                 <span style={{ fontSize:15 }}>💡</span>
//                 <span>Demo password: <strong style={{ color:'#334155', fontFamily:'monospace' }}>password123</strong> for all test accounts</span>
//               </div>
//             </div>

//             {/* Footer */}
//             <div style={{ padding:'16px 28px 20px', borderTop:'1px solid #f1f5f9', background:'#fafbfc', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
//               <div style={{ fontSize:12.5, color:'#64748b' }}>
//                 New here?{' '}
//                 <Link to="/register" style={{ color:ac, fontWeight:700, textDecoration:'none' }}>Create account →</Link>
//               </div>
//               <div style={{ display:'flex', gap:10 }}>
//                 {['🔒 SSL','🛡️ HIPAA','✅ Secure'].map(b => (
//                   <span key={b} style={{ fontSize:10.5, color:'#94a3b8', fontWeight:600 }}>{b}</span>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Social links below card */}
//           <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.4 }}
//             style={{ marginTop:20, display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
//             <div style={{ fontSize:11, color:'#94a3b8', letterSpacing:1, textTransform:'uppercase', fontWeight:600 }}>Connect With Us</div>
//             <div style={{ display:'flex', gap:10 }}>
//               {SOCIALS.map(s => (
//                 <button key={s.platform} className="social-btn" style={{ background:s.bg, width:38, height:38, fontSize:13 }}
//                   onClick={() => window.open(s.url,'_blank','noopener,noreferrer')} title={s.platform}>
//                   {s.icon}
//                 </button>
//               ))}
//             </div>
//             <div style={{ fontSize:11, color:'#cbd5e1' }}>© 2025 MediCare HMS · All Rights Reserved</div>
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* ══════════════════════════════════════════════
//           24×7 LIVE SUPPORT BUBBLE
//       ══════════════════════════════════════════════ */}
//       <div className="support-bubble">
//         {supportOpen && (
//           <div className="support-panel">
//             {/* Panel header */}
//             <div style={{ background:`linear-gradient(135deg,${ac},#0ea5e9)`, padding:'16px 18px' }}>
//               <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
//                 <div style={{ display:'flex', alignItems:'center', gap:10 }}>
//                   <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>🩺</div>
//                   <div>
//                     <div style={{ color:'#fff', fontWeight:800, fontSize:13 }}>MediCare Support</div>
//                     <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:2 }}>
//                       <div style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80', animation:'heartbeat 1.5s ease-in-out infinite' }} />
//                       <span style={{ color:'rgba(255,255,255,.8)', fontSize:10 }}>Online · Avg reply &lt; 2 min</span>
//                     </div>
//                   </div>
//                 </div>
//                 <button onClick={() => setSupportOpen(false)} style={{ background:'rgba(255,255,255,.2)', border:'none', borderRadius:'50%', width:26, height:26, cursor:'pointer', color:'#fff', fontSize:12, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
//               </div>
//             </div>

//             {/* Body */}
//             <div style={{ padding:'16px 18px' }}>
//               {supportSent ? (
//                 <div style={{ textAlign:'center', padding:'20px 0' }}>
//                   <div style={{ fontSize:36, marginBottom:10 }}>✅</div>
//                   <div style={{ fontWeight:700, color:'#0f172a', marginBottom:4 }}>Message Received!</div>
//                   <div style={{ fontSize:12, color:'#64748b' }}>Our team will respond within 2 minutes.</div>
//                 </div>
//               ) : (
//                 <>
//                   {/* Quick contacts */}
//                   <div style={{ marginBottom:14 }}>
//                     <div style={{ fontSize:10.5, color:'#94a3b8', fontWeight:700, letterSpacing:.8, marginBottom:8 }}>QUICK CONTACT</div>
//                     {[
//                       { icon:'📞', label:'Call Us', val:'+1-800-MEDICARE', sub:'Available 24 × 7' },
//                       { icon:'📧', label:'Email', val:'support@medicarehms.com', sub:'Reply in &lt; 1 hr' },
//                       { icon:'💬', label:'Live Chat', val:'Start instant chat', sub:'Avg wait &lt; 2 min' },
//                     ].map(c => (
//                       <div key={c.label} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid #f1f5f9' }}>
//                         <div style={{ width:32, height:32, borderRadius:9, background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 }}>{c.icon}</div>
//                         <div>
//                           <div style={{ fontSize:12, fontWeight:700, color:'#0f172a' }}>{c.val}</div>
//                           <div style={{ fontSize:10.5, color:'#94a3b8' }} dangerouslySetInnerHTML={{ __html:c.sub }} />
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Send message */}
//                   <div style={{ fontSize:10.5, color:'#94a3b8', fontWeight:700, letterSpacing:.8, marginBottom:7 }}>SEND A MESSAGE</div>
//                   <textarea
//                     value={supportMsg} onChange={e => setSupportMsg(e.target.value)}
//                     placeholder="Describe your issue or question…"
//                     style={{ width:'100%', height:72, borderRadius:10, border:'1.5px solid #e2e8f0', padding:'10px 12px', fontFamily:'inherit', fontSize:12.5, color:'#374151', outline:'none', resize:'none', boxSizing:'border-box' }}
//                   />
//                   <button onClick={handleSupportSend}
//                     style={{ width:'100%', marginTop:8, padding:'10px', borderRadius:10, border:'none', background:`linear-gradient(135deg,${ac},#0ea5e9)`, color:'#fff', fontFamily:'inherit', fontWeight:700, fontSize:13, cursor:'pointer' }}>
//                     Send Message →
//                   </button>
//                 </>
//               )}
//             </div>

//             {/* Footer */}
//             <div style={{ padding:'10px 18px', background:'#f8fafc', borderTop:'1px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
//               <span style={{ fontSize:10.5, color:'#94a3b8' }}>Available 24 × 7 · 365 days</span>
//               <div style={{ display:'flex', gap:8 }}>
//                 <span style={{ fontSize:10, color:'#94a3b8' }}>🔒 Secure</span>
//                 <span style={{ fontSize:10, color:'#94a3b8' }}>⚡ Fast</span>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Trigger button */}
//         <motion.button className="support-trigger" onClick={() => setSupportOpen(o=>!o)}
//           animate={supportOpen ? {} : { scale:[1,1.08,1] }}
//           transition={{ repeat:Infinity, duration:2.5, ease:'easeInOut' }}
//           style={{ background:`linear-gradient(135deg,${ac},#0ea5e9)`, color:'#fff', border:`3px solid #fff` }}>
//           {supportOpen ? '✕' : '💬'}
//         </motion.button>

//         {/* Notification dot */}
//         {!supportOpen && (
//           <div style={{ position:'absolute', top:2, right:2, width:14, height:14, borderRadius:'50%', background:'#ef4444', border:'2px solid #fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
//             <span style={{ fontSize:7, color:'#fff', fontWeight:900 }}>!</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
// import { useAuth } from '../context/AuthContext';

// /* ─── data ─── */
// const ROLES = [
//   { key:'admin',      label:'Administrator', sub:'Full system control',          color:'#6366f1', dark:'#4338ca', emoji:'🛡️' },
//   { key:'doctor',     label:'Doctor',        sub:'Patient care & records',       color:'#0891b2', dark:'#0e7490', emoji:'⚕️'  },
//   { key:'patient',    label:'Patient',       sub:'Health & appointments',        color:'#7c3aed', dark:'#6d28d9', emoji:'🧑‍⚕️' },
//   { key:'nurse',      label:'Nurse',         sub:'Ward & patient monitoring',    color:'#db2777', dark:'#be185d', emoji:'💉'  },
//   { key:'pharmacist', label:'Pharmacist',    sub:'Medications & inventory',      color:'#d97706', dark:'#b45309', emoji:'💊'  },
// ];

// const FEATURES = [
//   { icon:'🏥', text:'Electronic Health Records' },
//   { icon:'📅', text:'Smart Appointment Booking' },
//   { icon:'💊', text:'Pharmacy & Medication Mgmt' },
//   { icon:'🚨', text:'Emergency Alert System' },
//   { icon:'📊', text:'Real-Time Analytics' },
//   { icon:'🔒', text:'Role-Based Access Control' },
//   { icon:'💬', text:'Live Notifications' },
//   { icon:'🧪', text:'Lab & Diagnostic Integration' },
//   { icon:'⏰', text:'Medication Reminders' },
//   { icon:'🌐', text:'HIPAA-Aligned Security' },
// ];

// const STATS = [
//   { val:'50K+', label:'Patients Managed', icon:'👥' },
//   { val:'1.2K+', label:'Doctors',          icon:'⚕️' },
//   { val:'99.9%', label:'Uptime',            icon:'⚡' },
//   { val:'24/7',  label:'Support',           icon:'🛟' },
// ];

// const SOCIALS = [
//   { name:'Facebook',  url:'https://facebook.com/medicarehms',  bg:'#1877f2', icon:'f'  },
//   { name:'Twitter',   url:'https://twitter.com/medicarehms',   bg:'#000',    icon:'𝕏'  },
//   { name:'LinkedIn',  url:'https://linkedin.com/company/medicarehms', bg:'#0a66c2', icon:'in' },
//   { name:'Instagram', url:'https://instagram.com/medicarehms', bg:'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366)', icon:'◈' },
//   { name:'YouTube',   url:'https://youtube.com/@medicarehms',  bg:'#ff0000', icon:'▶'  },
// ];

// /* ─── ECG path helper ─── */
// const ECG_D = "M0,50 L30,50 L38,20 L46,80 L54,50 L62,50 L70,35 L78,65 L86,50 L200,50";

// /* ─── Particle dot ─── */
// function Dot({ x, y, size, dur, del, color }) {
//   return (
//     <motion.div style={{ position:'absolute', left:`${x}%`, top:`${y}%`, width:size, height:size, borderRadius:'50%', background:color, opacity:.35 }}
//       animate={{ y:[0,-18,0], opacity:[.35,.65,.35] }}
//       transition={{ duration:dur, delay:del, repeat:Infinity, ease:'easeInOut' }} />
//   );
// }

// export default function LoginPage() {
//   const { login } = useAuth();
//   const nav = useNavigate();
//   const [role, setRole] = useState(ROLES[0]);
//   const [email, setEmail] = useState('');
//   const [pass, setPass] = useState('');
//   const [showP, setShowP] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errs, setErrs] = useState({});
//   const [step, setStep] = useState('idle'); // idle | loading | success | error
//   const [featI, setFeatI] = useState(0);
//   const containerRef = useRef(null);
//   const mouseX = useMotionValue(0.5);
//   const mouseY = useMotionValue(0.5);
//   const springX = useSpring(mouseX, { stiffness:80, damping:25 });
//   const springY = useSpring(mouseY, { stiffness:80, damping:25 });

//   /* rotate features marquee */
//   useEffect(() => {
//     const id = setInterval(() => setFeatI(i => (i+1) % FEATURES.length), 2800);
//     return () => clearInterval(id);
//   }, []);

//   /* parallax mouse */
//   const onMouseMove = useCallback((e) => {
//     const r = containerRef.current?.getBoundingClientRect();
//     if (!r) return;
//     mouseX.set((e.clientX - r.left) / r.width);
//     mouseY.set((e.clientY - r.top) / r.height);
//   }, [mouseX, mouseY]);

//   const validate = () => {
//     const e = {};
//     if (!email.trim()) e.email = 'Email required';
//     else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email';
//     if (!pass) e.pass = 'Password required';
//     else if (pass.length < 6) e.pass = 'Min 6 characters';
//     return e;
//   };

//   const handleSubmit = async (ev) => {
//     ev.preventDefault();
//     const e = validate();
//     if (Object.keys(e).length) { setErrs(e); return; }
//     setStep('loading');
//     const res = await login(email, pass);
//     if (res.success) { setStep('success'); setTimeout(() => nav('/dashboard'), 1100); }
//     else { setStep('error'); setErrs({ general: res.error || 'Invalid credentials' }); setTimeout(() => setStep('idle'), 2200); }
//   };

//   const dots = useRef(Array.from({length:22}, (_,i) => ({
//     id:i, x:Math.random()*100, y:Math.random()*100,
//     size: Math.random()*3+1.5,
//     dur: Math.random()*4+3,
//     del: Math.random()*4,
//   }))).current;

//   const ac = role.color;

//   return (
//     <div ref={containerRef} onMouseMove={onMouseMove}
//       style={{ minHeight:'100vh', background:'#020817', display:'flex', fontFamily:"'Outfit',system-ui,sans-serif", overflow:'hidden', position:'relative', userSelect:'none' }}>

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@700&display=swap');
//         *{box-sizing:border-box;margin:0;padding:0;}
//         ::-webkit-scrollbar{display:none;}
//         @keyframes spin{to{transform:rotate(360deg)}}
//         @keyframes ecgMove{0%{stroke-dashoffset:300}100%{stroke-dashoffset:0}}
//         @keyframes glow{0%,100%{opacity:.6}50%{opacity:1}}
//         @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
//         @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
//         @keyframes fadeSlideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
//         @keyframes borderGlow{0%,100%{box-shadow:0 0 0 2px ${ac}30}50%{box-shadow:0 0 0 4px ${ac}60}}
//         .inp{width:100%;background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.1);border-radius:13px;padding:13px 15px 13px 44px;font-family:'Outfit',sans-serif;font-size:14.5px;color:#fff;outline:none;transition:all .25s;}
//         .inp::placeholder{color:rgba(255,255,255,.25);}
//         .inp:focus{border-color:${ac};box-shadow:0 0 0 3px ${ac}25;background:rgba(255,255,255,.07);}
//         .inp.err{border-color:#f87171;box-shadow:0 0 0 3px #f8717120;}
//         .role-card{flex:1;min-width:0;padding:10px 6px 8px;border:1.5px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);border-radius:13px;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:4px;}
//         .role-card:hover{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.18);}
//         .role-card.active{border-color:${ac} !important;background:${ac}18 !important;box-shadow:0 0 0 3px ${ac}22,inset 0 0 12px ${ac}12;}
//         .social-btn{width:36px;height:36px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:800;font-family:'Outfit',sans-serif;transition:all .2s;}
//         .social-btn:hover{transform:translateY(-3px) scale(1.1);box-shadow:0 8px 22px rgba(0,0,0,.4);}
//         .feat-pill{display:inline-flex;align-items:center;gap:7px;padding:7px 14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:20px;font-size:12px;color:rgba(255,255,255,.7);white-space:nowrap;}
//       `}</style>

//       {/* ══ LAYER 0: animated gradient noise bg ══ */}
//       <motion.div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
//         <motion.div style={{ position:'absolute', width:'70%', height:'70%', borderRadius:'50%', filter:'blur(100px)', background:ac, opacity:.07, top:'-20%', left:'-15%', transition:'background 0.8s' }}
//           animate={{ scale:[1,1.1,1], x:[0,20,0] }} transition={{ duration:12, repeat:Infinity, ease:'easeInOut' }} />
//         <motion.div style={{ position:'absolute', width:'60%', height:'60%', borderRadius:'50%', filter:'blur(120px)', background:ac, opacity:.05, bottom:'-20%', right:'-15%', transition:'background 0.8s' }}
//           animate={{ scale:[1.1,1,1.1], x:[0,-20,0] }} transition={{ duration:10, repeat:Infinity, ease:'easeInOut', delay:3 }} />
//         {/* Grid */}
//         <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)', backgroundSize:'48px 48px' }} />
//         {/* Floating dots */}
//         {dots.map(d => <Dot key={d.id} {...d} color={ac} />)}
//       </motion.div>

//       {/* ══ LEFT — Branding panel ══ */}
//       <motion.div initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }} transition={{ duration:.7, ease:[.22,1,.36,1] }}
//         style={{ width:'52%', display:'flex', flexDirection:'column', padding:'0', position:'relative', zIndex:1, overflow:'hidden' }}>

//         {/* Top nav bar */}
//         <div style={{ padding:'28px 44px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
//           <div style={{ display:'flex', alignItems:'center', gap:12 }}>
//             <motion.div animate={{ boxShadow:[`0 0 0 0 ${ac}60`,`0 0 0 10px ${ac}00`] }} transition={{ duration:2, repeat:Infinity }}
//               style={{ width:42, height:42, borderRadius:13, background:`linear-gradient(135deg,${ac},${role.dark})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
//               ✚
//             </motion.div>
//             <div>
//               <div style={{ color:'#fff', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:17, letterSpacing:.2 }}>MediCare</div>
//               <div style={{ color:'rgba(255,255,255,.3)', fontSize:10, letterSpacing:1.5, textTransform:'uppercase' }}>HMS · v3.0</div>
//             </div>
//           </div>
//           <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(34,197,94,.1)', border:'1px solid rgba(34,197,94,.25)', borderRadius:20, padding:'5px 12px' }}>
//             <motion.div animate={{ scale:[1,1.4,1] }} transition={{ duration:1.6, repeat:Infinity }}
//               style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e' }} />
//             <span style={{ color:'#4ade80', fontSize:10.5, fontWeight:700, letterSpacing:.5 }}>ALL SYSTEMS LIVE</span>
//           </div>
//         </div>

//         {/* Main hero */}
//         <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'0 44px 0 44px' }}>

//           {/* ECG line */}
//           <div style={{ marginBottom:24, opacity:.5 }}>
//             <svg width="200" height="50" viewBox="0 0 200 50" fill="none">
//               <motion.path d={ECG_D} stroke={ac} strokeWidth="2" strokeLinecap="round" fill="none"
//                 strokeDasharray="300" strokeDashoffset="300"
//                 animate={{ strokeDashoffset:[300,0,300] }} transition={{ duration:3, repeat:Infinity, ease:'linear' }} />
//             </svg>
//           </div>

//           <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.3, duration:.7 }}>
//             <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", color:'#fff', fontSize:46, fontWeight:700, lineHeight:1.1, marginBottom:16, letterSpacing:-1.5 }}>
//               Healthcare<br/>
//               <span style={{ background:`linear-gradient(90deg, ${ac}, #38bdf8, ${ac})`, backgroundSize:'200% 100%', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'glow 3s ease-in-out infinite' }}>
//                 Reimagined
//               </span>
//             </h1>
//             <p style={{ color:'rgba(255,255,255,.45)', fontSize:15, lineHeight:1.7, maxWidth:360, marginBottom:32 }}>
//               One secure platform to manage your entire hospital — patients, doctors, pharmacy, records, and billing.
//             </p>
//           </motion.div>

//           {/* Stats row */}
//           <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.45 }}
//             style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:40 }}>
//             {STATS.map((s,i) => (
//               <motion.div key={i} whileHover={{ y:-3 }}
//                 style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', borderRadius:14, padding:'14px 10px', textAlign:'center' }}>
//                 <div style={{ fontSize:20, marginBottom:4 }}>{s.icon}</div>
//                 <div style={{ color:'#fff', fontWeight:800, fontSize:17, fontFamily:"'Space Grotesk',sans-serif" }}>{s.val}</div>
//                 <div style={{ color:'rgba(255,255,255,.35)', fontSize:10.5, marginTop:2 }}>{s.label}</div>
//               </motion.div>
//             ))}
//           </motion.div>

//           {/* Feature ticker */}
//           <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.6 }}
//             style={{ marginBottom:36 }}>
//             <div style={{ fontSize:10, color:'rgba(255,255,255,.25)', letterSpacing:2, textTransform:'uppercase', marginBottom:10, fontWeight:600 }}>Platform Capabilities</div>
//             <div style={{ overflow:'hidden', maskImage:'linear-gradient(90deg,transparent,black 10%,black 90%,transparent)' }}>
//               <div style={{ display:'flex', gap:10, animation:'ticker 20s linear infinite', width:'max-content' }}>
//                 {[...FEATURES,...FEATURES].map((f,i) => (
//                   <div key={i} className="feat-pill"><span>{f.icon}</span>{f.text}</div>
//                 ))}
//               </div>
//             </div>
//           </motion.div>

//           {/* Socials */}
//           <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.75 }}>
//             <div style={{ fontSize:10, color:'rgba(255,255,255,.25)', letterSpacing:2, textTransform:'uppercase', marginBottom:10, fontWeight:600 }}>Follow MediCare</div>
//             <div style={{ display:'flex', gap:10 }}>
//               {SOCIALS.map(s => (
//                 <button key={s.name} className="social-btn" style={{ background:s.bg }}
//                   onClick={() => window.open(s.url,'_blank','noopener,noreferrer')} title={s.name}>{s.icon}</button>
//               ))}
//             </div>
//           </motion.div>
//         </div>

//         {/* Bottom copyright */}
//         <div style={{ padding:'20px 44px', color:'rgba(255,255,255,.18)', fontSize:11 }}>
//           © 2025 MediCare HMS · All rights reserved · Secure · HIPAA Compliant
//         </div>
//       </motion.div>

//       {/* ══ RIGHT — Login card with 3D parallax ══ */}
//       <div style={{ width:'48%', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', position:'relative', zIndex:2 }}>

//         {/* Glow behind card */}
//         <motion.div style={{ position:'absolute', width:360, height:360, borderRadius:'50%', background:ac, opacity:.08, filter:'blur(80px)', transition:'background .6s' }}
//           animate={{ scale:[1,1.05,1] }} transition={{ duration:6, repeat:Infinity, ease:'easeInOut' }} />

//         <motion.div
//           initial={{ opacity:0, y:32, scale:.96 }}
//           animate={{ opacity:1, y:0, scale:1 }}
//           transition={{ duration:.65, ease:[.22,1,.36,1], delay:.1 }}
//           style={{
//             width:'100%', maxWidth:430,
//             background:'rgba(8,15,35,0.82)',
//             backdropFilter:'blur(40px)',
//             borderRadius:28,
//             border:'1px solid rgba(255,255,255,.08)',
//             boxShadow:`0 0 0 1px rgba(255,255,255,.03), 0 40px 80px rgba(0,0,0,.7), 0 0 80px ${ac}18`,
//             overflow:'hidden',
//             position:'relative',
//           }}>

//           {/* Card shimmer top bar */}
//           <motion.div key={ac} initial={{ scaleX:0, originX:0 }} animate={{ scaleX:1 }}
//             transition={{ duration:.6, delay:.2 }}
//             style={{ height:3, background:`linear-gradient(90deg, ${ac}, #38bdf8, ${ac})`, backgroundSize:'200% 100%', animation:'glow 2s ease-in-out infinite' }} />

//           <div style={{ padding:'30px 32px 28px' }}>

//             {/* Card header */}
//             <div style={{ marginBottom:26 }}>
//               <motion.h2 initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} transition={{ delay:.25 }}
//                 style={{ color:'#fff', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:26, letterSpacing:-.5, marginBottom:6 }}>
//                 Access Portal
//               </motion.h2>
//               <div style={{ color:'rgba(255,255,255,.35)', fontSize:13 }}>
//                 Sign in to your MediCare HMS account
//               </div>
//               <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:.5, duration:.5 }}
//                 style={{ height:1.5, background:`linear-gradient(90deg,${ac},transparent)`, marginTop:16, originX:0 }} />
//             </div>

//             {/* Role selector */}
//             <div style={{ marginBottom:20 }}>
//               <div style={{ fontSize:10, color:'rgba(255,255,255,.3)', letterSpacing:2, textTransform:'uppercase', fontWeight:600, marginBottom:9 }}>Select Role</div>
//               <div style={{ display:'flex', gap:5 }}>
//                 {ROLES.map(r => (
//                   <button key={r.key} className={`role-card${role.key===r.key?' active':''}`}
//                     style={{ '--ac':r.color }}
//                     onClick={() => { setRole(r); setErrs({}); setEmail(''); setPass(''); }}>
//                     <span style={{ fontSize:20 }}>{r.emoji}</span>
//                     <span style={{ fontSize:10, fontWeight:700, color: role.key===r.key ? r.color : 'rgba(255,255,255,.4)' }}>{r.label}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Role hint */}
//             <AnimatePresence mode="wait">
//               <motion.div key={role.key}
//                 initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
//                 transition={{ duration:.22 }}
//                 style={{ marginBottom:20, overflow:'hidden' }}>
//                 <div style={{ padding:'9px 13px', background:`${ac}15`, border:`1px solid ${ac}30`, borderRadius:11, display:'flex', alignItems:'center', gap:9 }}>
//                   <div style={{ width:7, height:7, borderRadius:'50%', background:ac, flexShrink:0, boxShadow:`0 0 8px ${ac}` }} />
//                   <span style={{ fontSize:12, color:'rgba(255,255,255,.55)' }}>
//                     {role.label} — {role.sub}. Demo password: <code style={{ background:'rgba(255,255,255,.08)', padding:'1px 5px', borderRadius:4, fontSize:11.5, color:'rgba(255,255,255,.75)' }}>password123</code>
//                   </span>
//                 </div>
//               </motion.div>
//             </AnimatePresence>

//             {/* Error */}
//             <AnimatePresence>
//               {errs.general && (
//                 <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
//                   style={{ background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.3)', borderRadius:11, padding:'10px 14px', marginBottom:16, fontSize:13, color:'#f87171', display:'flex', alignItems:'center', gap:8 }}>
//                   ⚠️ {errs.general}
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Form */}
//             <form onSubmit={handleSubmit} autoComplete="off">
//               {/* Email */}
//               <div style={{ marginBottom:13 }}>
//                 <label style={{ display:'block', fontSize:10.5, fontWeight:700, color:'rgba(255,255,255,.4)', letterSpacing:1, textTransform:'uppercase', marginBottom:6 }}>Email Address</label>
//                 <div style={{ position:'relative' }}>
//                   <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:15, opacity:.4, pointerEvents:'none' }}>✉</span>
//                   <input className={`inp${errs.email?' err':''}`} type="email" name="hms-login-email" autoComplete="new-password"
//                     placeholder="Enter your email" value={email}
//                     onChange={e => { setEmail(e.target.value); setErrs(er => ({...er,email:''})); }} />
//                 </div>
//                 {errs.email && <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ fontSize:11, color:'#f87171', marginTop:4 }}>{errs.email}</motion.div>}
//               </div>

//               {/* Password */}
//               <div style={{ marginBottom:18 }}>
//                 <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
//                   <label style={{ fontSize:10.5, fontWeight:700, color:'rgba(255,255,255,.4)', letterSpacing:1, textTransform:'uppercase' }}>Password</label>
//                   <span style={{ fontSize:12, color:ac, cursor:'pointer', fontWeight:600 }}>Forgot password?</span>
//                 </div>
//                 <div style={{ position:'relative' }}>
//                   <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:15, opacity:.4, pointerEvents:'none' }}>🔑</span>
//                   <input className={`inp${errs.pass?' err':''}`} type={showP?'text':'password'} name="hms-login-pass" autoComplete="new-password"
//                     placeholder="Enter password" value={pass} style={{ paddingRight:44 }}
//                     onChange={e => { setPass(e.target.value); setErrs(er => ({...er,pass:''})); }} />
//                   <button type="button" onClick={() => setShowP(p=>!p)}
//                     style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,.35)', fontSize:14, padding:3, transition:'color .2s' }}
//                     onMouseEnter={e=>e.currentTarget.style.color=ac} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.35)'}>
//                     {showP?'🙈':'👁️'}
//                   </button>
//                 </div>
//                 {errs.pass && <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ fontSize:11, color:'#f87171', marginTop:4 }}>{errs.pass}</motion.div>}
//               </div>

//               {/* Submit */}
//               <AnimatePresence mode="wait">
//                 {step === 'success' ? (
//                   <motion.div key="ok" initial={{ scale:.9, opacity:0 }} animate={{ scale:1, opacity:1 }}
//                     style={{ padding:'14px', borderRadius:14, background:'linear-gradient(135deg,#059669,#34d399)', color:'#fff', fontWeight:800, fontSize:15, textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
//                     <motion.span animate={{ rotate:[0,360] }} transition={{ duration:.5 }}>✅</motion.span>
//                     Access Granted — Entering Dashboard…
//                   </motion.div>
//                 ) : step === 'error' ? (
//                   <motion.div key="err" initial={{ x:-8 }} animate={{ x:[0,-8,8,-6,6,-4,4,0] }} transition={{ duration:.4 }}
//                     style={{ padding:'14px', borderRadius:14, background:'rgba(239,68,68,.15)', border:'1px solid rgba(239,68,68,.3)', color:'#f87171', fontWeight:700, fontSize:14, textAlign:'center' }}>
//                     ❌ Authentication Failed
//                   </motion.div>
//                 ) : (
//                   <motion.button key="btn" type="submit" disabled={step==='loading'}
//                     whileHover={{ scale: step==='loading'?1:1.01 }}
//                     whileTap={{ scale:.98 }}
//                     style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background:`linear-gradient(135deg,${ac},${role.dark})`, color:'#fff', fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:15, cursor: step==='loading'?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:9, boxShadow:`0 10px 30px ${ac}40`, opacity: step==='loading'?.75:1, transition:'opacity .2s' }}>
//                     {step==='loading'
//                       ? <><div style={{ width:18,height:18,border:'2.5px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite' }} /> Authenticating…</>
//                       : <><span style={{ fontSize:16 }}>🔐</span> Sign In as {role.label} <motion.span animate={{ x:[0,4,0] }} transition={{ repeat:Infinity,duration:1.4 }}>→</motion.span></>
//                     }
//                   </motion.button>
//                 )}
//               </AnimatePresence>
//             </form>

//             {/* Footer */}
//             <div style={{ marginTop:20, paddingTop:18, borderTop:'1px solid rgba(255,255,255,.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
//               <div style={{ fontSize:12.5, color:'rgba(255,255,255,.3)' }}>
//                 No account? <Link to="/register" style={{ color:ac, fontWeight:700, textDecoration:'none' }}>Register →</Link>
//               </div>
//               <div style={{ display:'flex', gap:8 }}>
//                 {['🔒','🛡️','✅'].map((i,k) => (
//                   <div key={k} style={{ width:27,height:27,borderRadius:8,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13 }}>{i}</div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Bottom color strip */}
//           <motion.div key={ac+'-strip'} initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ duration:.5 }}
//             style={{ height:3, background:`linear-gradient(90deg,transparent,${ac},#38bdf8,${ac},transparent)`, originX:.5 }} />
//         </motion.div>
//       </div>

//       {/* ══ 24/7 Support bubble ══ */}
//       <SupportBubble color={ac} />
//     </div>
//   );
// }

// /* ─── Floating support chat bubble ─── */
// function SupportBubble({ color }) {
//   const [open, setOpen] = useState(false);
//   const [msg, setMsg] = useState('');
//   const [sent, setSent] = useState(false);

//   const send = () => {
//     if (!msg.trim()) return;
//     setSent(true);
//     setTimeout(() => { setOpen(false); setSent(false); setMsg(''); }, 2500);
//   };

//   return (
//     <div style={{ position:'fixed', bottom:28, right:28, zIndex:999 }}>
//       <AnimatePresence>
//         {open && (
//           <motion.div initial={{ opacity:0, scale:.9, y:10 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:.9, y:10 }}
//             style={{ position:'absolute', bottom:70, right:0, width:300, background:'rgba(8,15,35,.95)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,.1)', borderRadius:20, boxShadow:'0 20px 60px rgba(0,0,0,.5)', overflow:'hidden' }}>

//             <div style={{ background:`linear-gradient(135deg,${color},#0ea5e9)`, padding:'14px 16px' }}>
//               <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
//                 <div style={{ display:'flex', alignItems:'center', gap:9 }}>
//                   <div style={{ width:34,height:34,borderRadius:'50%',background:'rgba(255,255,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16 }}>🩺</div>
//                   <div>
//                     <div style={{ color:'#fff',fontWeight:800,fontSize:13 }}>MediCare Support</div>
//                     <div style={{ display:'flex',alignItems:'center',gap:5,marginTop:2 }}>
//                       <motion.div animate={{ scale:[1,1.4,1] }} transition={{ duration:1.5,repeat:Infinity }}
//                         style={{ width:6,height:6,borderRadius:'50%',background:'#4ade80' }} />
//                       <span style={{ color:'rgba(255,255,255,.75)',fontSize:10 }}>Online · Avg reply &lt;2 min</span>
//                     </div>
//                   </div>
//                 </div>
//                 <button onClick={() => setOpen(false)} style={{ background:'rgba(255,255,255,.15)',border:'none',borderRadius:'50%',width:26,height:26,cursor:'pointer',color:'#fff',fontSize:12,display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>
//               </div>
//             </div>

//             <div style={{ padding:'14px 16px' }}>
//               {sent ? (
//                 <div style={{ textAlign:'center',padding:'20px 0' }}>
//                   <div style={{ fontSize:34,marginBottom:8 }}>✅</div>
//                   <div style={{ fontWeight:800,color:'#fff',marginBottom:4 }}>Message Sent!</div>
//                   <div style={{ fontSize:12,color:'rgba(255,255,255,.4)' }}>Team will reply within 2 minutes.</div>
//                 </div>
//               ) : (
//                 <>
//                   {[['📞','+1-800-MEDICARE','24 × 7'],['📧','support@medicarehms.com','Reply &lt;1hr'],['💬','Live Chat','Avg &lt;2 min']].map(([i,v,s]) => (
//                     <div key={v} style={{ display:'flex',gap:9,padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,.06)' }}>
//                       <div style={{ width:30,height:30,borderRadius:8,background:'rgba(255,255,255,.06)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0 }}>{i}</div>
//                       <div><div style={{ fontSize:12,fontWeight:700,color:'#fff' }}>{v}</div><div style={{ fontSize:10.5,color:'rgba(255,255,255,.35)' }} dangerouslySetInnerHTML={{ __html:s }} /></div>
//                     </div>
//                   ))}
//                   <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Describe your issue…"
//                     style={{ width:'100%',height:68,marginTop:12,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:10,padding:'10px 12px',color:'#fff',fontFamily:"'Outfit',sans-serif",fontSize:12.5,outline:'none',resize:'none',boxSizing:'border-box' }} />
//                   <button onClick={send} style={{ width:'100%',marginTop:8,padding:'10px',borderRadius:10,border:'none',background:`linear-gradient(135deg,${color},#0ea5e9)`,color:'#fff',fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,cursor:'pointer' }}>
//                     Send →
//                   </button>
//                 </>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <motion.button onClick={() => setOpen(o=>!o)}
//         animate={{ scale:[1,1.06,1] }} transition={{ repeat:Infinity, duration:2.5, ease:'easeInOut' }}
//         style={{ width:56,height:56,borderRadius:'50%',background:`linear-gradient(135deg,${color},#0ea5e9)`,border:'3px solid rgba(255,255,255,.15)',cursor:'pointer',fontSize:22,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 8px 28px ${color}60` }}>
//         {open?'✕':'💬'}
//       </motion.button>
//       {!open && (
//         <div style={{ position:'absolute',top:0,right:0,width:16,height:16,borderRadius:'50%',background:'#ef4444',border:'2.5px solid #020817',display:'flex',alignItems:'center',justifyContent:'center' }}>
//           <span style={{ fontSize:7,color:'#fff',fontWeight:900 }}>!</span>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SupportBot from '../components/SupportBot';

/* ─── data ─── */
const ROLES = [
  { key:'admin',      label:'Administrator', sub:'Full system control',          color:'#6366f1', dark:'#4338ca', emoji:'🛡️' },
  { key:'doctor',     label:'Doctor',        sub:'Patient care & records',       color:'#0891b2', dark:'#0e7490', emoji:'⚕️'  },
  { key:'patient',    label:'Patient',       sub:'Health & appointments',        color:'#7c3aed', dark:'#6d28d9', emoji:'🧑‍⚕️' },
  { key:'nurse',      label:'Nurse',         sub:'Ward & patient monitoring',    color:'#db2777', dark:'#be185d', emoji:'💉'  },
  { key:'pharmacist', label:'Pharmacist',    sub:'Medications & inventory',      color:'#d97706', dark:'#b45309', emoji:'💊'  },
];

const FEATURES = [
  { icon:'🏥', text:'Electronic Health Records' },
  { icon:'📅', text:'Smart Appointment Booking' },
  { icon:'💊', text:'Pharmacy & Medication Mgmt' },
  { icon:'🚨', text:'Emergency Alert System' },
  { icon:'📊', text:'Real-Time Analytics' },
  { icon:'🔒', text:'Role-Based Access Control' },
  { icon:'💬', text:'Live Notifications' },
  { icon:'🧪', text:'Lab & Diagnostic Integration' },
  { icon:'⏰', text:'Medication Reminders' },
  { icon:'🌐', text:'HIPAA-Aligned Security' },
];

const STATS = [
  { val:'50K+', label:'Patients Managed', icon:'👥' },
  { val:'1.2K+', label:'Doctors',          icon:'⚕️' },
  { val:'99.9%', label:'Uptime',            icon:'⚡' },
  { val:'24/7',  label:'Support',           icon:'🛟' },
];

const SOCIALS = [
  { name:'Facebook',  url:'https://facebook.com/medicarehms',  bg:'#1877f2', icon:'f'  },
  { name:'Twitter',   url:'https://twitter.com/medicarehms',   bg:'#000',    icon:'𝕏'  },
  { name:'LinkedIn',  url:'https://linkedin.com/company/medicarehms', bg:'#0a66c2', icon:'in' },
  { name:'Instagram', url:'https://instagram.com/medicarehms', bg:'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366)', icon:'◈' },
  { name:'YouTube',   url:'https://youtube.com/@medicarehms',  bg:'#ff0000', icon:'▶'  },
];

/* ─── ECG path helper ─── */
const ECG_D = "M0,50 L30,50 L38,20 L46,80 L54,50 L62,50 L70,35 L78,65 L86,50 L200,50";

/* ─── Particle dot ─── */
function Dot({ x, y, size, dur, del, color }) {
  return (
    <motion.div style={{ position:'absolute', left:`${x}%`, top:`${y}%`, width:size, height:size, borderRadius:'50%', background:color, opacity:.35 }}
      animate={{ y:[0,-18,0], opacity:[.35,.65,.35] }}
      transition={{ duration:dur, delay:del, repeat:Infinity, ease:'easeInOut' }} />
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [role, setRole] = useState(ROLES[0]);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showP, setShowP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errs, setErrs] = useState({});
  const [step, setStep] = useState('idle'); // idle | loading | success | error
  const [featI, setFeatI] = useState(0);
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness:80, damping:25 });
  const springY = useSpring(mouseY, { stiffness:80, damping:25 });

  /* rotate features marquee */
  useEffect(() => {
    const id = setInterval(() => setFeatI(i => (i+1) % FEATURES.length), 2800);
    return () => clearInterval(id);
  }, []);

  /* parallax mouse */
  const onMouseMove = useCallback((e) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseX.set((e.clientX - r.left) / r.width);
    mouseY.set((e.clientY - r.top) / r.height);
  }, [mouseX, mouseY]);

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email';
    if (!pass) e.pass = 'Password required';
    else if (pass.length < 6) e.pass = 'Min 6 characters';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrs(e); return; }
    setStep('loading');
    const res = await login(email, pass);
    if (res.success) { setStep('success'); setTimeout(() => nav('/dashboard'), 1100); }
    else { setStep('error'); setErrs({ general: res.error || 'Invalid credentials' }); setTimeout(() => setStep('idle'), 2200); }
  };

  const dots = useRef(Array.from({length:22}, (_,i) => ({
    id:i, x:Math.random()*100, y:Math.random()*100,
    size: Math.random()*3+1.5,
    dur: Math.random()*4+3,
    del: Math.random()*4,
  }))).current;

  const ac = role.color;

  return (
    <div ref={containerRef} onMouseMove={onMouseMove}
      style={{ minHeight:'100vh', background:'#020817', display:'flex', fontFamily:"'Outfit',system-ui,sans-serif", overflow:'hidden', position:'relative', userSelect:'none' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{display:none;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes ecgMove{0%{stroke-dashoffset:300}100%{stroke-dashoffset:0}}
        @keyframes glow{0%,100%{opacity:.6}50%{opacity:1}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes fadeSlideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes borderGlow{0%,100%{box-shadow:0 0 0 2px ${ac}30}50%{box-shadow:0 0 0 4px ${ac}60}}
        .inp{width:100%;background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.1);border-radius:13px;padding:13px 15px 13px 44px;font-family:'Outfit',sans-serif;font-size:14.5px;color:#fff;outline:none;transition:all .25s;}
        .inp::placeholder{color:rgba(255,255,255,.25);}
        .inp:focus{border-color:${ac};box-shadow:0 0 0 3px ${ac}25;background:rgba(255,255,255,.07);}
        .inp.err{border-color:#f87171;box-shadow:0 0 0 3px #f8717120;}
        .role-card{flex:1;min-width:0;padding:10px 6px 8px;border:1.5px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);border-radius:13px;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:4px;}
        .role-card:hover{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.18);}
        .role-card.active{border-color:${ac} !important;background:${ac}18 !important;box-shadow:0 0 0 3px ${ac}22,inset 0 0 12px ${ac}12;}
        .social-btn{width:36px;height:36px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:800;font-family:'Outfit',sans-serif;transition:all .2s;}
        .social-btn:hover{transform:translateY(-3px) scale(1.1);box-shadow:0 8px 22px rgba(0,0,0,.4);}
        .feat-pill{display:inline-flex;align-items:center;gap:7px;padding:7px 14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:20px;font-size:12px;color:rgba(255,255,255,.7);white-space:nowrap;}
      `}</style>

      {/* ══ LAYER 0: animated gradient noise bg ══ */}
      <motion.div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
        <motion.div style={{ position:'absolute', width:'70%', height:'70%', borderRadius:'50%', filter:'blur(100px)', background:ac, opacity:.07, top:'-20%', left:'-15%', transition:'background 0.8s' }}
          animate={{ scale:[1,1.1,1], x:[0,20,0] }} transition={{ duration:12, repeat:Infinity, ease:'easeInOut' }} />
        <motion.div style={{ position:'absolute', width:'60%', height:'60%', borderRadius:'50%', filter:'blur(120px)', background:ac, opacity:.05, bottom:'-20%', right:'-15%', transition:'background 0.8s' }}
          animate={{ scale:[1.1,1,1.1], x:[0,-20,0] }} transition={{ duration:10, repeat:Infinity, ease:'easeInOut', delay:3 }} />
        {/* Grid */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)', backgroundSize:'48px 48px' }} />
        {/* Floating dots */}
        {dots.map(d => <Dot key={d.id} {...d} color={ac} />)}
      </motion.div>

      {/* ══ LEFT — Branding panel ══ */}
      <motion.div initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }} transition={{ duration:.7, ease:[.22,1,.36,1] }}
        style={{ width:'52%', display:'flex', flexDirection:'column', padding:'0', position:'relative', zIndex:1, overflow:'hidden' }}>

        {/* Top nav bar */}
        <div style={{ padding:'28px 44px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <motion.div animate={{ boxShadow:[`0 0 0 0 ${ac}60`,`0 0 0 10px ${ac}00`] }} transition={{ duration:2, repeat:Infinity }}
              style={{ width:42, height:42, borderRadius:13, background:`linear-gradient(135deg,${ac},${role.dark})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
              ✚
            </motion.div>
            <div>
              <div style={{ color:'#fff', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:17, letterSpacing:.2 }}>MediCare</div>
              <div style={{ color:'rgba(255,255,255,.3)', fontSize:10, letterSpacing:1.5, textTransform:'uppercase' }}>HMS · v3.0</div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(34,197,94,.1)', border:'1px solid rgba(34,197,94,.25)', borderRadius:20, padding:'5px 12px' }}>
            <motion.div animate={{ scale:[1,1.4,1] }} transition={{ duration:1.6, repeat:Infinity }}
              style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e' }} />
            <span style={{ color:'#4ade80', fontSize:10.5, fontWeight:700, letterSpacing:.5 }}>ALL SYSTEMS LIVE</span>
          </div>
        </div>

        {/* Main hero */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'0 44px 0 44px' }}>

          {/* ECG line */}
          <div style={{ marginBottom:24, opacity:.5 }}>
            <svg width="200" height="50" viewBox="0 0 200 50" fill="none">
              <motion.path d={ECG_D} stroke={ac} strokeWidth="2" strokeLinecap="round" fill="none"
                strokeDasharray="300" strokeDashoffset="300"
                animate={{ strokeDashoffset:[300,0,300] }} transition={{ duration:3, repeat:Infinity, ease:'linear' }} />
            </svg>
          </div>

          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.3, duration:.7 }}>
            <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", color:'#fff', fontSize:46, fontWeight:700, lineHeight:1.1, marginBottom:16, letterSpacing:-1.5 }}>
              Healthcare<br/>
              <span style={{ background:`linear-gradient(90deg, ${ac}, #38bdf8, ${ac})`, backgroundSize:'200% 100%', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'glow 3s ease-in-out infinite' }}>
                Reimagined
              </span>
            </h1>
            <p style={{ color:'rgba(255,255,255,.45)', fontSize:15, lineHeight:1.7, maxWidth:360, marginBottom:32 }}>
              One secure platform to manage your entire hospital — patients, doctors, pharmacy, records, and billing.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.45 }}
            style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:40 }}>
            {STATS.map((s,i) => (
              <motion.div key={i} whileHover={{ y:-3 }}
                style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', borderRadius:14, padding:'14px 10px', textAlign:'center' }}>
                <div style={{ fontSize:20, marginBottom:4 }}>{s.icon}</div>
                <div style={{ color:'#fff', fontWeight:800, fontSize:17, fontFamily:"'Space Grotesk',sans-serif" }}>{s.val}</div>
                <div style={{ color:'rgba(255,255,255,.35)', fontSize:10.5, marginTop:2 }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Feature ticker */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.6 }}
            style={{ marginBottom:36 }}>
            <div style={{ fontSize:10, color:'rgba(255,255,255,.25)', letterSpacing:2, textTransform:'uppercase', marginBottom:10, fontWeight:600 }}>Platform Capabilities</div>
            <div style={{ overflow:'hidden', maskImage:'linear-gradient(90deg,transparent,black 10%,black 90%,transparent)' }}>
              <div style={{ display:'flex', gap:10, animation:'ticker 20s linear infinite', width:'max-content' }}>
                {[...FEATURES,...FEATURES].map((f,i) => (
                  <div key={i} className="feat-pill"><span>{f.icon}</span>{f.text}</div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Socials */}
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.75 }}>
            <div style={{ fontSize:10, color:'rgba(255,255,255,.25)', letterSpacing:2, textTransform:'uppercase', marginBottom:10, fontWeight:600 }}>Follow MediCare</div>
            <div style={{ display:'flex', gap:10 }}>
              {SOCIALS.map(s => (
                <button key={s.name} className="social-btn" style={{ background:s.bg }}
                  onClick={() => window.open(s.url,'_blank','noopener,noreferrer')} title={s.name}>{s.icon}</button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom copyright */}
        <div style={{ padding:'20px 44px', color:'rgba(255,255,255,.18)', fontSize:11 }}>
          © 2025 MediCare HMS · All rights reserved · Secure · HIPAA Compliant
        </div>
      </motion.div>

      {/* ══ RIGHT — Login card with 3D parallax ══ */}
      <div style={{ width:'48%', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', position:'relative', zIndex:2 }}>

        {/* Glow behind card */}
        <motion.div style={{ position:'absolute', width:360, height:360, borderRadius:'50%', background:ac, opacity:.08, filter:'blur(80px)', transition:'background .6s' }}
          animate={{ scale:[1,1.05,1] }} transition={{ duration:6, repeat:Infinity, ease:'easeInOut' }} />

        <motion.div
          initial={{ opacity:0, y:32, scale:.96 }}
          animate={{ opacity:1, y:0, scale:1 }}
          transition={{ duration:.65, ease:[.22,1,.36,1], delay:.1 }}
          style={{
            width:'100%', maxWidth:430,
            background:'rgba(8,15,35,0.82)',
            backdropFilter:'blur(40px)',
            borderRadius:28,
            border:'1px solid rgba(255,255,255,.08)',
            boxShadow:`0 0 0 1px rgba(255,255,255,.03), 0 40px 80px rgba(0,0,0,.7), 0 0 80px ${ac}18`,
            overflow:'hidden',
            position:'relative',
          }}>

          {/* Card shimmer top bar */}
          <motion.div key={ac} initial={{ scaleX:0, originX:0 }} animate={{ scaleX:1 }}
            transition={{ duration:.6, delay:.2 }}
            style={{ height:3, background:`linear-gradient(90deg, ${ac}, #38bdf8, ${ac})`, backgroundSize:'200% 100%', animation:'glow 2s ease-in-out infinite' }} />

          <div style={{ padding:'30px 32px 28px' }}>

            {/* Card header */}
            <div style={{ marginBottom:26 }}>
              <motion.h2 initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} transition={{ delay:.25 }}
                style={{ color:'#fff', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:26, letterSpacing:-.5, marginBottom:6 }}>
                Access Portal
              </motion.h2>
              <div style={{ color:'rgba(255,255,255,.35)', fontSize:13 }}>
                Sign in to your MediCare HMS account
              </div>
              <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:.5, duration:.5 }}
                style={{ height:1.5, background:`linear-gradient(90deg,${ac},transparent)`, marginTop:16, originX:0 }} />
            </div>

            {/* Role selector */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:10, color:'rgba(255,255,255,.3)', letterSpacing:2, textTransform:'uppercase', fontWeight:600, marginBottom:9 }}>Select Role</div>
              <div style={{ display:'flex', gap:5 }}>
                {ROLES.map(r => (
                  <button key={r.key} className={`role-card${role.key===r.key?' active':''}`}
                    style={{ '--ac':r.color }}
                    onClick={() => { setRole(r); setErrs({}); setEmail(''); setPass(''); }}>
                    <span style={{ fontSize:20 }}>{r.emoji}</span>
                    <span style={{ fontSize:10, fontWeight:700, color: role.key===r.key ? r.color : 'rgba(255,255,255,.4)' }}>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Role hint */}
            <AnimatePresence mode="wait">
              <motion.div key={role.key}
                initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                transition={{ duration:.22 }}
                style={{ marginBottom:20, overflow:'hidden' }}>
                <div style={{ padding:'9px 13px', background:`${ac}15`, border:`1px solid ${ac}30`, borderRadius:11, display:'flex', alignItems:'center', gap:9 }}>
                  <div style={{ width:7, height:7, borderRadius:'50%', background:ac, flexShrink:0, boxShadow:`0 0 8px ${ac}` }} />
                  <span style={{ fontSize:12, color:'rgba(255,255,255,.55)' }}>
                    {role.label} — {role.sub}. Demo password: <code style={{ background:'rgba(255,255,255,.08)', padding:'1px 5px', borderRadius:4, fontSize:11.5, color:'rgba(255,255,255,.75)' }}>password123</code>
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {errs.general && (
                <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                  style={{ background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.3)', borderRadius:11, padding:'10px 14px', marginBottom:16, fontSize:13, color:'#f87171', display:'flex', alignItems:'center', gap:8 }}>
                  ⚠️ {errs.general}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} autoComplete="off">
              {/* Email */}
              <div style={{ marginBottom:13 }}>
                <label style={{ display:'block', fontSize:10.5, fontWeight:700, color:'rgba(255,255,255,.4)', letterSpacing:1, textTransform:'uppercase', marginBottom:6 }}>Email Address</label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:15, opacity:.4, pointerEvents:'none' }}>✉</span>
                  <input className={`inp${errs.email?' err':''}`} type="email" name="hms-login-email" autoComplete="new-password"
                    placeholder="Enter your email" value={email}
                    onChange={e => { setEmail(e.target.value); setErrs(er => ({...er,email:''})); }} />
                </div>
                {errs.email && <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ fontSize:11, color:'#f87171', marginTop:4 }}>{errs.email}</motion.div>}
              </div>

              {/* Password */}
              <div style={{ marginBottom:18 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <label style={{ fontSize:10.5, fontWeight:700, color:'rgba(255,255,255,.4)', letterSpacing:1, textTransform:'uppercase' }}>Password</label>
                  <span style={{ fontSize:12, color:ac, cursor:'pointer', fontWeight:600 }}>Forgot password?</span>
                </div>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:15, opacity:.4, pointerEvents:'none' }}>🔑</span>
                  <input className={`inp${errs.pass?' err':''}`} type={showP?'text':'password'} name="hms-login-pass" autoComplete="new-password"
                    placeholder="Enter password" value={pass} style={{ paddingRight:44 }}
                    onChange={e => { setPass(e.target.value); setErrs(er => ({...er,pass:''})); }} />
                  <button type="button" onClick={() => setShowP(p=>!p)}
                    style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,.35)', fontSize:14, padding:3, transition:'color .2s' }}
                    onMouseEnter={e=>e.currentTarget.style.color=ac} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.35)'}>
                    {showP?'🙈':'👁️'}
                  </button>
                </div>
                {errs.pass && <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ fontSize:11, color:'#f87171', marginTop:4 }}>{errs.pass}</motion.div>}
              </div>

              {/* Submit */}
              <AnimatePresence mode="wait">
                {step === 'success' ? (
                  <motion.div key="ok" initial={{ scale:.9, opacity:0 }} animate={{ scale:1, opacity:1 }}
                    style={{ padding:'14px', borderRadius:14, background:'linear-gradient(135deg,#059669,#34d399)', color:'#fff', fontWeight:800, fontSize:15, textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                    <motion.span animate={{ rotate:[0,360] }} transition={{ duration:.5 }}>✅</motion.span>
                    Access Granted — Entering Dashboard…
                  </motion.div>
                ) : step === 'error' ? (
                  <motion.div key="err" initial={{ x:-8 }} animate={{ x:[0,-8,8,-6,6,-4,4,0] }} transition={{ duration:.4 }}
                    style={{ padding:'14px', borderRadius:14, background:'rgba(239,68,68,.15)', border:'1px solid rgba(239,68,68,.3)', color:'#f87171', fontWeight:700, fontSize:14, textAlign:'center' }}>
                    ❌ Authentication Failed
                  </motion.div>
                ) : (
                  <motion.button key="btn" type="submit" disabled={step==='loading'}
                    whileHover={{ scale: step==='loading'?1:1.01 }}
                    whileTap={{ scale:.98 }}
                    style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background:`linear-gradient(135deg,${ac},${role.dark})`, color:'#fff', fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:15, cursor: step==='loading'?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:9, boxShadow:`0 10px 30px ${ac}40`, opacity: step==='loading'?.75:1, transition:'opacity .2s' }}>
                    {step==='loading'
                      ? <><div style={{ width:18,height:18,border:'2.5px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite' }} /> Authenticating…</>
                      : <><span style={{ fontSize:16 }}>🔐</span> Sign In as {role.label} <motion.span animate={{ x:[0,4,0] }} transition={{ repeat:Infinity,duration:1.4 }}>→</motion.span></>
                    }
                  </motion.button>
                )}
              </AnimatePresence>
            </form>

            {/* Footer */}
            <div style={{ marginTop:20, paddingTop:18, borderTop:'1px solid rgba(255,255,255,.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ fontSize:12.5, color:'rgba(255,255,255,.3)' }}>
                No account? <Link to="/register" style={{ color:ac, fontWeight:700, textDecoration:'none' }}>Register →</Link>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                {['🔒','🛡️','✅'].map((i,k) => (
                  <div key={k} style={{ width:27,height:27,borderRadius:8,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13 }}>{i}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom color strip */}
          <motion.div key={ac+'-strip'} initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ duration:.5 }}
            style={{ height:3, background:`linear-gradient(90deg,transparent,${ac},#38bdf8,${ac},transparent)`, originX:.5 }} />
        </motion.div>
      </div>

      <SupportBot themeColor={ac} />
      {/* ══ 24/7 Support bubble ══ */}
      <SupportBubble color={ac} />
    </div>
  );
}

/* ─── Floating support chat bubble ─── */
function SupportBubble({ color }) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const send = () => {
    if (!msg.trim()) return;
    setSent(true);
    setTimeout(() => { setOpen(false); setSent(false); setMsg(''); }, 2500);
  };

  return (
    <div style={{ position:'fixed', bottom:28, right:28, zIndex:999 }}>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, scale:.9, y:10 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:.9, y:10 }}
            style={{ position:'absolute', bottom:70, right:0, width:300, background:'rgba(8,15,35,.95)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,.1)', borderRadius:20, boxShadow:'0 20px 60px rgba(0,0,0,.5)', overflow:'hidden' }}>

            <div style={{ background:`linear-gradient(135deg,${color},#0ea5e9)`, padding:'14px 16px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                  <div style={{ width:34,height:34,borderRadius:'50%',background:'rgba(255,255,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16 }}>🩺</div>
                  <div>
                    <div style={{ color:'#fff',fontWeight:800,fontSize:13 }}>MediCare Support</div>
                    <div style={{ display:'flex',alignItems:'center',gap:5,marginTop:2 }}>
                      <motion.div animate={{ scale:[1,1.4,1] }} transition={{ duration:1.5,repeat:Infinity }}
                        style={{ width:6,height:6,borderRadius:'50%',background:'#4ade80' }} />
                      <span style={{ color:'rgba(255,255,255,.75)',fontSize:10 }}>Online · Avg reply &lt;2 min</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} style={{ background:'rgba(255,255,255,.15)',border:'none',borderRadius:'50%',width:26,height:26,cursor:'pointer',color:'#fff',fontSize:12,display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>
              </div>
            </div>

            <div style={{ padding:'14px 16px' }}>
              {sent ? (
                <div style={{ textAlign:'center',padding:'20px 0' }}>
                  <div style={{ fontSize:34,marginBottom:8 }}>✅</div>
                  <div style={{ fontWeight:800,color:'#fff',marginBottom:4 }}>Message Sent!</div>
                  <div style={{ fontSize:12,color:'rgba(255,255,255,.4)' }}>Team will reply within 2 minutes.</div>
                </div>
              ) : (
                <>
                  {[['📞','+1-800-MEDICARE','24 × 7'],['📧','support@medicarehms.com','Reply &lt;1hr'],['💬','Live Chat','Avg &lt;2 min']].map(([i,v,s]) => (
                    <div key={v} style={{ display:'flex',gap:9,padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,.06)' }}>
                      <div style={{ width:30,height:30,borderRadius:8,background:'rgba(255,255,255,.06)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0 }}>{i}</div>
                      <div><div style={{ fontSize:12,fontWeight:700,color:'#fff' }}>{v}</div><div style={{ fontSize:10.5,color:'rgba(255,255,255,.35)' }} dangerouslySetInnerHTML={{ __html:s }} /></div>
                    </div>
                  ))}
                  <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Describe your issue…"
                    style={{ width:'100%',height:68,marginTop:12,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:10,padding:'10px 12px',color:'#fff',fontFamily:"'Outfit',sans-serif",fontSize:12.5,outline:'none',resize:'none',boxSizing:'border-box' }} />
                  <button onClick={send} style={{ width:'100%',marginTop:8,padding:'10px',borderRadius:10,border:'none',background:`linear-gradient(135deg,${color},#0ea5e9)`,color:'#fff',fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,cursor:'pointer' }}>
                    Send →
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button onClick={() => setOpen(o=>!o)}
        animate={{ scale:[1,1.06,1] }} transition={{ repeat:Infinity, duration:2.5, ease:'easeInOut' }}
        style={{ width:56,height:56,borderRadius:'50%',background:`linear-gradient(135deg,${color},#0ea5e9)`,border:'3px solid rgba(255,255,255,.15)',cursor:'pointer',fontSize:22,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 8px 28px ${color}60` }}>
        {open?'✕':'💬'}
      </motion.button>
      {!open && (
        <div style={{ position:'absolute',top:0,right:0,width:16,height:16,borderRadius:'50%',background:'#ef4444',border:'2.5px solid #020817',display:'flex',alignItems:'center',justifyContent:'center' }}>
          <span style={{ fontSize:7,color:'#fff',fontWeight:900 }}>!</span>
        </div>
      )}
    </div>
  );
}
