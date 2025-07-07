import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TradeContext = createContext();

export const useTradeContext = () => {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error('useTradeContext must be used within a TradeProvider');
  }
  return context;
};

export const TradeProvider = ({ children }) => {
  const [trades, setTrades] = useState([]);
  const [goals, setGoals] = useState([]);
  const [accountBalance, setAccountBalance] = useState(10000);
  const [startingBalance] = useState(10000);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTrades = localStorage.getItem('forex-trades');
    const savedGoals = localStorage.getItem('forex-goals');
    const savedBalance = localStorage.getItem('forex-balance');

    if (savedTrades) {
      setTrades(JSON.parse(savedTrades));
    }
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
    if (savedBalance) {
      setAccountBalance(parseFloat(savedBalance));
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('forex-trades', JSON.stringify(trades));
  }, [trades]);

  useEffect(() => {
    localStorage.setItem('forex-goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('forex-balance', accountBalance.toString());
  }, [accountBalance]);

  const addTrade = (trade) => {
    const newTrade = {
      ...trade,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    };
    setTrades(prev => [...prev, newTrade]);
    
    // Update account balance
    const pnl = parseFloat(trade.pnl) || 0;
    setAccountBalance(prev => prev + pnl);
  };

  const updateTrade = (id, updatedTrade) => {
    setTrades(prev => prev.map(trade => 
      trade.id === id ? { ...trade, ...updatedTrade } : trade
    ));
  };

  const deleteTrade = (id) => {
    const trade = trades.find(t => t.id === id);
    if (trade) {
      const pnl = parseFloat(trade.pnl) || 0;
      setAccountBalance(prev => prev - pnl);
      setTrades(prev => prev.filter(t => t.id !== id));
    }
  };

  const addGoal = (goal) => {
    const newGoal = {
      ...goal,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id, updatedGoal) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, ...updatedGoal } : goal
    ));
  };

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  // Calculate performance metrics
  const getPerformanceMetrics = () => {
    if (trades.length === 0) {
      return {
        totalTrades: 0,
        winRate: 0,
        totalPnL: 0,
        averageWin: 0,
        averageLoss: 0,
        profitFactor: 0,
        currentBalance: accountBalance,
        drawdown: 0,
        bestTrade: 0,
        worstTrade: 0,
      };
    }

    const totalTrades = trades.length;
    const winningTrades = trades.filter(t => parseFloat(t.pnl) > 0);
    const losingTrades = trades.filter(t => parseFloat(t.pnl) < 0);
    
    const winRate = (winningTrades.length / totalTrades) * 100;
    const totalPnL = trades.reduce((sum, t) => sum + parseFloat(t.pnl || 0), 0);
    
    const averageWin = winningTrades.length > 0 
      ? winningTrades.reduce((sum, t) => sum + parseFloat(t.pnl), 0) / winningTrades.length
      : 0;
    
    const averageLoss = losingTrades.length > 0 
      ? Math.abs(losingTrades.reduce((sum, t) => sum + parseFloat(t.pnl), 0) / losingTrades.length)
      : 0;
    
    const grossProfit = winningTrades.reduce((sum, t) => sum + parseFloat(t.pnl), 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + parseFloat(t.pnl), 0));
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;
    
    const pnlValues = trades.map(t => parseFloat(t.pnl || 0));
    const bestTrade = Math.max(...pnlValues);
    const worstTrade = Math.min(...pnlValues);
    
    const peakBalance = Math.max(accountBalance, startingBalance);
    const drawdown = ((peakBalance - accountBalance) / peakBalance) * 100;

    return {
      totalTrades,
      winRate,
      totalPnL,
      averageWin,
      averageLoss,
      profitFactor,
      currentBalance: accountBalance,
      drawdown,
      bestTrade,
      worstTrade,
      grossProfit,
      grossLoss,
    };
  };

  const value = {
    trades,
    goals,
    accountBalance,
    startingBalance,
    addTrade,
    updateTrade,
    deleteTrade,
    addGoal,
    updateGoal,
    deleteGoal,
    getPerformanceMetrics,
  };

  return (
    <TradeContext.Provider value={value}>
      {children}
    </TradeContext.Provider>
  );
};