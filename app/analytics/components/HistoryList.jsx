"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "../../../lib/supabaseClient";

export default function HistoryList() {
  const [history, setHistory] = useState([]);

  async function load() {
    const session = await supabaseClient.auth.getSession();
    const token = session?.data?.session?.access_token;

    const resExp = await fetch("/api/expenses", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const resInc = await fetch("/api/incomes", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const expenses = await resExp.json();
    const incomes = await resInc.json();

    // Add type identifier and merge
    const combined = [
      ...expenses.map((e) => ({ ...e, type: "expense" })),
      ...incomes.map((i) => ({ ...i, type: "income" })),
    ];

    // Sort by date descending
    combined.sort((a, b) => new Date(b.date) - new Date(a.date));

    setHistory(combined);
  }

  useEffect(() => {
    load();
    window.addEventListener("budget:updated", load);
    return () => window.removeEventListener("budget:updated", load);
  }, []);

  return (
    <ul className="space-y-3">
      {history.map((item) => (
        <li key={item.id} className="flex justify-between items-center">
          <div>
            <p className="font-medium">
              {item.type === "expense"
                ? `${item.category} – -$${item.amount}`
                : `${item.source} – +$${item.amount}`}
            </p>

            <p className="text-xs text-gray-500">{item.note || "-"}</p>

            <p className="text-xs text-gray-400">
              {new Date(item.date).toLocaleDateString()}
            </p>
          </div>

          <span
            className={
              item.type === "expense"
                ? "text-red-500 text-sm font-bold"
                : "text-green-600 text-sm font-bold"
            }
          >
            {item.type === "expense" ? "EXP" : "INC"}
          </span>
        </li>
      ))}
    </ul>
  );
}