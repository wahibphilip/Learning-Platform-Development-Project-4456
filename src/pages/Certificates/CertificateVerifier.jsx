import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SafeIcon from '../../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { verifyCertificate, logVerificationAttempt, getCertificateAnalytics } from '../../utils/certificateAuth';

const { FiSearch, FiShield, FiX, FiCheck } = FiIcons;

const CertificateVerifier = () => {
  const [certificateId, setCertificateId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock certificates data
  const mockCertificates = [
    {
      id: '1',
      studentName: 'Alice Johnson',
      studentEmail: 'alice@example.com',
      courseName: 'React Fundamentals',
      instructorName: 'John Doe',
      completionDate: '2024-01-15',
      issueDate: '2024-01-16',
      certificateId: 'CERT-2024-RF001234',
      grade: 'A',
      score: 92,
      status: 'issued',
      isVerified: true
    },
    {
      id: '2',
      studentName: 'Bob Wilson',
      studentEmail: 'bob@example.com',
      courseName: 'Advanced JavaScript',
      instructorName: 'Jane Smith',
      completionDate: '2024-02-10',
      issueDate: '2024-02-11',
      certificateId: 'CERT-2024-AJS005678',
      grade: 'B+',
      score: 87,
      status: 'issued',
      isVerified: true
    }
  ];

  const handleVerification = async () => {
    if (!certificateId.trim()) {
      return;
    }

    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = verifyCertificate(certificateId.trim(), mockCertificates);
    setVerificationResult(result);
    
    // Log the verification attempt
    logVerificationAttempt(certificateId.trim(), result);
    
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleVerification();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate Verification</h1>
          <p className="text-gray-600">Enter a certificate ID to verify its authenticity</p>
        </motion.div>

        <Card className="p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificate ID
              </label>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter certificate ID (e.g., CERT-2024-RF001234)"
                />
                <Button 
                  onClick={handleVerification} 
                  disabled={loading || !certificateId.trim()}
                  size="lg"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <SafeIcon icon={FiSearch} className="w-5 h-5 mr-2" />
                  )}
                  {loading ? 'Verifying...' : 'Verify'}
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Try these sample certificate IDs: 
                <button 
                  onClick={() => setCertificateId('CERT-2024-RF001234')}
                  className="ml-2 text-primary-600 hover:text-primary-700 underline"
                >
                  CERT-2024-RF001234
                </button>
                {', '}
                <button 
                  onClick={() => setCertificateId('CERT-2024-AJS005678')}
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  CERT-2024-AJS005678
                </button>
              </p>
            </div>
          </div>
        </Card>

        {verificationResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-8">
              {verificationResult.isValid ? (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 text-green-600">
                    <SafeIcon icon={FiShield} className="w-8 h-8" />
                    <div>
                      <h2 className="text-2xl font-bold">Certificate Verified ✓</h2>
                      <p className="text-green-700">This certificate is authentic and valid</p>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Student Name</p>
                          <p className="font-semibold text-gray-900">{verificationResult.certificate.studentName}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Course</p>
                          <p className="font-semibold text-gray-900">{verificationResult.certificate.courseName}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Grade</p>
                          <p className="font-semibold text-gray-900">
                            {verificationResult.certificate.grade} ({verificationResult.certificate.score}%)
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Completion Date</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(verificationResult.certificate.completionDate).toLocaleDateString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Instructor</p>
                          <p className="font-semibold text-gray-900">{verificationResult.certificate.instructorName}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Issue Date</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(verificationResult.certificate.issueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Verified on {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center space-x-3 text-red-600">
                    <SafeIcon icon={FiX} className="w-8 h-8" />
                    <div>
                      <h2 className="text-2xl font-bold">Certificate Invalid ✗</h2>
                      <p className="text-red-700">{verificationResult.error}</p>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p className="text-red-800 mb-4">
                      This certificate could not be verified. It may be:
                    </p>
                    <ul className="text-sm text-red-700 space-y-2 text-left">
                      <li className="flex items-center space-x-2">
                        <SafeIcon icon={FiX} className="w-4 h-4" />
                        <span>Not issued by this institution</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <SafeIcon icon={FiX} className="w-4 h-4" />
                        <span>Revoked or expired</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <SafeIcon icon={FiX} className="w-4 h-4" />
                        <span>Contains an invalid certificate ID</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <SafeIcon icon={FiX} className="w-4 h-4" />
                        <span>Fraudulent or tampered with</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Digital signature verification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Tamper-proof QR codes</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Real-time validation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Audit trail logging</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CertificateVerifier;