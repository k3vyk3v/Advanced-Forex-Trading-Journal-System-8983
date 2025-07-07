import React, { useState } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiArrowRight } = FiIcons;

const PsychologyForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    confidenceLevel: 5,
    stressLevel: 5,
    sleepQuality: 'Good',
    marketMood: 'Calm',
    lifeStressLevel: 5,
    preTradeNotes: '',
    postTradeEmotions: '',
    lessonsLearned: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getScaleColor = (value) => {
    if (value <= 3) return 'text-red-600';
    if (value <= 7) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Psychology & Emotional State</h2>
      
      {/* Emotional State Scales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confidence Level
          </label>
          <input
            type="range"
            min="1"
            max="10"
            name="confidenceLevel"
            value={formData.confidenceLevel}
            onChange={handleChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
          <p className={`text-center mt-2 font-medium text-lg ${getScaleColor(formData.confidenceLevel)}`}>
            {formData.confidenceLevel}/10
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stress Level
          </label>
          <input
            type="range"
            min="1"
            max="10"
            name="stressLevel"
            value={formData.stressLevel}
            onChange={handleChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>Relaxed</span>
            <span>Stressed</span>
          </div>
          <p className={`text-center mt-2 font-medium text-lg ${getScaleColor(11 - formData.stressLevel)}`}>
            {formData.stressLevel}/10
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Life Stress Level
          </label>
          <input
            type="range"
            min="1"
            max="10"
            name="lifeStressLevel"
            value={formData.lifeStressLevel}
            onChange={handleChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>Peaceful</span>
            <span>Overwhelming</span>
          </div>
          <p className={`text-center mt-2 font-medium text-lg ${getScaleColor(11 - formData.lifeStressLevel)}`}>
            {formData.lifeStressLevel}/10
          </p>
        </div>
      </div>

      {/* Categorical Assessments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Quality</label>
          <select
            name="sleepQuality"
            value={formData.sleepQuality}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Excellent">Excellent (8+ hours, deep sleep)</option>
            <option value="Good">Good (6-8 hours, restful)</option>
            <option value="Fair">Fair (5-6 hours, some tiredness)</option>
            <option value="Poor">Poor (&lt; 5 hours, very tired)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Market Mood</label>
          <select
            name="marketMood"
            value={formData.marketMood}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Excited">Excited (High energy, eager to trade)</option>
            <option value="Calm">Calm (Balanced, focused)</option>
            <option value="Fearful">Fearful (Anxious, hesitant)</option>
            <option value="Greedy">Greedy (Overconfident, risk-seeking)</option>
            <option value="Frustrated">Frustrated (Impatient, angry)</option>
            <option value="Bored">Bored (Disinterested, looking for action)</option>
          </select>
        </div>
      </div>

      {/* Psychological Insights */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pre-Trade Mental State
          </label>
          <textarea
            name="preTradeNotes"
            value={formData.preTradeNotes}
            onChange={handleChange}
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="How were you feeling before this trade? What was your mindset?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Post-Trade Emotions
          </label>
          <textarea
            name="postTradeEmotions"
            value={formData.postTradeEmotions}
            onChange={handleChange}
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="How did you feel during and after the trade? Any emotional reactions?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Key Lessons Learned
          </label>
          <textarea
            name="lessonsLearned"
            value={formData.lessonsLearned}
            onChange={handleChange}
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="What did you learn from this trade? Any insights for future trades?"
          />
        </div>
      </div>

      {/* Psychological Health Indicators */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Psychological Health Check</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Overall Readiness</span>
              <span className={`text-sm font-medium ${
                (formData.confidenceLevel >= 6 && formData.stressLevel <= 6 && formData.lifeStressLevel <= 6)
                  ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {(formData.confidenceLevel >= 6 && formData.stressLevel <= 6 && formData.lifeStressLevel <= 6)
                  ? 'Ready' : 'Caution'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Sleep Impact</span>
              <span className={`text-sm font-medium ${
                formData.sleepQuality === 'Excellent' || formData.sleepQuality === 'Good'
                  ? 'text-green-600' : 'text-red-600'
              }`}>
                {formData.sleepQuality === 'Excellent' || formData.sleepQuality === 'Good'
                  ? 'Positive' : 'Negative'}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Emotional State</span>
              <span className={`text-sm font-medium ${
                formData.marketMood === 'Calm' ? 'text-green-600' : 
                formData.marketMood === 'Excited' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {formData.marketMood === 'Calm' ? 'Optimal' : 
                 formData.marketMood === 'Excited' ? 'Caution' : 'Risk'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Risk Level</span>
              <span className={`text-sm font-medium ${
                (formData.stressLevel <= 4 && formData.lifeStressLevel <= 4) ? 'text-green-600' :
                (formData.stressLevel <= 7 && formData.lifeStressLevel <= 7) ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {(formData.stressLevel <= 4 && formData.lifeStressLevel <= 4) ? 'Low' :
                 (formData.stressLevel <= 7 && formData.lifeStressLevel <= 7) ? 'Medium' : 'High'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span>Next: Rule Compliance</span>
          <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
};

export default PsychologyForm;