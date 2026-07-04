import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminStats, getAllForms } from '../utils/api';

function AdminDashboard({ user, setUser }) {
  const [stats, setStats] = useState(null);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, formsRes] = await Promise.all([
        getAdminStats(),
        getAllForms()
      ]);
      setStats(statsRes.data.data);
      setForms(formsRes.data.data);
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
        {/* Stats */}
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

        {/* Forms Table */}
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
                    <th>Company</th>
                    <th>Product</th>
                    <th>Submitted By</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {forms.map(form => (
                    <tr key={form._id}>
                      <td style={{ fontWeight: '500' }}>{form.clientInfo?.companyName || 'N/A'}</td>
                      <td>{form.productInfo?.productName || 'N/A'}</td>
                      <td style={{ color: '#6b7280' }}>{form.userId?.name || 'N/A'}</td>
                      <td>
                        <span className={`status-badge status-${form.status}`}>
                          {form.status}
                        </span>
                      </td>
                      <td style={{ color: '#6b7280' }}>{new Date(form.submittedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                      <td>
                        <button 
                          onClick={() => navigate(`/admin/form/${form._id}`)}
                          className="btn btn-primary"
                          style={{ padding: '8px 16px', fontSize: '14px' }}
                        >
                          Manage
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

export default AdminDashboard;
