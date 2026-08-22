"use client";

import { MasterFollowersPlayer } from "@/components/master-followers-video";

export default function Home() {
  return (
    <main className="w-full h-screen bg-slate-950">
      <MasterFollowersPlayer increaseWithFollowers={35} />
    </main>
  );
}
