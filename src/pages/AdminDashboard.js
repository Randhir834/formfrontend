import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminStats, getAllForms, createEmployee, getEmployeeList, deleteEmployee } from '../utils/api';

function AdminDashboard({ user, setUser }) {
  const [stats, setStats] = useState(null);
  const [forms, setForms] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '' });
  const [createdEmployee, setCreatedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('forms'); // 'forms' or 'employees'
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, formsRes, employeesRes] = await Promise.all([
        getAdminStats(),
        getAllForms(),
        getEmployeeList()
      ]);
      setStats(statsRes.data.data);
      setForms(formsRes.data.data);
      setEmployees(employeesRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await createEmployee(newEmployee);
      setCreatedEmployee(response.data.data);
      setNewEmployee({ name: '', email: '' });
      // Refresh employee list
      const employeesRes = await getEmployeeList();
      setEmployees(employeesRes.data.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create employee');
    }
  };

  const handleDeleteEmployee = async (employeeId, employeeName) => {
    if (window.confirm(`Are you sure you want to delete employee "${employeeName}"? All their form assignments will be unassigned.`)) {
      try {
        await deleteEmployee(employeeId);
        alert('Employee deleted successfully');
        // Refresh data
        const employeesRes = await getEmployeeList();
        setEmployees(employeesRes.data.data);
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete employee');
      }
    }
  };

  const closeEmployeeModal = () => {
    setShowEmployeeModal(false);
    setCreatedEmployee(null);
    setNewEmployee({ name: '', email: '' });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="navbar">
        <h2>Innovative Media Form System • Admin</h2>
        <div className="navbar-right">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn btn-secondary">Sign out</button>
        </div>
      </div>

      <div className="container">
        {/* Header */}
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: '#111827', letterSpacing: '-0.02em' }}>Dashboard Overview</h1>
          <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '24px' }}>Monitor all form submissions and user activity</p>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats?.totalForms || 0}</h3>
            <p>Total Forms</p>
          </div>
          <div className="stat-card">
            <h3>{stats?.submittedForms || 0}</h3>
            <p>Submitted</p>
          </div>
          <div className="stat-card">
            <h3>{stats?.inProgressForms || 0}</h3>
            <p>In Progress</p>
          </div>
          <div className="stat-card">
            <h3>{stats?.completedForms || 0}</h3>
            <p>Completed</p>
          </div>
          <div className="stat-card">
            <h3>{stats?.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: '2px solid #e5e7eb', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            <button
              onClick={() => setActiveTab('forms')}
              style={{
                padding: '12px 0',
                border: 'none',
                background: 'none',
                fontSize: '16px',
                fontWeight: '600',
                color: activeTab === 'forms' ? '#2563eb' : '#6b7280',
                borderBottom: activeTab === 'forms' ? '2px solid #2563eb' : 'none',
                marginBottom: '-2px',
                cursor: 'pointer'
              }}
            >
              Form Submissions
            </button>
            <button
              onClick={() => setActiveTab('employees')}
              style={{
                padding: '12px 0',
                border: 'none',
                background: 'none',
                fontSize: '16px',
                fontWeight: '600',
                color: activeTab === 'employees' ? '#2563eb' : '#6b7280',
                borderBottom: activeTab === 'employees' ? '2px solid #2563eb' : 'none',
                marginBottom: '-2px',
                cursor: 'pointer'
              }}
            >
              Employee Management ({employees.length})
            </button>
          </div>
        </div>

        {/* Forms Table */}
        {activeTab === 'forms' && (
          <div className="card">
            <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600', color: '#111827' }}>All Submissions</h2>
            {forms.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', background: '#f9fafb', borderRadius: '12px', border: '1px dashed #e5e7eb' }}>
                <div style={{ width: '64px', height: '64px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <span style={{ fontSize: '32px' }}>📋</span>
                </div>
                <h3 style={{ color: '#111827', marginBottom: '8px', fontSize: '18px', fontWeight: '600' }}>No forms submitted yet</h3>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Forms will appear here once users start submitting</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', border: '1px solid #f3f4f6', borderRadius: '12px' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Company / Brand</th>
                      <th>Product</th>
                      <th>Contact Person</th>
                      <th>Mobile / Email</th>
                      <th>Submitted By</th>
                      <th>Assigned To</th>
                      <th>Status</th>
                      <th>Launch Date</th>
                      <th>Priority</th>
                      <th>Date Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forms.map(form => (
                      <tr key={form._id}>
                        <td style={{ fontWeight: '500' }}>
                          <div>{form.clientInfo?.companyName || 'N/A'}</div>
                          {form.clientInfo?.brandName && (
                            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                              {form.clientInfo.brandName}
                            </div>
                          )}
                        </td>
                        <td>
                          <div style={{ fontWeight: '500' }}>{form.productInfo?.productName || 'N/A'}</div>
                          {form.productInfo?.productCategory && (
                            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                              {form.productInfo.productCategory}
                            </div>
                          )}
                          {form.productInfo?.mrp && (
                            <div style={{ fontSize: '13px', color: '#059669', marginTop: '2px', fontWeight: '500' }}>
                              ₹{form.productInfo.mrp}
                            </div>
                          )}
                        </td>
                        <td style={{ color: '#111827' }}>{form.clientInfo?.contactPerson || 'N/A'}</td>
                        <td style={{ fontSize: '14px' }}>
                          <div>{form.clientInfo?.mobileNumber || 'N/A'}</div>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                            {form.clientInfo?.email || ''}
                          </div>
                        </td>
                        <td style={{ color: '#6b7280' }}>{form.userId?.name || 'N/A'}</td>
                        <td>
                          {form.assignedTo ? (
                            <span style={{ color: '#059669', fontWeight: '500', fontSize: '14px' }}>
                              👤 {form.assignedTo.name}
                            </span>
                          ) : (
                            <span style={{ color: '#9ca3af', fontSize: '14px' }}>Unassigned</span>
                          )}
                        </td>
                        <td>
                          <span className={`status-badge status-${form.status}`}>
                            {form.status}
                          </span>
                        </td>
                        <td style={{ color: '#111827', fontWeight: '500' }}>
                          {form.timeline?.launchDate ? 
                            new Date(form.timeline.launchDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            }) 
                            : 'N/A'}
                        </td>
                        <td>
                          {form.timeline?.urgent === 'yes' ? (
                            <span style={{ 
                              padding: '4px 8px', 
                              borderRadius: '6px', 
                              background: '#fee2e2', 
                              color: '#991b1b',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              🔴 URGENT
                            </span>
                          ) : form.timeline?.urgent === 'no' ? (
                            <span style={{ 
                              padding: '4px 8px', 
                              borderRadius: '6px', 
                              background: '#dbeafe', 
                              color: '#1e40af',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              Standard
                            </span>
                          ) : (
                            <span style={{ fontSize: '13px', color: '#6b7280' }}>Flexible</span>
                          )}
                        </td>
                        <td style={{ color: '#6b7280' }}>
                          {new Date(form.submittedAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td>
                          <button 
                            onClick={() => navigate(`/admin/form/${form._id}`)}
                            className="btn btn-primary"
                            style={{ padding: '8px 16px', fontSize: '14px', whiteSpace: 'nowrap' }}
                          >
                            View Full Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Employee Management */}
        {activeTab === 'employees' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Employee Accounts</h2>
              <button 
                onClick={() => setShowEmployeeModal(true)}
                className="btn btn-primary"
                style={{ padding: '10px 20px' }}
              >
                + Create Employee
              </button>
            </div>
            
            {employees.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', background: '#f9fafb', borderRadius: '12px', border: '1px dashed #e5e7eb' }}>
                <div style={{ width: '64px', height: '64px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <span style={{ fontSize: '32px' }}>👥</span>
                </div>
                <h3 style={{ color: '#111827', marginBottom: '8px', fontSize: '18px', fontWeight: '600' }}>No employees yet</h3>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>Create employee accounts to assign forms</p>
                <button 
                  onClick={() => setShowEmployeeModal(true)}
                  className="btn btn-primary"
                >
                  Create First Employee
                </button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', border: '1px solid #f3f4f6', borderRadius: '12px' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Total Assigned</th>
                      <th>Completed</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => (
                      <tr key={emp._id}>
                        <td style={{ fontWeight: '500' }}>{emp.name}</td>
                        <td style={{ color: '#6b7280' }}>{emp.email}</td>
                        <td>{emp.totalAssigned || 0}</td>
                        <td>{emp.completedCount || 0}</td>
                        <td style={{ color: '#6b7280' }}>
                          {new Date(emp.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td>
                          <button 
                            onClick={() => handleDeleteEmployee(emp._id, emp.name)}
                            className="btn btn-secondary"
                            style={{ padding: '8px 16px', fontSize: '14px', background: '#ef4444', color: 'white' }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Create Employee Modal */}
        {showEmployeeModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              {!createdEmployee ? (
                <>
                  <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: '600' }}>Create Employee Account</h2>
                  <form onSubmit={handleCreateEmployee}>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Full Name *</label>
                      <input
                        type="text"
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                        required
                        placeholder="Enter employee name"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '16px'
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email Address *</label>
                      <input
                        type="email"
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                        required
                        placeholder="employee@example.com"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '16px'
                        }}
                      />
                    </div>
                    <div style={{
                      padding: '16px',
                      background: '#fef3c7',
                      borderRadius: '8px',
                      marginBottom: '24px',
                      border: '1px solid #fbbf24'
                    }}>
                      <p style={{ fontSize: '14px', color: '#92400e' }}>
                        <strong>Default Password:</strong> 1235
                        <br />
                        <span style={{ fontSize: '13px' }}>The employee can use this password to log in.</span>
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={closeEmployeeModal}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                      >
                        Create Employee
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      background: '#d1fae5',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontSize: '32px'
                    }}>
                      ✅
                    </div>
                    <h2 style={{ marginBottom: '8px', fontSize: '24px', fontWeight: '600', color: '#059669' }}>
                      Employee Created Successfully!
                    </h2>
                    <p style={{ color: '#6b7280' }}>Share these credentials with the employee</p>
                  </div>
                  
                  <div style={{
                    background: '#f9fafb',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '24px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>Name</label>
                      <p style={{ fontWeight: '500', fontSize: '16px', marginTop: '4px' }}>{createdEmployee.name}</p>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>Email</label>
                      <p style={{ fontWeight: '500', fontSize: '16px', marginTop: '4px' }}>{createdEmployee.email}</p>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>Password</label>
                      <p style={{ fontWeight: '600', fontSize: '18px', marginTop: '4px', color: '#2563eb' }}>
                        {createdEmployee.defaultPassword}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={closeEmployeeModal}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    Done
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
