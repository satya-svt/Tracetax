import React, { useState } from 'react';
import { ethers } from "ethers";
import { getTraceTaxContract } from "../lib/blockchain";
import { motion, AnimatePresence } from 'framer-motion';
import {
  KeyRound,
  UserPlus,
  UserMinus,
  Wallet,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Search,
  AlertCircle,
  Mail,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatCard } from '@/components/StatCard';
import { useStore, UserRole } from '@/store/useStore';
import { RippleButton } from '@/components/ui/RippleButton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const roleColors: Record<string, string> = {
  collector: 'text-collector',
  'fund-manager': 'text-politician',
  acb: 'text-acb',
  company: 'text-company',
  admin: 'text-admin',
};

const roleBgColors: Record<string, string> = {
  collector: 'bg-collector/20',
  'fund-manager': 'bg-politician/20',
  acb: 'bg-acb/20',
  company: 'bg-company/20',
  admin: 'bg-admin/20',
};

const AdminDashboard: React.FC = () => {
  const {
    digitalIds,
    registeredUsers,
    ethAccountRequests,
    assignDigitalId,
    revokeDigitalId,
    addEthAccounts,
    requestMoreAccounts,
    addUser,
    removeUser,
    transactions,
    generateCredentials
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedDigitalId, setSelectedDigitalId] = useState<string | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('collector');

  // Credential Modal State
  const [credentialModalOpen, setCredentialModalOpen] = useState(false);
  const [generatedCreds, setGeneratedCreds] = useState<{ did: string, password: string, email: string } | null>(null);

  // Quick Invite State
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('collector');

  // Blockchain Integration State
  const [blockchainLoading, setBlockchainLoading] = useState<string | null>(null);

  const availableIds = digitalIds.filter(d => d.status === 'available');
  const assignedIds = digitalIds.filter(d => d.status === 'assigned');
  const pendingUsers = registeredUsers.filter(u => u.status === 'pending');
  const activeUsers = registeredUsers.filter(u => u.status === 'active');

  const filteredUsers = registeredUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- START OF BLOCKCHAIN FUNCTIONS ---

  const handleBlockchainVerify = async (userId: string, ethAddress: string | undefined) => {
    if (!ethAddress) {
      toast.error("This user does not have an assigned ETH address yet.");
      return;
    }

    try {
      setBlockchainLoading(userId);
      const contract = await getTraceTaxContract();

      // Execute the 'verifyDID' transaction on the Smart Contract
      const tx = await contract.verifyDID(ethAddress);

      toast.info("Transaction broadcasted... waiting for block confirmation.");
      await tx.wait(); // Wait for Hardhat to mine the block

      toast.success(`Identity ${ethAddress.slice(0, 6)}... verified on the Blockchain!`);
    } catch (error: any) {
      console.error("Blockchain Error:", error);
      toast.error("Verification failed. Ensure MetaMask is connected to the ACB Admin account.");
    } finally {
      setBlockchainLoading(null);
    }
  };

  // --- END OF BLOCKCHAIN FUNCTIONS ---

  const handleAssign = () => {
    if (selectedUserId && selectedDigitalId) {
      assignDigitalId(selectedUserId, selectedDigitalId);
      setSelectedUserId(null);
      setSelectedDigitalId(null);
      toast.success('Digital ID assigned manually');
    }
  };

  const handleAddUser = () => {
    if (newUserName && newUserEmail && newUserRole) {
      addUser({ name: newUserName, email: newUserEmail, role: newUserRole });
      setNewUserName('');
      setNewUserEmail('');
      setNewUserRole('collector');
      setIsAddUserOpen(false);
      toast.success('User added successfully');
    }
  };

  const handleQuickInvite = () => {
    if (!inviteName || !inviteEmail || !inviteRole) {
      toast.error('Please fill in all fields');
      return;
    }

    addUser({ name: inviteName, email: inviteEmail, role: inviteRole });

    setTimeout(() => {
      const users = useStore.getState().registeredUsers;
      const newUser = users.find(u => u.email === inviteEmail && u.status === 'pending');

      if (newUser) {
        const creds = generateCredentials(newUser.id);
        if (creds) {
          const subject = `Official Appointment: Glass Pipeline Credentials`;
          const body = `Dear ${inviteName},\n\nYour Digital ID is: ${creds.did}\nPassword: ${creds.password}`;
          window.location.href = `mailto:${inviteEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          toast.success(`Credentials generated for ${creds.did}`);
          setInviteName('');
          setInviteEmail('');
        }
      }
    }, 100);
  };

  const handleGenerateCredentials = (userId: string, userEmail: string) => {
    const creds = generateCredentials(userId);
    if (creds) {
      setGeneratedCreds({ ...creds, email: userEmail });
      setCredentialModalOpen(true);
      toast.success('Credentials generated successfully');
    }
  };

  const sendCredsViaEmail = () => {
    if (!generatedCreds) return;
    const subject = `Official Appointment: Glass Pipeline Credentials`;
    const body = `Digital ID: ${generatedCreds.did}\nPassword: ${generatedCreds.password}`;
    window.location.href = `mailto:${generatedCreds.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const adminTransactions = transactions.filter(t => t.role === 'admin').slice(0, 5);

  return (
    <DashboardLayout title="Admin Console" color="admin">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Available IDs" value={availableIds.length} icon={KeyRound} color="admin" />
        <StatCard title="Assigned IDs" value={assignedIds.length} icon={CheckCircle2} color="collector" />
        <StatCard title="Pending Users" value={pendingUsers.length} icon={Clock} color="company" />
        <StatCard title="Active Users" value={activeUsers.length} icon={Users} color="politician" />
      </div>

      {/* Quick Invite Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 col-span-1 lg:col-span-2 border-primary/20">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-primary" /> Quick Invite & Credentials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div><Label>Full Name</Label><Input value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder="Jane Doe" className="bg-secondary border-border mt-1" /></div>
            <div><Label>Email</Label><Input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="jane@glass.gov" className="bg-secondary border-border mt-1" /></div>
            <div>
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as UserRole)}>
                <SelectTrigger className="bg-secondary mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="collector">Tax Collector</SelectItem>
                  <SelectItem value="fund-manager">Fund Manager</SelectItem>
                  <SelectItem value="acb">ACB Officer</SelectItem>
                  <SelectItem value="company">Contractor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <RippleButton onClick={handleQuickInvite} className="bg-primary text-primary-foreground h-10 px-4 rounded-lg flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Invite User
            </RippleButton>
          </div>
        </motion.div>
      </div>

      {/* User Management Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-admin" /> User Management
          </h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-secondary w-64" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground uppercase font-medium">
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Digital ID</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${roleBgColors[user.role || '']} ${roleColors[user.role || '']}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-mono text-sm">{user.digitalId || 'Unassigned'}</p>
                    <p className="font-mono text-[10px] text-muted-foreground truncate max-w-32">{user.ethAddress}</p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">

                      {/* --- BLOCKCHAIN VERIFY BUTTON --- */}
                      {user.role === 'company' && user.ethAddress && (
                        <RippleButton
                          disabled={blockchainLoading === user.id}
                          onClick={() => handleBlockchainVerify(user.id, user.ethAddress)}
                          className="bg-collector/20 text-collector px-3 py-1 text-xs rounded-lg flex items-center gap-1 border border-collector/30 hover:bg-collector hover:text-white transition-all mr-2"
                        >
                          <UserCheck className="w-3 h-3" />
                          {blockchainLoading === user.id ? "Verifying..." : "Verify DID"}
                        </RippleButton>
                      )}

                      {user.status === 'pending' && (
                        <RippleButton onClick={() => handleGenerateCredentials(user.id, user.email)} className="bg-primary/20 text-primary px-3 py-1 text-xs rounded-lg">
                          <ShieldCheck className="w-3 h-3 mr-1" /> Access
                        </RippleButton>
                      )}

                      {user.status === 'active' && (
                        <RippleButton onClick={() => revokeDigitalId(user.id)} className="bg-acb/20 text-acb px-3 py-1 text-xs rounded-lg">Revoke</RippleButton>
                      )}

                      <RippleButton onClick={() => removeUser(user.id)} className="bg-destructive/20 text-destructive px-2 py-1 rounded-lg">
                        <UserMinus className="w-4 h-4" />
                      </RippleButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;