import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import WhySteamPage from "@/pages/WhySteamPage";
import Gallery from "@/pages/Gallery";
import Documents from "@/pages/Documents";
import { About } from "@/components/sections/About";
import { WhatIsSteam } from "@/components/sections/WhatIsSteam";
import { Programmes } from "@/components/sections/Programmes";
import { Events } from "@/components/sections/Events";
import { Register } from "@/components/sections/Register";
import { Faq } from "@/components/sections/Faq";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/what-is-steam" element={<WhatIsSteam />} />
            <Route path="/why-steam" element={<WhatIsSteam />} />
            <Route path="/programmes" element={<Programmes />} />
            <Route path="/thematic-workshops" element={<Events />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/register" element={<Register />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;