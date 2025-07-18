import { ISRData, TaxConfig } from '../types/isr';

// Configurable tax values - update these when Dominican government changes rates
export const TAX_CONFIG: TaxConfig = {
  // TSS Configuration
  salarioMinimoCotizable: 15600.00,
  afpPorciento: 2.87,
  sfsPorciento: 3.04,
  topeAfpMultiplier: 20, // 20 salarios mínimos
  topeSfsMultiplier: 10, // 10 salarios mínimos
  descuentoPorDependiente: 1715.46,
  
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

export function createInitialData(): ISRData {
  return {
    isr: { name: 'Monto ISR', value: 0 },
    imponible: { name: 'Monto Imponible', value: 0 },
    tss: { name: 'Monto TSS', value: 0 },
    afp: { name: 'Monto AFP', value: 0 },
    sfs: { name: 'Monto SFS', value: 0 },
    percapita: { name: 'Monto Percapita', value: 0 },
    cobro: { name: 'Monto A Cobrar', value: 0 }
  };
}

function setValue(data: ISRData, name: keyof ISRData, value: number): void {
  data[name].value = Math.round(value * 1000) / 1000;
}

export function calculoTssRd(
  bodyData: ISRData,
  totalIngresos: number = 0,
  numeroDependientes: number = 0
): ISRData {
  const config = TAX_CONFIG;
  const totalIngresosTss = totalIngresos;
  const topeAfp = config.salarioMinimoCotizable * config.topeAfpMultiplier;
  const topeSfs = config.salarioMinimoCotizable * config.topeSfsMultiplier;
  const descuentoPercapitaTss = numeroDependientes * config.descuentoPorDependiente;

  const totalIngresosTssAfp = totalIngresosTss > topeAfp ? topeAfp : totalIngresosTss;
  const totalIngresosTssSfs = totalIngresosTss > topeSfs ? topeSfs : totalIngresosTss;

  const afpCalculo = (totalIngresosTssAfp * config.afpPorciento) / 100;
  const sfsCalculo = (totalIngresosTssSfs * config.sfsPorciento) / 100;

  setValue(bodyData, 'tss', afpCalculo + sfsCalculo + descuentoPercapitaTss);
  setValue(bodyData, 'afp', afpCalculo);
  setValue(bodyData, 'sfs', sfsCalculo);
  setValue(bodyData, 'percapita', descuentoPercapitaTss);

  return bodyData;
}

export function calculoIsrRd(
  bodyData: ISRData,
  totalIngresos: number = 0,
  totalIngresosTss: number = 0,
  numeroDependientes: number = 0
): ISRData {
  const config = TAX_CONFIG;
  
  // Tax brackets using configurable values
  const escala1Desde = 0;
  const escala1Hasta = config.escala1Hasta;
  const escala2Desde = escala1Hasta + 0.01;
  const escala2Hasta = config.escala2Hasta;
  const escala3Desde = escala2Hasta + 0.01;
  const escala3Hasta = config.escala3Hasta;
  const escala4Desde = escala3Hasta + 0.01;
  const escala4Hasta = 999999999999999;

  if (totalIngresosTss === 0) totalIngresosTss = totalIngresos;

  // Calculate TSS amounts
  calculoTssRd(bodyData, totalIngresosTss, numeroDependientes);

  // Calculate taxable income projected to 12 months
  const totalIngresosImponible = (totalIngresos - bodyData.tss.value) * 12;

  const escalas = [
    {
      desde: escala1Desde,
      hasta: escala1Hasta,
      calculo: () => 0
    },
    {
      desde: escala2Desde,
      hasta: escala2Hasta,
      calculo: () => (totalIngresosImponible - escala2Desde) * config.escala2Porciento / 12
    },
    {
      desde: escala3Desde,
      hasta: escala3Hasta,
      calculo: () => ((totalIngresosImponible - escala3Desde) * config.escala3Porciento + config.escala3Monto) / 12
    },
    {
      desde: escala4Desde,
      hasta: escala4Hasta,
      calculo: () => ((totalIngresosImponible - escala4Desde) * config.escala4Porciento + config.escala4Monto) / 12
    }
  ];

  let isrCalculated = false;
  for (const escala of escalas) {
    if (totalIngresosImponible >= escala.desde && totalIngresosImponible <= escala.hasta) {
      setValue(bodyData, 'isr', escala.calculo());
      isrCalculated = true;
      break;
    }
  }

  if (!isrCalculated) {
    setValue(bodyData, 'isr', 0);
  }

  setValue(bodyData, 'cobro', totalIngresos - bodyData.isr.value - bodyData.tss.value);
  setValue(bodyData, 'imponible', totalIngresosImponible / 12);

  return bodyData;
}