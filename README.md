# SAT-UNEMI — Sistema de Alerta Temprana de Deserción Estudiantil

Aplicación web estática e interactiva para el monitoreo, análisis y predicción del riesgo de deserción estudiantil en la Universidad Estatal de Milagro (UNEMI), diseñada para apoyar la toma de decisiones de autoridades académicas.

🔗 **Demo en vivo:** https://evelyngarcia02.github.io/sat-unemi/

---

## Descripción general

El sistema traduce los resultados de un proceso de investigación de tres etapas (analítica descriptiva, modelos explicativos de supervivencia y modelos predictivos de machine learning) en un panel visual único, sin necesidad de conexión a base de datos ni backend. Es 100% estático: HTML + CSS + JavaScript, con los datos embebidos como archivos `.js`.

- **Cobertura de datos:** 69,709 inscripciones históricas, cohortes 1 a 10 (periodos 2019–2023).
- **Conjunto de prueba evaluado:** 28,375 estudiantes (cohortes 8, 9 y 10).
- **Modelo campeón:** Ensemble (Regresión Logística/Ridge + Random Forest + XGBoost), **AUC = 0.8461**, F1 = 0.6995, Brier = 0.1361.

---

## Secciones del sistema

| # | Página | Grupo de navegación | Contenido |
|---|---|---|---|
| 1 | **Panel de Control** | General | KPIs por zona de riesgo, distribución tipo donut, comparativa por facultad, tendencia por cohorte y tarjetas de insight dinámicas. |
| 2 | **Sistema de Alertas** | General | Tabla de 28,375 estudiantes con filtros, búsqueda y paginación, más panel de detalle individual. |
| 3 | **Factores de Riesgo** | Análisis | Forest Plot (Hazard Ratios), Efectos Marginales (AME) y ranking de importancia de variables del modelo Ensemble. |
| 4 | **Rendimiento del Modelo** | Análisis | Tabla comparativa de 4 modelos, curvas ROC y zonas de clasificación por umbral. |
| 5 | **Calculadora de Riesgo** | Herramientas | Formulario para estimar el riesgo individual de un estudiante → score → zona → acciones recomendadas. La modalidad de estudio se detecta automáticamente a partir de la carrera seleccionada. |
| 6 | **Permanencia** | Acreditación | Histórico de 69,709 inscripciones (cohortes 1–10) con filtros en cascada Facultad → Carrera → Cohorte, KPIs agregados, tabla con codificación de color por tasa de permanencia y exportación a CSV. |

### Zonas de riesgo (umbrales fijos 0.25 / 0.50)

| Zona | Estudiantes | % del total | Tasa real de deserción |
|---|---|---|---|
| 🔴 Alto | 6,898 | 24.3% | 83.9% |
| 🟠 Medio | 8,073 | 28.5% | 29.9% |
| 🟢 Bajo | 13,404 | 47.2% | 12.2% |

---

## Estructura del proyecto

```
sat_unemi/
├── index.html                  # Estructura HTML de las 6 páginas (SPA de una sola página)
├── css/
│   └── styles.css              # Paleta UNEMI, variables CSS, estilos responsivos
├── js/
│   ├── app.js                  # Lógica de la aplicación, gráficos (Chart.js), cross-filtering, navegación
│   ├── data.js                 # Datos agregados, KPIs, configuración de zonas y umbrales
│   ├── students_raw.js         # 28,375 registros individuales (generado automáticamente desde R)
│   ├── permanencia_data.js     # 315 filas agregadas por facultad/carrera/modalidad/cohorte
│   ├── chart.min.js            # Chart.js v4.4.0 (dependencia local, sin CDN)
│   └── lucide.min.js           # Iconografía base (uso mínimo; la mayoría de íconos son SVG inline)
└── README.md
```

El sistema funciona completamente offline: no requiere servidor, base de datos ni conexión a internet, salvo para el acceso inicial a la página publicada.

---

## Tecnologías

- **HTML5 / CSS3** puro, sin frameworks de UI.
- **JavaScript vanilla** (sin React/Vue/Angular).
- **Chart.js v4.4.0** para visualizaciones (barras, donut, líneas, dispersión para curvas ROC).
- **SVG inline** para toda la iconografía del sistema (sin emojis, sin Font Awesome).
- Datos generados y exportados desde **R** (pipeline de modelado en las etapas 1–3 del proyecto de investigación).

---

## Metodología y origen de los datos

Los datos provienen de un pipeline de análisis de deserción estudiantil desarrollado en R, con tres etapas:

