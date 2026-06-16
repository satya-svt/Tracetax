import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'collector' | 'fund-manager' | 'acb' | 'company' | 'people' | 'admin' | null;

export interface Transaction {
  id: string;
  type: 'mint' | 'allocate' | 'approve' | 'bid' | 'view' | 'assign-id' | 'revoke-id';
  amount: number;
  from: string;
  to: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
  description: string;
  role: UserRole;
}

export interface DigitalID {
  id: string;
  ethAddress: string;
  assignedTo: string | null;
  assignedRole: UserRole | null;
  assignedAt: Date | null;
  status: 'available' | 'assigned' | 'revoked';
}

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  digitalId: string | null;
  ethAddress: string | null;
  registeredAt: Date;
  status: 'pending' | 'active' | 'suspended';
  password?: string;
  profilePic?: string;
}

// Generate mock ETH addresses
const generateEthAddress = () => {
  const chars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
};

// Initial ETH account pool (10 addresses)
const initialEthAccounts: DigitalID[] = Array.from({ length: 10 }, (_, i) => ({
  id: `DID-${String(i + 1).padStart(4, '0')}`,
  ethAddress: generateEthAddress(),
  assignedTo: null,
  assignedRole: null,
  assignedAt: null,
  status: 'available' as const,
}));

// Mock registered users awaiting Digital ID
const initialMockUsers: RegisteredUser[] = [
  {
    id: 'user-001',
    name: 'John Smith',
    email: 'john.smith@gov.org',
    role: 'collector',
    digitalId: null,
    ethAddress: null,
    registeredAt: new Date('2024-01-15'),
    status: 'pending',
  },
  {
    id: 'user-002',
    name: 'Sarah Johnson',
    email: 'sarah.j@treasury.gov',
    role: 'fund-manager',
    digitalId: null,
    ethAddress: null,
    registeredAt: new Date('2024-01-20'),
    status: 'pending',
  },
  {
    id: 'user-003',
    name: 'Michael Chen',
    email: 'm.chen@acb.gov',
    role: 'acb',
    digitalId: null,
    ethAddress: null,
    registeredAt: new Date('2024-02-01'),
    status: 'pending',
  },
  {
    id: 'user-004',
    name: 'BuildCorp Inc.',
    email: 'contracts@buildcorp.com',
    role: 'company',
    digitalId: null,
    ethAddress: null,
    registeredAt: new Date('2024-02-10'),
    status: 'pending',
  },
  {
    id: 'user-005',
    name: 'Emily Davis',
    email: 'emily.d@revenue.gov',
    role: 'collector',
    digitalId: null,
    ethAddress: null,
    registeredAt: new Date('2024-02-15'),
    status: 'pending',
  },
];

interface AppState {
  treasuryBalance: number;
  transactions: Transaction[];
  userRole: UserRole;
  isAuthenticated: boolean;
  currentUser: RegisteredUser | null;

  // Admin state
  digitalIds: DigitalID[];
  registeredUsers: RegisteredUser[];
  ethAccountRequests: number;

