import React from 'react';
import { useTradeContext } from '../contexts/TradeContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const { FiBrain, FiHeart, FiTrendingUp, FiAlertCircle } = FiIcons;

const Psychology = () => {
  const { trades } = useTradeContext();

  // Filter trades with psychology data
  const psychologyTrades = trades.filter(trade => trade.psychology);

  // Prepare data for psychology charts
  const psychologyData = psychologyTrades.map((trade, index) => ({
    trade: index + 1,
    confidence: trade.psychology.confidenceLevel,
    stress: trade.psychology.stressLevel,
    lifeStress: trade.psychology.lifeStressLevel,
    pnl: parseFloat(trade.pnl || 0),
    sleepQuality: trade.psychology.sleepQuality,
    marketMood: trade.psychology.marketMood,
    date: trade.date,
  }));

  // Analyze correlation between psychology and performance
  const analyzeCorrelation = () => {
    if (psychologyTrades.length === 0) return {};

    const highConfidence = psychologyTrades.filter(t => t.psychology.confidenceLevel >= 7);
    const lowConfidence = psychologyTrades.filter(t => t.psychology.confidenceLevel <= 4);
    
    const lowStress = psychologyTrades.filter(t => t.psychology.stressLevel <= 4);
    const highStress = psychologyTrades.filter(t => t.psychology.stressLevel >= 7);

    const goodSleep = psychologyTrades.filter(t => ['Excellent', 'Good'].includes(t.psychology.sleepQuality));
    const poorSleep = psychologyTrades.filter(t => ['Fair', 'Poor'].includes(t.psychology.sleepQuality));

    const calculateAvg = (trades) => trades.length > 0 ? 
      trades.reduce((sum, t) => sum + parseFloat(t.pnl || 0), 0) / trades.length : 0;

    return {
      highConfidenceAvg: calculateAvg(highConfidence),
      lowConfidenceAvg: calculateAvg(lowConfidence),
      lowStressAvg: calculateAvg(lowStress),
      highStressAvg: calculateAvg(highStress),
      goodSleepAvg: calculateAvg(goodSleep),
      poorSleepAvg: calculateAvg(poorSleep),
      highConfidenceCount: highConfidence.length,
      lowConfidenceCount: lowConfidence.length,
      lowStressCount: lowStress.length,
      highStressCount: highStress.length,
      goodSleepCount: goodSleep.length,
      poorSleepCount: poorSleep.length,
    };
  };

  const correlation = analyzeCorrelation();

  // Mood distribution
  const moodDistribution = psychologyTrades.reduce((acc, trade) => {
    const mood = trade.psychology.marketMood;
    if (!acc[mood]) {
      acc[mood] = { count: 0, totalPnL: 0, wins: 0 };
    }
    acc[mood].count += 1;
    acc[mood].totalPnL += parseFloat(trade.pnl || 0);
    if (parseFloat(trade.pnl) > 0) acc[mood].wins += 1;
    return acc;
  }, {});

  const moodData = Object.entries(moodDistribution).map(([mood, data]) => ({
    mood,
    count: data.count,
    avgPnL: data.totalPnL / data.count,
    winRate: (data.wins / data.count) * 100,
  }));

  // Recent psychology trends
  const recentTrends = psychologyData.slice(-10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Psychology Analysis</h1>
        <div className="text-sm text-gray-600">
          {psychologyTrades.length} trades with psychology data
        </div>
      </div>

      {psychologyTrades.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <SafeIcon icon={FiBrain} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Psychology Data</h2>
          <p className="text-gray-600">Start logging trades with psychology tracking to see insights here.</p>
        </div>
      ) : (
        <>
          {/* Correlation Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Confidence Impact</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">High Confidence (7-10)</span>
                  <span className={`font-medium ${
                    correlation.highConfidenceAvg >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${correlation.highConfidenceAvg?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Low Confidence (1-4)</span>
                  <span className={`font-medium ${
                    correlation.lowConfidenceAvg >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${correlation.lowConfidenceAvg?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {correlation.highConfidenceCount} high vs {correlation.lowConfidenceCount} low confidence trades
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Stress Impact</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Low Stress (1-4)</span>
                  <span className={`font-medium ${
                    correlation.lowStressAvg >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${correlation.lowStressAvg?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">High Stress (7-10)</span>
                  <span className={`font-medium ${
                    correlation.highStressAvg >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${correlation.highStressAvg?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {correlation.lowStressCount} low vs {correlation.highStressCount} high stress trades
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sleep Impact</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Good Sleep</span>
                  <span className={`font-medium ${
                    correlation.goodSleepAvg >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${correlation.goodSleepAvg?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Poor Sleep</span>
                  <span className={`font-medium ${
                    correlation.poorSleepAvg >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${correlation.poorSleepAvg?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {correlation.goodSleepCount} good vs {correlation.poorSleepCount} poor sleep trades
                </div>
              </div>
            </div>
          </div>

          {/* Psychology Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Psychology Trends</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={recentTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="trade" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="confidence"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      name="Confidence"
                    />
                    <Line
                      type="monotone"
                      dataKey="stress"
                      stroke="#EF4444"
                      strokeWidth={2}
                      name="Stress"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Mood Performance</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mood" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'avgPnL' ? `$${value.toFixed(2)}` : `${value.toFixed(1)}%`,
                        name === 'avgPnL' ? 'Avg P&L' : 'Win Rate'
                      ]}
                    />
                    <Bar dataKey="avgPnL" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Insights and Recommendations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Psychology Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Key Findings</h3>
                <div className="space-y-3">
                  {correlation.highConfidenceAvg > correlation.lowConfidenceAvg && (
                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                      <SafeIcon icon={FiTrendingUp} className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Confidence Correlation</p>
                        <p className="text-sm text-green-700">
                          High confidence trades perform ${(correlation.highConfidenceAvg - correlation.lowConfidenceAvg).toFixed(2)} better on average
                        </p>
                      </div>
                    </div>
                  )}

                  {correlation.lowStressAvg > correlation.highStressAvg && (
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <SafeIcon icon={FiHeart} className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Stress Management</p>
                        <p className="text-sm text-blue-700">
                          Low stress trades outperform high stress by ${(correlation.lowStressAvg - correlation.highStressAvg).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )}

                  {correlation.goodSleepAvg > correlation.poorSleepAvg && (
                    <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                      <SafeIcon icon={FiBrain} className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-purple-800">Sleep Quality</p>
                        <p className="text-sm text-purple-700">
                          Good sleep improves performance by ${(correlation.goodSleepAvg - correlation.poorSleepAvg).toFixed(2)} per trade
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Recommendations</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <SafeIcon icon={FiAlertCircle} className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Optimal Trading State</p>
                      <p className="text-sm text-yellow-700">
                        Trade when confidence is 7 or higher, stress is 4 or lower, and after good sleep for best results
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                    <SafeIcon icon={FiAlertCircle} className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Avoid Trading When</p>
                      <p className="text-sm text-red-700">
                        Confidence is 4 or lower, stress is 7 or higher, or after poor sleep - consider waiting
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <SafeIcon icon={FiBrain} className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Mood Management</p>
                      <p className="text-sm text-blue-700">
                        Calm mood shows best performance - practice mindfulness before trading
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Psychology Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Psychology Logs</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Date</th>
                    <th className="text-center py-2">Confidence</th>
                    <th className="text-center py-2">Stress</th>
                    <th className="text-center py-2">Sleep</th>
                    <th className="text-center py-2">Mood</th>
                    <th className="text-right py-2">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {psychologyTrades.slice(-10).reverse().map((trade) => (
                    <tr key={trade.id} className="border-b">
                      <td className="py-2">{new Date(trade.date).toLocaleDateString()}</td>
                      <td className="text-center py-2">
                        <span className={`font-medium ${
                          trade.psychology.confidenceLevel >= 7 ? 'text-green-600' :
                          trade.psychology.confidenceLevel >= 5 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {trade.psychology.confidenceLevel}/10
                        </span>
                      </td>
                      <td className="text-center py-2">
                        <span className={`font-medium ${
                          trade.psychology.stressLevel <= 4 ? 'text-green-600' :
                          trade.psychology.stressLevel <= 7 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {trade.psychology.stressLevel}/10
                        </span>
                      </td>
                      <td className="text-center py-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          ['Excellent', 'Good'].includes(trade.psychology.sleepQuality) 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {trade.psychology.sleepQuality}
                        </span>
                      </td>
                      <td className="text-center py-2">
                        <span className="text-xs">{trade.psychology.marketMood}</span>
                      </td>
                      <td className={`text-right py-2 font-medium ${
                        parseFloat(trade.pnl) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${parseFloat(trade.pnl).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Psychology;