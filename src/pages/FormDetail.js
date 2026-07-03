import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getForm, submitFeedback, getImageUrl } from '../utils/api';

function FormDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbackData, setFeedbackData] = useState({});
  const [submittingFeedback, setSubmittingFeedback] = useState({});

  useEffect(() => {
    fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      const response = await getForm(id);
      setForm(response.data.data);
    } catch (error) {
      alert('Error fetching form');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackChange = (updateId, field, value) => {
    setFeedbackData(prev => ({
      ...prev,
      [updateId]: {
        ...prev[updateId],
        [field]: value
      }
    }));
  };

  const handleFeedbackImageChange = (updateId, e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setFeedbackData(prev => ({
      ...prev,
      [updateId]: {
        ...prev[updateId],
        images: files
      }
    }));
  };

  const handleSubmitFeedback = async (updateId, e) => {
    e.preventDefault();
    
    const feedback = feedbackData[updateId];
    if (!feedback || !feedback.comment || feedback.comment.trim() === '') {
      alert('Please enter a comment');
      return;
    }

    setSubmittingFeedback(prev => ({ ...prev, [updateId]: true }));

    try {
      const data = new FormData();
      data.append('comment', feedback.comment);
      
      if (feedback.images && feedback.images.length > 0) {
        feedback.images.forEach((file) => {
          data.append('feedbackImages', file);
        });
      }

      await submitFeedback(id, updateId, data);
      alert('Feedback submitted successfully!');
      
      // Reset feedback form
      setFeedbackData(prev => {
        const updated = { ...prev };
        delete updated[updateId];
        return updated;
      });
      
      // Refresh form data
      fetchForm();
    } catch (error) {
      alert('Error submitting feedback: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmittingFeedback(prev => ({ ...prev, [updateId]: false }));
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!form) return null;

  return (
    <div>
      <div className="navbar">
        <h2>Innovative Media Form System</h2>
        <div className="navbar-right">
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: '#111827', letterSpacing: '-0.02em' }}>Form Details</h1>
              <p style={{ color: '#6b7280', fontSize: '15px' }}>View your submission details and updates</p>
            </div>
            <span className={`status-badge status-${form.status}`}>
              {form.status}
            </span>
          </div>

          <div style={{ marginBottom: '40px' }}>
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

          <div style={{ marginBottom: '40px' }}>
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
            <div style={{ marginBottom: '40px' }}>
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
              <h3 style={{ color: '#111827', marginBottom: '20px', fontSize: '17px', fontWeight: '600' }}>Admin Updates & Communication</h3>
              {form.adminUpdates.map((update, index) => (
                <div key={index} style={{ background: '#f9fafb', padding: '24px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #f3f4f6' }}>
                  {/* Admin Update */}
                  <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
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

                  {/* User Feedback (if exists) */}
                  {update.userFeedback && update.userFeedback.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Responses</h4>
                      {update.userFeedback.map((feedback, fbIndex) => (
                        <div key={fbIndex} style={{ background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #e5e7eb' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600', fontSize: '14px' }}>
                              U
                            </div>
                            <div>
                              <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>
                                {feedback.users?.name || 'You'}
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

                  {/* Feedback Form */}
                  <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Respond to this update</h4>
                    <form onSubmit={(e) => handleSubmitFeedback(update.id, e)}>
                      <div className="form-group" style={{ marginBottom: '12px' }}>
                        <textarea
                          value={feedbackData[update.id]?.comment || ''}
                          onChange={(e) => handleFeedbackChange(update.id, 'comment', e.target.value)}
                          placeholder="Type your response, questions, or feedback here..."
                          rows="3"
                          style={{ fontSize: '14px' }}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '500' }}>Attach images (optional, up to 3)</label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleFeedbackImageChange(update.id, e)}
                          style={{ padding: '8px', fontSize: '13px' }}
                        />
                        {feedbackData[update.id]?.images && feedbackData[update.id].images.length > 0 && (
                          <div className="image-preview" style={{ marginTop: '12px' }}>
                            {feedbackData[update.id].images.map((file, imgIdx) => (
                              <img key={imgIdx} src={URL.createObjectURL(file)} alt={`Preview ${imgIdx + 1}`} style={{ borderRadius: '8px', border: '1px solid #e5e7eb', maxHeight: '100px' }} />
                            ))}
                          </div>
                        )}
                      </div>
                      <button 
                        type="submit" 
                        className="btn btn-primary" 
                        style={{ padding: '10px 20px', fontSize: '14px' }}
                        disabled={submittingFeedback[update.id]}
                      >
                        {submittingFeedback[update.id] ? 'Submitting...' : 'Submit Response'}
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(!form.adminUpdates || form.adminUpdates.length === 0) && (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f9fafb', borderRadius: '12px', border: '1px dashed #e5e7eb' }}>
              <div style={{ width: '64px', height: '64px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <span style={{ fontSize: '32px' }}>⏳</span>
              </div>
              <h3 style={{ color: '#111827', marginBottom: '8px', fontSize: '18px', fontWeight: '600' }}>No updates yet</h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>The admin will post updates here as they work on your submission</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FormDetail;
