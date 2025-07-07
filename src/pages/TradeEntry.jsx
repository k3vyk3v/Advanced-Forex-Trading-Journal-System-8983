import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTradeContext } from '../contexts/TradeContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import TradeForm from '../components/TradeForm';
import PsychologyForm from '../components/PsychologyForm';
import RuleComplianceForm from '../components/RuleComplianceForm';

const { FiPlus, FiCheck, FiBrain, FiList } = FiIcons;

const TradeEntry = () => {
  const { addTrade } = useTradeContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [tradeData, setTradeData] = useState({});
  const [psychologyData, setPsychologyData] = useState({});
  const [complianceData, setComplianceData] = useState({});

  const steps = [
    { id: 1, title: 'Trade Details', icon: FiPlus },
    { id: 2, title: 'Psychology', icon: FiBrain },
    { id: 3, title: 'Rule Compliance', icon: FiList },
  ];

  const handleTradeSubmit = (data) => {
    setTradeData(data);
    setCurrentStep(2);
  };

  const handlePsychologySubmit = (data) => {
    setPsychologyData(data);
    setCurrentStep(3);
  };

  const handleComplianceSubmit = (data) => {
    setComplianceData(data);
    
    // Combine all data and submit
    const completeTrade = {
      ...tradeData,
      psychology: psychologyData,
      compliance: complianceData,
    };
    
    addTrade(completeTrade);
    
    // Reset form
    setCurrentStep(1);
    setTradeData({});
    setPsychologyData({});
    setComplianceData({});
    
    alert('Trade logged successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Log New Trade</h1>
        <p className="text-gray-600">Complete all sections for comprehensive trade analysis</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                currentStep >= step.id
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}>
                {currentStep > step.id ? (
                  <SafeIcon icon={FiCheck} className="h-6 w-6" />
                ) : (
                  <SafeIcon icon={step.icon} className="h-6 w-6" />
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  Step {step.id}
                </p>
                <p className={`text-xs ${
                  currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${
                currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        {currentStep === 1 && (
          <TradeForm onSubmit={handleTradeSubmit} />
        )}
        {currentStep === 2 && (
          <PsychologyForm onSubmit={handlePsychologySubmit} />
        )}
        {currentStep === 3 && (
          <RuleComplianceForm onSubmit={handleComplianceSubmit} />
        )}
      </motion.div>
    </div>
  );
};

export default TradeEntry;