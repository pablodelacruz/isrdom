# Calculadora ISR República Dominicana

Una calculadora moderna y accesible para calcular el Impuesto Sobre la Renta (ISR), TSS, AFP, SFS y el monto neto a cobrar según las escalas vigentes de la DGII en República Dominicana.

## 🚀 Características

### Mejoras Implementadas

#### **Calidad de Código y Arquitectura**
- ✅ **Optimización de Rendimiento**: Eliminado el delay artificial de 300ms, implementado memoización con `useMemo`
- ✅ **Validación y Manejo de Errores**: Validación robusta para casos extremos, sanitización de inputs, Error Boundaries
- ✅ **Organización del Código**: 
  - Componente `TaxInformationPanel` extraído
  - Custom hooks: `useISRCalculation`, `useInputFormatting`, `useLocalStorage`
  - Configuración centralizada en `src/config/taxConfig.ts`

#### **Experiencia de Usuario**
- ✅ **Funciones Mejoradas**:
  - Botón "Limpiar Todo" para resetear inputs
  - Funcionalidad de exportación (formato texto)
  - Historial de cálculos con localStorage
  - Cálculos inteligentes (solo cuando hay salario válido)

- ✅ **Mejor Experiencia Móvil**:
  - Diseño responsive mejorado
  - Controles táctiles optimizados
  - Enfoque mobile-first

- ✅ **Accesibilidad**:
  - Etiquetas ARIA apropiadas
  - Navegación por teclado mejorada
  - Soporte para lectores de pantalla
  - Gestión de foco

#### **Mejoras Técnicas**
- ✅ **Persistencia de Datos**: localStorage para recordar inputs entre sesiones
- ✅ **Testing**: Suite de pruebas unitarias con Vitest
- ✅ **TypeScript Estricto**: Configuración estricta habilitada

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd isrdom

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar pruebas
npm run test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:coverage
```

## 📱 Uso

1. **Ingresa tus datos**:
   - Ingresos totales mensuales
   - Número de dependientes

2. **Visualiza los resultados**:
   - Monto neto a cobrar
   - Desglose de ISR y TSS
   - Información detallada de descuentos

3. **Funciones adicionales**:
   - **Exportar**: Descarga los resultados en formato texto
   - **Limpiar**: Resetea todos los campos

## 🧪 Testing

El proyecto incluye pruebas unitarias completas:

```bash
# Ejecutar todas las pruebas
npm run test

# Ejecutar pruebas específicas
npm run test -- --grep "ISR Calculator"

# Ver cobertura de código
npm run test:coverage
```

## 🏗️ Arquitectura

```
src/
├── components/          # Componentes React
│   ├── ErrorBoundary.tsx
│   ├── InputForm.tsx
│   ├── ISRCalculator.tsx
│   ├── ResultsDisplay.tsx
│   └── TaxInformationPanel.tsx
├── config/             # Configuración
│   └── taxConfig.ts
├── hooks/              # Custom hooks
│   ├── useInputFormatting.ts
│   ├── useISRCalculation.ts
│   └── useLocalStorage.ts
├── types/              # Definiciones TypeScript
│   └── isr.ts
├── utils/              # Utilidades
│   ├── __tests__/      # Pruebas unitarias
│   └── isrCalculator.ts
└── test/               # Configuración de testing
    └── setup.ts
```

## 🎯 Características Técnicas

- **React 18** con TypeScript
- **Vite** para desarrollo y build
- **Tailwind CSS** para estilos
- **Vitest** para testing
- **Lucide React** para iconos
- **ESLint** para linting
- **Configuración TypeScript estricta**

## 📊 Escalas de ISR (2025)

- **RD$ 0 - RD$ 416,220**: 0%
- **RD$ 416,220.01 - RD$ 624,329**: 15%
- **RD$ 624,329.01 - RD$ 867,123**: 20%
- **Más de RD$ 867,123**: 25%

## 🔧 Configuración TSS

- **AFP**: 2.87% (tope: 20 salarios mínimos)
- **SFS**: 3.04% (tope: 10 salarios mínimos)
- **Descuento por dependiente**: RD$ 1,919.78
- **Salario mínimo cotizable**: RD$ 15,600

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## ⚠️ Disclaimer

Esta herramienta es solo para fines informativos. Para asesoría fiscal específica, consulte con un profesional contable o fiscal certificado.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.