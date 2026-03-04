import { useEffect, useState } from 'react';
import { useSalary, formatEuro } from '@/contexts/SalaryContext';

// ── SVG layout constants ────────────────────────────────────────────────────
const VW = 420;
const VH = 300;
const PAD_V = 22;
const AVAIL_H = VH - PAD_V * 2; // 256

const LX = 12;   // left bar origin x
const LW = 88;   // left bar width
const RX = 280;  // right bars origin x
const RW = 88;   // right bar width
const RNODE_GAP = 9;

// Bezier control points (40/60 split of the gap zone)
const GAP_LEFT  = LX + LW;           // 100
const GAP_RIGHT = RX;                 // 280
const CTRL1_X   = GAP_LEFT  + (GAP_RIGHT - GAP_LEFT) * 0.38; // ≈ 168
const CTRL2_X   = GAP_LEFT  + (GAP_RIGHT - GAP_LEFT) * 0.62; // ≈ 211

// ── Color palette ───────────────────────────────────────────────────────────
const PALETTE = {
  retraite:   { bar: '#3b82f6', ribbon: '#93c5fd' },
  sante:      { bar: '#14b8a6', ribbon: '#5eead4' },
  pas:        { bar: '#f59e0b', ribbon: '#fcd34d' },
  poche:      { bar: '#10b981', ribbon: '#6ee7b7' },
  brut:       { bg: '#e8eeff', border: '#818cf8', label: '#4f46e5' },
};

interface Seg {
  key:    'retraite' | 'sante' | 'pas' | 'poche';
  label:  string;
  sub:    string;
  amount: number;
  pct:    number;
  lY:     number;  lH: number;
  rY:     number;  rH: number;
}

