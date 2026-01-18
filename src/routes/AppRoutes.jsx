import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import Leads from "../pages/Leads";
import ActivityLogs from "../pages/ActivityLogs";
import ProtectedRoute from "../components/ProtectedRoute";
import FollowUp from "../pages/FollowUp";
import Users from "../pages/Users";
import Profile from "../pages/Profile";
import LeadView from "../pages/LeadView";
import Campaigns from "../pages/Campaigns";
import EmailTemplate from "../pages/EmailTemplate";
import EmailTemplateCreate from "../components/EmailTemplateCreate";
import EmailTemplateEdit from "../pages/EmailTemplateEdit";
import EmailTemplateView from "../components/EmailTemplateView";
import CampaignView from "../pages/CampaignView";
import FollowUpCreate from "../pages/FollowUpCreate";
import ForgotPassword from "../components/ForgotPassword";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/users" element={<Users />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/leads/:id" element={<LeadView />} />
          <Route path="/follow-up" element={<FollowUp />} />
          <Route path="/follow-up/create" element={<FollowUpCreate />} />
          <Route path="/activity-logs" element={<ActivityLogs />} />
          <Route path="/email-templates" element={<EmailTemplate />} />
          <Route
            path="/email-templates/create"
            element={<EmailTemplateCreate />}
          />
          <Route path="/email-templates/:id" element={<EmailTemplateView />} />
          <Route
            path="/email-templates/:templateId/edit"
            element={<EmailTemplateEdit />}
          />
          <Route path="/campaigns/:id" element={<CampaignView />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
