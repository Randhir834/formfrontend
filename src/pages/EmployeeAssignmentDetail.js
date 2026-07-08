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
          <div className="form-section">
            <h3>Client Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px 40px' }}>
              <div className="form-field">
                <label>Company Name:</label>
                <p>{form.clientInfo?.companyName || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Brand Name:</label>
                <p>{form.clientInfo?.brandName || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Contact Person:</label>
                <p>{form.clientInfo?.contactPerson || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Mobile Number:</label>
                <p>{form.clientInfo?.mobileNumber || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Email:</label>
                <p>{form.clientInfo?.email || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>FSSAI Number:</label>
                <p>{form.clientInfo?.fssaiNumber || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Manufacturer Name:</label>
                <p>{form.clientInfo?.manufacturerName || 'N/A'}</p>
              </div>
              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label>Manufacturer Address:</label>
                <p>{form.clientInfo?.manufacturerAddress || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Marketed By:</label>
                <p>{form.clientInfo?.marketedBy || 'N/A'}</p>
              </div>
              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label>Marketed By Address:</label>
                <p>{form.clientInfo?.marketedByAddress || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="form-section">
            <h3>Product Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px 40px' }}>
              <div className="form-field">
                <label>Product Name:</label>
                <p>{form.productInfo?.productName || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Product Category:</label>
                <p>{form.productInfo?.productCategory || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Product Variant:</label>
                <p>{form.productInfo?.productVariant || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Product Weight:</label>
                <p>{form.productInfo?.productWeight || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Product Dimensions:</label>
                <p>{form.productInfo?.productDimensions || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>MRP:</label>
                <p>{form.productInfo?.mrp ? `₹${form.productInfo.mrp}` : 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Shelf Life:</label>
                <p>{form.productInfo?.shelfLife || 'N/A'}</p>
              </div>
              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label>Storage Instructions:</label>
                <p>{form.productInfo?.storageInstructions || 'N/A'}</p>
              </div>
              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label>Ingredients:</label>
                <p style={{ whiteSpace: 'pre-wrap' }}>{form.productInfo?.ingredients || 'N/A'}</p>
              </div>
              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label>Nutritional Facts:</label>
                <p style={{ whiteSpace: 'pre-wrap' }}>{form.productInfo?.nutritionalFacts || 'N/A'}</p>
              </div>
              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label>Allergen Information:</label>
                <p style={{ whiteSpace: 'pre-wrap' }}>{form.productInfo?.allergenInformation || 'N/A'}</p>
              </div>
              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label>Directions for Use:</label>
                <p style={{ whiteSpace: 'pre-wrap' }}>{form.productInfo?.directionsForUse || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Target Customer */}
          <div className="form-section">
            <h3>Target Customer</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px 40px' }}>
              <div className="form-field">
                <label>Gender:</label>
                <p style={{ textTransform: 'capitalize' }}>{form.targetCustomer?.targetGender || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Age Group:</label>
                <p style={{ textTransform: 'capitalize' }}>{form.targetCustomer?.targetAge || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Income Level:</label>
                <p style={{ textTransform: 'capitalize' }}>{form.targetCustomer?.targetIncome || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Location Type:</label>
                <p style={{ textTransform: 'capitalize' }}>{form.targetCustomer?.targetLocation || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Buyer Channel:</label>
                <p style={{ textTransform: 'capitalize' }}>{form.targetCustomer?.buyerChannel || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Buyer Segment:</label>
                <p style={{ textTransform: 'capitalize' }}>{form.targetCustomer?.buyerSegment || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Business Model:</label>
                <p style={{ textTransform: 'capitalize' }}>{form.targetCustomer?.businessModel || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Package Specifications */}
          <div className="form-section">
            <h3>Package Specifications</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px 40px' }}>
              <div className="form-field">
                <label>Package Type:</label>
                <p style={{ textTransform: 'capitalize' }}>{form.packageSpec?.packageType || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Package Material:</label>
                <p style={{ textTransform: 'capitalize' }}>{form.packageSpec?.packageMaterial || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Package Finish:</label>
                <p style={{ textTransform: 'capitalize' }}>{form.packageSpec?.packageFinish || 'N/A'}</p>
              </div>
              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label>Additional Notes:</label>
                <p style={{ whiteSpace: 'pre-wrap' }}>{form.packageSpec?.packageNotes || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Design Direction */}
          <div className="form-section">
            <h3>Design Direction</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px 40px' }}>
              <div className="form-field">
                <label>Primary Color:</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                  {form.designDirection?.primaryColor && form.designDirection.primaryColor !== 'N/A' && (
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: form.designDirection.primaryColor, border: '1px solid #d1d5db' }}></div>
                  )}
                  <p>{form.designDirection?.primaryColor || 'N/A'}</p>
                </div>
              </div>
              <div className="form-field">
                <label>Secondary Color:</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                  {form.designDirection?.secondaryColor && form.designDirection.secondaryColor !== 'N/A' && (
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: form.designDirection.secondaryColor, border: '1px solid #d1d5db' }}></div>
                  )}
                  <p>{form.designDirection?.secondaryColor || 'N/A'}</p>
                </div>
              </div>
              <div className="form-field">
                <label>Accent Color:</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                  {form.designDirection?.accentColor && form.designDirection.accentColor !== 'N/A' && (
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: form.designDirection.accentColor, border: '1px solid #d1d5db' }}></div>
                  )}
                  <p>{form.designDirection?.accentColor || 'N/A'}</p>
                </div>
              </div>
              <div className="form-field">
                <label>Colors to Avoid:</label>
                <p>{form.designDirection?.colorsToAvoid || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Typography Style:</label>
                <p style={{ textTransform: 'capitalize' }}>{form.designDirection?.typographyStyle || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Design Density:</label>
                <p style={{ textTransform: 'capitalize' }}>{form.designDirection?.designDensity || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Brand Perception:</label>
                <p style={{ textTransform: 'capitalize' }}>{form.designDirection?.brandPerception || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Design Aesthetic:</label>
                <p style={{ textTransform: 'capitalize' }}>{form.designDirection?.designAesthetic || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Visual Elements:</label>
                <p style={{ textTransform: 'capitalize' }}>{form.designDirection?.visualElements || 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Imagery Style:</label>
                <p style={{ textTransform: 'capitalize' }}>{form.designDirection?.imageryStyle || 'N/A'}</p>
              </div>
              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label>Design Inspiration:</label>
                <p style={{ whiteSpace: 'pre-wrap' }}>{form.designDirection?.designInspiration || 'N/A'}</p>
              </div>
              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label>Additional Design Notes:</label>
                <p style={{ whiteSpace: 'pre-wrap' }}>{form.designDirection?.additionalNotes || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="form-section">
            <h3>Timeline</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px 40px' }}>
              <div className="form-field">
                <label>Launch Date:</label>
                <p>{form.timeline?.launchDate ? new Date(form.timeline.launchDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Printing Date:</label>
                <p>{form.timeline?.printingDate ? new Date(form.timeline.printingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Expected Delivery:</label>
                <p>{form.timeline?.expectedDelivery ? new Date(form.timeline.expectedDelivery).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
              </div>
              <div className="form-field">
                <label>Priority:</label>
                <p>
                  {form.timeline?.urgent ? (
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '6px', 
                      background: form.timeline.urgent === 'yes' ? '#fee2e2' : '#f3f4f6', 
                      color: form.timeline.urgent === 'yes' ? '#991b1b' : '#374151',
                      display: 'inline-block',
                      fontWeight: '500'
                    }}>
                      {form.timeline.urgent === 'yes' ? 'Urgent' : form.timeline.urgent === 'no' ? 'Standard' : 'Flexible'}
                    </span>
                  ) : (
                    'N/A'
                  )}
                </p>
              </div>
              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label>Timeline Notes:</label>
                <p style={{ whiteSpace: 'pre-wrap' }}>{form.timeline?.timelineNotes || 'N/A'}</p>
              </div>
            </div>
          </div>

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
