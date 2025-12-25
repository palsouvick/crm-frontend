import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from "../auth/Login";
import Register from "../auth/Register";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import Leads from "../pages/Leads";
import ActivityLogs from "../pages/ActivityLogs";
import ProtectedRoute from "../components/ProtectedRoute";
import FollowUp from '../pages/FollowUp';
import Users from '../pages/Users';
import Profile from '../pages/Profile';
import LeadView from '../pages/LeadView';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
       <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users" element={<Users/>}/>
        <Route path="/customers" element={<Customers />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/leads/:id" element={<LeadView />} />
        <Route path="/follow-up" element={<FollowUp />} />
        <Route path="/activity-logs" element={<ActivityLogs />} />
      </Route>
      </Routes>
    </Router>
  )
}

export default AppRoutes