import React from 'react';
import { motion } from 'framer-motion';
import { usePayment } from '../../contexts/PaymentContext';
import Card from '../../components/common/Card';
import SafeIcon from '../../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import ReactECharts from 'echarts-for-react';

const { FiDollarSign, FiTrendingUp, FiUsers, FiCreditCard } = FiIcons;

const PaymentAnalytics = () => {
  const { getPaymentAnalytics, payments, subscriptions, coupons } = usePayment();
  const analytics = getPaymentAnalytics();

  const getRevenueChartOptions = () => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }).reverse();

    const revenueData = last6Months.map(month => {
      return payments
        .filter(payment => {
          const paymentDate = new Date(payment.createdAt);
          const monthYear = paymentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          return monthYear === month && payment.status === 'completed';
        })
        .reduce((sum, payment) => sum + payment.amount, 0);
    });

    return {
      title: {
        text: 'Revenue Trends',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          const data = params[0];
          return `${data.axisValue}<br/>Revenue: $${data.value.toFixed(2)}`;
        }
      },
      xAxis: {
        type: 'category',
        data: last6Months
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '${value}'
        }
      },
      series: [{
        data: revenueData,
        type: 'line',
        smooth: true,
        areaStyle: {
          color: 'rgba(59, 130, 246, 0.1)'
        },
        lineStyle: {
          color: '#3B82F6'
        },
        itemStyle: {
          color: '#3B82F6'
        }
      }]
    };
  };

  const getSubscriptionDistributionOptions = () => {
    const planCounts = subscriptions.reduce((acc, sub) => {
      acc[sub.planId] = (acc[sub.planId] || 0) + 1;
      return acc;
    }, {});

    const data = Object.entries(planCounts).map(([planId, count]) => ({
      name: `Plan ${planId}`,
      value: count
    }));

    return {
      title: {
        text: 'Subscription Distribution',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      series: [{
        name: 'Subscriptions',
        type: 'pie',
        radius: ['40%', '70%'],
        data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
  };

  const getCouponUsageStats = () => {
    const totalCoupons = coupons.length;
    const activeCoupons = coupons.filter(c => c.isActive).length;
    const usedCoupons = coupons.filter(c => c.usageCount > 0).length;
    const totalUsage = coupons.reduce((sum, c) => sum + c.usageCount, 0);

    return { totalCoupons, activeCoupons, usedCoupons, totalUsage };
  };

  const couponStats = getCouponUsageStats();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Payment Analytics</h1>
        <p className="text-gray-600 mt-1">Track revenue, subscriptions, and payment performance</p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalRevenue)}</p>
                <p className="text-sm text-green-600">+12% from last month</p>
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
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.monthlyRevenue)}</p>
                <p className="text-sm text-blue-600">Current month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-blue-600" />
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
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.activeSubscriptions}</p>
                <p className="text-sm text-purple-600">Currently active</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiUsers} className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Payment Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.totalPayments > 0 
                    ? Math.round((analytics.successfulPayments / analytics.totalPayments) * 100)
                    : 0}%
                </p>
                <p className="text-sm text-green-600">{analytics.successfulPayments}/{analytics.totalPayments} payments</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiCreditCard} className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <ReactECharts option={getRevenueChartOptions()} style={{ height: '300px' }} />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <ReactECharts option={getSubscriptionDistributionOptions()} style={{ height: '300px' }} />
          </Card>
        </motion.div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Breakdown</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Commissions Paid</span>
                <span className="font-semibold">{formatCurrency(analytics.totalCommissions)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Platform Revenue</span>
                <span className="font-semibold">{formatCurrency(analytics.platformRevenue)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-gray-900 font-medium">Platform Share</span>
                <span className="font-bold">
                  {analytics.totalRevenue > 0 
                    ? Math.round((analytics.platformRevenue / analytics.totalRevenue) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Coupon Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Coupons</span>
                <span className="font-semibold">{couponStats.totalCoupons}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Coupons</span>
                <span className="font-semibold">{couponStats.activeCoupons}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Used Coupons</span>
                <span className="font-semibold">{couponStats.usedCoupons}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-gray-900 font-medium">Total Usage</span>
                <span className="font-bold">{couponStats.totalUsage}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentAnalytics;