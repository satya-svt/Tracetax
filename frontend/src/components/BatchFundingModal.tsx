import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, IndianRupee, AlertTriangle, Send, Building2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Company } from '@/data/mockCompanies';
import { RippleButton } from '@/components/ui/RippleButton';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface BatchFundingModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCompanies: Company[];
}

export const BatchFundingModal: React.FC<BatchFundingModalProps> = ({
    isOpen,
    onClose,
    selectedCompanies,
}) => {
    const { treasuryBalance, addTransaction } = useStore();
    const [amounts, setAmounts] = useState<Record<string, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalAmount = Object.values(amounts).reduce((sum, val) => sum + (val || 0), 0) * 10000000; // Convert Cr to base
    const isOverBudget = totalAmount > treasuryBalance;
    const hasValidAmounts = Object.values(amounts).some(v => v > 0);

    const handleAmountChange = (companyId: string, value: string) => {
        const numValue = parseFloat(value) || 0;
        setAmounts(prev => ({ ...prev, [companyId]: numValue }));
    };

    const handleSubmit = async () => {
        if (isOverBudget || !hasValidAmounts) return;

        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network

        // Create batch transactions
        selectedCompanies.forEach(company => {
            const amount = (amounts[company.id] || 0) * 10000000; // Cr to base
            if (amount > 0) {
                addTransaction({
                    type: 'allocate',
                    amount,
                    from: 'Treasury',
                    to: company.name,
                    status: 'pending',
                    description: `Fund allocation to ${company.name} (${company.department})`,
                    role: 'fund-manager',
                });
            }
        });

        toast.success(`Batch allocation initiated for ${selectedCompanies.length} companies`, {
            description: 'Pending ACB approval',
        });

        setIsSubmitting(false);
        setAmounts({});
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-4 md:inset-y-10 md:inset-x-20 lg:inset-x-40 z-50 glass-card overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-politician/20 border border-politician/30">
                                    <IndianRupee className="w-5 h-5 text-politician" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">Batch Fund Allocation</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedCompanies.length} companies selected • Treasury: ₹{(treasuryBalance / 10000000).toFixed(2)} Cr
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        {/* Company List */}
                        <div className="flex-1 overflow-auto p-6">
                            <div className="space-y-3">
                                {selectedCompanies.map((company, index) => (
                                    <motion.div
                                        key={company.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-white/5"
                                    >
                                        <div className="p-2 rounded-lg bg-company/10 border border-company/20">
                                            <Building2 className="w-4 h-4 text-company" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground">{company.name}</p>
                                            <p className="text-xs text-muted-foreground">{company.department} • {company.email}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground text-sm">₹</span>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                value={amounts[company.id] || ''}
                                                onChange={(e) => handleAmountChange(company.id, e.target.value)}
                                                className="w-28 bg-background/50 border-white/10 text-right font-mono"
                                            />
                                            <span className="text-muted-foreground text-sm">Cr</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/10 bg-secondary/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Allocation</p>
                                    <p className={`text-2xl font-bold font-mono ${isOverBudget ? 'text-acb' : 'text-politician'}`}>
                                        ₹ {Object.values(amounts).reduce((s, v) => s + (v || 0), 0).toFixed(2)} Cr
                                    </p>
                                    {isOverBudget && (
                                        <p className="text-xs text-acb flex items-center gap-1 mt-1">
                                            <AlertTriangle className="w-3 h-3" />
                                            Exceeds treasury balance
                                        </p>
                                    )}
                                </div>
                                <RippleButton
                                    onClick={handleSubmit}
                                    disabled={isOverBudget || !hasValidAmounts || isSubmitting}
                                    className="bg-politician text-background px-6 py-3 rounded-xl font-medium flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        'Processing...'
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Initiate Batch Transaction
                                        </>
                                    )}
                                </RippleButton>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default BatchFundingModal;
