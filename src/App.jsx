import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import FarmerPage from "./pages/FarmerPage"
import FarmerMode from "./pages/FarmerMode"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/farmers/:id" element={<FarmerPage />} />
        <Route path="/farmer" element={<FarmerMode />} />
      </Routes>
    </BrowserRouter>
  )
}
