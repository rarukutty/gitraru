import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MapPin, Calendar, DollarSign, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Trip } from '../types/database';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { sampleTrips } from '../data/seed';

function TripCard({ trip, onDelete }: { trip: Trip | typeof sampleTrips[0]; onDelete?: (id: string) => void }) {
  const navigate = useNavigate();
  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);
  const days = Math.ceil((end.getTime() - start.getTime()) / 86400000);
  const statusColor = trip.status === 'ongoing' ? 'green' : trip.status === 'upcoming' ? 'blue' : 'gray';

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-200">
      <div className="relative h-44 overflow-hidden">
        <img
          src={(trip as Trip).cover_image || 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=600'}
          alt={trip.destination}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 right-3">
          <Badge color={statusColor as 'green' | 'blue' | 'gray'}>{trip.status}</Badge>
        </div>
        {onDelete && (
          <button
            onClick={e => { e.stopPropagation(); onDelete(trip.id); }}
            className="absolute top-3 left-3 p-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-red-500/80 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        <div className="absolute bottom-3 left-3">
          <p className="text-white font-bold text-lg">{trip.name}</p>
          <p className="text-white/80 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{trip.destination}</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{days} days</span>
          <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" />${trip.budget.toLocaleString()}</span>
        </div>
        <div className="mt-3 flex gap-2">
          <Button variant="secondary" size="sm" className="flex-1" onClick={() => navigate('/itinerary')}>
            View Itinerary
          </Button>
          <Button size="sm" className="flex-1" onClick={() => navigate('/budget')}>
            Track Budget
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function TripsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('trips')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setTrips(data || []);
        setLoading(false);
      });
  }, [user]);

  async function handleDelete(id: string) {
    if (!confirm('Delete this trip?')) return;
    await supabase.from('trips').delete().eq('id', id);
    setTrips(t => t.filter(x => x.id !== id));
  }

  const displayTrips = trips.length > 0 ? trips : (sampleTrips as unknown as Trip[]);

  const ongoing = displayTrips.filter(t => t.status === 'ongoing');
  const upcoming = displayTrips.filter(t => t.status === 'upcoming');
  const completed = displayTrips.filter(t => t.status === 'completed');

  function Section({ title, items, color }: { title: string; items: Trip[]; color: string }) {
    if (!items.length) return null;
    return (
      <section>
        <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${color}`}>{title}
          <span className="text-sm font-normal text-gray-400">({items.length})</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(t => <TripCard key={t.id} trip={t} onDelete={trips.length > 0 ? handleDelete : undefined} />)}
        </div>
      </section>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Trips</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage all your travel adventures</p>
        </div>
        <Button onClick={() => navigate('/trips/new')} size="md">
          <Plus className="w-4 h-4" /> New Trip
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400">Loading trips...</div>
      ) : (
        <>
          {!ongoing.length && !upcoming.length && !completed.length ? (
            <Card className="p-12 text-center">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No trips yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Start planning your first adventure!</p>
              <Button onClick={() => navigate('/trips/new')}>
                <Plus className="w-4 h-4" /> Plan a Trip
              </Button>
            </Card>
          ) : (
            <>
              <Section title="Ongoing Trips" items={ongoing} color="text-emerald-600 dark:text-emerald-400" />
              <Section title="Upcoming Trips" items={upcoming} color="text-blue-600 dark:text-blue-400" />
              <Section title="Completed Trips" items={completed} color="text-gray-600 dark:text-gray-400" />
            </>
          )}
        </>
      )}
    </div>
  );
}
