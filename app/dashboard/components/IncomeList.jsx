"use client";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../../lib/supabaseClient";
import EditIncomeModal from "../../../components/EditIncomeModal";

export default function IncomeList() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filters
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");

  const months = [
    { value: "all", label: "All months" },
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  async function load() {
    const session = await supabaseClient.auth.getSession();
    const token = session?.data?.session?.access_token;

    const res = await fetch("/api/incomes", {
      headers: { Authorization: `Bearer ${token}` },
    });

    let json = [];
    try {
      json = await res.json();
    } catch {
      json = [];
    }

    if (Array.isArray(json)) {
      setItems(json);
      setFiltered(json);
    }
  }

  useEffect(() => {
    load();
    window.addEventListener("budget:updated", load);
    return () => window.removeEventListener("budget:updated", load);
  }, []);

  // Auto source extraction
  const sources = [
    "all",
    ...Array.from(new Set(items.map((i) => i.source))).filter(Boolean),
  ];

  // Filtering logic
  useEffect(() => {
    let result = [...items];

    if (selectedMonth !== "all") {
      result = result.filter((i) => {
        const m = new Date(i.date).getMonth().toString();
        return m === selectedMonth;
      });
    }

    if (selectedSource !== "all") {
      result = result.filter((i) => i.source === selectedSource);
    }

    setFiltered(result);
  }, [selectedMonth, selectedSource, items]);

  async function remove(id) {
    const session = await supabaseClient.auth.getSession();
    const token = session?.data?.session?.access_token;

    const res = await fetch(`/api/incomes?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      window.dispatchEvent(
        new CustomEvent("app:toast", {
          detail: { message: "Income deleted", type: "delete" },
        })
      );
      load();
    }
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      {/* Title + Filters */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
        <h3 className="text-lg font-semibold">Incomes</h3>

        <div className="flex flex-wrap gap-2 text-sm items-center">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border p-1 rounded"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="border p-1 rounded"
          >
            {sources.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All sources" : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 && (
        <p className="text-sm text-gray-500">No incomes found.</p>
      )}

      <ul className="space-y-3">
        {filtered.map((i) => (
          <li key={i.id} className="flex justify-between items-center">
            <div>
              <p className="font-medium">
                {i.source} – ${Number(i.amount).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">{i.note || "-"}</p>
              <p className="text-xs text-gray-400">
                {new Date(i.date).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                className="text-sm text-blue-600"
                onClick={() => {
                  setEditing(i);
                  setModalOpen(true);
                }}
              >
                Edit
              </button>

              <button
                className="text-sm text-red-500"
                onClick={() => remove(i.id)}
              >
                Delete
              </button>
            </div>
          </li>  
        ))}
      </ul>

      <EditIncomeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={editing}
        onUpdated={() => load()}
      />
    </div>
  );
}