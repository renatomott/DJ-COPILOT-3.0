import React from 'react';
import { normalizeToCamelot } from '../utils/harmonicUtils';

interface CamelotWheelProps {
  activeKey?: string;
  onSelectKey?: (key: string) => void;
}

const WHEEL_DATA = [
  { pos: '1', minor: '1A', major: '1B', minorLabel: 'Ab m', majorLabel: 'B' },
  { pos: '2', minor: '2A', major: '2B', minorLabel: 'Eb m', majorLabel: 'F#' },
  { pos: '3', minor: '3A', major: '3B', minorLabel: 'Bb m', majorLabel: 'Db' },
  { pos: '4', minor: '4A', major: '4B', minorLabel: 'F m',  majorLabel: 'Ab' },
  { pos: '5', minor: '5A', major: '5B', minorLabel: 'C m',  majorLabel: 'Eb' },
  { pos: '6', minor: '6A', major: '6B', minorLabel: 'G m',  majorLabel: 'Bb' },
  { pos: '7', minor: '7A', major: '7B', minorLabel: 'D m',  majorLabel: 'F'  },
  { pos: '8', minor: '8A', major: '8B', minorLabel: 'A m',  majorLabel: 'C'  },
  { pos: '9', minor: '9A', major: '9B', minorLabel: 'E m',  majorLabel: 'G'  },
  { pos: '10', minor: '10A', major: '10B', minorLabel: 'B m',  majorLabel: 'D' },
  { pos: '11', minor: '11A', major: '11B', minorLabel: 'F# m', majorLabel: 'A' },
  { pos: '12', minor: '12A', major: '12B', minorLabel: 'Db m', majorLabel: 'E' },
];

const isCompatible = (active: string, key: string): 'active' | 'perfect' | 'good' | 'none' => {
  if (active === key) return 'active';
  const num = parseInt(active);
  const type = active.slice(-1);
  const keyNum = parseInt(key);
  const keyType = key.slice(-1);
  // Same position other type
  if (num === keyNum && type !== keyType) return 'perfect';
  // Adjacent numbers same type
  const diff = Math.abs(num - keyNum);
  const wrappedDiff = Math.min(diff, 12 - diff);
  if (wrappedDiff === 1 && type === keyType) return 'perfect';
  if (wrappedDiff === 1 && type !== keyType) return 'good';
  return 'none';
};

export const CamelotWheel: React.FC<CamelotWheelProps> = ({ activeKey, onSelectKey }) => {
  const normalizedActive = activeKey ? normalizeToCamelot(activeKey) : undefined;

  const getColor = (key: string) => {
    if (!normalizedActive) return { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' };
    const compat = isCompatible(normalizedActive, key);
    if (compat === 'active')  return { bg: 'bg-cyan-500',   text: 'text-white font-black', border: 'border-cyan-400' };
    if (compat === 'perfect') return { bg: 'bg-green-600/80', text: 'text-white font-bold', border: 'border-green-500' };
    if (compat === 'good')    return { bg: 'bg-yellow-600/60', text: 'text-white',           border: 'border-yellow-500' };
    return { bg: 'bg-slate-900', text: 'text-slate-600', border: 'border-slate-800' };
  };

  return (
    <div className="w-full">
      {normalizedActive && (
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Tom ativo:</span>
          <span className="text-xs font-black text-cyan-400">{normalizedActive}</span>
          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block"/> Ativo
            <span className="w-2 h-2 rounded-full bg-green-600 inline-block ml-1"/> Perfeito
            <span className="w-2 h-2 rounded-full bg-yellow-600 inline-block ml-1"/> Bom
          </div>
        </div>
      )}
      <div className="grid grid-cols-6 gap-1">
        {WHEEL_DATA.map(({ pos, minor, major, minorLabel, majorLabel }) => {
          const minorColor = getColor(minor);
          const majorColor = getColor(major);
          return (
            <React.Fragment key={pos}>
              <button
                onClick={() => onSelectKey?.(minor)}
                className={`rounded-lg p-1.5 border text-center transition-all active:scale-95 ${minorColor.bg} ${minorColor.border}`}
              >
                <div className={`text-[10px] font-black ${minorColor.text}`}>{minor}</div>
                <div className="text-[8px] text-slate-400 leading-tight">{minorLabel}</div>
              </button>
              <button
                onClick={() => onSelectKey?.(major)}
                className={`rounded-lg p-1.5 border text-center transition-all active:scale-95 ${majorColor.bg} ${majorColor.border}`}
              >
                <div className={`text-[10px] font-black ${majorColor.text}`}>{major}</div>
                <div className="text-[8px] text-slate-400 leading-tight">{majorLabel}</div>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
