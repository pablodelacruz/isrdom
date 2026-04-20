import React from 'react';
import { useState } from 'react';
import { ISRData } from '../types/isr';
import { TrendingDown, TrendingUp, Minus, Plus, ChevronDown, ChevronRight, Download } from 'lucide-react';

interface ResultsDisplayProps {
  results: ISRData;
  isCalculating: boolean;
  onExport?: () => void;
}

export function ResultsDisplay({ results, isCalculating, onExport }: ResultsDisplayProps) {
  const [isTssExpanded, setIsTssExpanded] = useState(false);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2
    }).format(value);
  };

  const getIcon = (key: string) => {
    switch (key) {
      case 'cobro':
        return <TrendingUp className="w-5 h-5 text-green-600" aria-hidden="true" />;
      case 'isr':
      case 'tss':
      case 'afp':
      case 'sfs':
      case 'percapita':
        return <TrendingDown className="w-5 h-5 text-red-600" aria-hidden="true" />;
      case 'imponible':
        return <Minus className="w-5 h-5 text-blue-600" aria-hidden="true" />;
      default:
        return <Plus className="w-5 h-5 text-gray-600" aria-hidden="true" />;
    }
  };

  const getCardStyle = (key: string) => {
    switch (key) {
      case 'cobro':
        return 'bg-gradient-to-r from-green-50 to-green-100 border-green-200';
      case 'isr':
        return 'bg-gradient-to-r from-red-50 to-red-100 border-red-200';
      case 'tss':
        return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200';
      case 'imponible':
        return 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200';
      default:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
    }
  };

  const resultOrder = ['cobro', 'isr', 'imponible', 'tss'];

  const handleTssToggle = () => {
    setIsTssExpanded(!isTssExpanded);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTssToggle();
    }
  };

  return (
    <div className="space-y-4">
      {/* Export Button */}
      {onExport && (
        <div className="flex justify-end">
          <button
            onClick={onExport}
            disabled={isCalculating}
            className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Exportar resultados"
          >
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      )}

      {/* Monto A Cobrar - Prominent Summary Card */}
      <div className="p-4 lg:p-6 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-6 lg:w-8 h-6 lg:h-8 text-white" aria-hidden="true" />
            <div>
              <h3 className="text-base lg:text-lg font-semibold">Monto Neto a Cobrar</h3>
              <p className="text-green-100 text-xs lg:text-sm">Salario después de impuestos y descuentos</p>
            </div>
          </div>
          <div className="text-right">
            {isCalculating ? (
              <div className="animate-pulse bg-green-400 h-6 lg:h-8 w-24 lg:w-32 rounded" aria-label="Calculando"></div>
            ) : (
              <div>
                <span className="text-xl lg:text-3xl font-bold" aria-label={`Monto neto a cobrar: ${formatCurrency(results.cobro.value)}`}>
                  {formatCurrency(results.cobro.value)}
                </span>
                <p className="text-green-100 text-xs lg:text-sm mt-1">
                  Mensual
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Other Results */}
      {resultOrder.filter(key => key !== 'cobro').map((key) => {
        const item = results[key as keyof ISRData];
        
        if (key === 'tss') {
          return (
            <div key={key} className="space-y-2">
              <div
                className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${getCardStyle(key)}`}
                onClick={handleTssToggle}
                onKeyDown={handleKeyDown}
                role="button"
                tabIndex={0}
                aria-expanded={isTssExpanded}
                aria-controls="tss-breakdown"
                aria-label={`${item.name}: ${formatCurrency(item.value)}. ${isTssExpanded ? 'Contraer' : 'Expandir'} detalles`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getIcon(key)}
                    <span className="font-medium text-gray-800">
                      {item.name}
                    </span>
                    {isTssExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" aria-hidden="true" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" aria-hidden="true" />
                    )}
                  </div>
                  <div className="text-right">
                    {isCalculating ? (
                      <div className="animate-pulse bg-gray-300 h-6 w-24 rounded" aria-label="Calculando"></div>
                    ) : (
                      <span className="text-base lg:text-lg font-bold text-gray-700">
                        {formatCurrency(item.value)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* TSS Breakdown */}
              {isTssExpanded && (
                <div 
                  id="tss-breakdown"
                  className="ml-4 space-y-2 animate-in slide-in-from-top-2 duration-200"
                  role="region"
                  aria-label="Desglose de TSS"
                >
                  {['afp', 'sfs', 'percapita'].map((subKey) => {
                    const subItem = results[subKey as keyof ISRData];
                    return (
                      <div
                        key={subKey}
                        className="p-3 rounded-lg border border-gray-200 bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full" aria-hidden="true"></div>
                            <span className="text-sm font-medium text-gray-700">
                              {subItem.name}
                            </span>
                          </div>
                          <div className="text-right">
                            {isCalculating ? (
                              <div className="animate-pulse bg-gray-300 h-5 w-20 rounded" aria-label="Calculando"></div>
                            ) : (
                              <span className="text-sm font-semibold text-gray-600" aria-label={`${subItem.name}: ${formatCurrency(subItem.value)}`}>
                                {formatCurrency(subItem.value)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }
        
        return (
          <div
            key={key}
            className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${getCardStyle(key)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getIcon(key)}
                <span className="font-medium text-gray-800">
                  {item.name}
                </span>
              </div>
              <div className="text-right">
                {isCalculating ? (
                  <div className="animate-pulse bg-gray-300 h-6 w-24 rounded" aria-label="Calculando"></div>
                ) : (
                  <span className={`text-base lg:text-lg font-bold ${
                    key === 'cobro' ? 'text-green-700' : 
                    key === 'isr' ? 'text-red-700' : 
                    'text-gray-700'
                  }`} aria-label={`${item.name}: ${formatCurrency(item.value)}`}>
                    {formatCurrency(item.value)}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Summary Card */}
      <div className="mt-8 p-4 lg:p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
        <h3 className="text-base lg:text-lg font-semibold mb-4">Resumen del Cálculo</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="opacity-90">Total Descuentos:</p>
            <p className="text-lg lg:text-xl font-bold" aria-label={`Total de descuentos: ${formatCurrency(results.isr.value + results.tss.value)}`}>
              {formatCurrency(results.isr.value + results.tss.value)}
            </p>
          </div>
          <div>
            <p className="opacity-90">Porcentaje Descuentos:</p>
            <p className="text-lg lg:text-xl font-bold" aria-label={`Porcentaje de descuentos: ${results.imponible.value > 0 
                ? `${(((results.isr.value + results.tss.value) / (results.cobro.value + results.isr.value + results.tss.value)) * 100).toFixed(1)}%`
                : '0%'
              }`}>
              {results.imponible.value > 0 
                ? `${(((results.isr.value + results.tss.value) / (results.cobro.value + results.isr.value + results.tss.value)) * 100).toFixed(1)}%`
                : '0%'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}