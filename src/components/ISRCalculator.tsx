import React, { useState, useCallback } from 'react';
import { Calculator, DollarSign, TrendingUp } from 'lucide-react';
import { CalculationInputs } from '../types/isr';
import { useISRCalculation } from '../hooks/useISRCalculation';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ResultsDisplay } from './ResultsDisplay';
import { InputForm } from './InputForm';
import { TaxInformationPanel } from './TaxInformationPanel';
import { ErrorBoundary } from './ErrorBoundary';

const STORAGE_KEY = 'isr-calculator-inputs';

export function ISRCalculator() {
  const [storedInputs, setStoredInputs] = useLocalStorage<CalculationInputs>(STORAGE_KEY, {
    totalIngresos: 0,
    numeroDependientes: 0
  });

  const [inputs, setInputs] = useState<CalculationInputs>(storedInputs);

  const { results, isValid, error } = useISRCalculation(inputs);

  const handleInputChange = useCallback((field: keyof CalculationInputs, value: number) => {
    const newInputs = {
      ...inputs,
      [field]: value
    };
    setInputs(newInputs);
    setStoredInputs(newInputs);
  }, [inputs, setStoredInputs]);

  const handleClearAll = useCallback(() => {
    const clearedInputs = {
      totalIngresos: 0,
      numeroDependientes: 0
    };
    setInputs(clearedInputs);
    setStoredInputs(clearedInputs);
  }, [setStoredInputs]);

  const handleExport = useCallback(() => {
    // Simple text export for now
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
Porcentaje Descuentos: ${results.imponible.value > 0 
  ? `${(((results.isr.value + results.tss.value) / (results.cobro.value + results.isr.value + results.tss.value)) * 100).toFixed(1)}%`
  : '0%'
}

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
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="flex items-center justify-center mb-4 lg:mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-red-600 p-3 lg:p-4 rounded-2xl shadow-lg">
                <Calculator className="w-8 lg:w-12 h-8 lg:h-12 text-white" />
              </div>
            </div>
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">
              Calculadora ISR República Dominicana
            </h1>
            <p className="text-base lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Calcula tu Impuesto Sobre la Renta, TSS, AFP, SFS y monto neto a cobrar
              según las escalas vigentes de la DGII
            </p>
          </div>

          {error && (
            <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-center">{error}</p>
            </div>
          )}

          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Input Form */}
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <DollarSign className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">
                  Datos de Entrada
                </h2>
              </div>
              
              <InputForm
                inputs={inputs}
                onInputChange={handleInputChange}
                onClearAll={handleClearAll}
                isCalculating={false}
              />
            </div>

            {/* Results */}
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <TrendingUp className="w-6 h-6 text-green-600 mr-3" />
                <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">
                  Resultados del Cálculo
                </h2>
              </div>
              
              <ResultsDisplay 
                results={results} 
                isCalculating={false}
                onExport={handleExport}
              />
            </div>
          </div>

          {/* Tax Information */}
          <TaxInformationPanel />

          {/* Footer */}
          <div className="text-center mt-8 lg:mt-12 text-gray-500">
            <p className="text-sm">
              Calculadora basada en las escalas vigentes de la DGII (Enero 2025)
            </p>
            <p className="text-xs mt-2">
              Esta herramienta es solo para fines informativos. Consulte con un profesional para asesoría fiscal específica.
            </p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}