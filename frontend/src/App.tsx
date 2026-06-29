// Root application component.
// Manages global state: current page, active month, and recommendations list.
// Handles navigation between Home, Insights, Analytics and About pages.
// Wraps everything in ThemeProvider for dark/light mode support.
// ChatWidget is rendered at the root level so it appears on every page.
import { useState } from "react";

import Header from "./components/layout/Header";
import Home from "./pages/Home";
import Insights from "./pages/Insights";
import Analytics from "./pages/Analytics";
import About from "./pages/About";
import ChatWidget from "./components/chat/ChatWidget";

import type { Recommendation } from "./types/recommendation";

export type Page = "home" | "insights" | "analytics" | "about";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [month, setMonth] = useState(7);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header currentPage={currentPage} onNavigate={navigate} />
      {currentPage === "home"      && <Home month={month} setMonth={setMonth} recommendations={recommendations} setRecommendations={setRecommendations} />}
      {currentPage === "insights"  && <Insights initialMonth={month} recommendations={recommendations} />}
      {currentPage === "analytics" && <Analytics />}
      {currentPage === "about"     && <About />}
      <ChatWidget />
    </>
  );
}

export default App;
