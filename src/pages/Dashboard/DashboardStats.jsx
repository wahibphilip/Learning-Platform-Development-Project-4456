import React from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';
import ReactECharts from 'echarts-for-react';

const DashboardStats = () => {
  const chartOptions = {
    title: {
      text: 'Student Enrollment Trends',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['New Students', 'Course Completions']
    },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'New Students',
        type: 'line',
        data: [45, 52, 38, 65, 72, 88],
        smooth: true,
        lineStyle: {
          color: '#3B82F6'
        }
      },
      {
        name: 'Course Completions',
        type: 'line',
        data: [28, 35, 42, 48, 55, 62],
        smooth: true,
        lineStyle: {
          color: '#10B981'
        }
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="p-6">
        <ReactECharts option={chartOptions} style={{ height: '400px' }} />
      </Card>
    </motion.div>
  );
};

export default DashboardStats;