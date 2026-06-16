import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle2, Eye, FileSearch } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatCard } from '@/components/StatCard';
import { TransactionList } from '@/components/TransactionList';
import { useStore } from '@/store/useStore';

const ACBDashboard: React.FC = () => {
  const { transactions, treasuryBalance, approveTransaction, rejectTransaction } = useStore();

  const pendingTransactions = transactions.filter((t) => t.status === 'pending');
  const flaggedTransactions = transactions.filter((t) => t.amount > 10000000); // Flag large transactions
  const approvedCount = transactions.filter((t) => t.status === 'approved').length;
  const rejectedCount = transactions.filter((t) => t.status === 'rejected').length;

  return (
    <DashboardLayout title="ACB Command Center" role="acb" accentColor="acb">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Pending Review"
          value={pendingTransactions.length}
          icon={Eye}
          color="company"
          delay={0}
        />
        <StatCard
          title="Flagged (High Value)"
          value={flaggedTransactions.length}
          icon={AlertTriangle}
          color="acb"
          delay={0.1}
        />
        <StatCard
          title="Approved"
          value={approvedCount}
          icon={CheckCircle2}
          color="collector"
          delay={0.2}
        />
        <StatCard
          title="Treasury Total"
          value={`₹${treasuryBalance.toLocaleString()}`}
          icon={Shield}
          color="primary"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-company/20 flex items-center justify-center">
                <FileSearch className="w-5 h-5 text-company" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Pending Approvals</h2>
                <p className="text-sm text-muted-foreground">Review and approve fund allocations</p>
              </div>
            </div>
            <TransactionList
              transactions={pendingTransactions}
              showActions
              onApprove={approveTransaction}
              onReject={rejectTransaction}
            />
          </div>
        </motion.div>

        {/* Flagged Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-acb/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-acb" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">High-Value Alerts</h2>
                <p className="text-sm text-muted-foreground">Transactions over ₹1 Crore</p>
              </div>
            </div>
            <TransactionList transactions={flaggedTransactions.slice(0, 5)} />
          </div>
        </motion.div>
      </div>

      {/* Full Ledger */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6"
      >
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Complete Ledger</h2>
              <p className="text-sm text-muted-foreground">All transactions on the blockchain</p>
            </div>
          </div>
          <TransactionList transactions={transactions.slice(0, 20)} />
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default ACBDashboard;
