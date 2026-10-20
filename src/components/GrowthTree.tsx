import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface GrowthTreeProps {
  checkInCount: number;
}

export const GrowthTree: React.FC<GrowthTreeProps> = ({ checkInCount }) => {
  // Compute leaf growth stage from check-ins (1 leaf per check-in up to ~18 leaves)
  const leafCount = Math.max(3, Math.min(18, checkInCount));
  
  let stageName = 'Sprouting Seedling';
  let stageDescription = 'Your roots are finding ground in self-awareness.';
  if (leafCount >= 14) {
    stageName = 'Flourishing Canopy';
    stageDescription = 'A steady rhythm of listening to your feelings.';
  } else if (leafCount >= 9) {
    stageName = 'Branching Sapling';
    stageDescription = 'Growing with every honest check-in and reflection.';
  } else if (leafCount >= 5) {
    stageName = 'Budding Sprout';
    stageDescription = 'Small daily check-ins build resilient branches.';
  }

  // Pre-calculated leaf positions for a balanced, organic tree
  const leaves = [
    { cx: 120, cy: 110, rx: 14, ry: 8, rotate: -25, fill: '#174D3A' },
    { cx: 80, cy: 125, rx: 12, ry: 7, rotate: -55, fill: '#A8C5A0' },
    { cx: 160, cy: 120, rx: 13, ry: 7, rotate: 35, fill: '#174D3A' },
    { cx: 100, cy: 90, rx: 14, ry: 8, rotate: -40, fill: '#236850' },
    { cx: 140, cy: 85, rx: 15, ry: 8, rotate: 30, fill: '#A8C5A0' },
    { cx: 120, cy: 65, rx: 13, ry: 7, rotate: 0, fill: '#174D3A' },
    { cx: 65, cy: 110, rx: 11, ry: 6, rotate: -70, fill: '#A8C5A0' },
    { cx: 175, cy: 105, rx: 12, ry: 6, rotate: 60, fill: '#236850' },
    { cx: 90, cy: 65, rx: 12, ry: 7, rotate: -30, fill: '#174D3A' },
    { cx: 150, cy: 65, rx: 13, ry: 7, rotate: 25, fill: '#A8C5A0' },
    { cx: 120, cy: 45, rx: 12, ry: 6, rotate: -5, fill: '#174D3A' },
    { cx: 75, cy: 85, rx: 11, ry: 6, rotate: -45, fill: '#A8C5A0' },
    { cx: 165, cy: 85, rx: 11, ry: 6, rotate: 45, fill: '#236850' },
    { cx: 105, cy: 48, rx: 10, ry: 5, rotate: -20, fill: '#A8C5A0' },
    { cx: 135, cy: 48, rx: 10, ry: 5, rotate: 18, fill: '#174D3A' },
    { cx: 55, cy: 135, rx: 9, ry: 5, rotate: -65, fill: '#236850' },
    { cx: 185, cy: 130, rx: 9, ry: 5, rotate: 55, fill: '#A8C5A0' },
    { cx: 120, cy: 30, rx: 9, ry: 5, rotate: 0, fill: '#D97706' }, // Blossoming crest
  ];

  const visibleLeaves = leaves.slice(0, leafCount);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
      {/* Background soft ambiance */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-[#E3F2E8]/40 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold tracking-wider text-[#174D3A] uppercase">
            Personal Growth Tree
          </span>
          <h4 className="text-lg font-bold text-[#202B26] mt-0.5">{stageName}</h4>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F7F8F4] border border-neutral-200/80 rounded-lg text-xs font-medium text-[#174D3A]">
          <Sparkles className="w-3.5 h-3.5 text-[#174D3A]" />
          <span>{leafCount} Leaves Flourishing</span>
        </div>
      </div>

      {/* Organic Tree SVG */}
      <div className="py-2 flex items-center justify-center">
        <svg viewBox="0 0 240 210" className="w-52 h-44 transition-all duration-700 ease-out">
          {/* Ground mound */}
          <path
            d="M 40 190 Q 120 175 200 190 Q 120 198 40 190 Z"
            fill="#E3F2E8"
          />
          {/* Soil roots */}
          <path
            d="M 120 180 C 110 185 100 195 90 198 M 120 180 C 130 185 140 195 150 198"
            stroke="#A8C5A0"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Trunk & Main Branches */}
          <path
            d="M 115 182 C 117 150 114 130 120 100 C 122 80 120 55 120 40"
            stroke="#174D3A"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          {/* Left Branch */}
          <path
            d="M 118 135 C 105 130 85 125 70 115 M 117 105 C 105 95 92 88 80 82"
            stroke="#174D3A"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Right Branch */}
          <path
            d="M 118 132 C 135 128 155 122 170 112 M 119 100 C 135 90 150 85 162 78"
            stroke="#174D3A"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Leaves */}
          {visibleLeaves.map((leaf, idx) => (
            <ellipse
              key={idx}
              cx={leaf.cx}
              cy={leaf.cy}
              rx={leaf.rx}
              ry={leaf.ry}
              fill={leaf.fill}
              transform={`rotate(${leaf.rotate} ${leaf.cx} ${leaf.cy})`}
              className="transition-all duration-500 hover:scale-125 cursor-pointer opacity-95"
            />
          ))}

          {/* Soft blossom petals if high check-in */}
          {leafCount >= 10 && (
            <circle cx="120" cy="50" r="3.5" fill="#D97706" opacity="0.9" />
          )}
          {leafCount >= 15 && (
            <>
              <circle cx="95" cy="72" r="3" fill="#D97706" opacity="0.8" />
              <circle cx="145" cy="72" r="3" fill="#D97706" opacity="0.8" />
            </>
          )}
        </svg>
      </div>

      {/* Supportive non-punishing message */}
      <div className="bg-[#F7F8F4] rounded-xl p-3 border border-neutral-200/60 flex items-start gap-2.5">
        <Heart className="w-4 h-4 text-[#174D3A] shrink-0 mt-0.5" />
        <p className="text-xs text-[#202B26]/80 leading-relaxed">
          {stageDescription}{' '}
          <span className="font-semibold text-[#174D3A]">
            No streaks to maintain, no guilt for resting.
          </span>
        </p>
      </div>
    </div>
  );
};
