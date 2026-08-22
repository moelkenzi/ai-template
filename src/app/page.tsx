"use client";

import { PromptZoom } from "@/components/snap-cn/prompt-zoom";
import { Player } from "@remotion/player";

const AskScene = () => (
  <PromptZoom
    greeting="LinkedIn"
    text="Create me a premium, minimal video of visualizing my followers on linkedin."
    cutAt={0.9}
    zoomDuration={0.9}
    zoom={2.5}
  />
);

export default function Home() {
  return (
    <main className="w-full h-screen bg-slate-950">
      <Player
        component={AskScene}
        durationInFrames={190}
        fps={30}
        compositionWidth={1280}
        compositionHeight={720}
        style={{ width: "100%", height: "100%" }}
        autoPlay
        loop
      />
    </main>
  );
}
