import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import WhySteamPage from "@/pages/WhySteamPage";
import { About } from "@/components/sections/About";
import { WhatIsSteam } from "@/components/sections/WhatIsSteam";
import { Programmes } from "@/components/sections/Programmes";
import { Events } from "@/components/sections/Events";
import { Register } from "@/components/sections/Register";
import { Faq } from "@/components/sections/Faq";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/what-is-steam" element={<WhatIsSteam />} />
          <Route path="/why-steam" element={<WhySteamPage />} />
          <Route path="/programmes" element={<Programmes />} />
          <Route path="/summer-camp" element={<Events />} />
          <Route path="/register" element={<Register />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
