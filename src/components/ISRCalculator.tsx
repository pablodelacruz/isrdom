import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, FileText, TrendingUp } from 'lucide-react';
import { ISRData, CalculationInputs } from '../types/isr';
import { createInitialData, calculoIsrRd, TAX_CONFIG } from '../utils/isrCalculator';
import { ResultsDisplay } from './ResultsDisplay';
import { InputForm } from './InputForm';

export function ISRCalculator() {
  const [inputs, setInputs] = useState<CalculationInputs>({
    totalIngresos: 0,
    numeroDependientes: 0
  });
  
  const [results, setResults] = useState<ISRData>(createInitialData());
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
      const bodyData = createInitialData();
      const calculatedResults = calculoIsrRd(
        bodyData,
        inputs.totalIngresos,
        0,
        inputs.numeroDependientes
      );
      setResults(calculatedResults);
      setIsCalculating(false);
    }, 300);
  };

  useEffect(() => {
    handleCalculate();
  }, [inputs]);

  const handleInputChange = (field: keyof CalculationInputs, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-red-600 p-4 rounded-2xl shadow-lg">
              <Calculator className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Calculadora ISR República Dominicana
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calcula tu Impuesto Sobre la Renta, TSS, AFP, SFS y monto neto a cobrar
            según las escalas vigentes de la DGII
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <DollarSign className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Datos de Entrada
              </h2>
            </div>
            
            <InputForm
              inputs={inputs}
              onInputChange={handleInputChange}
              isCalculating={isCalculating}
            />
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Resultados del Cálculo
              </h2>
            </div>
            
            <ResultsDisplay results={results} isCalculating={isCalculating} />
          </div>
        </div>

        {/* Tax Information */}
        <div className="max-w-4xl mx-auto mt-12 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <FileText className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Información sobre las Escalas de ISR
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Escalas de Impuesto (Anuales)
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                  <span>RD$ 0 - RD$ {TAX_CONFIG.escala1Hasta.toLocaleString()}</span>
                  <span className="font-semibold text-green-600">0%</span>
                </div>
                <div className="flex justify-between p-3 bg-yellow-50 rounded-lg">
                  <span>RD$ {(TAX_CONFIG.escala1Hasta + 0.01).toLocaleString()} - RD$ {TAX_CONFIG.escala2Hasta.toLocaleString()}</span>
                  <span className="font-semibold text-yellow-600">{(TAX_CONFIG.escala2Porciento * 100)}%</span>
                </div>
                <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                  <span>RD$ {(TAX_CONFIG.escala2Hasta + 0.01).toLocaleString()} - RD$ {TAX_CONFIG.escala3Hasta.toLocaleString()}</span>
                  <span className="font-semibold text-orange-600">{(TAX_CONFIG.escala3Porciento * 100)}%</span>
                </div>
                <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                  <span>Más de RD$ {TAX_CONFIG.escala3Hasta.toLocaleString()}</span>
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
                  <span>AFP (Pensiones)</span>
                  <span className="font-semibold text-blue-600">{TAX_CONFIG.afpPorciento}%</span>
                </div>
                <div className="flex justify-between p-3 bg-indigo-50 rounded-lg">
                  <span>SFS (Salud)</span>
                  <span className="font-semibold text-indigo-600">{TAX_CONFIG.sfsPorciento}%</span>
                </div>
                <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                  <span>Descuento por Dependiente</span>
                  <span className="font-semibold text-purple-600">RD$ {TAX_CONFIG.descuentoPorDependiente.toLocaleString()}</span>
                </div>
                <div className="text-xs text-gray-500 mt-3 p-3 bg-gray-50 rounded-lg">
                  <p><strong>Topes de cotización:</strong></p>
                  <p>• AFP: RD$ {(TAX_CONFIG.salarioMinimoCotizable * TAX_CONFIG.topeAfpMultiplier).toLocaleString()} ({TAX_CONFIG.topeAfpMultiplier} salarios mínimos)</p>
                  <p>• SFS: RD$ {(TAX_CONFIG.salarioMinimoCotizable * TAX_CONFIG.topeSfsMultiplier).toLocaleString()} ({TAX_CONFIG.topeSfsMultiplier} salarios mínimos)</p>
                  <p>• Salario mínimo cotizable: RD$ {TAX_CONFIG.salarioMinimoCotizable.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
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