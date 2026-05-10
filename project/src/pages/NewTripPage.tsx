import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, FileText, Plane } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

interface TripForm {
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: string;
  notes: string;
}

const initial: TripForm = { name: '', destination: '', start_date: '', end_date: '', budget: '', notes: '' };

export default function NewTripPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<TripForm>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function set(field: keyof TripForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));
  }

  function getDuration() {
    if (!form.start_date || !form.end_date) return null;
    const diff = new Date(form.end_date).getTime() - new Date(form.start_date).getTime();
    const days = Math.ceil(diff / 86400000);
    return days > 0 ? days : null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.name || !form.destination || !form.start_date || !form.end_date) {
      setError('Please fill in all required fields.'); return;
    }
    if (new Date(form.end_date) < new Date(form.start_date)) {
      setError('End date must be after start date.'); return;
    }
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from('trips').insert({
      user_id: user.id,
      name: form.name,
      destination: form.destination,
      start_date: form.start_date,
      end_date: form.end_date,
      budget: parseFloat(form.budget) || 0,
      notes: form.notes || null,
      status: new Date(form.start_date) > new Date() ? 'upcoming' : 'ongoing',
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    navigate('/trips');
  }

  const duration = getDuration();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Trip</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Plan your next adventure</p>
      </div>

      <div className="grid gap-6">
        {/* Preview Card */}
        {(form.name || form.destination) && (
          <Card glass className="p-5 bg-gradient-to-br from-blue-500 to-cyan-500 border-0">
            <div className="flex items-start justify-between text-white">
              <div>
                <p className="text-blue-100 text-xs mb-1">Trip Preview</p>
                <h2 className="text-xl font-bold">{form.name || 'Unnamed Trip'}</h2>
                {form.destination && (
                  <p className="flex items-center gap-1 text-blue-100 text-sm mt-1">
                    <MapPin className="w-3.5 h-3.5" />{form.destination}
                  </p>
                )}
              </div>
              <Plane className="w-8 h-8 text-white/60" />
            </div>
            {duration && (
              <div className="mt-4 flex gap-4">
                <div className="bg-white/20 rounded-xl px-3 py-2">
                  <p className="text-white/70 text-xs">Duration</p>
                  <p className="text-white font-bold">{duration} days</p>
                </div>
                {form.budget && (
                  <div className="bg-white/20 rounded-xl px-3 py-2">
                    <p className="text-white/70 text-xs">Budget</p>
                    <p className="text-white font-bold">${parseFloat(form.budget).toLocaleString()}</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Trip Name *"
              placeholder="e.g. Bali Summer Getaway"
              value={form.name}
              onChange={set('name')}
            />
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-6" />
              <Input
                label="Destination *"
                placeholder="e.g. Bali, Indonesia"
                value={form.destination}
                onChange={set('destination')}
                className="flex-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0 mt-6" />
                <Input
                  label="Start Date *"
                  type="date"
                  value={form.start_date}
                  onChange={set('start_date')}
                  className="flex-1"
                />
              </div>
              <Input
                label="End Date *"
                type="date"
                value={form.end_date}
                onChange={set('end_date')}
                min={form.start_date}
              />
            </div>
            {duration && (
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium -mt-2">
                Trip duration: {duration} days
              </p>
            )}
            <div className="flex items-center gap-3">
              <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0 mt-6" />
              <Input
                label="Total Budget (USD)"
                type="number"
                placeholder="e.g. 3000"
                value={form.budget}
                onChange={set('budget')}
                min="0"
                className="flex-1"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Notes
              </label>
              <textarea
                rows={3}
                placeholder="Any additional notes or travel ideas..."
                value={form.notes}
                onChange={set('notes')}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => navigate('/trips')} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" loading={loading} className="flex-1">
                Create Trip
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
