<div align="center">

<img src="Thumbnail.png" alt="AXZY — Store Web Modern" width="100%" />

# AXZY — Store Web Modern

**Modern one-page store for Roblox assets — horizontal page slider, animated UI, zero vertical scroll.**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=for-the-badge)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white&style=for-the-badge)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0080?logo=framer&logoColor=white&style=for-the-badge)](https://www.framer.com/motion/)

[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)
[![Build](https://img.shields.io/badge/Build-passing-22c55e?logo=vite&logoColor=white&style=flat-square)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-101012?style=flat-square)](#)

</div>

---

## Features

| | Feature | Description |
|---|---------|-------------|
| ![nav](https://img.shields.io/badge/-NAV-101012?style=flat-square) | **Horizontal navigation** | Mouse wheel, arrow keys, and touch swipe slide between pages — no vertical page scroll |
| ![fx](https://img.shields.io/badge/-FX-101012?style=flat-square) | **Reveal animations** | Every page replays its entrance animation on visit; sliding nav pill "tears" down from the panel |
| ![store](https://img.shields.io/badge/-STORE-101012?style=flat-square) | **Full store flow** | Product grid with live search → detail (carousel, rating, reviews) → checkout → transaction status |
| ![pay](https://img.shields.io/badge/-PAY-101012?style=flat-square) | **Payment methods** | QRIS · E-Wallet (DANA/GoPay/OVO) · Crypto · PayPal, with check-status / switch-method / cancel |
| ![auth](https://img.shields.io/badge/-AUTH-101012?style=flat-square) | **Profile sidebar** | Login/register with anti-bot check, activity chart, paginated licenses, edit profile (name + password) |
| ![log](https://img.shields.io/badge/-LOG-101012?style=flat-square) | **Sales log** | Expandable purchase rows with payment method, transaction ID, and status |
| ![bg](https://img.shields.io/badge/-BG-101012?style=flat-square) | **Layered background** | Dot grid, dark blush radials, and floating blurred circles keep the panel alive |
| ![link](https://img.shields.io/badge/-LINK-101012?style=flat-square) | **Hash routing** | Deep-link straight to any page: `/#products`, `/#sales`, `/#contact` |

## Pages

```mermaid
flowchart LR
    H(("01<br/>HOME")) --> S["02 SERVICE<br/>commissions"] --> P["03 PRODUCTS<br/>search · detail · checkout"] --> U["04 UPDATE<br/>changelog"] --> SA["05 SALES<br/>purchase log"] --> C["06 CONTACT<br/>discord · email · roblox"]

    P --> D["Product detail<br/>carousel · rating · reviews"]
    D --> CO["Checkout<br/>pick method · confirm"]
    CO --> TX["Transaction<br/>paid / cancelled / retry"]

    style H fill:#101012,stroke:#101012,color:#ffffff
    style P fill:#101012,stroke:#101012,color:#ffffff
    style D fill:#26262b,stroke:#26262b,color:#ffffff
    style CO fill:#26262b,stroke:#26262b,color:#ffffff
    style TX fill:#26262b,stroke:#26262b,color:#ffffff
```

## Quick start

```bash
git clone https://github.com/Arifxyzzz/Store-Modern.git
cd Store-Modern
npm install
cp .env.example .env   # then edit the dummy credentials
npm run dev
```

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server (Vite) |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview the production build |

### Local auth (frontend-only)

Login is validated against `.env` values — no backend needed while developing:

```env
VITE_AUTH_EMAIL=you@example.com
VITE_AUTH_USERNAME=YourName
VITE_AUTH_PASSWORD=yourpassword
```

## Tech stack

```
react 18 · vite 6 · typescript 5 · framer-motion · lucide-react
```

```
src/
├── App.tsx              # shell: header, pager, footer nav, wheel/key/touch handlers
├── data.ts              # products, services, purchases, reviews, licenses
├── components/
│   ├── Reveal.tsx       # scroll-in reveal wrapper
│   ├── ProfileAside.tsx # auth + profile + edit-profile sidebar
│   ├── ProductDetail.tsx# carousel, rating, specs, reviews
│   └── Checkout.tsx     # payment method picker + transaction status
├── pages/               # Home · Service · Products · Update · Sales · Contact
└── styles/global.css    # design system, all styling
```

## License

Released under the [MIT License](LICENSE) — free to use, modify, and distribute.

<div align="center">

Made by [**Arifxyzzz**](https://github.com/Arifxyzzz)

</div>
