import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    User,
    MapPin,
    Mail,
    Shield,
    KeyRound,
    Camera,
    Save,
    ArrowLeft
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useStore } from '@/store/useStore';
import { ShinyButton } from '@/components/ui/ShinyButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser, updateUserProfile } = useStore();

    const [name, setName] = useState(currentUser?.name || '');
    const [profilePic, setProfilePic] = useState(currentUser?.profilePic || '');
    const [isEditing, setIsEditing] = useState(false);

    React.useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    if (!currentUser) return null;

    const handleSave = () => {
        updateUserProfile(currentUser.id, { name, profilePic });
        setIsEditing(false);
        toast.success('Profile updated successfully');
    };

    return (
        <DashboardLayout title="My Profile" role={currentUser.role}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <div className="glass-card p-8 md:p-12 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl bg-secondary">
                                    {profilePic ? (
                                        <img
                                            src={profilePic}
                                            alt={currentUser.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                                            <User className="w-16 h-16 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                                {isEditing && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="text-center">
                                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium border border-primary/20 capitalize">
                                    {currentUser.role?.replace('-', ' ')}
                                </span>
                            </div>
                        </div>

                        {/* details Section */}
                        <div className="flex-1 w-full space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-foreground">{currentUser.name}</h1>
                                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                        <Mail className="w-4 h-4" />
                                        {currentUser.email}
                                    </p>
                                </div>
                                {!isEditing ? (
                                    <ShinyButton
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit Profile
                                    </ShinyButton>
                                ) : (
                                    <div className="flex gap-2">
                                        <ShinyButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Cancel
                                        </ShinyButton>
                                        <ShinyButton
                                            size="sm"
                                            onClick={handleSave}
                                        >
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </ShinyButton>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                                {isEditing ? (
                                    <>
                                        <div className="space-y-2">
                                            <Label>Full Name</Label>
                                            <Input
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="bg-secondary/50 border-white/10"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Profile Picture URL</Label>
                                            <Input
                                                value={profilePic}
                                                onChange={(e) => setProfilePic(e.target.value)}
                                                placeholder="https://..."
                                                className="bg-secondary/50 border-white/10"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Digital ID</p>
                                            <div className="flex items-center gap-2">
                                                <KeyRound className="w-4 h-4 text-primary" />
                                                <p className="font-mono text-lg">{currentUser.digitalId}</p>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">ETH Account</p>
                                            <div className="flex items-center gap-2">
                                                <Wallet className="w-4 h-4 text-collector" />
                                                <p className="font-mono text-sm truncate" title={currentUser.ethAddress || ''}>
                                                    {currentUser.ethAddress?.slice(0, 20)}...
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="col-span-1 md:col-span-2 p-4 rounded-xl bg-secondary/30 border border-white/5 space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Account Status</p>
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-green-400" />
                                        <p className="font-medium text-green-400 capitalize">
                                            {currentUser.status} • Verified
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
};

export default ProfilePage;
