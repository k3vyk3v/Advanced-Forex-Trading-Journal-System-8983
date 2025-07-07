import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useTradeContext } from '../contexts/TradeContext';
import { format } from 'date-fns';

const PerformanceChart = () => {
  const { trades } = useTradeContext();

  // Prepare data for cumulative P&L chart
  const cumulativeData = trades.reduce((acc, trade, index) => {
    const prevTotal = index > 0 ? acc[index - 1].cumulative : 0;
    const current = parseFloat(trade.pnl || 0);
    
    acc.push({
      date: format(new Date(trade.date), 'MMM dd'),
      pnl: current,
      cumulative: prevTotal + current,
      trade: index + 1,
    });
    
    return acc;
  }, []);

  // Prepare data for daily P&L
  const dailyData = trades.reduce((acc, trade) => {
    const date = format(new Date(trade.date), 'MMM dd');
    const existing = acc.find(item => item.date === date);
    
    if (existing) {
      existing.pnl += parseFloat(trade.pnl || 0);
    } else {
      acc.push({
        date,
        pnl: parseFloat(trade.pnl || 0),
      });
    }
    
    return acc;
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Charts</h2>
      
      <div className="space-y-8">
        {/* Cumulative P&L Chart */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Cumulative P&L</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cumulativeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    `$${value.toFixed(2)}`,
                    name === 'cumulative' ? 'Cumulative P&L' : 'Trade P&L'
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily P&L Chart */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Daily P&L</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`$${value.toFixed(2)}`, 'Daily P&L']}
                />
                <Bar
                  dataKey="pnl"
                  fill={(entry) => entry.pnl >= 0 ? '#10B981' : '#EF4444'}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;