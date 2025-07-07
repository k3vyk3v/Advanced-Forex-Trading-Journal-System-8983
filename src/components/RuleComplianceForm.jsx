import React, { useState } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCheck, FiX } = FiIcons;

const RuleComplianceForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    ruleCompliance: {
      followedEntryCriteria: false,
      properPositionSize: false,
      setStopLoss: false,
      didNotMoveStop: false,
      tookProfitAtPlan: false,
      avoidedNewsTrading: false,
      waitedForSetup: false,
    },
    mistakes: {
      movedStopAgainst: false,
      tookProfitEarly: false,
      chasedMarket: false,
      overRisked: false,
      ignoredNews: false,
      tradedWithoutSetup: false,
      revengeTraded: false,
      overtradedBoredom: false,
    },
    executionQuality: {
      entryExecution: 'Good',
      exitExecution: 'Good',
      overallExecution: 'Good',
    },
    deviationReason: '',
    improvementNotes: '',
  });

  const handleRuleChange = (category, rule) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [rule]: !prev[category][rule]
      }
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [category, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const calculateComplianceScore = () => {
    const rules = Object.values(formData.ruleCompliance);
    const followedRules = rules.filter(rule => rule).length;
    return Math.round((followedRules / rules.length) * 100);
  };

  const calculateMistakeCount = () => {
    return Object.values(formData.mistakes).filter(mistake => mistake).length;
  };

  const ruleLabels = {
    followedEntryCriteria: 'Followed entry criteria exactly',
    properPositionSize: 'Used proper position size (1-2% risk)',
    setStopLoss: 'Set stop loss before entry',
    didNotMoveStop: 'Did not move stop loss against me',
    tookProfitAtPlan: 'Took profit at planned level',
    avoidedNewsTrading: 'Avoided trading during major news',
    waitedForSetup: 'Waited for high-quality setup',
  };

  const mistakeLabels = {
    movedStopAgainst: 'Moved stop loss against me',
    tookProfitEarly: 'Took profit too early due to fear',
    chasedMarket: 'Chased the market (FOMO)',
    overRisked: 'Over-risked position size',
    ignoredNews: 'Ignored pending news events',
    tradedWithoutSetup: 'Traded without proper setup',
    revengeTraded: 'Revenge traded after loss',
    overtradedBoredom: 'Entered due to boredom/overtrading',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Rule Compliance & Execution</h2>
      
      {/* Rule Compliance Checklist */}
      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Trading Rules Adherence</h3>
        <div className="space-y-3">
          {Object.entries(ruleLabels).map(([key, label]) => (
            <label key={key} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.ruleCompliance[key]}
                onChange={() => handleRuleChange('ruleCompliance', key)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500 w-5 h-5"
              />
              <span className="text-sm text-gray-700">{label}</span>
              {formData.ruleCompliance[key] && (
                <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-600" />
              )}
            </label>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-white rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Rule Compliance Score</span>
            <span className={`text-lg font-bold ${
              calculateComplianceScore() >= 80 ? 'text-green-600' :
              calculateComplianceScore() >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {calculateComplianceScore()}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full ${
                calculateComplianceScore() >= 80 ? 'bg-green-600' :
                calculateComplianceScore() >= 60 ? 'bg-yellow-600' : 'bg-red-600'
              }`}
              style={{ width: `${calculateComplianceScore()}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mistake Tracking */}
      <div className="bg-red-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Common Trading Errors</h3>
        <div className="space-y-3">
          {Object.entries(mistakeLabels).map(([key, label]) => (
            <label key={key} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.mistakes[key]}
                onChange={() => handleRuleChange('mistakes', key)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-5 h-5"
              />
              <span className="text-sm text-gray-700">{label}</span>
              {formData.mistakes[key] && (
                <SafeIcon icon={FiX} className="h-4 w-4 text-red-600" />
              )}
            </label>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-white rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Mistakes Made</span>
            <span className={`text-lg font-bold ${
              calculateMistakeCount() === 0 ? 'text-green-600' :
              calculateMistakeCount() <= 2 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {calculateMistakeCount()}
            </span>
          </div>
        </div>
      </div>

      {/* Execution Quality */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Entry Execution</label>
          <select
            name="executionQuality.entryExecution"
            value={formData.executionQuality.entryExecution}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Perfect">Perfect (Exact planned price)</option>
            <option value="Good">Good (Within 2 pips)</option>
            <option value="Fair">Fair (Within 5 pips)</option>
            <option value="Poor">Poor (Significant slippage)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Exit Execution</label>
          <select
            name="executionQuality.exitExecution"
            value={formData.executionQuality.exitExecution}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Perfect">Perfect (Exact planned price)</option>
            <option value="Good">Good (Within 2 pips)</option>
            <option value="Fair">Fair (Within 5 pips)</option>
            <option value="Poor">Poor (Significant slippage)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Overall Execution</label>
          <select
            name="executionQuality.overallExecution"
            value={formData.executionQuality.overallExecution}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Perfect">Perfect (Flawless execution)</option>
            <option value="Good">Good (Minor deviations)</option>
            <option value="Fair">Fair (Some issues)</option>
            <option value="Poor">Poor (Major problems)</option>
          </select>
        </div>
      </div>

      {/* Deviation Explanation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Deviation Reason
        </label>
        <textarea
          name="deviationReason"
          value={formData.deviationReason}
          onChange={handleChange}
          rows="3"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Explain any deviations from your trading plan..."
        />
      </div>

      {/* Improvement Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Areas for Improvement
        </label>
        <textarea
          name="improvementNotes"
          value={formData.improvementNotes}
          onChange={handleChange}
          rows="3"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="What specific areas need improvement for future trades?"
        />
      </div>

      {/* Performance Summary */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Trade Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              calculateComplianceScore() >= 80 ? 'text-green-600' :
              calculateComplianceScore() >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {calculateComplianceScore()}%
            </div>
            <div className="text-sm text-gray-600">Rule Compliance</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              calculateMistakeCount() === 0 ? 'text-green-600' :
              calculateMistakeCount() <= 2 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {calculateMistakeCount()}
            </div>
            <div className="text-sm text-gray-600">Mistakes Made</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              formData.executionQuality.overallExecution === 'Perfect' ? 'text-green-600' :
              formData.executionQuality.overallExecution === 'Good' ? 'text-blue-600' :
              formData.executionQuality.overallExecution === 'Fair' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {formData.executionQuality.overallExecution}
            </div>
            <div className="text-sm text-gray-600">Execution Quality</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          <SafeIcon icon={FiCheck} className="h-4 w-4" />
          <span>Complete Trade Log</span>
        </button>
      </div>
    </form>
  );
};

export default RuleComplianceForm;