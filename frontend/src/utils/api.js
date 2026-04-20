// import axios from 'axios';

// const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_BASE,
//   headers: { 'Content-Type': 'application/json' },
//   timeout: 15000,
// });

// // Request interceptor – attach JWT
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('hms_token');
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor – handle 401
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('hms_token');
//       localStorage.removeItem('hms_user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // ── AUTH ────────────────────────────────────────────────────────────
// export const authAPI = {
//   login: (data) => api.post('/auth/login', data),
//   register: (data) => api.post('/auth/register', data),
//   getMe: () => api.get('/auth/me'),
//   updateProfile: (data) => api.put('/auth/profile', data),
//   changePassword: (data) => api.put('/auth/change-password', data),
//   logout: () => api.post('/auth/logout'),
// };

// // ── USERS ────────────────────────────────────────────────────────────
// export const usersAPI = {
//   getAll: (params) => api.get('/users', { params }),
//   getOne: (id) => api.get(`/users/${id}`),
//   approve: (id) => api.put(`/users/${id}/approve`),
//   update: (id, data) => api.put(`/users/${id}`, data),
//   delete: (id) => api.delete(`/users/${id}`),
//   getStats: () => api.get('/users/stats'),
// };

// // ── APPOINTMENTS ─────────────────────────────────────────────────────
// export const appointmentsAPI = {
//   getAll: (params) => api.get('/appointments', { params }),
//   create: (data) => api.post('/appointments', data),
//   update: (id, data) => api.put(`/appointments/${id}`, data),
//   delete: (id) => api.delete(`/appointments/${id}`),
//   getSlots: (doctorId, date) => api.get(`/appointments/slots/${doctorId}/${date}`),
// };

// // ── MEDICINES ─────────────────────────────────────────────────────────
// export const medicinesAPI = {
//   getAll: (params) => api.get('/medicines', { params }),
//   getOne: (id) => api.get(`/medicines/${id}`),
//   create: (data) => api.post('/medicines', data),
//   update: (id, data) => api.put(`/medicines/${id}`, data),
//   delete: (id) => api.delete(`/medicines/${id}`),
// };

// // ── ORDERS ────────────────────────────────────────────────────────────
// export const ordersAPI = {
//   getAll: (params) => api.get('/orders', { params }),
//   create: (data, isFormData = false) => {
//     const cfg = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
//     return api.post('/orders', data, cfg);
//   },
//   updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
// };

// // ── RECORDS ───────────────────────────────────────────────────────────
// export const recordsAPI = {
//   getAll: (params) => api.get('/records', { params }),
//   getOne: (id) => api.get(`/records/${id}`),
//   create: (formData) => api.post('/records', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
//   update: (id, data) => api.put(`/records/${id}`, data),
//   delete: (id) => api.delete(`/records/${id}`),
// };

// // ── REMINDERS ─────────────────────────────────────────────────────────
// export const remindersAPI = {
//   getAll: (params) => api.get('/reminders', { params }),
//   create: (data) => api.post('/reminders', data),
//   update: (id, data) => api.put(`/reminders/${id}`, data),
//   logAdherence: (id, data) => api.post(`/reminders/${id}/adherence`, data),
//   delete: (id) => api.delete(`/reminders/${id}`),
// };

// // ── ALERTS ────────────────────────────────────────────────────────────
// export const alertsAPI = {
//   getAll: (params) => api.get('/alerts', { params }),
//   create: (data) => api.post('/alerts', data),
//   resolve: (id, data) => api.put(`/alerts/${id}/resolve`, data),
// };

// // ── ANALYTICS ─────────────────────────────────────────────────────────
// export const analyticsAPI = {
//   getDashboard: () => api.get('/analytics'),
// };

// export default api;

// import axios from 'axios';

// const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_BASE,
//   headers: { 'Content-Type': 'application/json' },
//   timeout: 15000,
// });

