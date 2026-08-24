import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import FarmerPage from "./pages/FarmerPage"
import FarmerMode from "./pages/FarmerMode"
import CoverPage from "./pages/CoverPage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import { getCurrentUser } from "./lib/auth"

function ProtectedRoute({ children }) {
  const user = getCurrentUser()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cover" element={<CoverPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/farmers/:id" element={<ProtectedRoute><FarmerPage /></ProtectedRoute>} />
        <Route path="/farmer" element={<ProtectedRoute><FarmerMode /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
