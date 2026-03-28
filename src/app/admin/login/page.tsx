"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "blair2026") {
      document.cookie = "blair_admin=blair2026; path=/; max-age=86400";
      router.push("/admin");
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <h1 className="font-serif text-2xl text-blair-midnight">Admin</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          placeholder="Password"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
          autoFocus
        />
        {error && <p className="text-xs text-red-500">Wrong password</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-blair-midnight px-4 py-2.5 text-sm font-semibold text-white hover:bg-blair-charcoal"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
