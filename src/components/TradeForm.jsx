import React, { useState } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiArrowRight } = FiIcons;

const TradeForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    currencyPair: '',
    direction: 'Long',
    entryPrice: '',
    exitPrice: '',
    positionSize: '',
    pipMovement: '',
    pnl: '',
    duration: '',
    session: 'London',
    strategy: 'Trend Following',
    timeframe: '1H',
    marketCondition: 'Trending',
    setupRating: 3,
    confluenceFactors: [],
    plannedEntry: '',
    plannedStop: '',
    plannedTarget: '',
    plannedRisk: '',
    actualStop: '',
    setupReason: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConfluenceChange = (factor) => {
    setFormData(prev => ({
      ...prev,
      confluenceFactors: prev.confluenceFactors.includes(factor)
        ? prev.confluenceFactors.filter(f => f !== factor)
        : [...prev.confluenceFactors, factor]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const confluenceOptions = [
    'Support/Resistance level',
    'Moving average confluence',
    'Trend line intersection',
    'Fibonacci level',
    'Chart pattern',
    'Divergence signal',
    'Volume confirmation'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Trade Details</h2>
      
      {/* Basic Trade Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency Pair</label>
          <select
            name="currencyPair"
            value={formData.currencyPair}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Pair</option>
            <option value="EUR/USD">EUR/USD</option>
            <option value="GBP/USD">GBP/USD</option>
            <option value="USD/JPY">USD/JPY</option>
            <option value="AUD/USD">AUD/USD</option>
            <option value="USD/CAD">USD/CAD</option>
            <option value="USD/CHF">USD/CHF</option>
            <option value="NZD/USD">NZD/USD</option>
            <option value="EUR/GBP">EUR/GBP</option>
            <option value="EUR/JPY">EUR/JPY</option>
            <option value="GBP/JPY">GBP/JPY</option>
          </select>
        </div>
      </div>

      {/* Trade Execution */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Direction</label>
          <select
            name="direction"
            value={formData.direction}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Long">Long</option>
            <option value="Short">Short</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Entry Price</label>
          <input
            type="number"
            step="0.00001"
            name="entryPrice"
            value={formData.entryPrice}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Exit Price</label>
          <input
            type="number"
            step="0.00001"
            name="exitPrice"
            value={formData.exitPrice}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Position Size (lots)</label>
          <input
            type="number"
            step="0.01"
            name="positionSize"
            value={formData.positionSize}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      {/* Trade Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pip Movement</label>
          <input
            type="number"
            step="0.1"
            name="pipMovement"
            value={formData.pipMovement}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">P&L ($)</label>
          <input
            type="number"
            step="0.01"
            name="pnl"
            value={formData.pnl}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      {/* Market Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Trading Session</label>
          <select
            name="session"
            value={formData.session}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="London">London</option>
            <option value="New York">New York</option>
            <option value="Asian">Asian</option>
            <option value="Sydney">Sydney</option>
            <option value="London/NY Overlap">London/NY Overlap</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Strategy</label>
          <select
            name="strategy"
            value={formData.strategy}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Trend Following">Trend Following</option>
            <option value="Support/Resistance">Support/Resistance</option>
            <option value="Breakout">Breakout</option>
            <option value="Reversal">Reversal</option>
            <option value="News Trading">News Trading</option>
            <option value="Scalping">Scalping</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
          <select
            name="timeframe"
            value={formData.timeframe}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="15m">15 minutes</option>
            <option value="1H">1 hour</option>
            <option value="4H">4 hours</option>
            <option value="Daily">Daily</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Market Condition</label>
          <select
            name="marketCondition"
            value={formData.marketCondition}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Trending">Trending</option>
            <option value="Ranging">Ranging</option>
            <option value="Volatile">Volatile</option>
            <option value="Quiet">Quiet</option>
          </select>
        </div>
      </div>

      {/* Setup Quality */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Setup Rating (1-5)</label>
          <input
            type="range"
            min="1"
            max="5"
            name="setupRating"
            value={formData.setupRating}
            onChange={handleChange}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>Poor</span>
            <span>Average</span>
            <span>Excellent</span>
          </div>
          <p className="text-center mt-2 font-medium">Rating: {formData.setupRating}/5</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confluence Factors</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {confluenceOptions.map((factor) => (
              <label key={factor} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.confluenceFactors.includes(factor)}
                  onChange={() => handleConfluenceChange(factor)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{factor}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Trade Plan */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Trade Plan vs Execution</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Planned Entry</label>
            <input
              type="number"
              step="0.00001"
              name="plannedEntry"
              value={formData.plannedEntry}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Planned Stop</label>
            <input
              type="number"
              step="0.00001"
              name="plannedStop"
              value={formData.plannedStop}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Planned Target</label>
            <input
              type="number"
              step="0.00001"
              name="plannedTarget"
              value={formData.plannedTarget}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Planned Risk (%)</label>
            <input
              type="number"
              step="0.1"
              name="plannedRisk"
              value={formData.plannedRisk}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Setup Reason */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Setup Reason</label>
        <textarea
          name="setupReason"
          value={formData.setupReason}
          onChange={handleChange}
          rows="3"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe why you took this trade..."
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span>Next: Psychology</span>
          <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
};

export default TradeForm;