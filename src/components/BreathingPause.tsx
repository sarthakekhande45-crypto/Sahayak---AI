import React, { useState, useEffect } from 'react';
import { Wind, Play, Pause, RotateCcw, Heart } from 'lucide-react';

export const BreathingPause: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Move to next phase
          if (phase === 'Inhale') {
            setPhase('Hold');
            return 4;
          } else if (phase === 'Hold') {
            setPhase('Exhale');
            return 4;
          } else if (phase === 'Exhale') {
            setPhase('Rest');
            return 4;
          } else {
            setPhase('Inhale');
            setCycleCount((c) => c + 1);
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase]);

  const handleReset = () => {
    setIsActive(false);
    setPhase('Inhale');
    setSecondsLeft(4);
    setCycleCount(0);
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'Inhale':
        return 'Breathe in slowly through your nose...';
      case 'Hold':
        return 'Gently pause and hold your breath...';
      case 'Exhale':
        return 'Release your breath gently through your mouth...';
      case 'Rest':
        return 'Rest comfortably before the next breath...';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E3F2E8] flex items-center justify-center text-[#174D3A]">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#202B26]">Mindful 4-4-4 Breathing Pause</h4>
            <span className="text-[10px] text-neutral-500">Box breathing for pre-exam calming</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsActive(!isActive)}
            className="px-2.5 py-1 rounded-lg bg-[#E3F2E8] text-[#174D3A] text-xs font-semibold hover:bg-[#A8C5A0]/40 transition-colors flex items-center gap-1 cursor-pointer"
          >
            {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isActive ? 'Pause' : 'Begin'}</span>
          </button>
          <button
            onClick={handleReset}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700"
            title="Reset"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Breathing Bubble */}
      <div className="flex flex-col items-center justify-center py-4 space-y-3">
        <div className="relative flex items-center justify-center">
          <div
            className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out ${
              !isActive
                ? 'bg-[#E3F2E8]/60 scale-95 border border-[#A8C5A0]'
                : phase === 'Inhale'
                ? 'bg-[#A8C5A0]/50 scale-115 border-2 border-[#174D3A]'
                : phase === 'Hold'
                ? 'bg-[#174D3A]/20 scale-110 border-2 border-[#174D3A]'
                : phase === 'Exhale'
                ? 'bg-[#E3F2E8] scale-90 border border-[#A8C5A0]'
                : 'bg-[#F7F8F4] scale-95 border border-neutral-200'
            }`}
          >
            <div className="text-center">
              <div className="text-xs font-bold text-[#174D3A] uppercase tracking-wider">
                {isActive ? phase : 'Ready'}
              </div>
              <div className="text-xl font-extrabold text-[#202B26] font-mono tabular-nums">
                {isActive ? `${secondsLeft}s` : '4s'}
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-neutral-600 text-center max-w-xs h-5 italic">
          {isActive ? getPhaseInstruction() : 'Click "Begin" to start a soothing 4-second breath cycle.'}
        </p>

        {cycleCount > 0 && (
          <div className="text-[11px] text-[#174D3A] font-semibold flex items-center gap-1">
            <Heart className="w-3 h-3 text-[#174D3A]" />
            <span>{cycleCount} mindful cycle{cycleCount > 1 ? 's' : ''} completed</span>
          </div>
        )}
      </div>
    </div>
  );
};
