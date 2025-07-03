import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import SafeIcon from '../../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { generateQRCode } from '../../utils/certificateAuth';

const { FiDownload, FiShare2, FiAward, FiShield } = FiIcons;

const CertificatePreview = ({ certificate }) => {
  const qrCodeUrl = generateQRCode(certificate.certificateId);

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    alert('Certificate download functionality would be implemented here');
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/#/verify-certificate/${certificate.certificateId}`;
    if (navigator.share) {
      navigator.share({
        title: 'Certificate Verification',
        text: `Verify ${certificate.studentName}'s certificate for ${certificate.courseName}`,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Verification link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-primary-50 to-secondary-50 p-8 rounded-xl border-2 border-primary-200"
      >
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiAward} className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Certificate of Completion</h1>
            <p className="text-lg text-gray-600">This is to certify that</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-primary-600 border-b-2 border-primary-200 pb-2">
              {certificate.studentName}
            </h2>
            <p className="text-lg text-gray-700">
              has successfully completed the course
            </p>
            <h3 className="text-2xl font-semibold text-gray-900">
              {certificate.courseName}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Instructor</p>
              <p className="font-semibold text-gray-900">{certificate.instructorName}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Completion Date</p>
              <p className="font-semibold text-gray-900">
                {new Date(certificate.completionDate).toLocaleDateString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Grade</p>
              <p className="font-semibold text-gray-900">
                {certificate.grade} ({certificate.score}%)
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Certificate ID</p>
              <p className="font-mono text-lg font-semibold text-gray-900">
                {certificate.certificateId}
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Verify Authenticity</p>
              <img 
                src={qrCodeUrl} 
                alt="QR Code for verification" 
                className="w-24 h-24 mx-auto border border-gray-200 rounded"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <SafeIcon icon={FiShield} className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Verified & Authenticated</span>
            </div>
            <p className="text-sm text-gray-500">
              Issued on {new Date(certificate.issueDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              EduPlatform - Learning Management System
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Scan QR code or visit verification page to authenticate this certificate
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center justify-center space-x-4">
        <Button onClick={handleDownload}>
          <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        <Button variant="outline" onClick={handleShare}>
          <SafeIcon icon={FiShare2} className="w-4 h-4 mr-2" />
          Share Certificate
        </Button>
      </div>
    </div>
  );
};

export default CertificatePreview;