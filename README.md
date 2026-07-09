# 🛡️ USDT Watchdog

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![viem](https://img.shields.io/badge/viem-2.x-4E44CE)](https://viem.sh/)

> **Real-time Ethereum USDT (Tether) Transfer Monitor** — A professional-grade blockchain monitoring dashboard built with Next.js, TypeScript, viem, and Tailwind CSS.

🔗 **Live Demo**: [https://usdt-watchdog.vercel.app](https://usdt-watchdog.vercel.app) *(Replace with your deployed URL)*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FCodingGeoff%2FUSDT-Watchdog&env=NEXT_PUBLIC_RPC_URL&envDescription=Ethereum%20RPC%20endpoint%20(e.g.%20https%3A%2F%2Frpc.ankr.com%2Feth)&project-name=usdt-watchdog&repository-name=usdt-watchdog)
[![Deploy to GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-222?logo=github)](https://github.com/CodingGeoff/USDT-Watchdog/settings/pages)

---

## ✨ Features

### 🔗 Real-time Blockchain Monitoring
- **Live Block Tracking**: Automatically watches new Ethereum blocks and displays the latest block height and hash in real-time.
- **USDT Transfer Events**: Captures and displays the most recent USDT (ERC-20) `Transfer` events with sender, receiver, and amount.
- **Auto-Refresh & Live Toggle**: Supports automatic polling with pause/resume controls, plus manual refresh.

### 📊 Rich Statistics Dashboard
- **Transaction Volume**: Total USDT volume of captured transfers.
- **Transaction Count**: Total number of transfers monitored in the session.
- **Large Transfer Detection**: Highlights transfers ≥ 100,000 USDT with amber warning styling.
- **Average Transfer Size**: Average value per transaction.

### 📈 API Usage Statistics Panel
- **Call Tracking**: Tracks every `eth_getBlockByNumber` and `eth_getLogs` RPC call.
- **Latency Metrics**: Records average response time per call.
- **Success/Error Rate**: Monitors API health and error rates.
- **Time-based Aggregation**: Hourly and daily call statistics.
- **Cost Estimation**: Estimated monthly cost based on Alchemy Growth tier pricing (300M CU / $49).
- **Local Persistence**: Statistics are saved to `localStorage` and persist across sessions.
- **Reset Capability**: One-click reset to clear accumulated stats.

### 🎨 Modern UI/UX
- **Dark Mode Design**: Sleek, professional dark theme optimized for data-heavy dashboards.
- **Tailwind CSS**: Fully responsive layout (mobile → tablet → desktop).
- **Framer Motion Animations**: Smooth entrance animations for cards and lists.
- **Glassmorphism**: Subtle backdrop blur and translucent surfaces.
- **Copy-to-Clipboard**: One-click copy for addresses and transaction hashes.
- **Etherscan Links**: Direct links to Etherscan for every transaction and wallet address.
- **Loading Skeletons**: Graceful loading states for better perceived performance.
- **Error Handling**: Clear error banners with retry capability.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18
- **npm** or **yarn**

### 1. Clone & Install

```bash
git clone https://github.com/codinggeoff/usdt-watchdog.git
cd usdt-watchdog
npm install
```

### 2. Configure Environment

Copy the example environment file and edit it:

```bash
cp .env.example .env.local
```

```env
# Option A: Free public node (default, no API key needed)
NEXT_PUBLIC_RPC_URL=https://rpc.ankr.com/eth

# Option B: Your own Alchemy / Infura / QuickNode endpoint
# NEXT_PUBLIC_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
```

> ⚠️ **Security Note**: Because this is a statically-exported client-side app, the RPC URL is embedded in the frontend bundle. For production with a paid API key, consider using a backend proxy or Vercel Edge Function to keep your key secret.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
```

The static export will be generated in the `dist/` folder.

---

## 🚀 Deployment

### Option A: Vercel (Recommended)

Click the **Deploy with Vercel** button above, or follow these steps:

1. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repository.
2. Set the environment variable:
   - `NEXT_PUBLIC_RPC_URL` = `https://rpc.ankr.com/eth` (or your own node)
3. Click **Deploy**. Vercel will automatically build and host your project.

> **Advantage**: Zero-config CI/CD, automatic preview deployments on PRs, and custom domains.

### Option B: GitHub Pages (Free & Static)

1. In your repo, go to **Settings > Pages**.
2. Under **Build and deployment**, select **Source: GitHub Actions**.
3. Create `.github/workflows/deploy.yml` with the following content:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [master, main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: "pages"
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
```

4. Push the workflow file to `master` or `main`.
5. GitHub Actions will build and deploy automatically. Your site will be live at `https://codinggeoff.github.io/USDT-Watchdog/`.

### Option C: Manual Static Hosting

Upload the contents of the `dist/` folder to any static hosting provider:
- **Netlify Drop**: [netlify.com/drop](https://app.netlify.com/drop)
- **Cloudflare Pages**: Drag & drop the `dist/` folder in the Cloudflare dashboard.
- **AWS S3 / CloudFront**: Upload `dist/` to an S3 bucket with static hosting enabled.

---

## 📁 Project Structure

```
USDT-Watchdog/
├── app/
│   ├── components/
│   │   ├── Header.tsx           # Sticky top bar with live indicator & block info
│   │   ├── StatsCard.tsx        # 4 summary metric cards (volume, count, large txns, avg)
│   │   ├── ApiUsagePanel.tsx    # Collapsible API usage dashboard
│   │   ├── TransferCard.tsx     # Individual USDT transfer card with Etherscan links
│   │   └── LoadingSkeleton.tsx  # Skeleton placeholders for loading states
│   ├── hooks/
│   │   ├── useApiStats.ts       # Hook for tracking & persisting API usage stats
│   │   └── useUsdtTransfers.ts  # Hook for blockchain data fetching & real-time watch
│   ├── lib/
│   │   ├── utils.ts             # Formatting, truncation, Etherscan links
│   │   └── client.ts            # viem public client configuration
│   ├── globals.css              # Global Tailwind styles + dark scrollbar
│   ├── layout.tsx               # Root layout with metadata
│   └── page.tsx                 # Main page assembling all components
├── public/                      # Static assets
├── next.config.mjs              # Next.js config (static export)
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript paths alias (@/*)
├── .env.example                 # Environment variable template
└── README.md                    # This file
```

---

## 🧩 Architecture & Design Decisions

### 1. Static Export (SPA Mode)
We use `output: 'export'` in `next.config.mjs` to produce a fully static site that can be hosted on any CDN (Vercel, GitHub Pages, Cloudflare Pages, etc.).

> **Trade-off**: API Routes are not available in static export. Therefore, the RPC client runs entirely in the browser. If you need to hide API keys, switch to SSR mode (`output: 'standalone'`) and add a `/api/proxy` route.

### 2. Client-Side Data Fetching
All blockchain interaction is done via [viem](https://viem.sh/) in the browser:
- `getBlock({ blockTag: 'latest' })` — fetches the latest block.
- `getLogs({ address, event, fromBlock, toBlock })` — fetches USDT Transfer events.
- `watchBlockNumber()` — real-time subscription to new blocks (via HTTP polling fallback in viem).

### 3. State Management
- **React Hooks** (`useState`, `useEffect`, `useCallback`) for local state.
- **Custom Hooks** (`useUsdtTransfers`, `useApiStats`) for encapsulating business logic.
- **localStorage** for persisting API usage statistics across sessions.

### 4. Styling Strategy
- **Tailwind CSS**: Utility-first, fully responsive, dark-first palette.
- **Color Tokens**: Slate scale (`slate-950` → `slate-100`) for consistent dark mode.
- **Accent Colors**: Emerald (live), Amber (large transfers), Indigo (links), Blue (stats).

### 5. Performance Optimizations
- **De-duplication**: Transfer records are deduplicated by `transactionHash`.
- **Limiting**: Only the most recent 100 transfers are kept in memory.
- **Animation Throttling**: Staggered `framer-motion` animations prevent layout thrashing.
- **Skeleton Loading**: Reduces perceived latency while waiting for RPC responses.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type safety and developer experience |
| **viem** | Lightweight Ethereum client library |
| **Tailwind CSS** | Utility-first CSS framework |
| **Framer Motion** | Declarative animations |
| **Lucide React** | Beautiful, consistent icons |
| **clsx + tailwind-merge** | Conditional class name utilities |

---

## 📝 API Usage & Cost Monitoring

The dashboard includes a built-in **API Usage Panel** that helps you understand your RPC consumption:

| Metric | Description |
|--------|-------------|
| **Total Calls** | Cumulative count of all RPC requests |
| **Last Hour / 24h** | Rolling window counts |
| **Avg Latency** | Mean response time in milliseconds |
| **Success Rate** | Percentage of successful requests |
| **Estimated CU** | Approximate Compute Units (based on average ~50 CU per call) |
| **Estimated Cost** | Projected monthly cost using Alchemy Growth tier ($49 / 300M CU) |

> **Note**: The cost estimate is approximate. Actual CU consumption varies by method (`eth_getLogs` ≈ 75 CU, `eth_getBlockByNumber` ≈ 16 CU). Use this as a guideline, not a bill.

---

## 🐛 Known Issues & Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "No transfers found" | The monitored block range may have no USDT activity. | Wait a few seconds or click **Refresh**. |
| High error rate | Public RPC nodes may rate-limit. | Switch to a dedicated node (Alchemy/Infura) or reduce polling frequency. |
| Data not persisting | `localStorage` is disabled or cleared. | Enable browser storage and avoid private/incognito mode. |
| Large transfer count seems low | Only transactions within the last 10 blocks are scanned. | This is intentional to limit API usage. |

---

## 🎯 Roadmap / Future Improvements

- [ ] **Multi-chain Support**: Extend to BSC, Arbitrum, Optimism, Polygon.
- [ ] **Price Feed Integration**: Show USD value of transfers using Chainlink or CoinGecko.
- [ ] **Whale Alerts**: Push notifications (Web Push / Telegram Bot) for transfers > $1M.
- [ ] **Historical Charts**: Recharts or Tremor for volume/time charts.
- [ ] **Backend Proxy**: Next.js API route to hide RPC keys and enable server-side caching.
- [ ] **Wallet Authentication**: Connect MetaMask to personalize the dashboard.
- [ ] **Dark/Light Theme Toggle**: Currently dark-first; add light mode support.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository.
2. **Create a branch**: `git checkout -b feature/my-feature`.
3. **Commit** your changes: `git commit -m 'Add new feature'`.
4. **Push** to the branch: `git push origin feature/my-feature`.
5. **Open a Pull Request** on GitHub.

### Issues Resolved in This Release
- [#2](https://github.com/CodingGeoff/USDT-Watchdog/issues/2) — UI/UX Redesign: Modernized dark theme, responsive layout, animations, and Etherscan integration.
- [#3](https://github.com/CodingGeoff/USDT-Watchdog/issues/3) — API Usage Stats: Added comprehensive RPC usage tracking, latency monitoring, and cost estimation.
- [#4](https://github.com/CodingGeoff/USDT-Watchdog/issues/4) — Engineering Improvements: Migrated from inline styles to Tailwind, added error handling, loading states, and static export configuration.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) by Vercel
- [viem](https://viem.sh/) by Wevm
- [Tailwind CSS](https://tailwindcss.com/) by Tailwind Labs
- [Framer Motion](https://www.framer.com/motion/) by Framer
- [Lucide](https://lucide.dev/) by Lucide Contributors
- [Etherscan](https://etherscan.io/) for block explorer links

---

## 📬 Contact

For questions, feedback, or collaboration:

- **Email**: supergreatgeoff@gmail.com
- **GitHub Issues**: [github.com/CodingGeoff/USDT-Watchdog/issues](https://github.com/CodingGeoff/USDT-Watchdog/issues)

---

<p align="center">
  <sub>Built with 💚 by <a href="https://github.com/CodingGeoff">@CodingGeoff</a></sub>
</p>
