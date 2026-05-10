import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, TrendingUp, Clock, ArrowRight, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { destinations, trendingTrips, sampleTrips } from '../data/seed';

export default function DashboardPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const firstName = profile?.first_name || 'Traveler';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const filtered = destinations.filter(d =>
    !query || d.name.toLowerCase().includes(query.toLowerCase())
  );

  function statusColor(status: string) {
    if (status === 'ongoing') return 'green';
    if (status === 'upcoming') return 'blue';
    return 'gray';
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl h-64 md:h-72">
        <img
          src="https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=1400"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
          <p className="text-blue-200 text-sm font-medium mb-1">{greeting},</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{firstName} ✈</h1>
          <p className="text-blue-100 text-sm md:text-base max-w-md mb-6">
            Where will your next adventure take you?
          </p>
          <div className="flex items-center bg-white/95 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl px-4 py-3 max-w-md shadow-lg">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 ml-3 bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none"
            />
            <button
              onClick={() => navigate('/activities')}
              className="ml-2 bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Trips Planned', value: '3', color: 'bg-blue-50 dark:bg-blue-900/20', icon: '🗺️' },
          { label: 'Countries Visited', value: '7', color: 'bg-emerald-50 dark:bg-emerald-900/20', icon: '🌍' },
          { label: 'Total Budget', value: '$8.5K', color: 'bg-amber-50 dark:bg-amber-900/20', icon: '💰' },
          { label: 'Days Traveled', value: '42', color: 'bg-rose-50 dark:bg-rose-900/20', icon: '📅' },
        ].map(s => (
          <Card key={s.label} className={`p-4 ${s.color} border-0`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Top Destinations */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" /> Top Destinations
          </h2>
          <button onClick={() => navigate('/activities')} className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {filtered.map(dest => (
            <Card key={dest.id} className="overflow-hidden group cursor-pointer hover:shadow-md transition-shadow duration-200" onClick={() => navigate('/activities')}>
              <div className="relative overflow-hidden h-28">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-semibold leading-tight">{dest.name}</p>
                </div>
              </div>
              <div className="p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{dest.rating}</span>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">{dest.trips.toLocaleString()} trips</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Previous / Ongoing Trips */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" /> Your Trips
            </h2>
            <button onClick={() => navigate('/trips')} className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {sampleTrips.map(trip => (
              <Card key={trip.id} className="p-4 flex gap-4 items-center group hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/trips')}>
                <img src={trip.cover_image} alt={trip.destination} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{trip.name}</h3>
                    <Badge color={statusColor(trip.status) as 'green' | 'blue' | 'gray'}>{trip.status}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{trip.destination}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {new Date(trip.start_date).toLocaleDateString()} — {new Date(trip.end_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">${trip.budget.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">budget</p>
                </div>
              </Card>
            ))}
            <Card
              className="p-4 flex items-center justify-center gap-2 cursor-pointer border-dashed hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              onClick={() => navigate('/trips/new')}
            >
              <Plus className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-500">Plan a new trip</span>
            </Card>
          </div>
        </div>

        {/* Trending */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-500" /> Trending
          </h2>
          <div className="space-y-3">
            {trendingTrips.map(t => (
              <Card key={t.id} className="overflow-hidden group cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/trips/new')}>
                <div className="relative h-32 overflow-hidden">
                  <img src={t.image} alt={t.destination} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-2 left-2">
                    <Badge color="orange">{t.tag}</Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <div>
                      <p className="text-white font-semibold text-sm">{t.destination}</p>
                      <p className="text-white/80 text-xs">{t.duration}</p>
                    </div>
                    <p className="text-white font-bold text-sm">${t.price.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
