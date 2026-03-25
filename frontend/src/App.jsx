import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Help from './pages/Help';
import PagesLayout from './components/Layout/PagesLayout';
import Login from './components/auth/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import WorkPlaceHome from './components/componetns/WorkPlaceHome';
import AcceptInvite from './components/componetns/AcceptInvite';
import NotFoundPage from './pages/NotFoundPage'

const App = () => {
  return (
    <Routes>
      {/* Public Routes with Layout */}
      <Route element={<PagesLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/accept-invite" element={<AcceptInvite />} />

      {/* Protected Workspace Routes with Nested Structure */}
      <Route element={<ProtectedRoute />}>
        {/* Main workspace routes with dynamic workspace ID */}
        <Route path="/workspace/:workspaceId" element={<WorkPlaceHome />}>
          {/* These routes will be handled by the WorkPlaceHome component's internal routing */}
        </Route>
        <Route path="/workspace/:workspaceId/projects" element={<WorkPlaceHome />} />
        <Route path="/workspace/:workspaceId/teams" element={<WorkPlaceHome />} />
        <Route path="/workspace/:workspaceId/members" element={<WorkPlaceHome />} />
        <Route path="/workspace/:workspaceId/analytics" element={<WorkPlaceHome />} />
        <Route path="/workspace/:workspaceId/global-pool" element={<WorkPlaceHome />} />
        <Route path="/workspace/:workspaceId/invites" element={<WorkPlaceHome />} />
        <Route path="/workspace/:workspaceId/profile" element={<WorkPlaceHome />} />
        <Route path="/workspace/:workspaceId/tasks" element={<WorkPlaceHome />} />

        {/* Redirect root workspaces to first workspace (handled by component) */}
        <Route path="/workspaces" element={<WorkPlaceHome />} />
        <Route path="/dashboard" element={<Navigate to="/workspaces" replace />} />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};



export default App;
