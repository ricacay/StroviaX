import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 text-center">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Page Not Found
      </p>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Sorry, we couldn't find what you were looking for.
      </p>
      <Link
        to="/"
        className="text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition"
      >
        Go back to Home
      </Link>
    </div>
  );
}
