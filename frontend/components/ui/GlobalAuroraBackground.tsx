"use client";

import dynamic from "next/dynamic";

const SoftAurora = dynamic(() => import("./SoftAurora"), { ssr: false });

export function GlobalAuroraBackground() {
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden opacity-30 dark:opacity-60 transition-opacity duration-1000">
      <SoftAurora
        speed={0.5}
        scale={1.5}
        brightness={1.0}
        color1="#6366f1"
        color2="#e100ff"
        noiseFrequency={2.5}
        noiseAmplitude={1.0}
        bandHeight={0.5}
        bandSpread={1.0}
        octaveDecay={0.1}
        layerOffset={0}
        colorSpeed={1.0}
        enableMouseInteraction={true}
        mouseInfluence={0.25}
        className="w-full h-full"
      />
    </div>
  );
}
export default GlobalAuroraBackground;
