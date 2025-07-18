import React from 'react';
import { useState } from 'react';
import { ISRData } from '../types/isr';
import { TrendingDown, TrendingUp, Minus, Plus, ChevronDown, ChevronRight } from 'lucide-react';

interface ResultsDisplayProps {
  results: ISRData;
  isCalculating: boolean;
}

export function ResultsDisplay({ results, isCalculating }: ResultsDisplayProps) {
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
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'isr':
      case 'tss':
      case 'afp':
      case 'sfs':
      case 'percapita':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      case 'imponible':
        return <Minus className="w-5 h-5 text-blue-600" />;
      default:
        return <Plus className="w-5 h-5 text-gray-600" />;
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

  return (
    <div className="space-y-4">
      {/* Monto A Cobrar - Prominent Summary Card */}
      <div className="p-6 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-white" />
            <div>
              <h3 className="text-lg font-semibold">Monto Neto a Cobrar</h3>
              <p className="text-green-100 text-sm">Salario después de impuestos y descuentos</p>
            </div>
          </div>
          <div className="text-right">
            {isCalculating ? (
              <div className="animate-pulse bg-green-400 h-8 w-32 rounded"></div>
            ) : (
              <div>
                <span className="text-3xl font-bold">
                  {formatCurrency(results.cobro.value)}
                </span>
                <p className="text-green-100 text-sm mt-1">
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
                className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer ${getCardStyle(key)}`}
                onClick={() => setIsTssExpanded(!isTssExpanded)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getIcon(key)}
                    <span className="font-medium text-gray-800">
                      {item.name}
                    </span>
                    {isTssExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <div className="text-right">
                    {isCalculating ? (
                      <div className="animate-pulse bg-gray-300 h-6 w-24 rounded"></div>
                    ) : (
                      <span className="text-lg font-bold text-gray-700">
                        {formatCurrency(item.value)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* TSS Breakdown */}
              {isTssExpanded && (
                <div className="ml-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                  {['afp', 'sfs', 'percapita'].map((subKey) => {
                    const subItem = results[subKey as keyof ISRData];
                    return (
                      <div
                        key={subKey}
                        className="p-3 rounded-lg border border-gray-200 bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-700">
                              {subItem.name}
                            </span>
                          </div>
                          <div className="text-right">
                            {isCalculating ? (
                              <div className="animate-pulse bg-gray-300 h-5 w-20 rounded"></div>
                            ) : (
                              <span className="text-sm font-semibold text-gray-600">
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
                  <div className="animate-pulse bg-gray-300 h-6 w-24 rounded"></div>
                ) : (
                  <span className={`text-lg font-bold ${
                    key === 'cobro' ? 'text-green-700' : 
                    key === 'isr' ? 'text-red-700' : 
                    'text-gray-700'
                  }`}>
                    {formatCurrency(item.value)}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Summary Card */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
        <h3 className="text-lg font-semibold mb-4">Resumen del Cálculo</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="opacity-90">Total Descuentos:</p>
            <p className="text-xl font-bold">
              {formatCurrency(results.isr.value + results.tss.value)}
            </p>
          </div>
          <div>
            <p className="opacity-90">Porcentaje Descuentos:</p>
            <p className="text-xl font-bold">
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