import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePayment, COUPON_TYPES, COUPON_SCOPES } from '../../contexts/PaymentContext';
import { useData } from '../../contexts/DataContext';
import Button from '../../components/common/Button';
import SafeIcon from '../../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiPlus, FiX } = FiIcons;

const CouponForm = ({ coupon, onClose }) => {
  const { createCoupon, updateCoupon } = usePayment();
  const { courses } = useData();
  const [loading, setLoading] = useState(false);
  const [applicableItems, setApplicableItems] = useState(coupon?.applicableItems || []);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: coupon || {
      code: '',
      name: '',
      description: '',
      type: COUPON_TYPES.PERCENTAGE,
      value: '',
      scope: COUPON_SCOPES.ALL,
      usageLimit: '',
      expiryDate: '',
      isActive: true
    }
  });

  const couponType = watch('type');
  const couponScope = watch('scope');

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const addApplicableItem = (itemId) => {
    if (!applicableItems.includes(itemId)) {
      setApplicableItems([...applicableItems, itemId]);
    }
  };

  const removeApplicableItem = (itemId) => {
    setApplicableItems(applicableItems.filter(id => id !== itemId));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const couponData = {
        ...data,
        value: parseFloat(data.value),
        usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
        applicableItems: couponScope !== COUPON_SCOPES.ALL ? applicableItems : []
      };

      if (coupon) {
        updateCoupon(coupon.id, couponData);
        toast.success('Coupon updated successfully');
      } else {
        createCoupon(couponData);
        toast.success('Coupon created successfully');
      }

      onClose();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getValueLabel = () => {
    switch (couponType) {
      case COUPON_TYPES.PERCENTAGE:
        return 'Percentage (%)';
      case COUPON_TYPES.FIXED:
        return 'Amount ($)';
      case COUPON_TYPES.FREE_TRIAL:
        return 'Trial Days';
      default:
        return 'Value';
    }
  };

  const getValuePlaceholder = () => {
    switch (couponType) {
      case COUPON_TYPES.PERCENTAGE:
        return '10';
      case COUPON_TYPES.FIXED:
        return '25.00';
      case COUPON_TYPES.FREE_TRIAL:
        return '7';
      default:
        return '';
    }
  };

  const getAvailableItems = () => {
    switch (couponScope) {
      case COUPON_SCOPES.COURSE:
        return courses.map(course => ({ id: course.id, name: course.title }));
      case COUPON_SCOPES.PATH:
        // In a real app, you'd get learning paths here
        return [];
      default:
        return [];
    }
  };

  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coupon Code
            </label>
            <div className="flex space-x-2">
              <input
                {...register('code', { required: 'Coupon code is required' })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter coupon code"
                style={{ textTransform: 'uppercase' }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const code = generateCouponCode();
                  document.querySelector('input[name="code"]').value = code;
                }}
              >
                Generate
              </Button>
            </div>
            {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coupon Name
            </label>
            <input
              {...register('name', { required: 'Coupon name is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter coupon name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coupon Type
            </label>
            <select
              {...register('type')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value={COUPON_TYPES.PERCENTAGE}>Percentage Discount</option>
              <option value={COUPON_TYPES.FIXED}>Fixed Amount Discount</option>
              <option value={COUPON_TYPES.FREE_TRIAL}>Free Trial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getValueLabel()}
            </label>
            <input
              {...register('value', { 
                required: 'Value is required',
                min: { value: 0.01, message: 'Value must be positive' },
                max: couponType === COUPON_TYPES.PERCENTAGE ? { value: 100, message: 'Percentage cannot exceed 100%' } : undefined
              })}
              type="number"
              step={couponType === COUPON_TYPES.FIXED ? "0.01" : "1"}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder={getValuePlaceholder()}
            />
            {errors.value && <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scope
            </label>
            <select
              {...register('scope')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value={COUPON_SCOPES.ALL}>All Products</option>
              <option value={COUPON_SCOPES.COURSE}>Specific Courses</option>
              <option value={COUPON_SCOPES.PATH}>Specific Learning Paths</option>
              <option value={COUPON_SCOPES.PLATFORM}>Platform Subscription</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usage Limit (Optional)
            </label>
            <input
              {...register('usageLimit', { 
                min: { value: 1, message: 'Usage limit must be at least 1' }
              })}
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Unlimited"
            />
            {errors.usageLimit && <p className="mt-1 text-sm text-red-600">{errors.usageLimit.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date (Optional)
            </label>
            <input
              {...register('expiryDate')}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                {...register('isActive')}
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Active Coupon</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter coupon description"
          />
        </div>

        {(couponScope === COUPON_SCOPES.COURSE || couponScope === COUPON_SCOPES.PATH) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Applicable Items
            </label>
            <div className="space-y-4">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addApplicableItem(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select items to add</option>
                {getAvailableItems()
                  .filter(item => !applicableItems.includes(item.id))
                  .map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>

              {applicableItems.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Selected items:</p>
                  {applicableItems.map(itemId => {
                    const item = getAvailableItems().find(i => i.id === itemId);
                    if (!item) return null;
                    
                    return (
                      <div key={itemId} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">{item.name}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeApplicableItem(itemId)}
                        >
                          <SafeIcon icon={FiX} className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-4 pt-4 border-t">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (coupon ? 'Update Coupon' : 'Create Coupon')}
          </Button>
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;