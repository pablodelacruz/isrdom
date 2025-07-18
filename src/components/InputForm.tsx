import React from 'react';
import { useState, useEffect } from 'react';
import { CalculationInputs } from '../types/isr';
import { TAX_CONFIG } from '../utils/isrCalculator';

interface InputFormProps {
  inputs: CalculationInputs;
  onInputChange: (field: keyof CalculationInputs, value: number) => void;
  isCalculating: boolean;
}

export function InputForm({ inputs, onInputChange, isCalculating }: InputFormProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [inputError, setInputError] = useState('');

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatInputValue = (value: number): string => {
    if (value === 0) return '';
    return new Intl.NumberFormat('es-DO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };

  const parseInputValue = (value: string): number => {
    // Remove all non-numeric characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    return parseFloat(cleanValue) || 0;
  };

  useEffect(() => {
    setDisplayValue(formatInputValue(inputs.totalIngresos));
  }, [inputs.totalIngresos]);

  const handleInputChange = (field: keyof CalculationInputs, value: string) => {
    if (field === 'totalIngresos') {
      // Permitir solo números, comas y puntos
      const filtered = value.replace(/[^\d.,]/g, '');
      setDisplayValue(filtered);
      // Validar si hay caracteres inválidos
      if (value !== filtered) {
        setInputError('Solo se permiten números, comas y puntos.');
      } else {
        setInputError('');
      }
      const numericValue = parseInputValue(filtered);
      onInputChange(field, numericValue);
    } else {
      const numericValue = parseFloat(value) || 0;
      onInputChange(field, numericValue);
    }
  };

  const handleBlur = () => {
    setDisplayValue(formatInputValue(inputs.totalIngresos));
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="totalIngresos" className="block text-sm font-semibold text-gray-700 mb-2">
          Ingresos Totales Mensuales
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
            RD$
          </span>
          <input
            type="text"
            id="totalIngresos"
            value={displayValue}
            onChange={(e) => handleInputChange('totalIngresos', e.target.value)}
            onBlur={handleBlur}
            onFocus={() => setDisplayValue(inputs.totalIngresos.toString())}
            className={`w-full pl-12 pr-4 py-4 border ${inputError ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg font-medium ${
              inputs.totalIngresos === 0 ? 'text-gray-400' : 'text-black'
            }`}
            placeholder="180,000.00"
            inputMode="decimal"
            pattern="[0-9,.]*"
            autoComplete="off"
            aria-invalid={!!inputError}
          />
          {inputError && (
            <p className="text-red-600 text-sm mt-1">{inputError}</p>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Equivalente anual: {formatCurrency(inputs.totalIngresos * 12)}
        </p>
      </div>

      <div>
        <label htmlFor="numeroDependientes" className="block text-sm font-semibold text-gray-700 mb-2">
          Número de Dependientes
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
            👥
          </span>
          <input
            type="number"
            id="numeroDependientes"
            value={inputs.numeroDependientes}
            onChange={(e) => handleInputChange('numeroDependientes', e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg font-medium"
            placeholder="2"
            step="1"
            min="0"
            max="20"
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Descuento: {formatCurrency(inputs.numeroDependientes * TAX_CONFIG.descuentoPorDependiente)} (RD$ {TAX_CONFIG.descuentoPorDependiente.toLocaleString()} por dependiente)
        </p>
      </div>

      {isCalculating && (
        <div className="flex items-center justify-center py-4">
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