  // Actions
  setUserRole: (role: UserRole) => void;
  setAuthenticated: (auth: boolean) => void;
  addFunds: (amount: number, description: string) => void;
  allocateFunds: (amount: number, to: string, description: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  approveTransaction: (id: string) => void;
  rejectTransaction: (id: string) => void;
  logout: () => void;
  login: (did: string, password: string, expectedRole?: UserRole) => { success: boolean; role?: UserRole; message?: string };

  // Admin actions
  assignDigitalId: (userId: string, digitalIdId: string) => void;
  revokeDigitalId: (userId: string) => void;
  addEthAccounts: (count: number) => void;
  requestMoreAccounts: () => void;
  addUser: (user: Omit<RegisteredUser, 'id' | 'registeredAt' | 'status' | 'digitalId' | 'ethAddress'>) => void;
  removeUser: (userId: string) => void;
  updateUserProfile: (userId: string, data: { name?: string; profilePic?: string }) => void;
  generateCredentials: (userId: string) => { did: string; password: string } | null;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      treasuryBalance: 0,
      transactions: [],
      userRole: null,
      isAuthenticated: false,
      currentUser: null,
      digitalIds: initialEthAccounts,
      registeredUsers: initialMockUsers,
      ethAccountRequests: 0,

      setUserRole: (role) => set({ userRole: role }),

      setAuthenticated: (auth) => set({ isAuthenticated: auth }),

      login: (did, password, expectedRole) => {
        const state = get();

        // System Admin Backdoor / Hardcoded Login
        if (did === 'admin' && password === 'admin123') {
          // Admin can access admin dashboard or any other dashboard if needed (superuser)
          // But strict requirement says "credentials work ONLY for that role"
          // We'll enforce admin check too
          if (expectedRole && expectedRole !== 'admin') {
            return { success: false, message: `Access Denied: You are not authorized for ${expectedRole} dashboard` };
          }

          set({ userRole: 'admin', isAuthenticated: true, currentUser: { id: 'admin', name: 'System Admin', email: 'admin@glass.gov', role: 'admin', digitalId: 'admin', ethAddress: '0xadmin', registeredAt: new Date(), status: 'active' } });
          return { success: true, role: 'admin' };
        }

        // Find user by Digital ID
        const user = state.registeredUsers.find((u) => u.digitalId === did);

        if (!user) {
          return { success: false, message: 'Invalid Digital ID' };
        }

        if (user.status !== 'active') {
          return { success: false, message: 'Account is not active' };
        }

        // Verify password (simple check for now, in real app use hashing)
        if (user.password !== password) {
          return { success: false, message: 'Incorrect Password' };
        }

        // Strict Role Enforcement
        if (expectedRole && user.role !== expectedRole) {
          return { success: false, message: `Access Denied: This ID is for ${user.role}, not ${expectedRole}` };
        }

        set({ userRole: user.role, isAuthenticated: true, currentUser: user });
        return { success: true, role: user.role };
      },

      generateCredentials: (userId) => {
        const state = get();
        const user = state.registeredUsers.find((u) => u.id === userId);

        // Allow re-issuing for active users or new assignment for pending users
        if (!user) return null;

        let digitalId = user.digitalId;
        let ethAddress = user.ethAddress;

        // If assigning new ID
        if (!digitalId) {
          const availableId = state.digitalIds.find((d) => d.status === 'available');
          if (!availableId) return null;
          digitalId = availableId.id;
          ethAddress = availableId.ethAddress;

          // Mark ID as assigned
          set((state) => ({
            digitalIds: state.digitalIds.map(d =>
              d.id === digitalId
                ? { ...d, assignedTo: user.name, assignedRole: user.role, assignedAt: new Date(), status: 'assigned' as const }
                : d
            )
          }));
        }

        const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); // Random 16 char password

        // Update User
        set((state) => ({
          registeredUsers: state.registeredUsers.map(u =>
            u.id === userId
              ? { ...u, digitalId: digitalId, ethAddress: ethAddress, status: 'active' as const, password }
              : u
          ),
          // Log transaction
          transactions: [{
            id: crypto.randomUUID(),
            type: 'assign-id',
            amount: 0,
            from: 'System Admin',
            to: user.name,
            timestamp: new Date(),
            status: 'approved',
            description: `Generated Credentials for ${user.name}`,
            role: 'admin',
          }, ...state.transactions],
        }));

        return { did: digitalId!, password };
      },

      addFunds: (amount, description) => {
        const transaction: Transaction = {
          id: crypto.randomUUID(),
          type: 'mint',
          amount,
          from: 'Tax Collection',
          to: 'Treasury',
          timestamp: new Date(),
          status: 'approved',
          description,
          role: 'collector',
        };
        set((state) => ({
          treasuryBalance: state.treasuryBalance + amount,
          transactions: [transaction, ...state.transactions],
        }));
      },

