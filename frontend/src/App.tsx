import { BrowserRouter, Routes, Route } from "react-router"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { AuthProvider } from "./contexts/AuthContext"
import PrivateRoute from "./components/PrivateRoute"
import DashboardLayout from "./layouts/DashboardLayout"
import Login from "./pages/Login"
import Home from "./pages/Home"
import AppointmentRegistration from "./pages/AppointmentRegistration"
import AppointmentManagement from "./pages/AppointmentManagement"
import History from "./pages/History"

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        element={
                            <PrivateRoute>
                                <DashboardLayout />
                            </PrivateRoute>
                        }
                    >
                        <Route path="/" element={<Home />} />
                        <Route path="/agendamentos" element={<AppointmentRegistration />} />
                        <Route path="/gestao" element={<AppointmentManagement />} />
                        <Route path="/historico" element={<History />} />
                    </Route>
                </Routes>
            </AuthProvider>
            <ToastContainer position="bottom-right" autoClose={3000} />
        </BrowserRouter>
    )
}
