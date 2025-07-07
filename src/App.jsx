import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import TradeEntry from './pages/TradeEntry';
import TradeHistory from './pages/TradeHistory';
import Analytics from './pages/Analytics';
import Psychology from './pages/Psychology';
import Goals from './pages/Goals';
import { TradeProvider } from './contexts/TradeContext';
import './App.css';

function App() {
  return (
    <TradeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/trade-entry" element={<TradeEntry />} />
              <Route path="/trade-history" element={<TradeHistory />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/psychology" element={<Psychology />} />
              <Route path="/goals" element={<Goals />} />
            </Routes>
          </motion.main>
        </div>
      </Router>
    </TradeProvider>
  );
}

export default App;