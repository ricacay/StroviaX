import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

import Home from './pages/Home';
import About from './pages/About';
import CreatorProfile from './pages/CreatorProfile';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <Toaster
          richColors
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              fontSize: '1rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              padding: '0.75rem 1.25rem',
            },
          }}
        />
        <Navbar />
        <main className="px-6 py-8 max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/creator/:id" element={<CreatorProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
