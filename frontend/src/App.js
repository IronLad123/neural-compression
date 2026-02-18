import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Console from "./pages/Console";
import Analysis from "./pages/Analysis";
import Results from "./pages/Results";
import About from "./pages/About";
import Live from "./pages/Live";
import SpaceLayout from "./components/SpaceLayout";

function App() {
  return (
    <SpaceLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/console" element={<Console />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/results" element={<Results />} />
        <Route path="/about" element={<About />} />
        <Route path="/live" element={<Live />} />
      </Routes>
    </SpaceLayout>
  );
}

export default App;
