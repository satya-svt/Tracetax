import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Transaction } from '@/store/useStore';
import { cn } from '@/lib/utils';

interface TransactionListProps {
  transactions: Transaction[];
  showActions?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const statusIcons = {
  pending: Clock,
  approved: CheckCircle2,
  rejected: XCircle,
};

const statusColors = {
  pending: 'text-company',
  approved: 'text-collector',
  rejected: 'text-acb',
};

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  showActions = false,
  onApprove,
  onReject,
}) => {
  if (transactions.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-muted-foreground">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction, index) => {
        const StatusIcon = statusIcons[transaction.status];
        const isIncome = transaction.type === 'mint';

        return (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="transaction-row"
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  isIncome ? 'bg-collector/25' : 'bg-acb/25'
                )}
              >
                {isIncome ? (
                  <ArrowDownLeft className="w-5 h-5 text-collector" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-acb" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">
                  {transaction.from} → {transaction.to}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p
                  className={cn(
                    'font-bold',
                    isIncome ? 'text-collector' : 'text-acb'
                  )}
                >
                  {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(transaction.timestamp).toLocaleTimeString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <StatusIcon className={cn('w-5 h-5', statusColors[transaction.status])} />

                {showActions && transaction.status === 'pending' && (
                  <div className="flex gap-1 ml-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onApprove?.(transaction.id)}
                      className="p-1.5 rounded bg-collector/20 hover:bg-collector/30"
                    >
                      <CheckCircle2 className="w-4 h-4 text-collector" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onReject?.(transaction.id)}
                      className="p-1.5 rounded bg-acb/20 hover:bg-acb/30"
                    >
                      <XCircle className="w-4 h-4 text-acb" />
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
