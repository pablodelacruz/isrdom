import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { CalculationInputs } from '../types/isr';
import { TAX_CONFIG } from '../config/taxConfig';
import { useInputFormatting } from '../hooks/useInputFormatting';
import { RotateCcw } from 'lucide-react';

interface InputFormProps {
  inputs: CalculationInputs;
  onInputChange: (field: keyof CalculationInputs, value: number) => void;
  onClearAll: () => void;
  isCalculating: boolean;
}

export function InputForm({ inputs, onInputChange, onClearAll, isCalculating }: InputFormProps) {
  const salaryInputRef = useRef<HTMLInputElement>(null);
  const dependentsInputRef = useRef<HTMLInputElement>(null);
  
  const {
    displayValue,
    inputError,
    formatCurrency,
    formatInputValue,
    handleInputChange: handleFormatting,
    setDisplayValue,
    clearError
  } = useInputFormatting();

  const [dependentsError, setDependentsError] = useState('');

  useEffect(() => {
    setDisplayValue(formatInputValue(inputs.totalIngresos));
  }, [inputs.totalIngresos, formatInputValue, setDisplayValue]);

  const handleSalaryChange = (value: string) => {
    const result = handleFormatting(value, 'salary');
    setDisplayValue(value);
    
    // Always update the input value, even if it's 0 or invalid
    // This allows the calculation hook to properly handle empty states
    onInputChange('totalIngresos', result.value);
  };

  const handleDependentsChange = (value: string) => {
    const result = handleFormatting(value, 'dependents');
    
    if (result.isValid) {
      setDependentsError('');
      onInputChange('numeroDependientes', result.value);
    } else {
      setDependentsError(inputError);
    }
  };

  const handleSalaryBlur = () => {
    setDisplayValue(formatInputValue(inputs.totalIngresos));
    clearError();
  };

  const handleSalaryFocus = () => {
    setDisplayValue(inputs.totalIngresos.toString());
  };

  const handleClearAll = () => {
    onClearAll();
    setDisplayValue('');
    clearError();
    setDependentsError('');
    
    // Focus on salary input after clearing
    setTimeout(() => {
      salaryInputRef.current?.focus();
    }, 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <label 
          htmlFor="totalIngresos" 
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Ingresos Totales Mensuales
          <span className="text-red-500 ml-1" aria-label="Campo requerido">*</span>
        </label>
        <div className="relative">
          <span 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium pointer-events-none"
            aria-hidden="true"
          >
            RD$
          </span>
          <input
            ref={salaryInputRef}
            type="text"
            id="totalIngresos"
            value={displayValue}
            onChange={(e) => handleSalaryChange(e.target.value)}
            onBlur={handleSalaryBlur}
            onFocus={handleSalaryFocus}
            className={`w-full pl-12 pr-4 py-3 lg:py-4 border ${inputError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 text-base lg:text-lg font-medium ${
              inputs.totalIngresos === 0 ? 'text-gray-400' : 'text-black'
            } touch-manipulation`}
            placeholder="90,000.00"
            inputMode="decimal"
            pattern="[0-9,.]*"
            autoComplete="off"
            aria-invalid={!!inputError}
            aria-describedby={inputError ? 'salary-error' : 'salary-help'}
            required
          />
          {inputError && (
            <p id="salary-error" className="text-red-600 text-sm mt-1" role="alert">
              {inputError}
            </p>
          )}
        </div>
        <p id="salary-help" className="text-sm text-gray-500 mt-2">
          Equivalente anual: {formatCurrency(inputs.totalIngresos * 12)}
        </p>
      </div>

      <div>
        <label 
          htmlFor="numeroDependientes" 
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Número de Dependientes
        </label>
        <div className="relative">
          <span 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium pointer-events-none"
            aria-hidden="true"
          >
            👥
          </span>
          <input
            ref={dependentsInputRef}
            type="number"
            id="numeroDependientes"
            value={inputs.numeroDependientes === 0 ? '' : inputs.numeroDependientes}
            onChange={(e) => {
              const val = e.target.value === '' ? '0' : e.target.value;
              handleDependentsChange(val);
            }}
            className={`w-full pl-12 pr-4 py-3 lg:py-4 border ${dependentsError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 text-base lg:text-lg font-medium touch-manipulation`}
            placeholder="0"
            step="1"
            min="0"
            max="20"
            aria-invalid={!!dependentsError}
            aria-describedby={dependentsError ? 'dependents-error' : 'dependents-help'}
          />
          {dependentsError && (
            <p id="dependents-error" className="text-red-600 text-sm mt-1" role="alert">
              {dependentsError}
            </p>
          )}
        </div>
        <p id="dependents-help" className="text-sm text-gray-500 mt-2">
          Descuento: {formatCurrency(inputs.numeroDependientes * TAX_CONFIG.descuentoPorDependiente)} (RD$ {TAX_CONFIG.descuentoPorDependiente.toLocaleString()} por dependiente)
        </p>
      </div>

      {/* Clear All Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleClearAll}
          disabled={inputs.totalIngresos === 0 && inputs.numeroDependientes === 0}
          className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-label="Limpiar todos los campos"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Limpiar Todo</span>
        </button>
      </div>

      {isCalculating && (
        <div className="flex items-center justify-center py-4" role="status" aria-live="polite">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Calculando...</span>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Información</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Los cálculos se actualizan automáticamente</li>
          <li>• El ISR se calcula proyectando el salario a 12 meses</li>
          <li>• Cada dependiente reduce RD$ {TAX_CONFIG.descuentoPorDependiente.toLocaleString()} del TSS</li>
        </ul>
      </div>
    </div>
  );
}