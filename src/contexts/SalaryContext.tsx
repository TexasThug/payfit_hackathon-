import React, { createContext, useContext, useReducer, useMemo, useEffect } from 'react';

// Constants
const PSS_MONTHLY = 3925;
const SMIC_MONTHLY_GROSS = 1801.80;

export type Status = 'cadre' | 'non-cadre';
export type ContractType = 'CDI' | 'CDD';
export type ActiveTab = 'employee' | 'employer';
export type SimulationMode = 'raise' | 'bonus' | 'ppv' | null;

export interface SalaryState {
  grossAnnual: number;
  status: Status;
  contractType: ContractType;
  cddDuration: number;
  sector: string;
  workingDays: number;
  paidLeave: number;
  mutuelleMonthly: number;
  activeTab: ActiveTab;
  simulationMode: SimulationMode;
  raisePercent: number;
  bonusAmount: number;
  hasEdited: boolean;
  // Feature 1 — PAS / Net-Net
  pasRate: number;
  // Feature 3 — Calculateur inversé
  isInverseMode: boolean;
  targetNet: number;
  // Feature 4 — PPV
  ppvAmount: number;
}

export const initialState: SalaryState = {
  grossAnnual: 35000,
  status: 'cadre',
  contractType: 'CDI',
  cddDuration: 6,
  sector: 'tech',
  workingDays: 218,
  paidLeave: 25,
  mutuelleMonthly: 40,
  activeTab: 'employee',
  simulationMode: null,
  raisePercent: 0,
  bonusAmount: 0,
  hasEdited: false,
  pasRate: 0,
  isInverseMode: false,
  targetNet: 2500,
  ppvAmount: 1000,
};

type Action =
  | { type: 'SET_GROSS_ANNUAL'; payload: number }
  | { type: 'SET_STATUS'; payload: Status }
  | { type: 'SET_CONTRACT_TYPE'; payload: ContractType }
  | { type: 'SET_CDD_DURATION'; payload: number }
  | { type: 'SET_SECTOR'; payload: string }
  | { type: 'SET_PAID_LEAVE'; payload: number }
  | { type: 'SET_MUTUELLE'; payload: number }
  | { type: 'SET_ACTIVE_TAB'; payload: ActiveTab }
  | { type: 'SET_SIMULATION_MODE'; payload: SimulationMode }
  | { type: 'SET_RAISE_PERCENT'; payload: number }
  | { type: 'SET_BONUS_AMOUNT'; payload: number }
  | { type: 'SET_PAS_RATE'; payload: number }
  | { type: 'SET_INVERSE_MODE'; payload: boolean }
  | { type: 'SET_TARGET_NET'; payload: number }
  | { type: 'SET_PPV_AMOUNT'; payload: number }
  | { type: 'RESTORE_STATE'; payload: Partial<SalaryState> };

function reducer(state: SalaryState, action: Action): SalaryState {
  const edited = { hasEdited: true };
  switch (action.type) {
    case 'SET_GROSS_ANNUAL': return { ...state, grossAnnual: action.payload, ...edited };
    case 'SET_STATUS': return { ...state, status: action.payload, ...edited };
    case 'SET_CONTRACT_TYPE': return { ...state, contractType: action.payload, ...edited };
    case 'SET_CDD_DURATION': return { ...state, cddDuration: action.payload, ...edited };
    case 'SET_SECTOR': return { ...state, sector: action.payload, ...edited };
    case 'SET_PAID_LEAVE': return { ...state, paidLeave: action.payload, ...edited };
    case 'SET_MUTUELLE': return { ...state, mutuelleMonthly: action.payload, ...edited };
    case 'SET_ACTIVE_TAB': return { ...state, activeTab: action.payload };
    case 'SET_SIMULATION_MODE': return { ...state, simulationMode: action.payload };
    case 'SET_RAISE_PERCENT': return { ...state, raisePercent: action.payload, ...edited };
    case 'SET_BONUS_AMOUNT': return { ...state, bonusAmount: action.payload, ...edited };
    case 'SET_PAS_RATE': return { ...state, pasRate: action.payload };
    case 'SET_INVERSE_MODE': return { ...state, isInverseMode: action.payload };
    case 'SET_TARGET_NET': return { ...state, targetNet: action.payload, ...edited };
    case 'SET_PPV_AMOUNT': return { ...state, ppvAmount: action.payload };
    case 'RESTORE_STATE': return { ...state, ...action.payload };
    default: return state;
  }
}

