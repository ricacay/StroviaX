import { Link } from 'react-router-dom';
import useXamanAuth from '../hooks/useXamanAuth';

export default function Navbar() {
  const { user, login, logout } = useXamanAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-purple-600">
          Strovia
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-700 hover:text-purple-600 font-medium">
            Home
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-purple-600 font-medium">
            About
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 truncate max-w-[120px]">
                {user.wallet.slice(0, 6)}...{user.wallet.slice(-4)}
              </span>
              <button
                onClick={logout}
                className="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
