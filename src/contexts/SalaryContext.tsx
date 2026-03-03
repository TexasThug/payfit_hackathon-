import React, { createContext, useContext, useReducer, useMemo, useEffect } from 'react';

// Constants
const PSS_MONTHLY = 3925;
const SMIC_MONTHLY_GROSS = 1801.80;

export type Status = 'cadre' | 'non-cadre';
export type ContractType = 'CDI' | 'CDD';
export type ActiveTab = 'employee' | 'employer';
export type SimulationMode = 'raise' | 'bonus' | null;

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
  mutuelle_pat: number;
  filonCoeff: number;
  filonReduction: number;
  total_pat: number;
  employerCost: number;
  employerCostAnnual: number;
  cdd_surcharge: number;
  cdd_indemnite_precarite: number;
  // Simulation
  simNetMonthly: number | null;
  simNetAnnual: number | null;
}

function computeValues(state: SalaryState): ComputedValues {
  const { grossAnnual, status, contractType, cddDuration, mutuelleMonthly, simulationMode, raisePercent, bonusAmount } = state;
  const grossMonthly = grossAnnual / 12;

  // Tranche T2 : portion entre 1 PSS et 8 PSS
  const t2_slice = grossMonthly > PSS_MONTHLY
    ? Math.min(grossMonthly - PSS_MONTHLY, 7 * PSS_MONTHLY)
    : 0;

  // --- Cotisations salariales ---
  // SS vieillesse
  const ss_plafonnee = 0.069 * Math.min(grossMonthly, PSS_MONTHLY);
  const ss_deplafonnee = 0.004 * grossMonthly;

  // AGIRC-ARRCO 2025 — source : Circulaire AGIRC-ARRCO 2024-18
  // Taux d'appel (127%) déjà inclus : T1 salarié 3,15% / T2 salarié 8,64%
  const agirc_t1 = 0.0315 * Math.min(grossMonthly, PSS_MONTHLY);
  const agirc_t2 = 0.0864 * t2_slice;

  // CEG salarié : T1 0,86% / T2 1,08% — source : LégiSocial AGIRC-ARRCO 2025
  const ceg = 0.0086 * Math.min(grossMonthly, PSS_MONTHLY) + 0.0108 * t2_slice;

  // CET salarié : 0,14% sur T2 uniquement — source : LégiSocial AGIRC-ARRCO 2025
  const cet = 0.0014 * t2_slice;

  // CSG/CRDS — assiette = 98,25% du brut (abattement forfaitaire frais pro)
  const csgBase = grossMonthly * 0.9825;
  const csg_non_deductible = 0.024 * csgBase;
  const csg_deductible = 0.068 * csgBase;
  const crds = 0.005 * csgBase;
  const csg_total = csg_non_deductible + csg_deductible + crds;

  const mutuelle_sal = mutuelleMonthly;

  const total_sal = ss_plafonnee + ss_deplafonnee + agirc_t1 + agirc_t2
    + ceg + cet + csg_total + mutuelle_sal;

  const netMonthly = grossMonthly - total_sal;
  const netImposable = grossMonthly - ss_plafonnee - ss_deplafonnee
    - agirc_t1 - agirc_t2 - ceg - cet - csg_deductible - mutuelle_sal;
  const netAnnual = netMonthly * 12;

  // --- Cotisations patronales ---
  // SS maladie : 7% taux réduit si ≤ 2,25 SMIC (LFSS 2025), sinon 13%
  // source : LégiSocial + Décret du 30/12/2024
  const ss_maladie_pat = grossMonthly <= 2.25 * SMIC_MONTHLY_GROSS
    ? 0.07 * grossMonthly
    : 0.13 * grossMonthly;

  const ss_vieillesse_plaf_pat = 0.0855 * Math.min(grossMonthly, PSS_MONTHLY);
  // SS vieillesse déplafonnée patron : 2,02% depuis 2024 — source : CLEISS
  const ss_vieillesse_deplaf_pat = 0.0202 * grossMonthly;

  // Allocations familiales : seuil abaissé à 3,3 SMIC (LFSS 2025, était 3,5)
  const alloc_fam = grossMonthly <= 3.3 * SMIC_MONTHLY_GROSS ? 0.0345 * grossMonthly : 0.0525 * grossMonthly;

  const atmp = 0.0157 * grossMonthly; // Taux moyen indicatif — variable par entreprise/secteur

  const fnal = 0.001 * Math.min(grossMonthly, PSS_MONTHLY); // 0,10% (hypothèse < 50 salariés)

  // Assurance chômage patron : 4,00% depuis le 1er mai 2025 — source : URSSAF
  const chomage_pat = 0.040 * Math.min(grossMonthly, 4 * PSS_MONTHLY);

  // AGS : 0,25% depuis juillet 2024 — source : Weblex / Service-Public
  const ags = 0.0025 * Math.min(grossMonthly, 4 * PSS_MONTHLY);

  // AGIRC-ARRCO patron 2025 : T1 4,72% / T2 12,95%
  const agirc_t1_pat = 0.0472 * Math.min(grossMonthly, PSS_MONTHLY);
  const agirc_t2_pat = 0.1295 * t2_slice;

  // CEG patron : T1 1,29% / T2 1,62%
  const ceg_pat = 0.0129 * Math.min(grossMonthly, PSS_MONTHLY) + 0.0162 * t2_slice;

  // CET patron : 0,21% sur T2
  const cet_pat = 0.0021 * t2_slice;

  const mutuelle_pat = mutuelleMonthly;

  // Réduction Fillon : T = 0,3193 (< 50 salariés, mai–déc 2025) — source : LégiSocial
  const filonCoeff = grossMonthly <= 1.6 * SMIC_MONTHLY_GROSS
    ? Math.max(0, 0.3193 * ((1.6 * SMIC_MONTHLY_GROSS / grossMonthly) - 1) / 0.6)
    : 0;
  const filonReduction = filonCoeff * grossMonthly;

  // CDD : majoration chômage patronal (0% si durée > 3 mois)
  const cdd_surcharge = contractType === 'CDD'
    ? (cddDuration <= 1 ? 0.03 : cddDuration <= 3 ? 0.015 : 0) * grossMonthly
    : 0;
  const cdd_indemnite_precarite = contractType === 'CDD' ? grossAnnual * 0.1 : 0;

  const total_pat = ss_maladie_pat + ss_vieillesse_plaf_pat + ss_vieillesse_deplaf_pat
    + alloc_fam + atmp + fnal + chomage_pat + ags
    + agirc_t1_pat + agirc_t2_pat + ceg_pat + cet_pat + mutuelle_pat - filonReduction
    + cdd_surcharge;

  const employerCost = grossMonthly + total_pat;
  const employerCostAnnual = employerCost * 12;

  // Simulation
  let simNetMonthly: number | null = null;
  let simNetAnnual: number | null = null;
  if (simulationMode === 'raise' && raisePercent > 0) {
    const simGross = grossAnnual * (1 + raisePercent / 100);
    const simComputed = computeValues({ ...state, grossAnnual: simGross, simulationMode: null });
    simNetMonthly = simComputed.netMonthly;
    simNetAnnual = simComputed.netAnnual;
  } else if (simulationMode === 'bonus' && bonusAmount > 0) {
    const simGross = grossAnnual + bonusAmount;
    const simComputed = computeValues({ ...state, grossAnnual: simGross, simulationMode: null });
    simNetMonthly = simComputed.netMonthly;
    simNetAnnual = simComputed.netAnnual;
  }

  return {
    grossMonthly, ss_plafonnee, ss_deplafonnee, agirc_t1, agirc_t2,
    ceg, cet, csgBase, csg_non_deductible, csg_deductible, crds, csg_total,
    mutuelle_sal, total_sal, netMonthly, netImposable, netAnnual,
    ss_maladie_pat, ss_vieillesse_plaf_pat, ss_vieillesse_deplaf_pat,
    alloc_fam, atmp, fnal, chomage_pat, ags,
    agirc_t1_pat, agirc_t2_pat, ceg_pat, mutuelle_pat,
    filonCoeff, filonReduction, total_pat, employerCost, employerCostAnnual,
    cdd_surcharge, cdd_indemnite_precarite,
    simNetMonthly, simNetAnnual,
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

  // Parse URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const restored: Partial<SalaryState> = {};
    if (params.get('b')) restored.grossAnnual = Number(params.get('b'));
    if (params.get('s')) restored.status = params.get('s') as Status;
    if (params.get('c')) restored.contractType = params.get('c') as ContractType;
    if (params.get('m')) restored.mutuelleMonthly = Number(params.get('m'));
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
  return `${base}?b=${state.grossAnnual}&s=${state.status}&c=${state.contractType}&m=${state.mutuelleMonthly}`;
}
