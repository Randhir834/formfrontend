import { useEffect } from 'react';

/**
 * Reusable Image Modal Component
 * Displays images in full-screen view with download capability
 */
function ImageModal({ isOpen, imageUrl, imageTitle, onClose }) {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = imageTitle?.replace(/\s+/g, '-').toLowerCase() || 'image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Opening in new tab...');
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.95)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-in-out'
      }}
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        style={{
          position: 'relative',
          maxWidth: '95vw',
          maxHeight: '95vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            background: 'rgba(0, 0, 0, 0.8)',
            borderRadius: '12px 12px 0 0',
            backdropFilter: 'blur(10px)'
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '600',
              margin: 0
            }}
          >
            {imageTitle || 'Image'}
          </h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleDownload}
              style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => (e.target.style.background = '#1d4ed8')}
              onMouseLeave={(e) => (e.target.style.background = '#2563eb')}
            >
              <span>📥</span>
              Download
            </button>
            <button
              onClick={onClose}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => (e.target.style.background = '#dc2626')}
              onMouseLeave={(e) => (e.target.style.background = '#ef4444')}
            >
              <span>✕</span>
              Close
            </button>
          </div>
        </div>

        {/* Image */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '0 0 12px 12px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxHeight: 'calc(95vh - 80px)',
            overflow: 'auto'
          }}
        >
          <img
            src={imageUrl}
            alt={imageTitle || 'Full view'}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div style="color: white; padding: 40px; text-align: center; font-size: 18px;">Failed to load image</div>';
            }}
          />
        </div>

        {/* Keyboard hint */}
        <div
          style={{
            position: 'absolute',
            bottom: '-40px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '12px',
            opacity: 0.7,
            whiteSpace: 'nowrap'
          }}
        >
          Press <kbd style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px' }}>ESC</kbd> to close
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default ImageModal;
