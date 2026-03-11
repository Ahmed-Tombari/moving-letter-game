"use client";

import { forwardRef, useImperativeHandle, useState, useRef, useLayoutEffect } from "react";
import { motion, useDragControls, useMotionValue, animate, useMotionValueEvent } from "framer-motion";
import { type Letter, VOWELS } from "@/lib/alphabet-data";
import { cn } from "@/lib/utils";

const VOWEL_COUNT = VOWELS.length;

interface SlidingLetterCardProps {
  letter: Letter;
  onActiveIndexChange: (index: number | null) => void;
  className?: string;
  resultSyllable: string | null;
}

export interface SlidingLetterCardRef {
  snapToIndex: (index: number) => void;
}

export const SlidingLetterCard = forwardRef<SlidingLetterCardRef, SlidingLetterCardProps>(
  ({ letter, onActiveIndexChange, className, resultSyllable }, ref) => {
    const controls = useDragControls();
    const x = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [layout, setLayout] = useState({ spacing: 120, startX: 540 });
    const activeIndexRef = useRef<number>(0);

    useLayoutEffect(() => {
      const updateLayout = () => {
        if (containerRef.current) {
          const width = containerRef.current.clientWidth;
          const innerWidth = width - 64; // matching px-8 in VowelTrack (32px * 2)
          const spacing = (innerWidth - 80) / (VOWEL_COUNT - 1);
          const startX = (innerWidth - 80) / 2;
          setLayout({ spacing, startX });
          
          // Snap to current active index on resize
          const snappedX = startX - activeIndexRef.current * spacing;
          x.set(snappedX);
        }
      };
      
      updateLayout();
      window.addEventListener("resize", updateLayout);
      return () => window.removeEventListener("resize", updateLayout);
    }, [x]);

    // Send live index updates while dragging to highlight the current vowel
    useMotionValueEvent(x, "change", (latestX) => {
      let index = Math.round((layout.startX - latestX) / layout.spacing);
      index = Math.max(0, Math.min(index, VOWEL_COUNT - 1));
      if (Math.abs(latestX - (layout.startX - index * layout.spacing)) < layout.spacing * 0.7) {
        onActiveIndexChange(index);
        activeIndexRef.current = index;
      } else {
        onActiveIndexChange(null);
      }
    });

    const handleDragEnd = () => {
      const currentX = x.get();
      let index = Math.round((layout.startX - currentX) / layout.spacing);
      index = Math.max(0, Math.min(index, VOWEL_COUNT - 1));
      const snappedX = layout.startX - index * layout.spacing;
      
      // Animate exactly to the mathematically correct position
      animate(x, snappedX, { type: "spring", stiffness: 400, damping: 30 });
      onActiveIndexChange(index); // Ensure it activates exactly when snapped
      activeIndexRef.current = index;
    };

    useImperativeHandle(ref, () => ({
      snapToIndex: (index: number) => {
        const targetIndex = Math.max(0, Math.min(index, VOWEL_COUNT - 1));
        const snappedX = layout.startX - targetIndex * layout.spacing;
        animate(x, snappedX, { type: "spring", stiffness: 400, damping: 30 });
        onActiveIndexChange(targetIndex);
        activeIndexRef.current = targetIndex;
      }
    }));

    return (
      <div ref={containerRef} className={cn("relative w-full shrink-0 h-[420px] flex items-center justify-center pointer-events-none", className)}>
        <motion.div
        style={{ x }}
        drag="x"
        dragControls={controls}
        dragConstraints={{ left: -layout.startX, right: layout.startX }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        className="absolute w-[130px] h-[180px] bg-[#FDFBF7] rounded-md border border-slate-200 flex flex-col items-center justify-start cursor-grab active:cursor-grabbing touch-none select-none z-30 pointer-events-auto shadow-[0_15px_30px_rgba(0,0,0,0.2)] overflow-hidden"
        whileDrag={{ 
          scale: 1.1, 
          rotate: [0, -1, 1, 0],
          boxShadow: "0 25px 50px rgba(0,0,0,0.3)"
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 500, damping: 25, mass: 1.2 }}
      >
        {/* Horizontal Blue Ruled Lines */}
        <div className="absolute inset-0 pointer-events-none mt-8" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 23px, #93C5FD 24px)' }} />
        
        {/* Red side margin line */}
        <div className="absolute top-0 bottom-0 left-10 w-[2px] bg-red-400/80" />
        <div className="absolute top-0 bottom-0 left-11 w-px bg-red-400/40" />

        {/* Notebook Spiral Binding Holes (Left Edge) */}
        <div className="absolute top-0 bottom-0 left-2 w-4 flex flex-col justify-evenly py-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-[#2A5C4D] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-[#1b3d33]" />
          ))}
        </div>

        <div className="w-full h-full flex flex-col items-center justify-center overflow-visible pointer-events-none z-10 pt-4 pl-8">
          <motion.span 
            className="text-[5.5rem] font-bold text-[#1E3A8A] drop-shadow-sm whitespace-nowrap leading-normal" 
            animate={resultSyllable ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {resultSyllable || letter.char}
          </motion.span>
        </div>
      </motion.div>
      </div>
    );
  }
);

SlidingLetterCard.displayName = "SlidingLetterCard";
