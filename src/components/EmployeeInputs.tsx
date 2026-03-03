import { useState } from 'react';
import { useSalary } from '@/contexts/SalaryContext';
import { Slider } from '@/components/ui/slider';

const EmployeeInputs = () => {
  const { state, dispatch } = useSalary();
  const [simOpen, setSimOpen] = useState(false);

  return (
    <div className="payfit-card space-y-5">
      {/* Gross Annual */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Salaire brut annuel (€)
        </label>
        <p className="text-xs text-text-secondary mb-2">Avant déductions — inscrit sur votre contrat</p>
        <input
          type="tel"
          className="payfit-input w-full text-lg font-semibold"
          value={state.grossAnnual || ''}
          onChange={(e) => {
            const v = parseInt(e.target.value.replace(/\D/g, ''), 10);
            dispatch({ type: 'SET_GROSS_ANNUAL', payload: isNaN(v) ? 0 : v });
          }}
        />
        <p className="text-xs text-text-muted mt-1">
          {(state.grossAnnual / 12).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €/mois
        </p>
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

      {/* Contract Type */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Type de contrat</label>
        <div className="flex gap-1 bg-background-secondary p-1 rounded-lg">
          {(['CDI', 'CDD'] as const).map((c) => (
            <button
              key={c}
              className={`toggle-pill flex-1 ${state.contractType === c ? 'toggle-pill-active' : 'toggle-pill-inactive'}`}
              onClick={() => dispatch({ type: 'SET_CONTRACT_TYPE', payload: c })}
            >
              {c}
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

      {/* Paid Leave */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Jours de congés payés
        </label>
        <p className="text-xs text-text-secondary mb-2">{state.paidLeave} jours / an (légal : 25)</p>
        <Slider
          value={[state.paidLeave]}
          onValueChange={([v]) => dispatch({ type: 'SET_PAID_LEAVE', payload: v })}
          min={25}
          max={50}
          step={1}
        />
      </div>

      {/* Mutuelle */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Cotisation mutuelle mensuelle (€)
        </label>
        <p className="text-xs text-text-secondary mb-2">Votre part — l'employeur paie au minimum 50%</p>
        <input
          type="number"
          min={0}
          className="payfit-input w-32"
          value={state.mutuelleMonthly}
          onChange={(e) => dispatch({ type: 'SET_MUTUELLE', payload: Number(e.target.value) })}
        />
      </div>

      {/* Simulation */}
      <div>
        <button
          className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          onClick={() => setSimOpen(!simOpen)}
        >
          {simOpen ? '➖' : '➕'} Simuler un scénario
        </button>
        {simOpen && (
          <div className="mt-3 space-y-3 animate-slide-in">
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`payfit-card !p-3 text-left text-sm cursor-pointer border-2 transition-colors ${state.simulationMode === 'raise' ? 'border-primary' : 'border-transparent'}`}
                onClick={() => dispatch({ type: 'SET_SIMULATION_MODE', payload: state.simulationMode === 'raise' ? null : 'raise' })}
              >
                📈 Augmentation
              </button>
              <button
                className={`payfit-card !p-3 text-left text-sm cursor-pointer border-2 transition-colors ${state.simulationMode === 'bonus' ? 'border-primary' : 'border-transparent'}`}
                onClick={() => dispatch({ type: 'SET_SIMULATION_MODE', payload: state.simulationMode === 'bonus' ? null : 'bonus' })}
              >
                🎁 Prime
              </button>
            </div>
            {state.simulationMode === 'raise' && (
              <div className="animate-slide-in">
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Augmentation : {state.raisePercent}%
                </label>
                <Slider
                  value={[state.raisePercent]}
                  onValueChange={([v]) => dispatch({ type: 'SET_RAISE_PERCENT', payload: v })}
                  min={0}
                  max={30}
                  step={0.5}
                />
              </div>
            )}
            {state.simulationMode === 'bonus' && (
              <div className="animate-slide-in">
                <label className="block text-xs font-medium text-text-secondary mb-1">Montant de la prime (€)</label>
                <input
                  type="number"
                  min={0}
                  className="payfit-input w-full"
                  value={state.bonusAmount}
                  onChange={(e) => dispatch({ type: 'SET_BONUS_AMOUNT', payload: Number(e.target.value) })}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeInputs;
