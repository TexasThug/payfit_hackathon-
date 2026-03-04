import { useSalary, formatEuro } from '@/contexts/SalaryContext';

const PPVPanel = () => {
  const { state, computed, dispatch } = useSalary();

  const { ppvAmount } = state;
  const {
    ppvNetClassic, ppvNetPPV,
    ppvEmployerCostClassic, ppvEmployerCostPPV,
    ppvGainEmployee, ppvSavingEmployer,
  } = computed;

  return (
    <div className="mt-3 space-y-3 animate-slide-in">
      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1">
          Montant de la prime (€)
        </label>
        <input
          type="number"
          min={0}
          max={6000}
          className="payfit-input w-full"
          value={ppvAmount}
          onChange={(e) => dispatch({ type: 'SET_PPV_AMOUNT', payload: Number(e.target.value) })}
        />
      </div>

      {ppvAmount > 0 && (
        <div className="payfit-card !p-0 overflow-hidden border border-border animate-fade-in">
          <div className="grid grid-cols-2 divide-x divide-border">
            {/* Prime classique */}
            <div className="p-3">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
                Prime classique
              </p>
              <p className="text-xl font-bold text-foreground">{formatEuro(ppvNetClassic)}</p>
              <p className="text-xs text-text-muted mt-0.5">net en poche</p>
              <div className="mt-2 pt-2 border-t border-border">
                <p className="text-xs text-text-secondary">
                  Coût employeur
                </p>
                <p className="text-sm font-semibold text-foreground">{formatEuro(ppvEmployerCostClassic)}</p>
              </div>
            </div>

            {/* PPV */}
            <div className="p-3 bg-emerald-50">
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">
                PPV 2025 ✓
              </p>
              <p className="text-xl font-bold text-emerald-700">{formatEuro(ppvNetPPV)}</p>
              <p className="text-xs text-emerald-600 mt-0.5">net en poche</p>
              <div className="mt-2 pt-2 border-t border-emerald-100">
                <p className="text-xs text-emerald-600">
                  Coût employeur
                </p>
                <p className="text-sm font-semibold text-emerald-700">{formatEuro(ppvEmployerCostPPV)}</p>
              </div>
            </div>
          </div>

          {/* Summary row */}
          <div className="px-3 py-2 bg-background-secondary border-t border-border flex justify-between text-xs">
            <span className="text-text-secondary">
              Gain salarié : <span className="font-semibold text-emerald-600">+{formatEuro(ppvGainEmployee)}</span>
            </span>
            <span className="text-text-secondary">
              Économie employeur : <span className="font-semibold text-emerald-600">-{formatEuro(ppvSavingEmployer)}</span>
            </span>
          </div>
        </div>
      )}

      <p className="text-xs text-text-muted leading-relaxed">
        PPV exonérée de cotisations sociales, soumise uniquement à CSG/CRDS (9,7%). Exonérée d'IR jusqu'à 3 000 € (ou 6 000 € avec accord d'intéressement).
      </p>
    </div>
  );
};

export default PPVPanel;
