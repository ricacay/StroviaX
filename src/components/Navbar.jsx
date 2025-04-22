import { Link } from 'react-router-dom';
import useWalletStore from '../store/walletStore'; // Zustand store

export default function Navbar() {
  const { wallet, connectWallet, disconnectWallet } = useWalletStore();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-purple-600">
          StroviaX
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-gray-700 hover:text-purple-600 font-medium"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-purple-600 font-medium"
          >
            About
          </Link>

          {wallet ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 truncate max-w-[140px]">
                🪙{' '}
                {typeof wallet === 'string'
                  ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
                  : 'Wallet Connected'}
              </span>
              <button
                onClick={disconnectWallet}
                className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={() => connectWallet()}
              className="text-sm bg-yellow-400 text-purple-900 px-3 py-1 rounded hover:bg-yellow-500 font-semibold"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
