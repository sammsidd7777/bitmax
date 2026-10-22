
import { Routes, Route, Navigate } from "react-router-dom";

// Auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Verification from "../pages/auth/VerifyOTP";
import ResetPassword from "../pages/auth/ResetPassword";

// Layouts
import UserLayout from "../layout/UserLayout";
import AgentLayout from "../layout/AgentLayout";
import AdminLayout from "../layout/AdminLayout";
import Home  from "../pages/Home"

// User pages
import UserDashboard from "../pages/users/UserDashboard";
import UserProfile from "../pages/users/UserProfile";
import CreateTicket from "../pages/users/CreateTicket";
import MyTickets from "../pages/users/MyTickets";
import TicketDetail from "../pages/users/TicketDetails";

// Agent pages
import AgentDashboard from "../pages/agent/AgentDashboard";
import AssignedTickets from "../pages/agent/AssignedTickets";

// Admin pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AllTickets from "../pages/admin/AllTickets";
import UnassignedTickets from "../pages/admin/UnassignedTickets";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageAgents from "../pages/admin/ManageAgents";
import ManageCategories from "../pages/admin/ManageCategories";
// import Reports from "../pages/admin/Reports";

function AppRoutes() {
  return (
    <Routes>
      {/* Authentication */}
     <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />
      <Route
        path="/verification"
        element={<Verification />}
      />
      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      {/* User routes */}
      <Route path="/user" element={<UserLayout />}>
        <Route
          index
          element={<Navigate to="dashboard" replace />}
        />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="create-ticket" element={<CreateTicket />} />
        <Route path="my-tickets" element={<MyTickets />} />
        <Route
          path="tickets/:ticketId"
          element={<TicketDetail />}
        />
      </Route>

      {/* Agent routes */}
      <Route path="/agent" element={<AgentLayout />}>
        <Route
          index
          element={<Navigate to="dashboard" replace />}
        />
        <Route path="dashboard" element={<AgentDashboard />} />
        <Route
          path="my-tickets"
          element={<AssignedTickets />}
        />
        <Route
          path="tickets/:ticketId"
          element={<TicketDetail />}
        />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route
          index
          element={<Navigate to="dashboard" replace />}
        />
        <Route
          path="dashboard"
          element={<AdminDashboard />}
        />
        <Route path="tickets" element={<AllTickets />} />
        <Route
          path="unassigned"
          element={<UnassignedTickets />}
        />
        <Route
          path="tickets/:ticketId"
          element={<TicketDetail />}
        />
        <Route path="users" element={<ManageUsers />} />
        <Route path="agents" element={<ManageAgents />} />
        <Route
          path="categories"
          element={<ManageCategories />}
        />
        {/* <Route path="reports" element={<Reports />} /> */}
      </Route>

      {/* Invalid route */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;
