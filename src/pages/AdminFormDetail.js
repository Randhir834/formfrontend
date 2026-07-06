import { useState, useEffect } from 'react';
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
                  <p style={{ fontSize: '15px', color: '#111827', fontWeight: '500' }}>{form.clientInfo.companyName || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Brand</p>
                  <p style={{ fontSize: '15px', color: '#111827', fontWeight: '500' }}>{form.clientInfo.brandName || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Contact</p>
                  <p style={{ fontSize: '15px', color: '#111827' }}>{form.clientInfo.contactPerson || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Mobile</p>
                  <p style={{ fontSize: '15px', color: '#111827' }}>{form.clientInfo.mobileNumber || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Email</p>
                  <p style={{ fontSize: '15px', color: '#111827' }}>{form.clientInfo.email || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>FSSAI Number</p>
                  <p style={{ fontSize: '15px', color: '#111827' }}>{form.clientInfo.fssaiNumber || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Manufacturer Name</p>
                  <p style={{ fontSize: '15px', color: '#111827' }}>{form.clientInfo.manufacturerName || 'N/A'}</p>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Manufacturer Address</p>
                  <p style={{ fontSize: '15px', color: '#111827' }}>{form.clientInfo.manufacturerAddress || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Marketed By</p>
                  <p style={{ fontSize: '15px', color: '#111827' }}>{form.clientInfo.marketedBy || 'N/A'}</p>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Marketed By Address</p>
                  <p style={{ fontSize: '15px', color: '#111827' }}>{form.clientInfo.marketedByAddress || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ color: '#111827', marginBottom: '20px', fontSize: '17px', fontWeight: '600' }}>Product Information</h3>
              <div className="grid-2" style={{ gap: '20px 40px' }}>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Product</p>
                  <p style={{ fontSize: '15px', color: '#111827', fontWeight: '500' }}>{form.productInfo.productName || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Product Name (Category)</p>
                  <p style={{ fontSize: '15px', color: '#111827' }}>{form.productInfo.productCategory || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Variant</p>
                  <p style={{ fontSize: '15px', color: '#111827' }}>{form.productInfo.productVariant || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Product Weight</p>
                  <p style={{ fontSize: '15px', color: '#111827' }}>{form.productInfo.productWeight || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Product Dimensions</p>
                  <p style={{ fontSize: '15px', color: '#111827' }}>{form.productInfo.productDimensions || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>MRP</p>
                  <p style={{ fontSize: '15px', color: '#111827', fontWeight: '600' }}>{form.productInfo.mrp ? `₹${form.productInfo.mrp}` : 'N/A'}</p>
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
                  <p style={{ fontSize: '15px', color: '#111827', whiteSpace: 'pre-wrap' }}>{form.productInfo.allergenInformation || 'N/A'}</p>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Directions for Use</p>
                  <p style={{ fontSize: '15px', color: '#111827', whiteSpace: 'pre-wrap' }}>{form.productInfo.directionsForUse || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ color: '#111827', marginBottom: '20px', fontSize: '17px', fontWeight: '600' }}>Product Logo</h3>
              {form.logo ? (
                <div style={{ display: 'inline-block', padding: '16px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                  <img src={getImageUrl(form.logo.publicUrl)} alt="Product Logo" style={{ maxWidth: '250px', maxHeight: '250px', objectFit: 'contain', borderRadius: '8px' }} />
                </div>
              ) : (
                <p style={{ fontSize: '15px', color: '#6b7280' }}>N/A</p>
              )}
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ color: '#111827', marginBottom: '20px', fontSize: '17px', fontWeight: '600' }}>Target Customer</h3>
              <div className="grid-2" style={{ gap: '20px 40px' }}>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Gender</p>
                  <p style={{ fontSize: '15px', color: '#111827', textTransform: 'capitalize' }}>{form.targetCustomer.targetGender || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Age Group</p>
                  <p style={{ fontSize: '15px', color: '#111827', textTransform: 'capitalize' }}>{form.targetCustomer.targetAge || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Income Level</p>
                  <p style={{ fontSize: '15px', color: '#111827', textTransform: 'capitalize' }}>{form.targetCustomer.targetIncome || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Location Type</p>
                  <p style={{ fontSize: '15px', color: '#111827', textTransform: 'capitalize' }}>{form.targetCustomer.targetLocation || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Buyer Channel</p>
                  <p style={{ fontSize: '15px', color: '#111827', textTransform: 'capitalize' }}>{form.targetCustomer.buyerChannel || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Buyer Segment</p>
                  <p style={{ fontSize: '15px', color: '#111827', textTransform: 'capitalize' }}>{form.targetCustomer.buyerSegment || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Business Model</p>
                  <p style={{ fontSize: '15px', color: '#111827', textTransform: 'capitalize' }}>{form.targetCustomer.businessModel || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ color: '#111827', marginBottom: '20px', fontSize: '17px', fontWeight: '600' }}>Package Specifications</h3>
              <div className="grid-2" style={{ gap: '20px 40px' }}>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Package Type</p>
                  <p style={{ fontSize: '15px', color: '#111827', textTransform: 'capitalize' }}>{form.packageSpec.packageType || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Package Material</p>
                  <p style={{ fontSize: '15px', color: '#111827', textTransform: 'capitalize' }}>{form.packageSpec.packageMaterial || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Package Finish</p>
                  <p style={{ fontSize: '15px', color: '#111827', textTransform: 'capitalize' }}>{form.packageSpec.packageFinish || 'N/A'}</p>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Additional Notes</p>
                  <p style={{ fontSize: '15px', color: '#111827', whiteSpace: 'pre-wrap' }}>{form.packageSpec.packageNotes || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ color: '#111827', marginBottom: '20px', fontSize: '17px', fontWeight: '600' }}>Design Direction</h3>
              <div className="grid-2" style={{ gap: '20px 40px' }}>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Primary Color</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: form.designDirection.primaryColor || '#e5e7eb', border: '1px solid #d1d5db' }}></div>
                    <p style={{ fontSize: '15px', color: '#111827', fontWeight: '500' }}>{form.designDirection.primaryColor || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Secondary Color</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: form.designDirection.secondaryColor || '#e5e7eb', border: '1px solid #d1d5db' }}></div>
                    <p style={{ fontSize: '15px', color: '#111827', fontWeight: '500' }}>{form.designDirection.secondaryColor || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Accent Color</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: form.designDirection.accentColor || '#e5e7eb', border: '1px solid #d1d5db' }}></div>
                    <p style={{ fontSize: '15px', color: '#111827', fontWeight: '500' }}>{form.designDirection.accentColor || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Colors to Avoid</p>
                  <p style={{ fontSize: '15px', color: '#111827' }}>{form.designDirection.colorsToAvoid || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Typography Style</p>
                  <p style={{ fontSize: '15px', color: '#111827', textTransform: 'capitalize' }}>{form.designDirection.typographyStyle || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Design Density</p>
                  <p style={{ fontSize: '15px', color: '#111827', textTransform: 'capitalize' }}>{form.designDirection.designDensity || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Brand Perception</p>
                  <p style={{ fontSize: '15px', color: '#111827', textTransform: 'capitalize' }}>{form.designDirection.brandPerception || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Design Aesthetic</p>
                  <p style={{ fontSize: '15px', color: '#111827', textTransform: 'capitalize' }}>{form.designDirection.designAesthetic || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Visual Elements</p>
                  <p style={{ fontSize: '15px', color: '#111827', textTransform: 'capitalize' }}>{form.designDirection.visualElements || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Imagery Style</p>
                  <p style={{ fontSize: '15px', color: '#111827', textTransform: 'capitalize' }}>{form.designDirection.imageryStyle || 'N/A'}</p>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Design Inspiration</p>
                  <p style={{ fontSize: '15px', color: '#111827', whiteSpace: 'pre-wrap' }}>{form.designDirection.designInspiration || 'N/A'}</p>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Additional Design Notes</p>
                  <p style={{ fontSize: '15px', color: '#111827', whiteSpace: 'pre-wrap' }}>{form.designDirection.additionalNotes || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ color: '#111827', marginBottom: '20px', fontSize: '17px', fontWeight: '600' }}>Timeline</h3>
              <div className="grid-2" style={{ gap: '20px 40px' }}>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Launch Date</p>
                  <p style={{ fontSize: '15px', color: '#111827', fontWeight: '500' }}>
                    {form.timeline.launchDate ? new Date(form.timeline.launchDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Printing Date</p>
                  <p style={{ fontSize: '15px', color: '#111827', fontWeight: '500' }}>
                    {form.timeline.printingDate ? new Date(form.timeline.printingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Expected Delivery</p>
                  <p style={{ fontSize: '15px', color: '#111827', fontWeight: '500' }}>
                    {form.timeline.expectedDelivery ? new Date(form.timeline.expectedDelivery).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Priority</p>
                  <p style={{ fontSize: '15px', color: '#111827', textTransform: 'capitalize', fontWeight: '500' }}>
                    {form.timeline.urgent ? (
                      <span style={{ padding: '4px 12px', borderRadius: '6px', background: form.timeline.urgent === 'yes' ? '#fee2e2' : '#f3f4f6', color: form.timeline.urgent === 'yes' ? '#991b1b' : '#374151' }}>
                        {form.timeline.urgent === 'yes' ? 'Urgent' : form.timeline.urgent === 'no' ? 'Standard' : 'Flexible'}
                      </span>
                    ) : (
                      'N/A'
                    )}
                  </p>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Timeline Notes</p>
                  <p style={{ fontSize: '15px', color: '#111827', whiteSpace: 'pre-wrap' }}>{form.timeline.timelineNotes || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ color: '#111827', marginBottom: '20px', fontSize: '17px', fontWeight: '600' }}>Reference Images</h3>
              {form.referenceImages && form.referenceImages.length > 0 ? (
                <div className="image-preview">
                  {form.referenceImages.map((img, index) => (
                    <img key={index} src={getImageUrl(img.publicUrl || img.imageUrl)} alt={`Reference ${index + 1}`} style={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '15px', color: '#6b7280' }}>N/A</p>
              )}
            </div>

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
                            <img key={idx} src={getImageUrl(img.publicUrl || img.imageUrl)} alt={`Progress ${idx + 1}`} style={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
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
                                  <img key={imgIdx} src={getImageUrl(img.publicUrl || img.imageUrl)} alt={`Feedback ${imgIdx + 1}`} style={{ borderRadius: '8px', border: '1px solid #e5e7eb', maxHeight: '150px' }} />
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
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
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
