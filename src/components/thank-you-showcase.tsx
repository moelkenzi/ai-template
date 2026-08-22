"use client";

import { useEffect, useState } from "react";
import { Player } from "@remotion/player";
import { FollowerRush, type Follower } from "@/components/snap-cn/follower-rush";
import { PromptZoom } from "@/components/snap-cn/prompt-zoom";
import { TextBuild } from "@/components/snap-cn/text-build";

function parseCSV(csvText: string): Follower[] {
  const lines = csvText.trim().split("\n");
  if (lines.length <= 1) return [];

  const followers: Follower[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const match = line.match(/^(".*?"|[^,]+),(.*)$/);
    if (match) {
      let name = match[1].replace(/^"|"$/g, "").trim();
      name = name
        .replace(/’s profile picture$/i, "")
        .replace(/'s profile picture$/i, "")
        .replace(/, open to work$/i, "")
        .trim();
      const avatar = match[2].replace(/^"|"$/g, "").trim();
      if (name) {
        followers.push({ name, avatar });
      }
    }
  }

  return followers;
}

export function ThankYouShowcase({ increaseWithFollowers = 35 }: { increaseWithFollowers?: number }) {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [activeTab, setActiveTab] = useState<"rush" | "prompt" | "text">("rush");

  useEffect(() => {
    let isMounted = true;

    const fetchFollowers = async () => {
      try {
        const res = await fetch(`/followers.csv?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
          },
        });
        if (!res.ok) return;
        const csvText = await res.text();
        const parsed = parseCSV(csvText);
        if (isMounted) {
          setFollowers((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(parsed)) {
              return parsed;
            }
            return prev;
          });
        }
      } catch (err) {
        console.error("Error auto-updating followers.csv:", err);
      }
    };

    fetchFollowers();
    const intervalId = setInterval(fetchFollowers, 1000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const totalCount = (followers.length || 285) + increaseWithFollowers;
  const recentFollowersStr = followers.slice(0, 5).map(f => f.name).join(", ");

  return (
    <div className="relative w-full min-h-screen bg-slate-950 text-white flex flex-col items-center justify-between overflow-hidden">
      {/* Top Header & Navigation */}
      <header className="w-full max-w-6xl mx-auto pt-8 px-6 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/30">
            🙏
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Connector Gratitude
            </h1>
            <p className="text-xs text-slate-400">
              Celebrating {totalCount} amazing network followers
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-900/80 p-1.5 rounded-full border border-slate-800 backdrop-blur-md">
          <button
            onClick={() => setActiveTab("rush")}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
              activeTab === "rush"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🌊 Follower Rush
          </button>
          <button
            onClick={() => setActiveTab("prompt")}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
              activeTab === "prompt"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ⚡ Prompt Zoom
          </button>
          <button
            onClick={() => setActiveTab("text")}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
              activeTab === "text"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ✨ Kinetic Thanks
          </button>
        </div>
      </header>

      {/* Main Showcase Area */}
      <main className="w-full flex-1 flex items-center justify-center p-4 z-10 relative">
        {activeTab === "rush" && (
          <div className="w-full h-[70vh] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900/50 backdrop-blur-xl flex items-center justify-center">
            <Player
              component={FollowerRush}
              inputProps={{
                totalFollowers: totalCount,
                followers: followers,
                orientation: "horizontal",
                speed: 1,
              }}
              durationInFrames={300}
              fps={30}
              compositionWidth={1280}
              compositionHeight={720}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              autoPlay
              loop
            />
          </div>
        )}

        {activeTab === "prompt" && (
          <div className="w-full h-[70vh] max-w-5xl rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900/50 backdrop-blur-xl flex items-center justify-center">
            <Player
              component={PromptZoom}
              inputProps={{
                greeting: "Special Thanks to Our Community",
                placeholder: "Type a prompt...",
                text: `Generating a big thank you to ${totalCount} amazing connectors including ${recentFollowersStr || "our followers"}!`,
                model: "Gemini 3.6 Flash",
                effort: "High",
                chips: [
                  `👥 ${totalCount} Followers`,
                  "🚀 Growth Surge",
                  "🤝 LinkedIn Connectors",
                  "❤️ Gratitude",
                ],
                cutAt: 1.6,
                typeStart: 0.3,
                zoom: 2.2,
              }}
              durationInFrames={240}
              fps={30}
              compositionWidth={1280}
              compositionHeight={720}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              autoPlay
              loop
            />
          </div>
        )}

        {activeTab === "text" && (
          <div className="w-full h-[70vh] max-w-5xl rounded-2xl border border-slate-800 shadow-2xl bg-slate-900/50 backdrop-blur-xl flex flex-col items-center justify-center p-8 gap-8">
            <div className="text-center space-y-3">
              <span className="px-3 py-1 text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                Kinetic Typography
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                Thanking {totalCount} Incredible Connectors
              </h2>
            </div>
            
            <div className="py-12 px-6 bg-slate-950/60 rounded-xl border border-slate-800/80 w-full max-w-3xl flex items-center justify-center min-h-[160px]">
              <TextBuild
                text={`A heartfelt thank you to all ${totalCount} connectors for being part of our journey!`}
                axis="x"
                fontSize={32}
                fontWeight={700}
                color="#6366f1"
                speed={1}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="w-full py-4 text-center text-xs text-slate-500 z-20">
        Live sync active • Total Followers: <span className="text-slate-300 font-semibold">{totalCount}</span> ({followers.length} CSV + {increaseWithFollowers} offset)
      </footer>
    </div>
  );
}
