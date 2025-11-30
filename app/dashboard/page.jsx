"use client";

import { useRouter } from "next/navigation";
import { supabaseClient } from "../../lib/supabaseClient";

import OverviewCards from "./components/OverviewCards";
import ExpenseList from "./components/ExpenseList";
import IncomeList from "./components/IncomeList";
import AddExpenseForm from "../../components/AddExpenseForm";
import AddIncomeForm from "../../components/AddIncomeForm";

export default function Dashboard() {
  const router = useRouter();

  async function logout() {
    await supabaseClient.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/analytics")}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
          >
            Analytics
          </button>

          <button
            onClick={logout}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <OverviewCards />

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <AddExpenseForm />
          <ExpenseList />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <AddIncomeForm />
          <IncomeList />
        </div>
      </div>
    </div>
  );
}