import Link from 'next/link';

const MovieList = ({ items }) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {items.map((item) => (
        <Link 
          key={item._id} 
          href={`/series/${item._id}`} 
          className="min-w-[150px] md:min-w-[200px] flex-shrink-0"
        >
          <div className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform">
            <img 
              src={item.thumbnail} 
              alt={item.title} 
              className="w-full h-[225px] object-cover"
            />
            <div className="p-2">
              <h3 className="text-white text-sm truncate">{item.title}</h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MovieList;