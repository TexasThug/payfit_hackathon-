import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useSalary, formatEuro } from '@/contexts/SalaryContext';

// ── Palette (coherente avec SankeyFlow) ────────────────────────────────────
const C = {
  retraite:  '#3b82f6',
  sante:     '#14b8a6',
  pas:       '#f59e0b',
  poche:     '#10b981',
  patronal:  '#8b5cf6',
};

// ── Custom tooltip recharts ────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg px-3 py-2 text-sm shadow-md bg-white border border-border">
      <p className="font-semibold" style={{ color: d.color }}>{d.name}</p>
      <p className="text-foreground font-bold">{formatEuro(d.value)}</p>
      <p className="text-text-muted text-xs">{(d.pct * 100).toFixed(1)} % du brut</p>
    </div>
  );
};

// ── Metric card ────────────────────────────────────────────────────────────
interface MetricProps {
  label: string;
  value: string;
  sub: string;
  color: string;
  icon: string;
}
const MetricCard = ({ label, value, sub, color, icon }: MetricProps) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-background-secondary">
    <span className="text-xl w-7 text-center select-none" aria-hidden>{icon}</span>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-text-muted leading-tight">{label}</p>
      <p className="text-[15px] font-bold leading-snug" style={{ color }}>{value}</p>
    </div>
    <span className="text-xs text-text-muted text-right whitespace-nowrap hidden sm:block">{sub}</span>
  </div>
);