// // Request interceptor – attach JWT
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('hms_token');
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor – handle 401
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('hms_token');
//       localStorage.removeItem('hms_user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // ── AUTH ────────────────────────────────────────────────────────────
// export const authAPI = {
//   login: (data) => api.post('/auth/login', data),
//   register: (data) => api.post('/auth/register', data),
//   getMe: () => api.get('/auth/me'),
//   updateProfile: (data) => api.put('/auth/profile', data),
//   changePassword: (data) => api.put('/auth/change-password', data),
//   logout: () => api.post('/auth/logout'),
// };

// // ── USERS ────────────────────────────────────────────────────────────
// export const usersAPI = {
//   getAll: (params) => api.get('/users', { params }),
//   getOne: (id) => api.get(`/users/${id}`),
//   approve: (id) => api.put(`/users/${id}/approve`),
//   update: (id, data) => api.put(`/users/${id}`, data),
//   delete: (id) => api.delete(`/users/${id}`),
//   getStats: () => api.get('/users/stats'),
// };

// // ── APPOINTMENTS ─────────────────────────────────────────────────────
// export const appointmentsAPI = {
//   getAll: (params) => api.get('/appointments', { params }),
//   create: (data) => api.post('/appointments', data),
//   update: (id, data) => api.put(`/appointments/${id}`, data),
//   delete: (id) => api.delete(`/appointments/${id}`),
//   getSlots: (doctorId, date) => api.get(`/appointments/slots/${doctorId}/${date}`),
// };

// // ── MEDICINES ─────────────────────────────────────────────────────────
// export const medicinesAPI = {
//   getAll: (params) => api.get('/medicines', { params }),
//   getOne: (id) => api.get(`/medicines/${id}`),
//   create: (data) => api.post('/medicines', data),
//   update: (id, data) => api.put(`/medicines/${id}`, data),
//   delete: (id) => api.delete(`/medicines/${id}`),
// };

// // ── ORDERS ────────────────────────────────────────────────────────────
// export const ordersAPI = {
//   getAll: (params) => api.get('/orders', { params }),
//   create: (data, isFormData = false) => {
//     const cfg = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
//     return api.post('/orders', data, cfg);
//   },
//   updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
// };

// // ── RECORDS ───────────────────────────────────────────────────────────
// export const recordsAPI = {
//   getAll: (params) => api.get('/records', { params }),
//   getOne: (id) => api.get(`/records/${id}`),
//   create: (formData) => api.post('/records', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
//   update: (id, data) => api.put(`/records/${id}`, data),
//   delete: (id) => api.delete(`/records/${id}`),
// };

// // ── REMINDERS ─────────────────────────────────────────────────────────
// export const remindersAPI = {
//   getAll: (params) => api.get('/reminders', { params }),
//   create: (data) => api.post('/reminders', data),
//   update: (id, data) => api.put(`/reminders/${id}`, data),
//   logAdherence: (id, data) => api.post(`/reminders/${id}/adherence`, data),
//   delete: (id) => api.delete(`/reminders/${id}`),
// };

// // ── ALERTS ────────────────────────────────────────────────────────────
// export const alertsAPI = {
//   getAll: (params) => api.get('/alerts', { params }),
//   create: (data) => api.post('/alerts', data),
//   resolve: (id, data) => api.put(`/alerts/${id}/resolve`, data),
// };

// // ── ANALYTICS ─────────────────────────────────────────────────────────
// export const analyticsAPI = {
//   getDashboard: () => api.get('/analytics'),
// };

// export default api;
// // ── PAYMENTS ──────────────────────────────────────────────────────────
// export const paymentsAPI = {
//   initiate: (data) => api.post('/payments/initiate', data),
//   confirm: (data) => api.post('/payments/confirm', data),
//   history: () => api.get('/payments/history'),
// };


// import axios from 'axios';

// const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_BASE,
//   headers: { 'Content-Type': 'application/json' },
//   timeout: 15000,
// });

