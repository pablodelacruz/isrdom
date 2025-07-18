export interface ISRData {
  isr: { name: string; value: number };
  imponible: { name: string; value: number };
  tss: { name: string; value: number };
  afp: { name: string; value: number };
  sfs: { name: string; value: number };
  percapita: { name: string; value: number };
  cobro: { name: string; value: number };
}

export interface CalculationInputs {
  totalIngresos: number;
  numeroDependientes: number;
}

export interface TaxConfig {
  // TSS Configuration
  salarioMinimoCotizable: number;
  afpPorciento: number;
  sfsPorciento: number;
  topeAfpMultiplier: number; // multiplier for salario minimo (20x)
  topeSfsMultiplier: number; // multiplier for salario minimo (10x)
  descuentoPorDependiente: number;
  
  // ISR Tax Brackets (annual amounts)
  escala1Hasta: number;
  escala2Hasta: number;
  escala3Hasta: number;
  escala3Monto: number;
  escala4Monto: number;
  escala2Porciento: number;
  escala3Porciento: number;
  escala4Porciento: number;
}