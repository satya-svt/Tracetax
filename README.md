# TraceTax

TraceTax is a decentralized Web3 application designed to bring unprecedented transparency and accountability to government tax collection and public spending. By leveraging blockchain technology and Decentralized Identifiers (DIDs), TraceTax ensures that tax funds are securely allocated to public projects and disbursed only to verified, legitimate contractors—virtually eliminating corruption and financial leakage.

## Overview

TraceTax introduces a role-based ecosystem where different stakeholders participate in the lifecycle of public funds. The core workflow involves tracking tax deposits, allocating budgets to specific government projects, and releasing payments to contractors only after rigorous identity verification by the Anti-Corruption Bureau (ACB).

### Key Features

*   **Transparent Fund Tracking:** All tax collections and project allocations are recorded on the blockchain, ensuring immutable transparency.
*   **Decentralized Identity (DID) Verification:** Contractors and entities receiving public funds must have their identities verified by the ACB before any payments are released.
*   **Anti-Corruption Gatekeeper:** The smart contract strictly enforces payment rules. If an unverified or blacklisted contractor attempts to receive funds, the transaction is blocked, and a `CorruptionFlag` is raised.
*   **Role-Based Dashboards:** Dedicated interfaces tailored for different ecosystem participants.
*   **Public Portal:** A "Glass Transparency" interface for citizens to view real-time statistics on tax collection, project budgets, and fund utilization.

## Ecosystem Roles

The frontend provides distinct experiences and permissions for each role:

1.  **Tax Collector (`/collector`):** Responsible for recording and depositing tax revenues into the TraceTax treasury.
2.  **Fund Manager (`/fund-manager`):** Responsible for creating government projects, assigning budgets, and initiating payment releases to contractors.
3.  **Anti-Corruption Bureau (ACB) (`/acb`):** Acts as the ecosystem's gatekeeper. Verifies and manages the DIDs of contractors to prevent fraudulent entities from receiving funds.
4.  **Company / Contractor (`/company`):** The entities executing public projects. Can view their assigned projects and track received payments.
5.  **Admin (`/admin`):** Manages the overall system configuration and user roles.
6.  **Public Citizen (`/public`):** Has view-only access to a transparency portal showcasing how tax money is being spent.

## Technology Stack

TraceTax is built with a modern, robust Web3 technology stack:

### Smart Contracts (Backend)
*   **Solidity:** For the core `TraceTax.sol` contract logic.
*   **Hardhat:** Ethereum development environment for compiling, testing, and deploying contracts.
*   **OpenZeppelin:** Secure smart contract libraries (e.g., `Ownable`).
*   **ethers.js:** For interacting with the blockchain.
*   **ethr-did:** For managing Decentralized Identifiers on Ethereum.

### Frontend
*   **React:** UI library.
*   **Vite:** Extremely fast frontend build tool.
*   **TypeScript:** For type-safe code.
*   **Tailwind CSS & shadcn/ui:** For modern, responsive, and beautiful styling.
*   **Framer Motion:** For smooth UI animations.
*   **Zustand & React Query:** For state management and data fetching.
*   **React Router:** For role-based navigation and routing.

## Project Structure

```
TraceTax/
├── contracts/            # Smart contracts (TraceTax.sol)
├── frontend/             # React/Vite frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Role-based dashboards (Admin, ACB, Public, etc.)
│   │   └── lib/          # Utilities and Web3 integration
├── scripts/              # Hardhat deployment scripts
├── hardhat.config.ts     # Hardhat configuration
└── package.json          # Root dependencies and scripts
```

## Getting Started

### Prerequisites
*   Node.js and npm/yarn installed.
*   A Web3 wallet (like MetaMask) for testing frontend interactions.

### Local Development

1.  **Install dependencies at the root level:**
    ```sh
    npm install
    ```

2.  **Compile Smart Contracts:**
    ```sh
    npx hardhat compile
    ```

3.  **Start the Frontend Development Server:**
    Navigate to the frontend directory and start Vite.
    ```sh
    cd frontend
    npm install
    npm run dev
    ```

The application will be accessible at `http://localhost:8080` (or the port specified by Vite).
