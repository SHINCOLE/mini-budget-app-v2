"use client";

import { useRouter } from "next/navigation";
import ExpensePieChart from "./components/ExpensePieChart";
import IncomePieChart from "./components/IncomePieChart";
import HistoryList from "./components/HistoryList";

export default function AnalyticsPage() {
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header + Back Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>

        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Pie Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">Expenses Breakdown</h2>
          <ExpensePieChart />
        </div>

        <div className="p-4 bg-white rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">Incomes Breakdown</h2>
          <IncomePieChart />
        </div>
      </div>

      {/* History */}
      <div className="p-4 bg-white rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-3">History Log</h2>
        <HistoryList />
      </div>
    </div>
  );
}