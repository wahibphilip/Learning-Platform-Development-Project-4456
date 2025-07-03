import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import SafeIcon from '../../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import CertificateForm from './CertificateForm';
import CertificatePreview from './CertificatePreview';
import { getCertificateAnalytics } from '../../utils/certificateAuth';
import toast from 'react-hot-toast';

const { FiPlus, FiEdit, FiTrash2, FiAward, FiEye, FiDownload, FiCheck, FiX, FiBarChart } = FiIcons;

const Certificates = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([
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
      isVerified: true,
      hash: 'a1b2c3d4e5f6'
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
      isVerified: true,
      hash: 'b2c3d4e5f6g7'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [previewCertificate, setPreviewCertificate] = useState(null);
  const [selectedCertificateAnalytics, setSelectedCertificateAnalytics] = useState(null);

  const handleDelete = (certificateId) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      setCertificates(prev => prev.filter(c => c.id !== certificateId));
      toast.success('Certificate deleted successfully');
    }
  };

  const handleEdit = (certificate) => {
    setEditingCertificate(certificate);
    setShowAddModal(true);
  };

  const handlePreview = (certificate) => {
    setPreviewCertificate(certificate);
    setShowPreviewModal(true);
  };

  const handleViewAnalytics = (certificate) => {
    const analytics = getCertificateAnalytics(certificate.certificateId);
    setSelectedCertificateAnalytics({ certificate, analytics });
    setShowAnalyticsModal(true);
  };

  const handleVerify = (certificateId) => {
    setCertificates(prev => prev.map(c => 
      c.id === certificateId ? { ...c, isVerified: !c.isVerified } : c
    ));
    toast.success('Certificate verification updated');
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingCertificate(null);
  };

  const handleClosePreview = () => {
    setShowPreviewModal(false);
    setPreviewCertificate(null);
  };

  const handleCloseAnalytics = () => {
    setShowAnalyticsModal(false);
    setSelectedCertificateAnalytics(null);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Certificates</h1>
          <p className="text-gray-600 mt-1">Issue and manage course certificates</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/verify-certificate')}
          >
            Verify Certificate
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Issue Certificate
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((certificate, index) => (
          <motion.div
            key={certificate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={FiAward} className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{certificate.courseName}</h3>
                    <p className="text-sm text-gray-500 font-mono">{certificate.certificateId}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {certificate.isVerified ? (
                    <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500" />
                  ) : (
                    <SafeIcon icon={FiX} className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Student</p>
                  <p className="text-sm text-gray-600">{certificate.studentName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Instructor</p>
                  <p className="text-sm text-gray-600">{certificate.instructorName}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Grade</p>
                    <p className="text-sm text-gray-600">{certificate.grade} ({certificate.score}%)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">Issued</p>
                    <p className="text-sm text-gray-600">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  certificate.status === 'issued' ? 'bg-green-100 text-green-800' :
                  certificate.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {certificate.status}
                </span>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(certificate)}
                    title="Preview Certificate"
                  >
                    <SafeIcon icon={FiEye} className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewAnalytics(certificate)}
                    title="View Analytics"
                  >
                    <SafeIcon icon={FiBarChart} className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVerify(certificate.id)}
                    title="Toggle Verification"
                  >
                    {certificate.isVerified ? (
                      <SafeIcon icon={FiX} className="w-4 h-4" />
                    ) : (
                      <SafeIcon icon={FiCheck} className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(certificate)}
                  >
                    <SafeIcon icon={FiEdit} className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(certificate.id)}
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {certificates.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <SafeIcon icon={FiAward} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
          <p className="text-gray-600 mb-4">Issue your first certificate to recognize student achievements</p>
          <Button onClick={() => setShowAddModal(true)}>
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Issue Certificate
          </Button>
        </motion.div>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        title={editingCertificate ? 'Edit Certificate' : 'Issue New Certificate'}
        size="lg"
      >
        <CertificateForm
          certificate={editingCertificate}
          onClose={handleCloseModal}
          onSave={(certificateData) => {
            if (editingCertificate) {
              setCertificates(prev => prev.map(c => 
                c.id === editingCertificate.id ? { ...c, ...certificateData } : c
              ));
              toast.success('Certificate updated successfully');
            } else {
              setCertificates(prev => [...prev, { ...certificateData, id: Date.now().toString() }]);
              toast.success('Certificate issued successfully');
            }
            handleCloseModal();
          }}
        />
      </Modal>

      <Modal
        isOpen={showPreviewModal}
        onClose={handleClosePreview}
        title="Certificate Preview"
        size="xl"
      >
        {previewCertificate && (
          <CertificatePreview certificate={previewCertificate} />
        )}
      </Modal>

      <Modal
        isOpen={showAnalyticsModal}
        onClose={handleCloseAnalytics}
        title="Certificate Analytics"
        size="lg"
      >
        {selectedCertificateAnalytics && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedCertificateAnalytics.certificate.courseName}
              </h3>
              <p className="text-gray-600 font-mono">
                {selectedCertificateAnalytics.certificate.certificateId}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {selectedCertificateAnalytics.analytics.totalVerifications}
                </p>
                <p className="text-sm text-gray-500">Total Verifications</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {selectedCertificateAnalytics.analytics.successfulVerifications}
                </p>
                <p className="text-sm text-gray-500">Successful</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {selectedCertificateAnalytics.analytics.failedVerifications}
                </p>
                <p className="text-sm text-gray-500">Failed</p>
              </div>
            </div>

            {selectedCertificateAnalytics.analytics.lastVerification && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Last Verification</h4>
                <p className="text-sm text-gray-600">
                  {new Date(selectedCertificateAnalytics.analytics.lastVerification.timestamp).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Result: <span className={`font-medium ${
                    selectedCertificateAnalytics.analytics.lastVerification.result === 'success' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {selectedCertificateAnalytics.analytics.lastVerification.result}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Certificates;