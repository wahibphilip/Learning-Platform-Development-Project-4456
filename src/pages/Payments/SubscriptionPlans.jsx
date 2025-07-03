import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePayment } from '../../contexts/PaymentContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import SafeIcon from '../../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import SubscriptionPlanForm from './SubscriptionPlanForm';
import toast from 'react-hot-toast';

const { FiPlus, FiEdit, FiTrash2, FiDollarSign, FiCalendar, FiUsers, FiCheck } = FiIcons;

const SubscriptionPlans = () => {
  const { subscriptionPlans, deleteSubscriptionPlan, subscriptions } = usePayment();
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const handleDeletePlan = (planId) => {
    const activeSubscriptions = subscriptions.filter(
      s => s.planId === planId && s.status === 'active'
    );

    if (activeSubscriptions.length > 0) {
      toast.error(`Cannot delete plan with ${activeSubscriptions.length} active subscriptions`);
      return;
    }

    if (window.confirm('Are you sure you want to delete this subscription plan?')) {
      deleteSubscriptionPlan(planId);
      toast.success('Subscription plan deleted successfully');
    }
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setShowPlanForm(true);
  };

  const handleClosePlanForm = () => {
    setShowPlanForm(false);
    setEditingPlan(null);
  };

  const getActiveSubscriptionsCount = (planId) => {
    return subscriptions.filter(s => s.planId === planId && s.status === 'active').length;
  };

  const formatPrice = (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(price);
  };

  const getIntervalText = (interval, intervalCount) => {
    const unit = intervalCount === 1 ? interval : `${intervalCount} ${interval}s`;
    return `per ${unit}`;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
          <p className="text-gray-600 mt-1">Manage your subscription offerings</p>
        </div>
        <Button onClick={() => setShowPlanForm(true)}>
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Create Plan
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 relative">
              {!plan.isActive && (
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
                    Inactive
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  {formatPrice(plan.price, plan.currency)}
                </div>
                <p className="text-sm text-gray-500">{getIntervalText(plan.interval, plan.intervalCount)}</p>
                {plan.trialDays > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    {plan.trialDays} days free trial
                  </p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium capitalize">{plan.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Active Subscribers</span>
                  <span className="font-medium">{getActiveSubscriptionsCount(plan.id)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Created</span>
                  <span className="font-medium">
                    {new Date(plan.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  plan.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {plan.isActive ? 'Active' : 'Inactive'}
                </span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditPlan(plan)}>
                    <SafeIcon icon={FiEdit} className="w-4 h-4" />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeletePlan(plan.id)}>
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {subscriptionPlans.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <SafeIcon icon={FiDollarSign} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No subscription plans yet</h3>
          <p className="text-gray-600 mb-4">Create your first subscription plan to start monetizing</p>
          <Button onClick={() => setShowPlanForm(true)}>
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        </motion.div>
      )}

      <Modal
        isOpen={showPlanForm}
        onClose={handleClosePlanForm}
        title={editingPlan ? 'Edit Subscription Plan' : 'Create Subscription Plan'}
        size="lg"
      >
        <SubscriptionPlanForm
          plan={editingPlan}
          onClose={handleClosePlanForm}
        />
      </Modal>
    </div>
  );
};

export default SubscriptionPlans;