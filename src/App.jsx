import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import CreatorProfile from './pages/CreatorProfile';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar'; // ✅ Add this

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <Navbar /> {/* ✅ Add the navbar */}
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
