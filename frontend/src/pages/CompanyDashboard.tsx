import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, FileText, Send, Clock, CheckCircle2 } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatCard } from '@/components/StatCard';
import { RippleButton } from '@/components/ui/RippleButton';
import { useStore } from '@/store/useStore';

const projectTypes = [
  'Road Construction',
  'Bridge Development',
  'Hospital Building',
  'School Infrastructure',
  'Water Supply',
  'Power Grid',
];

const CompanyDashboard: React.FC = () => {
  const { transactions, addTransaction } = useStore();
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [bidAmount, setBidAmount] = useState('');

  const companyBids = transactions.filter((t) => t.role === 'company');
  const pendingBids = companyBids.filter((t) => t.status === 'pending');
  const approvedBids = companyBids.filter((t) => t.status === 'approved');
  const totalBidValue = companyBids.reduce((sum, t) => sum + t.amount, 0);

  const handleSubmitBid = () => {
    const numAmount = parseFloat(bidAmount);
    if (numAmount > 0 && projectName.trim() && projectType) {
      addTransaction({
        type: 'bid',
        amount: numAmount,
        from: 'ABC Construction Ltd.',
        to: projectType,
        status: 'pending',
        description: `${projectName} - ${projectType}`,
        role: 'company',
      });
      setProjectName('');
      setProjectType('');
      setBidAmount('');
    }
  };

  return (
    <DashboardLayout title="Contractor Portal" role="company" accentColor="company">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Bids"
          value={companyBids.length}
          icon={FileText}
          color="company"
          delay={0}
        />
        <StatCard
          title="Pending Review"
          value={pendingBids.length}
          icon={Clock}
          color="company"
          delay={0.1}
        />
        <StatCard
          title="Approved Projects"
          value={approvedBids.length}
          icon={CheckCircle2}
          color="collector"
          delay={0.2}
        />
        <StatCard
          title="Total Bid Value"
          value={`₹${totalBidValue.toLocaleString()}`}
          icon={Building2}
          color="company"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit Bid Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-company/20 flex items-center justify-center">
                <Send className="w-5 h-5 text-company" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Submit Bid</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., NH-48 Expansion Phase 2"
                  className="w-full px-4 py-3 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-company/50"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Project Type</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-company/50"
                >
                  <option value="">Select type</option>
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Bid Amount (₹)</label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Enter bid amount"
                  className="w-full px-4 py-3 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-company/50"
                />
              </div>

              <RippleButton
                variant="company"
                size="md"
                onClick={handleSubmitBid}
                disabled={!projectName.trim() || !projectType || !bidAmount}
                className="w-full"
              >
                Submit Bid
              </RippleButton>
            </div>
          </div>
        </motion.div>

        {/* Bids List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Your Bids</h2>
            
            {companyBids.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No bids submitted yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {companyBids.map((bid, index) => (
                  <motion.div
                    key={bid.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-foreground">{bid.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(bid.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-company">₹{bid.amount.toLocaleString()}</p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          bid.status === 'approved'
                            ? 'bg-collector/20 text-collector'
                            : bid.status === 'rejected'
                            ? 'bg-acb/20 text-acb'
                            : 'bg-company/20 text-company'
                        }`}
                      >
                        {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default CompanyDashboard;
