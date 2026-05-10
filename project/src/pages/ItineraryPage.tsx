import { useState } from 'react';
import { Plus, Trash2, Clock, MapPin, DollarSign, Edit3, Check, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

interface Activity {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  budget: number;
  category: string;
}

interface Day {
  id: string;
  dayNumber: number;
  date: string;
  notes: string;
  activities: Activity[];
}

const categories = ['Sightseeing', 'Food', 'Transport', 'Adventure', 'Culture', 'Shopping', 'Relaxation'];
const categoryColors: Record<string, 'blue' | 'orange' | 'gray' | 'green' | 'yellow' | 'red'> = {
  Sightseeing: 'blue', Food: 'orange', Transport: 'gray',
  Adventure: 'green', Culture: 'yellow', Shopping: 'red', Relaxation: 'green',
};

function ActivityCard({ activity, onEdit, onDelete }: { activity: Activity; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl group hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
      <div className="w-1 rounded-full bg-blue-400 flex-shrink-0 self-stretch" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-medium text-sm text-gray-900 dark:text-white">{activity.title}</span>
          <Badge color={categoryColors[activity.category] || 'blue'}>{activity.category}</Badge>
        </div>
        {activity.description && <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{activity.description}</p>}
        <div className="flex flex-wrap gap-3 text-xs text-gray-400">
          {activity.startTime && (
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{activity.startTime}{activity.endTime ? ` – ${activity.endTime}` : ''}</span>
          )}
          {activity.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{activity.location}</span>}
          {activity.budget > 0 && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />${activity.budget}</span>}
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
          <Edit3 className="w-3.5 h-3.5" />
        </button>
        <button onClick={onDelete} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

interface ActivityFormData {
  title: string; description: string; startTime: string; endTime: string;
  location: string; budget: string; category: string;
}

function ActivityForm({ onSave, onCancel, initial }: {
  onSave: (data: ActivityFormData) => void;
  onCancel: () => void;
  initial?: Partial<ActivityFormData>;
}) {
  const [form, setForm] = useState<ActivityFormData>({
    title: '', description: '', startTime: '', endTime: '',
    location: '', budget: '', category: 'Sightseeing', ...initial,
  });

  function set(k: keyof ActivityFormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input
          placeholder="Activity title *"
          value={form.title}
          onChange={set('title')}
          className="col-span-2 px-3 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        />
        <select
          value={form.category}
          onChange={set('category')}
          className="px-3 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <input
          placeholder="Location"
          value={form.location}
          onChange={set('location')}
          className="px-3 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        />
        <input type="time" value={form.startTime} onChange={set('startTime')}
          className="px-3 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
        <input type="time" value={form.endTime} onChange={set('endTime')}
          className="px-3 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
        <input type="number" placeholder="Budget ($)" value={form.budget} onChange={set('budget')} min="0"
          className="col-span-2 px-3 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
        <textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={set('description')}
          rows={2}
          className="col-span-2 px-3 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none"
        />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => form.title && onSave(form)}>
          <Check className="w-3.5 h-3.5" /> Save
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}><X className="w-3.5 h-3.5" /> Cancel</Button>
      </div>
    </div>
  );
}

function uid() { return Math.random().toString(36).slice(2); }

const initialDays: Day[] = [
  {
    id: uid(), dayNumber: 1, date: '2026-06-10', notes: 'Arrival day',
    activities: [
      { id: uid(), title: 'Arrive at Ngurah Rai Airport', description: 'Flight lands at 14:00', startTime: '14:00', endTime: '15:30', location: 'Bali Airport', budget: 0, category: 'Transport' },
      { id: uid(), title: 'Check in to hotel', description: 'Four Seasons Bali', startTime: '16:00', endTime: '', location: 'Jimbaran Bay', budget: 250, category: 'Relaxation' },
    ],
  },
  {
    id: uid(), dayNumber: 2, date: '2026-06-11', notes: '',
    activities: [
      { id: uid(), title: 'Tegallalang Rice Terraces', description: 'Morning visit before crowds', startTime: '07:30', endTime: '10:00', location: 'Tegallalang', budget: 15, category: 'Sightseeing' },
      { id: uid(), title: 'Local warung lunch', description: 'Traditional Balinese cuisine', startTime: '12:00', endTime: '13:00', location: 'Ubud', budget: 12, category: 'Food' },
    ],
  },
];

export default function ItineraryPage() {
  const [days, setDays] = useState<Day[]>(initialDays);
  const [addingActivity, setAddingActivity] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] = useState<{ dayId: string; actId: string } | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');

  function addDay() {
    const lastDay = days[days.length - 1];
    const lastDate = lastDay ? new Date(lastDay.date) : new Date();
    lastDate.setDate(lastDate.getDate() + 1);
    setDays(d => [...d, { id: uid(), dayNumber: d.length + 1, date: lastDate.toISOString().split('T')[0], notes: '', activities: [] }]);
  }

  function removeDay(id: string) {
    if (!confirm('Remove this day?')) return;
    setDays(d => d.filter(x => x.id !== id).map((x, i) => ({ ...x, dayNumber: i + 1 })));
  }

  function addActivity(dayId: string, data: ActivityFormData) {
    setDays(d => d.map(day => day.id !== dayId ? day : {
      ...day,
      activities: [...day.activities, { id: uid(), ...data, budget: parseFloat(data.budget) || 0 }],
    }));
    setAddingActivity(null);
  }

  function updateActivity(dayId: string, actId: string, data: ActivityFormData) {
    setDays(d => d.map(day => day.id !== dayId ? day : {
      ...day,
      activities: day.activities.map(a => a.id !== actId ? a : { ...a, ...data, budget: parseFloat(data.budget) || 0 }),
    }));
    setEditingActivity(null);
  }

  function deleteActivity(dayId: string, actId: string) {
    setDays(d => d.map(day => day.id !== dayId ? day : {
      ...day, activities: day.activities.filter(a => a.id !== actId),
    }));
  }

  function saveNotes(dayId: string) {
    setDays(d => d.map(day => day.id !== dayId ? day : { ...day, notes: notesDraft }));
    setEditingNotes(null);
  }

  const totalBudget = days.reduce((s, d) => s + d.activities.reduce((a, act) => a + act.budget, 0), 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Itinerary Builder</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Bali Summer Getaway · {days.length} days · ${totalBudget.toLocaleString()} budget</p>
        </div>
        <Button onClick={addDay} variant="secondary">
          <Plus className="w-4 h-4" /> Add Day
        </Button>
      </div>

      <div className="space-y-5">
        {days.map(day => {
          const dayBudget = day.activities.reduce((s, a) => s + a.budget, 0);
          return (
            <Card key={day.id} className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-xs">Day {day.dayNumber}</p>
                  <h3 className="text-white font-bold">
                    {new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  {dayBudget > 0 && (
                    <div className="bg-white/20 rounded-lg px-3 py-1.5 text-white text-sm font-medium">
                      ${dayBudget.toLocaleString()}
                    </div>
                  )}
                  <button onClick={() => removeDay(day.id)} className="text-white/60 hover:text-white transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {/* Notes */}
                {editingNotes === day.id ? (
                  <div className="flex gap-2">
                    <input
                      value={notesDraft}
                      onChange={e => setNotesDraft(e.target.value)}
                      placeholder="Day notes..."
                      className="flex-1 px-3 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                    <Button size="sm" onClick={() => saveNotes(day.id)}><Check className="w-3.5 h-3.5" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingNotes(null)}><X className="w-3.5 h-3.5" /></Button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditingNotes(day.id); setNotesDraft(day.notes); }}
                    className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1 transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    {day.notes || 'Add day notes...'}
                  </button>
                )}

                {/* Activities */}
                {day.activities.map(activity => (
                  editingActivity?.dayId === day.id && editingActivity?.actId === activity.id ? (
                    <ActivityForm
                      key={activity.id}
                      initial={{ ...activity, budget: String(activity.budget) }}
                      onSave={data => updateActivity(day.id, activity.id, data)}
                      onCancel={() => setEditingActivity(null)}
                    />
                  ) : (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      onEdit={() => setEditingActivity({ dayId: day.id, actId: activity.id })}
                      onDelete={() => deleteActivity(day.id, activity.id)}
                    />
                  )
                ))}

                {addingActivity === day.id ? (
                  <ActivityForm
                    onSave={data => addActivity(day.id, data)}
                    onCancel={() => setAddingActivity(null)}
                  />
                ) : (
                  <button
                    onClick={() => setAddingActivity(day.id)}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add Activity
                  </button>
                )}
              </div>
            </Card>
          );
        })}

        <Button variant="secondary" onClick={addDay} className="w-full">
          <Plus className="w-4 h-4" /> Add Another Day
        </Button>
      </div>
    </div>
  );
}
