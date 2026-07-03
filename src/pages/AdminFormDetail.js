import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getForm, updateFormStatus, getImageUrl } from '../utils/api';

function AdminFormDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    comment: '',
    progressImages: []
  });

  useEffect(() => {
    fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      const response = await getForm(id);
      setForm(response.data.data);
      setUpdateData(prev => ({ ...prev, status: response.data.data.status }));
    } catch (error) {
      alert('Error fetching form');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setUpdateData(prev => ({ ...prev, progressImages: files }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const data = new FormData();
      data.append('status', updateData.status);
      data.append('comment', updateData.comment);
      
      updateData.progressImages.forEach((file) => {
        data.append('progressImages', file);
      });

      await updateFormStatus(id, data);
      alert('Form updated successfully!');
      fetchForm();
      setUpdateData({ status: updateData.status, comment: '', progressImages: [] });
    } catch (error) {
      alert('Error updating form: ' + (error.response?.data?.message || error.message));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!form) return null;

  return (
    <div>
      <div className="navbar">
        <h2>Innovative Media Form System • Admin</h2>
        <div className="navbar-right">
          <button onClick={() => navigate('/admin')} className="btn btn-secondary">
            ← Back to Admin
          </button>
        </div>
      </div>

      <div className="container">
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'start', gap: '24px' }}>
          {/* Form Details */}
          <div className="card">
            <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: '#111827' }}>Form Details</h2>
              <p style={{ color: '#6b7280', fontSize: '15px' }}>Review submission and update status</p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ color: '#111827', marginBottom: '20px', fontSize: '17px', fontWeight: '600' }}>Client Information</h3>
              <div className="grid-2" style={{ gap: '20px 40px' }}>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Company</p>
                  <p style={{ fontSize: '15px', color: '#111827', fontWeight: '500' }}>{form.clientInfo.companyName}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Brand</p>
                  <p style={{ fontSize: '15px', color: '#111827', fontWeight: '500' }}>{form.clientInfo.brandName}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Contact</p>
                  <p style={{ fontSize: '15px', color: '#111827' }}>{form.clientInfo.contactPerson}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Mobile</p>
                  <p style={{ fontSize: '15px', color: '#111827' }}>{form.clientInfo.mobileNumber}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Email</p>
                  <p style={{ fontSize: '15px', color: '#111827' }}>{form.clientInfo.email}</p>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ color: '#111827', marginBottom: '20px', fontSize: '17px', fontWeight: '600' }}>Product Information</h3>
              <div className="grid-2" style={{ gap: '20px 40px' }}>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Product</p>
                  <p style={{ fontSize: '15px', color: '#111827', fontWeight: '500' }}>{form.productInfo.productName}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Category</p>
                  <p style={{ fontSize: '15px', color: '#111827' }}>{form.productInfo.productCategory}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Variant</p>
                  <p style={{ fontSize: '15px', color: '#111827' }}>{form.productInfo.productVariant}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>MRP</p>
                  <p style={{ fontSize: '15px', color: '#111827', fontWeight: '600' }}>₹{form.productInfo.mrp}</p>
                </div>
              </div>
            </div>

            {form.referenceImages && form.referenceImages.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ color: '#111827', marginBottom: '20px', fontSize: '17px', fontWeight: '600' }}>Reference Images</h3>
                <div className="image-preview">
                  {form.referenceImages.map((img, index) => (
                    <img key={index} src={getImageUrl(img.imageUrl)} alt={`Reference ${index + 1}`} style={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                  ))}
                </div>
              </div>
            )}

            {form.adminUpdates && form.adminUpdates.length > 0 && (
              <div>
                <h3 style={{ color: '#111827', marginBottom: '20px', fontSize: '17px', fontWeight: '600' }}>Update History & User Feedback</h3>
                {form.adminUpdates.map((update, index) => (
                  <div key={index} style={{ background: '#f9fafb', padding: '24px', borderRadius: '12px', marginBottom: '16px', border: '1px solid #f3f4f6' }}>
                    {/* Admin Update */}
                    <div style={{ marginBottom: update.userFeedback && update.userFeedback.length > 0 ? '20px' : '0', paddingBottom: update.userFeedback && update.userFeedback.length > 0 ? '20px' : '0', borderBottom: update.userFeedback && update.userFeedback.length > 0 ? '1px solid #e5e7eb' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600', fontSize: '16px' }}>
                          A
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>
                            {update.users?.name || 'Admin'}
                          </p>
                          <p style={{ fontSize: '13px', color: '#6b7280' }}>
                            {new Date(update.created_at).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <span className={`status-badge status-${update.status}`}>
                          {update.status}
                        </span>
                      </div>
                      <p style={{ fontSize: '15px', color: '#111827', marginBottom: '12px', lineHeight: '1.6' }}>{update.comment}</p>
                      {update.progress_images && update.progress_images.length > 0 && (
                        <div className="image-preview" style={{ marginTop: '16px' }}>
                          {update.progress_images.map((img, idx) => (
                            <img key={idx} src={getImageUrl(img.imageUrl)} alt={`Progress ${idx + 1}`} style={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* User Feedback */}
                    {update.userFeedback && update.userFeedback.length > 0 && (
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          User Responses ({update.userFeedback.length})
                        </h4>
                        {update.userFeedback.map((feedback, fbIndex) => (
                          <div key={fbIndex} style={{ background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #e5e7eb' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600', fontSize: '14px' }}>
                                U
                              </div>
                              <div>
                                <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>
                                  {feedback.users?.name || 'User'}
                                </p>
                                <p style={{ fontSize: '12px', color: '#6b7280' }}>
                                  {new Date(feedback.created_at).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                            <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6', marginBottom: '8px' }}>{feedback.comment}</p>
                            {feedback.feedback_images && feedback.feedback_images.length > 0 && (
                              <div className="image-preview" style={{ marginTop: '12px' }}>
                                {feedback.feedback_images.map((img, imgIdx) => (
                                  <img key={imgIdx} src={getImageUrl(img.imageUrl)} alt={`Feedback ${imgIdx + 1}`} style={{ borderRadius: '8px', border: '1px solid #e5e7eb', maxHeight: '150px' }} />
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Update Form */}
          <div className="card" style={{ position: 'sticky', top: '24px' }}>
            <h3 style={{ marginBottom: '24px', fontSize: '18px', fontWeight: '600', color: '#111827' }}>Update Status</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                  required
                >
                  <option value="submitted">Submitted</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-group">
                <label>Comment</label>
                <textarea
                  value={updateData.comment}
                  onChange={(e) => setUpdateData({ ...updateData, comment: e.target.value })}
                  placeholder="Add feedback or notes..."
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Progress Images (up to 5)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  style={{ padding: '10px' }}
                />
                {updateData.progressImages.length > 0 && (
                  <div className="image-preview" style={{ marginTop: '12px' }}>
                    {updateData.progressImages.map((file, index) => (
                      <img key={index} src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} style={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={updating}>
                {updating ? 'Updating...' : 'Update Form'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminFormDetail;
