// import axios from 'axios';

// const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5002';

// export const api = axios.create({ baseURL: API_BASE });

// api.interceptors.request.use((cfg) => {
//   const token = localStorage.getItem('token');
//   const workspaceId = localStorage.getItem('activeWorkspaceId');
//   if (token) cfg.headers.Authorization = `Bearer ${token}`;
//   if (workspaceId) cfg.headers['x-workspace-id'] = workspaceId;
//   return cfg;
// });

// export const formatDate = (iso) =>
//   iso ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

// export const daysLeft = (deadline) => {
//   if (!deadline) return null;
//   const diff = Math.ceil((new Date(deadline) - Date.now()) / 86400000);
//   return diff;
// };
