"use client";
import { useState } from "react";
import { supabaseClient } from "../lib/supabaseClient";

export default function AddIncomeForm() {
  const today = new Date().toISOString().split("T")[0];
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("Salary");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    const session = await supabaseClient.auth.getSession();
    const token = session?.data?.session?.access_token;

    const res = await fetch("/api/incomes", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        amount: parseFloat(amount),
        source,
        note,
        date,
      }),
    });
    const json = await res.json();
    if (res.ok) {
      window.dispatchEvent(new CustomEvent("app:toast", { detail: { message: "Income added", type: "success" } }));
      setAmount("");
      setNote("");
      setDate(today);
      window.dispatchEvent(new Event("budget:updated"));
    } else {
      const msg = (json && json.error && json.error.message) || json?.error || "Add failed";
      window.dispatchEvent(new CustomEvent("app:toast", { detail: { message: msg, type: "error" } }));
    }
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="p-4 bg-white rounded-xl shadow space-y-3">
      <h3 className="font-semibold">Add Income</h3>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="w-full p-2 border rounded"
      />

      <input
        value={source}
        onChange={(e) => setSource(e.target.value)}
        placeholder="Source"
        className="w-full p-2 border rounded"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note (optional)"
        className="w-full p-2 border rounded"
      />

      <button className="w-full p-2 bg-black text-white rounded" disabled={loading}>
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
  );
}