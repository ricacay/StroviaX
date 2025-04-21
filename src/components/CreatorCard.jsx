export default function CreatorCard({ creator }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
      <img
        src={creator.image}
        alt={`${creator.name}'s avatar`}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{creator.name}</h3>
        <p className="text-sm text-gray-600">{creator.description}</p>
      </div>
    </div>
  );
}
