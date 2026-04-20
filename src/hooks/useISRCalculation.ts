import { useMemo, useCallback } from 'react';
import { ISRData, CalculationInputs } from '../types/isr';
import { createInitialData, calculoIsrRd } from '../utils/isrCalculator';
import { ERROR_MESSAGES } from '../config/taxConfig';

interface UseISRCalculationReturn {
  results: ISRData;
  isValid: boolean;
  error: string | null;
  calculate: (inputs: CalculationInputs) => ISRData;
  clearError: () => void;
}

export function useISRCalculation(inputs: CalculationInputs): UseISRCalculationReturn {
  const { results, isValid, error } = useMemo(() => {
    try {
      // Don't calculate if salary is empty or zero
      if (!inputs.totalIngresos || inputs.totalIngresos <= 0) {
        return {
          results: createInitialData(),
          isValid: false,
          error: null
        };
      }

      // Validate inputs
      if (inputs.numeroDependientes < 0) {
        return {
          results: createInitialData(),
          isValid: false,
          error: ERROR_MESSAGES.INVALID_DEPENDENTS
        };
      }

      // Perform calculation
      const bodyData = createInitialData();
      const calculatedResults = calculoIsrRd(
        bodyData,
        inputs.totalIngresos,
        0,
        inputs.numeroDependientes
      );

      return {
        results: calculatedResults,
        isValid: true,
        error: null
      };
    } catch (err) {
      console.error('Calculation error:', err);
      return {
        results: createInitialData(),
        isValid: false,
        error: ERROR_MESSAGES.CALCULATION_ERROR
      };
    }
  }, [inputs.totalIngresos, inputs.numeroDependientes]);

  const calculate = useCallback((newInputs: CalculationInputs): ISRData => {
    const bodyData = createInitialData();
    return calculoIsrRd(
      bodyData,
      newInputs.totalIngresos,
      0,
      newInputs.numeroDependientes
    );
  }, []);

  const clearError = useCallback(() => {
    // This would be used if we had local error state
  }, []);

  return {
    results,
    isValid,
    error,
    calculate,
    clearError,
  };
}