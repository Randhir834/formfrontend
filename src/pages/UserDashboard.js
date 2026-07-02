import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyForms } from '../utils/api';

function UserDashboard({ user, setUser }) {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await getMyForms();
      setForms(response.data.data);
    } catch (error) {
      console.error('Error fetching forms:', error);
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

  const getStatusColor = (status) => {
    const colors = {
      submitted: '#fef3c7',
      'in-progress': '#dbeafe',
      review: '#fce7f3',
      completed: '#d1fae5',
      cancelled: '#fee2e2'
    };
    return colors[status] || '#e0e0e0';
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <div className="navbar">
        <h2>Innovative Media Form System</h2>
        <div className="navbar-right">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn btn-secondary">Sign out</button>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px', color: '#111827', letterSpacing: '-0.02em' }}>My Submissions</h1>
              <p style={{ color: '#6b7280', fontSize: '15px', marginTop: '4px' }}>Manage and track your form submissions</p>
            </div>
            <button 
              onClick={() => navigate('/submit-form')} 
              className="btn btn-primary"
            >
              Submit new form
            </button>
          </div>

          {forms.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: '#f9fafb', borderRadius: '12px', border: '1px dashed #e5e7eb' }}>
              <div style={{ width: '64px', height: '64px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <span style={{ fontSize: '32px' }}>📄</span>
              </div>
              <h3 style={{ color: '#111827', marginBottom: '8px', fontSize: '18px', fontWeight: '600' }}>No forms submitted yet</h3>
              <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '14px' }}>Get started by submitting your first form</p>
              <button 
                onClick={() => navigate('/submit-form')} 
                className="btn btn-primary"
              >
                Submit your first form
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', border: '1px solid #f3f4f6', borderRadius: '12px' }}>
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Product</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {forms.map(form => (
                    <tr key={form._id}>
                      <td style={{ fontWeight: '500' }}>{form.clientInfo?.companyName || 'N/A'}</td>
                      <td>{form.productInfo?.productName || 'N/A'}</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ background: getStatusColor(form.status) }}
                        >
                          {form.status}
                        </span>
                      </td>
                      <td style={{ color: '#6b7280' }}>{new Date(form.submittedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => navigate(`/form/${form._id}`)}
                            className="btn btn-secondary"
                            style={{ padding: '8px 16px', fontSize: '14px' }}
                          >
                            View
                          </button>
                          <button 
                            onClick={() => navigate(`/edit-form/${form._id}`)}
                            className="btn btn-primary"
                            style={{ padding: '8px 16px', fontSize: '14px' }}
                          >
                            Edit
                          </button>
                        </div>
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

export default UserDashboard;
