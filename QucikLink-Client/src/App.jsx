import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Lookup from "./pages/Lookup";
import QRCodeGen from "./pages/QRCodeGen";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-ink font-sans flex flex-col justify-between transition-colors">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lookup" element={<Lookup />} />
            <Route path="/qrcode" element={<QRCodeGen />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
