import { TaxConfig } from '../types/isr';

// Configurable tax values - update these when Dominican government changes rates
export const TAX_CONFIG: TaxConfig = {
  // TSS Configuration
  salarioMinimoCotizable: 15600.00,
  afpPorciento: 2.87,
  sfsPorciento: 3.04,
  topeAfpMultiplier: 20, // 20 salarios mínimos
  topeSfsMultiplier: 10, // 10 salarios mínimos
  descuentoPorDependiente: 1919.78,
  
  // ISR Tax Brackets (annual amounts) - as of January 2016 from DGII
  escala1Hasta: 416220.00,
  escala2Hasta: 624329.00,
  escala3Hasta: 867123.00,
  escala3Monto: 31216.00,
  escala4Monto: 79776.00,
  escala2Porciento: 0.15,
  escala3Porciento: 0.20,
  escala4Porciento: 0.25,
};

// Input validation constants
export const VALIDATION_CONFIG = {
  MIN_SALARY: 0.01,
  MAX_SALARY: 50000000, // 50 million pesos
  MAX_DEPENDENTS: 20,
  MIN_DEPENDENTS: 0,
};

// Error messages
export const ERROR_MESSAGES = {
  INVALID_SALARY: 'Por favor, ingresa un salario válido mayor a 0.',
  SALARY_TOO_HIGH: `El salario no puede ser mayor a RD$ ${VALIDATION_CONFIG.MAX_SALARY.toLocaleString()}.`,
  INVALID_DEPENDENTS: 'El número de dependientes debe ser entre 0 y 20.',
  INVALID_INPUT: 'Solo se permiten números, comas y puntos.',
  CALCULATION_ERROR: 'Error en el cálculo. Por favor, verifica los datos ingresados.',
};