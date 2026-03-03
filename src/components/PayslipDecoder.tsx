import { useState } from 'react';
import { useSalary, formatEuroDecimal } from '@/contexts/SalaryContext';
import { Info, X } from 'lucide-react';

interface PayslipLine {
  label: string;
  amount: number;
  negative?: boolean;
  tooltip: string;
  isSubtotal?: boolean;
  isNet?: boolean;
  isSectionHeader?: boolean;
  show?: boolean;
}

const PayslipDecoder = () => {
  const { state, computed } = useSalary();
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  const lines: PayslipLine[] = [
    { label: 'COTISATIONS SALARIALES', amount: 0, tooltip: '', isSectionHeader: true, show: true },
    {
      label: 'SALAIRE DE BASE',
      amount: computed.grossMonthly,
      tooltip: 'Votre rémunération contractuelle mensuelle, calculée sur 151,67h (base 35h/sem). C\'est le montant inscrit sur votre contrat de travail.',
      show: true,
    },
    {
      label: 'SS Vieillesse plafonnée',
      amount: computed.ss_plafonnee,
      negative: true,
      tooltip: `6,90% de votre salaire jusqu'à 3 925€/mois (Plafond Sécu 2025). Finance votre retraite de base. = ${formatEuroDecimal(computed.ss_plafonnee)} ce mois.`,
      show: true,
    },
    {
      label: 'SS Vieillesse déplafonnée',
      amount: computed.ss_deplafonnee,
      negative: true,
      tooltip: '0,40% de la totalité de votre brut. Complément retraite de base, sans plafond.',
      show: true,
    },
    {
      label: 'AGIRC-ARRCO Tranche 1',
      amount: computed.agirc_t1,
      negative: true,
      tooltip: '3,15% sur la part de salaire ≤ 3 925€/mois (taux d\'appel 127% inclus). Votre retraite complémentaire obligatoire — vous accumulez des points tout au long de votre carrière.',
      show: true,
    },
    {
      label: 'AGIRC-ARRCO Tranche 2',
      amount: computed.agirc_t2,
      negative: true,
      tooltip: '8,64% sur la part de salaire entre 3 925€ et 31 400€/mois (taux d\'appel 127% inclus). S\'applique uniquement si votre salaire dépasse le Plafond Sécurité Sociale.',
      show: computed.agirc_t2 > 0,
    },
    {
      label: 'CEG',
      amount: computed.ceg,
      negative: true,
      tooltip: 'Contribution d\'Équilibre Général : 0,86%. Finance l\'équilibre du système de retraite complémentaire AGIRC-ARRCO. Ne génère pas de points retraite.',
      show: true,
    },
    {
      label: 'CSG non déductible',
      amount: computed.csg_non_deductible,
      negative: true,
      tooltip: '2,40% appliqué sur 98,25% de votre brut (l\'abattement de 1,75% représente un forfait frais pro). ⚠️ Non déductible : vous payez l\'IR sur ce montant ET cette cotisation.',
      show: true,
    },
    {
      label: 'CSG déductible',
      amount: computed.csg_deductible,
      negative: true,
      tooltip: '6,80% sur 98,25% de votre brut. Contribue au financement de la Sécurité Sociale. ✓ Déductible : réduit automatiquement votre revenu imposable.',
      show: true,
    },
    {
      label: 'CRDS',
      amount: computed.crds,
      negative: true,
      tooltip: 'Contribution pour le Remboursement de la Dette Sociale : 0,50%. Créée en 1996 pour rembourser la dette de la Sécu. Non déductible fiscalement.',
      show: true,
    },
    {
      label: 'Mutuelle santé (part salariale)',
      amount: computed.mutuelle_sal,
      negative: true,
      tooltip: 'Votre participation à la complémentaire santé d\'entreprise. L\'employeur paie au minimum 50% du total. ✓ Déductible de votre revenu imposable.',
      show: true,
    },
    {
      label: 'NET IMPOSABLE',
      amount: computed.netImposable,
      tooltip: 'Base de calcul de votre impôt sur le revenu. Ce montant × 12 est pré-rempli automatiquement par votre employeur dans votre déclaration d\'impôts.',
      isSubtotal: true,
      show: true,
    },
    {
      label: 'NET À PAYER',
      amount: computed.netMonthly,
      tooltip: 'La somme virée sur votre compte bancaire.',
      isNet: true,
      show: true,
    },
  ];

  return (
    <section className="px-4 md:px-6 max-w-4xl mx-auto py-12 md:py-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Décodez votre fiche de paie</h2>
        <p className="text-text-secondary">Chaque ligne expliquée · Se met à jour avec vos chiffres</p>
        {state.hasEdited && (
          <span className="payfit-tag bg-accent text-accent-foreground mt-2 inline-block animate-fade-in">
            Simulation en cours
          </span>
        )}
      </div>

      {/* Payslip */}
      <div className="payfit-card !p-0 overflow-hidden border border-border">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border bg-background-secondary">
          <p className="text-sm font-bold text-foreground tracking-wide uppercase">Bulletin de paie simulé</p>
          <div className="flex gap-4 mt-1 text-xs text-text-secondary">
            <span>Période : Mars 2025</span>
            <span>Statut : {state.status === 'cadre' ? 'Cadre' : 'Non-cadre'} · {state.contractType}</span>
          </div>
        </div>

        {/* Lines */}
        <div className="divide-y divide-border relative">
          {lines.filter(l => l.show).map((line, i) => {
            if (line.isSectionHeader) {
              return (
                <div key={i} className="payfit-section-header px-5 py-2">
                  {line.label}
                </div>
              );
            }

            const lineClass = line.isNet
              ? 'payslip-net'
              : line.isSubtotal
              ? 'payslip-line font-semibold border-t-2 border-border'
              : 'payslip-line';

            return (
              <div key={i} className={`${lineClass} relative`}>
                <span className={`text-sm ${line.isNet ? 'text-lg font-bold' : ''}`}>
                  {line.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium tabular-nums ${line.isNet ? 'text-lg font-bold' : ''}`}>
                    {line.negative ? '- ' : ''}{formatEuroDecimal(line.amount)}
                  </span>
                  <button
                    className="text-text-muted hover:text-primary transition-colors p-1"
                    onClick={() => setActiveTooltip(activeTooltip === i ? null : i)}
                    aria-label="Plus d'info"
                  >
                    <Info size={14} />
                  </button>
                </div>

                {/* Tooltip */}
                {activeTooltip === i && (
                  <>
                    {/* Backdrop for mobile */}
                    <div
                      className="fixed inset-0 z-40 md:hidden"
                      onClick={() => setActiveTooltip(null)}
                    />
                    <div className="tooltip-payfit absolute right-0 top-full z-50 mt-1 shadow-lg animate-fade-in md:absolute">
                      <button
                        className="absolute top-2 right-2 text-subtle-gray hover:text-background"
                        onClick={() => setActiveTooltip(null)}
                      >
                        <X size={14} />
                      </button>
                      <p className="pr-5">{line.tooltip}</p>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PayslipDecoder;
