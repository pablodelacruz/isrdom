import { describe, it, expect } from 'vitest';
import { calculoIsrRd, calculoTssRd, createInitialData } from '../isrCalculator';
import { TAX_CONFIG } from '../../config/taxConfig';

describe('ISR Calculator', () => {
  describe('createInitialData', () => {
    it('should create initial data structure with zero values', () => {
      const data = createInitialData();
      
      expect(data.isr.value).toBe(0);
      expect(data.tss.value).toBe(0);
      expect(data.cobro.value).toBe(0);
      expect(data.afp.value).toBe(0);
      expect(data.sfs.value).toBe(0);
      expect(data.percapita.value).toBe(0);
      expect(data.imponible.value).toBe(0);
    });

    it('should have correct property names', () => {
      const data = createInitialData();
      
      expect(data.isr.name).toBe('Monto ISR');
      expect(data.tss.name).toBe('Monto TSS');
      expect(data.cobro.name).toBe('Monto A Cobrar');
    });
  });

  describe('calculoTssRd', () => {
    it('should calculate TSS correctly for basic salary', () => {
      const data = createInitialData();
      const salary = 50000;
      const dependents = 0;
      
      const result = calculoTssRd(data, salary, dependents);
      
      const expectedAfp = (salary * TAX_CONFIG.afpPorciento) / 100;
      const expectedSfs = (salary * TAX_CONFIG.sfsPorciento) / 100;
      
      expect(result.afp.value).toBeCloseTo(expectedAfp, 2);
      expect(result.sfs.value).toBeCloseTo(expectedSfs, 2);
      expect(result.percapita.value).toBe(0);
      expect(result.tss.value).toBeCloseTo(expectedAfp + expectedSfs, 2);
    });

    it('should apply dependent discount correctly', () => {
      const data = createInitialData();
      const salary = 50000;
      const dependents = 2;
      
      const result = calculoTssRd(data, salary, dependents);
      
      const expectedDiscount = dependents * TAX_CONFIG.descuentoPorDependiente;
      expect(result.percapita.value).toBe(expectedDiscount);
    });

    it('should respect AFP salary cap', () => {
      const data = createInitialData();
      const highSalary = 500000; // Above AFP cap
      const dependents = 0;
      
      const result = calculoTssRd(data, highSalary, dependents);
      
      const afpCap = TAX_CONFIG.salarioMinimoCotizable * TAX_CONFIG.topeAfpMultiplier;
      const expectedAfp = (afpCap * TAX_CONFIG.afpPorciento) / 100;
      
      expect(result.afp.value).toBeCloseTo(expectedAfp, 2);
    });

    it('should respect SFS salary cap', () => {
      const data = createInitialData();
      const highSalary = 500000; // Above SFS cap
      const dependents = 0;
      
      const result = calculoTssRd(data, highSalary, dependents);
      
      const sfsCap = TAX_CONFIG.salarioMinimoCotizable * TAX_CONFIG.topeSfsMultiplier;
      const expectedSfs = (sfsCap * TAX_CONFIG.sfsPorciento) / 100;
      
      expect(result.sfs.value).toBeCloseTo(expectedSfs, 2);
    });
  });

  describe('calculoIsrRd', () => {
    it('should calculate ISR correctly for low salary (0% bracket)', () => {
      const data = createInitialData();
      const monthlySalary = 20000; // Low salary
      const dependents = 0;
      
      const result = calculoIsrRd(data, monthlySalary, 0, dependents);
      
      // Should be in 0% tax bracket
      expect(result.isr.value).toBe(0);
      expect(result.cobro.value).toBeGreaterThan(0);
    });

    it('should calculate ISR correctly for medium salary', () => {
      const data = createInitialData();
      const monthlySalary = 80000; // Medium salary
      const dependents = 0;
      
      const result = calculoIsrRd(data, monthlySalary, 0, dependents);
      
      // Should have some ISR
      expect(result.isr.value).toBeGreaterThan(0);
      expect(result.cobro.value).toBeLessThan(monthlySalary);
    });

    it('should calculate net salary correctly', () => {
      const data = createInitialData();
      const monthlySalary = 60000;
      const dependents = 1;
      
      const result = calculoIsrRd(data, monthlySalary, 0, dependents);
      
      // Net salary should equal gross minus ISR minus TSS
      const expectedNet = monthlySalary - result.isr.value - result.tss.value;
      expect(result.cobro.value).toBeCloseTo(expectedNet, 2);
    });

    it('should handle zero salary', () => {
      const data = createInitialData();
      const result = calculoIsrRd(data, 0, 0, 0);
      
      expect(result.isr.value).toBe(0);
      expect(result.tss.value).toBe(0);
      expect(result.cobro.value).toBe(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle negative values gracefully', () => {
      const data = createInitialData();
      
      // Should not throw errors with negative inputs
      expect(() => calculoIsrRd(data, -1000, 0, 0)).not.toThrow();
      expect(() => calculoTssRd(data, -1000, 0)).not.toThrow();
    });

    it('should handle very large salaries', () => {
      const data = createInitialData();
      const hugeSalary = 10000000; // 10 million pesos
      
      const result = calculoIsrRd(data, hugeSalary, 0, 0);
      
      // Should still calculate without errors
      expect(result.isr.value).toBeGreaterThan(0);
      expect(result.cobro.value).toBeGreaterThan(0);
      expect(result.tss.value).toBeGreaterThan(0);
    });
  });
});