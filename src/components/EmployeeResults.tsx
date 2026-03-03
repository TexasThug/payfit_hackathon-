import { useSalary, formatEuro } from '@/contexts/SalaryContext';

const EmployeeResults = () => {
  const { state, computed } = useSalary();

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
