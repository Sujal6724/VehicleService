import { Routes, Route, Navigate } from "react-router-dom";

import Login                   from "../pages/Login";
import Register                from "../pages/Register";
import ForgotPassword          from "../pages/ForgotPassword";
import OtpVerification         from "../pages/OtpVerification";
import ResetPassword           from "../pages/ResetPassword";
import ServiceOptions          from "../pages/ServiceOptions";
import ServiceManagement       from "../pages/ServiceManagement";
import BookingAppointment      from "../pages/BookingAppointment";
import ServiceCompletionReport from "../pages/ServiceCompletionReport";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/login"           element={<Login />} />
      <Route path="/register"        element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/otp-verification"element={<OtpVerification />} />
      <Route path="/reset-password"  element={<ResetPassword />} />

      <Route path="/booking/slot"
        element={<PrivateRoute><BookingAppointment /></PrivateRoute>} />

      <Route path="/booking/service-options"
        element={<PrivateRoute><ServiceOptions /></PrivateRoute>} />

      <Route path="/admin/services"
        element={<PrivateRoute><ServiceManagement /></PrivateRoute>} />

      <Route path="/report"
        element={<ServiceCompletionReport />} />

      <Route path="/report/:id"
        element={<ServiceCompletionReport />} />

      <Route path="/"  element={<Navigate to="/login" replace />} />
      <Route path="*"  element={<Navigate to="/login" replace />} />

    </Routes>
  );
}
