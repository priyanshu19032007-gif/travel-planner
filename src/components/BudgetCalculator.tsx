import React, { useState } from 'react';
import {
  Wallet,
  PiggyBank,
  TrendingDown,
  PlusCircle,
  Trash2,
  DollarSign,
  PieChart,
  Lightbulb,
} from 'lucide-react';
import { ExpenseCategory } from '../types/itinerary';

interface BudgetCalculatorProps {
  budgetBreakdown: {
    totalEstimatedCost: string;
    perPersonPerDay: string;
    categories: ExpenseCategory[];
    moneySavingTips: string[];
  };
  currency: string;
}

interface UserExpense {
  id: string;
  item: string;
  amount: number;
  category: string;
}

export const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({
  budgetBreakdown,
  currency,
}) => {
  const [userExpenses, setUserExpenses] = useState<UserExpense[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Dining & Drinks');

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newItemAmount);
    if (!newItemName.trim() || isNaN(amt) || amt <= 0) return;

    setUserExpenses([
      ...userExpenses,
      {
        id: `exp_${Date.now()}`,
        item: newItemName.trim(),
        amount: amt,
        category: newItemCategory,
      },
    ]);
    setNewItemName('');
    setNewItemAmount('');
  };

  const handleRemoveExpense = (id: string) => {
    setUserExpenses(userExpenses.filter((e) => e.id !== id));
  };

  const totalSpent = userExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Estimated Total Cost
            </span>
            <div className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              {budgetBreakdown.totalEstimatedCost}
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              Based on duration & budget tier
            </div>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-700 rounded-xl">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Per Person / Day
            </span>
            <div className="font-serif-display text-2xl sm:text-3xl font-bold text-emerald-700 mt-1">
              {budgetBreakdown.perPersonPerDay}
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              Food, activities & transit
            </div>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-700 rounded-xl">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Logged On-Trip Expenses
            </span>
            <div className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              {currency} {totalSpent.toFixed(2)}
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              {userExpenses.length} personal entries tracked
            </div>
          </div>
          <div className="p-3 bg-sky-500/10 text-sky-700 rounded-xl">
            <PiggyBank className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Category Breakdown & Money Saving Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estimated Category Breakdown */}
        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-amber-600" />
              <span>Projected Expense Breakdown</span>
            </h3>
            <span className="text-xs font-medium text-stone-400">Target Share</span>
          </div>

          <div className="space-y-4">
            {budgetBreakdown.categories.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">{cat.category}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-stone-900">{cat.amount}</span>
                    <span className="text-stone-400">({cat.percentage}%)</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                  />
                </div>

                {cat.details && (
                  <p className="text-[11px] text-stone-500">{cat.details}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Local Money Saving Tips */}
        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              Local Money-Saving Secrets
            </h3>
          </div>

          <div className="space-y-3">
            {budgetBreakdown.moneySavingTips.map((tip, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-amber-50/60 border border-amber-200/70 rounded-xl text-xs text-stone-800 flex items-start gap-3"
              >
                <span className="font-mono font-bold text-amber-700 bg-amber-200/60 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[11px]">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Expense Tracker */}
      <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              Real-Time Travel Expense Log
            </h3>
            <p className="text-xs text-stone-500">
              Track your actual receipts and purchases on the road
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg">
            Total Spent: {currency} {totalSpent.toFixed(2)}
          </span>
        </div>

        {/* Add Entry Form */}
        <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5">
            <input
              type="text"
              required
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="e.g. Subway pass, Coffee & pastry, Museum entry"
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="sm:col-span-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">
                {currency}
              </span>
              <input
                type="number"
                step="any"
                required
                value={newItemAmount}
                onChange={(e) => setNewItemAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="Accommodation">Accommodation</option>
              <option value="Dining & Drinks">Dining & Drinks</option>
              <option value="Activities & Entries">Activities & Entries</option>
              <option value="Local Transportation">Local Transportation</option>
              <option value="Shopping & Souvenirs">Shopping & Souvenirs</option>
              <option value="Buffer / Other">Buffer / Other</option>
            </select>
          </div>

          <div className="sm:col-span-1">
            <button
              type="submit"
              className="w-full h-full min-h-[36px] bg-stone-900 hover:bg-stone-800 text-white rounded-xl flex items-center justify-center transition-colors"
              title="Add Expense"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Expenses List */}
        {userExpenses.length > 0 ? (
          <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
            {userExpenses.map((exp) => (
              <div
                key={exp.id}
                className="p-3 bg-stone-50/50 flex items-center justify-between text-xs hover:bg-stone-100/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-stone-900">{exp.item}</span>
                  <span className="text-[10px] text-stone-500 bg-stone-200/60 px-2 py-0.5 rounded">
                    {exp.category}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-stone-900">
                    {currency} {exp.amount.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExpense(exp.id)}
                    className="text-stone-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-stone-400 bg-stone-50 rounded-xl border border-dashed border-stone-200">
            No expenses logged yet. Add your train tickets or meals above!
          </div>
        )}
      </div>
    </div>
  );
};