// // Request interceptor – attach JWT
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('hms_token');
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor – handle 401
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('hms_token');
//       localStorage.removeItem('hms_user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // ── AUTH ────────────────────────────────────────────────────────────
// export const authAPI = {
//   login: (data) => api.post('/auth/login', data),
//   register: (data) => api.post('/auth/register', data),
//   getMe: () => api.get('/auth/me'),
//   updateProfile: (data) => api.put('/auth/profile', data),
//   changePassword: (data) => api.put('/auth/change-password', data),
//   logout: () => api.post('/auth/logout'),
// };

// // ── USERS ────────────────────────────────────────────────────────────
// export const usersAPI = {
//   getAll: (params) => api.get('/users', { params }),
//   getOne: (id) => api.get(`/users/${id}`),
//   approve: (id) => api.put(`/users/${id}/approve`),
//   update: (id, data) => api.put(`/users/${id}`, data),
//   delete: (id) => api.delete(`/users/${id}`),
//   getStats: () => api.get('/users/stats'),
// };

// // ── APPOINTMENTS ─────────────────────────────────────────────────────
// export const appointmentsAPI = {
//   getAll: (params) => api.get('/appointments', { params }),
//   create: (data) => api.post('/appointments', data),
//   update: (id, data) => api.put(`/appointments/${id}`, data),
//   delete: (id) => api.delete(`/appointments/${id}`),
//   getSlots: (doctorId, date) => api.get(`/appointments/slots/${doctorId}/${date}`),
// };

// // ── MEDICINES ─────────────────────────────────────────────────────────
// export const medicinesAPI = {
//   getAll: (params) => api.get('/medicines', { params }),
//   getOne: (id) => api.get(`/medicines/${id}`),
//   create: (data) => api.post('/medicines', data),
//   update: (id, data) => api.put(`/medicines/${id}`, data),
//   delete: (id) => api.delete(`/medicines/${id}`),
// };

// // ── ORDERS ────────────────────────────────────────────────────────────
// export const ordersAPI = {
//   getAll: (params) => api.get('/orders', { params }),
//   create: (data, isFormData = false) => {
//     const cfg = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
//     return api.post('/orders', data, cfg);
//   },
//   updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
// };

// // ── RECORDS ───────────────────────────────────────────────────────────
// export const recordsAPI = {
//   getAll: (params) => api.get('/records', { params }),
//   getOne: (id) => api.get(`/records/${id}`),
//   create: (formData) => api.post('/records', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
//   update: (id, data) => api.put(`/records/${id}`, data),
//   delete: (id) => api.delete(`/records/${id}`),
// };

// // ── REMINDERS ─────────────────────────────────────────────────────────
// export const remindersAPI = {
//   getAll: (params) => api.get('/reminders', { params }),
//   create: (data) => api.post('/reminders', data),
//   update: (id, data) => api.put(`/reminders/${id}`, data),
//   logAdherence: (id, data) => api.post(`/reminders/${id}/adherence`, data),
//   delete: (id) => api.delete(`/reminders/${id}`),
// };

// // ── ALERTS ────────────────────────────────────────────────────────────
// export const alertsAPI = {
//   getAll: (params) => api.get('/alerts', { params }),
//   create: (data) => api.post('/alerts', data),
//   resolve: (id, data) => api.put(`/alerts/${id}/resolve`, data),
// };

// // ── ANALYTICS ─────────────────────────────────────────────────────────
// export const analyticsAPI = {
//   getDashboard: () => api.get('/analytics'),
// };

// export default api;
// // ── PAYMENTS ──────────────────────────────────────────────────────────
// export const paymentsAPI = {
//   initiate: (data) => api.post('/payments/initiate', data),
//   confirm: (data) => api.post('/payments/confirm', data),
//   history: () => api.get('/payments/history'),
// };

