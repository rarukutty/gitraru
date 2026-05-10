import { useState } from 'react';
import { Plus, Trash2, TrendingDown, Wallet, ShoppingBag, Utensils, Car, Camera, MoreHorizontal } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes: string;
}

const categories = ['Accommodation', 'Food', 'Transport', 'Activities', 'Shopping', 'Other'];
const categoryIcons: Record<string, React.ElementType> = {
  Accommodation: Wallet,
  Food: Utensils,
  Transport: Car,
  Activities: Camera,
  Shopping: ShoppingBag,
  Other: MoreHorizontal,
};
const categoryColors: Record<string, 'blue' | 'orange' | 'gray' | 'green' | 'yellow' | 'red'> = {
  Accommodation: 'blue', Food: 'orange', Transport: 'gray',
  Activities: 'green', Shopping: 'yellow', Other: 'gray',
};

const seedExpenses: Expense[] = [
  { id: '1', title: 'Hotel – 4 nights', amount: 680, category: 'Accommodation', date: '2026-06-10', notes: '' },
  { id: '2', title: 'Round-trip flights', amount: 1200, category: 'Transport', date: '2026-06-10', notes: '' },
  { id: '3', title: 'Tegallalang & Ubud tour', amount: 85, category: 'Activities', date: '2026-06-11', notes: '' },
  { id: '4', title: 'Local restaurants (3 days)', amount: 96, category: 'Food', date: '2026-06-11', notes: '' },
  { id: '5', title: 'Souvenir shopping', amount: 140, category: 'Shopping', date: '2026-06-12', notes: '' },
];

const TOTAL_BUDGET = 3000;

function uid() { return Math.random().toString(36).slice(2); }

export default function BudgetPage() {
  const [expenses, setExpenses] = useState<Expense[]>(seedExpenses);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', amount: '', category: 'Food', date: '', notes: '' });

  function set(k: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));
  }

  function addExpense() {
    if (!form.title || !form.amount) return;
    setExpenses(e => [...e, { id: uid(), title: form.title, amount: parseFloat(form.amount), category: form.category, date: form.date || new Date().toISOString().split('T')[0], notes: form.notes }]);
    setForm({ title: '', amount: '', category: 'Food', date: '', notes: '' });
    setShowForm(false);
  }

  function removeExpense(id: string) {
    setExpenses(e => e.filter(x => x.id !== id));
  }

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = TOTAL_BUDGET - totalSpent;
  const progress = Math.min(100, (totalSpent / TOTAL_BUDGET) * 100);

  const byCategory = categories.map(cat => ({
    cat,
    total: expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter(x => x.total > 0);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budget Tracker</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Bali Summer Getaway</p>
        </div>
        <Button onClick={() => setShowForm(v => !v)}>
          <Plus className="w-4 h-4" /> Add Expense
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
          <p className="text-xs text-blue-500 dark:text-blue-400 font-medium mb-1">Total Budget</p>
          <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">${TOTAL_BUDGET.toLocaleString()}</p>
        </Card>
        <Card className="p-5 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800">
          <p className="text-xs text-red-500 dark:text-red-400 font-medium mb-1">Total Spent</p>
          <p className="text-3xl font-bold text-red-700 dark:text-red-300">${totalSpent.toLocaleString()}</p>
        </Card>
        <Card className={`p-5 ${remaining >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800' : 'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800'}`}>
          <p className={`text-xs font-medium mb-1 ${remaining >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-orange-500 dark:text-orange-400'}`}>
            {remaining >= 0 ? 'Remaining' : 'Over Budget'}
          </p>
          <p className={`text-3xl font-bold ${remaining >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-orange-700 dark:text-orange-300'}`}>
            ${Math.abs(remaining).toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Progress bar */}
      <Card className="p-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Budget Used</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progress > 90 ? 'bg-red-500' : progress > 70 ? 'bg-amber-500' : 'bg-blue-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          {byCategory.map(({ cat, total }) => {
            const Icon = categoryIcons[cat] || MoreHorizontal;
            const pct = ((total / TOTAL_BUDGET) * 100).toFixed(1);
            return (
              <div key={cat} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <Icon className="w-3.5 h-3.5" />
                {cat}: ${total} ({pct}%)
              </div>
            );
          })}
        </div>
      </Card>

      {/* Add expense form */}
      {showForm && (
        <Card className="p-5 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">New Expense</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input placeholder="Title *" value={form.title} onChange={set('title')}
              className="col-span-2 px-3 py-2 rounded-xl text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
            <input type="number" placeholder="Amount ($) *" value={form.amount} onChange={set('amount')} min="0"
              className="px-3 py-2 rounded-xl text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
            <select value={form.category} onChange={set('category')}
              className="px-3 py-2 rounded-xl text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40">
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <input type="date" value={form.date} onChange={set('date')}
              className="px-3 py-2 rounded-xl text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
            <input placeholder="Notes" value={form.notes} onChange={set('notes')}
              className="px-3 py-2 rounded-xl text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={addExpense}>Add Expense</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      {/* Expense list */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-blue-500" />
          <h2 className="font-semibold text-gray-900 dark:text-white">Expenses</h2>
          <span className="ml-auto text-xs text-gray-400">{expenses.length} items</span>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {expenses.map(expense => {
            const Icon = categoryIcons[expense.category] || MoreHorizontal;
            return (
              <div key={expense.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{expense.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge color={categoryColors[expense.category] || 'gray'}>{expense.category}</Badge>
                    <span className="text-xs text-gray-400">{new Date(expense.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="font-bold text-gray-900 dark:text-white">${expense.amount.toLocaleString()}</p>
                <button
                  onClick={() => removeExpense(expense.id)}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
          {expenses.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              <Wallet className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No expenses recorded yet</p>
            </div>
          )}
        </div>
        {expenses.length > 0 && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800/40 flex justify-end">
            <div className="text-right">
              <p className="text-xs text-gray-400">Total</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">${totalSpent.toLocaleString()}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
