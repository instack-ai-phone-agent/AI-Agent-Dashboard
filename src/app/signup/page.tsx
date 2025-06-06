"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { Toaster } from "@/components/ui/sonner";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic Validation
    if (!firstName || !lastName) {
      setError("Please enter your first and last name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://test.aivocall.com/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role_id: 0,
          first_name: firstName,
          last_name: lastName,
          email,
          phone_number: phone || "0000000000",
          password,
          email_notifications_frequency: "daily",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Signup failed");
      }

      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Signup Form */}
      <div className="flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-center">
            <Icons.logo className="h-8 w-8 text-pink-600" />
          </div>
          <h2 className="text-2xl font-bold text-center">Create your Instack account</h2>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Jane"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Smith"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
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
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+61 4XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
              {loading ? "Creating Account..." : "Sign up"}
            </Button>
          </form>

          <p className="text-xs text-center text-gray-500 mt-2">
            By clicking on sign up, you agree to our{" "}
            <a href="/terms" className="underline">Terms of Service</a> and{" "}
            <a href="/privacy" className="underline">Privacy Policy</a>.
          </p>

          <p className="text-sm text-center text-gray-700">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-pink-600 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>

      {/* Marketing Panel */}
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
