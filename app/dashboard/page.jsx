"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../lib/supabaseClient";

import OverviewCards from "./components/OverviewCards";
import ExpenseList from "./components/ExpenseList";
import IncomeList from "./components/IncomeList";
import AddExpenseForm from "../../components/AddExpenseForm";
import AddIncomeForm from "../../components/AddIncomeForm";

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");

  async function logout() {
    await supabaseClient.auth.signOut();
    router.push("/login");
  }

  // Load logged-in user
  useEffect(() => {
    async function getUser() {
      const { data } = await supabaseClient.auth.getUser();
      const email = data?.user?.email;
      if (email) setUserEmail(email);
    }

    getUser();
  }, []);

  // Get first letter for avatar
  const avatarLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "?";

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        
        {/* Dashboard Title + User Display */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          {userEmail && (
            <div className="flex items-center gap-2">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-semibold">
                {avatarLetter}
              </div>

              {/* Email */}
              <p className="text-sm text-gray-700 font-medium">{userEmail}</p>
            </div>
          )}
        </div>

        {/* Buttons */}
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
        <div className="space-y-6">
          <AddExpenseForm />
          <ExpenseList />
        </div>

        <div className="space-y-6">
          <AddIncomeForm />
          <IncomeList />
        </div>
      </div>
    </div>
  );
}