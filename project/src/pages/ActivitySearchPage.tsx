import { useState } from 'react';
import { Search, MapPin, Star, Clock, DollarSign, Filter } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

interface ActivityResult {
  id: number;
  name: string;
  city: string;
  category: string;
  rating: number;
  duration: string;
  price: number;
  image: string;
  description: string;
}

const allActivities: ActivityResult[] = [
  { id: 1, name: 'Ubud Monkey Forest', city: 'Bali', category: 'Nature', rating: 4.7, duration: '2 hours', price: 10, image: 'https://images.pexels.com/photos/1537640/pexels-photo-1537640.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Sacred monkey sanctuary with ancient temples in the heart of Ubud.' },
  { id: 2, name: 'Eiffel Tower', city: 'Paris', category: 'Landmark', rating: 4.9, duration: '3 hours', price: 28, image: 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Iconic iron tower with panoramic views of the city of light.' },
  { id: 3, name: 'Shibuya Crossing', city: 'Tokyo', category: 'Culture', rating: 4.6, duration: '1 hour', price: 0, image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'The world\'s busiest pedestrian crossing, a Tokyo icon.' },
  { id: 4, name: 'Central Park Bike Tour', city: 'New York', category: 'Adventure', rating: 4.8, duration: '4 hours', price: 45, image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Guided bike tour through New York\'s iconic urban oasis.' },
  { id: 5, name: 'Oia Sunset Watch', city: 'Santorini', category: 'Sightseeing', rating: 4.9, duration: '2 hours', price: 0, image: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'World-famous sunset views from the cliffside village of Oia.' },
  { id: 6, name: 'Burj Khalifa Observation', city: 'Dubai', category: 'Landmark', rating: 4.7, duration: '2 hours', price: 65, image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Breathtaking 360° views from the world\'s tallest building.' },
  { id: 7, name: 'Snorkeling in Maldives', city: 'Maldives', category: 'Adventure', rating: 4.9, duration: '3 hours', price: 80, image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Crystal clear waters teeming with colorful marine life.' },
  { id: 8, name: 'Northern Lights Tour', city: 'Iceland', category: 'Nature', rating: 4.8, duration: '6 hours', price: 120, image: 'https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Chase the aurora borealis on a guided night adventure.' },
];

const categoryColors: Record<string, 'blue' | 'green' | 'yellow' | 'orange' | 'gray' | 'red'> = {
  Nature: 'green', Landmark: 'blue', Culture: 'yellow',
  Adventure: 'orange', Sightseeing: 'blue',
};

const categories = ['All', 'Nature', 'Landmark', 'Culture', 'Adventure', 'Sightseeing'];

export default function ActivitySearchPage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = allActivities.filter(a => {
    const matchQuery = !query || a.name.toLowerCase().includes(query.toLowerCase()) || a.city.toLowerCase().includes(query.toLowerCase());
    const matchCategory = selectedCategory === 'All' || a.category === selectedCategory;
    const matchPrice = maxPrice === '' || a.price <= maxPrice;
    return matchQuery && matchCategory && matchPrice;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Search</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Discover experiences at your destination</p>
      </div>

      {/* Search bar */}
      <Card className="p-4 mb-6">
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-48 flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search activities or cities..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none w-full"
            />
          </div>
          <Button variant="secondary" onClick={() => setShowFilters(v => !v)}>
            <Filter className="w-4 h-4" /> Filters
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-4 items-end">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selectedCategory === cat
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-2">Max Price ($)</label>
              <input
                type="number"
                placeholder="Any"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                className="w-28 px-3 py-1.5 rounded-xl text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
            <Button variant="ghost" size="sm" onClick={() => { setQuery(''); setSelectedCategory('All'); setMaxPrice(''); }}>
              Clear filters
            </Button>
          </div>
        )}
      </Card>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{filtered.length} activities found</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(activity => (
          <Card key={activity.id} className="overflow-hidden group hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="relative h-44 overflow-hidden">
              <img src={activity.image} alt={activity.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3">
                <Badge color={categoryColors[activity.category] || 'blue'}>{activity.category}</Badge>
              </div>
              {activity.price === 0 && (
                <div className="absolute top-3 right-3">
                  <Badge color="green">Free</Badge>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{activity.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-2">
                <MapPin className="w-3 h-3" />{activity.city}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 mb-3">{activity.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{activity.rating}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{activity.duration}</span>
                <span className="flex items-center gap-1 font-medium text-gray-700 dark:text-gray-300">
                  <DollarSign className="w-3 h-3" />{activity.price > 0 ? `$${activity.price}` : 'Free'}
                </span>
              </div>
              <Button size="sm" className="w-full">Add to Itinerary</Button>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>No activities found. Try a different search.</p>
          </div>
        )}
      </div>
    </div>
  );
}