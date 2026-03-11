"use client";

import { motion } from "framer-motion";
import { VOWELS, type Vowel } from "@/lib/alphabet-data";
import { cn } from "@/lib/utils";

interface VowelTrackProps {
  onClick: (vowelId: string) => void;
  activeVowelId: string | null;
}

const VOWEL_POSITIONS: Record<string, "top" | "bottom" | "inline"> = {
  none: "inline",
  fatha: "top",
  damma: "top",
  kasra: "bottom",
  fathatayn: "top",
  dammatayn: "top",
  kasratayn: "bottom",
  alif: "inline",
  waw: "inline",
  ya: "inline",
};

export function VowelTrack({ onClick, activeVowelId }: VowelTrackProps) {
  return (
    <div className="relative w-full shrink-0 h-[420px] flex items-center justify-center px-8">
      {/* The main Sky Blue track Background - A recessed slot */}
      <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-20 bg-[#87CEEB] rounded-full shadow-[inset_0_10px_20px_rgba(0,0,0,0.2)] border-4 border-[#5F9EA0] pointer-events-none" />

      {/* Vowels Grid - Responsive width with even spacing */}
      <div className="relative z-10 w-full flex flex-row-reverse items-center justify-between">
        {VOWELS.map((vowel) => {
          const position = VOWEL_POSITIONS[vowel.id];
          const isActive = activeVowelId === vowel.id;

          return (
            <div key={vowel.id} className="relative flex flex-col items-center justify-center w-20 h-[420px]">
              {/* Top Vowel */}
              {position === "top" && (
                <div className="absolute top-0">
                  <VowelMark vowel={vowel} isActive={isActive} onClick={onClick} />
                </div>
              )}

              {/* Inline Vowel (Station) */}
              {position === "inline" && (
                <div className="absolute top-1/2 -translate-y-1/2">
                   <div className="w-18 h-18 rounded-full bg-[#FFD700] border-[6px] border-white shadow-lg flex items-center justify-center translate-y-[2px]">
                     <VowelMark vowel={vowel} isActive={isActive} onClick={onClick} isInline />
                   </div>
                </div>
              )}

              {/* Bottom Vowel */}
              {position === "bottom" && (
                <div className="absolute bottom-0">
                  <VowelMark vowel={vowel} isActive={isActive} onClick={onClick} />
                </div>
              )}

              {/* Track marker / slot indicator if not inline */}
              {position !== "inline" && (
                 <div 
                   className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/40 shadow-inner cursor-pointer hover:bg-white/60 hover:scale-125 transition-all duration-200 z-10 pointer-events-auto" 
                   onClick={() => onClick(vowel.id)}
                 />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VowelMark({ 
  vowel, 
  isActive, 
  onClick,
  isInline = false
}: { 
  vowel: Vowel; 
  isActive: boolean; 
  onClick: (id: string) => void;
  isInline?: boolean;
}) {
  return (
    <motion.div
      className={cn(
        "relative flex items-center justify-center transition-all duration-300 cursor-pointer pointer-events-auto shadow-[0_10px_20px_rgba(0,0,0,0.3)] overflow-hidden",
        isInline 
          ? "w-full h-full rounded-full" 
          : "w-20 h-20 bg-[#FFF9C4] border-4 border-[#8B5A2B] rounded-full",
        isActive && !isInline
          ? "ring-4 ring-[#FF5722] ring-offset-4 ring-offset-[#2A5C4D] scale-125 -translate-y-4 z-20 bg-[#FFE082]"
          : "hover:scale-110",
        isActive && isInline && "scale-110" // subtle scale for inline active
      )}
      onClick={() => onClick(vowel.id)}
      whileTap={{ scale: 0.85 }}
      animate={isActive ? { y: [0, -8, 0] } : {}}
      transition={{ repeat: isActive ? Infinity : 0, duration: 1.5, ease: "easeInOut" }}
    >
      {/* Glossy overlay for kid-friendly toy look */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/30 rounded-t-full pointer-events-none" />

      <span className={cn(
        "font-black drop-shadow-sm flex items-center justify-center w-full h-full select-none",
        isInline ? cn(
          "text-6xl text-[#3E2723]",
          vowel.id === 'ya' && "-translate-y-3",
          vowel.id === 'waw' && "-translate-y-2",
          vowel.id === 'alif'
        ) : cn(
          "text-7xl text-[#3E2723]",
          vowel.id === 'kasra' || vowel.id === 'kasratayn' ? "-translate-y-[28%]" : "translate-y-[40%]"
        )
      )}>
        {vowel.symbol.replace("◌", "") || vowel.symbol}
      </span>
      
      {/* Decorative stars when active */}
      {isActive && !isInline && (
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-5 -right-5 text-2xl"
        >⭐</motion.div>
      )}
    </motion.div>
  );
}
