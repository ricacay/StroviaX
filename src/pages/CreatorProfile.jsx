import { useParams, Link } from 'react-router-dom';
import creators from '../data/creators';

export default function CreatorProfile() {
  const { id } = useParams();

  const creator = creators.find((c) => c.id === id);

  if (!creator) {
    return (
      <div className="p-6 text-red-600 text-xl font-semibold">
        Creator not found.
      </div>
    );
  }

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
    </div>
  );
}
