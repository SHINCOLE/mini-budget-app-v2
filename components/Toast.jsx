"use client";
import { useEffect, useState } from "react";

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function onToast(e) {
      const { message, type = "info", duration = 2000 } = e.detail || {};
      const id = Date.now() + Math.random();

      setToasts((t) => [...t, { id, message, type }]);

      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, duration);
    }

    window.addEventListener("app:toast", onToast);
    return () => window.removeEventListener("app:toast", onToast);
  }, []);

  const getColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-600"; // added
      case "update":
        return "bg-blue-600"; // updated
      case "delete":
        return "bg-red-600"; // deleted
      default:
        return "bg-gray-800";
    }
  };

  return (
    <div className="fixed top-6 right-4 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-2 rounded shadow text-white text-sm ${getColor(
            t.type
          )}`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}