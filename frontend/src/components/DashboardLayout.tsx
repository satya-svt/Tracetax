import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home, BarChart3, User } from 'lucide-react';
import { useStore, UserRole } from '@/store/useStore';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  role?: UserRole;
  accentColor?: 'primary' | 'collector' | 'acb' | 'company' | 'admin' | 'politician';
  color?: 'primary' | 'collector' | 'acb' | 'company' | 'admin' | 'politician';
}

const colorStyles = {
  primary: 'text-primary border-primary/30',
  collector: 'text-collector border-collector/30',
  acb: 'text-acb border-acb/30',
  company: 'text-company border-company/30',
  admin: 'text-admin border-admin/30',
  politician: 'text-politician border-politician/30',
};

const bgColorStyles = {
  primary: 'bg-primary/20',
  collector: 'bg-collector/20',
  acb: 'bg-acb/20',
  company: 'bg-company/20',
  admin: 'bg-admin/20',
  politician: 'bg-politician/20',
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  role,
  accentColor,
  color,
}) => {
  const navigate = useNavigate();
  const { logout, treasuryBalance, transactions, userRole, currentUser } = useStore();

  const activeColor = color || accentColor || 'primary';
  const activeRole = role || userRole;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const roleTransactions = transactions.filter((t) => t.role === activeRole);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass-card rounded-none border-b border-border"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden',
                bgColorStyles[activeColor]
              )}
              whileHover={{ scale: 1.05 }}
            >
              <img src="/logo.png" alt="Glass Pipeline" className="w-8 h-8 object-contain" />
            </motion.div>
            <div>
              <h1 className={cn('text-xl font-bold', colorStyles[activeColor].split(' ')[0])}>
                {title}
              </h1>
              <p className="text-xs text-muted-foreground">The Glass Pipeline</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="text-muted-foreground">Treasury</p>
                <p className={cn('font-bold', colorStyles[activeColor].split(' ')[0])}>
                  ₹{treasuryBalance.toLocaleString()}
                </p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="text-muted-foreground">Your Transactions</p>
                <p className="font-bold text-foreground">{roleTransactions.length}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {currentUser && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-secondary cursor-pointer border border-transparent hover:border-primary/20 transition-all"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-background">
                    {currentUser.profilePic ? (
                      <img src={currentUser.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium hidden sm:block max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/auth')}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <Home className="w-5 h-5 text-muted-foreground" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="p-2 rounded-lg bg-secondary hover:bg-acb/20 transition-colors"
              >
                <LogOut className="w-5 h-5 text-acb" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};