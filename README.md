
# 🛠️ OmniFix AI - Suite Avanzada de Soporte Técnico

![Versión](https://img.shields.io/badge/Versi%C3%B3n-2.5.0--STABLE-indigo)
![Motor IA](https://img.shields.io/badge/Motor--IA-Gemini--3--Pro-blue)
![Entorno](https://img.shields.io/badge/Entorno-Windows--Desktop-emerald)

**OmniFix AI** es una plataforma integral de diagnóstico y reparación de equipos informáticos que fusiona las herramientas clásicas de soporte técnico (como las encontradas en Medicat o Hiren's Boot) con la potencia de razonamiento de la Inteligencia Artificial de Google.

Esta herramienta está diseñada para técnicos que buscan profesionalizar su flujo de trabajo, ofreciendo desde simulaciones de hardware hasta generación de reportes forenses para clientes.


## 🚀 Funcionalidades Principales

### 1. 🖥️ Tablero de Telemetría Real
Visualiza el estado de salud del sistema mediante gráficos de carga de CPU, RAM, temperatura y actividad de disco. Ideal para monitorear la estabilidad durante pruebas de estrés.

### 2. 🔍 Escaneo Profundo (Deep Engine V3)
Un terminal avanzado que simula un análisis granular de:

### 3. 🧪 Security Lab & Script Center
Genera soluciones automatizadas personalizadas:

### 4. 🧰 Toolbox con Simulación Virtual
Base de datos con las mejores herramientas del mercado (MemTest86+, CrystalDiskInfo, DDU, etc.):

### 5. 💿 Librería ISO de Rescate
Gestión de imágenes de sistema:


## 🛠️ Stack Tecnológico



## 📦 Cómo convertir a Ejecutable (.exe)

Para usar OmniFix AI como una herramienta nativa de Windows en tu taller:

1. **Instala Nativefier:**
   ```bash
   npm install -g nativefier
   ```
2. **Genera el ejecutable:**
   ```bash
   nativefier "URL_DE_TU_APP" --name "OmniFix AI" --platform "windows" --icon "app.ico" --internal-urls ".*"
   ```
3. **Distribución:** Copia la carpeta resultante en tu USB de herramientas y ejecútalo como Administrador.


## 🛡️ Protocolo de Uso Profesional

1. **Análisis:** Utilice siempre el *Escaneo Profundo* para obtener una base técnica antes de intervenir.
2. **Validación:** Revise el código de los scripts generados en el *Script Center* antes de su ejecución.
3. **Reportes:** Utilice la función de *Exportar Reporte* para mantener una transparencia total con sus clientes sobre los fallos detectados.


## 📄 Licencia y Responsabilidad

OmniFix AI es una herramienta de asistencia. El desarrollador no se hace responsable por daños derivados del uso de comandos generados por la IA sin supervisión técnica. **Realice siempre un respaldo de datos antes de cualquier reparación.**

*Desarrollado para la nueva generación de técnicos de soporte informático.*


Suite avanzada de diagnóstico, análisis y recuperación para PC, con integración de IA y herramientas forenses.

## Tecnologías principales

- **Frontend:** React, TypeScript, Vite
- **UI:** Lucide React, Recharts
- **Backend/Integración:** Python (pywebview)
- **IA:** Google GenAI

## Características
- Diagnóstico y análisis de hardware/software
- Recuperación de datos
- Laboratorio de seguridad y herramientas forenses
- Integración multiplataforma (web y escritorio)
- Interfaz moderna y responsiva

## Instalación y uso

### Requisitos
- Node.js >= 18
- Python >= 3.10
- Entorno virtual Python (recomendado)

### Instalación

1. Clona el repositorio:
   ```sh
   git clone https://github.com/tuusuario/omnifix-ai.git
   cd omnifix-ai
   ```
2. Instala dependencias frontend:
   ```sh
   npm install
   ```
3. Instala dependencias Python:
   ```sh
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   pip install pywebview
   ```
4. Inicia la app:
   ```sh
   npm run dev
   # En otra terminal:
   python main.py
   ```

O usa el script `Iniciar_Omnifix.bat` para automatizar el proceso en Windows.

## Scripts útiles
- `npm run dev` — Inicia el frontend en modo desarrollo
- `npm run build` — Compila la app para producción
- `python main.py` — Lanza la interfaz nativa

## Estructura del proyecto
- `/components` — Componentes React
- `main.py` — Lanzador Python/pywebview
- `Iniciar_Omnifix.bat` — Script de inicio rápido

## Badges
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E)

## Licencia
MIT

---
Desarrollado por Nacho. Para soporte o contribuciones, abre un issue o pull request.
