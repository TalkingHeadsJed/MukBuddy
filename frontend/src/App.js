import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import AdsLanding from "@/pages/AdsLanding";
import ThankYou from "@/pages/ThankYou";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/ads" element={<AdsLanding />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </div>
  );
}
