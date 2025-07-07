import React from 'react';
import { useTradeContext } from '../contexts/TradeContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const { FiTrendingUp, FiTrendingDown, FiTarget, FiClock } = FiIcons;

const Analytics = () => {
  const { trades, getPerformanceMetrics } = useTradeContext();
  const metrics = getPerformanceMetrics();

  // Strategy performance analysis
  const strategyPerformance = trades.reduce((acc, trade) => {
    const strategy = trade.strategy;
    if (!acc[strategy]) {
      acc[strategy] = { wins: 0, losses: 0, total: 0, pnl: 0 };
    }
    
    acc[strategy].total += 1;
    acc[strategy].pnl += parseFloat(trade.pnl || 0);
    
    if (parseFloat(trade.pnl) > 0) {
      acc[strategy].wins += 1;
    } else {
      acc[strategy].losses += 1;
    }
    
    return acc;
  }, {});

  const strategyData = Object.entries(strategyPerformance).map(([strategy, data]) => ({
    strategy,
    winRate: data.total > 0 ? (data.wins / data.total) * 100 : 0,
    totalPnL: data.pnl,
    totalTrades: data.total,
  }));

  // Currency pair performance
  const pairPerformance = trades.reduce((acc, trade) => {
    const pair = trade.currencyPair;
    if (!acc[pair]) {
      acc[pair] = { wins: 0, losses: 0, total: 0, pnl: 0 };
    }
    
    acc[pair].total += 1;
    acc[pair].pnl += parseFloat(trade.pnl || 0);
    
    if (parseFloat(trade.pnl) > 0) {
      acc[pair].wins += 1;
    } else {
      acc[pair].losses += 1;
    }
    
    return acc;
  }, {});

  const pairData = Object.entries(pairPerformance).map(([pair, data]) => ({
    pair,
    winRate: data.total > 0 ? (data.wins / data.total) * 100 : 0,
    totalPnL: data.pnl,
    totalTrades: data.total,
  }));

  // Session performance
  const sessionPerformance = trades.reduce((acc, trade) => {
    const session = trade.session;
    if (!acc[session]) {
      acc[session] = { wins: 0, losses: 0, total: 0, pnl: 0 };
    }
    
    acc[session].total += 1;
    acc[session].pnl += parseFloat(trade.pnl || 0);
    
    if (parseFloat(trade.pnl) > 0) {
      acc[session].wins += 1;
    } else {
      acc[session].losses += 1;
    }
    
    return acc;
  }, {});

  const sessionData = Object.entries(sessionPerformance).map(([session, data]) => ({
    session,
    winRate: data.total > 0 ? (data.wins / data.total) * 100 : 0,
    totalPnL: data.pnl,
    totalTrades: data.total,
  }));

  // Win/Loss pie chart data
  const winLossData = [
    { name: 'Wins', value: trades.filter(t => parseFloat(t.pnl) > 0).length, color: '#10B981' },
    { name: 'Losses', value: trades.filter(t => parseFloat(t.pnl) <= 0).length, color: '#EF4444' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
        <div className="text-sm text-gray-600">
          Based on {trades.length} trades
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Win Rate</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.winRate.toFixed(1)}%</p>
            </div>
            <SafeIcon icon={FiTarget} className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profit Factor</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.profitFactor.toFixed(2)}</p>
            </div>
            <SafeIcon icon={FiTrendingUp} className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Best Trade</p>
              <p className="text-2xl font-bold text-green-600">${metrics.bestTrade.toFixed(2)}</p>
            </div>
            <SafeIcon icon={FiTrendingUp} className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Worst Trade</p>
              <p className="text-2xl font-bold text-red-600">${metrics.worstTrade.toFixed(2)}</p>
            </div>
            <SafeIcon icon={FiTrendingDown} className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Win/Loss Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Win/Loss Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={winLossData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {winLossData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strategy Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Strategy Performance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={strategyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="strategy" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'totalPnL' ? `$${value.toFixed(2)}` : `${value.toFixed(1)}%`,
                    name === 'totalPnL' ? 'Total P&L' : 'Win Rate'
                  ]}
                />
                <Bar dataKey="totalPnL" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Currency Pair Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Currency Pair Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Pair</th>
                  <th className="text-center py-2">Trades</th>
                  <th className="text-center py-2">Win Rate</th>
                  <th className="text-right py-2">P&L</th>
                </tr>
              </thead>
              <tbody>
                {pairData.map((pair) => (
                  <tr key={pair.pair} className="border-b">
                    <td className="py-2 font-medium">{pair.pair}</td>
                    <td className="text-center py-2">{pair.totalTrades}</td>
                    <td className="text-center py-2">{pair.winRate.toFixed(1)}%</td>
                    <td className={`text-right py-2 font-medium ${
                      pair.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${pair.totalPnL.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Session Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Session Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Session</th>
                  <th className="text-center py-2">Trades</th>
                  <th className="text-center py-2">Win Rate</th>
                  <th className="text-right py-2">P&L</th>
                </tr>
              </thead>
              <tbody>
                {sessionData.map((session) => (
                  <tr key={session.session} className="border-b">
                    <td className="py-2 font-medium">{session.session}</td>
                    <td className="text-center py-2">{session.totalTrades}</td>
                    <td className="text-center py-2">{session.winRate.toFixed(1)}%</td>
                    <td className={`text-right py-2 font-medium ${
                      session.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${session.totalPnL.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Advanced Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Advanced Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">${metrics.averageWin.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Average Win</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">${metrics.averageLoss.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Average Loss</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">${metrics.grossProfit.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Gross Profit</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">${metrics.grossLoss.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Gross Loss</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;