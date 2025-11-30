"use client";
import { useState, useEffect } from "react";
import { supabaseClient } from "../lib/supabaseClient";

export default function EditIncomeModal({ open, onClose, item, onUpdated }) {
  const [form, setForm] = useState({
    amount: "",
    source: "",
    note: "",
    date: "",
  });

  useEffect(() => {
    if (open && item) {
      setForm({
        amount: item.amount,
        source: item.source,
        note: item.note || "",
        date: new Date(item.date).toISOString().split("T")[0],
      });
    }
  }, [open, item]);

  if (!open) return null;

  async function save() {
    const session = await supabaseClient.auth.getSession();
    const token = session?.data?.session?.access_token;

    const res = await fetch("/api/incomes", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: item.id,
        amount: parseFloat(form.amount),
        source: form.source,
        note: form.note,
        date: form.date,
      }),
    });

    const json = await res.json();

    if (res.ok) {
      window.dispatchEvent(
        new CustomEvent("app:toast", {
          detail: { message: "Income updated", type: "update" },
        })
      );
      onUpdated?.(json);
      onClose();
    } else {
      window.dispatchEvent(
        new CustomEvent("app:toast", {
          detail: { message: "Update failed", type: "delete" },
        })
      );
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-xl p-5 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-3">Edit Income</h3>

        <input
          type="number"
          value={form.amount}
          onChange={(e) => setForm((s) => ({ ...s, amount: e.target.value }))}
          className="w-full border p-2 rounded mb-2"
        />

        <input
          value={form.source}
          onChange={(e) => setForm((s) => ({ ...s, source: e.target.value }))}
          className="w-full border p-2 rounded mb-2"
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
          className="w-full border p-2 rounded mb-2"
        />

        <input
          value={form.note}
          onChange={(e) => setForm((s) => ({ ...s, note: e.target.value }))}
          className="w-full border p-2 rounded mb-4"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 border rounded">
            Cancel
          </button>
          <button onClick={save} className="px-3 py-2 bg-black text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}