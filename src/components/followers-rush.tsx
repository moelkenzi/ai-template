"use client";

import { useEffect, useState } from "react";
import { Player } from "@remotion/player";
import { FollowerRush, type Follower } from "@/components/snap-cn/follower-rush";

function parseCSV(csvText: string): Follower[] {
  const lines = csvText.trim().split("\n");
  if (lines.length <= 1) return [];

  const followers: Follower[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Match CSV row accounting for quoted values with commas
    const match = line.match(/^(".*?"|[^,]+),(.*)$/);
    if (match) {
      let name = match[1].replace(/^"|"$/g, "").trim();
      // Clean up common suffix noise if present in raw names
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

export interface RushProps {
  increaseWithFollowers?: number;
  orientation?: "horizontal" | "vertical";
}

export const Rush = ({
  increaseWithFollowers = 35,
  orientation = "horizontal",
}: RushProps) => {
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

  const totalCount = (followers.length || 285) + increaseWithFollowers;
  const isVertical = orientation === "vertical";
  const compW = isVertical ? 720 : 1280;
  const compH = isVertical ? 1280 : 720;

  return (
    <Player
      component={FollowerRush}
      inputProps={{
        totalFollowers: totalCount,
        followers: followers,
        orientation: orientation,
        speed: 1,
      }}
      durationInFrames={300}
      fps={30}
      compositionWidth={compW}
      compositionHeight={compH}
      style={{ width: "100%", height: "100vh", objectFit: "contain" }}
      autoPlay
      loop
    />
  );
};
