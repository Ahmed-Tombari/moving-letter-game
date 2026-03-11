import { LessonContainer } from "@/components/LessonContainer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#FDF5E6] p-2 md:p-2 overflow-hidden relative">
      <div className="text-center mb-2 relative z-10">
        <h1 className="text-5xl md:text-7xl font-black text-[#4B0082] drop-shadow-sm mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          لعبة الحرف المتحرك
        </h1>
        {/* <p className="text-xl md:text-2xl text-[#FF1493] font-black tracking-widest uppercase">
          Moving Letter Game
        </p> */}
      </div>

      <LessonContainer />

      {/* Playful Background Decorations */}
      <div className="fixed -bottom-32 -left-32 w-120 h-120 bg-[#87CEEB]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -top-32 -right-32 w-120 h-120 bg-[#FF1493]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-[#FFD700]/10 rounded-full blur-3xl pointer-events-none" />
    </main>
  );
}
