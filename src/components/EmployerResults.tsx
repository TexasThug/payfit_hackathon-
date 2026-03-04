import { useSalary, formatEuro } from '@/contexts/SalaryContext';

const SMIC_MONTHLY_GROSS = 1801.80;

// ── Stagiaire panel ────────────────────────────────────────────────────────
const StagiaireResults = () => {
  const { state, computed } = useSalary();
  const d = computed.stagiaireData;
  if (!d) return null;

  const { stagiaireMonthly, stagiaireDuration } = state;
  const isExonere = d.excess === 0;
  const pctVsCDI  = ((d.costCDIMonthly - d.costMonthly) / d.costCDIMonthly * 100).toFixed(0);

  return (
    <div className="space-y-4">
      {/* Main cost card */}
      <div className="payfit-card border-l-4 border-primary bg-gradient-to-r from-accent to-background">
        <p className="text-sm font-medium text-text-secondary mb-1">Coût total employeur</p>
        <p className="text-4xl font-bold result-value animate-counter">
          {formatEuro(d.costMonthly)}
          <span className="text-lg font-normal text-text-secondary"> / mois</span>
        </p>
        <p className="text-sm text-text-secondary mt-1">
          soit <strong>{formatEuro(d.costTotal)}</strong> sur {stagiaireDuration} mois
        </p>
      </div>

      {/* Exonération status */}
      {isExonere ? (
        <div className="payfit-card !p-3 bg-emerald-50 border border-emerald-200 animate-fade-in">
          <p className="text-sm text-emerald-700 font-medium">
            ✅ Totalement exonéré de charges — la gratification ({formatEuro(stagiaireMonthly)}/mois) est sous le seuil légal de {formatEuro(d.seuil)}/mois.
          </p>
        </div>
      ) : (
        <div className="payfit-card !p-3 bg-amber-50 border border-amber-200 animate-fade-in">
          <p className="text-sm text-amber-700 font-medium">
            ⚠️ Excédent de {formatEuro(d.excess)}/mois soumis à cotisations (au-dessus du seuil de {formatEuro(d.seuil)}/mois).
          </p>
        </div>
      )}

      {/* Breakdown */}
      <div className="payfit-card !p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-medium text-foreground">Décomposition mensuelle</p>
        </div>
        <div className="divide-y divide-border">
          <div className="flex justify-between px-4 py-2.5 text-sm">
            <span>Gratification brute</span>
            <span className="font-medium">{formatEuro(stagiaireMonthly)}</span>
          </div>
          <div className="flex justify-between px-4 py-2.5 text-sm">
            <span className="text-text-secondary">Seuil d'exonération</span>
            <span className="text-text-secondary">{formatEuro(d.seuil)}</span>
          </div>
          <div className="flex justify-between px-4 py-2.5 text-sm">
            <span>Excédent soumis à charges</span>
            <span className="font-medium">{formatEuro(d.excess)}</span>
          </div>
          <div className="flex justify-between px-4 py-2.5 text-sm">
            <span>Charges patronales sur excédent</span>
            <span className="font-medium text-warning">+ {formatEuro(d.chargesPat)}</span>
          </div>
          <div className="flex justify-between px-4 py-2.5 text-sm font-semibold border-t-2 border-border">
            <span>Coût employeur / mois</span>
            <span className="result-value">{formatEuro(d.costMonthly)}</span>
          </div>
        </div>
      </div>

      {/* Stagiaire net */}
      <div className="payfit-card !p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-medium text-foreground">Ce que reçoit le stagiaire</p>
        </div>
        <div className="divide-y divide-border">
          <div className="flex justify-between px-4 py-2.5 text-sm">
            <span>Gratification brute</span>
            <span>{formatEuro(stagiaireMonthly)}</span>
          </div>
          <div className="flex justify-between px-4 py-2.5 text-sm">
            <span>Charges salariales sur excédent</span>
            <span className="text-warning">- {formatEuro(d.chargesSal)}</span>
          </div>
          <div className="flex justify-between px-4 py-2.5 text-sm font-semibold border-t-2 border-border">
            <span>Net versé / mois</span>
            <span className="text-emerald-600">{formatEuro(d.netStagiaire)}</span>
          </div>
        </div>
      </div>

      {/* Comparaison CDI */}
      <div className="payfit-card !p-0 overflow-hidden animate-slide-in">
        <div className="px-4 py-3 border-b border-border bg-accent">
          <p className="text-sm font-medium text-foreground">Comparaison Stage vs CDI (même niveau brut)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="payfit-section-header">
                <th className="px-4 py-2 text-left font-medium">Poste</th>
                <th className="px-4 py-2 text-right font-medium">Stage</th>
                <th className="px-4 py-2 text-right font-medium">CDI équivalent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-4 py-2">Coût mensuel</td>
                <td className="px-4 py-2 text-right font-medium text-emerald-600">{formatEuro(d.costMonthly)}</td>
                <td className="px-4 py-2 text-right">{formatEuro(d.costCDIMonthly)}</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Économie / mois</td>
                <td className="px-4 py-2 text-right font-semibold text-emerald-600">
                  -{formatEuro(d.costCDIMonthly - d.costMonthly)}
                </td>
                <td className="px-4 py-2 text-right text-text-muted">référence</td>
              </tr>
              <tr className="bg-emerald-50">
                <td className="px-4 py-2 font-semibold">Économie totale sur {stagiaireDuration} mois</td>
                <td className="px-4 py-2 text-right font-bold text-emerald-600" colSpan={2}>
                  {formatEuro(d.savingVsCDI)} ({pctVsCDI} % moins cher)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div className="payfit-card text-center">
        <p className="text-lg font-semibold text-foreground mb-2">Vous gérez la paie de votre équipe ?</p>
        <p className="text-sm text-text-secondary mb-4">PayFit automatise exactement ce calcul.</p>
        <a
          href="https://payfit.com/demo"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3 px-6 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary-hover transition-colors text-center"
        >
          Demander une démo gratuite →
        </a>
      </div>
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────
const EmployerResults = () => {
  const { state, computed } = useSalary();

  if (state.contractType === 'stagiaire') return <StagiaireResults />;

  return (
    <div className="space-y-4">
      {/* Main Result */}
      <div className="payfit-card border-l-4 border-primary bg-gradient-to-r from-accent to-background">
        <p className="text-sm font-medium text-text-secondary mb-1">Coût total employeur</p>
        <p className="text-4xl font-bold result-value animate-counter">
          {formatEuro(computed.employerCost)}
          <span className="text-lg font-normal text-text-secondary"> / mois</span>
        </p>
        <p className="text-sm text-text-secondary mt-1">
          soit {formatEuro(computed.employerCostAnnual)} / an
        </p>
      </div>

      {/* Breakdown */}
      <div className="payfit-card !p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-medium text-foreground">Décomposition</p>
        </div>
        <div className="divide-y divide-border">
          <div className="flex justify-between px-4 py-2.5 text-sm">
            <span>Salaire brut</span>
            <span className="font-medium">{formatEuro(computed.grossMonthly)}</span>
          </div>
          <div className="flex justify-between px-4 py-2.5 text-sm">
            <span>+ Charges patronales</span>
            <span className="font-medium">+ {formatEuro(computed.total_pat)}</span>
          </div>
          <div className="flex justify-between px-4 py-2.5 text-sm font-semibold border-t-2 border-border">
            <span>Coût total</span>
            <span className="result-value">{formatEuro(computed.employerCost)}</span>
          </div>
        </div>
      </div>

      {/* Fillon */}
      {computed.grossMonthly <= 1.6 * SMIC_MONTHLY_GROSS && computed.filonReduction > 0 && (
        <div className="payfit-card !p-3 bg-accent border border-blue-200 animate-fade-in">
          <p className="text-sm text-primary-dark font-medium">
            ✓ Réduction Fillon appliquée : -{formatEuro(computed.filonReduction)}/mois
          </p>
        </div>
      )}

      {/* CDD Comparator */}
      {state.contractType === 'CDD' && (
        <div className="payfit-card !p-0 overflow-hidden animate-slide-in">
          <div className="px-4 py-3 border-b border-border bg-accent">
            <p className="text-sm font-medium text-foreground">Comparaison CDI vs CDD</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="payfit-section-header">
                  <th className="px-4 py-2 text-left font-medium">Poste</th>
                  <th className="px-4 py-2 text-right font-medium">CDI</th>
                  <th className="px-4 py-2 text-right font-medium">CDD</th>
                  <th className="px-4 py-2 text-right font-medium">Diff.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-2">Coût mensuel</td>
                  <td className="px-4 py-2 text-right">{formatEuro(computed.employerCost - computed.cdd_surcharge)}</td>
                  <td className="px-4 py-2 text-right">{formatEuro(computed.employerCost)}</td>
                  <td className="px-4 py-2 text-right text-warning font-medium">+{formatEuro(computed.cdd_surcharge)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Surcharge chômage</td>
                  <td className="px-4 py-2 text-right">—</td>
                  <td className="px-4 py-2 text-right">{formatEuro(computed.cdd_surcharge)}</td>
                  <td className="px-4 py-2 text-right text-warning font-medium">+{formatEuro(computed.cdd_surcharge)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Indemnité précarité (fin)</td>
                  <td className="px-4 py-2 text-right">—</td>
                  <td className="px-4 py-2 text-right">{formatEuro(computed.cdd_indemnite_precarite)}</td>
                  <td className="px-4 py-2 text-right text-warning font-medium">+{formatEuro(computed.cdd_indemnite_precarite)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Employer CTA */}
      <div className="payfit-card text-center">
        <p className="text-lg font-semibold text-foreground mb-2">Vous gérez la paie de votre équipe ?</p>
        <p className="text-sm text-text-secondary mb-4">PayFit automatise exactement ce calcul.</p>
        <a
          href="https://payfit.com/demo"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3 px-6 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary-hover transition-colors text-center"
        >
          Demander une démo gratuite →
        </a>
      </div>
    </div>
  );
};

export default EmployerResults;
