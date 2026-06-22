import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Landing from "@/pages/Landing";
import AdsLanding from "@/pages/AdsLanding";
import ThankYou from "@/pages/ThankYou";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <HelmetProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/ads" element={<AdsLanding />} />
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
