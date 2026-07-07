import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeAssignmentDetail from './pages/EmployeeAssignmentDetail';
import FormSubmission from './pages/FormSubmission';
import FormEdit from './pages/FormEdit';
import FormDetail from './pages/FormDetail';
import AdminFormDetail from './pages/AdminFormDetail';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const ProtectedRoute = ({ children, adminOnly = false, employeeOnly = false }) => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      return <Navigate to="/login" />;
    }

    if (adminOnly) {
      const user = JSON.parse(userData);
      if (user.role !== 'admin') {
        return <Navigate to="/dashboard" />;
      }
    }

    if (employeeOnly) {
      const user = JSON.parse(userData);
      if (user.role !== 'employee') {
        return <Navigate to="/dashboard" />;
      }
    }

    return children;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboard user={user} setUser={setUser} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/submit-form" 
            element={
              <ProtectedRoute>
                <FormSubmission />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/edit-form/:id" 
            element={
              <ProtectedRoute>
                <FormEdit />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/form/:id" 
            element={
              <ProtectedRoute>
                <FormDetail />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard user={user} setUser={setUser} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/form/:id" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminFormDetail />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/employee/dashboard" 
            element={
              <ProtectedRoute employeeOnly={true}>
                <EmployeeDashboard user={user} setUser={setUser} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/employee/assignment/:id" 
            element={
              <ProtectedRoute employeeOnly={true}>
                <EmployeeAssignmentDetail user={user} />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
