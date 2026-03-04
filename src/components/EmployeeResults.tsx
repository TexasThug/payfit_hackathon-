import { useSalary, formatEuro } from '@/contexts/SalaryContext';

const EmployeeResults = () => {
  const { state, computed } = useSalary();
  const { status, contractType } = state;
  const { isInverseMode, pasRate } = state;

  // ── MODE INVERSÉ ──────────────────────────────────────────────
  if (isInverseMode) {
    if (!computed.inverseBrutAnnual) {
      return (
        <div className="payfit-card text-center text-text-secondary text-sm py-8">
          Entrez un net mensuel souhaité pour calculer le brut à demander.
        </div>
      );
    }

    return (
      <div className="space-y-4 animate-fade-in">
        {/* Result principal */}
        <div className="payfit-card border-l-4 border-primary bg-gradient-to-r from-accent to-background">
          <p className="text-sm font-medium text-text-secondary mb-1">Brut annuel à négocier</p>
          <p className="text-4xl font-bold result-value animate-counter">
            {formatEuro(computed.inverseBrutAnnual!)}
          </p>
          <p className="text-sm text-text-secondary mt-1">
            soit {formatEuro(computed.inverseBrutMonthly!)} / mois brut
          </p>
        </div>

        {/* Vérification */}
        <div className="payfit-card !p-4 border border-border">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">
            Ce que vous toucherez réellement
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Net à payer (fiche de paie)</span>
              <span className="font-semibold">≈ {formatEuro(state.targetNet)}</span>
            </div>
            {pasRate > 0 && (
              <div className="flex justify-between text-orange-600">
                <span>− PAS ({(pasRate * 100).toFixed(1)} %)</span>
                <span className="font-semibold">− {formatEuro(computed.inverseBrutMonthly! * pasRate * 0.9)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold border-t border-border pt-2">
              <span>Coût total employeur</span>
              <span className="result-value">{formatEuro(computed.inverseEmployerCost!)}</span>
            </div>
          </div>
        </div>

        <div className="payfit-card !p-3 bg-accent border border-blue-200 text-sm text-text-secondary">
          💡 Ce calcul s'applique à un CDI, statut {status === 'cadre' ? 'cadre' : 'non-cadre'}.
          Ajustez les paramètres ci-contre pour affiner.
        </div>
      </div>
    );
  }

  // ── MODE NORMAL ───────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Main Result */}
      <div className="payfit-card border-l-4 border-primary bg-gradient-to-r from-accent to-background">
        <p className="text-sm font-medium text-text-secondary mb-1">Net mensuel</p>
        <p className="text-4xl font-bold result-value animate-counter">
          {formatEuro(computed.netMonthly)}
        </p>
        <p className="text-sm text-text-secondary mt-1">
          Net annuel : {formatEuro(computed.netAnnual)} / an
        </p>

        {/* Net-Net après PAS */}
        {pasRate > 0 && (
          <div className="mt-3 pt-3 border-t border-border animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-secondary">
                  Après PAS ({(pasRate * 100).toFixed(1)} %)
                </p>
                <p className="text-2xl font-bold text-emerald-700">
                  {formatEuro(computed.netNet)}
                </p>
                <p className="text-xs text-emerald-600">
                  Net-net réel sur votre compte
                </p>
              </div>
              <div className="text-right text-xs text-text-muted">
                <p>PAS : − {formatEuro(computed.pasMonthly)}</p>
                <p className="mt-0.5">/ mois</p>
              </div>
            </div>
          </div>
        )}

        {/* Simulation comparison */}
        {computed.simNetMonthly !== null && (
          <div className="mt-4 pt-4 border-t border-border animate-slide-in">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-text-secondary">Actuel</span>
              <span className="font-semibold">{formatEuro(computed.netMonthly)}</span>
              <span className="text-text-secondary">→</span>
              <span className="font-bold text-primary">{formatEuro(computed.simNetMonthly!)}</span>
            </div>
            <p className="text-xs text-success mt-1">
              +{formatEuro(computed.simNetMonthly! - computed.netMonthly)}/mois · +{formatEuro(computed.simNetAnnual! - computed.netAnnual)}/an
            </p>
          </div>
        )}
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="payfit-card !p-4 text-center">
          <p className="text-xs text-text-secondary mb-1">Brut mensuel</p>
          <p className="text-lg font-semibold text-foreground">{formatEuro(computed.grossMonthly)}</p>
        </div>
        <div className="payfit-card !p-4 text-center">
          <p className="text-xs text-text-secondary mb-1">Charges sal.</p>
          <p className="text-lg font-semibold text-foreground">{formatEuro(computed.total_sal)}</p>
        </div>
        <div className="payfit-card !p-4 text-center">
          <p className="text-xs text-text-secondary mb-1">Net imposable</p>
          <p className="text-lg font-semibold text-foreground">{formatEuro(computed.netImposable)}</p>
        </div>
      </div>

      {/* Cadre badge */}
      {status === 'cadre' && (
        <div className="payfit-card !p-3 border border-border animate-fade-in">
          <p className="text-xs font-medium text-foreground mb-1">Statut cadre</p>
          <p className="text-xs text-text-secondary">
            Cotisation APEC incluse ({formatEuro(computed.apec_sal)}/mois). Votre employeur verse en plus la prévoyance cadre obligatoire (≥ 1,5% sur T1 — ANI 2017).
          </p>
        </div>
      )}

      {/* CDD info */}
      {contractType === 'CDD' && (
        <div className="payfit-card !p-3 border border-border animate-fade-in">
          <p className="text-xs font-medium text-foreground mb-1">Contrat CDD</p>
          <p className="text-xs text-text-secondary">
            Votre salaire net mensuel est identique à un CDI équivalent. En fin de contrat, vous percevrez une <strong>indemnité de précarité de {formatEuro(computed.cdd_indemnite_precarite)}</strong> (10% du brut total). Le surcoût chômage est supporté par l'employeur.
          </p>
        </div>
      )}

      {/* Inline CTA */}
      <div className="payfit-card !p-4 bg-accent border border-blue-200">
        <p className="text-sm text-foreground">
          💡 PayFit calcule et déclare ça automatiquement pour vos salariés.{' '}
          <a href="https://payfit.com" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:text-primary-hover transition-colors">
            Voir comment →
          </a>
        </p>
      </div>
    </div>
  );
};

export default EmployeeResults;
