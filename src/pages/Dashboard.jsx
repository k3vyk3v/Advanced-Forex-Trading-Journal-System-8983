import React from 'react';
import { motion } from 'framer-motion';
import { useTradeContext } from '../contexts/TradeContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import PerformanceChart from '../components/PerformanceChart';
import RecentTrades from '../components/RecentTrades';
import TradingInsights from '../components/TradingInsights';

const { FiTrendingUp, FiTrendingDown, FiTarget, FiAlertCircle } = FiIcons;

const Dashboard = () => {
  const { getPerformanceMetrics, trades } = useTradeContext();
  const metrics = getPerformanceMetrics();

  const statCards = [
    {
      title: 'Account Balance',
      value: `$${metrics.currentBalance.toFixed(2)}`,
      change: `${metrics.totalPnL >= 0 ? '+' : ''}$${metrics.totalPnL.toFixed(2)}`,
      changeColor: metrics.totalPnL >= 0 ? 'text-green-600' : 'text-red-600',
      icon: FiTarget,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Win Rate',
      value: `${metrics.winRate.toFixed(1)}%`,
      change: `${metrics.totalTrades} trades`,
      changeColor: 'text-gray-600',
      icon: FiTrendingUp,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Profit Factor',
      value: metrics.profitFactor.toFixed(2),
      change: `Avg Win: $${metrics.averageWin.toFixed(2)}`,
      changeColor: 'text-gray-600',
      icon: FiTrendingUp,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Drawdown',
      value: `${metrics.drawdown.toFixed(1)}%`,
      change: `Worst Trade: $${metrics.worstTrade.toFixed(2)}`,
      changeColor: 'text-red-600',
      icon: FiTrendingDown,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Trading Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <SafeIcon icon={FiAlertCircle} className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                <p className={`text-sm mt-1 ${card.changeColor}`}>{card.change}</p>
              </div>
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <SafeIcon icon={card.icon} className={`h-6 w-6 ${card.iconColor}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
        <div>
          <TradingInsights />
        </div>
      </div>

      <RecentTrades />
    </div>
  );
};

export default Dashboard;