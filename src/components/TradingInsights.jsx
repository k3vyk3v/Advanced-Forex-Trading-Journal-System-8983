import React from 'react';
import { useTradeContext } from '../contexts/TradeContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTrendingUp, FiAlertTriangle, FiTarget, FiClock } = FiIcons;

const TradingInsights = () => {
  const { trades } = useTradeContext();

  const generateInsights = () => {
    if (trades.length === 0) return [];

    const insights = [];

    // Best performing currency pair
    const pairPerformance = trades.reduce((acc, trade) => {
      const pair = trade.currencyPair;
      if (!acc[pair]) {
        acc[pair] = { total: 0, count: 0, wins: 0 };
      }
      acc[pair].total += parseFloat(trade.pnl || 0);
      acc[pair].count += 1;
      if (parseFloat(trade.pnl) > 0) acc[pair].wins += 1;
      return acc;
    }, {});

    const bestPair = Object.entries(pairPerformance).reduce((best, [pair, stats]) => {
      return stats.total > (best.stats?.total || -Infinity) ? { pair, stats } : best;
    }, {});

    if (bestPair.pair) {
      insights.push({
        type: 'success',
        icon: FiTrendingUp,
        title: 'Best Performing Pair',
        message: `${bestPair.pair} with $${bestPair.stats.total.toFixed(2)} profit (${((bestPair.stats.wins / bestPair.stats.count) * 100).toFixed(1)}% win rate)`,
      });
    }

    // Best trading session
    const sessionPerformance = trades.reduce((acc, trade) => {
      const session = trade.session;
      if (!acc[session]) {
        acc[session] = { total: 0, count: 0 };
      }
      acc[session].total += parseFloat(trade.pnl || 0);
      acc[session].count += 1;
      return acc;
    }, {});

    const bestSession = Object.entries(sessionPerformance).reduce((best, [session, stats]) => {
      return stats.total > (best.stats?.total || -Infinity) ? { session, stats } : best;
    }, {});

    if (bestSession.session) {
      insights.push({
        type: 'info',
        icon: FiClock,
        title: 'Best Trading Session',
        message: `${bestSession.session} session with $${bestSession.stats.total.toFixed(2)} profit from ${bestSession.stats.count} trades`,
      });
    }

    // Psychology correlation
    const psychologyTrades = trades.filter(t => t.psychology);
    if (psychologyTrades.length > 0) {
      const highConfidenceTrades = psychologyTrades.filter(t => t.psychology.confidenceLevel >= 7);
      const lowConfidenceTrades = psychologyTrades.filter(t => t.psychology.confidenceLevel <= 4);
      
      if (highConfidenceTrades.length > 0 && lowConfidenceTrades.length > 0) {
        const highConfidenceAvg = highConfidenceTrades.reduce((sum, t) => sum + parseFloat(t.pnl || 0), 0) / highConfidenceTrades.length;
        const lowConfidenceAvg = lowConfidenceTrades.reduce((sum, t) => sum + parseFloat(t.pnl || 0), 0) / lowConfidenceTrades.length;
        
        if (highConfidenceAvg > lowConfidenceAvg) {
          insights.push({
            type: 'warning',
            icon: FiTarget,
            title: 'Confidence Correlation',
            message: `High confidence trades average $${highConfidenceAvg.toFixed(2)} vs $${lowConfidenceAvg.toFixed(2)} for low confidence`,
          });
        }
      }
    }

    // Rule compliance warning
    const complianceTrades = trades.filter(t => t.compliance);
    if (complianceTrades.length > 0) {
      const recentCompliance = complianceTrades.slice(-5);
      const avgCompliance = recentCompliance.reduce((sum, t) => {
        const score = Object.values(t.compliance.ruleCompliance).filter(Boolean).length;
        return sum + (score / 7);
      }, 0) / recentCompliance.length;

      if (avgCompliance < 0.7) {
        insights.push({
          type: 'warning',
          icon: FiAlertTriangle,
          title: 'Rule Compliance Alert',
          message: `Recent compliance score: ${(avgCompliance * 100).toFixed(1)}% - Focus on following your rules`,
        });
      }
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Trading Insights</h2>
      
      {insights.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Log more trades to see insights</p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${
              insight.type === 'success' ? 'bg-green-50 border-green-400' :
              insight.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
              'bg-blue-50 border-blue-400'
            }`}>
              <div className="flex items-start space-x-3">
                <SafeIcon 
                  icon={insight.icon} 
                  className={`h-5 w-5 mt-0.5 ${
                    insight.type === 'success' ? 'text-green-600' :
                    insight.type === 'warning' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`}
                />
                <div>
                  <h3 className="font-medium text-gray-900">{insight.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{insight.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {trades.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {trades.length}
              </div>
              <div className="text-xs text-gray-600">Total Trades</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {trades.filter(t => parseFloat(t.pnl) > 0).length}
              </div>
              <div className="text-xs text-gray-600">Winners</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingInsights;