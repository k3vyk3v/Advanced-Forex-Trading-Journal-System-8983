import React from 'react';
import { useTradeContext } from '../contexts/TradeContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { format } from 'date-fns';

const { FiTrendingUp, FiTrendingDown, FiClock, FiDollarSign } = FiIcons;

const RecentTrades = () => {
  const { trades } = useTradeContext();
  
  // Get last 5 trades
  const recentTrades = trades.slice(-5).reverse();

  if (recentTrades.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Trades</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No trades logged yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Trades</h2>
      
      <div className="space-y-4">
        {recentTrades.map((trade) => (
          <div key={trade.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  parseFloat(trade.pnl) >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <SafeIcon 
                    icon={parseFloat(trade.pnl) >= 0 ? FiTrendingUp : FiTrendingDown}
                    className={`h-4 w-4 ${
                      parseFloat(trade.pnl) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  />
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{trade.currencyPair}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      trade.direction === 'Long' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {trade.direction}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiClock} className="h-3 w-3" />
                      <span>{format(new Date(trade.date), 'MMM dd, yyyy')}</span>
                    </div>
                    <span>{trade.session}</span>
                    <span>{trade.strategy}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  parseFloat(trade.pnl) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {parseFloat(trade.pnl) >= 0 ? '+' : ''}${parseFloat(trade.pnl).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">
                  {parseFloat(trade.pipMovement) >= 0 ? '+' : ''}{parseFloat(trade.pipMovement).toFixed(1)} pips
                </div>
              </div>
            </div>
            
            {/* Trade Quality Indicators */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">Setup:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-xs ${
                        i < (trade.setupRating || 3) ? 'text-yellow-400' : 'text-gray-300'
                      }`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                
                {trade.psychology && (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">Confidence:</span>
                    <span className="text-xs font-medium">{trade.psychology.confidenceLevel}/10</span>
                  </div>
                )}
              </div>
              
              {trade.compliance && (
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">Rules:</span>
                  <span className={`text-xs font-medium ${
                    Object.values(trade.compliance.ruleCompliance).filter(Boolean).length >= 5
                      ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {Object.values(trade.compliance.ruleCompliance).filter(Boolean).length}/7
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTrades;