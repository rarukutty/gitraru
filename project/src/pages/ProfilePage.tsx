import { useState, FormEvent } from 'react';
import { User, Mail, Phone, MapPin, Globe, Edit3, Check, X, Camera } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { sampleTrips } from '../data/seed';

const preferredDestinationOptions = ['Beach', 'Mountains', 'City', 'Cultural', 'Adventure', 'Safari', 'Arctic', 'Tropical'];

export default function ProfilePage() {
  const { profile, refreshProfile, user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    city: profile?.city || '',
    country: profile?.country || '',
    preferred_destinations: profile?.preferred_destinations || [],
  });

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  function toggleDestination(dest: string) {
    setForm(f => ({
      ...f,
      preferred_destinations: f.preferred_destinations.includes(dest)
        ? f.preferred_destinations.filter(d => d !== dest)
        : [...f.preferred_destinations, dest],
    }));
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from('profiles').update({
      first_name: form.first_name,
      last_name: form.last_name,
      phone: form.phone,
      city: form.city,
      country: form.country,
      preferred_destinations: form.preferred_destinations,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id);
    setLoading(false);
    if (error) { setError(error.message); return; }
    await refreshProfile();
    setEditing(false);
  }

  function cancelEdit() {
    setEditing(false);
    setError('');
    setForm({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone: profile?.phone || '',
      city: profile?.city || '',
      country: profile?.country || '',
      preferred_destinations: profile?.preferred_destinations || [],
    });
  }

  const displayName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'User';
  const initials = `${profile?.first_name?.[0] || ''}${profile?.last_name?.[0] || ''}`.toUpperCase() || 'U';

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {initials}
            </div>
            <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Camera className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{displayName}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1 mt-1">
              <Mail className="w-3.5 h-3.5" />{profile?.email}
            </p>
            {profile?.city && profile?.country && (
              <p className="text-gray-400 dark:text-gray-500 text-sm flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />{profile.city}, {profile.country}
              </p>
            )}
            <div className="flex gap-3 mt-3">
              <div className="text-center">
                <p className="font-bold text-gray-900 dark:text-white">3</p>
                <p className="text-xs text-gray-400">Trips</p>
              </div>
              <div className="w-px bg-gray-200 dark:bg-gray-700" />
              <div className="text-center">
                <p className="font-bold text-gray-900 dark:text-white">7</p>
                <p className="text-xs text-gray-400">Countries</p>
              </div>
              <div className="w-px bg-gray-200 dark:bg-gray-700" />
              <div className="text-center">
                <p className="font-bold text-gray-900 dark:text-white">42</p>
                <p className="text-xs text-gray-400">Days</p>
              </div>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
            <Edit3 className="w-4 h-4" /> Edit Profile
          </Button>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Info / Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          {editing ? (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Edit Profile</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="First Name" value={form.first_name} onChange={set('first_name')} />
                  <Input label="Last Name" value={form.last_name} onChange={set('last_name')} />
                </div>
                <Input label="Phone" value={form.phone} onChange={set('phone')} placeholder="+1 234 567 8900" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="City" value={form.city} onChange={set('city')} />
                  <Input label="Country" value={form.country} onChange={set('country')} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Preferred Destinations</label>
                  <div className="flex flex-wrap gap-2">
                    {preferredDestinationOptions.map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDestination(d)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          form.preferred_destinations.includes(d)
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-400'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div className="flex gap-3">
                  <Button type="submit" loading={loading}><Check className="w-4 h-4" /> Save Changes</Button>
                  <Button type="button" variant="secondary" onClick={cancelEdit}><X className="w-4 h-4" /> Cancel</Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Personal Information</h2>
              <div className="space-y-4">
                {[
                  { icon: User, label: 'Full Name', value: displayName },
                  { icon: Mail, label: 'Email', value: profile?.email },
                  { icon: Phone, label: 'Phone', value: profile?.phone || '—' },
                  { icon: MapPin, label: 'City', value: profile?.city || '—' },
                  { icon: Globe, label: 'Country', value: profile?.country || '—' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Previous trips */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Travel History</h2>
            <div className="space-y-3">
              {sampleTrips.map(trip => (
                <div key={trip.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                  <img src={trip.cover_image} alt={trip.destination} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{trip.name}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{trip.destination}</p>
                  </div>
                  <Badge color={trip.status === 'ongoing' ? 'green' : trip.status === 'upcoming' ? 'blue' : 'gray'}>
                    {trip.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preferred Travel</h2>
            <div className="flex flex-wrap gap-2">
              {(profile?.preferred_destinations?.length ? profile.preferred_destinations : ['Beach', 'Mountains', 'Culture']).map(d => (
                <Badge key={d} color="blue">{d}</Badge>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Stats</h2>
            <div className="space-y-3">
              {[
                { label: 'Member Since', value: new Date(profile?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) },
                { label: 'Total Budget Spent', value: '$6,800' },
                { label: 'Avg Trip Duration', value: '8 days' },
                { label: 'Favorite Region', value: 'Southeast Asia' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
