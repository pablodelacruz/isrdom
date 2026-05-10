import { useState, useCallback, useMemo } from 'react';
import { Calculator, DollarSign, TrendingUp, Download, RotateCcw, ChevronDown, ChevronRight } from 'lucide-react';

// Types
interface CalculationInputs {
  totalIngresos: number;
  numeroDependientes: number;
}

interface ISRData {
  isr: { name: string; value: number };
  imponible: { name: string; value: number };
  tss: { name: string; value: number };
  afp: { name: string; value: number };
  sfs: { name: string; value: number };
  percapita: { name: string; value: number };
  cobro: { name: string; value: number };
}

// Tax Configuration
const TAX_CONFIG = {
  salarioMinimoCotizable: 15600.00,
  afpPorciento: 2.87,
  sfsPorciento: 3.04,
  topeAfpMultiplier: 20,
  topeSfsMultiplier: 10,
  descuentoPorDependiente: 1919.78,
  escala1Hasta: 416220.00,
  escala2Hasta: 624329.00,
  escala3Hasta: 867123.00,
  escala3Monto: 31216.00,
  escala4Monto: 79776.00,
  escala2Porciento: 0.15,
  escala3Porciento: 0.20,
  escala4Porciento: 0.25,
};

// Utility functions
function createInitialData(): ISRData {
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

function calculoTssRd(bodyData: ISRData, totalIngresos: number = 0, numeroDependientes: number = 0): ISRData {
  const config = TAX_CONFIG;
  const topeAfp = config.salarioMinimoCotizable * config.topeAfpMultiplier;
  const topeSfs = config.salarioMinimoCotizable * config.topeSfsMultiplier;
  const descuentoPercapitaTss = numeroDependientes * config.descuentoPorDependiente;

  const totalIngresosTssAfp = totalIngresos > topeAfp ? topeAfp : totalIngresos;
  const totalIngresosTssSfs = totalIngresos > topeSfs ? topeSfs : totalIngresos;

  const afpCalculo = (totalIngresosTssAfp * config.afpPorciento) / 100;
  const sfsCalculo = (totalIngresosTssSfs * config.sfsPorciento) / 100;

  setValue(bodyData, 'tss', afpCalculo + sfsCalculo + descuentoPercapitaTss);
  setValue(bodyData, 'afp', afpCalculo);
  setValue(bodyData, 'sfs', sfsCalculo);
  setValue(bodyData, 'percapita', descuentoPercapitaTss);

  return bodyData;
}

function calculoIsrRd(bodyData: ISRData, totalIngresos: number = 0, totalIngresosTss: number = 0, numeroDependientes: number = 0): ISRData {
  const config = TAX_CONFIG;
  
  if (totalIngresosTss === 0) totalIngresosTss = totalIngresos;

  calculoTssRd(bodyData, totalIngresosTss, numeroDependientes);

  const totalIngresosImponible = (totalIngresos - bodyData.tss.value) * 12;

  const escalas = [
    {
      desde: 0,
      hasta: config.escala1Hasta,
      calculo: () => 0
    },
    {
      desde: config.escala1Hasta + 0.01,
      hasta: config.escala2Hasta,
      calculo: () => (totalIngresosImponible - (config.escala1Hasta + 0.01)) * config.escala2Porciento / 12
    },
    {
      desde: config.escala2Hasta + 0.01,
      hasta: config.escala3Hasta,
      calculo: () => ((totalIngresosImponible - (config.escala2Hasta + 0.01)) * config.escala3Porciento + config.escala3Monto) / 12
    },
    {
      desde: config.escala3Hasta + 0.01,
      hasta: 999999999999999,
      calculo: () => ((totalIngresosImponible - (config.escala3Hasta + 0.01)) * config.escala4Porciento + config.escala4Monto) / 12
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

export default function ISRCalculator() {
  const [inputs, setInputs] = useState<CalculationInputs>({
    totalIngresos: 0,
    numeroDependientes: 0
  });

  const [displayValue, setDisplayValue] = useState('');
  const [isTssExpanded, setIsTssExpanded] = useState(false);

  const results = useMemo(() => {
    if (!inputs.totalIngresos || inputs.totalIngresos <= 0) {
      return createInitialData();
    }

    const bodyData = createInitialData();
    return calculoIsrRd(bodyData, inputs.totalIngresos, 0, inputs.numeroDependientes);
  }, [inputs.totalIngresos, inputs.numeroDependientes]);

  const handleInputChange = useCallback((field: keyof CalculationInputs, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleClearAll = useCallback(() => {
    setInputs({
      totalIngresos: 0,
      numeroDependientes: 0
    });
    setDisplayValue('');
  }, []);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (value: number): string => {
    if (value === 0) return '';
    return new Intl.NumberFormat('es-DO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d.]/g, '');
    
    // Prevent leading zeros (except for decimal numbers like 0.5)
    if (value.length > 1 && value.startsWith('0') && !value.startsWith('0.')) {
      value = value.replace(/^0+/, '');
    }
    
    // Limit to reasonable length (max 12 digits before decimal)
    const parts = value.split('.');
    if (parts[0].length > 12) {
      parts[0] = parts[0].substring(0, 12);
      value = parts.join('.');
    }
    
    // Limit decimal places to 2
    if (parts.length > 1 && parts[1].length > 2) {
      parts[1] = parts[1].substring(0, 2);
      value = parts.join('.');
    }
    
    // Prevent multiple decimal points
    const decimalCount = (value.match(/\./g) || []).length;
    if (decimalCount > 1) {
      const firstDecimalIndex = value.indexOf('.');
      value = value.substring(0, firstDecimalIndex + 1) + value.substring(firstDecimalIndex + 1).replace(/\./g, '');
    }
    
    setDisplayValue(value);
    const numericValue = parseFloat(value) || 0;
    
    // Limit maximum value to prevent overflow
    const maxValue = 999999999999; // 12 digits max
    if (numericValue > maxValue) {
      setDisplayValue(maxValue.toString());
      handleInputChange('totalIngresos', maxValue);
    } else {
      handleInputChange('totalIngresos', numericValue);
    }
  };

  const handleSalaryBlur = () => {
    setDisplayValue(formatNumber(inputs.totalIngresos));
  };

  const handleSalaryFocus = () => {
    setDisplayValue(inputs.totalIngresos.toString());
  };

  const handleExport = useCallback(() => {
    const exportData = `
Calculadora ISR República Dominicana
===================================

Datos de Entrada:
- Ingresos Mensuales: RD$ ${inputs.totalIngresos.toLocaleString()}
- Dependientes: ${inputs.numeroDependientes}

Resultados:
- Monto Neto a Cobrar: RD$ ${results.cobro.value.toLocaleString()}
- ISR: RD$ ${results.isr.value.toLocaleString()}
- TSS Total: RD$ ${results.tss.value.toLocaleString()}
  - AFP: RD$ ${results.afp.value.toLocaleString()}
  - SFS: RD$ ${results.sfs.value.toLocaleString()}
  - Percápita: RD$ ${results.percapita.value.toLocaleString()}
- Monto Imponible: RD$ ${results.imponible.value.toLocaleString()}

Total Descuentos: RD$ ${(results.isr.value + results.tss.value).toLocaleString()}

Generado el: ${new Date().toLocaleDateString('es-DO')}
    `.trim();

    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculo-isr-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [inputs, results]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-8">
          <div className="flex items-center justify-center mb-3 lg:mb-4">
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-3 lg:p-4 rounded-2xl shadow-lg">
              <Calculator className="w-8 lg:w-12 h-8 lg:h-12 text-white" />
            </div>
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2 lg:mb-3">
            Calculadora ISR República Dominicana
          </h1>
          <p className="text-base lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Calcula tu Impuesto Sobre la Renta, TSS, AFP, SFS y monto neto a cobrar
            según las escalas vigentes de la DGII
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-xl p-4 lg:p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <DollarSign className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">
                Datos de Entrada
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="totalIngresos" className="block text-sm font-semibold text-gray-700 mb-2">
                  Ingresos Totales Mensuales
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium pointer-events-none">
                    RD$
                  </span>
                  <input
                    type="text"
                    id="totalIngresos"
                    value={displayValue}
                    onChange={handleSalaryChange}
                    onBlur={handleSalaryBlur}
                    onFocus={handleSalaryFocus}
                    className="w-full pl-12 pr-4 py-3 lg:py-4 border border-gray-300 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-base lg:text-lg font-medium"
                    placeholder="90,000.00"
                  />
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
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium pointer-events-none">
                    👥
                  </span>
                  <input
                    type="number"
                    id="numeroDependientes"
                    value={inputs.numeroDependientes || ''}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      // Limit dependents to reasonable range (0-99)
                      const limitedValue = Math.min(Math.max(value, 0), 99);
                      handleInputChange('numeroDependientes', limitedValue);
                    }}
                    className="w-full pl-12 pr-4 py-3 lg:py-4 border border-gray-300 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-base lg:text-lg font-medium"
                    placeholder="0"
                    min="0"
                    max="99"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Descuento: {formatCurrency(inputs.numeroDependientes * TAX_CONFIG.descuentoPorDependiente)} (RD$ {TAX_CONFIG.descuentoPorDependiente.toLocaleString()} por dependiente)
                </p>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={handleClearAll}
                  disabled={inputs.totalIngresos === 0 && inputs.numeroDependientes === 0}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Limpiar Todo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl shadow-xl p-4 lg:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <TrendingUp className="w-6 h-6 text-green-600 mr-3" />
                <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">
                  Resultados del Cálculo
                </h2>
              </div>
              <button
                onClick={handleExport}
                disabled={inputs.totalIngresos === 0}
                className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {/* Net Salary - Made smaller */}
              <div className="p-3 lg:p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-white" />
                    <div>
                      <h3 className="text-sm lg:text-base font-semibold">Monto Neto a Cobrar</h3>
                      <p className="text-green-100 text-xs">Salario después de impuestos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base lg:text-xl font-bold">
                      {formatCurrency(results.cobro.value)}
                    </span>
                    <p className="text-green-100 text-xs mt-1">Mensual</p>
                  </div>
                </div>
              </div>

              {/* Other Results */}
              {[
                { key: 'isr', item: results.isr },
                { key: 'imponible', item: results.imponible }
              ].map(({ key, item }) => (
                <div key={key} className={`p-3 rounded-xl border transition-all duration-200 hover:shadow-md ${
                  key === 'isr' ? 'bg-red-50 border-red-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-base">
                        {key === 'isr' ? '📊' : '💰'}
                      </span>
                      <span className="font-medium text-gray-800 text-sm lg:text-base">{item.name}</span>
                    </div>
                    <span className={`text-sm lg:text-base font-bold ${
                      key === 'isr' ? 'text-red-700' :
                      'text-blue-700'
                    }`}>
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                </div>
              ))}

              {/* TSS with expandable details */}
              <div className="space-y-2">
                <div
                  className="p-3 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer bg-orange-50 border-orange-200"
                  onClick={() => setIsTssExpanded(!isTssExpanded)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-base">🏥</span>
                      <span className="font-medium text-gray-800 text-sm lg:text-base">{results.tss.name}</span>
                      {isTssExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    <span className="text-sm lg:text-base font-bold text-orange-700">
                      {formatCurrency(results.tss.value)}
                    </span>
                  </div>
                </div>
                
                {/* TSS Breakdown */}
                {isTssExpanded && (
                  <div className="ml-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                    {[
                      { key: 'afp', item: results.afp, icon: '🏦' },
                      { key: 'sfs', item: results.sfs, icon: '🏥' },
                      { key: 'percapita', item: results.percapita, icon: '👥' }
                    ].map(({ key, item, icon }) => (
                      <div
                        key={key}
                        className="p-3 rounded-lg border border-gray-200 bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{icon}</span>
                            <span className="text-sm font-medium text-gray-700">
                              {item.name}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-gray-600">
                            {formatCurrency(item.value)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Total Deductions */}
              <div className="p-3 rounded-xl border transition-all duration-200 bg-gray-100 border-gray-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-base">📉</span>
                    <span className="font-medium text-gray-800 text-sm lg:text-base">Total Descuentos</span>
                  </div>
                  <span className="text-sm lg:text-base font-bold text-gray-800">
                    {formatCurrency(results.isr.value + results.tss.value)}
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-4 p-3 lg:p-4 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl text-white">
                <h3 className="text-sm lg:text-base font-semibold mb-3">Resumen del Cálculo</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs lg:text-sm">
                  <div>
                    <p className="opacity-90">Total Descuentos:</p>
                    <p className="text-base lg:text-lg font-bold">
                      {formatCurrency(results.isr.value + results.tss.value)}
                    </p>
                  </div>
                  <div>
                    <p className="opacity-90">Porcentaje Descuentos:</p>
                    <p className="text-base lg:text-lg font-bold">
                      {results.cobro.value > 0 
                        ? `${(((results.isr.value + results.tss.value) / (results.cobro.value + results.isr.value + results.tss.value)) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Information */}
        <div className="max-w-4xl mx-auto mt-6 lg:mt-8 bg-white rounded-2xl shadow-xl p-4 lg:p-6 border border-gray-100">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">
            📋 Información sobre las Escalas de ISR
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Escalas de Impuesto (Anuales)
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-xs sm:text-sm text-gray-700">RD$ 0 - RD$ {TAX_CONFIG.escala1Hasta.toLocaleString()}</span>
                  <span className="font-semibold text-green-600">0%</span>
                </div>
                <div className="flex justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-xs sm:text-sm text-gray-700">RD$ {(TAX_CONFIG.escala1Hasta + 0.01).toLocaleString()} - RD$ {TAX_CONFIG.escala2Hasta.toLocaleString()}</span>
                  <span className="font-semibold text-yellow-600">{(TAX_CONFIG.escala2Porciento * 100)}%</span>
                </div>
                <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-xs sm:text-sm text-gray-700">RD$ {(TAX_CONFIG.escala2Hasta + 0.01).toLocaleString()} - RD$ {TAX_CONFIG.escala3Hasta.toLocaleString()}</span>
                  <span className="font-semibold text-orange-600">{(TAX_CONFIG.escala3Porciento * 100)}%</span>
                </div>
                <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-xs sm:text-sm text-gray-700">Más de RD$ {TAX_CONFIG.escala3Hasta.toLocaleString()}</span>
                  <span className="font-semibold text-red-600">{(TAX_CONFIG.escala4Porciento * 100)}%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Contribuciones TSS
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">AFP (Pensiones)</span>
                  <span className="font-semibold text-blue-600">{TAX_CONFIG.afpPorciento}%</span>
                </div>
                <div className="flex justify-between p-3 bg-indigo-50 rounded-lg">
                  <span className="text-gray-700">SFS (Salud)</span>
                  <span className="font-semibold text-indigo-600">{TAX_CONFIG.sfsPorciento}%</span>
                </div>
                <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-700">Descuento por Dependiente</span>
                  <span className="font-semibold text-purple-600">RD$ {TAX_CONFIG.descuentoPorDependiente.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 lg:mt-8 text-gray-500">
          <p className="text-sm">
            Calculadora basada en las escalas vigentes de la DGII (Enero 2025)
          </p>
          <p className="text-xs mt-2">
            Esta herramienta es solo para fines informativos. Consulte con un profesional para asesoría fiscal específica.
          </p>
        </div>
      </div>
    </div>
  );
}