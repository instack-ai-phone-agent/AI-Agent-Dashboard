"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { Toaster } from "@/components/ui/sonner"


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://test.aivocall.com/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "password",
          username: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // Save the access token (in localStorage or cookie)
      localStorage.setItem("access_token", data.access_token);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Left: Login Form */}
      <div className="flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-center">
            <Icons.logo className="h-8 w-8 text-pink-600" />
          </div>
          <h2 className="text-2xl font-bold text-center">Log in to your Instack account</h2>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-pink-600" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>

                    <p className="text-xs text-center text-gray-500 mt-2">
            By clicking on log in, you agree to our{" "}
            <a href="/terms" className="underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline">
              Privacy Policy
            </a>.
          </p>

          <p className="text-sm text-center text-gray-700">
            Don’t have an account?{" "}
            <a href="/signup" className="font-medium text-pink-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>

      {/* Right: Marketing Panel */}
      <div className="hidden md:flex flex-col justify-center bg-black text-white p-12">
        <h1 className="text-4xl font-bold mb-4">Your AI Phone Agent, Ready 24/7</h1>
        <p className="text-lg font-medium mb-2">Built for Australian Businesses</p>
        <p className="text-sm max-w-md">
          Instack's AI phone agent handles calls, messages, and bookings at any hour. No missed
          leads, no hold times — just real-time customer service powered by natural conversation.
        </p>
      </div>
    </div>
  );
}
