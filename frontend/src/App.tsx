import "./App.css";
import Header from "./Header";
import Home from "./routes/home";
import Chart from "./routes/chart";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chart" element={<Chart />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
