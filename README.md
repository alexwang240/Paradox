# Paradox

**A Privacy-Preserving Blockchain Game Powered by Fully Homomorphic Encryption**

Paradox is an innovative blockchain-based number puzzle game that leverages Zama's FHEVM (Fully Homomorphic Encryption Virtual Machine) technology to enable truly private on-chain gaming. Players must find two numbers that sum to 24 from four encrypted random numbers, all while maintaining complete privacy of the values throughout the entire game lifecycle.

## Table of Contents

- [Overview](#overview)
- [The Game Concept](#the-game-concept)
- [Key Features](#key-features)
- [Why Paradox?](#why-paradox)
- [Technology Stack](#technology-stack)
- [Problems Solved](#problems-solved)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Smart Contract Architecture](#smart-contract-architecture)
- [Frontend Application](#frontend-application)
- [Testing](#testing)
- [Deployment](#deployment)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Overview

Paradox demonstrates the cutting-edge capabilities of Fully Homomorphic Encryption (FHE) in blockchain gaming. Unlike traditional blockchain games where all data is publicly visible on-chain, Paradox ensures that game state, random numbers, and player choices remain encrypted throughout the entire gameplay. The smart contract performs all computations on encrypted data without ever decrypting it, providing unprecedented privacy guarantees.

This project showcases:
- **True Privacy**: All random numbers and computations are performed on encrypted data
- **Verifiable Fairness**: Smart contract logic ensures fair gameplay without revealing information
- **User Experience**: Seamless wallet integration and intuitive gameplay interface
- **Educational Value**: Demonstrates practical implementation of FHE in decentralized applications

## The Game Concept

Paradox is inspired by the classic "24 Game" mathematical puzzle, adapted for the blockchain with a privacy-first approach.

### How to Play

1. **Start a Game**: Connect your wallet and start a new game round
2. **Receive Numbers**: The smart contract generates 4 encrypted random numbers (each between 1 and 20)
3. **Decrypt Locally**: Your client decrypts the numbers using your private key (only you can see them)
4. **Make Your Guess**: Select two of the four numbers that you think sum to 24
5. **Get Result**: The contract computes the encrypted absolute difference between your sum and 24
6. **Decrypt Result**: See how close you were to the target (0 means perfect match!)

### Privacy Guarantee

Throughout the entire process:
- Numbers are generated and stored encrypted on-chain
- The smart contract performs addition and comparison operations on encrypted values
- Other players and even blockchain observers cannot see your numbers or results
- Only you can decrypt your numbers and results using your private key

## Key Features

### Privacy-Preserving Gameplay
- All game state encrypted using FHEVM
- Computations performed on encrypted data (homomorphic operations)
- Client-side decryption ensures only the player sees their numbers
- Zero knowledge of game state to observers and other players

### Fair Random Number Generation
- Deterministic randomness using block hash, timestamp, and player nonce
- Range-bounded values (1-20) for balanced gameplay
- Verifiable on-chain without revealing values
- Each player maintains independent game state

### Modern Web3 Integration
- **RainbowKit**: Beautiful, responsive wallet connection UI
- **Wagmi**: Type-safe React hooks for Ethereum interactions
- **ethers.js v6**: Robust Ethereum library for contract interactions
- **Zama Relayer SDK**: Seamless FHE decryption service integration

### Developer-Friendly
- Comprehensive TypeScript type definitions
- Hardhat development environment with full tooling
- Extensive test coverage for smart contracts
- Clear separation of concerns (contracts, tests, deployment, frontend)
- Well-documented code and API

## Why Paradox?

### Advantages Over Traditional Blockchain Games

1. **True Privacy**: Traditional blockchain games expose all state on-chain, making it easy for players to cheat or front-run. Paradox ensures complete privacy through FHE.

2. **No Trusted Third Party**: Unlike off-chain computation solutions (oracles, state channels), all logic executes on-chain with cryptographic privacy guarantees.

3. **Verifiable Fairness**: Players can verify the game logic on-chain while maintaining privacy of actual values.

4. **Front-Running Prevention**: Since all values are encrypted, MEV (Maximal Extractable Value) attacks and front-running are impossible.

5. **Educational Platform**: Demonstrates practical FHE implementation, serving as a reference for developers building privacy-preserving dApps.

### Real-World Applications

While Paradox is a game, the underlying technology has broad applications:
- **Private DeFi**: Encrypted order books, dark pools, private auctions
- **Confidential Voting**: On-chain governance with vote privacy
- **Medical Records**: Private health data processing on blockchain
- **Supply Chain**: Confidential business logic and pricing
- **Gaming**: Poker, strategy games, and any application requiring hidden information

## Technology Stack

### Smart Contracts
- **Solidity 0.8.27**: Latest Solidity version with Cancun EVM features
- **FHEVM Protocol**: Zama's FHE-enabled virtual machine
- **@fhevm/solidity**: FHE operations library (encryption, addition, comparison, conditional selection)
- **Hardhat**: Development environment, testing framework, and task runner
- **TypeChain**: TypeScript bindings for smart contracts

### Frontend
- **React 19**: Latest React with improved performance and concurrent features
- **TypeScript**: Type-safe development experience
- **Vite**: Lightning-fast build tool and dev server
- **Wagmi v2**: React hooks for Ethereum
- **RainbowKit v2**: Beautiful wallet connection UI
- **ethers.js v6**: Ethereum wallet implementation and contract interaction
- **@zama-fhe/relayer-sdk**: Client library for FHE decryption

### Development Tools
- **Hardhat Deploy**: Deployment management and tracking
- **Hardhat Gas Reporter**: Gas usage optimization
- **Solidity Coverage**: Test coverage analysis
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Mocha/Chai**: Testing framework with assertion library

### Infrastructure
- **Sepolia Testnet**: Ethereum test network deployment
- **Infura**: RPC node provider
- **Etherscan**: Contract verification and exploration
- **Netlify**: Frontend hosting (configured via `netlify.toml`)

## Problems Solved

### 1. **On-Chain Privacy**

**Problem**: Traditional blockchain transparency exposes all data, making privacy-sensitive applications impossible.

**Solution**: FHEVM enables computations on encrypted data, allowing smart contracts to process private information without decryption.

### 2. **Verifiable Randomness with Privacy**

**Problem**: Generating random numbers on-chain is notoriously difficult, and most solutions either sacrifice decentralization, privacy, or fairness.

**Solution**: Paradox uses deterministic randomness from blockchain data (block hash, timestamp) combined with player-specific nonces, generating verifiable but private random numbers.

### 3. **Front-Running in Games**

**Problem**: Blockchain games suffer from MEV attacks where observers can see pending transactions and manipulate outcomes.

**Solution**: Encrypted game state prevents observers from gaining information advantages, eliminating front-running vectors.

### 4. **Complexity of FHE Development**

**Problem**: FHE is mathematically complex and difficult to implement correctly.

**Solution**: Paradox provides a clean, well-documented reference implementation that developers can learn from and adapt.

### 5. **User Experience in Privacy Dapps**

**Problem**: Privacy-preserving dApps often have poor UX due to key management complexity.

**Solution**: Integration with modern Web3 tooling (RainbowKit, Wagmi) provides familiar, user-friendly wallet interactions while maintaining privacy.

## Project Structure

```
Paradox/
├── contracts/              # Solidity smart contracts
│   └── Paradox.sol        # Main game contract with FHE logic
│
├── deploy/                # Hardhat deployment scripts
│   └── deploy.ts          # Paradox contract deployment
│
├── tasks/                 # Hardhat custom tasks
│   ├── accounts.ts        # Account management utilities
│   └── Zama24Game.ts      # Game interaction tasks
│
├── test/                  # Smart contract tests
│   ├── Zama24Game.ts      # Local network tests (mock FHE)
│   └── Zama24GameSepolia.ts  # Sepolia testnet integration tests
│
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── GameApp.tsx       # Main game interface
│   │   │   └── Header.tsx        # Header with wallet connection
│   │   ├── config/        # Configuration files
│   │   │   ├── contracts.ts      # Contract ABI and address
│   │   │   └── wagmi.ts         # Wagmi configuration
│   │   ├── hooks/         # Custom React hooks
│   │   │   ├── useEthersSigner.ts    # Wagmi to ethers adapter
│   │   │   └── useZamaInstance.ts    # FHE instance manager
│   │   ├── styles/        # CSS stylesheets
│   │   ├── App.tsx        # Root application component
│   │   └── main.tsx       # Application entry point
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.ts     # Vite configuration
│   ├── tsconfig.json      # TypeScript configuration
│   └── netlify.toml       # Netlify deployment config
│
├── types/                 # Generated TypeChain type definitions
├── artifacts/             # Compiled contract artifacts
├── cache/                 # Hardhat cache
│
├── hardhat.config.ts      # Hardhat configuration
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── .env                   # Environment variables (gitignored)
├── .gitignore            # Git ignore rules
└── LICENSE               # BSD-3-Clause-Clear License
```

## Getting Started

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm**: Version 7.0.0 or higher
- **MetaMask** or another Web3 wallet
- **Sepolia ETH**: For testnet deployment and testing (get from faucet)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/Paradox.git
   cd Paradox
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the project root:

   ```bash
   INFURA_API_KEY=your_infura_api_key_here
   PRIVATE_KEY=your_wallet_private_key_here
   ETHERSCAN_API_KEY=your_etherscan_api_key_here
   ```

   **Getting API Keys:**
   - **Infura**: Sign up at [infura.io](https://infura.io/) and create a project
   - **Etherscan**: Get API key at [etherscan.io/myapikey](https://etherscan.io/myapikey)
   - **Private Key**: Export from MetaMask (Account Details > Export Private Key)

   ⚠️ **Security Warning**: Never commit your `.env` file or share your private key!

4. **Compile contracts**

   ```bash
   npm run compile
   ```

5. **Run tests**

   ```bash
   npm run test
   ```

### Running Locally

1. **Start local Hardhat node**

   ```bash
   npx hardhat node
   ```

2. **Deploy to local network** (in another terminal)

   ```bash
   npx hardhat deploy --network localhost
   ```

3. **Install frontend dependencies**

   ```bash
   cd frontend
   npm install
   ```

4. **Configure contract address**

   Update `frontend/src/config/contracts.ts` with your deployed contract address.

5. **Start frontend development server**

   ```bash
   npm run dev
   ```

6. **Open in browser**

   Navigate to `http://localhost:5173` (or the URL shown in terminal)

7. **Connect wallet**

   Connect MetaMask and ensure you're on the Hardhat network (Chain ID: 31337)

### Deploying to Sepolia Testnet

1. **Get Sepolia ETH**

   Use a faucet like [sepoliafaucet.com](https://sepoliafaucet.com/) to get test ETH.

2. **Deploy contract**

   ```bash
   npx hardhat deploy --network sepolia
   ```

3. **Verify on Etherscan** (optional but recommended)

   ```bash
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
   ```

4. **Update frontend configuration**

   Update `frontend/src/config/contracts.ts` with the Sepolia contract address.

5. **Build and deploy frontend**

   ```bash
   cd frontend
   npm run build
   ```

   Deploy the `dist/` directory to your hosting provider (Netlify, Vercel, etc.)

## Smart Contract Architecture

### Paradox.sol

The core smart contract implements the game logic using FHEVM primitives.

#### Key Components

**State Variables**
```solidity
uint8 private constant _NUMBERS_PER_ROUND = 4;
uint32 private constant _MIN_VALUE = 1;
uint32 private constant _MAX_VALUE = 20;
```

**Game Structure**
```solidity
struct Game {
    euint32[4] numbers;      // Encrypted numbers
    bool hasNumbers;         // Has generated numbers
    euint32 lastResult;      // Last computed difference
    bool hasResult;          // Has submitted guess
    uint8 firstIndex;        // First selected index
    uint8 secondIndex;       // Second selected index
    uint256 round;           // Current round number
}
```

**Storage**
```solidity
mapping(address player => Game game) private _games;
mapping(address player => uint256 nonce) private _nonces;
```

#### Core Functions

**startGame()**
- Generates 4 encrypted random numbers (1-20)
- Stores encrypted numbers in player's game state
- Grants decryption permissions to player
- Increments player's round counter
- Emits `GameStarted` event

**submitGuess(uint8 firstIndex, uint8 secondIndex)**
- Validates indices are different and in range
- Retrieves encrypted numbers at specified indices
- Performs homomorphic addition: `sum = FHE.add(num1, num2)`
- Computes absolute difference from 24 using homomorphic operations:
  ```solidity
  isSumGreater = FHE.gt(sum, target);
  diffIfGreater = FHE.sub(sum, target);
  diffIfLower = FHE.sub(target, sum);
  result = FHE.select(isSumGreater, diffIfGreater, diffIfLower);
  ```
- Stores encrypted result with decryption permissions
- Emits `ResultComputed` event

**getEncryptedNumbers(address player)**
- Returns player's encrypted numbers array
- Requires player to have active game

**getLastResult(address player)**
- Returns encrypted difference from last guess
- Includes indices used and round number
- Returns boolean indicating if result exists

**hasActiveNumbers(address player)**
- Returns whether player has generated numbers

#### FHE Operations Used

- **FHE.asEuint32()**: Encrypts a plaintext uint32 value
- **FHE.add()**: Homomorphic addition of encrypted values
- **FHE.sub()**: Homomorphic subtraction of encrypted values
- **FHE.gt()**: Homomorphic greater-than comparison (returns encrypted boolean)
- **FHE.select()**: Homomorphic conditional selection (encrypted ternary operator)
- **FHE.allow()**: Grants decryption permission to an address
- **FHE.allowThis()**: Grants decryption permission to the contract itself

#### Security Considerations

1. **Randomness**: Uses `blockhash`, `timestamp`, `player address`, and `nonce` for randomness. Suitable for games but not for high-stakes applications.

2. **Access Control**: Each player has isolated game state. No cross-player interference possible.

3. **Decryption Permissions**: Carefully managed to ensure only authorized parties can decrypt values.

4. **Reentrancy**: All external calls are read-only, eliminating reentrancy risks.

## Frontend Application

### Architecture

The frontend is built with modern React practices using functional components and hooks.

#### Key Components

**GameApp.tsx**
- Main game interface component
- Manages game state (numbers, results, selections)
- Handles contract interactions
- Implements decryption logic using Zama Relayer SDK
- Responsive UI with loading states and error handling

**Header.tsx**
- Navigation bar with wallet connection
- RainbowKit integration for multi-wallet support
- Network indicator and account display

#### Custom Hooks

**useEthersSigner()**
- Converts Wagmi's Viem signer to ethers.js signer
- Enables compatibility with ethers-based libraries
- Memoized to prevent unnecessary re-renders

**useZamaInstance()**
- Initializes FHEVM instance for decryption
- Manages gateway URL and contract addresses
- Provides loading state
- Singleton pattern for efficiency

#### Contract Interaction Flow

1. **Start Game**
   ```typescript
   const contract = new Contract(address, abi, signer);
   const tx = await contract.startGame();
   await tx.wait();
   ```

2. **Fetch Encrypted Numbers**
   ```typescript
   const encryptedNumbers = await readContract({
     functionName: 'getEncryptedNumbers',
     args: [userAddress]
   });
   ```

3. **Decrypt Numbers**
   ```typescript
   const decrypted = await instance.decrypt(
     CONTRACT_ADDRESS,
     encryptedValue
   );
   ```

4. **Submit Guess**
   ```typescript
   const tx = await contract.submitGuess(firstIndex, secondIndex);
   await tx.wait();
   ```

5. **Fetch and Decrypt Result**
   ```typescript
   const [result, hasResult] = await contract.getLastResult(userAddress);
   const decrypted = await instance.decrypt(CONTRACT_ADDRESS, result);
   ```

### Styling

- **CSS Modules**: Scoped styles for each component
- **Responsive Design**: Mobile-first approach with flexbox/grid
- **RainbowKit Theme**: Customizable wallet UI matching app aesthetic
- **Loading States**: Spinners and disabled states for async operations

## Testing

### Smart Contract Tests

#### Local Tests (test/Zama24Game.ts)

Uses Hardhat's mock FHE environment for fast iteration:

```bash
npm run test
```

**Test Coverage:**
- ✅ Generates four random numbers within range (1-20)
- ✅ Numbers are properly encrypted and decryptable
- ✅ Returns absolute difference to 24
- ✅ Correctly computes encrypted difference
- ✅ Handles multiple rounds per player
- ✅ Maintains player isolation

#### Sepolia Integration Tests (test/Zama24GameSepolia.ts)

Tests against actual FHEVM deployment on Sepolia testnet:

```bash
npm run test:sepolia
```

**Requirements:**
- Deployed contract on Sepolia
- Funded wallet with Sepolia ETH
- Configured environment variables

### Frontend Testing

While not currently included, recommended testing approach:

- **Unit Tests**: Vitest for component logic
- **Integration Tests**: Testing Library for user interactions
- **E2E Tests**: Playwright or Cypress for full user flows

### Test Coverage

Generate coverage report:

```bash
npm run coverage
```

Coverage report will be generated in `coverage/` directory.

## Deployment

### Smart Contract Deployment

#### Local Network

```bash
# Terminal 1: Start Hardhat node
npx hardhat node

# Terminal 2: Deploy
npx hardhat deploy --network localhost
```

#### Sepolia Testnet

```bash
# Deploy
npx hardhat deploy --network sepolia

# Verify on Etherscan
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

**Post-Deployment:**
1. Copy contract address from deployment output
2. Update `frontend/src/config/contracts.ts` with new address
3. Commit contract address for team reference

### Frontend Deployment

#### Build Production Bundle

```bash
cd frontend
npm run build
```

#### Deploy to Netlify

**Option 1: Netlify CLI**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Option 2: Git Integration**
1. Connect repository to Netlify
2. Configure build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
3. Deploy automatically on push

**Option 3: Manual Upload**
1. Go to [netlify.com](https://www.netlify.com/)
2. Drag and drop `frontend/dist` folder

#### Deploy to Vercel

```bash
npm install -g vercel
cd frontend
vercel --prod
```

#### Environment Variables

Set these in your hosting provider's dashboard:
- `VITE_CONTRACT_ADDRESS`: Deployed Paradox contract address
- `VITE_NETWORK_ID`: Chain ID (31337 for local, 11155111 for Sepolia)

## Future Roadmap

### Phase 1: Enhanced Gameplay (Q2 2025)
- ✅ Basic 24 game with two numbers
- ⏳ Support for 3-number combinations with operators (+, -, ×, ÷)
- ⏳ Difficulty levels (different ranges and target numbers)
- ⏳ Leaderboard system (encrypted until reveal)
- ⏳ Time-based challenges
- ⏳ Daily challenges with rewards

### Phase 2: Multiplayer Features (Q3 2025)
- ⏳ Head-to-head competitive mode
- ⏳ Tournament system with bracket management
- ⏳ Wagering system with token support
- ⏳ Real-time multiplayer with encrypted state
- ⏳ Spectator mode (encrypted view)
- ⏳ Achievement system and badges

### Phase 3: Advanced Privacy Features (Q4 2025)
- ⏳ Private tournaments with entry fees
- ⏳ Anonymous leaderboards
- ⏳ Zero-knowledge proofs for score verification
- ⏳ Cross-chain deployment (Ethereum, Polygon, Arbitrum)
- ⏳ Private messaging between players
- ⏳ Encrypted replay system

### Phase 4: Platform Expansion (2026)
- ⏳ Mobile app (React Native)
- ⏳ Additional game modes (other math puzzles)
- ⏳ NFT rewards for achievements
- ⏳ DAO governance for game parameters
- ⏳ SDK for developers to create FHE games
- ⏳ Educational resources and tutorials

### Technical Improvements
- ⏳ Gas optimization for FHE operations
- ⏳ Improved UI/UX with animations
- ⏳ Comprehensive test suite (unit + E2E)
- ⏳ Continuous integration/deployment
- ⏳ Security audits
- ⏳ Performance monitoring and analytics
- ⏳ Multi-language support (i18n)

### Research Directions
- ⏳ Novel FHE game mechanics
- ⏳ Privacy-preserving randomness improvements
- ⏳ Optimizations for mobile FHE decryption
- ⏳ Layer 2 FHE solutions for scalability

## Contributing

We welcome contributions from the community! Whether it's bug reports, feature requests, documentation improvements, or code contributions, your help is appreciated.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Run tests** (`npm run test`)
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Development Guidelines

- Follow existing code style (enforced by ESLint/Prettier)
- Write tests for new features
- Update documentation for significant changes
- Keep commits atomic and well-described
- Ensure all tests pass before submitting PR

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards others

### Areas for Contribution

- **Smart Contracts**: Optimize gas, add features, improve security
- **Frontend**: UI/UX improvements, new components, accessibility
- **Testing**: Increase coverage, add E2E tests, security testing
- **Documentation**: Improve README, add tutorials, create guides
- **DevOps**: CI/CD improvements, deployment automation
- **Research**: FHE optimization, new game mechanics

## License

This project is licensed under the **BSD-3-Clause-Clear License**.

Copyright © 2025 ZAMA. All rights reserved.

See the [LICENSE](LICENSE) file for full details.

### Third-Party Licenses

This project uses open-source software:
- FHEVM Protocol: BSD-3-Clause-Clear (Zama)
- Hardhat: MIT License
- React: MIT License
- ethers.js: MIT License
- And others (see package.json)

## Support

### Documentation

- **FHEVM Documentation**: [docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **Hardhat Guide**: [hardhat.org/hardhat-runner/docs](https://hardhat.org/hardhat-runner/docs)
- **React Documentation**: [react.dev](https://react.dev/)
- **Wagmi Documentation**: [wagmi.sh](https://wagmi.sh/)

### Community

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/Paradox/issues)
- **Zama Discord**: [discord.gg/zama](https://discord.gg/zama)
- **Developer Forum**: [community.zama.ai](https://community.zama.ai/)

### Getting Help

- **Bug Reports**: Use GitHub Issues with detailed reproduction steps
- **Feature Requests**: Open an issue with [Feature Request] prefix
- **Questions**: Ask in Zama Discord #fhevm-help channel
- **Security Issues**: Email security@zama.ai (do not open public issue)

---

**Built with privacy in mind** | Powered by [Zama FHEVM](https://www.zama.ai/fhevm)
