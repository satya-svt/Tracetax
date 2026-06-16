import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Shield, Building2, Search, Fingerprint } from 'lucide-react';
import { useStore, UserRole } from '@/store/useStore';
import { toast } from 'sonner';

const roles = [
    { id: 'collector' as UserRole, label: 'Mint Collector ID', icon: Wallet, emoji: '👮‍♂️', color: 'collector' },
    { id: 'fund-manager' as UserRole, label: 'Mint Politician ID', icon: Shield, emoji: '🧑‍⚖️', color: 'politician' },
    { id: 'company' as UserRole, label: 'Mint Contractor ID', icon: Building2, emoji: '🏗️', color: 'company' },
    { id: 'acb' as UserRole, label: 'Mint ACB ID', icon: Search, emoji: '🕵️‍♂️', color: 'acb' },
];

const generateMockDID = () => {
    const chars = '0123456789abcdef';
    let address = '';
    for (let i = 0; i < 40; i++) {
        address += chars[Math.floor(Math.random() * chars.length)];
    }
    return `did:polygon:amoy:0x${address}`;
};

export const IdentityFactory: React.FC = () => {
    const { setUserRole, setAuthenticated } = useStore();

    const handleMintIdentity = (role: UserRole, label: string) => {
        const did = generateMockDID();

        // Store in localStorage for persistence
        const credential = {
            did,
            role,
            issuedAt: new Date().toISOString(),
            network: 'polygon:amoy',
        };
        localStorage.setItem('userCredentials', JSON.stringify(credential));

        // Update global state
        setUserRole(role);
        setAuthenticated(true);

        toast.success('Identity Verification Credential Issued to Wallet', {
            description: `DID: ${did.slice(0, 25)}...`,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 max-w-xl mx-auto"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
                    <Fingerprint className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-foreground">Government Identity Issuer</h2>
                    <p className="text-sm text-muted-foreground">Polygon Amoy Testnet</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => (
                    <motion.button
                        key={role.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleMintIdentity(role.id, role.label)}
                        className={`p-4 rounded-xl border transition-all duration-300 text-left group
              bg-${role.color}/10 border-${role.color}/30 hover:bg-${role.color}/20 hover:border-${role.color}/50`}
                        style={{
                            background: `linear-gradient(135deg, var(--${role.color}) 0%, transparent 100%)`,
                            backgroundSize: '200% 200%',
                            backgroundPosition: '100% 100%',
                        }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{role.emoji}</span>
                            <role.icon className={`w-5 h-5 text-${role.color} opacity-60`} />
                        </div>
                        <p className="text-sm font-medium text-foreground group-hover:text-white transition-colors">
                            {role.label}
                        </p>
                    </motion.button>
                ))}
            </div>

            <p className="text-xs text-center text-muted-foreground mt-4 pt-4 border-t border-white/5">
                ⚡ Prototype Mode: Mock DIDs for Development
            </p>
        </motion.div>
    );
};

export default IdentityFactory;
