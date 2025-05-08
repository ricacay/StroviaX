import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import creators from '../data/creators';
import { useXamanAuth } from '../hooks/useXamanAuth'; // ⬅ switched to your wallet hook

export default function CreatorProfile() {
  const { id } = useParams();
  const creator = creators.find((c) => c.id === id);
  const { isConnected, xrpAddress, error } = useXamanAuth(); // ⬅ added error and wallet
  const [isTipping, setIsTipping] = useState(false);

  if (!creator) {
    return (
      <div className="p-6 text-red-600 text-xl font-semibold">
        Creator not found.
      </div>
    );
  }

  const toastWithStyle = (message, type = 'default') => {
    const baseClass =
      'text-white font-semibold px-4 py-3 rounded-md shadow-md text-sm';

    const typeClasses = {
      success: 'bg-[#3DDAA6]',
      error: 'bg-[#EF476F]',
      loading: 'bg-[#8C30F5]',
      default: 'bg-[#4D9DE0]',
    };

    const icon = {
      success: '✅',
      error: '❌',
      loading: '💸',
      default: '🧪',
    };

    const finalMessage = `${icon[type] || ''} ${message}`;

    toast(finalMessage, {
      className: `${typeClasses[type] || typeClasses.default} ${baseClass}`,
    });
  };

  const handleTip = async () => {
    if (!isConnected || !xrpAddress) {
      toastWithStyle('Please connect your wallet first.', 'error');
      return;
    }

    if (isTipping) return;
    setIsTipping(true);

    const loadingToastId = toast.loading('💸 Sending tip...', {
      className:
        'bg-[#8C30F5] text-white font-semibold px-4 py-3 rounded-md shadow-md text-sm',
    });

    try {
      // Simulate tip action
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toastWithStyle('Tip sent successfully!', 'success');
    } catch (error) {
      console.error('Tip error:', error);
      toastWithStyle('Tip failed. Please try again.', 'error');
    } finally {
      toast.dismiss(loadingToastId);
      setIsTipping(false);
    }
  };

  const testToast = () => {
    toastWithStyle('Sonner is working!', 'default');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Link
        to="/"
        className="text-purple-600 underline text-sm mb-4 inline-block"
      >
        ← Back to Home
      </Link>

      <img
        src={creator.image}
        alt={`${creator.name}'s avatar`}
        className="w-32 h-32 rounded-full object-cover mb-4 mx-auto"
      />
      <h1 className="text-3xl font-bold text-center">{creator.name}</h1>
      <p className="text-gray-600 mt-2 text-center">{creator.bio}</p>

      {isConnected && (
        <p className="text-sm text-center mt-4 text-gray-500">
          Tipping from: <span className="font-mono">{xrpAddress}</span>
        </p>
      )}

      <div className="mt-6 text-center space-y-4">
        <button
          onClick={handleTip}
          disabled={isTipping}
          className={`px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition ${
            isTipping ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isTipping ? 'Sending Tip...' : 'Send Tip'}
        </button>

        <button
          onClick={testToast}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Test Toast
        </button>

        {/* Optional Wallet Error Display */}
        {error && (
          <p className="text-xs text-red-500 mt-2">
            ⚠️ {error}
          </p>
        )}
      </div>
    </div>
  );
}