1. **Etapa 1 — Analítica descriptiva:** caracterización de la población estudiantil (69,709 inscripciones, 10 cohortes).
2. **Etapa 2 — Modelo explicativo:** regresión de riesgos proporcionales (cloglog) para identificar factores asociados a la deserción (Hazard Ratios y Efectos Marginales).
3. **Etapa 3 — Modelo predictivo:** comparación de 4 algoritmos de machine learning (Regresión Logística, Random Forest, XGBoost y Ensemble), entrenados con cohortes 1–7 (n=41,334) y evaluados en cohortes 8–10 (n=28,375). El modelo Ensemble fue seleccionado como campeón por su balance entre discriminación (AUC) y calibración (Brier score).

El archivo `js/students_raw.js` se genera automáticamente desde el script `03_etapa3_prediccion_v2.R`, que exporta los registros de prueba (`df_test_alertas`) con 16 campos: id, carrera, facultad, modalidad, cohorte, periodo, sexo, edad, promedio, tutorías, gratuidad, estado civil, oferta, score, zona y resultado real.

> **Nota metodológica:** los coeficientes mostrados en la Calculadora de Riesgo provienen del modelo explicativo (cloglog / AME) — explican el "por qué" del riesgo — y son distintos del modelo Ensemble, que predice "quién" está en riesgo. Esta distinción se mantiene visible en el sistema para evitar confusión entre ambos enfoques.

---

## Decisiones de diseño

- El sistema no hace referencia a "Etapa 1/2/3" en la interfaz: las autoridades solo interactúan con el producto final, no con el proceso de investigación.
- Toda la iconografía es SVG inline, consistente con la identidad visual institucional.
- **Cross-filtering estilo Power BI:** al hacer clic en cualquier gráfico del panel de control, se filtran en cascada todos los demás elementos visuales.
- Los filtros de la sección Permanencia son en cascada (Facultad → Carrera → Cohorte): al cambiar la facultad, se recalculan dinámicamente las opciones disponibles de carrera y cohorte.
- Los resultados de estudiantes en cohortes aún en curso se etiquetan como "Activo (cohorte en curso)" en lugar de forzar una clasificación binaria, dejando el sistema listo para uso en producción con datos en tiempo real.
- Terminología cuidada para evitar implicar exposición de datos personales identificables (p. ej. "Ver registros de riesgo" en lugar de "Ver lista de estudiantes").

### Paleta de colores institucional

- Navy UNEMI: `#1c3247` · Azules: `#264763` `#335f7f` `#3c7aa0` `#4597bf`
- Naranja principal: `#fc7e00` · Naranjas: `#ea7d06` `#f48521` `#f78d37`
- Riesgo Alto: `#dc2626` · Riesgo Medio: `#d97706` · Riesgo Bajo: `#16a34a`

---

## Despliegue

El sitio se publica automáticamente mediante **GitHub Pages** a partir de la rama `main` (directorio raíz `/`). Cualquier cambio subido a `main` se refleja en la URL pública en un plazo de 1 a 5 minutos.

```
Repositorio: https://github.com/EvelynGarcia02/sat-unemi
Rama de publicación: main
Ruta: /
URL pública: https://evelyngarcia02.github.io/sat-unemi/
```

Para ejecutar el sistema localmente basta con abrir `index.html` en cualquier navegador moderno, o servirlo con cualquier servidor estático (no requiere build ni instalación de dependencias):

```bash
# Opción simple con Python
python -m http.server 8000
# Luego abrir http://localhost:8000
```

---

## Historial de cambios relevantes

**Julio 2026**
- Corrección de filtros de la pestaña Permanencia para funcionar en cascada (Facultad limita Carrera y Cohorte).
- Publicación inicial del sistema en GitHub Pages.

**Junio 2026**
- Incorporación de la 6ª pestaña "Permanencia" con histórico completo de 69,709 inscripciones (cohortes 1–10), filtros, KPIs, tabla con codificación de color y exportación CSV.
- Corrección de subtítulos y periodos ("2019–2024" → "2019–2023").
- Automatización de la generación de `students_raw.js` directamente desde el script de modelado en R.
- Corrección de codificación de modalidad de estudio (En línea / Presencial / Semipresencial).
- Actualización de `data.js` con las métricas del modelo Ensemble final (AUC=0.8461).
- Rediseño completo de iconografía (emojis → SVG inline) y limpieza de referencias internas a las etapas de investigación en toda la interfaz.
- Corrección de inconsistencias entre el modelo campeón mostrado en distintas secciones del sistema (unificado en Ensemble LR+RF+XGB).

---

## Autoría

Sistema desarrollado como parte del proyecto de investigación sobre deserción estudiantil en UNEMI.

**Contacto:** garcia.evelyn@unemi.edu.ec
