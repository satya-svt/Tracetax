import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, FileText, Plus } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatCard } from '@/components/StatCard';
import { TransactionList } from '@/components/TransactionList';
import { RippleButton } from '@/components/ui/RippleButton';
import { useStore } from '@/store/useStore';

const CollectorDashboard: React.FC = () => {
  const { treasuryBalance, transactions, addFunds } = useStore();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const collectorTransactions = transactions.filter((t) => t.role === 'collector');
  const todayTotal = collectorTransactions
    .filter((t) => new Date(t.timestamp).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + t.amount, 0);

  const handleMintFunds = () => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0 && description.trim()) {
      addFunds(numAmount, description.trim());
      setAmount('');
      setDescription('');
    }
  };

  return (
    <DashboardLayout title="The Mint" role="collector" accentColor="collector">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Treasury Balance"
          value={`₹${treasuryBalance.toLocaleString()}`}
          icon={Wallet}
          color="collector"
          delay={0}
        />
        <StatCard
          title="Today's Collection"
          value={`₹${todayTotal.toLocaleString()}`}
          icon={TrendingUp}
          color="collector"
          change="Real-time tracking"
          delay={0.1}
        />
        <StatCard
          title="Total Transactions"
          value={collectorTransactions.length}
          icon={FileText}
          color="collector"
          delay={0.2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mint Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-collector/20 flex items-center justify-center">
                <Plus className="w-5 h-5 text-collector" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Mint Funds</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-collector/50"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., GST Collection Q4"
                  className="w-full px-4 py-3 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-collector/50"
                />
              </div>

              <RippleButton
                variant="collector"
                size="md"
                onClick={handleMintFunds}
                disabled={!amount || !description.trim()}
                className="w-full"
              >
                Add to Treasury
              </RippleButton>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">Quick Add</p>
              <div className="flex flex-wrap gap-2">
                {['1,00,000', '10,00,000', '1,00,00,000'].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(val.replace(/,/g, ''))}
                    className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ₹{val}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Recent Collections</h2>
            <TransactionList transactions={collectorTransactions.slice(0, 10)} />
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default CollectorDashboard;
