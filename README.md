# Calculadora ISR República Dominicana

Una calculadora moderna y accesible para calcular el Impuesto Sobre la Renta (ISR), TSS, AFP, SFS y el monto neto a cobrar según las escalas vigentes de la DGII en República Dominicana.

## 🚀 Características

- **Cálculo automático** de ISR, TSS, AFP, SFS y monto neto
- **Interfaz responsive** optimizada para móviles y escritorio
- **Validación inteligente** de datos de entrada
- **Exportación** de resultados en formato texto
- **Persistencia** de datos entre sesiones
- **Accesibilidad completa** con soporte para lectores de pantalla
- **Error handling** robusto con boundaries
- **Testing** completo con Vitest

## 🛠️ Instalación y Ejecución

### Opción 1: Desarrollo Local

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

# Previsualizar build de producción
npm run preview
```

### Opción 2: Docker (Recomendado)

#### Usando Docker Compose (Más fácil)

```bash
# Clonar el repositorio
git clone <repository-url>
cd isrdom

# Ejecutar en producción
docker-compose up

# Ejecutar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener los contenedores
docker-compose down
```

**Para desarrollo con hot-reload:**
```bash
# Ejecutar en modo desarrollo
docker-compose --profile dev up isr-calculator-dev

# En segundo plano
docker-compose --profile dev up -d isr-calculator-dev
```

**URLs disponibles:**
- **Producción**: http://localhost:3000
- **Desarrollo**: http://localhost:3001

#### Usando Docker directamente

**Producción:**
```bash
# Construir la imagen
docker build -t isr-calculator .

# Ejecutar el contenedor
docker run -p 3000:80 isr-calculator

# Ejecutar en segundo plano con nombre
docker run -d -p 3000:80 --name isr-app isr-calculator

# Ver logs
docker logs -f isr-app

# Detener y eliminar
docker stop isr-app && docker rm isr-app
```

**Desarrollo:**
```bash
# Construir imagen de desarrollo
docker build -f Dockerfile.dev -t isr-calculator-dev .

# Ejecutar con volumen para hot-reload
docker run -p 3001:5173 -v $(pwd):/app -v /app/node_modules isr-calculator-dev
```

#### Comandos útiles de Docker

```bash
# Ver contenedores en ejecución
docker ps

# Ver todas las imágenes
docker images

# Limpiar contenedores parados
docker container prune

# Limpiar imágenes no utilizadas
docker image prune

# Reconstruir sin cache
docker-compose build --no-cache

# Ver uso de recursos
docker stats
```

### Testing

```bash
# Ejecutar todas las pruebas
npm run test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:coverage

# Ejecutar pruebas con interfaz visual
npm run test:ui
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

El proyecto incluye pruebas unitarias completas para garantizar la precisión de los cálculos:

```bash
# Ejecutar todas las pruebas
npm run test

# Ejecutar pruebas específicas
npm run test -- --grep "ISR Calculator"

# Ver cobertura de código
npm run test:coverage

# Interfaz visual para pruebas
npm run test:ui
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