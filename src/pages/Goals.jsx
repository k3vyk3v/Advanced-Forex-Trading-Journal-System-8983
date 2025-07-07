import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTradeContext } from '../contexts/TradeContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTarget, FiPlus, FiCheck, FiX, FiEdit, FiTrash2, FiTrendingUp, FiClock } = FiIcons;

const Goals = () => {
  const { goals, addGoal, updateGoal, deleteGoal, trades, getPerformanceMetrics } = useTradeContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetValue: '',
    currentValue: '',
    unit: 'percentage',
    category: 'performance',
    deadline: '',
    priority: 'medium',
  });

  const metrics = getPerformanceMetrics();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingGoal) {
      updateGoal(editingGoal.id, formData);
      setEditingGoal(null);
    } else {
      addGoal(formData);
    }
    setFormData({
      title: '',
      description: '',
      targetValue: '',
      currentValue: '',
      unit: 'percentage',
      category: 'performance',
      deadline: '',
      priority: 'medium',
    });
    setShowAddForm(false);
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData(goal);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(id);
    }
  };

  const calculateProgress = (goal) => {
    let current = parseFloat(goal.currentValue || 0);
    let target = parseFloat(goal.targetValue || 1);
    
    // Auto-calculate current value based on goal type
    if (goal.title.toLowerCase().includes('win rate')) {
      current = metrics.winRate;
    } else if (goal.title.toLowerCase().includes('profit factor')) {
      current = metrics.profitFactor;
    } else if (goal.title.toLowerCase().includes('trades')) {
      current = metrics.totalTrades;
    } else if (goal.title.toLowerCase().includes('drawdown')) {
      current = metrics.drawdown;
    }
    
    return Math.min((current / target) * 100, 100);
  };

  const getGoalStatus = (goal) => {
    const progress = calculateProgress(goal);
    const deadline = new Date(goal.deadline);
    const now = new Date();
    const isOverdue = deadline < now;
    
    if (progress >= 100) return 'completed';
    if (isOverdue) return 'overdue';
    if (progress >= 75) return 'ontrack';
    if (progress >= 50) return 'progress';
    return 'behind';
  };

  const statusColors = {
    completed: 'bg-green-100 text-green-800 border-green-200',
    ontrack: 'bg-blue-100 text-blue-800 border-blue-200',
    progress: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    behind: 'bg-orange-100 text-orange-800 border-orange-200',
    overdue: 'bg-red-100 text-red-800 border-red-200',
  };

  const statusLabels = {
    completed: 'Completed',
    ontrack: 'On Track',
    progress: 'In Progress',
    behind: 'Behind',
    overdue: 'Overdue',
  };

  // Pre-defined goal templates
  const goalTemplates = [
    { title: 'Achieve 70% Win Rate', targetValue: '70', unit: 'percentage', category: 'performance' },
    { title: 'Maintain 2.0 Profit Factor', targetValue: '2.0', unit: 'ratio', category: 'performance' },
    { title: 'Complete 100 Trades', targetValue: '100', unit: 'number', category: 'volume' },
    { title: 'Keep Drawdown Under 10%', targetValue: '10', unit: 'percentage', category: 'risk' },
    { title: 'Study 20 Hours This Month', targetValue: '20', unit: 'hours', category: 'education' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Trading Goals</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Goals</p>
              <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
            </div>
            <SafeIcon icon={FiTarget} className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {goals.filter(g => getGoalStatus(g) === 'completed').length}
              </p>
            </div>
            <SafeIcon icon={FiCheck} className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Track</p>
              <p className="text-2xl font-bold text-blue-600">
                {goals.filter(g => getGoalStatus(g) === 'ontrack').length}
              </p>
            </div>
            <SafeIcon icon={FiTrendingUp} className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">
                {goals.filter(g => getGoalStatus(g) === 'overdue').length}
              </p>
            </div>
            <SafeIcon icon={FiClock} className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Add/Edit Goal Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingGoal ? 'Edit Goal' : 'Add New Goal'}
          </h2>
          
          {/* Goal Templates */}
          {!editingGoal && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Templates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {goalTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => setFormData(prev => ({ ...prev, ...template }))}
                    className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{template.title}</div>
                    <div className="text-sm text-gray-600">{template.category}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="performance">Performance</option>
                  <option value="risk">Risk Management</option>
                  <option value="volume">Trading Volume</option>
                  <option value="education">Education</option>
                  <option value="psychology">Psychology</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your goal and why it's important..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Value</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.targetValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetValue: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="number">Number</option>
                  <option value="ratio">Ratio</option>
                  <option value="hours">Hours</option>
                  <option value="dollars">Dollars ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingGoal(null);
                  setFormData({
                    title: '',
                    description: '',
                    targetValue: '',
                    currentValue: '',
                    unit: 'percentage',
                    category: 'performance',
                    deadline: '',
                    priority: 'medium',
                  });
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingGoal ? 'Update Goal' : 'Add Goal'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <SafeIcon icon={FiTarget} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Goals Set</h2>
            <p className="text-gray-600 mb-4">Set your first trading goal to start tracking your progress.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Goal
            </button>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = calculateProgress(goal);
            const status = getGoalStatus(goal);
            const deadline = new Date(goal.deadline);
            const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full border ${statusColors[status]}`}>
                        {statusLabels[status]}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                        goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {goal.priority} priority
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{goal.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>Target: {goal.targetValue}{goal.unit === 'percentage' ? '%' : goal.unit === 'dollars' ? '$' : ''}</span>
                      <span>Category: {goal.category}</span>
                      <span className={daysLeft > 0 ? 'text-gray-600' : 'text-red-600'}>
                        {daysLeft > 0 ? `${daysLeft} days left` : `${Math.abs(daysLeft)} days overdue`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <SafeIcon icon={FiEdit} className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        status === 'completed' ? 'bg-green-500' :
                        status === 'ontrack' ? 'bg-blue-500' :
                        status === 'progress' ? 'bg-yellow-500' :
                        status === 'behind' ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Goals;