// // ── FACILITY (Rooms, Schedules, Chat) ─────────────────────────────────
// export const facilityAPI = {
//   getRooms: (params) => api.get('/facility/rooms', { params }),
//   createRoom: (data) => api.post('/facility/rooms', data),
//   updateRoom: (id, data) => api.put(`/facility/rooms/${id}`, data),
//   deleteRoom: (id) => api.delete(`/facility/rooms/${id}`),
//   getSchedules: (params) => api.get('/facility/schedules', { params }),
//   createSchedule: (data) => api.post('/facility/schedules', data),
//   updateSchedule: (id, data) => api.put(`/facility/schedules/${id}`, data),
//   deleteSchedule: (id) => api.delete(`/facility/schedules/${id}`),
//   getMessages: (params) => api.get('/facility/chat/messages', { params }),
//   sendMessage: (data) => api.post('/facility/chat/send', data),
//   getChatUsers: () => api.get('/facility/chat/users'),
// };

// import axios from 'axios';

// const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_BASE,
//   headers: { 'Content-Type': 'application/json' },
//   timeout: 15000,
// });

// // Request interceptor – attach JWT
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('hms_token');
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor – handle 401
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('hms_token');
//       localStorage.removeItem('hms_user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // ── AUTH ────────────────────────────────────────────────────────────
// export const authAPI = {
//   login: (data) => api.post('/auth/login', data),
//   register: (data) => api.post('/auth/register', data),
//   getMe: () => api.get('/auth/me'),
//   updateProfile: (data) => api.put('/auth/profile', data),
//   changePassword: (data) => api.put('/auth/change-password', data),
//   logout: () => api.post('/auth/logout'),
// };

// // ── USERS ────────────────────────────────────────────────────────────
// export const usersAPI = {
//   getAll: (params) => api.get('/users', { params }),
//   getOne: (id) => api.get(`/users/${id}`),
//   approve: (id) => api.put(`/users/${id}/approve`),
//   update: (id, data) => api.put(`/users/${id}`, data),
//   delete: (id) => api.delete(`/users/${id}`),
//   getStats: () => api.get('/users/stats'),
// };

// // ── APPOINTMENTS ─────────────────────────────────────────────────────
// export const appointmentsAPI = {
//   getAll: (params) => api.get('/appointments', { params }),
//   create: (data) => api.post('/appointments', data),
//   update: (id, data) => api.put(`/appointments/${id}`, data),
//   delete: (id) => api.delete(`/appointments/${id}`),
//   getSlots: (doctorId, date) => api.get(`/appointments/slots/${doctorId}/${date}`),
// };

// // ── MEDICINES ─────────────────────────────────────────────────────────
// export const medicinesAPI = {
//   getAll: (params) => api.get('/medicines', { params }),
//   getOne: (id) => api.get(`/medicines/${id}`),
//   create: (data) => api.post('/medicines', data),
//   update: (id, data) => api.put(`/medicines/${id}`, data),
//   delete: (id) => api.delete(`/medicines/${id}`),
// };

// // ── ORDERS ────────────────────────────────────────────────────────────
// export const ordersAPI = {
//   getAll: (params) => api.get('/orders', { params }),
//   create: (data, isFormData = false) => {
//     const cfg = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
//     return api.post('/orders', data, cfg);
//   },
//   updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
// };

// // ── RECORDS ───────────────────────────────────────────────────────────
// export const recordsAPI = {
//   getAll: (params) => api.get('/records', { params }),
//   getOne: (id) => api.get(`/records/${id}`),
//   create: (formData) => api.post('/records', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
//   update: (id, data) => api.put(`/records/${id}`, data),
//   delete: (id) => api.delete(`/records/${id}`),
// };

// // ── REMINDERS ─────────────────────────────────────────────────────────
// export const remindersAPI = {
//   getAll: (params) => api.get('/reminders', { params }),
//   create: (data) => api.post('/reminders', data),
//   update: (id, data) => api.put(`/reminders/${id}`, data),
//   logAdherence: (id, data) => api.post(`/reminders/${id}/adherence`, data),
//   delete: (id) => api.delete(`/reminders/${id}`),
// };

