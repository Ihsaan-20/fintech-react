import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';
import VerifyOtp from "./components/auth/VerifyOtp";
import CompleteRegistration from "./components/auth/CompleteRegistration";
import SendMoney from './components/SendMoney';
import Transaction from './components/Transaction';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/complete-registration" element={<CompleteRegistration />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/send-money" element={<SendMoney />} />
          <Route path="/transactions" element={<Transaction />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
