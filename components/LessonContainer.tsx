"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VOWELS, LETTERS, SYLLABLES, type Letter } from "@/lib/alphabet-data";
import { SlidingLetterCard, type SlidingLetterCardRef } from "./SlidingLetterCard";
import { VowelTrack } from "./VowelTrack";
import { cn } from "@/lib/utils";

export function LessonContainer() {
  const [activeLetter, setActiveLetter] = useState<Letter | null>(null);
  const [activeVowelId, setActiveVowelId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [usedLetterIds, setUsedLetterIds] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("usedLetterIds");
      if (saved) {
        try {
          return new Set(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse usedLetterIds", e);
        }
      }
    }
    return new Set();
  });
  const sliderRef = useRef<SlidingLetterCardRef>(null);

  // Save progress when it changes
  useEffect(() => {
    if (usedLetterIds.size > 0) {
      localStorage.setItem("usedLetterIds", JSON.stringify(Array.from(usedLetterIds)));
    }
  }, [usedLetterIds]);

  const handleSelectLetter = (letter: Letter) => {
    setActiveLetter(letter);
    setIsModalOpen(false);
    setActiveVowelId(null);
    if (sliderRef.current) sliderRef.current.snapToIndex(0);
    
    // Mark as used
    setUsedLetterIds(prev => {
      const next = new Set(prev);
      next.add(letter.id);
      return next;
    });
  };

  const handleResetProgress = () => {
    setUsedLetterIds(new Set());
    localStorage.removeItem("usedLetterIds");
  };

  // Derived state: calculate the result syllable based on active letter and vowel
  const resultSyllable = useMemo(() => {
    if (!activeVowelId || !activeLetter) return null;
    const syllable = SYLLABLES.find(
      (s) => s.letterId === activeLetter.id && s.vowelId === activeVowelId
    );
    return syllable ? syllable.result : null;
  }, [activeLetter, activeVowelId]);

  // Audio Feedback: Speak the syllable when it's formed
  useEffect(() => {
    if (resultSyllable && typeof window !== "undefined") {
      const utterance = new SpeechSynthesisUtterance(resultSyllable);
      utterance.lang = "ar-SA"; // Arabic (Saudi Arabia)
      utterance.rate = 0.8; // Slightly slower for clarity
      window.speechSynthesis.cancel(); // Abort previous speaking
      window.speechSynthesis.speak(utterance);
    }
  }, [resultSyllable]);

  const handleActiveIndexChange = (index: number | null) => {
    if (index === null || VOWELS[index].id === "none") {
      setActiveVowelId(null);
    } else {
      setActiveVowelId(VOWELS[index].id);
    }
  };

  const handleVowelClick = (vowelId: string) => {
    const index = VOWELS.findIndex((v) => v.id === vowelId);
    if (index !== -1 && sliderRef.current) {
      sliderRef.current.snapToIndex(index);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center gap-6 w-full max-w-full p-6 bg-[#2A5C4D] rounded-[3rem] shadow-[0_32px_100px_rgba(0,0,0,0.2)] border-4 border-[#8B5A2B] overflow-hidden">
      
      {/* Subtle Chalk Dust Texture / Decorations */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* Classroom Decorations fixed on the board */}
      <div className="absolute top-6 left-8 text-6xl opacity-80 -rotate-12">🍎</div>
      <div className="absolute bottom-10 right-10 text-6xl opacity-80 rotate-12">📚</div>
      <div className="absolute top-20 right-16 text-5xl opacity-80 rotate-45">📏</div>
      <div className="absolute bottom-20 left-12 text-5xl opacity-80 -rotate-45">🖍️</div>

      {/* Interaction Board */}
      <div className="w-full pb-1 pt-1 z-10">
        {/* Syllable Description Display - Pinned Flashcard */}
        <div className="w-full flex justify-center h-28 relative">
          <AnimatePresence mode="popLayout">
            {activeLetter && activeVowelId && activeVowelId !== "none" && (
              <motion.div 
                key={`${activeLetter.id}-${activeVowelId}`}
                initial={{ opacity: 0, scale: 0.5, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: -30 }}
                transition={{ type: "spring", stiffness: 700, damping: 25, mass: 0.8 }}
                className="relative bg-[#FFF9C4] p-2 rounded-xl shadow-[2px_10px_20px_rgba(0,0,0,0.3)] border-2 border-[#E6C200] overflow-visible"
              >
                {/* Red Pin */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full shadow-md border-2 border-red-700 z-10 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white/50 rounded-full absolute top-1 left-1" />
                </div>

                {/* Floating Classroom Emojis Decoration */}
                <motion.div 
                  animate={{ y: [0, -5, 0], rotate: [-10, 10, -10] }} 
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute -top-6 -left-6 text-4xl"
                >⭐</motion.div>
                <motion.div 
                  animate={{ y: [0, 5, 0], rotate: [10, -10, 10] }} 
                  transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
                  className="absolute -bottom-6 -right-6 text-4xl"
                >✏️</motion.div>

                <div className="bg-[#FFF59D] border-2 border-dashed border-[#D4A017] px-14 py-6 rounded-lg flex items-center gap-8 shadow-inner">
                  <span className="text-4xl font-black text-slate-800 drop-shadow-sm leading-none">
                    {VOWELS.find(v => v.id === activeVowelId)?.arabicName}
                  </span>
                  
                  <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.6 }} className="text-4xl">
                    <span className="font-bold text-red-500 drop-shadow-sm leading-none">+</span>
                  </motion.div>

                  <span className="text-6xl font-black text-slate-800 drop-shadow-sm leading-none">
                    {activeLetter.char}
                  </span>
                </div>
                
                {/* Celebratory Burst Emojis (Visual feedback only on snap) */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <span className="text-xl">✨</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative flex flex-col items-center w-full mx-auto">
          {/* The Track Component */}
          <VowelTrack 
            onClick={handleVowelClick}
            activeVowelId={activeVowelId} 
          />

          {/* The Slider Overlay */}
          <div className="absolute inset-0 left-0 w-full h-full flex justify-center pointer-events-none">
            {activeLetter && (
              <SlidingLetterCard 
                ref={sliderRef}
                letter={activeLetter} 
                onActiveIndexChange={handleActiveIndexChange}
                resultSyllable={resultSyllable}
              />
            )}
          </div>
        </div>
      </div>

      {/* Start Button / Letter Switcher */}
      <div className="flex flex-wrap flex-row-reverse items-center justify-center gap-4 z-40 mt-4 w-full max-w-md mx-auto">
        <motion.button
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className="group relative w-full px-8 py-5 rounded-2xl transition-all duration-300 transform font-bold bg-[#FF5722] text-white shadow-[0_15px_30px_rgba(255,87,34,0.4)] hover:shadow-[0_20px_40px_rgba(255,87,34,0.5)] overflow-hidden cursor-pointer border-4 border-[#E64A19]"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <span className="relative z-10 flex items-center justify-center gap-3 text-2xl font-black drop-shadow-md">
            <span className="text-3xl">🧽</span> 
            {activeLetter ? `مسح واختيار حرف (${activeLetter.char})` : "اختر حرفاً للبدء"}
          </span>
        </motion.button>
      </div>

      {/* Letter Selection Modal Popup */}
      {/* Letter Selection Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
          {/* Animated blurred backdrop with richer tint */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bg-black/40 backdrop-blur-sm inset-0" 
            onClick={() => activeLetter && setIsModalOpen(false)} 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 25, delay: 0 }}
            className="relative bg-[#FFF8E7] rounded-[2rem] border-12 border-[#8B5A2B] max-w-7xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)]"
          >
            {/* Playful Header Area - Bulletin Board */}
            <div className="flex justify-between items-center px-10 py-6 bg-[#E8DCC4] border-b-4 border-[#8B5A2B] shrink-0 relative">
              <div className="flex flex-col items-end w-full pr-2">
                <h2 className="text-4xl font-black text-[#5D4037] tracking-tight text-right drop-shadow-sm flex items-center gap-3">
                  لوحة الحروف <span className="text-5xl">📌</span>
                </h2>
                <div className="h-2 w-32 bg-[#FF5722] rounded-full mt-2" />
              </div>
              
              <div className="absolute left-10 top-8 flex items-center gap-3">
                {/* Reset Progress Button */}
                {usedLetterIds.size > 0 && (
                  <button
                    onClick={handleResetProgress}
                    className="h-12 px-4 rounded-2xl bg-red-100 text-red-900/90 hover:text-red-500 hover:bg-red-50 transition-all border border-indigo-50 text-sm font-bold flex items-center gap-2 cursor-pointer"
                    title="Reset Progress"
                  >
                    <span>إعادة ضبط</span>
                    <span className="text-lg">↺</span>
                  </button>
                )}

                {/* Refined Close Button */}
                {activeLetter && (
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="w-12 h-12 rounded-2xl bg-white/80 text-indigo-900 flex items-center justify-center hover:text-red-500 hover:bg-red-50 hover:shadow-lg hover:scale-110 active:scale-95 transition-all border border-indigo-50 group cursor-pointer"
                    aria-label="Close"
                  >
                    <span className="text-2xl font-black transition-transform group-hover:rotate-90">✕</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* Letter Grid Scrollable Area with Staggered Container */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.01
                  }
                }
              }}
              className="overflow-y-auto px-8 py-10 custom-scrollbar bg-transparent" 
              dir="rtl"
            >
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-4 justify-center max-w-full mx-auto pb-8">
                {LETTERS.map((letter) => {
                  const isUsed = usedLetterIds.has(letter.id);
                  const isActive = activeLetter?.id === letter.id;
                  
                  return (
                    <motion.button
                      key={letter.id}
                      variants={{
                        hidden: { opacity: 0, scale: 0.5, y: 20 },
                        visible: { opacity: 1, scale: 1, y: 0 }
                      }}
                      whileHover={{ scale: 1.08, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelectLetter(letter)}
                      className={cn(
                        "group relative aspect-square rounded-2xl transition-all duration-300 transform font-bold flex flex-col items-center justify-center overflow-hidden border-4 cursor-pointer",
                        isActive
                          ? "bg-[#FFF9C4] border-[#FF5722] shadow-[0_10px_20px_rgba(255,87,34,0.3)] z-10 scale-110"
                          : isUsed
                            ? "bg-[#E8F5E9] border-[#4CAF50] shadow-[0_5px_10px_rgba(76,175,80,0.2)]"
                            : "bg-white border-[#D7CCC8] text-[#5D4037] hover:border-[#FF9800] hover:bg-[#FFF3E0] shadow-sm hover:shadow-xl"
                      )}
                    >
                      {/* Inner highlight */}
                      <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <span className={cn(
                        "text-[3rem] font-black leading-none drop-shadow-sm transition-all",
                        isActive || isUsed ? "text-[#3E2723]" : "text-[#5D4037] group-hover:text-[#E65100]"
                      )}>
                        {letter.char.replace("ـ", "")}
                      </span>

                      {/* Tick Icon for used letters */}
                      {isUsed && !isActive && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-emerald-600 text-xs font-black">✓</span>
                        </div>
                      )}

                      {isActive && (
                        <motion.div 
                          layoutId="activeGlow"
                          className="absolute inset-0 rounded-3xl ring-4 ring-pink-400/50 ring-inset"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
