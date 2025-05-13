// import Header from "./components/Header";
import { SessionProvider } from "./context/sessionContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
// import Tokenomics from "./pages/Tokenomics";
import Metrics from "./pages/Metrics";
import Void from "./pages/Void"

import './App.css';

function App() {
  return (
    <div className="h-[400vh]">

    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/metrics" element={<Metrics />} />
            <Route path="/space" element={<Void />} />
            <Route path="*" element={<Home />} />
            {/* <Route path="/tokenomic" element={<Tokenomics language={"en"}/>}/> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </SessionProvider>
    </div>
  );
}

export default App;
