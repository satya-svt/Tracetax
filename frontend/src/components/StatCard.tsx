import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'primary' | 'collector' | 'acb' | 'company' | 'admin' | 'politician';
  change?: string;
  delay?: number;
}

const colorStyles = {
  primary: {
    text: 'text-primary',
    bg: 'bg-primary/20',
  },
  collector: {
    text: 'text-collector',
    bg: 'bg-collector/20',
  },
  acb: {
    text: 'text-acb',
    bg: 'bg-acb/20',
  },
  company: {
    text: 'text-company',
    bg: 'bg-company/20',
  },
  admin: {
    text: 'text-admin',
    bg: 'bg-admin/20',
  },
  politician: {
    text: 'text-politician',
    bg: 'bg-politician/20',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  change,
  delay = 0,
}) => {
  const styles = colorStyles[color];
  const springValue = useSpring(0, { bounce: 0, duration: 2000 });
  const displayValue = useTransform(springValue, (current) =>
    typeof value === 'number'
      ? Math.round(current).toLocaleString()
      : value
  );

  useEffect(() => {
    if (typeof value === 'number') {
      springValue.set(value);
    }
  }, [value, springValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="stat-card"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <motion.p className={cn('text-3xl font-bold mt-1', styles.text)}>
            {typeof value === 'number' ? displayValue : value}
          </motion.p>
        </div>
        <div className={cn('p-3 rounded-lg', styles.bg)}>
          <Icon className={cn('w-6 h-6', styles.text)} />
        </div>
      </div>
      {change && (
        <p className="text-xs text-muted-foreground mt-2">{change}</p>
      )}
    </motion.div>
  );
};
