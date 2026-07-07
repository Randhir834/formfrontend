import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getForm, updateFormStatus, getImageUrl, getEmployeeList, assignFormToEmployee, unassignForm } from '../utils/api';
import ImageModal from '../components/ImageModal';

function AdminFormDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    comment: '',
    progressImages: []
  });
  const [imageModal, setImageModal] = useState({
    isOpen: false,
    imageUrl: '',
    imageTitle: ''
  });
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  useEffect(() => {
    fetchForm();
    fetchEmployees();
  }, [id]);

  const fetchEmployees = async () => {
    try {
      const response = await getEmployeeList();
      setEmployees(response.data.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

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

  const handleAssign = async () => {
    if (!selectedEmployee) {
      alert('Please select an employee');
      return;
    }

    try {
      await assignFormToEmployee(id, selectedEmployee);
      alert('Form assigned successfully!');
      setShowAssignModal(false);
      fetchForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to assign form');
    }
  };

  const handleUnassign = async () => {
    if (window.confirm('Are you sure you want to unassign this form?')) {
      try {
        await unassignForm(id);
        alert('Form unassigned successfully!');
        fetchForm();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to unassign form');
      }
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

  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    e.target.style.border = '2px solid #ef4444';
    e.target.alt = 'Failed to load image';
  };

  const downloadImage = async (imageUrl, filename) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Trying alternative method...');
      window.open(imageUrl, '_blank');
    }
  };

  const downloadAllData = () => {
    // Create a comprehensive text report
    let report = `FORM SUBMISSION COMPLETE DATA REPORT
========================================
Generated: ${new Date().toLocaleString()}

SUBMISSION OVERVIEW
------------------
Submitted By: ${form.userId?.name || 'N/A'} (${form.userId?.email || 'N/A'})
Submission Date: ${new Date(form.submittedAt).toLocaleString()}
Status: ${form.status}
Priority: ${form.timeline?.urgent === 'yes' ? 'URGENT' : form.timeline?.urgent === 'no' ? 'Standard' : 'Flexible'}
Approval Confirmed: ${form.approvalConfirmed ? 'Yes' : 'No'}
${form.assignedTo ? `Assigned To: ${form.assignedTo.name} (${form.assignedTo.email})` : 'Assigned To: Unassigned'}

CLIENT INFORMATION
------------------
Company Name: ${form.clientInfo?.companyName || 'N/A'}
Brand Name: ${form.clientInfo?.brandName || 'N/A'}
Contact Person: ${form.clientInfo?.contactPerson || 'N/A'}
Mobile Number: ${form.clientInfo?.mobileNumber || 'N/A'}
Email: ${form.clientInfo?.email || 'N/A'}
FSSAI Number: ${form.clientInfo?.fssaiNumber || 'N/A'}
Manufacturer Name: ${form.clientInfo?.manufacturerName || 'N/A'}
Manufacturer Address: ${form.clientInfo?.manufacturerAddress || 'N/A'}
Marketed By: ${form.clientInfo?.marketedBy || 'N/A'}
Marketed By Address: ${form.clientInfo?.marketedByAddress || 'N/A'}

PRODUCT INFORMATION
-------------------
Product Name: ${form.productInfo?.productName || 'N/A'}
Product Category: ${form.productInfo?.productCategory || 'N/A'}
Product Variant: ${form.productInfo?.productVariant || 'N/A'}
Product Weight: ${form.productInfo?.productWeight || 'N/A'}
Product Dimensions: ${form.productInfo?.productDimensions || 'N/A'}
MRP: ${form.productInfo?.mrp ? `₹${form.productInfo.mrp}` : 'N/A'}
Shelf Life: ${form.productInfo?.shelfLife || 'N/A'}
Storage Instructions: ${form.productInfo?.storageInstructions || 'N/A'}

Ingredients: ${form.productInfo?.ingredients || 'N/A'}
${form.ingredientsPdf ? `Ingredients PDF: ${form.ingredientsPdf.publicUrl}` : ''}

Nutritional Facts: ${form.productInfo?.nutritionalFacts || 'N/A'}
${form.nutritionalFactsPdf ? `Nutritional Facts PDF: ${form.nutritionalFactsPdf.publicUrl}` : ''}

Allergen Information: ${form.productInfo?.allergenInformation || 'N/A'}
Directions for Use: ${form.productInfo?.directionsForUse || 'N/A'}

${form.logo ? `Product Logo: ${form.logo.publicUrl}` : 'Product Logo: N/A'}

TARGET CUSTOMER
---------------
Gender: ${form.targetCustomer?.targetGender || 'N/A'}
Age Group: ${form.targetCustomer?.targetAge || 'N/A'}
Income Level: ${form.targetCustomer?.targetIncome || 'N/A'}
Location Type: ${form.targetCustomer?.targetLocation || 'N/A'}
Buyer Channel: ${form.targetCustomer?.buyerChannel || 'N/A'}
Buyer Segment: ${form.targetCustomer?.buyerSegment || 'N/A'}
Business Model: ${form.targetCustomer?.businessModel || 'N/A'}

PACKAGE SPECIFICATIONS
---------------------
Package Type: ${form.packageSpec?.packageType || 'N/A'}
Package Material: ${form.packageSpec?.packageMaterial || 'N/A'}
Package Finish: ${form.packageSpec?.packageFinish || 'N/A'}
Additional Notes: ${form.packageSpec?.packageNotes || 'N/A'}

DESIGN DIRECTION
----------------
Primary Color: ${form.designDirection?.primaryColor || 'N/A'}
Secondary Color: ${form.designDirection?.secondaryColor || 'N/A'}
Accent Color: ${form.designDirection?.accentColor || 'N/A'}
Colors to Avoid: ${form.designDirection?.colorsToAvoid || 'N/A'}
Typography Style: ${form.designDirection?.typographyStyle || 'N/A'}
Design Density: ${form.designDirection?.designDensity || 'N/A'}
Brand Perception: ${form.designDirection?.brandPerception || 'N/A'}
Design Aesthetic: ${form.designDirection?.designAesthetic || 'N/A'}
Visual Elements: ${form.designDirection?.visualElements || 'N/A'}
Imagery Style: ${form.designDirection?.imageryStyle || 'N/A'}
Design Inspiration: ${form.designDirection?.designInspiration || 'N/A'}
Additional Design Notes: ${form.designDirection?.additionalNotes || 'N/A'}

TIMELINE
--------
Launch Date: ${form.timeline?.launchDate ? new Date(form.timeline.launchDate).toLocaleDateString() : 'N/A'}
Printing Date: ${form.timeline?.printingDate ? new Date(form.timeline.printingDate).toLocaleDateString() : 'N/A'}
Expected Delivery: ${form.timeline?.expectedDelivery ? new Date(form.timeline.expectedDelivery).toLocaleDateString() : 'N/A'}
Timeline Notes: ${form.timeline?.timelineNotes || 'N/A'}

REFERENCE IMAGES
----------------
${form.referenceImages && form.referenceImages.length > 0 ? 
  form.referenceImages.map((img, index) => 
    `Reference Image ${index + 1}: ${getImageUrl(img.publicUrl || img.imageUrl)}`
  ).join('\n') : 'No reference images'}

${form.adminUpdates && form.adminUpdates.length > 0 ? `
ADMIN UPDATES & USER FEEDBACK
------------------------------
${form.adminUpdates.map((update, index) => `
Update #${index + 1}
Date: ${new Date(update.created_at).toLocaleString()}
Admin: ${update.users?.name || 'Admin'}
Status: ${update.status}
Comment: ${update.comment}
${update.progress_images && update.progress_images.length > 0 ? 
  `Progress Images:\n${update.progress_images.map((img, idx) => `  - ${getImageUrl(img.publicUrl)}`).join('\n')}` : ''}

${update.userFeedback && update.userFeedback.length > 0 ? 
  `User Responses:\n${update.userFeedback.map((fb, fbIdx) => `
  Feedback #${fbIdx + 1}
  Date: ${new Date(fb.created_at).toLocaleString()}
  User: ${fb.users?.name || 'User'}
  Comment: ${fb.comment}
  ${fb.feedback_images && fb.feedback_images.length > 0 ? 
    `Images:\n${fb.feedback_images.map((img) => `    - ${getImageUrl(img.publicUrl)}`).join('\n')}` : ''}`).join('\n')}` : ''}
`).join('\n')}` : ''}

========================================
END OF REPORT
`;

    // Create and download the file
    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `form-${form._id}-${form.clientInfo?.companyName || 'data'}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!form) return null;

  return (
    <div>
      <div className="navbar">
        <h2>Innovative Media Form System • Admin</h2>
        <div className="navbar-right">
          <button 
            onClick={downloadAllData} 
            className="btn btn-primary"
            style={{ marginRight: '12px', background: '#059669' }}
          >
            📥 Download Complete Data
          </button>
          <button onClick={() => navigate('/admin')} className="btn btn-secondary">
            ← Back to Admin
          </button>
        </div>
      </div>

      <div className="container">
        {/* Submission Summary Card */}
        <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px', color: 'white' }}>
                {form.productInfo?.productName || 'N/A'}
              </h2>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <div>
                  <p style={{ fontSize: '13px', opacity: '0.9', marginBottom: '4px' }}>Company</p>
                  <p style={{ fontSize: '16px', fontWeight: '600' }}>{form.clientInfo?.companyName || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', opacity: '0.9', marginBottom: '4px' }}>Brand</p>
                  <p style={{ fontSize: '16px', fontWeight: '600' }}>{form.clientInfo?.brandName || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', opacity: '0.9', marginBottom: '4px' }}>MRP</p>
                  <p style={{ fontSize: '16px', fontWeight: '600' }}>₹{form.productInfo?.mrp || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', opacity: '0.9', marginBottom: '4px' }}>Launch Date</p>
                  <p style={{ fontSize: '16px', fontWeight: '600' }}>
                    {form.timeline?.launchDate ? 
                      new Date(form.timeline.launchDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      }) 
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span className={`status-badge status-${form.status}`} style={{ fontSize: '14px', padding: '6px 14px' }}>
                  {form.status}
                </span>
                {form.timeline?.urgent === 'yes' && (
                  <span style={{ 
                    padding: '6px 14px', 
                    borderRadius: '8px', 
                    background: 'rgba(239, 68, 68, 0.2)', 
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: '600',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    🔴 URGENT
                  </span>
                )}
                {form.approvalConfirmed && (
                  <span style={{ 
                    padding: '6px 14px', 
                    borderRadius: '8px', 
                    background: 'rgba(34, 197, 94, 0.2)', 
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: '600',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    ✓ Approval Confirmed
                  </span>
                )}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '13px', opacity: '0.9', marginBottom: '4px' }}>Submitted By</p>
              <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>{form.userId?.name || 'N/A'}</p>
              <p style={{ fontSize: '13px', opacity: '0.8' }}>
                {new Date(form.submittedAt).toLocaleString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'start', gap: '24px' }}>
          {/* Form Details */}
          <div className="card">
            <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: '#111827' }}>Complete Form Data</h2>
              <p style={{ color: '#6b7280', fontSize: '15px' }}>All information submitted by the user</p>
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
                <div style={{ display: 'inline-block', position: 'relative' }}>
                  <div 
                    style={{ padding: '16px', background: '#f9fafb', borderRadius: '12px', border: '2px solid #e5e7eb', cursor: 'pointer' }}
                    onClick={() => openImageModal(getImageUrl(form.logo.publicUrl), 'Product Logo')}
                  >
                    <img 
                      src={getImageUrl(form.logo.publicUrl)} 
                      alt="Product Logo" 
                      style={{ maxWidth: '250px', maxHeight: '250px', objectFit: 'contain', borderRadius: '8px' }}
                      onError={handleImageError}
                    />
                  </div>
                  <button 
                    onClick={() => downloadImage(getImageUrl(form.logo.publicUrl), 'product-logo.jpg')}
                    style={{ marginTop: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}
                  >
                    📥 Download Logo
                  </button>
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
                <div className="image-preview" style={{ gap: '16px' }}>
                  {form.referenceImages.map((img, index) => {
                    const imageUrl = getImageUrl(img.publicUrl || img.imageUrl);
                    return (
                      <div key={index} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '2px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer' }}>
                        <img 
                          src={imageUrl} 
                          alt={`Reference ${index + 1}`} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                          onClick={() => openImageModal(imageUrl, `Reference Image ${index + 1}`)}
                          onError={handleImageError}
                        />
                        <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: 'white', fontSize: '12px', fontWeight: '600' }}>Reference {index + 1}</span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); downloadImage(imageUrl, `reference-${index + 1}.jpg`); }}
                            style={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600', color: '#111827' }}
                          >
                            📥 Download
                          </button>
                        </div>
                      </div>
                    );
                  })}
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
                          {update.progress_images.map((img, idx) => {
                            const imageUrl = getImageUrl(img.publicUrl || img.imageUrl);
                            return (
                              <img 
                                key={idx} 
                                src={imageUrl} 
                                alt={`Progress ${idx + 1}`} 
                                style={{ borderRadius: '12px', border: '1px solid #e5e7eb', cursor: 'pointer' }}
                                onClick={() => openImageModal(imageUrl, `Progress Image ${idx + 1}`)}
                                onError={handleImageError}
                              />
                            );
                          })}
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
                                {feedback.feedback_images.map((img, imgIdx) => {
                                  const imageUrl = getImageUrl(img.publicUrl || img.imageUrl);
                                  return (
                                    <img 
                                      key={imgIdx} 
                                      src={imageUrl} 
                                      alt={`Feedback ${imgIdx + 1}`} 
                                      style={{ borderRadius: '8px', border: '1px solid #e5e7eb', maxHeight: '150px', cursor: 'pointer' }}
                                      onClick={() => openImageModal(imageUrl, `Feedback Image ${imgIdx + 1}`)}
                                      onError={handleImageError}
                                    />
                                  );
                                })}
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
            {/* Assignment Section */}
            <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#111827' }}>Assignment</h3>
              {form.assignedTo ? (
                <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #86efac' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600' }}>
                      {form.assignedTo.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>{form.assignedTo.name}</p>
                      <p style={{ fontSize: '13px', color: '#6b7280' }}>{form.assignedTo.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleUnassign}
                    className="btn btn-secondary"
                    style={{ width: '100%', background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}
                  >
                    Unassign
                  </button>
                </div>
              ) : (
                <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '8px', border: '1px solid #fbbf24' }}>
                  <p style={{ fontSize: '14px', color: '#92400e', marginBottom: '12px' }}>
                    This form is not assigned to any employee yet.
                  </p>
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    Assign to Employee
                  </button>
                </div>
              )}
            </div>

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

      {/* Image Modal */}
      {imageModal.isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={closeImageModal}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '95vw',
              maxHeight: '95vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              padding: '0 20px'
            }}>
              <h3 style={{ color: 'white', fontSize: '20px', fontWeight: '600', margin: 0 }}>
                {imageModal.imageTitle}
              </h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => downloadImage(imageModal.imageUrl, imageModal.imageTitle.replace(/\s+/g, '-').toLowerCase() + '.jpg')}
                  style={{
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  📥 Download
                </button>
                <button
                  onClick={closeImageModal}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '18px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Image */}
            <img
              src={imageModal.imageUrl}
              alt={imageModal.imageTitle}
              style={{
                maxWidth: '100%',
                maxHeight: 'calc(95vh - 100px)',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
              onError={handleImageError}
            />

            {/* Instructions */}
            <p style={{
              color: '#d1d5db',
              fontSize: '14px',
              marginTop: '16px',
              textAlign: 'center'
            }}>
              Click outside the image or press the Close button to exit
            </p>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignModal && (
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
            <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: '600' }}>Assign to Employee</h2>
            
            {employees.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <p style={{ color: '#6b7280', marginBottom: '20px' }}>No employees available. Create employees first.</p>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Select Employee</label>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="">-- Choose an employee --</option>
                    {employees.map(emp => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} ({emp.email}) - {emp.totalAssigned} assigned
                      </option>
                    ))}
                  </select>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      setShowAssignModal(false);
                      setSelectedEmployee('');
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssign}
                    className="btn btn-primary"
                  >
                    Assign Form
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

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

export default AdminFormDetail;
