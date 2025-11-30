"use client";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../../lib/supabaseClient";

export default function OverviewCards() {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [loading, setLoading] = useState(true);

  async function loadTotals() {
    setLoading(true);

    const session = await supabaseClient.auth.getSession();
    const token = session?.data?.session?.access_token;

    // Fetch total incomes
    const resIncome = await fetch("/api/incomes", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Fetch total expenses
    const resExpense = await fetch("/api/expenses", {
      headers: { Authorization: `Bearer ${token}` },
    });

    let incomes = [];
    let expenses = [];

    try {
      incomes = await resIncome.json();
      expenses = await resExpense.json();
    } catch (e) {
      incomes = [];
      expenses = [];
    }

    if (Array.isArray(incomes)) {
      const totalIncome = incomes.reduce((sum, x) => sum + Number(x.amount), 0);
      setIncome(totalIncome);
    }

    if (Array.isArray(expenses)) {
      const totalExpense = expenses.reduce((sum, x) => sum + Number(x.amount), 0);
      setExpense(totalExpense);
    }

    setLoading(false);
  }

  // Load totals on start
  useEffect(() => {
    loadTotals();

    // Listen to event from add/edit/delete
    function refresh() {
      loadTotals();
    }

    window.addEventListener("budget:updated", refresh);
    return () => window.removeEventListener("budget:updated", refresh);
  }, []);

  const balance = income - expense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-xl shadow">
        <h4 className="text-sm text-gray-500">Total Income</h4>
        <p className="text-2xl font-bold text-green-600">
          {loading ? "..." : `฿${income.toFixed(2)}`}
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h4 className="text-sm text-gray-500">Total Expenses</h4>
        <p className="text-2xl font-bold text-red-600">
          {loading ? "..." : `฿${expense.toFixed(2)}`}
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h4 className="text-sm text-gray-500">Balance</h4>
        <p className="text-2xl font-bold text-blue-600">
          {loading ? "..." : `฿${balance.toFixed(2)}`}
        </p>
      </div>
    </div>
  );
}