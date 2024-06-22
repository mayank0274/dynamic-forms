import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Level1 from "./components/Level1";
import Level2 from "./components/Level2";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Level1 />} />
        <Route path="/level2" element={<Level2 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
