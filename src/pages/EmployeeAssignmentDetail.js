import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssignmentDetail } from '../utils/api';
import { getImageUrl } from '../utils/api';
import ImageModal from '../components/ImageModal';

function EmployeeAssignmentDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageModal, setImageModal] = useState({
    isOpen: false,
    imageUrl: '',
    imageTitle: ''
  });

  useEffect(() => {
    fetchFormDetails();
  }, [id]);

  const fetchFormDetails = async () => {
    try {
      const response = await getAssignmentDetail(id);
      setForm(response.data.data);
    } catch (error) {
      console.error('Error fetching assignment details:', error);
      if (error.response?.status === 404) {
        alert('Assignment not found or not assigned to you');
        navigate('/employee/dashboard');
      } else if (error.response?.status === 403) {
        alert('Access denied');
        navigate('/login');
      }
    } finally {
      setLoading(false);
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
  if (!form) return <div className="error">Assignment not found</div>;

  const renderSection = (title, data, keys) => (
    <div className="form-section">
      <h3>{title}</h3>
      {keys.map(({ key, label }) => (
        <div key={key} className="form-field">
          <label>{label}:</label>
          <p>{data?.[key] || 'N/A'}</p>
        </div>
      ))}
    </div>
  );

  const renderImages = (images, title) => {
    if (!images || images.length === 0) return null;
    
    return (
      <div className="form-section">
        <h3>{title}</h3>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>Click any image to view full size</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
          {images.map((img, index) => {
            const imageUrl = typeof img === 'object' ? (img.publicUrl || img.url) : img;
            return (
              <div 
                key={index} 
                style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
                onClick={() => openImageModal(getImageUrl(imageUrl), `${title} ${index + 1}`)}
              >
                <img 
                  src={getImageUrl(imageUrl)} 
                  alt={`Reference ${index + 1}`}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div style="padding: 20px; text-align: center; background: #f3f4f6; height: 200px; display: flex; align-items: center; justify-content: center; color: #6b7280;">Image not available</div>';
                  }}
                />
                <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                  Click to enlarge
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="navbar">
        <h2>Innovative Media Form System • Employee Portal</h2>
        <div className="navbar-right">
          <span>Welcome, {user?.name}</span>
          <button onClick={() => navigate('/employee/dashboard')} className="btn btn-secondary">
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: '#111827' }}>
              Assignment Details
            </h1>
            <p style={{ color: '#6b7280', fontSize: '15px' }}>
              Complete information about this form submission
            </p>
          </div>
          <div>
            <span className={`status-badge status-${form.status}`} style={{ fontSize: '16px', padding: '10px 20px' }}>
              {form.status}
            </span>
          </div>
        </div>

        <div className="card">
          {/* Submission Info */}
          <div className="form-section" style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Submitted By
                </label>
                <p style={{ fontWeight: '500', color: '#111827', marginTop: '4px' }}>
                  {form.userId?.name}
                </p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  {form.userId?.email}
                </p>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Submission Date
                </label>
                <p style={{ fontWeight: '500', color: '#111827', marginTop: '4px' }}>
                  {new Date(form.submittedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Form ID
                </label>
                <p style={{ fontWeight: '500', color: '#111827', marginTop: '4px', fontSize: '12px', fontFamily: 'monospace' }}>
                  {form._id}
                </p>
              </div>
            </div>
          </div>

          {/* Client Information */}
          {renderSection('Client Information', form.clientInfo, [
            { key: 'companyName', label: 'Company Name' },
            { key: 'brandName', label: 'Brand Name' },
            { key: 'contactPerson', label: 'Contact Person' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' }
          ])}

          {/* Product Information */}
          {renderSection('Product Information', form.productInfo, [
            { key: 'productName', label: 'Product Name' },
            { key: 'category', label: 'Category' },
            { key: 'description', label: 'Description' },
            { key: 'usp', label: 'Unique Selling Points' }
          ])}

          {/* Target Customer */}
          {renderSection('Target Customer', form.targetCustomer, [
            { key: 'ageGroup', label: 'Age Group' },
            { key: 'gender', label: 'Gender' },
            { key: 'lifestyle', label: 'Lifestyle' },
            { key: 'preferences', label: 'Preferences' }
          ])}

          {/* Package Specifications */}
          {renderSection('Package Specifications', form.packageSpec, [
            { key: 'packagingType', label: 'Packaging Type' },
            { key: 'dimensions', label: 'Dimensions' },
            { key: 'material', label: 'Material' },
            { key: 'printingMethod', label: 'Printing Method' },
            { key: 'quantity', label: 'Quantity' }
          ])}

          {/* Design Direction */}
          {renderSection('Design Direction', form.designDirection, [
            { key: 'colorPreferences', label: 'Color Preferences' },
            { key: 'style', label: 'Style' },
            { key: 'typography', label: 'Typography' },
            { key: 'imagery', label: 'Imagery' },
            { key: 'additionalNotes', label: 'Additional Notes' }
          ])}

          {/* Timeline */}
          {renderSection('Timeline', form.timeline, [
            { key: 'projectDeadline', label: 'Project Deadline' },
            { key: 'urgency', label: 'Urgency Level' }
          ])}

          {/* Logo */}
          {form.logo && (
            <div className="form-section">
              <h3>Company Logo</h3>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>Click to view full size</p>
              <div style={{ marginTop: '16px' }}>
                <div 
                  style={{ display: 'inline-block', cursor: 'pointer', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}
                  onClick={() => openImageModal(getImageUrl(form.logo.publicUrl || form.logo.url || form.logo), 'Company Logo')}
                >
                  <img 
                    src={getImageUrl(form.logo.publicUrl || form.logo.url || form.logo)} 
                    alt="Company Logo"
                    style={{ maxWidth: '300px', maxHeight: '200px', display: 'block' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div style="padding: 20px; background: #f3f4f6; color: #6b7280; border-radius: 8px;">Logo not available</div>';
                    }}
                  />
                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                    Click to enlarge
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reference Images */}
          {renderImages(form.referenceImages, 'Reference Images')}

          {/* PDF Documents */}
          {(form.nutritionalFactsPdf || form.ingredientsPdf) && (
            <div className="form-section">
              <h3>Documents</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                {form.nutritionalFactsPdf && (
                  <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '500' }}>📄 Nutritional Facts PDF</span>
                    <a 
                      href={getImageUrl(form.nutritionalFactsPdf.publicUrl || form.nutritionalFactsPdf.url || form.nutritionalFactsPdf)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                      View PDF
                    </a>
                  </div>
                )}
                {form.ingredientsPdf && (
                  <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '500' }}>📄 Ingredients List PDF</span>
                    <a 
                      href={getImageUrl(form.ingredientsPdf.publicUrl || form.ingredientsPdf.url || form.ingredientsPdf)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                      View PDF
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Admin Updates */}
          {form.adminUpdates && form.adminUpdates.length > 0 && (
            <div className="form-section">
              <h3>Admin Updates & Progress</h3>
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {form.adminUpdates.map(update => (
                  <div key={update.id} style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div>
                        <p style={{ fontWeight: '500', color: '#111827' }}>{update.users?.name || 'Admin'}</p>
                        <p style={{ fontSize: '14px', color: '#6b7280' }}>
                          {new Date(update.created_at).toLocaleString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {update.status && (
                        <span className={`status-badge status-${update.status}`}>
                          {update.status}
                        </span>
                      )}
                    </div>
                    {update.comment && (
                      <p style={{ color: '#374151', marginBottom: '12px' }}>{update.comment}</p>
                    )}
                    {update.progress_images && update.progress_images.length > 0 && (
                      <div>
                        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>Click any image to view full size</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px', marginTop: '12px' }}>
                          {update.progress_images.map((img, idx) => {
                            const imageUrl = getImageUrl(img.publicUrl || img.url || img);
                            return (
                              <div 
                                key={idx}
                                style={{ position: 'relative', cursor: 'pointer', borderRadius: '6px', overflow: 'hidden' }}
                                onClick={() => openImageModal(imageUrl, `Progress Image ${idx + 1}`)}
                              >
                                <img 
                                  src={imageUrl} 
                                  alt={`Progress ${idx + 1}`}
                                  style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                  onError={(e) => e.target.style.display = 'none'}
                                />
                                <div style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                                  Click to enlarge
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
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

export default EmployeeAssignmentDetail;
