import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitForm } from '../utils/api';

function FormSubmission() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [referenceImages, setReferenceImages] = useState([]);
  const [approvalConfirmed, setApprovalConfirmed] = useState(false);
  
  const [formData, setFormData] = useState({
    clientInfo: {
      companyName: '', brandName: '', contactPerson: '', mobileNumber: '',
      email: '', fssaiNumber: '', manufacturerName: '', manufacturerAddress: '',
      marketedBy: '', marketedByAddress: ''
    },
    productInfo: {
      productName: '', productCategory: '', productVariant: '', productWeight: '',
      productDimensions: '', mrp: '', shelfLife: '', storageInstructions: '',
      ingredients: '', nutritionalFacts: '', allergenInformation: '', directionsForUse: ''
    },
    targetCustomer: {
      targetGender: '', targetIncome: '', targetLocation: '',
      buyerChannel: '', buyerSegment: '', businessModel: ''
    },
    packageSpec: {
      packageType: '', finish: [], specialEffects: [], printing: [], packageNotes: ''
    },
    designDirection: {
      primaryColor: '', secondaryColor: '', accentColor: '',
      colorsToAvoid: '', designDensity: '', brandPerception: '', designAesthetic: '', designInspiration: ''
    },
    timeline: {
      launchDate: '', printingDate: '', expectedDelivery: '', urgent: '', timelineNotes: ''
    }
  });

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleCheckboxChange = (section, field, value, checked) => {
    setFormData(prev => {
      const currentArray = prev[section][field] || [];
      const newArray = checked
        ? [...currentArray, value]
        : currentArray.filter(item => item !== value);
      
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newArray
        }
      };
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setReferenceImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (referenceImages.length < 3) {
      alert('Please upload exactly 3 reference images.');
      return;
    }
    
    if (!approvalConfirmed) {
      alert('Please confirm that all information is correct before submitting.');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('formData', JSON.stringify({...formData, approvalConfirmed}));
      
      referenceImages.forEach((file) => {
        data.append('referenceImages', file);
      });

      await submitForm(data);
      alert('Form submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      alert('Error submitting form: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

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
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ marginBottom: '12px', fontSize: '28px', fontWeight: '700', color: '#111827', letterSpacing: '-0.02em' }}>Submit Product Information Form</h1>
            <p style={{ color: '#6b7280', fontSize: '15px' }}>Please fill out all required fields accurately</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Section 1: Client Information */}
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ color: '#111827', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #f3f4f6', fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: '#2563eb', color: 'white', borderRadius: '50%', fontSize: '15px', fontWeight: '600' }}>1</span>
                Client Information
              </h2>
              <div className="grid-2">
                <div className="form-group">
                  <label>Company Name *</label>
                  <input required value={formData.clientInfo.companyName}
                    onChange={(e) => handleInputChange('clientInfo', 'companyName', e.target.value)} 
                    placeholder="Enter company name" />
                </div>
                <div className="form-group">
                  <label>Brand Name *</label>
                  <input required value={formData.clientInfo.brandName}
                    onChange={(e) => handleInputChange('clientInfo', 'brandName', e.target.value)}
                    placeholder="Enter brand name" />
                </div>
                <div className="form-group">
                  <label>Contact Person *</label>
                  <input required value={formData.clientInfo.contactPerson}
                    onChange={(e) => handleInputChange('clientInfo', 'contactPerson', e.target.value)}
                    placeholder="Enter contact person name" />
                </div>
                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input required type="tel" value={formData.clientInfo.mobileNumber}
                    onChange={(e) => handleInputChange('clientInfo', 'mobileNumber', e.target.value)}
                    placeholder="+91 9876543210" />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" required value={formData.clientInfo.email}
                    onChange={(e) => handleInputChange('clientInfo', 'email', e.target.value)}
                    placeholder="email@example.com" />
                </div>
                <div className="form-group">
                  <label>FSSAI Number</label>
                  <input value={formData.clientInfo.fssaiNumber}
                    onChange={(e) => handleInputChange('clientInfo', 'fssaiNumber', e.target.value)}
                    placeholder="12345678901234" />
                </div>
                <div className="form-group">
                  <label>Manufacturer Name *</label>
                  <input required value={formData.clientInfo.manufacturerName}
                    onChange={(e) => handleInputChange('clientInfo', 'manufacturerName', e.target.value)}
                    placeholder="Enter manufacturer name" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Manufacturer Address *</label>
                  <textarea required value={formData.clientInfo.manufacturerAddress}
                    onChange={(e) => handleInputChange('clientInfo', 'manufacturerAddress', e.target.value)}
                    placeholder="Enter complete manufacturer address" rows="3" />
                </div>
                <div className="form-group">
                  <label>Marketed By *</label>
                  <input required value={formData.clientInfo.marketedBy}
                    onChange={(e) => handleInputChange('clientInfo', 'marketedBy', e.target.value)}
                    placeholder="Enter marketed by name" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Marketed By Address *</label>
                  <textarea required value={formData.clientInfo.marketedByAddress}
                    onChange={(e) => handleInputChange('clientInfo', 'marketedByAddress', e.target.value)}
                    placeholder="Enter complete marketed by address" rows="3" />
                </div>
              </div>
            </div>

            {/* Section 2: Product Information */}
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ color: '#111827', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #f3f4f6', fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: '#2563eb', color: 'white', borderRadius: '50%', fontSize: '15px', fontWeight: '600' }}>2</span>
                Product Information
              </h2>
              <div className="grid-2">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input required value={formData.productInfo.productName}
                    onChange={(e) => handleInputChange('productInfo', 'productName', e.target.value)}
                    placeholder="Enter product name" />
                </div>
                <div className="form-group">
                  <label>Product Category *</label>
                  <select required value={formData.productInfo.productCategory}
                    onChange={(e) => handleInputChange('productInfo', 'productCategory', e.target.value)}>
                    <option value="">Select Category</option>
                    <option value="beverages">Beverages</option>
                    <option value="snacks">Snacks</option>
                    <option value="dairy">Dairy</option>
                    <option value="bakery">Bakery</option>
                    <option value="confectionery">Confectionery</option>
                    <option value="spices">Spices & Condiments</option>
                    <option value="cereals">Cereals & Grains</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Product Variant</label>
                  <input value={formData.productInfo.productVariant}
                    onChange={(e) => handleInputChange('productInfo', 'productVariant', e.target.value)}
                    placeholder="e.g., Chocolate, Vanilla, Mango" />
                </div>
                <div className="form-group">
                  <label>Product Weight *</label>
                  <input required value={formData.productInfo.productWeight}
                    onChange={(e) => handleInputChange('productInfo', 'productWeight', e.target.value)}
                    placeholder="e.g., 500g, 1kg, 250ml" />
                </div>
                <div className="form-group">
                  <label>Product Dimensions *</label>
                  <input required value={formData.productInfo.productDimensions}
                    onChange={(e) => handleInputChange('productInfo', 'productDimensions', e.target.value)}
                    placeholder="e.g., 10cm x 5cm x 15cm" />
                </div>
                <div className="form-group">
                  <label>MRP (₹) *</label>
                  <input type="number" step="0.01" required value={formData.productInfo.mrp}
                    onChange={(e) => handleInputChange('productInfo', 'mrp', e.target.value)}
                    placeholder="Enter MRP" />
                </div>
                <div className="form-group">
                  <label>Shelf Life</label>
                  <input value={formData.productInfo.shelfLife}
                    onChange={(e) => handleInputChange('productInfo', 'shelfLife', e.target.value)}
                    placeholder="e.g., 12 months, 6 months" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Storage Instructions</label>
                  <textarea value={formData.productInfo.storageInstructions}
                    onChange={(e) => handleInputChange('productInfo', 'storageInstructions', e.target.value)}
                    placeholder="e.g., Store in a cool, dry place away from direct sunlight" rows="2" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Ingredients *</label>
                  <textarea required value={formData.productInfo.ingredients}
                    onChange={(e) => handleInputChange('productInfo', 'ingredients', e.target.value)}
                    placeholder="List all ingredients in order of quantity" rows="3" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Nutritional Facts *</label>
                  <textarea required value={formData.productInfo.nutritionalFacts}
                    onChange={(e) => handleInputChange('productInfo', 'nutritionalFacts', e.target.value)}
                    placeholder="Per serving: Energy, Protein, Carbs, Fat, Fiber, etc." rows="4" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Allergen Information</label>
                  <textarea value={formData.productInfo.allergenInformation}
                    onChange={(e) => handleInputChange('productInfo', 'allergenInformation', e.target.value)}
                    placeholder="e.g., Contains nuts, dairy, gluten. May contain traces of..." rows="2" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Directions for Use *</label>
                  <textarea required value={formData.productInfo.directionsForUse}
                    onChange={(e) => handleInputChange('productInfo', 'directionsForUse', e.target.value)}
                    placeholder="How to use/consume the product" rows="3" />
                </div>
              </div>
            </div>

            {/* Section 3: Target Customer */}
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ color: '#111827', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #f3f4f6', fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: '#2563eb', color: 'white', borderRadius: '50%', fontSize: '15px', fontWeight: '600' }}>3</span>
                Target Customer
              </h2>
              <div className="grid-2">
                <div className="form-group">
                  <label>Gender *</label>
                  <select required value={formData.targetCustomer.targetGender}
                    onChange={(e) => handleInputChange('targetCustomer', 'targetGender', e.target.value)}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Income Level</label>
                  <select value={formData.targetCustomer.targetIncome}
                    onChange={(e) => handleInputChange('targetCustomer', 'targetIncome', e.target.value)}>
                    <option value="">Select Income Level</option>
                    <option value="low">Low Income (&lt; ₹3L/year)</option>
                    <option value="middle">Middle Income (₹3-10L/year)</option>
                    <option value="upper-middle">Upper Middle (₹10-25L/year)</option>
                    <option value="high">High Income (&gt; ₹25L/year)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Location Type *</label>
                  <select required value={formData.targetCustomer.targetLocation}
                    onChange={(e) => handleInputChange('targetCustomer', 'targetLocation', e.target.value)}>
                    <option value="">Select Location</option>
                    <option value="city">City/Urban</option>
                    <option value="village">Village/Rural</option>
                    <option value="both">Both Urban & Rural</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Buyer Channel *</label>
                  <select required value={formData.targetCustomer.buyerChannel}
                    onChange={(e) => handleInputChange('targetCustomer', 'buyerChannel', e.target.value)}>
                    <option value="">Select Channel</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="both">Both Online & Offline</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Buyer Segment *</label>
                  <select required value={formData.targetCustomer.buyerSegment}
                    onChange={(e) => handleInputChange('targetCustomer', 'buyerSegment', e.target.value)}>
                    <option value="">Select Segment</option>
                    <option value="premium">Premium Buyers</option>
                    <option value="budget">Budget Buyers</option>
                    <option value="mid-range">Mid-Range Buyers</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Business Model *</label>
                  <select required value={formData.targetCustomer.businessModel}
                    onChange={(e) => handleInputChange('targetCustomer', 'businessModel', e.target.value)}>
                    <option value="">Select Model</option>
                    <option value="retail">Retail (B2C)</option>
                    <option value="wholesale">Wholesale (B2B)</option>
                    <option value="both">Both Retail & Wholesale</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Package Specifications */}
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ color: '#111827', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #f3f4f6', fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: '#2563eb', color: 'white', borderRadius: '50%', fontSize: '15px', fontWeight: '600' }}>4</span>
                Package Specifications
              </h2>
              
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Package Type *</label>
                <select required value={formData.packageSpec.packageType}
                  onChange={(e) => handleInputChange('packageSpec', 'packageType', e.target.value)}>
                  <option value="">Select Package Type</option>
                  <option value="pouch">Pouch</option>
                  <option value="box">Box</option>
                  <option value="bottle">Bottle</option>
                  <option value="tube">Tube</option>
                  <option value="jar">Jar</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Finish (Select all that apply)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' }}>
                  {['Matte', 'Gloss', 'Soft Touch'].map(finish => (
                    <label key={finish} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input type="checkbox" 
                        checked={formData.packageSpec.finish.includes(finish)}
                        onChange={(e) => handleCheckboxChange('packageSpec', 'finish', finish, e.target.checked)}
                        style={{ marginRight: '8px' }} />
                      {finish}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Special Effects (Select all that apply)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' }}>
                  {['UV', 'Spot UV', 'Emboss', 'Deboss', 'Gold Foil', 'Silver Foil'].map(effect => (
                    <label key={effect} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input type="checkbox" 
                        checked={formData.packageSpec.specialEffects.includes(effect)}
                        onChange={(e) => handleCheckboxChange('packageSpec', 'specialEffects', effect, e.target.checked)}
                        style={{ marginRight: '8px' }} />
                      {effect}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Printing Type (Select all that apply)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' }}>
                  {['CMYK', 'Pantone'].map(print => (
                    <label key={print} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input type="checkbox" 
                        checked={formData.packageSpec.printing.includes(print)}
                        onChange={(e) => handleCheckboxChange('packageSpec', 'printing', print, e.target.checked)}
                        style={{ marginRight: '8px' }} />
                      {print}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Additional Package Notes</label>
                <textarea value={formData.packageSpec.packageNotes}
                  onChange={(e) => handleInputChange('packageSpec', 'packageNotes', e.target.value)}
                  placeholder="Any additional specifications or requirements" rows="3" />
              </div>
            </div>

            {/* Section 5: Design Direction */}
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ color: '#111827', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #f3f4f6', fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: '#2563eb', color: 'white', borderRadius: '50%', fontSize: '15px', fontWeight: '600' }}>5</span>
                Design Direction
              </h2>
              <div className="grid-2">
                <div className="form-group">
                  <label>Primary Color</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="color" value={formData.designDirection.primaryColor}
                      onChange={(e) => handleInputChange('designDirection', 'primaryColor', e.target.value)}
                      style={{ width: '60px', height: '40px' }} />
                    <input type="text" value={formData.designDirection.primaryColor}
                      onChange={(e) => handleInputChange('designDirection', 'primaryColor', e.target.value)}
                      placeholder="#000000" style={{ flex: 1 }} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Secondary Color</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="color" value={formData.designDirection.secondaryColor}
                      onChange={(e) => handleInputChange('designDirection', 'secondaryColor', e.target.value)}
                      style={{ width: '60px', height: '40px' }} />
                    <input type="text" value={formData.designDirection.secondaryColor}
                      onChange={(e) => handleInputChange('designDirection', 'secondaryColor', e.target.value)}
                      placeholder="#000000" style={{ flex: 1 }} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Accent Color</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="color" value={formData.designDirection.accentColor}
                      onChange={(e) => handleInputChange('designDirection', 'accentColor', e.target.value)}
                      style={{ width: '60px', height: '40px' }} />
                    <input type="text" value={formData.designDirection.accentColor}
                      onChange={(e) => handleInputChange('designDirection', 'accentColor', e.target.value)}
                      placeholder="#000000" style={{ flex: 1 }} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Colors to Avoid</label>
                  <input value={formData.designDirection.colorsToAvoid}
                    onChange={(e) => handleInputChange('designDirection', 'colorsToAvoid', e.target.value)}
                    placeholder="e.g., Red, Neon colors, Dark brown" />
                </div>
                <div className="form-group">
                  <label>Design Density</label>
                  <select value={formData.designDirection.designDensity}
                    onChange={(e) => handleInputChange('designDirection', 'designDensity', e.target.value)}>
                    <option value="">Select Density</option>
                    <option value="minimal">Minimal (Clean & Simple)</option>
                    <option value="moderate">Moderate</option>
                    <option value="busy">Busy (Detailed & Rich)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Brand Perception</label>
                  <select value={formData.designDirection.brandPerception}
                    onChange={(e) => handleInputChange('designDirection', 'brandPerception', e.target.value)}>
                    <option value="">Select Perception</option>
                    <option value="luxury">Luxury/Premium</option>
                    <option value="affordable">Affordable/Value</option>
                    <option value="mid-range">Mid-Range</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Design Aesthetic</label>
                  <select value={formData.designDirection.designAesthetic}
                    onChange={(e) => handleInputChange('designDirection', 'designAesthetic', e.target.value)}>
                    <option value="">Select Aesthetic</option>
                    <option value="modern">Modern/Contemporary</option>
                    <option value="traditional">Traditional/Classic</option>
                    <option value="fusion">Fusion (Mix of Both)</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Design Inspiration</label>
                  <textarea value={formData.designDirection.designInspiration}
                    onChange={(e) => handleInputChange('designDirection', 'designInspiration', e.target.value)}
                    placeholder="Describe any specific design inspirations, reference brands, or styles you like" rows="3" />
                </div>
              </div>
            </div>

            {/* Section 6: Timeline */}
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ color: '#111827', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #f3f4f6', fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: '#2563eb', color: 'white', borderRadius: '50%', fontSize: '15px', fontWeight: '600' }}>6</span>
                Timeline
              </h2>
              <div className="grid-2">
                <div className="form-group">
                  <label>Launch Date *</label>
                  <input type="date" required value={formData.timeline.launchDate}
                    onChange={(e) => handleInputChange('timeline', 'launchDate', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Printing Date *</label>
                  <input type="date" required value={formData.timeline.printingDate}
                    onChange={(e) => handleInputChange('timeline', 'printingDate', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Expected Delivery *</label>
                  <input type="date" required value={formData.timeline.expectedDelivery}
                    onChange={(e) => handleInputChange('timeline', 'expectedDelivery', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Urgent? *</label>
                  <select required value={formData.timeline.urgent}
                    onChange={(e) => handleInputChange('timeline', 'urgent', e.target.value)}>
                    <option value="">Select Priority</option>
                    <option value="yes">Yes - Urgent</option>
                    <option value="no">No - Standard</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Timeline Notes (Optional)</label>
                  <textarea value={formData.timeline.timelineNotes}
                    onChange={(e) => handleInputChange('timeline', 'timelineNotes', e.target.value)}
                    placeholder="Any additional notes about timeline or scheduling" rows="2" />
                </div>
              </div>
            </div>

            {/* Reference Images */}
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ color: '#111827', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #f3f4f6', fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: '#6b7280', color: 'white', borderRadius: '50%', fontSize: '15px', fontWeight: '600' }}>7</span>
                Reference Images (Required - 3 images)
              </h2>
              <div className="form-group">
                <label>Upload exactly 3 reference images *</label>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} required
                  style={{ marginTop: '10px', padding: '12px' }} />
                <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
                  {referenceImages.length}/3 images selected {referenceImages.length < 3 && '(3 required)'}
                </p>
                {referenceImages.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px', marginTop: '20px' }}>
                    {referenceImages.map((file, index) => (
                      <div key={index} style={{ position: 'relative', border: '2px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                        <img src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`}
                          style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                        <div style={{ padding: '5px', fontSize: '12px', textAlign: 'center', backgroundColor: '#f8f9fa' }}>
                          {file.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Section 7: Approval Confirmation */}
            <div style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#eff6ff', borderRadius: '12px', border: '2px solid #2563eb' }}>
              <h2 style={{ color: '#111827', marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
                Approval & Confirmation
              </h2>
              <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', fontSize: '15px', fontWeight: '500', gap: '12px', color: '#374151' }}>
                <input type="checkbox" required checked={approvalConfirmed}
                  onChange={(e) => setApprovalConfirmed(e.target.checked)}
                  style={{ marginTop: '2px', width: '18px', height: '18px', cursor: 'pointer' }} />
                I confirm that all information provided above is correct and accurate. *
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '24px', borderTop: '1px solid #f3f4f6' }}>
              <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Form'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx="true">{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .navbar {
          background-color: white;
          padding: 1rem 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .navbar h2 {
          color: #667eea;
          margin: 0;
        }

        .navbar-right {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .container {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 0 20px;
        }

        .card {
          background: white;
          border-radius: 15px;
          padding: 40px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        h1 {
          color: #333;
          text-align: center;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 8px;
          color: #333;
          font-weight: 600;
          font-size: 14px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .btn {
          padding: 12px 30px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background-color: #5a6268;
        }

        @media (max-width: 768px) {
          .grid-2 {
            grid-template-columns: 1fr;
          }
          
          .card {
            padding: 20px;
          }
          
          .navbar {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default FormSubmission;
