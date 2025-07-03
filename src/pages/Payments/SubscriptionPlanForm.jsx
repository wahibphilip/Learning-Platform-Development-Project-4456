import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePayment, SUBSCRIPTION_TYPES } from '../../contexts/PaymentContext';
import Button from '../../components/common/Button';
import SafeIcon from '../../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiPlus, FiX } = FiIcons;

const SubscriptionPlanForm = ({ plan, onClose }) => {
  const { createSubscriptionPlan, updateSubscriptionPlan } = usePayment();
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState(plan?.features || ['']);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: plan || {
      name: '',
      type: SUBSCRIPTION_TYPES.PLATFORM,
      price: '',
      currency: 'USD',
      interval: 'month',
      intervalCount: 1,
      trialDays: 0,
      isActive: true
    }
  });

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const planData = {
        ...data,
        price: parseFloat(data.price),
        intervalCount: parseInt(data.intervalCount),
        trialDays: parseInt(data.trialDays),
        features: features.filter(f => f.trim() !== '')
      };

      if (plan) {
        updateSubscriptionPlan(plan.id, planData);
        toast.success('Subscription plan updated successfully');
      } else {
        createSubscriptionPlan(planData);
        toast.success('Subscription plan created successfully');
      }

      onClose();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan Name
            </label>
            <input
              {...register('name', { required: 'Plan name is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter plan name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan Type
            </label>
            <select
              {...register('type')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value={SUBSCRIPTION_TYPES.PLATFORM}>Platform Access</option>
              <option value={SUBSCRIPTION_TYPES.COURSE}>Per Course</option>
              <option value={SUBSCRIPTION_TYPES.PATH}>Per Learning Path</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <input
              {...register('price', { 
                required: 'Price is required',
                min: { value: 0, message: 'Price must be positive' }
              })}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0.00"
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              {...register('currency')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Billing Interval
            </label>
            <select
              {...register('interval')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interval Count
            </label>
            <input
              {...register('intervalCount', { 
                required: 'Interval count is required',
                min: { value: 1, message: 'Must be at least 1' }
              })}
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="1"
            />
            {errors.intervalCount && <p className="mt-1 text-sm text-red-600">{errors.intervalCount.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trial Days
            </label>
            <input
              {...register('trialDays', { 
                min: { value: 0, message: 'Cannot be negative' }
              })}
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0"
            />
            {errors.trialDays && <p className="mt-1 text-sm text-red-600">{errors.trialDays.message}</p>}
          </div>

          <div>
            <label className="flex items-center">
              <input
                {...register('isActive')}
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Active Plan</span>
            </label>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Features
            </label>
            <Button type="button" variant="outline" size="sm" onClick={addFeature}>
              <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
              Add Feature
            </Button>
          </div>
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter feature"
                />
                {features.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFeature(index)}
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4 pt-4 border-t">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (plan ? 'Update Plan' : 'Create Plan')}
          </Button>
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SubscriptionPlanForm;