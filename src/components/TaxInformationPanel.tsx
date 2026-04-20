import React from 'react';
import { FileText } from 'lucide-react';
import { TAX_CONFIG } from '../config/taxConfig';

export function TaxInformationPanel() {
  return (
    <div className="max-w-4xl mx-auto mt-8 lg:mt-12 bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
      <div className="flex items-center mb-6">
        <FileText className="w-6 h-6 text-purple-600 mr-3" />
        <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">
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
              <span className="text-xs sm:text-sm">RD$ 0 - RD$ {TAX_CONFIG.escala1Hasta.toLocaleString()}</span>
              <span className="font-semibold text-green-600">0%</span>
            </div>
            <div className="flex justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-xs sm:text-sm">RD$ {(TAX_CONFIG.escala1Hasta + 0.01).toLocaleString()} - RD$ {TAX_CONFIG.escala2Hasta.toLocaleString()}</span>
              <span className="font-semibold text-yellow-600">{(TAX_CONFIG.escala2Porciento * 100)}%</span>
            </div>
            <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-xs sm:text-sm">RD$ {(TAX_CONFIG.escala2Hasta + 0.01).toLocaleString()} - RD$ {TAX_CONFIG.escala3Hasta.toLocaleString()}</span>
              <span className="font-semibold text-orange-600">{(TAX_CONFIG.escala3Porciento * 100)}%</span>
            </div>
            <div className="flex justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-xs sm:text-sm">Más de RD$ {TAX_CONFIG.escala3Hasta.toLocaleString()}</span>
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
  );
}