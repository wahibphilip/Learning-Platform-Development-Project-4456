import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePayment, COUPON_TYPES, COUPON_SCOPES } from '../../contexts/PaymentContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import SafeIcon from '../../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import CouponForm from './CouponForm';
import toast from 'react-hot-toast';

const { FiPlus, FiEdit, FiTrash2, FiPercent, FiCalendar, FiUsers, FiTag } = FiIcons;

const Coupons = () => {
  const { coupons, deleteCoupon } = usePayment();
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const handleDeleteCoupon = (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      deleteCoupon(couponId);
      toast.success('Coupon deleted successfully');
    }
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setShowCouponForm(true);
  };

  const handleCloseCouponForm = () => {
    setShowCouponForm(false);
    setEditingCoupon(null);
  };

  const formatCouponValue = (coupon) => {
    switch (coupon.type) {
      case COUPON_TYPES.PERCENTAGE:
        return `${coupon.value}% OFF`;
      case COUPON_TYPES.FIXED:
        return `$${coupon.value} OFF`;
      case COUPON_TYPES.FREE_TRIAL:
        return `${coupon.value} Days Free`;
      default:
        return coupon.value;
    }
  };

  const getCouponStatusColor = (coupon) => {
    if (!coupon.isActive) return 'bg-gray-100 text-gray-800';
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return 'bg-red-100 text-red-800';
    }
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-green-100 text-green-800';
  };

  const getCouponStatus = (coupon) => {
    if (!coupon.isActive) return 'Inactive';
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return 'Expired';
    }
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return 'Used Up';
    }
    return 'Active';
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-600 mt-1">Manage discount coupons and promotional codes</p>
        </div>
        <Button onClick={() => setShowCouponForm(true)}>
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Create Coupon
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon, index) => (
          <motion.div
            key={coupon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={FiTag} className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{coupon.code}</h3>
                    <p className="text-sm text-gray-500">{coupon.name}</p>
                  </div>
                </div>
              </div>

              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-primary-600 mb-1">
                  {formatCouponValue(coupon)}
                </div>
                <p className="text-sm text-gray-500 capitalize">{coupon.scope} scope</p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Usage</span>
                  <span className="font-medium">
                    {coupon.usageCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}
                  </span>
                </div>
                
                {coupon.expiryDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Expires</span>
                    <span className="font-medium">
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Created</span>
                  <span className="font-medium">
                    {new Date(coupon.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {coupon.description && (
                <p className="text-sm text-gray-600 mb-4">{coupon.description}</p>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCouponStatusColor(coupon)}`}>
                  {getCouponStatus(coupon)}
                </span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditCoupon(coupon)}>
                    <SafeIcon icon={FiEdit} className="w-4 h-4" />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteCoupon(coupon.id)}>
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {coupons.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <SafeIcon icon={FiPercent} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons yet</h3>
          <p className="text-gray-600 mb-4">Create your first coupon to offer discounts</p>
          <Button onClick={() => setShowCouponForm(true)}>
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Create Coupon
          </Button>
        </motion.div>
      )}

      <Modal
        isOpen={showCouponForm}
        onClose={handleCloseCouponForm}
        title={editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
        size="lg"
      >
        <CouponForm
          coupon={editingCoupon}
          onClose={handleCloseCouponForm}
        />
      </Modal>
    </div>
  );
};

export default Coupons;