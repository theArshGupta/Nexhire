import React from "react";
import { motion } from "motion/react";

export default function RaycastBackground() {
  // Soft, deep, expensive ambient lighting beams (Royal Blue, Steel Blue, Slate Blue, Midnight Blue)
  const beams = [
    {
      id: 1,
      width: "w-20 sm:w-28",
      height: "h-[650px] sm:h-[850px]",
      bg: "bg-gradient-to-b from-[#1e3a8a]/20 via-[#1e293b]/15 to-transparent",
      left: "15%",
      top: "-15%",
      blur: "blur-[60px] sm:blur-[90px]",
      duration: 14,
      delay: 0,
      yOffset: [-40, 40],
    },
    {
      id: 2,
      width: "w-24 sm:w-36",
      height: "h-[550px] sm:h-[750px]",
      bg: "bg-gradient-to-b from-[#2563eb]/15 via-[#1e1b4b]/20 to-transparent",
      left: "35%",
      top: "5%",
      blur: "blur-[70px] sm:blur-[100px]",
      duration: 16,
      delay: 1.5,
      yOffset: [30, -30],
    },
    {
      id: 3,
      width: "w-16 sm:w-24",
      height: "h-[750px] sm:h-[950px]",
      bg: "bg-gradient-to-b from-[#0284c7]/12 via-[#0f172a]/20 to-transparent",
      left: "52%",
      top: "-20%",
      blur: "blur-[50px] sm:blur-[80px]",
      duration: 18,
      delay: 3,
      yOffset: [-50, 50],
    },
    {
      id: 4,
      width: "w-28 sm:w-40",
      height: "h-[500px] sm:h-[700px]",
      bg: "bg-gradient-to-b from-[#3b82f6]/10 via-[#1e293b]/25 to-transparent",
      left: "70%",
      top: "10%",
      blur: "blur-[80px] sm:blur-[120px]",
      duration: 15,
      delay: 0.5,
      yOffset: [35, -35],
    },
    {
      id: 5,
      width: "w-16 sm:w-20",
      height: "h-[600px] sm:h-[800px]",
      bg: "bg-gradient-to-b from-[#1d4ed8]/15 via-[#0f172a]/15 to-transparent",
      left: "85%",
      top: "-10%",
      blur: "blur-[50px] sm:blur-[80px]",
      duration: 17,
      delay: 2,
      yOffset: [-30, 30],
    }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#050505]">
      {/* Rotated background container for the diagonal parallel light shafts */}
      <div className="absolute inset-0 w-[140%] h-[140%] top-[-20%] left-[-20%] rotate-[-35deg] origin-center">
        <div className="relative w-full h-full flex justify-around items-start">
          {beams.map((beam) => (
            <motion.div
              key={beam.id}
              initial={{ y: beam.yOffset[0], opacity: 0.1 }}
              animate={{ 
                y: beam.yOffset,
                opacity: [0.1, 0.35, 0.1]
              }}
              transition={{
                duration: beam.duration,
                delay: beam.delay,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
              className={`absolute rounded-full shrink-0 ${beam.width} ${beam.height} ${beam.bg} ${beam.blur}`}
              style={{
                left: beam.left,
                top: beam.top,
              }}
            />
          ))}
        </div>
      </div>

      {/* Very soft noise texture for paper/digital tactile quality */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;utf8,<svg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22><filter id=%22noise%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%%22 height=%22100%%22 filter=%22url(%23noise)%22/></svg>')]"></div>

      {/* Radial soft Vignette Mask to seamlessly fade lights into pure solid matte black (#050505) at borders */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#050505_85%)] opacity-95"></div>
    </div>
  );
}