// // ── ALERTS ────────────────────────────────────────────────────────────
// export const alertsAPI = {
//   getAll: (params) => api.get('/alerts', { params }),
//   create: (data) => api.post('/alerts', data),
//   resolve: (id, data) => api.put(`/alerts/${id}/resolve`, data),
// };

// // ── ANALYTICS ─────────────────────────────────────────────────────────
// export const analyticsAPI = {
//   getDashboard: () => api.get('/analytics'),
// };

// export default api;
// // ── PAYMENTS ──────────────────────────────────────────────────────────
// export const paymentsAPI = {
//   initiate: (data) => api.post('/payments/initiate', data),
//   confirm: (data) => api.post('/payments/confirm', data),
//   history: () => api.get('/payments/history'),
// };

// // ── FACILITY (Rooms, Schedules, Chat) ─────────────────────────────────
// export const facilityAPI = {
//   getRooms: (params) => api.get('/facility/rooms', { params }),
//   createRoom: (data) => api.post('/facility/rooms', data),
//   updateRoom: (id, data) => api.put(`/facility/rooms/${id}`, data),
//   deleteRoom: (id) => api.delete(`/facility/rooms/${id}`),
//   getSchedules: (params) => api.get('/facility/schedules', { params }),
//   createSchedule: (data) => api.post('/facility/schedules', data),
//   updateSchedule: (id, data) => api.put(`/facility/schedules/${id}`, data),
//   deleteSchedule: (id) => api.delete(`/facility/schedules/${id}`),
//   getMessages: (params) => api.get('/facility/chat/messages', { params }),
//   sendMessage: (data) => api.post('/facility/chat/send', data),
//   getChatUsers: () => api.get('/facility/chat/users'),
// };

// // ── LEAVES ────────────────────────────────────────────────────────────
// export const leavesAPI = {
//   getAll:     (params) => api.get('/leavetasks/leaves', { params }),
//   apply:      (data)   => api.post('/leavetasks/leaves', data),
//   review:     (id,data)=> api.put(`/leavetasks/leaves/${id}/review`, data),
//   cancel:     (id)     => api.put(`/leavetasks/leaves/${id}/cancel`),
//   getToday:   ()       => api.get('/leavetasks/leaves/today'),
// };

// // ── TASKS ─────────────────────────────────────────────────────────────
// export const tasksAPI = {
//   getAll:     (params) => api.get('/leavetasks/tasks', { params }),
//   create:     (data)   => api.post('/leavetasks/tasks', data),
//   update:     (id,data)=> api.put(`/leavetasks/tasks/${id}`, data),
//   delete:     (id)     => api.delete(`/leavetasks/tasks/${id}`),
// };


import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor – attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hms_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hms_token');
      localStorage.removeItem('hms_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── AUTH ────────────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  logout: () => api.post('/auth/logout'),
};

// ── USERS ────────────────────────────────────────────────────────────
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getOne: (id) => api.get(`/users/${id}`),
  approve: (id) => api.put(`/users/${id}/approve`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getStats: () => api.get('/users/stats'),
};

// ── APPOINTMENTS ─────────────────────────────────────────────────────
export const appointmentsAPI = {
  getAll: (params) => api.get('/appointments', { params }),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  delete: (id) => api.delete(`/appointments/${id}`),
  getSlots: (doctorId, date) => api.get(`/appointments/slots/${doctorId}/${date}`),
};

// ── MEDICINES ─────────────────────────────────────────────────────────
export const medicinesAPI = {
  getAll: (params) => api.get('/medicines', { params }),
  getOne: (id) => api.get(`/medicines/${id}`),
  create: (data) => api.post('/medicines', data),
  update: (id, data) => api.put(`/medicines/${id}`, data),
  delete: (id) => api.delete(`/medicines/${id}`),
};

