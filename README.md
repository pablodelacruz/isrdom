# ISR DOM - Calculadora de ISR México 🇲🇽

¡Bienvenido a **ISR DOM**! Esta es una aplicación web moderna desarrollada con React, Vite y Tailwind CSS para calcular el Impuesto Sobre la Renta (ISR) en la Republica Dominicana de manera rápida, sencilla y visual.

## 🚀 Características

- **Cálculo automático** del ISR mensual y anual según los parámetros oficiales.
- Interfaz intuitiva y responsiva.
- Resultados claros y desglosados.
- 100% en español.
- Desplegable fácilmente con Docker y Docker Compose.

## 🖥️ Demo Rápida

Puedes ejecutar la app localmente o en un contenedor Docker.

### 1. Clonar el repositorio

```bash
git clone https://github.com/tuusuario/isrdom.git
cd isrdom
```

### 2. Ejecutar con Docker Compose

Asegúrate de tener Docker y Docker Compose instalados.

```bash
docker-compose up --build
```

Luego abre tu navegador en [http://localhost:8080](http://localhost:8080)

### 3. Ejecutar localmente (opcional)

```bash
npm install
npm run dev
```

## 📝 Uso

1. Ingresa tu salario mensual o anual.
2. Haz clic en "Calcular".
3. Visualiza el desglose de tu ISR y tu salario neto.

## 📦 Estructura del Proyecto

```
├── src/
│   ├── components/         # Componentes React reutilizables
│   ├── types/              # Tipos TypeScript
│   ├── utils/              # Lógica de cálculo ISR
│   ├── App.tsx             # Componente principal
│   └── main.tsx            # Punto de entrada
├── public/                 # Archivos estáticos
├── Dockerfile              # Imagen Docker de producción
├── docker-compose.yml      # Orquestación de contenedores
├── package.json            # Dependencias y scripts
└── ...
```

## 🛠️ Tecnologías

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Docker](https://www.docker.com/)
- [Nginx](https://www.nginx.com/)

## 📄 Licencia

MIT. ¡Úsalo, modifícalo y comparte libremente!

---

> Hecho con ❤️ para facilitar el cálculo de impuestos en México.
