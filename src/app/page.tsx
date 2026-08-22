"use client";

import { Rush } from "@/components/followers-rush";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-5xl px-4">
        <Rush increaseWithFollowers={35} />
      </div>
    </div>
  );
}