const SankeyFlow = () => {
  const { state, computed } = useSalary();
  const [show, setShow] = useState(false);

  // Trigger entrance animation on mount
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 60);
    return () => clearTimeout(t);
  }, []);

  if (state.activeTab !== 'employee' || state.isInverseMode) return null;

  const gross = computed.grossMonthly;
  if (gross <= 0) return null;

  const retraite = computed.ss_plafonnee + computed.ss_deplafonnee
    + computed.agirc_t1 + computed.agirc_t2 + computed.ceg + computed.cet;
  const sante = computed.csg_total + computed.mutuelle_sal + computed.apec_sal;
  const pas   = computed.pasMonthly;
  const poche = gross - retraite - sante - pas;

  const rawSegs: Array<{ key: Seg['key']; label: string; sub: string; amount: number }> = [
    { key: 'retraite', label: 'Retraite',          sub: 'SS vieillesse + AGIRC-ARRCO',            amount: retraite },
    { key: 'sante',    label: 'Santé & Protection', sub: 'CSG/CRDS + mutuelle',                    amount: sante   },
    ...(state.pasRate > 0 ? [{ key: 'pas' as const, label: 'Impôt (PAS)',
      sub: `${(state.pasRate * 100).toFixed(1)} % net imposable`, amount: pas }] : []),
    { key: 'poche',    label: 'Dans votre poche',  sub: 'Net-net disponible sur votre compte',    amount: poche   },
  ].filter(s => s.amount > 0.5);

  const n = rawSegs.length;
  const rightTotalH = AVAIL_H - (n - 1) * RNODE_GAP;

  // Compute layout
  const segs: Seg[] = rawSegs.map(s => ({
    ...s,
    pct: s.amount / gross,
    lY: 0, lH: 0,
    rY: 0, rH: 0,
  }));

  // Left bar — contiguous, no gaps
  let ly = PAD_V;
  for (const s of segs) {
    s.lH = s.pct * AVAIL_H;
    s.lY = ly;
    ly += s.lH;
  }

  // Right bars — with gaps
  let ry = PAD_V;
  for (const s of segs) {
    s.rH = Math.max(s.pct * rightTotalH, 5);
    s.rY = ry;
    ry += s.rH + RNODE_GAP;
  }

  return (
    <section className="px-4 md:px-6 max-w-6xl mx-auto py-8">
      <div className="payfit-card">
        {/* Header */}
        <div className="mb-5">
          <h3 className="text-lg font-bold text-foreground">Flux de votre salaire</h3>
          <p className="text-sm text-text-secondary mt-0.5">
            Répartition de {formatEuro(gross)} brut mensuel
          </p>
        </div>

        {/* ── SVG Sankey ── */}
        <div className="mb-5 overflow-x-auto">
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            width="100%"
            style={{ maxHeight: 320, display: 'block' }}
            aria-label="Diagramme Sankey de répartition salariale"
          >
            {/* Left bar — background */}
            <rect
              x={LX} y={PAD_V - 2}
              width={LW} height={AVAIL_H + 4}
              rx={8}
              fill={PALETTE.brut.bg}
              stroke={PALETTE.brut.border}
              strokeWidth={1.5}
              opacity={0.7}
            />

            {/* Left bar — colored segments (entrance animation) */}
            {segs.map((s, i) => {
              const isFirst = i === 0;
              const isLast  = i === n - 1;
              const inset   = 4;
              return (
                <rect
                  key={`lseg-${s.key}`}
                  x={LX + inset}
                  y={s.lY + (isFirst ? inset : 0)}
                  width={LW - inset * 2}
                  height={s.lH - (isFirst ? inset : 0) - (isLast ? inset : 0)}
                  rx={isFirst || isLast ? 5 : 2}
                  fill={PALETTE[s.key].bar}
                  opacity={show ? 0.78 : 0}
                  style={{ transition: `opacity 0.35s ease ${i * 0.07}s` }}
                />
              );
            })}

            {/* Left labels */}
            <text
              x={LX + LW / 2} y={PAD_V - 9}
              textAnchor="middle" fontSize={9.5} fontWeight="700"
              fill={PALETTE.brut.label}
            >
              BRUT
            </text>
            <text
              x={LX + LW / 2} y={VH - 4}
              textAnchor="middle" fontSize={9} fill={PALETTE.brut.label}
            >
              {formatEuro(gross)}
            </text>

            {/* Ribbons */}
            {segs.map((s, i) => {
              const lyTop = s.lY;
              const lyBot = s.lY + s.lH;
              const ryTop = s.rY;
              const ryBot = s.rY + s.rH;
              const d = [
                `M ${GAP_LEFT} ${lyTop}`,
                `C ${CTRL1_X} ${lyTop}, ${CTRL2_X} ${ryTop}, ${RX} ${ryTop}`,
                `L ${RX} ${ryBot}`,
                `C ${CTRL2_X} ${ryBot}, ${CTRL1_X} ${lyBot}, ${GAP_LEFT} ${lyBot}`,
                `Z`,
              ].join(' ');
              return (
                <path
                  key={`ribbon-${s.key}`}
                  d={d}
                  fill={PALETTE[s.key].ribbon}
                  opacity={show ? 0.35 : 0}
                  style={{ transition: `opacity 0.55s ease ${i * 0.1 + 0.1}s` }}
                />
              );
            })}

            {/* Right bars */}
            {segs.map((s, i) => {
              const pctStr  = `${(s.pct * 100).toFixed(0)} %`;
              const showPct = s.rH > 22;
              return (
                <g key={`rbar-${s.key}`}>
                  <rect
                    x={RX} y={s.rY}
                    width={RW} height={s.rH}
                    rx={6}
                    fill={PALETTE[s.key].bar}
                    opacity={show ? 0.88 : 0}
                    style={{ transition: `opacity 0.4s ease ${i * 0.1 + 0.2}s` }}
                  />
                  {showPct && (
                    <text
                      x={RX + RW / 2}
                      y={s.rY + s.rH / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={s.rH > 34 ? 10.5 : 8.5}
                      fontWeight="700"
                      fill="white"
                      opacity={show ? 1 : 0}
                      style={{ transition: `opacity 0.4s ease ${i * 0.1 + 0.35}s` }}
                    >
                      {pctStr}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Right bar labels (outside, to the right) */}
            {segs.map((s, i) => (
              <text
                key={`rlabel-${s.key}`}
                x={RX + RW + 10}
                y={s.rY + s.rH / 2}
                dominantBaseline="middle"
                fontSize={9}
                fontWeight="600"
                fill={PALETTE[s.key].bar}
                opacity={show ? 1 : 0}
                style={{ transition: `opacity 0.4s ease ${i * 0.1 + 0.4}s` }}
              >
                {formatEuro(s.amount)}
              </text>
            ))}
          </svg>
        </div>

        {/* ── Legend grid ── */}
        <div className={`grid gap-3 ${n === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'}`}>
          {segs.map(s => (
            <div key={s.key} className="flex flex-col gap-1 p-3 rounded-lg bg-background-secondary">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: PALETTE[s.key].bar }}
                />
                <span className="text-xs font-semibold text-text-secondary truncate">{s.label}</span>
              </div>
              <p className="text-base font-bold ml-4" style={{ color: PALETTE[s.key].bar }}>
                {formatEuro(s.amount)}
              </p>
              <p className="text-xs text-text-muted ml-4">
                {(s.pct * 100).toFixed(1)} % · {s.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Total line */}
        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-sm">
          <span className="text-text-secondary">Total brut mensuel</span>
          <span className="font-bold text-foreground">{formatEuro(gross)}</span>
        </div>
      </div>
    </section>
  );
};

export default SankeyFlow;
