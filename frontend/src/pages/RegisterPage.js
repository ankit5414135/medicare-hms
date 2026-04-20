import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'patient', phone: '', department: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password || form.password.length < 6) errs.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await authAPI.register({ name: form.name, email: form.email, password: form.password, role: form.role, phone: form.phone, department: form.department });
      toast.success('Registered! Awaiting admin approval.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  };

  const set = (field) => (e) => { setForm(f => ({ ...f, [field]: e.target.value })); setErrors(er => ({ ...er, [field]: '' })); };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0c1f4a 0%,#1a3a7a 40%,#0c4a6e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ background: '#fff', borderRadius: 20, padding: '36px 34px', width: '100%', maxWidth: 480, boxShadow: '0 32px 80px rgba(0,0,0,.3)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg,#1648c9,#0891b2)', borderRadius: 14, margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🏥</div>
          <h1 style={{ fontSize: 20, fontWeight: 900 }}>Create Account</h1>
          <p style={{ color: '#94a3b8', fontSize: 12.5, marginTop: 3 }}>Register for MediCare HMS · Admin approval required</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className={`form-input${errors.name?' error':''}`} value={form.name} onChange={set('name')} placeholder="Your full name" />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Role *</label>
              <select className="form-input" value={form.role} onChange={set('role')}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="pharmacist">Pharmacist</option>
                <option value="wardboy">Ward Boy</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input className={`form-input${errors.email?' error':''}`} type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input className={`form-input${errors.password?' error':''}`} type="password" value={form.password} onChange={set('password')} placeholder="Min 6 characters" />
              {errors.password && <div className="error-text">{errors.password}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input className={`form-input${errors.confirmPassword?' error':''}`} type="password" value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Repeat password" />
              {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={form.phone} onChange={set('phone')} placeholder="+1-555-0000" />
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input className="form-input" value={form.department} onChange={set('department')} placeholder="e.g. Cardiology" />
            </div>
          </div>
          <div style={{ background: '#fffbeb', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: '#92400e', marginBottom: 16, display: 'flex', gap: 8 }}>
            <span>⚠️</span>
            <span>Your account will be reviewed by an administrator before you can log in.</span>
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? <><span className="spinner-sm" /> Registering…</> : '✅ Create Account'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: '#94a3b8' }}>
          Already have an account? <Link to="/login" style={{ color: '#1648c9', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
}