import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import Resubmit from './pages/Resubmit';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/resubmit" element={<Resubmit />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
