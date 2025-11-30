"use client";
import { useState } from "react";
import { supabaseClient } from "../../../lib/supabaseClient";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSignup(e) {
    e.preventDefault();
    setMsg("Creating your account...");

    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (error) setMsg(error.message);
    else setMsg("Account created! You can now log in.");
  }

  return (
    <div className="h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSignup}
        className="max-w-md w-full bg-white p-6 rounded-xl shadow space-y-4"
      >
        <h1 className="text-2xl font-bold">Create Account</h1>

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
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button className="w-full bg-black text-white p-2 rounded">
          Sign Up
        </button>

        <p className="text-sm text-gray-600">{msg}</p>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-black underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