// ── Annual bar (simple visual bar) ─────────────────────────────────────────
interface AnnualBarProps {
  label: string;
  amount: number;
  total: number;
  color: string;
}
const AnnualBar = ({ label, amount, total, color }: AnnualBarProps) => {
  const pct = (amount / total) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-text-secondary w-32 shrink-0 truncate">{label}</span>
      <div className="flex-1 bg-background-secondary rounded-full h-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-semibold text-foreground w-24 text-right shrink-0">
        {formatEuro(amount)}
      </span>
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────
const MoneyDashboard = () => {
  const { state, computed } = useSalary();

  if (computed.grossMonthly <= 0) return null;
  if (state.isInverseMode) return null;

  const gross = computed.grossMonthly;

  const retraite = computed.ss_plafonnee + computed.ss_deplafonnee
    + computed.agirc_t1 + computed.agirc_t2 + computed.ceg + computed.cet;
  const sante = computed.csg_total + computed.mutuelle_sal + computed.apec_sal;
  const pas   = computed.pasMonthly;
  const poche = gross - retraite - sante - pas;

  // Donut data
  const pieData = [
    { name: 'Dans votre poche',  value: poche,    pct: poche / gross,    color: C.poche    },
    { name: 'Retraite',          value: retraite,  pct: retraite / gross, color: C.retraite },
    { name: 'Santé & Protection', value: sante,   pct: sante / gross,    color: C.sante    },
    ...(state.pasRate > 0 ? [{ name: 'Impôt (PAS)', value: pas, pct: pas / gross, color: C.pas }] : []),
  ].filter(d => d.value > 0.5);

  // Metrics
  const tauxCharge  = (computed.total_sal / gross) * 100;
  const ratioPoche  = (poche / gross) * 100;
  const ratioEff    = (gross / computed.employerCost) * 100;

  // Annual
  const annualCost  = computed.employerCostAnnual;
  const annualGross = gross * 12;
  const annualPoche = poche * 12;
  const annualSal   = computed.total_sal * 12;
  const annualPat   = computed.total_pat * 12;
  const annualPas   = pas * 12;

  const showEmployer = state.activeTab === 'employer';

  return (
    <section className="px-4 md:px-6 max-w-6xl mx-auto py-8">
      <div className="payfit-card space-y-6">

        {/* Header */}
        <div>
          <h3 className="text-lg font-bold text-foreground">Où va votre argent ?</h3>
          <p className="text-sm text-text-secondary mt-0.5">
            Tableau de bord · {formatEuro(gross)} brut / mois · {formatEuro(annualGross)} / an
          </p>
        </div>

        {/* ── Top row : donut + metrics ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Donut chart */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-full" style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={66}
                    outerRadius={96}
                    paddingAngle={2}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    animationBegin={100}
                    animationDuration={700}
                  >
                    {pieData.map((d, i) => (
                      <Cell key={i} fill={d.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Center overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] text-text-muted leading-tight">Dans votre poche</span>
                <span className="text-xl font-bold text-emerald-600">{formatEuro(poche)}</span>
                <span className="text-[11px] text-text-muted">/mois</span>
              </div>
            </div>

            {/* Donut legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-text-secondary">{d.name}</span>
                  <span className="text-xs font-medium text-foreground">({(d.pct * 100).toFixed(0)} %)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Metric cards */}
          <div className="flex flex-col gap-2.5 justify-center">
            <MetricCard
              label="Net disponible / mois"
              value={formatEuro(poche)}
              sub={`${ratioPoche.toFixed(1)} % du brut`}
              color={C.poche}
              icon="💳"
            />
            <MetricCard
              label="Charges salariales / mois"
              value={formatEuro(computed.total_sal)}
              sub={`${tauxCharge.toFixed(1)} % du brut`}
              color={C.retraite}
              icon="📊"
            />
            <MetricCard
              label="Coût total employeur / mois"
              value={formatEuro(computed.employerCost)}
              sub={`+${formatEuro(computed.total_pat)} patronal`}
              color={C.patronal}
              icon="🏢"
            />
            <MetricCard
              label="Votre brut = X % du coût total"
              value={`${ratioEff.toFixed(0)} %`}
              sub="efficacité brute"
              color="#6b7280"
              icon="⚖️"
            />
            {state.pasRate > 0 && (
              <MetricCard
                label="Impôt à la source / mois"
                value={formatEuro(pas)}
                sub={`taux ${(state.pasRate * 100).toFixed(1)} %`}
                color={C.pas}
                icon="🏛️"
              />
            )}
          </div>
        </div>

        {/* ── Separator ── */}
        <div className="border-t border-border" />

        {/* ── Annual projection ── */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-4">
            Projection annuelle — {new Date().getFullYear()}
          </h4>
          <div className="space-y-2.5">
            <AnnualBar label="Coût total employeur" amount={annualCost}  total={annualCost} color={C.patronal} />
            <AnnualBar label="Votre brut annuel"    amount={annualGross} total={annualCost} color="#6366f1"   />
            <AnnualBar label="Charges patronales"   amount={annualPat}  total={annualCost} color="#a78bfa"   />
            <AnnualBar label="Charges salariales"   amount={annualSal}  total={annualCost} color={C.retraite}/>
            {state.pasRate > 0 && (
              <AnnualBar label="Impôt / an (PAS)"   amount={annualPas}  total={annualCost} color={C.pas}     />
            )}
            <AnnualBar label="Dans votre poche / an" amount={annualPoche} total={annualCost} color={C.poche} />
          </div>
        </div>

        {/* ── Summary pills ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {[
            { label: 'Brut annuel',     value: formatEuro(annualGross), bg: '#f5f3ff', text: '#7c3aed' },
            { label: 'Poche / an',      value: formatEuro(annualPoche), bg: '#f0fdf4', text: '#059669' },
            { label: 'Charges / an',    value: formatEuro(annualSal),   bg: '#eff6ff', text: '#2563eb' },
            { label: 'Coût total / an', value: formatEuro(annualCost),  bg: '#faf5ff', text: '#7c3aed' },
          ].map(p => (
            <div key={p.label} className="rounded-lg p-3 text-center" style={{ backgroundColor: p.bg }}>
              <p className="text-xs text-text-muted mb-1">{p.label}</p>
              <p className="text-base font-bold" style={{ color: p.text }}>{p.value}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default MoneyDashboard;
