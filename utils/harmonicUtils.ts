
// Camelot Wheel Map
// 1A = Abm, 1B = B, etc.
const CAMELOT_MAP: Record<string, { perfect: string[], good: string[] }> = {
  '1A': { perfect: ['1A', '1B', '12A', '2A'], good: ['12B', '2B'] },
  '1B': { perfect: ['1B', '1A', '12B', '2B'], good: ['12A', '2A'] },
  '2A': { perfect: ['2A', '2B', '1A', '3A'], good: ['1B', '3B'] },
  '2B': { perfect: ['2B', '2A', '1B', '3B'], good: ['1A', '3A'] },
  '3A': { perfect: ['3A', '3B', '2A', '4A'], good: ['2B', '4B'] },
  '3B': { perfect: ['3B', '3A', '2B', '4B'], good: ['2A', '4A'] },
  '4A': { perfect: ['4A', '4B', '3A', '5A'], good: ['3B', '5B'] },
  '4B': { perfect: ['4B', '4A', '3B', '5B'], good: ['3A', '5A'] },
  '5A': { perfect: ['5A', '5B', '4A', '6A'], good: ['4B', '6B'] },
  '5B': { perfect: ['5B', '5A', '4B', '6B'], good: ['4A', '6A'] },
  '6A': { perfect: ['6A', '6B', '5A', '7A'], good: ['5B', '7B'] },
  '6B': { perfect: ['6B', '6A', '5B', '7B'], good: ['5A', '7A'] },
  '7A': { perfect: ['7A', '7B', '6A', '8A'], good: ['6B', '8B'] },
  '7B': { perfect: ['7B', '7A', '6B', '8B'], good: ['6A', '8A'] },
  '8A': { perfect: ['8A', '8B', '7A', '9A'], good: ['7B', '9B'] },
  '8B': { perfect: ['8B', '8A', '7B', '9B'], good: ['7A', '9A'] },
  '9A': { perfect: ['9A', '9B', '8A', '10A'], good: ['8B', '10B'] },
  '9B': { perfect: ['9B', '9A', '8B', '10B'], good: ['8A', '10A'] },
  '10A': { perfect: ['10A', '10B', '9A', '11A'], good: ['9B', '11B'] },
  '10B': { perfect: ['10B', '10A', '9B', '11B'], good: ['9A', '11A'] },
  '11A': { perfect: ['11A', '11B', '10A', '12A'], good: ['10B', '12B'] },
  '11B': { perfect: ['11B', '11A', '10B', '12B'], good: ['10A', '12A'] },
  '12A': { perfect: ['12A', '12B', '11A', '1A'], good: ['11B', '1B'] },
  '12B': { perfect: ['12B', '12A', '11B', '1B'], good: ['11A', '1A'] },
};

export interface ClashResult {
  hasClash: boolean;
  reasons: string[];
  severity: 'none' | 'warning' | 'critical';
}

export const detectClash = (trackA_Key: string, trackA_Bpm: string, trackB_Key: string, trackB_Bpm: string): ClashResult => {
  const result: ClashResult = { hasClash: false, reasons: [], severity: 'none' };

  // 1. BPM Clash (> 6% difference usually sounds bad without master tempo/artifacts)
  const bpmA = parseFloat(trackA_Bpm) || 0;
  const bpmB = parseFloat(trackB_Bpm) || 0;
  
  if (bpmA > 0 && bpmB > 0) {
    const diff = Math.abs(bpmA - bpmB);
    const percentage = (diff / bpmA) * 100;
    
    if (percentage > 6) {
      result.hasClash = true;
      result.reasons.push(`BPM Gap: ${percentage.toFixed(1)}% (Too fast/slow)`);
      result.severity = 'warning';
    }
  }

  // 2. Harmonic Clash
  if (trackA_Key && trackB_Key && trackA_Key !== 'N/A' && trackB_Key !== 'N/A') {
    const keyA = normalizeToCamelot(trackA_Key);
    const keyB = normalizeToCamelot(trackB_Key);
    
    if (keyA !== keyB) {
       const compatibility = CAMELOT_MAP[keyA];
       if (compatibility) {
         if (!compatibility.perfect.includes(keyB) && !compatibility.good.includes(keyB)) {
            result.hasClash = true;
            result.reasons.push(`Harmonic Clash: ${keyA} vs ${keyB}`);
            // If severity was already warning, upgrade to critical, otherwise warning
            result.severity = result.severity === 'warning' ? 'critical' : 'warning';
         }
       }
    }
  }

  return result;
};

// ─── NORMALIZAÇÃO DE TONS → CAMELOT ──────────────────────────────────────────

const NOTE_TO_CAMELOT: Record<string, string> = {
  // Menores (A = minor)
  'Abm': '1A', 'G#m': '1A',
  'Ebm': '2A', 'D#m': '2A',
  'Bbm': '3A', 'A#m': '3A',
  'Fm':  '4A',
  'Cm':  '5A',
  'Gm':  '6A',
  'Dm':  '7A',
  'Am':  '8A',
  'Em':  '9A',
  'Bm':  '10A',
  'F#m': '11A', 'Gbm': '11A',
  'C#m': '12A', 'Dbm': '12A',
  // Maiores (B = major)
  'B':   '1B',
  'F#':  '2B', 'Gb':  '2B',
  'Db':  '3B', 'C#':  '3B',
  'Ab':  '4B', 'G#':  '4B',
  'Eb':  '5B', 'D#':  '5B',
  'Bb':  '6B', 'A#':  '6B',
  'F':   '7B',
  'C':   '8B',
  'G':   '9B',
  'D':   '10B',
  'A':   '11B',
  'E':   '12B',
};

const OPEN_KEY_TO_CAMELOT: Record<string, string> = {
  '1m': '1A',  '1d': '1B',
  '2m': '2A',  '2d': '2B',
  '3m': '3A',  '3d': '3B',
  '4m': '4A',  '4d': '4B',
  '5m': '5A',  '5d': '5B',
  '6m': '6A',  '6d': '6B',
  '7m': '7A',  '7d': '7B',
  '8m': '8A',  '8d': '8B',
  '9m': '9A',  '9d': '9B',
  '10m': '10A', '10d': '10B',
  '11m': '11A', '11d': '11B',
  '12m': '12A', '12d': '12B',
};

export const normalizeToCamelot = (key: string): string => {
  if (!key || key === 'N/A') return key;

  const trimmed = key.trim();

  // Já é Camelot (ex: 1A, 12B)
  if (/^\d{1,2}[AB]$/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  // Open Key (ex: 1m, 6d)
  const openKey = OPEN_KEY_TO_CAMELOT[trimmed.toLowerCase()];
  if (openKey) return openKey;

  // Notação musical (ex: Am, C#m, F, Bb)
  const noteKey = NOTE_TO_CAMELOT[trimmed];
  if (noteKey) return noteKey;

  // Tentativa case-insensitive
  const lower = trimmed.toLowerCase();
  for (const [k, v] of Object.entries(NOTE_TO_CAMELOT)) {
    if (k.toLowerCase() === lower) return v;
  }

  return trimmed; // retorna original se não reconhecer
};
