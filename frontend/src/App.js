import "@/App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Landing from "@/pages/Landing";
import AdsLanding from "@/pages/AdsLanding";
import ThankYou from "@/pages/ThankYou";
import About from "@/pages/About";
import { Toaster } from "@/components/ui/sonner";
import { captureFromURL } from "@/lib/attribution";

/**
 * Capture click IDs (gclid/gbraid/wbraid/fbclid/msclkid) + UTM params on
 * every route change. Persists to localStorage for 90 days so outbound
 * Order CTAs to thefloorlord.com carry the attribution forward.
 */
function AttributionCapture() {
  const location = useLocation();
  useEffect(() => {
    captureFromURL();
  }, [location.pathname, location.search]);
  return null;
}

export default function App() {
  return (
    <HelmetProvider>
      <div className="App">
        <BrowserRouter>
          <AttributionCapture />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/ads" element={<AdsLanding />} />
            <Route path="/about" element={<About />} />
            <Route path="/thank-you" element={<ThankYou />} />
            {/* No catch-all: unknown paths render nothing inside <Routes>
                so react-helmet-async never momentarily registers Landing's
                tags on routes like /ads or /thank-you. Apache serves 404
                for genuinely-missing assets; blog routes are static. */}
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" />
      </div>
    </HelmetProvider>
  );
}
