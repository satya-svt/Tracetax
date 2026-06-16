import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PiggyBank,
  ArrowUpRight,
  FileText,
  Building2,
  Stethoscope,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Send
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatCard } from '@/components/StatCard';
import { TransactionList } from '@/components/TransactionList';
import { RippleButton } from '@/components/ui/RippleButton';
import { useStore } from '@/store/useStore';
import { mockCompanies, Company, Department, getCompaniesByDepartment } from '@/data/mockCompanies';
import { BatchFundingModal } from '@/components/BatchFundingModal';

const departmentTabs: { id: Department; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'Infrastructure', label: 'Infrastructure', icon: Building2, color: 'politician' },
  { id: 'Health', label: 'Health', icon: Stethoscope, color: 'collector' },
  { id: 'Education', label: 'Education', icon: GraduationCap, color: 'primary' },
];

const FundManagerDashboard: React.FC = () => {
  const { treasuryBalance, transactions } = useStore();
  const [activeTab, setActiveTab] = useState<Department>('Infrastructure');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  const allocations = transactions.filter((t) => t.type === 'allocate');
  const pendingAllocations = allocations.filter((t) => t.status === 'pending');
  const totalAllocated = allocations
    .filter((t) => t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentCompanies = getCompaniesByDepartment(activeTab);

  const toggleCompanySelection = (companyId: string) => {
    setSelectedCompanies(prev =>
      prev.includes(companyId)
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  const selectAllInTab = () => {
    const tabCompanyIds = currentCompanies.map(c => c.id);
    const allSelected = tabCompanyIds.every(id => selectedCompanies.includes(id));
    if (allSelected) {
      setSelectedCompanies(prev => prev.filter(id => !tabCompanyIds.includes(id)));
    } else {
      setSelectedCompanies(prev => [...new Set([...prev, ...tabCompanyIds])]);
    }
  };

  const selectedCompanyObjects = mockCompanies.filter(c => selectedCompanies.includes(c.id));

  return (
    <DashboardLayout title="Fund Allocation" role="fund-manager" accentColor="politician">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Treasury Balance"
          value={`₹${(treasuryBalance / 10000000).toFixed(2)} Cr`}
          icon={PiggyBank}
          color="politician"
          delay={0}
        />
        <StatCard
          title="Total Allocated"
          value={`₹${(totalAllocated / 10000000).toFixed(2)} Cr`}
          icon={ArrowUpRight}
          color="collector"
          delay={0.1}
        />
        <StatCard
          title="Pending ACB"
          value={pendingAllocations.length}
          icon={FileText}
          color="company"
          delay={0.2}
        />
        <StatCard
          title="Registered Contractors"
          value={mockCompanies.length}
          icon={Building2}
          color="primary"
          delay={0.3}
        />
      </div>

      {/* Company Directory */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="w-5 h-5 text-politician" />
            Company Directory
          </h2>
          <button
            onClick={selectAllInTab}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {currentCompanies.every(c => selectedCompanies.includes(c.id)) ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        {/* Department Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
          {departmentTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === tab.id
                ? `bg-${tab.color}/20 text-${tab.color} border border-${tab.color}/30`
                : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                {getCompaniesByDepartment(tab.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Company Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase w-10">
                  <input
                    type="checkbox"
                    checked={currentCompanies.every(c => selectedCompanies.includes(c.id))}
                    onChange={selectAllInTab}
                    className="rounded bg-secondary border-white/20"
                  />
                </th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Company</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Contact</th>
                <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {currentCompanies.map((company, index) => (
                  <motion.tr
                    key={company.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => toggleCompanySelection(company.id)}
                    className={`border-b border-white/5 cursor-pointer transition-colors ${selectedCompanies.includes(company.id)
                      ? 'bg-politician/10'
                      : 'hover:bg-secondary/30'
                      }`}
                  >
                    <td className="py-2 px-3">
                      <input
                        type="checkbox"
                        checked={selectedCompanies.includes(company.id)}
                        onChange={() => toggleCompanySelection(company.id)}
                        className="rounded bg-secondary border-white/20"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <p className="text-sm font-medium text-foreground">{company.name}</p>
                    </td>
                    <td className="py-2 px-3">
                      <p className="text-sm text-muted-foreground font-mono">{company.email}</p>
                    </td>
                    <td className="py-2 px-3 text-center">
                      {company.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-xs text-collector">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <XCircle className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Selection Action Bar */}
      <AnimatePresence>
        {selectedCompanies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 glass-card px-6 py-4 flex items-center gap-6 border border-politician/30"
          >
            <p className="text-foreground font-medium">
              <span className="text-politician">{selectedCompanies.length}</span> Companies Selected
            </p>
            <RippleButton
              onClick={() => setIsBatchModalOpen(true)}
              className="bg-politician text-background px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Proceed to Fund
            </RippleButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Allocation History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Recent Allocations</h2>
          <TransactionList transactions={allocations.slice(0, 5)} />
        </div>
      </motion.div>

      {/* Batch Funding Modal */}
      <BatchFundingModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        selectedCompanies={selectedCompanyObjects}
      />
    </DashboardLayout>
  );
};

export default FundManagerDashboard;