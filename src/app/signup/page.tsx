"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Left: Signup Form */}
      <div className="flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-center">
            <Icons.logo className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-center">Create your Instack account</h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" placeholder="Jane Smith" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@business.com" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" required />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Sign up"}
            </Button>
          </form>

          <p className="text-xs text-center text-gray-500 mt-2">
            By clicking on sign up, you agree to our{" "}
            <a href="/terms" className="underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline">
              Privacy Policy
            </a>.
          </p>

          <p className="text-sm text-center text-gray-700">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-indigo-600 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>

      {/* Right: Visual/Marketing */}
      <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-12">
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
