# Web3 Milestone Escrow — Prototype

A prototype milestone-based escrow system built with Solidity (Hardhat) and a Next.js App Router frontend.  
This is a learning/prototype build for Mintaro — **not the final MVP**.  
It demonstrates the full flow: **create a milestone, fund it, client approval, and freelancer release.**

---

## 🚀 Quick Start (Local Development)

From the project root:

1. **Start local blockchain**
   ```npx hardhat node```

2. **Deploy contract to localhost (in another terminal)**
   ```npx hardhat run scripts/deploy.js --network localhost```

3. **Set the frontend environment variables** (in `frontend/.env.local`)
   NEXT_PUBLIC_ESCROW_ADDRESS=0xTHE_ADDRESS_PRINTED_BY_DEPLOY  
   NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545

4. **Start the frontend**
   - If root `package.json` has script:  
     ```npm run dev ```
   - Or inside `frontend/`:  
     ```npm run dev ```

5. **Run tests**
   ```npm test```

---

## ✨ Features

### Smart Contracts
- Milestone creation with expected amount
- Funding in ETH held in escrow
- Client approval gate
- Freelancer release (pull-payment) with reentrancy guard
- Cancel & refund prior to approval
- Custom errors and events

### Frontend (Next.js App Router)
- Connect / Disconnect wallet
- Create, fund, approve, release actions
- Role toggle (simulate client vs freelancer)
- Pending and success feedback
- Simple, readable UI

### Tooling
- Hardhat, Ethers, Viem, Wagmi
- ESLint v9 flat config, Prettier, Solhint
- Husky (optional, can be disabled on Windows)

---

## 🛠 Tech Stack

- **Smart Contracts**: Solidity 0.8.24  
- **Blockchain Tooling**: Hardhat 2.26.x  
- **Frontend**: Next.js 15 (App Router)  
- **Wallet Integration**: Wagmi + Viem  
- **Testing**: Hardhat + Chai/Mocha

---

## 📌 Notes
- This is a **prototype**, not the final Mintaro MVP.  
- Built as a learning project and stepping stone for hackathon readiness.  
- Expect rough edges — polishing will come during the hackathon sprint.
