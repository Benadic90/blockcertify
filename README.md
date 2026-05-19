# BlockCertify — Blockchain-Based Certificate Verification System

BlockCertify is a full-stack MERN + Blockchain project for issuing and verifying certificates.
Only certificate hashes are stored on-chain for tamper-proof verification.

Tagline: **Verify Certificates. Prevent Fraud. Trust Blockchain.**

## Features
- Role-based authentication (`admin`, `student`) with JWT
- Admin can add students, upload PDF, issue certificates, revoke certificates
- Student can view/download issued certificates and copy certificate ID
- Public user can verify by:
  - Uploading certificate PDF
  - Entering certificate ID/hash
- Verification compares:
  - Uploaded file hash
  - MongoDB hash
  - Blockchain hash
  - Revocation status
- Smart contract stores only hash metadata (not full PDF)

## Tech Stack
- Frontend: React + Vite + Tailwind + Axios + Ethers
- Backend: Node.js + Express + MongoDB (Mongoose) + JWT + bcryptjs + multer
- Blockchain: Solidity + Hardhat + Ethers
- Deployment target:
  - Frontend: Vercel (free)
  - Backend: Render (free)
  - Database: MongoDB Atlas (free tier)
  - Network: Polygon Amoy or Ethereum Sepolia

## Project Structure
```text
blockcertify-mern-blockchain/
├── client/
├── server/
├── blockchain/
├── README.md
├── .gitignore
└── LICENSE
```

## Local Setup (Development)

## 1) Install dependencies
```bash
cd blockchain && npm install
cd ../server && npm install
cd ../client && npm install
```

## 2) Configure environment files
Create `.env` files from examples:

- `server/.env`
- `client/.env`
- `blockchain/.env`

## 3) Start local blockchain + deploy contract
```bash
cd blockchain
npx hardhat compile
npx hardhat node
```

In a second terminal:
```bash
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```

Copy deployed contract address into:
- `server/.env` as `CONTRACT_ADDRESS`
- `client/.env` as `VITE_CONTRACT_ADDRESS`

## 4) Seed demo data and run backend/frontend
```bash
cd server
npm run seed
npm run dev
```

In another terminal:
```bash
cd client
npm run dev
```

Frontend: `http://localhost:5173`

## Demo Credentials
- Admin:
  - Email: `admin@blockcertify.com`
  - Password: `admin123`
- Students:
  - `rahul@student.com` / `student123`
  - `ananya@student.com` / `student123`

## Environment Variables

## `client/.env`
```env
VITE_API_URL=http://localhost:5000
VITE_CONTRACT_ADDRESS=your_contract_address_here
```

## `server/.env`
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
CONTRACT_ADDRESS=your_deployed_contract_address
PRIVATE_KEY=your_wallet_private_key
RPC_URL=your_rpc_url
CLIENT_URL=https://your-vercel-frontend-url.vercel.app
```

## `blockchain/.env`
```env
PRIVATE_KEY=your_wallet_private_key
SEPOLIA_RPC_URL=your_sepolia_rpc_url
AMOY_RPC_URL=your_polygon_amoy_rpc_url
ETHERSCAN_API_KEY=optional
POLYGONSCAN_API_KEY=optional
```

## API Endpoints

## Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

## Admin
- `POST /api/admin/students`
- `GET /api/admin/students`
- `POST /api/admin/certificates/issue`
- `GET /api/admin/certificates`
- `PUT /api/admin/certificates/:id/revoke`

## Student
- `GET /api/student/certificates`

## Public Verification
- `POST /api/verify/upload`
- `GET /api/verify/:certificateId`
- `POST /api/verify/hash`

## Blockchain
- `POST /api/blockchain/issue`
- `GET /api/blockchain/verify/:certificateId/:hash`
- `PUT /api/blockchain/revoke/:certificateId`

## Health
- `GET /api/health`

Response:
```json
{
  "status": "ok",
  "message": "BlockCertify API is running"
}
```

## Free Deployment Guide

## A) Push project to GitHub
```bash
git init
git add .
git commit -m "Initial commit: BlockCertify"
git branch -M main
git remote add origin https://github.com/yourusername/blockcertify.git
git push -u origin main
```

## B) Create MongoDB Atlas database
1. Create free cluster on MongoDB Atlas.
2. Create database user.
3. Add IP access `0.0.0.0/0` (demo setup).
4. Copy MongoDB connection string.
5. Use it in Render as `MONGO_URI`.

## C) Deploy smart contract (Amoy or Sepolia)
1. Create Alchemy/Infura RPC URL.
2. Add testnet funds to MetaMask wallet.
3. Add private key and RPC URLs to `blockchain/.env`.
4. Deploy contract:
```bash
cd blockchain
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
# or
npx hardhat run scripts/deploy.js --network amoy
```
5. Copy deployed contract address.
6. Add address to backend/frontend envs.

Other deploy commands:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

## D) Deploy backend on Render
Create **New Web Service**:
- Connect GitHub repo
- Root Directory: `server`
- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

Set environment variables in Render:
```env
PORT=10000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CONTRACT_ADDRESS=your_contract_address
PRIVATE_KEY=your_private_key
RPC_URL=your_testnet_rpc_url
CLIENT_URL=https://your-vercel-url.vercel.app
```

Test after deploy:
- `https://your-render-backend-url.onrender.com/api/health`

## E) Deploy frontend on Vercel
Create project from GitHub:
- Root Directory: `client`
- Framework: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

Set Vercel environment variables:
```env
VITE_API_URL=https://your-render-backend-url.onrender.com
VITE_CONTRACT_ADDRESS=your_contract_address
```

Redeploy frontend after setting env vars.

## F) Final Testing Checklist
- [ ] Frontend opens on Vercel
- [ ] Backend health route works
- [ ] MongoDB connects successfully
- [ ] Admin login works
- [ ] Certificate PDF uploads
- [ ] Certificate hash generated
- [ ] Smart contract transaction succeeds
- [ ] Certificate verification works
- [ ] Modified PDF shows fake result
- [ ] Revoked certificate shows revoked result

## Production Notes
- Never commit `.env` files.
- Never expose wallet private key in frontend.
- Use testnet only for college demo.
- Render free services can sleep after inactivity.
- Vite env variables must start with `VITE_`.
- Uploaded PDFs are currently stored on local disk (`server/uploads`).
- Render free storage is ephemeral and can be reset on restart/redeploy.
- Future improvement: use Cloudinary (or similar free storage) for persistent PDF storage.

## Hardhat Commands
```bash
cd blockchain
npm run compile
npm run test
npm run node
npm run deploy
npm run deploy:sepolia
npm run deploy:amoy
```

## Screenshots Placeholder
Add screenshots for:
- Landing page
- Admin dashboard
- Student dashboard
- Verification success/failure/revoked

## License
MIT