export interface ComputedValues {
  grossMonthly: number;
  ss_plafonnee: number;
  ss_deplafonnee: number;
  agirc_t1: number;
  agirc_t2: number;
  ceg: number;
  cet: number;
  csgBase: number;
  csg_non_deductible: number;
  csg_deductible: number;
  crds: number;
  csg_total: number;
  mutuelle_sal: number;
  apec_sal: number;
  total_sal: number;
  netMonthly: number;
  netImposable: number;
  netAnnual: number;
  // Employer
  ss_maladie_pat: number;
  ss_vieillesse_plaf_pat: number;
  ss_vieillesse_deplaf_pat: number;
  alloc_fam: number;
  atmp: number;
  fnal: number;
  chomage_pat: number;
  ags: number;
  agirc_t1_pat: number;
  agirc_t2_pat: number;
  ceg_pat: number;
  apec_pat: number;
  prevoyance_cadre_pat: number;
  mutuelle_pat: number;
  filonCoeff: number;
  filonReduction: number;
  total_pat: number;
  employerCost: number;
  employerCostAnnual: number;
  cdd_surcharge: number;
  cdd_indemnite_precarite: number;
  // Simulation augmentation/prime
  simNetMonthly: number | null;
  simNetAnnual: number | null;
  // Feature 1 — PAS / Net-Net
  pasMonthly: number;
  netNet: number;
  // Feature 3 — Calculateur inversé
  inverseBrutMonthly: number | null;
  inverseBrutAnnual: number | null;
  inverseEmployerCost: number | null;
  // Feature 4 — PPV
  ppvNetClassic: number;
  ppvNetPPV: number;
  ppvEmployerCostClassic: number;
  ppvEmployerCostPPV: number;
  ppvGainEmployee: number;
  ppvSavingEmployer: number;
}

// Pure salary computation — no PAS/inverse/PPV (safe for recursive calls)
function computeCore(state: SalaryState): Omit<ComputedValues,
  'pasMonthly' | 'netNet' |
  'inverseBrutMonthly' | 'inverseBrutAnnual' | 'inverseEmployerCost' |
  'ppvNetClassic' | 'ppvNetPPV' | 'ppvEmployerCostClassic' | 'ppvEmployerCostPPV' | 'ppvGainEmployee' | 'ppvSavingEmployer'
