# Triangles Block Explorer

Modern, fast block explorer for the [Triangles (TRI)](https://cryptographic-triangles.org) cryptocurrency blockchain.

![Triangles Explorer](https://img.shields.io/badge/Triangles-Explorer-dc2626?style=for-the-badge)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

## Features

- **Real-time blockchain data** — Latest blocks, transactions, and mempool
- **PoS staking info** — Network weight, difficulty, expected stake time
- **Address lookup** — View balances, UTXOs, and transaction history
- **Network stats** — Peer connections, supply, difficulty
- **Dark theme** — Black and red color scheme matching Triangles branding
- **Server-side rendering** — Fast initial page loads with SvelteKit SSR
- **Caching & deduplication** — Optimized API calls to minimize RPC load

## Tech Stack

- **Frontend:** [SvelteKit](https://kit.svelte.dev/) + [TailwindCSS](https://tailwindcss.com/)
- **API:** [Express.js](https://expressjs.com/) REST API (separate repo: [triangles-api](https://github.com/SamiAhmed7777/triangles-api))
- **RPC:** Direct connection to `trianglesd` daemon via JSON-RPC
- **Charts:** [Chart.js](https://www.chartjs.org/) for staking statistics

## Prerequisites

- Node.js v18+ and npm
- Running `trianglesd` node with RPC enabled
- `trianglesd` config requirements:
  ```conf
  server=1
  rpcuser=trianglesrpc
  rpcpassword=<your-secure-password>
  rpcallowip=127.0.0.1
  rpcport=19112
  txindex=1  # Required for full transaction lookup
  ```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/SamiAhmed7777/triangles-explorer.git
cd triangles-explorer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env` file:

```env
TRIANGLES_API_URL=http://127.0.0.1:3051
```

This should point to your running `triangles-api` backend (see [triangles-api setup](https://github.com/SamiAhmed7777/triangles-api)).

### 4. Build for production

```bash
npm run build
```

### 5. Run

#### Development mode:
```bash
npm run dev
```

#### Production mode:
```bash
PORT=3050 node build/index.js
```

## Deployment

### Systemd Service

Create `/etc/systemd/system/triangles-explorer.service`:

```ini
[Unit]
Description=Triangles Block Explorer (Frontend)
After=network.target triangles-api.service
Wants=triangles-api.service

[Service]
Type=simple
User=root
WorkingDirectory=/path/to/triangles-explorer
Environment="NODE_ENV=production"
Environment="PORT=3050"
Environment="HOST=0.0.0.0"
Environment="TRIANGLES_API_URL=http://127.0.0.1:3051"
ExecStart=/usr/bin/node build/index.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable triangles-explorer.service
sudo systemctl start triangles-explorer.service
```

### Reverse Proxy (Caddy)

Example Caddyfile (`/etc/caddy/sites/tri.sami.caddy`):

```caddy
tri.sami {
    tls internal
    reverse_proxy localhost:3050
    log {
        output file /var/log/caddy/tri.sami.log
    }
}
```

Reload Caddy:

```bash
sudo systemctl reload caddy
```

## API Endpoints (via triangles-api)

The frontend fetches data from these REST endpoints:

| Endpoint | Description |
|----------|-------------|
| `/rest/chaininfo` | Blockchain info (height, supply, difficulty) |
| `/rest/block/:hash` | Block by hash |
| `/rest/blockbyheight/:height` | Block by height |
| `/rest/tx/:txid` | Transaction by ID |
| `/rest/mempool` | Unconfirmed transactions |
| `/rest/staking` | PoS staking info |
| `/rest/mining` | Mining info |
| `/rest/network` | Network info (peers, version) |
| `/rest/peers` | Connected peers |
| `/rest/address/:addr/*` | Address balance, UTXOs, txids |

## Development

### Project Structure

```
triangles-explorer/
├── src/
│   ├── routes/           # SvelteKit pages
│   │   ├── +layout.svelte      # Header, nav, footer
│   │   ├── +page.svelte        # Homepage (dashboard)
│   │   ├── block/[hash]/       # Block detail page
│   │   ├── tx/[txid]/          # Transaction detail page
│   │   ├── address/[addr]/     # Address page
│   │   ├── blocks/             # Recent blocks
│   │   ├── staking/            # Staking stats
│   │   ├── network/            # Network stats
│   │   └── mempool/            # Mempool viewer
│   ├── lib/
│   │   ├── api.ts              # API client functions
│   │   ├── types.ts            # TypeScript types
│   │   ├── utils.ts            # Formatters (hash, amount, time)
│   │   └── components/         # Reusable components
│   ├── app.css                 # Theme colors
│   └── hooks.server.ts         # Server hooks
├── build/                # Production build (after `npm run build`)
├── package.json
└── svelte.config.js
```

### Theme Colors

Defined in `src/app.css`:

```css
@theme {
  --color-tri-bg: #000000;          /* Pure black background */
  --color-tri-surface: #1a0000;     /* Dark red surface */
  --color-tri-border: #330000;      /* Darker red borders */
  --color-tri-accent: #dc2626;      /* Red accent (primary) */
  --color-tri-accent-light: #ef4444;/* Lighter red */
  --color-tri-text: #ffffff;        /* White text */
  --color-tri-muted: #999999;       /* Muted gray */
}
```

## Contributing

Contributions welcome! Please:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Links

- **🔗 Live Block Explorer:** https://blocks.cryptographic-triangles.org
- **Triangles Website:** https://cryptographic-triangles.org
- **Explorer API:** https://github.com/SamiAhmed7777/triangles-api
- **Discord:** https://discord.gg/triangles
- **Internal Access:** https://tri.sami (Tailscale)

## Acknowledgments

Based on the excellent [Mazacoin Explorer](https://github.com/sami7777/mazacoin-explorer) codebase.

---

**Made with ❤️ for the Triangles community 💎**
