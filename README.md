# StackBlitz NEAR Starter Templates

Four ready-to-use NEAR Protocol starter templates with wallet-selector integration.

## Starters

| Framework | Directory | Run on StackBlitz |
|-----------|-----------|-------------------|
| React + NEAR | `react-near/` | [Open](https://stackblitz.com/github/worksOnMyFridge/stackblitz-near-starters/tree/main/react-near) |
| Next.js + NEAR | `nextjs-near/` | [Open](https://stackblitz.com/github/worksOnMyFridge/stackblitz-near-starters/tree/main/nextjs-near) |
| Vue + NEAR | `vue-near/` | [Open](https://stackblitz.com/github/worksOnMyFridge/stackblitz-near-starters/tree/main/vue-near) |
| Svelte + NEAR | `svelte-near/` | [Open](https://stackblitz.com/github/worksOnMyFridge/stackblitz-near-starters/tree/main/svelte-near) |

## Features (all starters)

- NEAR wallet-selector with MyNearWallet + HereWallet
- Connect / disconnect wallet
- Call smart contract (guest-book.testnet)
- Display transaction results
- Testnet by default (change `NETWORK` to `mainnet` for production)

## Quick Start

```bash
cd react-near   # or nextjs-near, vue-near, svelte-near
npm install
npm run dev
```

## Stack

- **React**: Vite + React 18 + wallet-selector
- **Next.js**: Next 14 (App Router) + TypeScript + wallet-selector
- **Vue**: Vite + Vue 3 (Options API) + wallet-selector
- **Svelte**: Vite + Svelte 4 + wallet-selector

## Configuration

Each starter connects to `guest-book.testnet`. To use your own contract:

1. Change `CONTRACT_ID` in the main component
2. Update `methodName` in `callContract` to match your contract's methods
3. Switch `NETWORK` to `mainnet` for production

Built by budget_skynet on NEAR Agent Market.
