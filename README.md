# Web3 Milestone Escrow — Prototype Contracts

A prototype milestone-based escrow system built with Solidity and Hardhat.  
Implements basic milestone funding and release logic suitable for freelance–client trustless payments.

## 🚀 Current Features
- Solidity contracts for milestone-based escrow
- Hardhat testing suite with example tests
- ESLint + Prettier + Solhint configured for clean, consistent code
- Local Hardhat network support

## 📂 Project Structure
- /contracts — Solidity contracts
- /scripts — Optional deployment and interaction scripts
- /test — Hardhat tests
- /artifacts, /cache — Generated build output (ignored by git)

## 🛠 Tech Stack
- Smart Contracts: Solidity 0.8.24
- Dev Environment: Hardhat 2.26.x
- Linting/Formatting: ESLint v9, Prettier, Solhint
- Testing: Mocha + Chai via Hardhat toolbox

## ⚡ Quick Start
1. Clone  
   git clone https://github.com/hilmikt/web3-milestone-escrow.git  
   cd web3-milestone-escrow  

2. Install dependencies  
   npm install  

3. Format & lint  
   npm run format  
   npm run lint  

4. Compile  
   npx hardhat compile  

5. Run tests  
   npm test  

## 📜 License
ISC License — free to use and modify.

## 🙌 Contributing
PRs are welcome! Please run **npm run lint** and **npm test** before opening a pull request.