> {
  const { grossAnnual, status, contractType, cddDuration, mutuelleMonthly, simulationMode, raisePercent, bonusAmount } = state;
  const grossMonthly = grossAnnual / 12;

  const t2_slice = grossMonthly > PSS_MONTHLY
    ? Math.min(grossMonthly - PSS_MONTHLY, 7 * PSS_MONTHLY)
    : 0;

  // --- Cotisations salariales ---
  const ss_plafonnee = 0.069 * Math.min(grossMonthly, PSS_MONTHLY);
  const ss_deplafonnee = 0.004 * grossMonthly;

  const agirc_t1 = 0.0315 * Math.min(grossMonthly, PSS_MONTHLY);
  const agirc_t2 = 0.0864 * t2_slice;

  const ceg = 0.0086 * Math.min(grossMonthly, PSS_MONTHLY) + 0.0108 * t2_slice;
  const cet = 0.0014 * t2_slice;

  const csgBase = grossMonthly * 0.9825;
  const csg_non_deductible = 0.024 * csgBase;
  const csg_deductible = 0.068 * csgBase;
  const crds = 0.005 * csgBase;
  const csg_total = csg_non_deductible + csg_deductible + crds;

  const mutuelle_sal = mutuelleMonthly;
  const apec_sal = status === 'cadre' ? 0.00024 * Math.min(grossMonthly, 4 * PSS_MONTHLY) : 0;

  const total_sal = ss_plafonnee + ss_deplafonnee + agirc_t1 + agirc_t2
    + ceg + cet + csg_total + mutuelle_sal + apec_sal;

  const netMonthly = grossMonthly - total_sal;
  const netImposable = grossMonthly - ss_plafonnee - ss_deplafonnee
    - agirc_t1 - agirc_t2 - ceg - cet - csg_deductible - mutuelle_sal - apec_sal;
  const netAnnual = netMonthly * 12;

  // --- Cotisations patronales ---
  const ss_maladie_pat = grossMonthly <= 2.25 * SMIC_MONTHLY_GROSS
    ? 0.07 * grossMonthly
    : 0.13 * grossMonthly;

  const ss_vieillesse_plaf_pat = 0.0855 * Math.min(grossMonthly, PSS_MONTHLY);
  const ss_vieillesse_deplaf_pat = 0.0202 * grossMonthly;

  const alloc_fam = grossMonthly <= 3.3 * SMIC_MONTHLY_GROSS ? 0.0345 * grossMonthly : 0.0525 * grossMonthly;
  const atmp = 0.0157 * grossMonthly;
  const fnal = 0.001 * Math.min(grossMonthly, PSS_MONTHLY);
  const chomage_pat = 0.040 * Math.min(grossMonthly, 4 * PSS_MONTHLY);
  const ags = 0.0025 * Math.min(grossMonthly, 4 * PSS_MONTHLY);

  const agirc_t1_pat = 0.0472 * Math.min(grossMonthly, PSS_MONTHLY);
  const agirc_t2_pat = 0.1295 * t2_slice;
  const ceg_pat = 0.0129 * Math.min(grossMonthly, PSS_MONTHLY) + 0.0162 * t2_slice;
  const cet_pat = 0.0021 * t2_slice;

  const apec_pat = status === 'cadre' ? 0.00036 * Math.min(grossMonthly, 4 * PSS_MONTHLY) : 0;
  const prevoyance_cadre_pat = status === 'cadre' ? 0.015 * Math.min(grossMonthly, PSS_MONTHLY) : 0;
  const mutuelle_pat = mutuelleMonthly;

  const filonCoeff = grossMonthly <= 1.6 * SMIC_MONTHLY_GROSS
    ? Math.max(0, 0.3193 * ((1.6 * SMIC_MONTHLY_GROSS / grossMonthly) - 1) / 0.6)
    : 0;
  const filonReduction = filonCoeff * grossMonthly;

  const cdd_surcharge = contractType === 'CDD'
    ? (cddDuration <= 1 ? 0.03 : cddDuration <= 3 ? 0.015 : 0) * grossMonthly
    : 0;
  const cdd_indemnite_precarite = contractType === 'CDD' ? grossAnnual * 0.1 : 0;

  const total_pat = ss_maladie_pat + ss_vieillesse_plaf_pat + ss_vieillesse_deplaf_pat
    + alloc_fam + atmp + fnal + chomage_pat + ags
    + agirc_t1_pat + agirc_t2_pat + ceg_pat + cet_pat
    + apec_pat + prevoyance_cadre_pat
    + mutuelle_pat - filonReduction
    + cdd_surcharge;

  const employerCost = grossMonthly + total_pat;
  const employerCostAnnual = employerCost * 12;

  // Simulation raise/bonus
  let simNetMonthly: number | null = null;
  let simNetAnnual: number | null = null;
  if (simulationMode === 'raise' && raisePercent > 0) {
    const simGross = grossAnnual * (1 + raisePercent / 100);
    const simComputed = computeCore({ ...state, grossAnnual: simGross, simulationMode: null });
    simNetMonthly = simComputed.netMonthly;
    simNetAnnual = simComputed.netAnnual;
  } else if (simulationMode === 'bonus' && bonusAmount > 0) {
    const simGross = grossAnnual + bonusAmount;
    const simComputed = computeCore({ ...state, grossAnnual: simGross, simulationMode: null });
    simNetMonthly = simComputed.netMonthly;
    simNetAnnual = simComputed.netAnnual;
  }

  return {
    grossMonthly, ss_plafonnee, ss_deplafonnee, agirc_t1, agirc_t2,
    ceg, cet, csgBase, csg_non_deductible, csg_deductible, crds, csg_total,
    mutuelle_sal, apec_sal, total_sal, netMonthly, netImposable, netAnnual,
    ss_maladie_pat, ss_vieillesse_plaf_pat, ss_vieillesse_deplaf_pat,
    alloc_fam, atmp, fnal, chomage_pat, ags,
    agirc_t1_pat, agirc_t2_pat, ceg_pat, apec_pat, prevoyance_cadre_pat, mutuelle_pat,
    filonCoeff, filonReduction, total_pat, employerCost, employerCostAnnual,
    cdd_surcharge, cdd_indemnite_precarite,
    simNetMonthly, simNetAnnual,
  };
}

