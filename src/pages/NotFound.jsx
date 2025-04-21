import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
      <p className="text-gray-700 mb-4">
        Sorry, we couldn't find what you were looking for.
      </p>
      <Link to="/" className="text-purple-600 underline">
        Go back to Home
      </Link>
    </div>
  );
}
