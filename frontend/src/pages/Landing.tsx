import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Eye, Lock } from 'lucide-react';
import { ShinyButton } from '@/components/ui/ShinyButton';
import { IdentityFactory } from '@/components/IdentityFactory';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-float opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-collector/20 rounded-full blur-[120px] animate-float opacity-50" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-company/20 rounded-full blur-[100px] animate-float opacity-40" style={{ animationDelay: '4s' }} />

        {/* Dynamic Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              radial-gradient(circle at center, white 1px, transparent 1px),
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-default"
          >
            <Shield className="w-4 h-4 text-collector drop-shadow-[0_0_8px_rgba(72,255,145,0.5)]" />
            <span className="text-sm font-medium text-white/80">Blockchain-Powered Transparency</span>
          </motion.div>

          {/* Main Heading with Staggered Character Reveal Mockup */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-foreground mb-8 leading-tight tracking-tight"
          >
            Transparency is the
            <br />
            <span className="text-gradient drop-shadow-2xl">new Currency</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Track every rupee from collection to allocation. Immutable records.
            Zero tolerance for corruption.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <ShinyButton
              size="lg"
              onClick={() => navigate('/auth')}
              className="group text-lg px-10 py-6"
            >
              <span className="flex items-center gap-3">
                Enter System
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </ShinyButton>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap justify-center gap-12 mt-20"
          >
            {[
              { icon: Eye, label: 'Real-time Tracking' },
              { icon: Lock, label: 'Immutable Records' },
              { icon: Shield, label: 'ACB Oversight' },
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                whileHover={{ scale: 1.05, color: "white" }}
                className="flex items-center gap-3 text-muted-foreground transition-colors cursor-default"
              >
                <div className="p-3 rounded-full bg-white/5 border border-white/5">
                  <feature.icon className="w-6 h-6 text-primary drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                </div>
                <span className="text-base font-medium">{feature.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Identity Factory for Development */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16 w-full max-w-xl"
        >
          <IdentityFactory />
        </motion.div>

        {/* Bottom Branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="absolute bottom-10 text-center"
        >
          <p className="text-sm text-white/40 font-light tracking-widest uppercase">
            The Glass Pipeline • Anti-Corruption DApp
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;