function computeValues(state: SalaryState): ComputedValues {
  const base = computeCore(state);

  // Feature 1 — PAS
  const pasMonthly = state.pasRate * base.netImposable;
  const netNet = base.netMonthly - pasMonthly;

  // Feature 3 — Calculateur inversé (binary search)
  let inverseBrutMonthly: number | null = null;
  let inverseBrutAnnual: number | null = null;
  let inverseEmployerCost: number | null = null;

  if (state.isInverseMode && state.targetNet > 0) {
    let low = state.targetNet;
    let high = state.targetNet * 5;
    for (let i = 0; i < 60; i++) {
      const mid = (low + high) / 2;
      const trial = computeCore({ ...state, grossAnnual: mid * 12, simulationMode: null });
      if (trial.netMonthly < state.targetNet) {
        low = mid;
      } else {
        high = mid;
      }
    }
    inverseBrutMonthly = (low + high) / 2;
    inverseBrutAnnual = inverseBrutMonthly * 12;
    const invCore = computeCore({ ...state, grossAnnual: inverseBrutAnnual, simulationMode: null });
    inverseEmployerCost = invCore.employerCost;
  }

  // Feature 4 — PPV vs Prime classique
  let ppvNetClassic = 0;
  let ppvNetPPV = 0;
  let ppvEmployerCostClassic = 0;
  let ppvEmployerCostPPV = 0;

  if (state.ppvAmount > 0) {
    // Delta method: prime spread over the year (approximation)
    const withPrime = computeCore({ ...state, grossAnnual: state.grossAnnual + state.ppvAmount, simulationMode: null });
    const netDeltaAnnual = (withPrime.netMonthly - base.netMonthly) * 12;
    const netImposableDeltaAnnual = (withPrime.netImposable - base.netImposable) * 12;

    ppvNetClassic = netDeltaAnnual - netImposableDeltaAnnual * state.pasRate;
    ppvEmployerCostClassic = withPrime.employerCostAnnual - base.employerCostAnnual;

    // PPV 2025 : exonérée cotisations sal/pat, soumise CSG/CRDS (9,7% sur 98,25%), exonérée IR
    ppvNetPPV = state.ppvAmount * (1 - 0.9825 * 0.097);
    ppvEmployerCostPPV = state.ppvAmount; // 0 patronal charges
  }

  return {
    ...base,
    pasMonthly,
    netNet,
    inverseBrutMonthly,
    inverseBrutAnnual,
    inverseEmployerCost,
    ppvNetClassic,
    ppvNetPPV,
    ppvEmployerCostClassic,
    ppvEmployerCostPPV,
    ppvGainEmployee: ppvNetPPV - ppvNetClassic,
    ppvSavingEmployer: ppvEmployerCostClassic - ppvEmployerCostPPV,
  };
}

interface SalaryContextType {
  state: SalaryState;
  computed: ComputedValues;
  dispatch: React.Dispatch<Action>;
}

const SalaryContext = createContext<SalaryContextType | null>(null);

export function SalaryProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const restored: Partial<SalaryState> = {};
    if (params.get('b')) restored.grossAnnual = Number(params.get('b'));
    if (params.get('s')) restored.status = params.get('s') as Status;
    if (params.get('c')) restored.contractType = params.get('c') as ContractType;
    if (params.get('m')) restored.mutuelleMonthly = Number(params.get('m'));
    if (params.get('p')) restored.pasRate = Number(params.get('p'));
    if (Object.keys(restored).length > 0) {
      dispatch({ type: 'RESTORE_STATE', payload: restored });
    }
  }, []);

  const computed = useMemo(() => computeValues(state), [state]);

  return (
    <SalaryContext.Provider value={{ state, computed, dispatch }}>
      {children}
    </SalaryContext.Provider>
  );
}

export function useSalary() {
  const ctx = useContext(SalaryContext);
  if (!ctx) throw new Error('useSalary must be used within SalaryProvider');
  return ctx;
}

export function formatEuro(n: number): string {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' €';
}

export function formatEuroDecimal(n: number): string {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

export function getShareUrl(state: SalaryState): string {
  const base = window.location.origin + window.location.pathname;
  return `${base}?b=${state.grossAnnual}&s=${state.status}&c=${state.contractType}&m=${state.mutuelleMonthly}&p=${state.pasRate}`;
}
