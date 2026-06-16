import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Fingerprint, CheckCircle2 } from 'lucide-react';

interface AuthScannerProps {
  isScanning: boolean;
  onComplete: () => void;
  roleName: string;
}

export const AuthScanner: React.FC<AuthScannerProps> = ({ isScanning, onComplete, roleName }) => {
  const [stage, setStage] = useState<'scanning' | 'verifying' | 'success'>('scanning');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isScanning) {
      setStage('scanning');
      setProgress(0);
      
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      const timer1 = setTimeout(() => setStage('verifying'), 1500);
      const timer2 = setTimeout(() => setStage('success'), 2500);
      const timer3 = setTimeout(onComplete, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isScanning, onComplete]);

  return (
    <AnimatePresence>
      {isScanning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="glass-card p-12 text-center max-w-md mx-4"
          >
            {/* Scanning Icon */}
            <motion.div
              className="relative mx-auto mb-8 w-32 h-32"
            >
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-collector/30"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-2 rounded-full border-2 border-collector/50"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              />
              <div className="absolute inset-4 rounded-full bg-card flex items-center justify-center">
                {stage === 'success' ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle2 className="w-16 h-16 text-collector" />
                  </motion.div>
                ) : stage === 'verifying' ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Shield className="w-16 h-16 text-primary" />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <Fingerprint className="w-16 h-16 text-primary" />
                  </motion.div>
                )}
              </div>

              {/* Scanner Line */}
              {stage === 'scanning' && (
                <div className="scanner-line" />
              )}
            </motion.div>

            {/* Status Text */}
            <motion.h2
              key={stage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-foreground mb-2"
            >
              {stage === 'scanning' && 'Scanning Digital ID...'}
              {stage === 'verifying' && 'Verifying Credentials...'}
              {stage === 'success' && 'Access Granted'}
            </motion.h2>

            <p className="text-muted-foreground mb-6">
              {stage === 'success' 
                ? `Welcome, ${roleName}`
                : 'Please wait while we verify your identity'
              }
            </p>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-collector"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
