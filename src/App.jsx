import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import About from './pages/About';
import CreatorProfile from './pages/CreatorProfile';
import AdminTips from './pages/AdminTips';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="min-h-screen transition-all duration-700 ease-in-out bg-background text-foreground dark:bg-background-dark dark:text-foreground-dark">
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

      <Router>
        <Navbar />
        <main className="px-6 py-8 max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/creator/:id" element={<CreatorProfile />} />
            <Route path="/admin/tips" element={<AdminTips />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
