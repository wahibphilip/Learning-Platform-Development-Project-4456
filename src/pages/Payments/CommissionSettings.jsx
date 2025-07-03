import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePayment } from '../../contexts/PaymentContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SafeIcon from '../../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiDollarSign, FiCalendar, FiCreditCard, FiSave, FiPercent } = FiIcons;

const CommissionSettings = () => {
  const { commissionSettings, updateCommissionSettings, commissionPayouts, processCommissionPayout } = usePayment();
  const [settings, setSettings] = useState(commissionSettings);
  const [loading, setLoading] = useState(false);

  const handleUpdateSettings = async () => {
    setLoading(true);
    try {
      updateCommissionSettings(settings);
      toast.success('Commission settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getPendingPayouts = () => {
    return commissionPayouts.filter(payout => payout.status === 'pending');
  };

  const getTotalPendingAmount = () => {
    return getPendingPayouts().reduce((sum, payout) => sum + payout.amount, 0);
  };

  const handleBulkPayout = () => {
    const pendingPayouts = getPendingPayouts();
    const eligiblePayouts = pendingPayouts.filter(payout => payout.amount >= settings.minimumPayout);
    
    if (eligiblePayouts.length === 0) {
      toast.error('No payouts eligible for processing');
      return;
    }

    if (window.confirm(`Process ${eligiblePayouts.length} payouts totaling $${eligiblePayouts.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}?`)) {
      processCommissionPayout(eligiblePayouts.map(p => p.id));
      toast.success(`${eligiblePayouts.length} payouts processed successfully`);
    }
  };

  const getCommissionAnalytics = () => {
    const totalPaid = commissionPayouts
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPending = commissionPayouts
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalCreators = new Set(commissionPayouts.map(p => p.creatorId)).size;

    return { totalPaid, totalPending, totalCreators };
  };

  const analytics = getCommissionAnalytics();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commission Settings</h1>
          <p className="text-gray-600 mt-1">Configure commission rates and payout settings</p>
        </div>
      </motion.div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">${analytics.totalPaid.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiDollarSign} className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payouts</p>
                <p className="text-2xl font-bold text-yellow-600">${analytics.totalPending.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiCalendar} className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Creators</p>
                <p className="text-2xl font-bold text-blue-600">{analytics.totalCreators}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiCreditCard} className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commission Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Commission Configuration</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Creator Commission Rate (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={settings.defaultRate}
                      onChange={(e) => updateSetting('defaultRate', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <SafeIcon icon={FiPercent} className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform Fee (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={100 - settings.defaultRate}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                    <SafeIcon icon={FiPercent} className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Schedule
                </label>
                <select
                  value={settings.paymentSchedule}
                  onChange={(e) => updateSetting('paymentSchedule', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Payout Amount ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.minimumPayout}
                  onChange={(e) => updateSetting('minimumPayout', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={settings.paymentMethod}
                  onChange={(e) => updateSetting('paymentMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="stripe">Stripe</option>
                  <option value="check">Check</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Handling
                </label>
                <select
                  value={settings.taxHandling}
                  onChange={(e) => updateSetting('taxHandling', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="creator_responsible">Creator Responsible</option>
                  <option value="platform_handles">Platform Handles</option>
                  <option value="shared">Shared Responsibility</option>
                </select>
              </div>

              <Button onClick={handleUpdateSettings} disabled={loading} className="w-full">
                <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Pending Payouts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Pending Payouts</h2>
              {getPendingPayouts().length > 0 && (
                <Button onClick={handleBulkPayout} size="sm">
                  Process All
                </Button>
              )}
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {getPendingPayouts().map((payout) => (
                <div key={payout.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Creator #{payout.creatorId}</span>
                    <span className="font-bold text-green-600">${payout.amount.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Payment ID: {payout.paymentId}</p>
                    <p>Rate: {payout.rate}%</p>
                    <p>Created: {new Date(payout.createdAt).toLocaleDateString()}</p>
                  </div>
                  {payout.amount >= settings.minimumPayout && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Eligible for payout
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {getPendingPayouts().length === 0 && (
                <div className="text-center py-8">
                  <SafeIcon icon={FiDollarSign} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No pending payouts</p>
                </div>
              )}
            </div>

            {getTotalPendingAmount() > 0 && (
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Total Pending:</span>
                  <span className="font-bold text-xl text-green-600">
                    ${getTotalPendingAmount().toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CommissionSettings;