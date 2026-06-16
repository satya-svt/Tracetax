import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search,
  ArrowLeft,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { StatCard } from '@/components/StatCard';

const PublicPortal: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, treasuryBalance } = useStore();
  const [searchTerm, setSearchTerm] = React.useState('');

  const totalInflow = transactions
    .filter((t) => t.type === 'mint')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutflow = transactions
    .filter((t) => t.type === 'allocate' && t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);

  const filteredTransactions = transactions.filter(
    (t) =>
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.to.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass-card rounded-none border-b border-border"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/auth')}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </motion.button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">Public Transparency Portal</h1>
                <p className="text-xs text-muted-foreground">The Glass Pipeline</p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Current Treasury"
            value={`₹${treasuryBalance.toLocaleString()}`}
            icon={Wallet}
            color="primary"
            delay={0}
          />
          <StatCard
            title="Total Collected"
            value={`₹${totalInflow.toLocaleString()}`}
            icon={TrendingUp}
            color="collector"
            delay={0.1}
          />
          <StatCard
            title="Total Allocated"
            value={`₹${totalOutflow.toLocaleString()}`}
            icon={ArrowUpRight}
            color="company"
            delay={0.2}
          />
          <StatCard
            title="Total Transactions"
            value={transactions.length}
            icon={FileText}
            color="primary"
            delay={0.3}
          />
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-12 pr-4 py-4 bg-card rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </motion.div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card overflow-hidden"
        >
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Public Ledger</h2>
            <p className="text-sm text-muted-foreground">
              All government financial transactions, transparent and immutable
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">From → To</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      {transactions.length === 0
                        ? 'No transactions recorded yet'
                        : 'No matching transactions found'}
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction, index) => {
                    const isIncome = transaction.type === 'mint';
                    return (
                      <motion.tr
                        key={transaction.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isIncome ? 'bg-collector/20' : 'bg-acb/20'
                            }`}
                          >
                            {isIncome ? (
                              <ArrowDownLeft className="w-4 h-4 text-collector" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4 text-acb" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-foreground">{transaction.description}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {transaction.from} → {transaction.to}
                        </td>
                        <td className={`px-6 py-4 text-right font-bold ${isIncome ? 'text-collector' : 'text-acb'}`}>
                          {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              transaction.status === 'approved'
                                ? 'bg-collector/20 text-collector'
                                : transaction.status === 'rejected'
                                ? 'bg-acb/20 text-acb'
                                : 'bg-company/20 text-company'
                            }`}
                          >
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                          {new Date(transaction.timestamp).toLocaleString()}
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PublicPortal;
