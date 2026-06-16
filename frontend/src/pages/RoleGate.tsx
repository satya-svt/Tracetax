import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  PiggyBank,
  Shield,
  Building2,
  Users,
  ArrowLeft,
  KeyRound
} from 'lucide-react';
import { RoleCard } from '@/components/RoleCard';
import { AuthScanner } from '@/components/AuthScanner';
import { useStore, UserRole } from '@/store/useStore';

const roles = [
  {
    id: 'admin' as UserRole,
    title: 'System Admin',
    description: 'Manage Digital IDs, ETH accounts, and user assignments.',
    icon: KeyRound,
    color: 'admin' as const,
    route: '/admin',
    requiresAuth: true,
  },
  {
    id: 'collector' as UserRole,
    title: 'Tax Collector',
    description: 'Mint funds into the treasury from collected taxes and fees.',
    icon: Wallet,
    color: 'collector' as const,
    route: '/collector',
    requiresAuth: true,
  },
  {
    id: 'fund-manager' as UserRole,
    title: 'Fund Manager',
    description: 'Allocate treasury funds to approved projects and departments.',
    icon: PiggyBank,
    color: 'politician' as const,
    route: '/fund-manager',
    requiresAuth: true,
  },
  {
    id: 'acb' as UserRole,
    title: 'ACB Officer',
    description: 'Monitor all transactions and investigate suspicious activity.',
    icon: Shield,
    color: 'acb' as const,
    route: '/acb',
    requiresAuth: true,
  },
  {
    id: 'company' as UserRole,
    title: 'Contractor',
    description: 'Submit bids for government projects and receive payments.',
    icon: Building2,
    color: 'company' as const,
    route: '/company',
    requiresAuth: true,
  },
  {
    id: 'people' as UserRole,
    title: 'Public Portal',
    description: 'View transparent records of all government transactions.',
    icon: Users,
    color: 'people' as const,
    route: '/public',
    requiresAuth: false,
  },
];

const RoleGate: React.FC = () => {
  const navigate = useNavigate();
  const { setUserRole, setAuthenticated } = useStore();
  const [isScanning, setIsScanning] = useState(false);
  const [selectedRole, setSelectedRole] = useState<typeof roles[0] | null>(null);

  const handleRoleClick = (role: typeof roles[0]) => {
    setSelectedRole(role);

    if (role.requiresAuth) {
      if (role.id === 'admin' || role.id === 'collector' || role.id === 'fund-manager' || role.id === 'acb' || role.id === 'company') {
        navigate(`/login?role=${role.id}`);
      } else {
        setIsScanning(true);
      }
    } else {
      navigate(role.route);
    }
  };

  const handleAuthComplete = () => {
    if (selectedRole) {
      setUserRole(selectedRole.id);
      setAuthenticated(true);
      setIsScanning(false);
      navigate(selectedRole.route);
    }
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-collector/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Noise/Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* Auth Scanner Overlay */}
      <AuthScanner
        isScanning={isScanning}
        onComplete={handleAuthComplete}
        roleName={selectedRole?.title || ''}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12 group"
        >
          <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to Home</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
            Select Your Identity
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Access restricted dashboards via secure Digital ID verification.
            <br />
            <span className="text-sm opacity-60">All sessions are secured by blockchain authentication.</span>
          </p>
        </motion.div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto perspective-1000">
          {roles.map((role, index) => (
            <RoleCard
              key={role.id}
              title={role.title}
              description={role.description}
              icon={role.icon}
              color={role.color}
              onClick={() => handleRoleClick(role)}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-sm text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            System Status: Operational
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleGate;