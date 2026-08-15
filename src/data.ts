export type PageKey =
  | "home"
  | "service"
  | "products"
  | "update"
  | "sales"
  | "contact";

export const NAV_PAGES: PageKey[] = [
  "home",
  "service",
  "products",
  "update",
  "sales",
  "contact",
];

export const SERVICES = [
  {
    icon: "layout",
    name: "Custom UI Design",
    desc: "Full interface design for your Roblox game — menus, HUD, shops.",
    price: "$25",
  },
  {
    icon: "code",
    name: "Scripting",
    desc: "Gameplay systems, datastores, and clean modular code.",
    price: "$40",
  },
  {
    icon: "wand",
    name: "UI Animation",
    desc: "Smooth tweens, transitions, and juicy micro-interactions.",
    price: "$15",
  },
  {
    icon: "boxes",
    name: "Full Game Kit",
    desc: "Complete starter kit: UI, scripts, and systems wired together.",
    price: "$120",
  },
] as const;

export const PRODUCTS = [
  { name: "Nexus UI Pack", tag: "UI", price: 12 },
  { name: "Orbit Admin Suite", tag: "Script", price: 18 },
  { name: "Pulse FX Library", tag: "FX", price: 9 },
  { name: "Vault Save System", tag: "Script", price: 14 },
  { name: "Aero Shop UI", tag: "UI", price: 10 },
  { name: "Prism Inventory", tag: "UI", price: 11 },
  { name: "Echo Notification", tag: "UI", price: 6 },
  { name: "Flux Daily Rewards", tag: "Script", price: 8 },
  { name: "Nova Loading Screens", tag: "UI", price: 5 },
  { name: "Atlas Minimap", tag: "Script", price: 16 },
  { name: "Ember Combat HUD", tag: "UI", price: 13 },
  { name: "Drift Race Kit", tag: "Kit", price: 24 },
  { name: "Quantum Teleport", tag: "Script", price: 7 },
  { name: "Lume Settings Panel", tag: "UI", price: 9 },
  { name: "Zenith Leaderboard", tag: "Script", price: 10 },
  { name: "Pixel Pet System", tag: "Kit", price: 22 },
  { name: "Rune Quest Log", tag: "UI", price: 12 },
  { name: "Bolt Anti-Cheat", tag: "Script", price: 20 },
  { name: "Mist Weather FX", tag: "FX", price: 8 },
  { name: "Coin Economy Core", tag: "Script", price: 15 },
  { name: "Halo Gamepass Shop", tag: "UI", price: 11 },
  { name: "Vertex Build Tools", tag: "Kit", price: 26 },
  { name: "Sonic Sound Kit", tag: "FX", price: 6 },
  { name: "Grid Tycoon Base", tag: "Kit", price: 28 },
] as const;

export type Product = (typeof PRODUCTS)[number];

/* per-category meta — used on the product detail page */
export const TAG_META = {
  UI: {
    files: ".rbxm  ·  .fig",
    blurb:
      "Pixel-perfect interface pack built with clean hierarchy and consistent spacing. Drop it into your game, recolor the theme tokens, and ship.",
  },
  Script: {
    files: ".rbxm  ·  .lua",
    blurb:
      "Modular, fully-commented source with typed APIs and zero external dependencies. Configure everything from a single settings module.",
  },
  FX: {
    files: ".rbxm  ·  .ogg",
    blurb:
      "Lightweight effects tuned for performance on low-end devices. Every emitter and sound is neatly grouped and ready to customize.",
  },
  Kit: {
    files: ".rbxl  ·  .rbxm",
    blurb:
      "Complete starter kit with UI, scripts, and systems already wired together. Open the place file and start building on top.",
  },
} as const;

export const REVIEWS = [
  {
    user: "Rezz_Dev",
    rating: 5,
    text: "Insane quality for the price. Code is clean and the docs cover everything — had it running in ten minutes.",
    time: "2 days ago",
  },
  {
    user: "NoraStudios",
    rating: 5,
    text: "We use this in production. Updates come fast and support on Discord is really responsive.",
    time: "1 week ago",
  },
  {
    user: "pixel_mika",
    rating: 4,
    text: "Great asset overall. Would love more color presets out of the box, but theming it manually was easy.",
    time: "2 weeks ago",
  },
  {
    user: "DevArno",
    rating: 5,
    text: "Best purchase this year. Performance is solid even with 50+ players in the server.",
    time: "1 month ago",
  },
] as const;

export type PayMethod = "QRIS" | "E-Wallet" | "Crypto" | "PayPal";

export const PURCHASES: {
  user: string;
  product: string;
  price: string;
  time: string;
  method: PayMethod;
  methodDetail: string;
  txid: string;
}[] = [
  { user: "Rezz_Dev", product: "Nexus UI Pack", price: "$12", time: "2 min ago", method: "QRIS", methodDetail: "QRIS — Scan & Pay", txid: "AXZ-93F2K1" },
  { user: "bloxbuilder99", product: "Vault Save System", price: "$14", time: "11 min ago", method: "E-Wallet", methodDetail: "DANA", txid: "AXZ-88C4T7" },
  { user: "Kaito", product: "Drift Race Kit", price: "$24", time: "26 min ago", method: "Crypto", methodDetail: "USDT (BEP-20)", txid: "AXZ-71QW05" },
  { user: "NoraStudios", product: "Orbit Admin Suite", price: "$18", time: "1 hr ago", method: "PayPal", methodDetail: "PayPal Checkout", txid: "AXZ-66ML39" },
  { user: "pixel_mika", product: "Pulse FX Library", price: "$9", time: "2 hrs ago", method: "E-Wallet", methodDetail: "GoPay", txid: "AXZ-59XA82" },
  { user: "DevArno", product: "Bolt Anti-Cheat", price: "$20", time: "3 hrs ago", method: "QRIS", methodDetail: "QRIS — Scan & Pay", txid: "AXZ-52RB16" },
  { user: "Skyline_RBX", product: "Ember Combat HUD", price: "$13", time: "5 hrs ago", method: "Crypto", methodDetail: "BTC (Lightning)", txid: "AXZ-47PD63" },
  { user: "yuna.builds", product: "Pixel Pet System", price: "$22", time: "8 hrs ago", method: "E-Wallet", methodDetail: "OVO", txid: "AXZ-31GH94" },
  { user: "Tenshi", product: "Coin Economy Core", price: "$15", time: "12 hrs ago", method: "PayPal", methodDetail: "PayPal Checkout", txid: "AXZ-27VN58" },
  { user: "MonoDev", product: "Grid Tycoon Base", price: "$28", time: "1 day ago", method: "QRIS", methodDetail: "QRIS — Scan & Pay", txid: "AXZ-19SJ40" },
];

/* pending / unpaid orders — shown on the Cart page */
export type OrderStatus = "awaiting" | "expired" | "processing";

export const PENDING_ORDERS: {
  product: string;
  tag: string;
  price: number;
  method: PayMethod;
  methodDetail: string;
  txid: string;
  created: string;
  expires: string;
  status: OrderStatus;
}[] = [
  {
    product: "Drift Race Kit",
    tag: "Kit",
    price: 24,
    method: "QRIS",
    methodDetail: "QRIS — Scan & Pay",
    txid: "AXZ-84KD21",
    created: "8 min ago",
    expires: "52 min left",
    status: "awaiting",
  },
  {
    product: "Bolt Anti-Cheat",
    tag: "Script",
    price: 20,
    method: "E-Wallet",
    methodDetail: "DANA",
    txid: "AXZ-77BN45",
    created: "34 min ago",
    expires: "26 min left",
    status: "processing",
  },
  {
    product: "Sonic Sound Kit",
    tag: "FX",
    price: 6,
    method: "PayPal",
    methodDetail: "PayPal Checkout",
    txid: "AXZ-40PL93",
    created: "2 days ago",
    expires: "Expired",
    status: "expired",
  },
];

export const CHANGELOG = [
  {
    version: "v2.4.0",
    text: "New drag-and-drop layout builder for Nexus UI Pack.",
    date: "Aug 10, 2026",
  },
  {
    version: "v2.3.2",
    text: "Fixed tween easing bug in Pulse FX on mobile devices.",
    date: "Jul 28, 2026",
  },
  {
    version: "v2.3.0",
    text: "Orbit Admin Suite now supports role-based permissions.",
    date: "Jul 12, 2026",
  },
  {
    version: "v2.2.1",
    text: "Performance improvements across all UI components.",
    date: "Jun 30, 2026",
  },
];

export const CONTACTS = [
  {
    icon: "discord",
    name: "Discord",
    desc: "Join the community for support, previews, and updates.",
    value: "discord.gg/axzy",
  },
  {
    icon: "mail",
    name: "Email",
    desc: "For business inquiries, custom orders, and partnerships.",
    value: "hello@axzy.store",
  },
  {
    icon: "roblox",
    name: "Roblox",
    desc: "Check our group and experiences on the platform.",
    value: "AXZY Studio",
  },
] as const;

export const LICENSES = [
  { name: "Nexus UI Pack", version: "v2.4.0" },
  { name: "Orbit Admin Suite", version: "v2.3.0" },
  { name: "Pulse FX Library", version: "v1.9.1" },
  { name: "Vault Save System", version: "v1.2.0" },
  { name: "Drift Race Kit", version: "v3.0.2" },
  { name: "Ember Combat HUD", version: "v1.4.0" },
  { name: "Bolt Anti-Cheat", version: "v2.1.5" },
  { name: "Atlas Minimap", version: "v1.0.8" },
  { name: "Pixel Pet System", version: "v2.2.0" },
];
