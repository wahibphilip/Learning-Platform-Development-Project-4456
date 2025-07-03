import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import SafeIcon from '../../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import CampaignForm from './CampaignForm';
import toast from 'react-hot-toast';

const { FiPlus, FiEdit, FiTrash2, FiTarget, FiCalendar, FiTrendingUp } = FiIcons;

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([
    {
      id: '1',
      name: 'Summer Learning Campaign',
      description: 'Promote summer courses with special discounts',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      type: 'discount',
      status: 'active',
      targetAudience: 'All Students',
      reach: 1250,
      conversions: 89
    },
    {
      id: '2',
      name: 'New Student Welcome',
      description: 'Welcome campaign for new student onboarding',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      type: 'welcome',
      status: 'active',
      targetAudience: 'New Students',
      reach: 450,
      conversions: 234
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  const handleDelete = (campaignId) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(prev => prev.filter(c => c.id !== campaignId));
      toast.success('Campaign deleted successfully');
    }
  };

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingCampaign(null);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">Manage your marketing campaigns</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign, index) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={FiTarget} className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      campaign.status === 'active' ? 'bg-green-100 text-green-800' : 
                      campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{campaign.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
                    Duration
                  </div>
                  <span className="font-medium">
                    {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <SafeIcon icon={FiTrendingUp} className="w-4 h-4 mr-1" />
                    Reach
                  </div>
                  <span className="font-medium">{campaign.reach}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Conversions</span>
                  <span className="font-medium">{campaign.conversions}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  campaign.type === 'discount' ? 'bg-blue-100 text-blue-800' :
                  campaign.type === 'welcome' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {campaign.type}
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(campaign)}
                  >
                    <SafeIcon icon={FiEdit} className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(campaign.id)}
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {campaigns.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <SafeIcon icon={FiTarget} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
          <p className="text-gray-600 mb-4">Create your first marketing campaign</p>
          <Button onClick={() => setShowAddModal(true)}>
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </motion.div>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        title={editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
        size="lg"
      >
        <CampaignForm
          campaign={editingCampaign}
          onClose={handleCloseModal}
          onSave={(campaignData) => {
            if (editingCampaign) {
              setCampaigns(prev => prev.map(c => 
                c.id === editingCampaign.id ? { ...c, ...campaignData } : c
              ));
              toast.success('Campaign updated successfully');
            } else {
              setCampaigns(prev => [...prev, { ...campaignData, id: Date.now().toString() }]);
              toast.success('Campaign created successfully');
            }
            handleCloseModal();
          }}
        />
      </Modal>
    </div>
  );
};

export default Campaigns;