// ── ORDERS ────────────────────────────────────────────────────────────
export const ordersAPI = {
  getAll: (params) => api.get('/orders', { params }),
  create: (data, isFormData = false) => {
    const cfg = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return api.post('/orders', data, cfg);
  },
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
};

// ── RECORDS ───────────────────────────────────────────────────────────
export const recordsAPI = {
  getAll: (params) => api.get('/records', { params }),
  getOne: (id) => api.get(`/records/${id}`),
  create: (formData) => api.post('/records', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/records/${id}`, data),
  delete: (id) => api.delete(`/records/${id}`),
};

// ── REMINDERS ─────────────────────────────────────────────────────────
export const remindersAPI = {
  getAll: (params) => api.get('/reminders', { params }),
  create: (data) => api.post('/reminders', data),
  update: (id, data) => api.put(`/reminders/${id}`, data),
  logAdherence: (id, data) => api.post(`/reminders/${id}/adherence`, data),
  delete: (id) => api.delete(`/reminders/${id}`),
};

// ── ALERTS ────────────────────────────────────────────────────────────
export const alertsAPI = {
  getAll: (params) => api.get('/alerts', { params }),
  create: (data) => api.post('/alerts', data),
  resolve: (id, data) => api.put(`/alerts/${id}/resolve`, data),
};

// ── ANALYTICS ─────────────────────────────────────────────────────────
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics'),
};

export default api;
// ── PAYMENTS ──────────────────────────────────────────────────────────
export const paymentsAPI = {
  initiate: (data) => api.post('/payments/initiate', data),
  confirm: (data) => api.post('/payments/confirm', data),
  history: () => api.get('/payments/history'),
};

// ── FACILITY (Rooms, Schedules, Chat) ─────────────────────────────────
export const facilityAPI = {
  getRooms: (params) => api.get('/facility/rooms', { params }),
  createRoom: (data) => api.post('/facility/rooms', data),
  updateRoom: (id, data) => api.put(`/facility/rooms/${id}`, data),
  deleteRoom: (id) => api.delete(`/facility/rooms/${id}`),
  getSchedules: (params) => api.get('/facility/schedules', { params }),
  createSchedule: (data) => api.post('/facility/schedules', data),
  updateSchedule: (id, data) => api.put(`/facility/schedules/${id}`, data),
  deleteSchedule: (id) => api.delete(`/facility/schedules/${id}`),
  getMessages: (params) => api.get('/facility/chat/messages', { params }),
  sendMessage: (data) => api.post('/facility/chat/send', data),
  getChatUsers: () => api.get('/facility/chat/users'),
};

// ── LEAVES ────────────────────────────────────────────────────────────
export const leavesAPI = {
  getAll:     (params) => api.get('/leavetasks/leaves', { params }),
  apply:      (data)   => api.post('/leavetasks/leaves', data),
  review:     (id,data)=> api.put(`/leavetasks/leaves/${id}/review`, data),
  cancel:     (id)     => api.put(`/leavetasks/leaves/${id}/cancel`),
  getToday:   ()       => api.get('/leavetasks/leaves/today'),
};

// ── TASKS ─────────────────────────────────────────────────────────────
export const tasksAPI = {
  getAll:     (params) => api.get('/leavetasks/tasks', { params }),
  create:     (data)   => api.post('/leavetasks/tasks', data),
  update:     (id,data)=> api.put(`/leavetasks/tasks/${id}`, data),
  delete:     (id)     => api.delete(`/leavetasks/tasks/${id}`),
};

// ── SALARY ────────────────────────────────────────────────────────────
export const salaryAPI = {
  getAll:           (params)  => api.get('/salary', { params }),
  getMySummary:     ()        => api.get('/salary/my-summary'),
  generate:         (data)    => api.post('/salary/generate', data),
  bulkGenerate:     (data)    => api.post('/salary/bulk', data),
  credit:           (id)      => api.put(`/salary/${id}/credit`),
  update:           (id,data) => api.put(`/salary/${id}`, data),
};
