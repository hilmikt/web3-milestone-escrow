# Web3 Milestone Escrow — Prototype

A prototype milestone‑based escrow system built with Solidity (Hardhat) and a Next.js App Router frontend. This is a learning/prototype build for Mintaro — not the final MVP. It demonstrates the full flow: create a milestone, fund it, client approval, and freelancer release.

============================================================
SECTION 0 — TL;DR COMMANDS (LOCAL DEV)
============================================================
From the project root:

1) Start local blockchain
npx hardhat node

2) Deploy contract to localhost (in another terminal)
npx hardhat run scripts/deploy.js --network localhost

3) Set the frontend env (in frontend/.env.local)
NEXT_PUBLIC_ESCROW_ADDRESS=0xTHE_ADDRESS_PRINTED_BY_DEPLOY
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545

4) Start the frontend (if root package.json has "dev": "cd frontend && next dev")
npm run dev
or (inside frontend/)
npm run dev

5) Run tests
npm test

============================================================
SECTION 1 — FEATURES
============================================================
Smart contracts
- Milestone creation with expected amount
- Funding in ETH held in escrow
- Client approval gate
- Freelancer release (pull‑payment) with basic reentrancy guard
- Cancel and refund prior to approval
- Custom errors and events

Frontend (Next.js App Router)
- Connect and disconnect wallet
- Create, fund, approve, release actions
- Role toggle to simulate client vs freelancer
- Pending and success feedback
- Simple, readable UI

Tooling
- Hardhat, Ethers, Viem, Wagmi
- ESLint v9 flat config, Prettier, Solhint
- Husky optional (can be disabled if it annoys Windows)

============================================================
SECTION 2 — TECH STACK
============================================================
Smart Contracts: Solidity 0.8.24 (optimizer 200)
Blockchain Tooling: Hardhat 2.26.x
Frontend: Next.js 15 (App Router), React, Wagmi, Viem, Ethers
Wallet: MetaMask (avoid multiple wallets enabled at once)
Node.js: 18 LTS or 20 LTS recommended

============================================================
SECTION 3 — REPO STRUCTURE
============================================================
contracts/                 Solidity sources
scripts/                   Deployment and interaction scripts
test/                      Hardhat tests
frontend/                  Next.js App Router app
  app/                     Layout, pages, UI
  components/              Reusable UI pieces (WalletBar, MilestoneForm, etc.)
  lib/                     Frontend helpers (ABI, address, utils)
  public/                  Static assets
  styles/                  Global CSS if used
artifacts/                 Build output (ignored by git)
cache/                     Build cache (ignored by git)

============================================================
SECTION 4 — SETUP
============================================================
Prerequisites
- Node.js 18 or 20
- npm
- MetaMask installed and unlocked
- Only one wallet extension enabled (prefer MetaMask)

Install deps (root)
npm install

If you created the Next.js app manually, install frontend deps
cd frontend
npm install
npm install wagmi viem ethers
(if you use RainbowKit later, install it too)

Environment file for frontend (create frontend/.env.local)
NEXT_PUBLIC_ESCROW_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545

You will replace the address above with the value printed by the deploy command.

============================================================
SECTION 5 — LOCAL DEVELOPMENT WORKFLOW
============================================================
Start local blockchain
npx hardhat node

Deploy the contract (new terminal)
npx hardhat run scripts/deploy.js --network localhost
Copy the deployed address that prints and paste it into frontend/.env.local as NEXT_PUBLIC_ESCROW_ADDRESS.

Start the frontend
Option A (root script): npm run dev
Option B (inside frontend/): npm run dev
Open http://localhost:3000

MetaMask network
Add Localhost 8545 (chain id 31337) if not present
RPC URL http://127.0.0.1:8545
Switch accounts to simulate roles (client versus freelancer)

============================================================
SECTION 6 — USING THE APP
============================================================
Roles
Client (payer): creates milestone, funds it, approves after delivery
Freelancer (payee): releases funds after approval

Steps
1. Create Milestone — enter expected amount in ETH, click Create
2. Fund — enter milestone id and fund amount, click Fund (from client account)
3. Approve — client confirms work delivered, click Approve
4. Release — switch to freelancer account and click Release to receive ETH

UI Tips
- Use the role toggle in the UI to remind which actions should be enabled
- If a transaction fails, read the on‑screen message; wrong role or state is the usual cause

============================================================
SECTION 7 — SCRIPTS AND TESTS
============================================================
Compile
npx hardhat compile

Run tests (12 passing if you kept both Lock and escrow tests)
npm test

Linting (JS and Solidity)
npm run lint
If you are on Windows and Solhint prints “No files to lint”, change the quotes around the glob in package.json to use double quotes.

Formatting
npm run format

============================================================
SECTION 8 — FRONTEND DETAILS
============================================================
Contract config
frontend/lib/escrow.(js|ts) should export ABI and read the address from NEXT_PUBLIC_ESCROW_ADDRESS.
Example
ESCROW_ADDRESS comes from process.env.NEXT_PUBLIC_ESCROW_ADDRESS
ESCROW_ABI is imported from your MilestoneEscrow ABI JSON

Wallet connection
Use only MetaMask to avoid multi‑wallet conflicts. If on Brave, disable Brave Wallet in settings and prefer extensions.

Hydration mismatches
If browser extensions inject attributes and you see hydration warnings, add suppressHydrationWarning to the html element in app/layout.

ESM helpers
If a helper inside frontend/lib throws import/export parsing errors, rename it to .mjs or mark it as a client module.

============================================================
SECTION 9 — COMMON ISSUES (QUICK FIXES)
============================================================
MetaMask popup does not appear
- Ensure MetaMask is enabled and unlocked
- Disable other wallet extensions (Brave Wallet, Coinbase Wallet, etc.)
- Call eth_requestAccounts before connect in your button handler
- Remove localhost from MetaMask Connected sites and try again

Hydration mismatch red overlay
- It happens when SSR and CSR markup differs or extensions mutate HTML
- Gate wallet UI with a mounted flag using useEffect
- Add suppressHydrationWarning on the html element in layout

Windows hardhat test assertion (libuv)
- Disable gasReporter in hardhat.config if you see a libuv assert after tests

Solhint glob on Windows
- Use double quotes in the npm script for contracts glob

Husky pre‑commit issues on Windows
- Keep .husky in git but ensure LF line endings and executable bit
- You can temporarily bypass with HUSKY=0 git commit -m "msg"

============================================================
SECTION 10 — GIT HYGIENE
============================================================
Make sure .gitignore covers:
node_modules/
.next/
artifacts/
cache/
out/
dist/
.env
.env.local

Keep package‑lock.json tracked for deterministic installs.

Conventional commits examples:
feat(escrow): add approve and release flow with events
fix(frontend): prevent hydration mismatch by gating WalletBar until mount
chore: update gitignore and formatting rules
docs(readme): expand setup and troubleshooting

============================================================
SECTION 11 — ROADMAP (NOT MVP)
============================================================
Short‑term (pre‑hackathon)
- Role‑enforced UI states (hide actions not allowed by role)
- Per‑milestone status badges (Created, Funded, Approved, Released)
- Basic success page and toasts for clarity
- Screenshots in README

Hackathon‑focused next steps
- True multi‑milestone dashboard with history
- Persistent storage for off‑chain display (indexer or simple backend)
- Better error surfacing and gas estimates in UI
- Security review checklist for contract edge cases

============================================================
SECTION 12 — LICENSE
============================================================
ISC License