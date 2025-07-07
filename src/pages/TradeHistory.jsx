import React, { useState } from 'react';
import { useTradeContext } from '../contexts/TradeContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { format } from 'date-fns';

const { FiSearch, FiFilter, FiTrendingUp, FiTrendingDown, FiEdit, FiTrash2 } = FiIcons;

const TradeHistory = () => {
  const { trades, deleteTrade } = useTradeContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filteredTrades = trades
    .filter(trade => {
      const matchesSearch = trade.currencyPair.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           trade.strategy.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'winners' && parseFloat(trade.pnl) > 0) ||
                           (filterBy === 'losers' && parseFloat(trade.pnl) < 0);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'pnl':
          return parseFloat(b.pnl) - parseFloat(a.pnl);
        case 'pair':
          return a.currencyPair.localeCompare(b.currencyPair);
        default:
          return 0;
      }
    });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      deleteTrade(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Trade History</h1>
        <div className="text-sm text-gray-600">
          {filteredTrades.length} of {trades.length} trades
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search currency pairs or strategies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Trades</option>
            <option value="winners">Winners Only</option>
            <option value="losers">Losers Only</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="pnl">Sort by P&L</option>
            <option value="pair">Sort by Pair</option>
          </select>
        </div>
      </div>

      {/* Trade List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredTrades.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No trades found matching your criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pair & Direction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entry/Exit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    P&L & Pips
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Strategy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quality
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTrades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(trade.date), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-sm text-gray-500">{trade.time}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <SafeIcon 
                          icon={trade.direction === 'Long' ? FiTrendingUp : FiTrendingDown}
                          className={`h-4 w-4 mr-2 ${
                            trade.direction === 'Long' ? 'text-green-600' : 'text-red-600'
                          }`}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{trade.currencyPair}</div>
                          <div className="text-sm text-gray-500">{trade.direction}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{trade.entryPrice}</div>
                      <div className="text-sm text-gray-500">{trade.exitPrice}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        parseFloat(trade.pnl) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {parseFloat(trade.pnl) >= 0 ? '+' : ''}${parseFloat(trade.pnl).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {parseFloat(trade.pipMovement) >= 0 ? '+' : ''}{parseFloat(trade.pipMovement).toFixed(1)} pips
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{trade.strategy}</div>
                      <div className="text-sm text-gray-500">{trade.session}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm ${
                              i < (trade.setupRating || 3) ? 'text-yellow-400' : 'text-gray-300'
                            }`}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      {trade.compliance && (
                        <div className="text-xs text-gray-500 mt-1">
                          Rules: {Object.values(trade.compliance.ruleCompliance).filter(Boolean).length}/7
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDelete(trade.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeHistory;