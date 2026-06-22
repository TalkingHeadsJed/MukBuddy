import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App";

// Conditional hydrate vs. createRoot:
// - When the page was statically pre-rendered (by scripts/prerender.js) the
//   #root element already has children — we MUST hydrate, otherwise React
//   blows away the SSR markup and the prerender benefit is lost.
// - On first-time dev runs (or any page that wasn't prerendered) #root is
//   empty — use createRoot + render.
const rootEl = document.getElementById("root");
const tree = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, tree);
} else {
  createRoot(rootEl).render(tree);
}
