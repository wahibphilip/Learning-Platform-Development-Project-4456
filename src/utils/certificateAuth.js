import { v4 as uuidv4 } from 'uuid';

// Generate a unique certificate verification code
export const generateCertificateId = () => {
  const prefix = 'CERT';
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substr(2, 8).toUpperCase();
  return `${prefix}-${year}-${random}`;
};

// Generate QR code data URL
export const generateQRCode = (certificateId) => {
  const baseUrl = window.location.origin;
  const verificationUrl = `${baseUrl}/#/verify-certificate/${certificateId}`;
  
  // In a real application, you would use a proper QR code library
  // For now, we'll use a QR code API service
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verificationUrl)}`;
};

// Verify certificate authenticity
export const verifyCertificate = (certificateId, certificates) => {
  const certificate = certificates.find(cert => cert.certificateId === certificateId);
  
  if (!certificate) {
    return {
      isValid: false,
      error: 'Certificate not found',
      certificate: null
    };
  }

  if (certificate.status === 'revoked') {
    return {
      isValid: false,
      error: 'Certificate has been revoked',
      certificate: null
    };
  }

  return {
    isValid: true,
    error: null,
    certificate: {
      ...certificate,
      verifiedAt: new Date().toISOString()
    }
  };
};

// Generate certificate hash for integrity verification
export const generateCertificateHash = (certificate) => {
  const dataString = `${certificate.studentName}-${certificate.courseName}-${certificate.completionDate}-${certificate.certificateId}`;
  
  // Simple hash function (in production, use a proper cryptographic hash)
  let hash = 0;
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(16);
};

// Log certificate verification attempt
export const logVerificationAttempt = (certificateId, result, ipAddress = 'unknown') => {
  const logEntry = {
    id: uuidv4(),
    certificateId,
    timestamp: new Date().toISOString(),
    result: result.isValid ? 'success' : 'failure',
    error: result.error,
    ipAddress,
    userAgent: navigator.userAgent
  };

  // Store in localStorage (in production, send to backend)
  const existingLogs = JSON.parse(localStorage.getItem('certificateVerificationLogs') || '[]');
  existingLogs.push(logEntry);
  
  // Keep only last 1000 entries
  if (existingLogs.length > 1000) {
    existingLogs.splice(0, existingLogs.length - 1000);
  }
  
  localStorage.setItem('certificateVerificationLogs', JSON.stringify(existingLogs));
  
  return logEntry;
};

// Get verification analytics for a certificate
export const getCertificateAnalytics = (certificateId) => {
  const logs = JSON.parse(localStorage.getItem('certificateVerificationLogs') || '[]');
  const certificateLogs = logs.filter(log => log.certificateId === certificateId);
  
  const totalVerifications = certificateLogs.length;
  const successfulVerifications = certificateLogs.filter(log => log.result === 'success').length;
  const failedVerifications = totalVerifications - successfulVerifications;
  
  const verificationsByDate = certificateLogs.reduce((acc, log) => {
    const date = new Date(log.timestamp).toDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  return {
    totalVerifications,
    successfulVerifications,
    failedVerifications,
    verificationsByDate,
    lastVerification: certificateLogs.length > 0 ? certificateLogs[certificateLogs.length - 1] : null,
    firstVerification: certificateLogs.length > 0 ? certificateLogs[0] : null
  };
};