import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployeeStats, getMyAssignments } from '../utils/api';

function EmployeeDashboard({ user, setUser }) {
  const [stats, setStats] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const [statsRes, assignmentsRes] = await Promise.all([
        getEmployeeStats(),
        getMyAssignments(params)
      ]);
      setStats(statsRes.data.data);
      setAssignments(assignmentsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 403) {
        alert('Access denied. Employee access only.');
        handleLogout();
      }
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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="navbar">
        <h2>Innovative Media Form System • Employee Portal</h2>
        <div className="navbar-right">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn btn-secondary">Sign out</button>
        </div>
      </div>

      <div className="container">
        {/* Header */}
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: '#111827', letterSpacing: '-0.02em' }}>My Assignments</h1>
          <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '24px' }}>View and manage forms assigned to you</p>
        </div>
        
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats?.totalAssigned || 0}</h3>
            <p>Total Assigned</p>
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
        </div>

        {/* Filter */}
        <div className="card" style={{ marginBottom: '20px', padding: '16px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ fontWeight: '500', color: '#374151' }}>Filter by Status:</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['all', 'submitted', 'in-progress', 'completed'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={statusFilter === status ? 'btn btn-primary' : 'btn btn-secondary'}
                  style={{ padding: '8px 16px', fontSize: '14px', textTransform: 'capitalize' }}
                >
                  {status === 'all' ? 'All' : status.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Assignments Table */}
        <div className="card">
          <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600', color: '#111827' }}>
            Assigned Forms
            {statusFilter !== 'all' && <span style={{ color: '#6b7280', fontWeight: '400', fontSize: '16px', marginLeft: '10px' }}>
              • {statusFilter.replace('-', ' ')}
            </span>}
          </h2>
          {assignments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: '#f9fafb', borderRadius: '12px', border: '1px dashed #e5e7eb' }}>
              <div style={{ width: '64px', height: '64px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <span style={{ fontSize: '32px' }}>📋</span>
              </div>
              <h3 style={{ color: '#111827', marginBottom: '8px', fontSize: '18px', fontWeight: '600' }}>
                {statusFilter === 'all' ? 'No assignments yet' : `No ${statusFilter.replace('-', ' ')} forms`}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                {statusFilter === 'all' 
                  ? 'Forms assigned to you by the admin will appear here' 
                  : `You don't have any ${statusFilter.replace('-', ' ')} assignments`}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', border: '1px solid #f3f4f6', borderRadius: '12px' }}>
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Product</th>
                    <th>Submitted By</th>
                    <th>Status</th>
                    <th>Assigned Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(form => (
                    <tr key={form._id}>
                      <td style={{ fontWeight: '500' }}>{form.clientInfo?.companyName || 'N/A'}</td>
                      <td>{form.productInfo?.productName || 'N/A'}</td>
                      <td style={{ color: '#6b7280' }}>{form.userId?.name || 'N/A'}</td>
                      <td>
                        <span className={`status-badge status-${form.status}`}>
                          {form.status}
                        </span>
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
                          onClick={() => navigate(`/employee/assignment/${form._id}`)}
                          className="btn btn-primary"
                          style={{ padding: '8px 16px', fontSize: '14px' }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
