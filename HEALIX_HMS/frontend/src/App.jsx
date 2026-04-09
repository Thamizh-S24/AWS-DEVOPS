import React, { useState, useEffect, Suspense, lazy } from 'react';
import LabTechDashboard from './pages/lab/LabTechDashboard';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Background3D from './components/Background3D';
import MotionWrapper from './components/MotionWrapper';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import PersonnelRegistry from './pages/admin/PersonnelRegistry';
import InfrastructureHub from './pages/admin/InfrastructureHub';
import PersonnelCRUD from './pages/admin/PersonnelCRUD';
import AmbulanceCRUD from './pages/admin/AmbulanceCRUD';
import InfrastructureCRUD from './pages/admin/InfrastructureCRUD';
import MicroserviceControl from './pages/admin/MicroserviceControl';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientAppointments from './pages/patient/PatientAppointments';
import PatientRecords from './pages/patient/PatientRecords';
import PatientBilling from './pages/patient/PatientBilling';
import PatientTelehealth from './pages/patient/PatientTelehealth';
import PatientPharmacy from './pages/patient/PatientPharmacy';
import PatientVitals from './pages/patient/PatientVitals';
import PatientAura from './pages/patient/PatientAura';
import PatientNutrition from './pages/patient/PatientNutrition';
import PatientMentalHealth from './pages/patient/PatientMentalHealth';
import PatientRehab from './pages/patient/PatientRehab';
import PatientSettings from './pages/patient/PatientSettings';
import PatientNotifications from './pages/patient/PatientNotifications';
import LeaveRequest from './pages/hr/LeaveRequest';
import LeaveApproval from './pages/admin/LeaveApproval';
import AdminEmergency from './pages/admin/AdminEmergency';
import AmbulanceManagement from './pages/admin/AmbulanceManagement';
import HumanResourceManager from './pages/admin/HumanResourceManager';
import AdminMaintenance from './pages/admin/AdminMaintenance';
import PharmacyMonitor from './pages/admin/PharmacyMonitor';
import LabMonitor from './pages/admin/LabMonitor';
import RadiologyMonitor from './pages/admin/RadiologyMonitor';
import HospitalAnalytics from './pages/admin/HospitalAnalytics';
import AuditLogs from './pages/admin/AuditLogs';
import AdminProfile from './pages/admin/AdminProfile';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import PersonnelAttendance from './pages/admin/PersonnelAttendance';
import NotificationCenter from './pages/admin/NotificationCenter';
// Doctor Modules
import Consultations from './pages/doctor/Consultations';
import EMRVault from './pages/doctor/EMRVault';
import PrescriptionPortal from './pages/doctor/PrescriptionPortal';
import SessionTerminal from './pages/doctor/SessionTerminal';
import DiagnosticOrders from './pages/doctor/DiagnosticOrders';
import AdmissionsManager from './pages/doctor/AdmissionsManager';
import AttendancePortal from './pages/doctor/AttendancePortal';
import DoctorProfile from './pages/doctor/DoctorProfile';
import DoctorNotifications from './pages/doctor/DoctorNotifications';

// Nurse Pages
import NurseProfile from './pages/nurse/NurseProfile';
import NurseNotifications from './pages/nurse/NurseNotifications';

// Receptionist Pages
import ReceptionistRegistry from './pages/receptionist/ReceptionistRegistry';
import ReceptionistAdmissions from './pages/receptionist/ReceptionistAdmissions';
import ReceptionistEmergency from './pages/receptionist/ReceptionistEmergency';
import ReceptionistBilling from './pages/receptionist/ReceptionistBilling';

import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import ReceptionistProfile from './pages/receptionist/ReceptionistProfile';
import ReceptionistNotifications from './pages/receptionist/ReceptionistNotifications';

