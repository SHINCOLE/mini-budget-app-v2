"use client";
import { useState } from "react";
import { supabaseClient } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("Logging in...");

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setMsg(error.message);
    else router.push("/dashboard");
  }

  return (
    <div className="h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleLogin}
        className="max-w-md w-full bg-white p-6 rounded-xl shadow space-y-4"
      >
        <h1 className="text-2xl font-bold">Login</h1>

        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          required
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button className="w-full bg-black text-white p-2 rounded">
          Login
        </button>

        <p className="text-sm text-gray-600">{msg}</p>

        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <a href="/signup" className="text-black underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
