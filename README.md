# Calculadora ISR República Dominicana

Una calculadora moderna y accesible construida con **Astro** para calcular el Impuesto Sobre la Renta (ISR), TSS, AFP, SFS y el monto neto a cobrar según las escalas vigentes de la DGII en República Dominicana.

## 🚀 Características

- **Cálculo automático** de ISR, TSS, AFP, SFS y monto neto
- **Tema claro/oscuro** con persistencia en localStorage
- **Interfaz responsive** optimizada para móviles y escritorio
- **Validación inteligente** de datos de entrada
- **Exportación** de resultados en formato texto
- **Rendimiento optimizado** con Astro (sitio estático)
- **Accesibilidad completa** con soporte para lectores de pantalla
- **Diseño moderno** con Tailwind CSS

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

#### Usando Docker Compose

```bash
# Clonar el repositorio
git clone <repository-url>
cd isrdom

# Ejecutar la aplicación
docker compose up

# Ejecutar en segundo plano
docker compose up -d

# Ver logs
docker compose logs -f

# Detener los contenedores
docker compose down
```

La aplicación estará disponible en: **http://localhost:3000**

#### Usando Docker directamente

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

#### Comandos útiles de Docker

```bash
# Ver contenedores en ejecución
docker ps

# Reconstruir la imagen
docker compose build --no-cache

# Limpiar contenedores parados
docker container prune

# Ver uso de recursos
docker stats
```

### Testing

```bash
# El proyecto Astro no incluye testing por defecto
# Para agregar testing, instalar Vitest:
npm install -D vitest @vitest/ui jsdom @testing-library/react

# Luego ejecutar:
npm run test
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
   - **Tema**: Alterna entre modo claro y oscuro
   - **Exportar**: Descarga los resultados en formato texto
   - **Limpiar**: Resetea todos los campos

## 🏗️ Arquitectura

```
src/
├── components/          # Componentes React
│   ├── ISRCalculator.tsx
│   └── ThemeToggle.tsx
├── layouts/            # Layouts de Astro
│   └── Layout.astro
├── pages/              # Páginas de Astro
│   └── index.astro
└── styles/             # Estilos globales
    └── global.css
```

## 🎯 Características Técnicas

- **Astro 4.0** para sitios estáticos optimizados
- **React 18** para componentes interactivos
- **Tailwind CSS** para estilos con tema claro/oscuro
- **TypeScript** para type safety
- **Lucide React** para iconos
- **Build optimizado** con tree-shaking automático

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