import RadiologyDashboard from './pages/radiology/RadiologyDashboard';
import RadiologyWorklist from './pages/radiology/RadiologyWorklist';
import RadiologyTerminal from './pages/radiology/RadiologyTerminal';
import RadiologyArchive from './pages/radiology/RadiologyArchive';
import RadiologyInventory from './pages/radiology/RadiologyInventory';
import RadiologyProfile from './pages/radiology/RadiologyProfile';
import RadiologyNotifications from './pages/radiology/RadiologyNotifications';

// Maintenance Modules
import MaintenanceDashboard from './pages/maintenance/MaintenanceDashboard';
import MaintenanceTickets from './pages/maintenance/MaintenanceTickets';
import MaintenanceStaff from './pages/maintenance/MaintenanceStaff';
import MaintenanceBiomed from './pages/maintenance/MaintenanceBiomed';
import MaintenanceAssets from './pages/maintenance/MaintenanceAssets';
import MaintenanceFacility from './pages/maintenance/MaintenanceFacility';
import MaintenanceSafety from './pages/maintenance/MaintenanceSafety';
import MaintenanceProfile from './pages/maintenance/MaintenanceProfile';
import MaintenanceNotifications from './pages/maintenance/MaintenanceNotifications';

// Lazy load new dashboards for performance
const PharmacistDashboard = lazy(() => import('./pages/pharmacist/PharmacistDashboard'));
const PharmacistInventory = lazy(() => import('./pages/pharmacist/PharmacistInventory'));
const PharmacistPrescriptions = lazy(() => import('./pages/pharmacist/PharmacistPrescriptions'));
const PharmacistProfile = lazy(() => import('./pages/pharmacist/PharmacistProfile'));
const PharmacistNotifications = lazy(() => import('./pages/pharmacist/PharmacistNotifications'));
const NurseDashboard = lazy(() => import('./pages/nurse/NurseDashboard'));
const NurseWardMap = lazy(() => import('./pages/nurse/NurseWardMap'));
const NurseVitals = lazy(() => import('./pages/nurse/NurseVitals'));
const NursePatientSummary = lazy(() => import('./pages/nurse/NursePatientSummary'));
const NurseWardCRUD = lazy(() => import('./pages/nurse/NurseWardCRUD'));
const LabRequestQueue = lazy(() => import('./pages/lab/LabRequestQueue'));
const LabSpecimenTerminal = lazy(() => import('./pages/lab/LabSpecimenTerminal'));
const LabReportPortal = lazy(() => import('./pages/lab/LabReportPortal'));
const LabInventory = lazy(() => import('./pages/lab/LabInventory'));
// const MaintenanceDashboard = lazy(() => import('./pages/maintenance/MaintenanceDashboard'));

// const RadiologyDashboard = lazy(() => import('./pages/radiology/RadiologyDashboard'));
// const RadiologyWorklist = lazy(() => import('./pages/radiology/RadiologyWorklist'));
// const RadiologyTerminal = lazy(() => import('./pages/radiology/RadiologyTerminal'));
// const RadiologyArchive = lazy(() => import('./pages/radiology/RadiologyArchive'));
// const RadiologyInventory = lazy(() => import('./pages/radiology/RadiologyInventory'));
// const RadiologyProfile = lazy(() => import('./pages/radiology/RadiologyProfile'));
// const RadiologyNotifications = lazy(() => import('./pages/radiology/RadiologyNotifications'));

