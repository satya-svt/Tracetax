import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SpotlightCard } from './ui/SpotlightCard';

interface RoleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: 'politician' | 'collector' | 'acb' | 'company' | 'people' | 'admin';
  onClick: () => void;
  delay?: number;
}

const colorStyles = {
  politician: {
    icon: 'text-politician',
    spotlight: 'hsl(270 100% 60% / 0.2)',
  },
  collector: {
    icon: 'text-collector',
    spotlight: 'hsl(150 100% 45% / 0.2)',
  },
  acb: {
    icon: 'text-acb',
    spotlight: 'hsl(340 100% 60% / 0.2)',
  },
  company: {
    icon: 'text-company',
    spotlight: 'hsl(45 100% 60% / 0.2)',
  },
  people: {
    icon: 'text-people',
    spotlight: 'hsl(190 100% 50% / 0.2)',
  },
  admin: {
    icon: 'text-admin',
    spotlight: 'hsl(210 100% 80% / 0.2)',
  },
};

const ROTATION_RANGE = 20;
const HALF_ROTATION_RANGE = 20 / 2;

export const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  icon: Icon,
  color,
  onClick,
  delay = 0,
}) => {
  const styles = colorStyles[color];
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, type: "spring" }}
      style={{ transformStyle: "preserve-3d", transform }}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="group relative h-full perspective-1000 cursor-pointer"
    >
      <SpotlightCard
        className="h-full p-8"
        spotlightColor={styles.spotlight}
      >
        <div
          className="flex flex-col items-center text-center relative z-10"
          style={{ transform: "translateZ(50px)" }}
        >
          <motion.div
            className={cn(
              'w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6 transition-all duration-500',
              'group-hover:scale-110 group-hover:bg-white/10 group-hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)]'
            )}
          >
            <Icon className={cn('w-10 h-10 transition-colors duration-500', styles.icon)} />
          </motion.div>

          <h3 className="text-xl font-bold text-foreground mb-3 tracking-wide">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>
      </SpotlightCard>
    </motion.div>
  );
};