      allocateFunds: (amount, to, description) => {
        const state = get();
        if (state.treasuryBalance >= amount) {
          const transaction: Transaction = {
            id: crypto.randomUUID(),
            type: 'allocate',
            amount,
            from: 'Treasury',
            to,
            timestamp: new Date(),
            status: 'pending',
            description,
            role: 'fund-manager',
          };
          set((state) => ({
            treasuryBalance: state.treasuryBalance - amount,
            transactions: [transaction, ...state.transactions],
          }));
        }
      },

      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        };
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
      },

      approveTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, status: 'approved' } : t
          ),
        }));
      },

      rejectTransaction: (id) => {
        set((state) => {
          const transaction = state.transactions.find((t) => t.id === id);
          let newBalance = state.treasuryBalance;

          // If a pending allocation is rejected, revert the funds to treasury
          if (transaction && transaction.status === 'pending' && transaction.type === 'allocate') {
            newBalance += transaction.amount;
          }

          return {
            treasuryBalance: newBalance,
            transactions: state.transactions.map((t) =>
              t.id === id ? { ...t, status: 'rejected' } : t
            ),
          };
        });
      },

      logout: () => set({ userRole: null, isAuthenticated: false }),

      // Admin actions
      assignDigitalId: (userId, digitalIdId) => {
        const state = get();
        const user = state.registeredUsers.find(u => u.id === userId);
        const digitalId = state.digitalIds.find(d => d.id === digitalIdId);

        if (!user || !digitalId || digitalId.status !== 'available') return;

        const transaction: Transaction = {
          id: crypto.randomUUID(),
          type: 'assign-id',
          amount: 0,
          from: 'Admin',
          to: user.name,
          timestamp: new Date(),
          status: 'approved',
          description: `Assigned Digital ID ${digitalIdId} (${digitalId.ethAddress.slice(0, 10)}...)`,
          role: 'admin',
        };

        set((state) => ({
          digitalIds: state.digitalIds.map(d =>
            d.id === digitalIdId
              ? { ...d, assignedTo: user.name, assignedRole: user.role, assignedAt: new Date(), status: 'assigned' as const }
              : d
          ),
          registeredUsers: state.registeredUsers.map(u =>
            u.id === userId
              ? { ...u, digitalId: digitalIdId, ethAddress: digitalId.ethAddress, status: 'active' as const }
              : u
          ),
          transactions: [transaction, ...state.transactions],
        }));
      },

      revokeDigitalId: (userId) => {
        const state = get();
        const user = state.registeredUsers.find(u => u.id === userId);

        if (!user || !user.digitalId) return;

        const transaction: Transaction = {
          id: crypto.randomUUID(),
          type: 'revoke-id',
          amount: 0,
          from: 'Admin',
          to: user.name,
          timestamp: new Date(),
          status: 'approved',
          description: `Revoked Digital ID ${user.digitalId}`,
          role: 'admin',
        };

        set((state) => ({
          digitalIds: state.digitalIds.map(d =>
            d.id === user.digitalId
              ? { ...d, assignedTo: null, assignedRole: null, assignedAt: null, status: 'revoked' as const }
              : d
          ),
          registeredUsers: state.registeredUsers.map(u =>
            u.id === userId
              ? { ...u, digitalId: null, ethAddress: null, status: 'suspended' as const }
              : u
          ),
          transactions: [transaction, ...state.transactions],
        }));
      },

      addEthAccounts: (count) => {
        const state = get();
        const currentCount = state.digitalIds.length;
        const newAccounts: DigitalID[] = Array.from({ length: count }, (_, i) => ({
          id: `DID-${String(currentCount + i + 1).padStart(4, '0')}`,
          ethAddress: generateEthAddress(),
          assignedTo: null,
          assignedRole: null,
          assignedAt: null,
          status: 'available' as const,
        }));

        set((state) => ({
          digitalIds: [...state.digitalIds, ...newAccounts],
          ethAccountRequests: 0,
        }));
      },

      requestMoreAccounts: () => {
        set((state) => ({
          ethAccountRequests: state.ethAccountRequests + 5,
        }));
      },

      addUser: (userData) => {
        const newUser: RegisteredUser = {
          ...userData,
          id: `user-${crypto.randomUUID().slice(0, 8)}`,
          digitalId: null,
          ethAddress: null,
          registeredAt: new Date(),
          status: 'pending',
        };
        set((state) => ({
          registeredUsers: [...state.registeredUsers, newUser],
        }));
      },

      removeUser: (userId) => {
        const state = get();
        const user = state.registeredUsers.find(u => u.id === userId);

        if (user?.digitalId) {
          // Free up the digital ID
          set((state) => ({
            digitalIds: state.digitalIds.map(d =>
              d.id === user.digitalId
                ? { ...d, assignedTo: null, assignedRole: null, assignedAt: null, status: 'available' as const }
                : d
            ),
            registeredUsers: state.registeredUsers.filter(u => u.id !== userId),
          }));
        } else {
          set((state) => ({
            registeredUsers: state.registeredUsers.filter(u => u.id !== userId),
          }));
        }
      },

      updateUserProfile: (userId, data) => {
        set((state) => {
          const updatedUsers = state.registeredUsers.map((u) =>
            u.id === userId ? { ...u, ...data } : u
          );

          // Update current user if it's the one being edited
          const currentUser = state.currentUser?.id === userId
            ? { ...state.currentUser, ...data }
            : state.currentUser;

          return { registeredUsers: updatedUsers, currentUser };
        });
      },
    }),
    {
      name: 'glass-pipeline-storage',
    }
  )
);