const ProtectedRoute = ({ children, allowedRoles }) => {
  const auth = useAuth();

  if (!auth) {
    console.error("AuthContext not found!");
    return <div>System Error: Auth Context Missing</div>;
  }

  const { user, loading } = auth;

  if (loading) return <div>Loading Session...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

const DynamicBackground = () => {
  const location = useLocation();
  // if (isLanding) return null;
  // return <Background3D variant="default" />;
  return null;
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
        <div style={{ width: '100%', minHeight: '100vh', background: 'white' }}>
          <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/registry" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PersonnelRegistry />
            </ProtectedRoute>
          } />
          <Route path="/admin/attendance" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PersonnelAttendance />
            </ProtectedRoute>
          } />

          <Route path="/admin/registry/new" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PersonnelCRUD />
            </ProtectedRoute>
          } />

          <Route path="/admin/infrastructure" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <InfrastructureHub />
            </ProtectedRoute>
          } />

          <Route path="/admin/infrastructure/new" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <InfrastructureCRUD />
            </ProtectedRoute>
          } />

          <Route path="/admin/microservices" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MicroserviceControl />
            </ProtectedRoute>
          } />

          <Route path="/admin/leaves" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <LeaveApproval />
            </ProtectedRoute>
          } />

          <Route path="/admin/departments" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DepartmentManagement />
            </ProtectedRoute>
          } />

          <Route path="/admin/emergency" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminEmergency />
            </ProtectedRoute>
          } />

          <Route path="/admin/ambulance" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AmbulanceManagement />
            </ProtectedRoute>
          } />

          <Route path="/admin/ambulance/new" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AmbulanceCRUD />
            </ProtectedRoute>
          } />

          <Route path="/admin/hr" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <HumanResourceManager />
            </ProtectedRoute>
          } />

          <Route path="/admin/maintenance-ops" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminMaintenance />
            </ProtectedRoute>
          } />

          <Route path="/admin/pharmacy" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PharmacyMonitor />
            </ProtectedRoute>
          } />

          <Route path="/admin/lab" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <LabMonitor />
            </ProtectedRoute>
          } />

          <Route path="/admin/radiology" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <RadiologyMonitor />
            </ProtectedRoute>
          } />

          <Route path="/admin/analytics" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <HospitalAnalytics />
            </ProtectedRoute>
          } />

          <Route path="/admin/audit" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AuditLogs />
            </ProtectedRoute>
          } />

          <Route path="/admin/profile" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminProfile />
            </ProtectedRoute>
          } />

          <Route path="/admin/notifications" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <NotificationCenter />
            </ProtectedRoute>
          } />

          <Route path="/staff/leaves" element={
            <ProtectedRoute allowedRoles={['doctor', 'nurse', 'pharmacist', 'lab_tech', 'receptionist', 'maintenance']}>
              <LeaveRequest />
            </ProtectedRoute>
          } />

          <Route path="/doctor-dashboard" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } />

          <Route path="/doctor/consultations" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <Consultations />
            </ProtectedRoute>
          } />

          <Route path="/doctor/emr" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <EMRVault />
            </ProtectedRoute>
          } />

          <Route path="/doctor/prescriptions" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <PrescriptionPortal />
            </ProtectedRoute>
          } />

          <Route path="/doctor/session" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <SessionTerminal />
            </ProtectedRoute>
          } />

          <Route path="/doctor/diagnostics" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DiagnosticOrders />
            </ProtectedRoute>
          } />

          <Route path="/doctor/admissions" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <AdmissionsManager />
            </ProtectedRoute>
          } />

          <Route path="/doctor/attendance" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <AttendancePortal />
            </ProtectedRoute>
          } />

          <Route path="/doctor/profile" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorProfile />
            </ProtectedRoute>
          } />

          <Route path="/doctor/notifications" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorNotifications />
            </ProtectedRoute>
          } />

          <Route path="/patient-dashboard" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />

          <Route path="/patient/appointments" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientAppointments />
            </ProtectedRoute>
          } />

          <Route path="/patient/records" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientRecords />
            </ProtectedRoute>
          } />

          <Route path="/patient/billing" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientBilling />
            </ProtectedRoute>
          } />

          <Route path="/patient/telehealth" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientTelehealth />
            </ProtectedRoute>
          } />

          <Route path="/patient/pharmacy" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientPharmacy />
            </ProtectedRoute>
          } />

          <Route path="/patient/vitals" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientVitals />
            </ProtectedRoute>
          } />

          <Route path="/patient/aura" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientAura />
            </ProtectedRoute>
          } />

          <Route path="/patient/nutrition" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientNutrition />
            </ProtectedRoute>
          } />

          <Route path="/patient/mental-health" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientMentalHealth />
            </ProtectedRoute>
          } />

          <Route path="/patient/rehab" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientRehab />
            </ProtectedRoute>
          } />

          <Route path="/patient/settings" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientSettings />
            </ProtectedRoute>
          } />

          <Route path="/patient/notifications" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientNotifications />
            </ProtectedRoute>
          } />

          <Route path="/pharmacist-dashboard" element={
            <ProtectedRoute allowedRoles={['pharmacist']}>
              <PharmacistDashboard />
            </ProtectedRoute>
          } />

          <Route path="/pharmacist/inventory" element={
            <ProtectedRoute allowedRoles={['pharmacist']}>
              <PharmacistInventory />
            </ProtectedRoute>
          } />

          <Route path="/pharmacist/prescriptions" element={
            <ProtectedRoute allowedRoles={['pharmacist']}>
              <PharmacistPrescriptions />
            </ProtectedRoute>
          } />

          <Route path="/pharmacist/profile" element={
            <ProtectedRoute allowedRoles={['pharmacist']}>
              <PharmacistProfile />
            </ProtectedRoute>
          } />

          <Route path="/pharmacist/notifications" element={
            <ProtectedRoute allowedRoles={['pharmacist']}>
              <PharmacistNotifications />
            </ProtectedRoute>
          } />

          <Route path="/nurse-dashboard" element={
            <ProtectedRoute allowedRoles={['nurse']}>
              <NurseDashboard />
            </ProtectedRoute>
          } />

          <Route path="/nurse/wards" element={
            <ProtectedRoute allowedRoles={['nurse']}>
              <NurseWardMap />
            </ProtectedRoute>
          } />

          <Route path="/nurse/vitals" element={
            <ProtectedRoute allowedRoles={['nurse']}>
              <NurseVitals />
            </ProtectedRoute>
          } />

          <Route path="/nurse/summary" element={
            <ProtectedRoute allowedRoles={['nurse']}>
              <NursePatientSummary />
            </ProtectedRoute>
          } />

          <Route path="/nurse/crud" element={
            <ProtectedRoute allowedRoles={['nurse']}>
              <NurseWardCRUD />
            </ProtectedRoute>
          } />

          <Route path="/nurse/profile" element={
            <ProtectedRoute allowedRoles={['nurse']}>
              <NurseProfile />
            </ProtectedRoute>
          } />

          <Route path="/nurse/notifications" element={
            <ProtectedRoute allowedRoles={['nurse']}>
              <NurseNotifications />
            </ProtectedRoute>
          } />
          <Route path="/lab-tech-dashboard" element={
            <ProtectedRoute allowedRoles={['lab_tech']}>
              <LabTechDashboard />
            </ProtectedRoute>
          } />

          <Route path="/lab/queue" element={
            <ProtectedRoute allowedRoles={['lab_tech']}>
              <LabRequestQueue />
            </ProtectedRoute>
          } />

          <Route path="/lab/terminal" element={
            <ProtectedRoute allowedRoles={['lab_tech']}>
              <LabSpecimenTerminal />
            </ProtectedRoute>
          } />

          <Route path="/lab/reports" element={
            <ProtectedRoute allowedRoles={['lab_tech']}>
              <LabReportPortal />
            </ProtectedRoute>
          } />

          <Route path="/lab/inventory" element={
            <ProtectedRoute allowedRoles={['lab_tech']}>
              <LabInventory />
            </ProtectedRoute>
          } />

          <Route path="/receptionist-dashboard" element={
            <ProtectedRoute allowedRoles={['receptionist']}>
              <ReceptionistDashboard />
            </ProtectedRoute>
          } />

          <Route path="/receptionist/registry" element={
            <ProtectedRoute allowedRoles={['receptionist']}>
              <ReceptionistRegistry />
            </ProtectedRoute>
          } />

          <Route path="/receptionist/admissions" element={
            <ProtectedRoute allowedRoles={['receptionist']}>
              <ReceptionistAdmissions />
            </ProtectedRoute>
          } />

          <Route path="/receptionist/emergency" element={
            <ProtectedRoute allowedRoles={['receptionist']}>
              <ReceptionistEmergency />
            </ProtectedRoute>
          } />

          <Route path="/receptionist/billing" element={
            <ProtectedRoute allowedRoles={['receptionist']}>
              <ReceptionistBilling />
            </ProtectedRoute>
          } />

          <Route path="/receptionist/profile" element={
            <ProtectedRoute allowedRoles={['receptionist']}>
              <ReceptionistProfile />
            </ProtectedRoute>
          } />

          <Route path="/receptionist/notifications" element={
            <ProtectedRoute allowedRoles={['receptionist']}>
              <ReceptionistNotifications />
            </ProtectedRoute>
          } />

          <Route path="/maintenance-dashboard" element={
            <ProtectedRoute allowedRoles={['maintenance']}>
              <MaintenanceDashboard />
            </ProtectedRoute>
          } />

          <Route path="/radiology-dashboard" element={
            <ProtectedRoute allowedRoles={['radiologist']}>
              <RadiologyDashboard />
            </ProtectedRoute>
          } />

          <Route path="/radiology/worklist" element={
            <ProtectedRoute allowedRoles={['radiologist']}>
              <RadiologyWorklist />
            </ProtectedRoute>
          } />

          <Route path="/radiology/terminal" element={
            <ProtectedRoute allowedRoles={['radiologist']}>
              <RadiologyTerminal />
            </ProtectedRoute>
          } />

          <Route path="/radiology/archive" element={
            <ProtectedRoute allowedRoles={['radiologist']}>
              <RadiologyArchive />
            </ProtectedRoute>
          } />

          <Route path="/radiology/inventory" element={
            <ProtectedRoute allowedRoles={['radiologist']}>
              <RadiologyInventory />
            </ProtectedRoute>
          } />

          <Route path="/radiology/profile" element={
            <ProtectedRoute allowedRoles={['radiologist']}>
              <RadiologyProfile />
            </ProtectedRoute>
          } />

          <Route path="/radiology/notifications" element={
            <ProtectedRoute allowedRoles={['radiologist']}>
              <RadiologyNotifications />
            </ProtectedRoute>
          } />

          <Route path="/maintenance-dashboard" element={
            <ProtectedRoute allowedRoles={['maintenance']}>
              <MaintenanceDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/maintenance/tickets" element={
            <ProtectedRoute allowedRoles={['maintenance']}>
              <MaintenanceTickets />
            </ProtectedRoute>
          } />

          <Route path="/maintenance/staff" element={
            <ProtectedRoute allowedRoles={['maintenance']}>
              <MaintenanceStaff />
            </ProtectedRoute>
          } />

          <Route path="/maintenance/biomed" element={
            <ProtectedRoute allowedRoles={['maintenance']}>
              <MaintenanceBiomed />
            </ProtectedRoute>
          } />

          <Route path="/maintenance/assets" element={
            <ProtectedRoute allowedRoles={['maintenance']}>
              <MaintenanceAssets />
            </ProtectedRoute>
          } />

          <Route path="/maintenance/facility" element={
            <ProtectedRoute allowedRoles={['maintenance']}>
              <MaintenanceFacility />
            </ProtectedRoute>
          } />

          <Route path="/maintenance/safety" element={
            <ProtectedRoute allowedRoles={['maintenance']}>
              <MaintenanceSafety />
            </ProtectedRoute>
          } />

          <Route path="/maintenance/profile" element={
            <ProtectedRoute allowedRoles={['maintenance']}>
              <MaintenanceProfile />
            </ProtectedRoute>
          } />

          <Route path="/maintenance/notifications" element={
            <ProtectedRoute allowedRoles={['maintenance']}>
              <MaintenanceNotifications />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    );
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <SearchProvider>
            <DynamicBackground />
            {/* <Suspense fallback={<div className="glass" style={{ margin: '20% auto', padding: '2rem', width: '200px', textAlign: 'center', color: 'white' }}>Initializing Healix...</div>}> */}
              <AnimatedRoutes />
            {/* </Suspense> */}
          </SearchProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
