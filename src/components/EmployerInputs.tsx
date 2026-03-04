import { useSalary } from '@/contexts/SalaryContext';

const sectors = ['Tech', 'Finance', 'Commerce', 'Santé', 'Industrie', 'Autre'];

const EmployerInputs = () => {
  const { state, dispatch } = useSalary();
  const isStagiaire = state.contractType === 'stagiaire';

  return (
    <div className="payfit-card space-y-5">

      {/* Contract Type — 3 options */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Type de contrat</label>
        <div className="flex gap-1 bg-background-secondary p-1 rounded-lg">
          {(['CDI', 'CDD', 'stagiaire'] as const).map((c) => (
            <button
              key={c}
              className={`toggle-pill flex-1 text-sm ${state.contractType === c ? 'toggle-pill-active' : 'toggle-pill-inactive'}`}
              onClick={() => dispatch({ type: 'SET_CONTRACT_TYPE', payload: c })}
            >
              {c === 'stagiaire' ? '🎓 Stage' : c}
            </button>
          ))}
        </div>
        {state.contractType === 'CDD' && (
          <div className="mt-3 animate-slide-in">
            <label className="block text-xs font-medium text-text-secondary mb-1">Durée (mois)</label>
            <input
              type="number"
              min={1}
              max={36}
              className="payfit-input w-24"
              value={state.cddDuration}
              onChange={(e) => dispatch({ type: 'SET_CDD_DURATION', payload: Number(e.target.value) })}
            />
          </div>
        )}
      </div>

      {/* ── STAGIAIRE inputs ── */}
      {isStagiaire ? (
        <>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Gratification mensuelle (€)
            </label>
            <input
              type="tel"
              className="payfit-input w-full text-lg font-semibold"
              value={state.stagiaireMonthly || ''}
              onChange={(e) => {
                const v = parseInt(e.target.value.replace(/\D/g, ''), 10);
                dispatch({ type: 'SET_STAGIAIRE_MONTHLY', payload: isNaN(v) ? 0 : v });
              }}
            />
            <p className="text-xs text-text-muted mt-1">
              Minimum légal : ~589 €/mois (15 % du PMSS 2025)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Durée du stage (mois)
            </label>
            <input
              type="number"
              min={1}
              max={24}
              className="payfit-input w-24"
              value={state.stagiaireDuration}
              onChange={(e) => dispatch({ type: 'SET_STAGIAIRE_DURATION', payload: Number(e.target.value) })}
            />
          </div>
        </>
      ) : (
        <>
          {/* Gross Annual */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Salaire brut annuel (€)</label>
            <input
              type="tel"
              className="payfit-input w-full text-lg font-semibold"
              value={state.grossAnnual || ''}
              onChange={(e) => {
                const v = parseInt(e.target.value.replace(/\D/g, ''), 10);
                dispatch({ type: 'SET_GROSS_ANNUAL', payload: isNaN(v) ? 0 : v });
              }}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Statut</label>
            <div className="flex gap-1 bg-background-secondary p-1 rounded-lg">
              {(['non-cadre', 'cadre'] as const).map((s) => (
                <button
                  key={s}
                  className={`toggle-pill flex-1 ${state.status === s ? 'toggle-pill-active' : 'toggle-pill-inactive'}`}
                  onClick={() => dispatch({ type: 'SET_STATUS', payload: s })}
                >
                  {s === 'cadre' ? 'Cadre' : 'Non-cadre'}
                </button>
              ))}
            </div>
          </div>

          {/* Sector */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Secteur</label>
            <select
              className="payfit-input w-full"
              value={state.sector}
              onChange={(e) => dispatch({ type: 'SET_SECTOR', payload: e.target.value })}
            >
              {sectors.map((s) => (
                <option key={s} value={s.toLowerCase()}>{s}</option>
              ))}
            </select>
          </div>

          {/* Mutuelle */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Cotisation mutuelle mensuelle (€)
            </label>
            <input
              type="number"
              min={0}
              className="payfit-input w-32"
              value={state.mutuelleMonthly}
              onChange={(e) => dispatch({ type: 'SET_MUTUELLE', payload: Number(e.target.value) })}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default EmployerInputs;
