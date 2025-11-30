"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { supabaseClient } from "../../../lib/supabaseClient";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A02EE5", "#E52EE5"];

export default function ExpensePieChart() {
  const [data, setData] = useState([]);

  async function load() {
    const session = await supabaseClient.auth.getSession();
    const token = session?.data?.session?.access_token;

    const res = await fetch("/api/expenses", {
      headers: { Authorization: `Bearer ${token}` },
    });

    let json = [];
    try {
      json = await res.json();
    } catch {}

    // Group by category
    const grouped = {};
    json.forEach((item) => {
      grouped[item.category] = (grouped[item.category] || 0) + Number(item.amount);
    });

    const chartData = Object.keys(grouped).map((key) => ({
      name: key,
      value: grouped[key],
    }));

    setData(chartData);
  }

  useEffect(() => {
    load();
    window.addEventListener("budget:updated", load);
    return () => window.removeEventListener("budget:updated", load);
  }, []);

  if (data.length === 0) return <p className="text-sm text-gray-500">No data</p>;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={80}
          label
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}