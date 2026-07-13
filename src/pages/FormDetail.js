import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getForm, submitFeedback, addComment, getComments, getImageUrl } from '../utils/api';
import ImageModal from '../components/ImageModal';

function FormDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbackData, setFeedbackData] = useState({});
  const [submittingFeedback, setSubmittingFeedback] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentImages, setCommentImages] = useState([]);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [imageModal, setImageModal] = useState({
    isOpen: false,
    imageUrl: '',
    imageTitle: ''
  });

  useEffect(() => {
    fetchForm();
    fetchComments();
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

  const fetchComments = async () => {
    try {
      const response = await getComments(id);
      setComments(response.data.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
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

  const handleCommentImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setCommentImages(files);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment || newComment.trim() === '') {
      alert('Please enter a comment');
      return;
    }

    setSubmittingComment(true);

    try {
      const data = new FormData();
      data.append('comment', newComment);
      
      if (commentImages && commentImages.length > 0) {
        commentImages.forEach((file) => {
          data.append('feedbackImages', file);
        });
      }

      await addComment(id, data);
      alert('Comment added successfully!');
      
      // Reset comment form
      setNewComment('');
      setCommentImages([]);
      
      // Refresh comments
      fetchComments();
    } catch (error) {
      alert('Error adding comment: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmittingComment(false);
    }
  };

  const openImageModal = (imageUrl, imageTitle = 'Image') => {
    setImageModal({
      isOpen: true,
      imageUrl: imageUrl,
      imageTitle: imageTitle
    });
  };

  const closeImageModal = () => {
    setImageModal({
      isOpen: false,
      imageUrl: '',
      imageTitle: ''
    });
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
              {form.clientInfo.fssaiNumber && (
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>FSSAI Number</p>
                  <p style={{ fontSize: '15px', color: '#111827' }}>{form.clientInfo.fssaiNumber}</p>
                </div>
              )}
              <div>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Manufacturer Name</p>
                <p style={{ fontSize: '15px', color: '#111827' }}>{form.clientInfo.manufacturerName}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Manufacturer Address</p>
                <p style={{ fontSize: '15px', color: '#111827' }}>{form.clientInfo.manufacturerAddress}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Marketed By</p>
                <p style={{ fontSize: '15px', color: '#111827' }}>{form.clientInfo.marketedBy}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Marketed By Address</p>
                <p style={{ fontSize: '15px', color: '#111827' }}>{form.clientInfo.marketedByAddress}</p>
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
                <p style={{ fontSize: '15px', color: '#111827' }}>{form.productInfo.productVariant || 'N/A'}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Weight</p>
                <p style={{ fontSize: '15px', color: '#111827' }}>{form.productInfo.productWeight}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Dimensions</p>
                <p style={{ fontSize: '15px', color: '#111827' }}>{form.productInfo.productDimensions}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>MRP</p>
                <p style={{ fontSize: '15px', color: '#111827', fontWeight: '600' }}>₹{form.productInfo.mrp}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Shelf Life</p>
                <p style={{ fontSize: '15px', color: '#111827' }}>{form.productInfo.shelfLife || 'N/A'}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Storage Instructions</p>
                <p style={{ fontSize: '15px', color: '#111827' }}>{form.productInfo.storageInstructions || 'N/A'}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px', fontWeight: '500' }}>Ingredients</p>
                {form.productInfo.ingredients ? (
                  <p style={{ fontSize: '15px', color: '#111827', whiteSpace: 'pre-wrap', marginBottom: '12px' }}>{form.productInfo.ingredients}</p>
                ) : (
                  <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '12px' }}>N/A</p>
                )}
                {form.ingredientsPdf && (
                  <a href={getImageUrl(form.ingredientsPdf.publicUrl)} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', border: '1px solid #fecaca' }}>
                    📄 View Ingredients PDF
                  </a>
                )}
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px', fontWeight: '500' }}>Nutritional Facts</p>
                {form.productInfo.nutritionalFacts ? (
                  <p style={{ fontSize: '15px', color: '#111827', whiteSpace: 'pre-wrap', marginBottom: '12px' }}>{form.productInfo.nutritionalFacts}</p>
                ) : (
                  <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '12px' }}>N/A</p>
                )}
                {form.nutritionalFactsPdf && (
                  <a href={getImageUrl(form.nutritionalFactsPdf.publicUrl)} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#dbeafe', color: '#1e40af', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', border: '1px solid #bfdbfe' }}>
                    📄 View Nutritional Facts PDF
                  </a>
                )}
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Allergen Information</p>
                <p style={{ fontSize: '15px', color: '#111827' }}>{form.productInfo.allergenInformation || 'N/A'}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Directions for Use</p>
                <p style={{ fontSize: '15px', color: '#111827', whiteSpace: 'pre-wrap' }}>{form.productInfo.directionsForUse}</p>
              </div>
            </div>
          </div>

          {form.logo && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ color: '#111827', marginBottom: '20px', fontSize: '17px', fontWeight: '600' }}>Product Logo</h3>
              <div 
                style={{ display: 'inline-block', padding: '16px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb', cursor: 'pointer' }}
                onClick={() => openImageModal(getImageUrl(form.logo.publicUrl), 'Product Logo')}
              >
                <img src={getImageUrl(form.logo.publicUrl)} alt="Product Logo" style={{ maxWidth: '250px', maxHeight: '250px', objectFit: 'contain', borderRadius: '8px' }} />
              </div>
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>Click to view full size</p>
            </div>
          )}

          {form.referenceImages && form.referenceImages.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ color: '#111827', marginBottom: '20px', fontSize: '17px', fontWeight: '600' }}>Reference Images</h3>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>Click any image to view full size</p>
              <div className="image-preview">
                {form.referenceImages.map((img, index) => {
                  const imageUrl = getImageUrl(img.publicUrl || img.imageUrl);
                  return (
                    <div 
                      key={index} 
                      style={{ position: 'relative', borderRadius: '12px', border: '1px solid #e5e7eb', cursor: 'pointer', overflow: 'hidden' }}
                      onClick={() => openImageModal(imageUrl, `Reference Image ${index + 1}`)}
                    >
                      <img src={imageUrl} alt={`Reference ${index + 1}`} style={{ borderRadius: '12px', border: '1px solid #e5e7eb', width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                        Click to enlarge
                      </div>
                    </div>
                  );
                })}
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
                        {update.progress_images.map((img, idx) => {
                          const imageUrl = getImageUrl(img.publicUrl || img.imageUrl);
                          return (
                            <div 
                              key={idx} 
                              style={{ position: 'relative', cursor: 'pointer', borderRadius: '12px', overflow: 'hidden' }}
                              onClick={() => openImageModal(imageUrl, `Progress Image ${idx + 1}`)}
                            >
                              <img src={imageUrl} alt={`Progress ${idx + 1}`} style={{ borderRadius: '12px', border: '1px solid #e5e7eb', width: '100%', height: '100%', objectFit: 'cover' }} />
                              <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                                Click to enlarge
                              </div>
                            </div>
                          );
                        })}
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
                              {feedback.feedback_images.map((img, imgIdx) => {
                                const imageUrl = getImageUrl(img.publicUrl || img.imageUrl);
                                return (
                                  <div 
                                    key={imgIdx} 
                                    style={{ position: 'relative', cursor: 'pointer', borderRadius: '8px', overflow: 'hidden' }}
                                    onClick={() => openImageModal(imageUrl, `Feedback Image ${imgIdx + 1}`)}
                                  >
                                    <img src={imageUrl} alt={`Feedback ${imgIdx + 1}`} style={{ borderRadius: '8px', border: '1px solid #e5e7eb', maxHeight: '150px', width: '100%', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                                      Click to enlarge
                                    </div>
                                  </div>
                                );
                              })}
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

          {/* Comments & Discussion Section */}
          <div style={{ marginTop: '48px', paddingTop: '48px', borderTop: '2px solid #f3f4f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ color: '#111827', fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>Comments & Discussion</h3>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Add comments, ask questions, or provide additional information</p>
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#2563eb', background: '#eff6ff', padding: '6px 12px', borderRadius: '20px' }}>
                {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
              </span>
            </div>

            {/* Add New Comment Form */}
            <div style={{ background: '#f9fafb', padding: '24px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
              <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Add a comment</h4>
              <form onSubmit={handleSubmitComment}>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts, questions, or additional information..."
                    rows="4"
                    style={{ fontSize: '14px' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '500' }}>Attach images (optional, up to 5)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleCommentImageChange}
                    style={{ padding: '8px', fontSize: '13px' }}
                  />
                  {commentImages && commentImages.length > 0 && (
                    <div className="image-preview" style={{ marginTop: '12px' }}>
                      {commentImages.map((file, imgIdx) => (
                        <img key={imgIdx} src={URL.createObjectURL(file)} alt={`Preview ${imgIdx + 1}`} style={{ borderRadius: '8px', border: '1px solid #e5e7eb', maxHeight: '100px' }} />
                      ))}
                    </div>
                  )}
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ padding: '10px 20px', fontSize: '14px' }}
                  disabled={submittingComment}
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            </div>

            {/* Comments List */}
            {comments.length > 0 ? (
              <div>
                {comments.map((comment) => (
                  <div key={comment.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '16px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        background: comment.users?.role === 'admin' ? '#2563eb' : comment.users?.role === 'employee' ? '#7c3aed' : '#10b981',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: 'white', 
                        fontWeight: '600', 
                        fontSize: '16px' 
                      }}>
                        {comment.users?.role === 'admin' ? 'A' : comment.users?.role === 'employee' ? 'E' : 'U'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>
                          {comment.users?.name}
                          {comment.users?.role && (
                            <span style={{ 
                              marginLeft: '8px', 
                              fontSize: '11px', 
                              fontWeight: '600', 
                              textTransform: 'uppercase', 
                              color: comment.users.role === 'admin' ? '#2563eb' : comment.users.role === 'employee' ? '#7c3aed' : '#10b981',
                              background: comment.users.role === 'admin' ? '#eff6ff' : comment.users.role === 'employee' ? '#f3e8ff' : '#d1fae5',
                              padding: '2px 8px',
                              borderRadius: '4px'
                            }}>
                              {comment.users.role}
                            </span>
                          )}
                        </p>
                        <p style={{ fontSize: '13px', color: '#6b7280' }}>
                          {new Date(comment.created_at).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <p style={{ fontSize: '15px', color: '#111827', lineHeight: '1.6', marginBottom: '8px', whiteSpace: 'pre-wrap' }}>{comment.comment}</p>
                    {comment.feedback_images && comment.feedback_images.length > 0 && (
                      <div className="image-preview" style={{ marginTop: '12px' }}>
                        {comment.feedback_images.map((img, imgIdx) => {
                          const imageUrl = getImageUrl(img.publicUrl || img.imageUrl);
                          return (
                            <div 
                              key={imgIdx} 
                              style={{ position: 'relative', cursor: 'pointer', borderRadius: '8px', overflow: 'hidden' }}
                              onClick={() => openImageModal(imageUrl, `Comment Image ${imgIdx + 1}`)}
                            >
                              <img src={imageUrl} alt={`Comment ${imgIdx + 1}`} style={{ borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%', height: '100%', objectFit: 'cover' }} />
                              <div style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                                Click to enlarge
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: 'white', borderRadius: '12px', border: '1px dashed #e5e7eb' }}>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>No comments yet. Be the first to add a comment!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={imageModal.isOpen}
        imageUrl={imageModal.imageUrl}
        imageTitle={imageModal.imageTitle}
        onClose={closeImageModal}
      />
    </div>
  );
}

export default FormDetail;
