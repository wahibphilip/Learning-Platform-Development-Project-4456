import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

// Subscription plan types
export const SUBSCRIPTION_TYPES = {
  COURSE: 'course',
  PATH: 'path',
  PLATFORM: 'platform'
};

// Payment status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Coupon types
export const COUPON_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
  FREE_TRIAL: 'free_trial'
};

// Coupon scopes
export const COUPON_SCOPES = {
  COURSE: 'course',
  PATH: 'path',
  PLATFORM: 'platform',
  ALL: 'all'
};

export const PaymentProvider = ({ children }) => {
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [payments, setPayments] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [commissionSettings, setCommissionSettings] = useState({});
  const [commissionPayouts, setCommissionPayouts] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load subscription plans
    const savedPlans = localStorage.getItem('subscriptionPlans');
    if (savedPlans) {
      setSubscriptionPlans(JSON.parse(savedPlans));
    } else {
      initializeDefaultPlans();
    }

    // Load coupons
    const savedCoupons = localStorage.getItem('coupons');
    if (savedCoupons) {
      setCoupons(JSON.parse(savedCoupons));
    }

    // Load payments
    const savedPayments = localStorage.getItem('payments');
    if (savedPayments) {
      setPayments(JSON.parse(savedPayments));
    }

    // Load subscriptions
    const savedSubscriptions = localStorage.getItem('subscriptions');
    if (savedSubscriptions) {
      setSubscriptions(JSON.parse(savedSubscriptions));
    }

    // Load commission settings
    const savedCommissionSettings = localStorage.getItem('commissionSettings');
    if (savedCommissionSettings) {
      setCommissionSettings(JSON.parse(savedCommissionSettings));
    } else {
      initializeDefaultCommissionSettings();
    }

    // Load commission payouts
    const savedPayouts = localStorage.getItem('commissionPayouts');
    if (savedPayouts) {
      setCommissionPayouts(JSON.parse(savedPayouts));
    }
  };

  const initializeDefaultPlans = () => {
    const defaultPlans = [
      {
        id: 'basic-monthly',
        name: 'Basic Monthly',
        type: SUBSCRIPTION_TYPES.PLATFORM,
        price: 29.99,
        currency: 'USD',
        interval: 'month',
        intervalCount: 1,
        features: [
          'Access to all courses',
          'Basic support',
          'Certificate generation',
          'Mobile access'
        ],
        isActive: true,
        trialDays: 7,
        createdAt: new Date().toISOString()
      },
      {
        id: 'pro-monthly',
        name: 'Pro Monthly',
        type: SUBSCRIPTION_TYPES.PLATFORM,
        price: 49.99,
        currency: 'USD',
        interval: 'month',
        intervalCount: 1,
        features: [
          'Access to all courses',
          'Priority support',
          'Advanced analytics',
          'Certificate generation',
          'Mobile access',
          'Download content'
        ],
        isActive: true,
        trialDays: 14,
        createdAt: new Date().toISOString()
      },
      {
        id: 'enterprise-yearly',
        name: 'Enterprise Yearly',
        type: SUBSCRIPTION_TYPES.PLATFORM,
        price: 499.99,
        currency: 'USD',
        interval: 'year',
        intervalCount: 1,
        features: [
          'Access to all courses',
          'Dedicated support',
          'Advanced analytics',
          'Custom branding',
          'API access',
          'Bulk user management'
        ],
        isActive: true,
        trialDays: 30,
        createdAt: new Date().toISOString()
      }
    ];

    setSubscriptionPlans(defaultPlans);
    localStorage.setItem('subscriptionPlans', JSON.stringify(defaultPlans));
  };

  const initializeDefaultCommissionSettings = () => {
    const defaultSettings = {
      defaultRate: 70, // 70% to creator, 30% to platform
      platformFee: 30,
      paymentSchedule: 'monthly', // weekly, monthly, quarterly
      minimumPayout: 50,
      paymentMethod: 'bank_transfer',
      taxHandling: 'creator_responsible',
      createdAt: new Date().toISOString()
    };

    setCommissionSettings(defaultSettings);
    localStorage.setItem('commissionSettings', JSON.stringify(defaultSettings));
  };

  // Subscription Plan Management
  const createSubscriptionPlan = (planData) => {
    const newPlan = {
      ...planData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedPlans = [...subscriptionPlans, newPlan];
    setSubscriptionPlans(updatedPlans);
    localStorage.setItem('subscriptionPlans', JSON.stringify(updatedPlans));
    return newPlan;
  };

  const updateSubscriptionPlan = (planId, updates) => {
    const updatedPlans = subscriptionPlans.map(plan =>
      plan.id === planId ? { ...plan, ...updates, updatedAt: new Date().toISOString() } : plan
    );
    setSubscriptionPlans(updatedPlans);
    localStorage.setItem('subscriptionPlans', JSON.stringify(updatedPlans));
  };

  const deleteSubscriptionPlan = (planId) => {
    const updatedPlans = subscriptionPlans.filter(plan => plan.id !== planId);
    setSubscriptionPlans(updatedPlans);
    localStorage.setItem('subscriptionPlans', JSON.stringify(updatedPlans));
  };

  // Coupon Management
  const createCoupon = (couponData) => {
    const newCoupon = {
      ...couponData,
      id: uuidv4(),
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedCoupons = [...coupons, newCoupon];
    setCoupons(updatedCoupons);
    localStorage.setItem('coupons', JSON.stringify(updatedCoupons));
    return newCoupon;
  };

  const updateCoupon = (couponId, updates) => {
    const updatedCoupons = coupons.map(coupon =>
      coupon.id === couponId ? { ...coupon, ...updates, updatedAt: new Date().toISOString() } : coupon
    );
    setCoupons(updatedCoupons);
    localStorage.setItem('coupons', JSON.stringify(updatedCoupons));
  };

  const deleteCoupon = (couponId) => {
    const updatedCoupons = coupons.filter(coupon => coupon.id !== couponId);
    setCoupons(updatedCoupons);
    localStorage.setItem('coupons', JSON.stringify(updatedCoupons));
  };

  const validateCoupon = (couponCode, scope, itemId = null) => {
    const coupon = coupons.find(c => 
      c.code.toLowerCase() === couponCode.toLowerCase() && 
      c.isActive
    );

    if (!coupon) {
      return { valid: false, error: 'Coupon not found' };
    }

    // Check expiry
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, error: 'Coupon has expired' };
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, error: 'Coupon usage limit reached' };
    }

    // Check scope
    if (coupon.scope !== COUPON_SCOPES.ALL && coupon.scope !== scope) {
      return { valid: false, error: 'Coupon not applicable to this item' };
    }

    // Check specific item (for course/path specific coupons)
    if (coupon.applicableItems && coupon.applicableItems.length > 0) {
      if (!coupon.applicableItems.includes(itemId)) {
        return { valid: false, error: 'Coupon not applicable to this item' };
      }
    }

    return { valid: true, coupon };
  };

  const applyCoupon = (couponCode, originalPrice, scope, itemId = null) => {
    const validation = validateCoupon(couponCode, scope, itemId);
    
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const coupon = validation.coupon;
    let discount = 0;
    let finalPrice = originalPrice;

    switch (coupon.type) {
      case COUPON_TYPES.PERCENTAGE:
        discount = (originalPrice * coupon.value) / 100;
        finalPrice = originalPrice - discount;
        break;
      case COUPON_TYPES.FIXED:
        discount = Math.min(coupon.value, originalPrice);
        finalPrice = originalPrice - discount;
        break;
      case COUPON_TYPES.FREE_TRIAL:
        discount = originalPrice;
        finalPrice = 0;
        break;
      default:
        return { success: false, error: 'Invalid coupon type' };
    }

    // Update usage count
    updateCoupon(coupon.id, { usageCount: coupon.usageCount + 1 });

    return {
      success: true,
      originalPrice,
      discount,
      finalPrice: Math.max(0, finalPrice),
      coupon
    };
  };

  // Payment Processing
  const processPayment = async (paymentData) => {
    try {
      const payment = {
        id: uuidv4(),
        ...paymentData,
        status: PAYMENT_STATUS.PENDING,
        createdAt: new Date().toISOString()
      };

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 90% success rate for simulation
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        payment.status = PAYMENT_STATUS.COMPLETED;
        payment.completedAt = new Date().toISOString();
        
        // Create subscription if applicable
        if (payment.subscriptionPlanId) {
          await createSubscription(payment);
        }

        // Process commission
        if (payment.creatorId) {
          await processCommission(payment);
        }
      } else {
        payment.status = PAYMENT_STATUS.FAILED;
        payment.failureReason = 'Payment declined by bank';
      }

      const updatedPayments = [...payments, payment];
      setPayments(updatedPayments);
      localStorage.setItem('payments', JSON.stringify(updatedPayments));

      return payment;
    } catch (error) {
      throw new Error('Payment processing failed');
    }
  };

  // Subscription Management
  const createSubscription = async (payment) => {
    const plan = subscriptionPlans.find(p => p.id === payment.subscriptionPlanId);
    if (!plan) return;

    const startDate = new Date();
    const endDate = new Date(startDate);
    
    if (plan.interval === 'month') {
      endDate.setMonth(endDate.getMonth() + plan.intervalCount);
    } else if (plan.interval === 'year') {
      endDate.setFullYear(endDate.getFullYear() + plan.intervalCount);
    }

    const subscription = {
      id: uuidv4(),
      userId: payment.userId,
      planId: payment.subscriptionPlanId,
      status: 'active',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      autoRenew: true,
      paymentId: payment.id,
      createdAt: new Date().toISOString()
    };

    const updatedSubscriptions = [...subscriptions, subscription];
    setSubscriptions(updatedSubscriptions);
    localStorage.setItem('subscriptions', JSON.stringify(updatedSubscriptions));

    return subscription;
  };

  // Commission Management
  const updateCommissionSettings = (newSettings) => {
    const updatedSettings = {
      ...commissionSettings,
      ...newSettings,
      updatedAt: new Date().toISOString()
    };
    setCommissionSettings(updatedSettings);
    localStorage.setItem('commissionSettings', JSON.stringify(updatedSettings));
  };

  const processCommission = async (payment) => {
    const commissionAmount = (payment.amount * commissionSettings.defaultRate) / 100;
    const platformFee = payment.amount - commissionAmount;

    const commission = {
      id: uuidv4(),
      paymentId: payment.id,
      creatorId: payment.creatorId,
      amount: commissionAmount,
      platformFee,
      originalAmount: payment.amount,
      rate: commissionSettings.defaultRate,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updatedPayouts = [...commissionPayouts, commission];
    setCommissionPayouts(updatedPayouts);
    localStorage.setItem('commissionPayouts', JSON.stringify(updatedPayouts));

    return commission;
  };

  const processCommissionPayout = (commissionIds) => {
    const updatedPayouts = commissionPayouts.map(payout => {
      if (commissionIds.includes(payout.id)) {
        return {
          ...payout,
          status: 'paid',
          paidAt: new Date().toISOString()
        };
      }
      return payout;
    });

    setCommissionPayouts(updatedPayouts);
    localStorage.setItem('commissionPayouts', JSON.stringify(updatedPayouts));
  };

  // Analytics
  const getPaymentAnalytics = () => {
    const totalRevenue = payments
      .filter(p => p.status === PAYMENT_STATUS.COMPLETED)
      .reduce((sum, p) => sum + p.amount, 0);

    const totalCommissions = commissionPayouts
      .reduce((sum, c) => sum + c.amount, 0);

    const platformRevenue = totalRevenue - totalCommissions;

    const monthlyRevenue = payments
      .filter(p => {
        const paymentDate = new Date(p.createdAt);
        const currentMonth = new Date();
        return paymentDate.getMonth() === currentMonth.getMonth() &&
               paymentDate.getFullYear() === currentMonth.getFullYear() &&
               p.status === PAYMENT_STATUS.COMPLETED;
      })
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      totalRevenue,
      totalCommissions,
      platformRevenue,
      monthlyRevenue,
      totalPayments: payments.length,
      successfulPayments: payments.filter(p => p.status === PAYMENT_STATUS.COMPLETED).length,
      activeSubscriptions: subscriptions.filter(s => s.status === 'active').length
    };
  };

  const value = {
    // Subscription Plans
    subscriptionPlans,
    createSubscriptionPlan,
    updateSubscriptionPlan,
    deleteSubscriptionPlan,
    
    // Coupons
    coupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
    applyCoupon,
    
    // Payments
    payments,
    processPayment,
    
    // Subscriptions
    subscriptions,
    createSubscription,
    
    // Commissions
    commissionSettings,
    commissionPayouts,
    updateCommissionSettings,
    processCommission,
    processCommissionPayout,
    
    // Analytics
    getPaymentAnalytics,
    
    // Constants
    SUBSCRIPTION_TYPES,
    PAYMENT_STATUS,
    COUPON_TYPES,
    COUPON_SCOPES
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};