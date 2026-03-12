import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Chat from "./pages/Chat";
import Visualizer from "./pages/Visualizer";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/visualizer" element={<Visualizer />} />
      </Routes>
    </BrowserRouter>
  );
}
