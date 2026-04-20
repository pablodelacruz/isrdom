import { useState, useCallback } from 'react';
import { VALIDATION_CONFIG, ERROR_MESSAGES } from '../config/taxConfig';

interface UseInputFormattingReturn {
  displayValue: string;
  inputError: string;
  formatCurrency: (value: number) => string;
  formatInputValue: (value: number) => string;
  parseInputValue: (value: string) => number;
  handleInputChange: (value: string, type: 'salary' | 'dependents') => { value: number; isValid: boolean };
  setDisplayValue: (value: string) => void;
  setInputError: (error: string) => void;
  clearError: () => void;
}

export function useInputFormatting(initialValue: number = 0): UseInputFormattingReturn {
  const [displayValue, setDisplayValue] = useState('');
  const [inputError, setInputError] = useState('');

  const formatCurrency = useCallback((value: number): string => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2
    }).format(value);
  }, []);

  const formatInputValue = useCallback((value: number): string => {
    if (value === 0) return '';
    return new Intl.NumberFormat('es-DO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  }, []);

  const parseInputValue = useCallback((value: string): number => {
    // Remove all non-numeric characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? 0 : parsed;
  }, []);

  const validateSalary = useCallback((value: number): string => {
    // Don't show error for empty/zero values - let the calculation hook handle this
    if (isNaN(value) || value < 0) {
      return ERROR_MESSAGES.INVALID_SALARY;
    }
    if (value > VALIDATION_CONFIG.MAX_SALARY) {
      return ERROR_MESSAGES.SALARY_TOO_HIGH;
    }
    return '';
  }, []);

  const validateDependents = useCallback((value: number): string => {
    if (isNaN(value) || value < VALIDATION_CONFIG.MIN_DEPENDENTS || value > VALIDATION_CONFIG.MAX_DEPENDENTS) {
      return ERROR_MESSAGES.INVALID_DEPENDENTS;
    }
    return '';
  }, []);

  const sanitizeInput = useCallback((value: string, type: 'salary' | 'dependents'): string => {
    if (type === 'salary') {
      // Allow only numbers, commas, and decimal points
      return value.replace(/[^\d.,]/g, '');
    } else {
      // Allow only integers for dependents
      return value.replace(/[^\d]/g, '').replace(/^0+(\d)/, '$1');
    }
  }, []);

  const handleInputChange = useCallback((value: string, type: 'salary' | 'dependents') => {
    const sanitized = sanitizeInput(value, type);
    
    if (value !== sanitized) {
      setInputError(ERROR_MESSAGES.INVALID_INPUT);
      return { value: 0, isValid: false };
    }

    const numericValue = type === 'salary' 
      ? parseInputValue(sanitized)
      : parseInt(sanitized, 10) || 0;

    const validationError = type === 'salary' 
      ? validateSalary(numericValue)
      : validateDependents(numericValue);

    if (validationError) {
      setInputError(validationError);
      return { value: numericValue, isValid: false };
    }

    setInputError('');
    // For salary, consider it valid even if it's 0 (empty state)
    // For dependents, always valid if no validation error
    return { value: numericValue, isValid: true };
  }, [parseInputValue, sanitizeInput, validateSalary, validateDependents]);

  const clearError = useCallback(() => {
    setInputError('');
  }, []);

  return {
    displayValue,
    inputError,
    formatCurrency,
    formatInputValue,
    parseInputValue,
    handleInputChange,
    setDisplayValue,
    setInputError,
    clearError,
  };
}