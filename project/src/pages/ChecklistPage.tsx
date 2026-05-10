import { useState } from 'react';
import { Plus, Trash2, CheckSquare, Package } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { checklistCategories } from '../data/seed';

interface ChecklistItem {
  id: string;
  title: string;
  category: string;
  checked: boolean;
}

function uid() { return Math.random().toString(36).slice(2); }

const initialItems: ChecklistItem[] = checklistCategories.flatMap(cat =>
  cat.items.map(item => ({ id: uid(), title: item, category: cat.name, checked: false }))
);

const categoryBadgeColors: Record<string, 'blue' | 'green' | 'yellow' | 'orange' | 'gray' | 'red'> = {
  Documents: 'blue', Clothing: 'green', Toiletries: 'yellow', Electronics: 'orange',
};

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('Documents');
  const [showAdd, setShowAdd] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');

  const allCategories = [...new Set(items.map(i => i.category))];

  function toggleItem(id: string) {
    setItems(items => items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  }

  function deleteItem(id: string) {
    setItems(items => items.filter(i => i.id !== id));
  }

  function addItem() {
    if (!newItem.trim()) return;
    setItems(i => [...i, { id: uid(), title: newItem.trim(), category: newCategory, checked: false }]);
    setNewItem('');
    setShowAdd(false);
  }

  const filtered = items.filter(i => filterCategory === 'All' || i.category === filterCategory);
  const checked = items.filter(i => i.checked).length;
  const progress = items.length > 0 ? Math.round((checked / items.length) * 100) : 0;

  const grouped = allCategories.reduce<Record<string, ChecklistItem[]>>((acc, cat) => {
    acc[cat] = filtered.filter(i => i.category === cat);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Packing Checklist</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{checked} of {items.length} items packed</p>
        </div>
        <Button onClick={() => setShowAdd(v => !v)}>
          <Plus className="w-4 h-4" /> Add Item
        </Button>
      </div>

      {/* Progress */}
      <Card className="p-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Packing Progress</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">All items packed! You're ready to go.</p>
        )}
      </Card>

      {/* Add item form */}
      {showAdd && (
        <Card className="p-4 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10">
          <div className="flex gap-2 mb-3">
            <input
              placeholder="Item name..."
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addItem()}
              className="flex-1 px-3 py-2 rounded-xl text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <select
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              className="px-3 py-2 rounded-xl text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              {allCategories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={addItem}>Add</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {['All', ...allCategories].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filterCategory === cat
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items by category */}
      {allCategories.map(cat => {
        const catItems = grouped[cat];
        if (!catItems?.length) return null;
        const catChecked = catItems.filter(i => i.checked).length;
        return (
          <Card key={cat} className="overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{cat}</h3>
                <Badge color={categoryBadgeColors[cat] || 'gray'}>{catChecked}/{catItems.length}</Badge>
              </div>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {catItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      item.checked
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                    }`}
                  >
                    {item.checked && <CheckSquare className="w-3 h-3" />}
                  </button>
                  <span className={`flex-1 text-sm transition-colors ${item.checked ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {item.title}
                  </span>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
