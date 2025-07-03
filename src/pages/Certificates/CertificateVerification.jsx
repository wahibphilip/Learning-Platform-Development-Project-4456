import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SafeIcon from '../../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { verifyCertificate, logVerificationAttempt, getCertificateAnalytics } from '../../utils/certificateAuth';

const { FiShield, FiX, FiCheck, FiEye, FiCalendar, FiUser, FiBook, FiAward } = FiIcons;

const CertificateVerification = () => {
  const { certificateId } = useParams();
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  // Mock certificates data (in real app, fetch from backend)
  const mockCertificates = [
    {
      id: '1',
      studentName: 'Alice Johnson',
      studentEmail: 'alice@example.com',
      courseName: 'React Fundamentals',
      instructorName: 'John Doe',
      completionDate: '2024-01-15',
      issueDate: '2024-01-16',
      certificateId: 'CERT-RF-2024-001',
      grade: 'A',
      score: 92,
      status: 'issued',
      isVerified: true,
      hash: 'a1b2c3d4e5f6'
    }
  ];

  useEffect(() => {
    const performVerification = async () => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = verifyCertificate(certificateId, mockCertificates);
      setVerificationResult(result);
      
      // Log the verification attempt
      logVerificationAttempt(certificateId, result);
      
      // Get analytics for this certificate
      if (result.isValid) {
        const certificateAnalytics = getCertificateAnalytics(certificateId);
        setAnalytics(certificateAnalytics);
      }
      
      setLoading(false);
    };

    if (certificateId) {
      performVerification();
    }
  }, [certificateId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying certificate...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate Verification</h1>
          <p className="text-gray-600">Certificate ID: {certificateId}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              {verificationResult?.isValid ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 text-green-600">
                    <SafeIcon icon={FiShield} className="w-8 h-8" />
                    <div>
                      <h2 className="text-2xl font-bold">Certificate Verified</h2>
                      <p className="text-green-700">This certificate is authentic and valid</p>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-500">Student Name</p>
                            <p className="font-semibold text-gray-900">{verificationResult.certificate.studentName}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <SafeIcon icon={FiBook} className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-500">Course</p>
                            <p className="font-semibold text-gray-900">{verificationResult.certificate.courseName}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <SafeIcon icon={FiAward} className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-500">Grade</p>
                            <p className="font-semibold text-gray-900">
                              {verificationResult.certificate.grade} ({verificationResult.certificate.score}%)
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-500">Completion Date</p>
                            <p className="font-semibold text-gray-900">
                              {new Date(verificationResult.certificate.completionDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-500">Instructor</p>
                            <p className="font-semibold text-gray-900">{verificationResult.certificate.instructorName}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-500">Issue Date</p>
                            <p className="font-semibold text-gray-900">
                              {new Date(verificationResult.certificate.issueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-4">
                      Verified on {new Date(verificationResult.certificate.verifiedAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      This certificate has been digitally verified and is authentic
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="flex items-center justify-center space-x-3 text-red-600">
                    <SafeIcon icon={FiX} className="w-8 h-8" />
                    <div>
                      <h2 className="text-2xl font-bold">Certificate Invalid</h2>
                      <p className="text-red-700">{verificationResult?.error}</p>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p className="text-red-800">
                      This certificate could not be verified. It may be:
                    </p>
                    <ul className="mt-4 text-sm text-red-700 space-y-2">
                      <li>• Not issued by this institution</li>
                      <li>• Revoked or expired</li>
                      <li>• Contains an invalid certificate ID</li>
                      <li>• Fraudulent or tampered with</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            {analytics && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Analytics</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Verifications</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalVerifications}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Success Rate</p>
                    <p className="text-lg font-semibold text-green-600">
                      {analytics.totalVerifications > 0 
                        ? Math.round((analytics.successfulVerifications / analytics.totalVerifications) * 100)
                        : 0}%
                    </p>
                  </div>

                  {analytics.lastVerification && (
                    <div>
                      <p className="text-sm text-gray-500">Last Verified</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(analytics.lastVerification.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Verify</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>To verify a certificate:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Scan the QR code on the certificate</li>
                  <li>Visit our verification page</li>
                  <li>Enter the certificate ID</li>
                  <li>View the verification results</li>
                </ol>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Features</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Digital signature verification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Tamper-proof QR codes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Real-time validation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Audit trail logging</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateVerification;