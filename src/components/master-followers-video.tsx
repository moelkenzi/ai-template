"use client";

import { useEffect, useState } from "react";
import { AbsoluteFill, Series } from "remotion";
import { Player } from "@remotion/player";
import { PromptZoom } from "@/components/snap-cn/prompt-zoom";
import { FollowerRush, type Follower } from "@/components/snap-cn/follower-rush";

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

export interface MasterVideoProps {
  followers?: Follower[];
  increaseWithFollowers?: number;
}

export function MasterFollowersVideo({
  followers = [],
  increaseWithFollowers = 35,
}: MasterVideoProps) {
  const totalCount = (followers.length || 285) + increaseWithFollowers;

  return (
    <AbsoluteFill>
      <Series>
        {/* Scene 1: Prompt Zoom Intro (4s @ 30fps) */}
        <Series.Sequence durationInFrames={120}>
          <PromptZoom
            greeting="LinkedIn"
            text="Create me a premium, minimal video visualizing my followers on LinkedIn."
            cutAt={0.9}
            zoomDuration={0.8}
            zoom={2.4}
            typeStart={0.2}
          />
        </Series.Sequence>

        {/* Scene 2: Follower Rush Wave Animation (6s @ 30fps) — direct
            composition, no nested Player. FollowerRush paints its own
            background and centres itself within the 1280×720 stage, matching
            the FollowersScreen layout at composition time. */}
        <Series.Sequence durationInFrames={180}>
          <FollowerRush
            totalFollowers={totalCount}
            followers={followers}
            speed={1}
          />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
}

export function MasterFollowersPlayer({ increaseWithFollowers = 35 }: { increaseWithFollowers?: number }) {
  const [followers, setFollowers] = useState<Follower[]>([]);

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

  return (
    <div className="w-full h-screen flex items-center justify-center bg-slate-950">
      <Player
        component={MasterFollowersVideo}
        inputProps={{
          followers: followers,
          increaseWithFollowers: increaseWithFollowers,
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
  );
}
