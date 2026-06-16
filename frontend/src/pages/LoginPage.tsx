import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, KeyRound, ArrowRight, ArrowLeft } from 'lucide-react';
import { ShinyButton } from '@/components/ui/ShinyButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useStore();

    const [did, setDid] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const role = searchParams.get('role');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate network delay for effect
        await new Promise(resolve => setTimeout(resolve, 1000));

        const result = login(did, password);

        if (result.success) {
            toast.success(`Welcome back! Logged in as ${result.role}`);
            if (result.role === 'admin') {
                navigate('/admin');
            } else {
                navigate(`/${result.role}`);
            }
        } else {
            toast.error(result.message || 'Login failed');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-collector/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-md p-8 glass-card border border-white/10"
            >
                <button
                    onClick={() => navigate('/auth')}
                    className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="text-center mb-8 mt-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Secure Login</h1>
                    <p className="text-muted-foreground text-sm mt-2">
                        Enter your credentials to access the
                        <span className="text-primary font-medium"> {role ? role.replace('-', ' ').toUpperCase() : 'Restricted'} </span>
                        Dashboard
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <Label>Digital ID</Label>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                value={did}
                                onChange={(e) => setDid(e.target.value)}
                                placeholder="DID-XXXX"
                                className="pl-9 bg-secondary/50 border-white/10 focus:border-primary/50"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-secondary/50 border-white/10 focus:border-primary/50"
                        />
                    </div>

                    <ShinyButton
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Verifying...' : 'Authenticate Access'}
                        {!isLoading && <ArrowRight className="w-4 h-4" />}
                    </ShinyButton>
                </form>

                {role && (
                    <p className="text-xs text-center text-muted-foreground mt-6">
                        Establishing secure connection...
                    </p>
                )}
            </motion.div>
        </div>
    );
};

export default LoginPage;
