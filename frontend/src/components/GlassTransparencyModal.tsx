import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X, ExternalLink, CheckCircle2, Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

const formatDate = (date: Date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('default', { month: 'short' });
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${day} ${month}, ${time}`;
};

const truncateAddress = (address: string) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const formatAmount = (amount: number) => {
    if (amount >= 10000000) {
        return `₹ ${(amount / 10000000).toFixed(1)} Cr`;
    } else if (amount >= 100000) {
        return `₹ ${(amount / 100000).toFixed(1)} L`;
    }
    return `₹ ${amount.toLocaleString()}`;
};

const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
        mint: 'bg-collector/20 text-collector border-collector/30',
        allocate: 'bg-politician/20 text-politician border-politician/30',
        approve: 'bg-primary/20 text-primary border-primary/30',
        'assign-id': 'bg-admin/20 text-admin border-admin/30',
        'revoke-id': 'bg-acb/20 text-acb border-acb/30',
        bid: 'bg-company/20 text-company border-company/30',
    };
    return styles[type] || 'bg-secondary text-foreground border-white/10';
};

export const GlassTransparencyModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { transactions } = useStore();

    // Generate mock tx hashes for display
    const generateTxHash = () => {
        const chars = '0123456789abcdef';
        let hash = '0x';
        for (let i = 0; i < 64; i++) {
            hash += chars[Math.floor(Math.random() * chars.length)];
        }
        return hash;
    };

    return (
        <>
            {/* Floating Trigger Button */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, type: 'spring' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center backdrop-blur-sm border border-primary/50"
                style={{
                    boxShadow: '0 0 30px rgba(139, 92, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.2)',
                }}
            >
                <Eye className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </motion.button>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-4 md:inset-10 lg:inset-20 z-50 glass-card overflow-hidden flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                                        <Eye className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground">Glass Pipeline Transparency</h2>
                                        <p className="text-sm text-muted-foreground">Real-time on-chain activity • Polygon Amoy</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-5 h-5 text-muted-foreground" />
                                </button>
                            </div>

                            {/* Table */}
                            <div className="flex-1 overflow-auto p-6">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time</th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">From</th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">To</th>
                                            <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                                            <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                                            <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tx Hash</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="text-center py-12 text-muted-foreground">
                                                    No transactions yet. The pipeline is waiting...
                                                </td>
                                            </tr>
                                        ) : (
                                            transactions.map((tx, index) => {
                                                const txHash = generateTxHash();
                                                return (
                                                    <motion.tr
                                                        key={tx.id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                                    >
                                                        <td className="py-4 px-4 text-sm text-muted-foreground font-mono">
                                                            {formatDate(tx.timestamp)}
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className={cn(
                                                                'px-2 py-1 rounded-full text-xs font-medium border uppercase',
                                                                getTypeBadge(tx.type)
                                                            )}>
                                                                {tx.type.replace('-', ' ')}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center gap-2">
                                                                <ArrowUpRight className="w-4 h-4 text-acb" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-foreground">{tx.from}</p>
                                                                    <p className="text-xs text-muted-foreground font-mono">
                                                                        {truncateAddress('0x8a7d3f' + tx.id.slice(0, 8))}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center gap-2">
                                                                <ArrowDownLeft className="w-4 h-4 text-collector" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-foreground">{tx.to}</p>
                                                                    <p className="text-xs text-muted-foreground font-mono">
                                                                        {truncateAddress('0x42f9b1' + tx.id.slice(-8))}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4 text-right">
                                                            <span className="text-sm font-bold text-foreground">
                                                                {tx.amount > 0 ? formatAmount(tx.amount) : '—'}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4 text-center">
                                                            {tx.status === 'approved' ? (
                                                                <span className="inline-flex items-center gap-1 text-collector text-xs">
                                                                    <CheckCircle2 className="w-4 h-4" />
                                                                    Verified
                                                                </span>
                                                            ) : tx.status === 'pending' ? (
                                                                <span className="inline-flex items-center gap-1 text-company text-xs">
                                                                    <Clock className="w-4 h-4" />
                                                                    Pending
                                                                </span>
                                                            ) : (
                                                                <span className="text-acb text-xs">Rejected</span>
                                                            )}
                                                        </td>
                                                        <td className="py-4 px-4 text-right">
                                                            <a
                                                                href={`https://amoy.polygonscan.com/tx/${txHash}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-mono"
                                                            >
                                                                {truncateAddress(txHash)}
                                                                <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground">
                                <span>Showing {transactions.length} transactions</span>
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    Live on Polygon Amoy
                                </span>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default GlassTransparencyModal;
