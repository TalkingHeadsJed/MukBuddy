import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App";
import { captureFromURL } from "@/lib/attribution";

// Capture click IDs (gclid/gbraid/wbraid/fbclid/msclkid) + UTMs BEFORE
// React mounts so the very first render of every Order CTA has access
// to the stored attribution via appendAttribution(). This is the
// difference between attributing a first-touch gclid click and dropping
// it on the floor.
captureFromURL();

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
