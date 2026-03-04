import { useSalary, formatEuro } from '@/contexts/SalaryContext';

interface Segment {
  key: string;
  label: string;
  amount: number;
  color: string;
  textColor: string;
  dotColor: string;
  description: string;
}

const FlowDiagram = () => {
  const { state, computed } = useSalary();

  if (state.activeTab !== 'employee' || state.isInverseMode) return null;

  const gross = computed.grossMonthly;
  if (gross <= 0) return null;

  const { pasRate } = state;

  // Regroupement des charges
  const retraite = computed.ss_plafonnee + computed.ss_deplafonnee
    + computed.agirc_t1 + computed.agirc_t2
    + computed.ceg + computed.cet;

  const protection = computed.csg_total + computed.mutuelle_sal + computed.apec_sal;

  const pas = computed.pasMonthly;

  const poche = gross - retraite - protection - pas;

  const segments: Segment[] = [
    {
      key: 'retraite',
      label: 'Retraite',
      amount: retraite,
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      dotColor: 'bg-blue-500',
      description: 'SS vieillesse + AGIRC-ARRCO + CEG',
    },
    {
      key: 'protection',
      label: 'Santé & Protection',
      amount: protection,
      color: 'bg-teal-500',
      textColor: 'text-teal-700',
      dotColor: 'bg-teal-500',
      description: 'CSG, CRDS, mutuelle',
    },
    ...(pasRate > 0 ? [{
      key: 'pas',
      label: 'Impôt (PAS)',
      amount: pas,
      color: 'bg-amber-400',
      textColor: 'text-amber-700',
      dotColor: 'bg-amber-400',
      description: `Prélèvement à la source ${(pasRate * 100).toFixed(1)} %`,
    }] : []),
    {
      key: 'poche',
      label: 'Votre poche',
      amount: poche,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      dotColor: 'bg-emerald-500',
      description: pasRate > 0 ? 'Net-net réel sur votre compte' : 'Net mensuel versé',
    },
  ];

  return (
    <section className="px-4 md:px-6 max-w-6xl mx-auto py-8">
      <div className="payfit-card">
        {/* Header */}
        <div className="mb-5">
          <h3 className="text-lg font-bold text-foreground">Où va votre brut ?</h3>
          <p className="text-sm text-text-secondary mt-0.5">
            Décomposition de {formatEuro(gross)} brut mensuel
          </p>
        </div>

        {/* Barre segmentée animée */}
        <div className="flex h-12 rounded-lg overflow-hidden gap-0.5 mb-5">
          {segments.map((seg) => {
            const pct = (seg.amount / gross) * 100;
            return (
              <div
                key={seg.key}
                className={`${seg.color} flex items-center justify-center overflow-hidden transition-all duration-500 ease-out relative group`}
                style={{ width: `${pct}%`, minWidth: pct > 3 ? undefined : '0' }}
                title={`${seg.label} : ${formatEuro(seg.amount)}`}
              >
                {pct > 8 && (
                  <span className="text-white text-xs font-semibold select-none px-1 truncate">
                    {pct.toFixed(0)} %
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Légende */}
        <div className={`grid gap-3 ${segments.length === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'}`}>
          {segments.map((seg) => {
            const pct = (seg.amount / gross) * 100;
            return (
              <div key={seg.key} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${seg.dotColor}`} />
                  <span className="text-xs font-medium text-text-secondary truncate">{seg.label}</span>
                </div>
                <p className={`text-lg font-bold ${seg.textColor} ml-4`}>{formatEuro(seg.amount)}</p>
                <p className="text-xs text-text-muted ml-4">{pct.toFixed(1)} % · {seg.description}</p>
              </div>
            );
          })}
        </div>

        {/* Ligne de total */}
        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-sm">
          <span className="text-text-secondary">Total brut mensuel</span>
          <span className="font-bold text-foreground">{formatEuro(gross)}</span>
        </div>
      </div>
    </section>
  );
};

export default FlowDiagram;
