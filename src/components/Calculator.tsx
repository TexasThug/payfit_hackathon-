import { useSalary } from '@/contexts/SalaryContext';
import EmployeeInputs from './EmployeeInputs';
import EmployeeResults from './EmployeeResults';
import EmployerInputs from './EmployerInputs';
import EmployerResults from './EmployerResults';

const Calculator = () => {
  const { state, dispatch } = useSalary();
  const { activeTab } = state;

  return (
    <section className="px-4 md:px-6 max-w-6xl mx-auto">
      {/* Tab Switcher */}
      <div className="flex gap-1 mb-6 bg-background-secondary p-1 rounded-lg w-fit mx-auto">
        <button
          className={`toggle-pill ${activeTab === 'employee' ? 'toggle-pill-active' : 'toggle-pill-inactive'}`}
          onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'employee' })}
        >
          👤 Salarié
        </button>
        <button
          className={`toggle-pill ${activeTab === 'employer' ? 'toggle-pill-active' : 'toggle-pill-inactive'}`}
          onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'employer' })}
        >
          🏢 Employeur
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-2">
          {activeTab === 'employee' ? <EmployeeInputs /> : <EmployerInputs />}
        </div>
        <div className="md:col-span-3">
          <div className="md:sticky md:top-6">
            {activeTab === 'employee' ? <EmployeeResults /> : <EmployerResults />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;
