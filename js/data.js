// data.js — SAT-UNEMI. GENERADO AUTOMATICAMENTE por scripts/04_generar_datajs_v2.R
// NO EDITAR A MANO: regenerar ejecutando el script tras cada corrida de la Etapa 3.
// Fuentes: salidas/etapa3 (modelo Ensemble vigente) + salidas/etapa2 (cloglog).
// Generado: 2026-07-05 15:57

const RESUMEN_GLOBAL = {
  total: 28375, alto: 6898, medio: 8073, bajo: 13404,
  pct_alto: 24.3, pct_medio: 28.5, pct_bajo: 47.2,
  total_desertores: 9834, pct_desercion_real: 34.7,
  auc_roc: 0.8461, f1: 0.6996, ppv: 0.7700, npv: 0.8251,
  modelo_campeon: 'Ensemble (LR+RF+XGB)',
  umbral: 0.4161
};

const DATOS_COHORTE = [
  {coh:8, per:'Nov 2022-Mar 2023', n:7481, alto:1576, medio:1813, bajo:4092, deser:2410, pct_deser:32.2},
  {coh:9, per:'Abr-Ago 2023', n:9799, alto:2769, medio:2767, bajo:4263, deser:3397, pct_deser:34.7},
  {coh:10, per:'Sep 2023-Ene 2024', n:11095, alto:2553, medio:3493, bajo:5049, deser:4027, pct_deser:36.3}
];

const DATOS_FACULTAD = [
  {fac:'FACE', nombre:'Fac. Ciencias de la Educacion', n:8938, alto:1614, medio:2035, bajo:5289, deser:2433, pct_alto:18.1, pct_deser:27.2},
  {fac:'FACI', nombre:'Fac. de Ciencias e Ingenieria', n:4073, alto:1231, medio:1555, bajo:1287, deser:1741, pct_alto:30.2, pct_deser:42.7},
  {fac:'FACS', nombre:'Fac. Ciencias de la Salud', n:1132, alto:102, medio:187, bajo:843, deser:253, pct_alto:9.0, pct_deser:22.3},
  {fac:'FACSECYD', nombre:'Fac. Cs. Economicas y Sociales', n:14232, alto:3951, medio:4296, bajo:5985, deser:5407, pct_alto:27.8, pct_deser:38.0}
];

const DATOS_MODALIDAD = [
  {mod:'EN LINEA', n:19256, alto:5272, medio:5389, bajo:8595, deser:7165},
  {mod:'PRESENCIAL', n:7311, alto:1328, medio:2356, bajo:3627, deser:2153},
  {mod:'SEMIPRESENCIAL', n:1808, alto:298, medio:328, bajo:1182, deser:516}
];

const DATOS_CARRERA = [
  {car:'Turismo (En linea)', fac:'FACSECYD', n:1490, pctA:56.8, pctM:36.5, pctB:6.7, dr:63.0, sc:0.619},
  {car:'Turismo 2019 (Presencial)', fac:'FACSECYD', n:193, pctA:56.5, pctM:43.5, pctB:0.0, dr:57.0, sc:0.531},
  {car:'Tecnologias de la Informacion (En linea)', fac:'FACI', n:1963, pctA:41.4, pctM:44.0, pctB:14.6, dr:56.7, sc:0.417},
  {car:'Lic. en Psicologia 2019 (Presencial)', fac:'FACSECYD', n:20, pctA:40.0, pctM:0.0, pctB:60.0, dr:45.0, sc:0.184},
  {car:'Pedagogia Idiomas 2019 (Presencial)', fac:'FACE', n:306, pctA:37.9, pctM:62.1, pctB:0.0, dr:41.8, sc:0.445},
  {car:'Economia (En linea)', fac:'FACSECYD', n:2625, pctA:37.1, pctM:40.8, pctB:22.0, dr:43.2, sc:0.370},
  {car:'Pedagogia Cs. Experiment. (Semipr.)', fac:'FACE', n:290, pctA:36.9, pctM:57.6, pctB:5.5, dr:48.6, sc:0.414},
  {car:'Pedagogia Idiomas (En linea)', fac:'FACE', n:1479, pctA:36.6, pctM:55.7, pctB:7.6, dr:45.2, sc:0.369},
  {car:'Software 2019 (Presencial)', fac:'FACI', n:438, pctA:30.6, pctM:46.6, pctB:22.8, dr:32.0, sc:0.363},
  {car:'Comunicacion (En linea)', fac:'FACSECYD', n:1689, pctA:26.9, pctM:42.9, pctB:30.1, dr:44.2, sc:0.311},
  {car:'Comunicacion 2019 (Presencial)', fac:'FACSECYD', n:177, pctA:25.4, pctM:58.2, pctB:16.4, dr:40.1, sc:0.319},
  {car:'Economia 2019 (Presencial)', fac:'FACSECYD', n:372, pctA:23.4, pctM:47.0, pctB:29.6, dr:35.2, sc:0.304},
  {car:'Contabilidad y Auditoria 2019 (Pres.)', fac:'FACSECYD', n:527, pctA:21.6, pctM:37.2, pctB:41.2, dr:32.1, sc:0.278},
  {car:'Alimentos 2019 (Presencial)', fac:'FACI', n:318, pctA:21.4, pctM:30.5, pctB:48.1, dr:29.6, sc:0.259},
  {car:'Biotecnologia 2019 (Presencial)', fac:'FACI', n:343, pctA:20.7, pctM:31.8, pctB:47.5, dr:32.4, sc:0.256},
  {car:'Adm. de Empresas (En linea)', fac:'FACSECYD', n:787, pctA:19.9, pctM:39.5, pctB:40.5, dr:39.1, sc:0.264},
  {car:'Trabajo Social (En linea)', fac:'FACSECYD', n:2168, pctA:19.0, pctM:11.2, pctB:69.8, dr:31.9, sc:0.179},
  {car:'Derecho (En linea)', fac:'FACSECYD', n:2599, pctA:18.8, pctM:14.5, pctB:66.8, dr:25.6, sc:0.175},
  {car:'Adm. de Empresas 2019 (Presencial)', fac:'FACSECYD', n:571, pctA:17.0, pctM:29.6, pctB:53.4, dr:30.1, sc:0.231},
  {car:'Trabajo Social 2019 (Semipr.)', fac:'FACSECYD', n:568, pctA:15.8, pctM:8.8, pctB:75.4, dr:26.1, sc:0.168},
  {car:'Multimedia y Prod. Audiovisual (Pres.)', fac:'FACSECYD', n:342, pctA:15.5, pctM:69.9, pctB:14.6, dr:25.4, sc:0.310},
  {car:'Ambiental (Presencial)', fac:'FACI', n:262, pctA:15.3, pctM:27.9, pctB:56.9, dr:26.0, sc:0.236},
  {car:'Psicologia (En linea)', fac:'FACSECYD', n:104, pctA:14.4, pctM:8.7, pctB:76.9, dr:26.0, sc:0.128},
  {car:'Industrial (Presencial)', fac:'FACI', n:749, pctA:14.2, pctM:27.8, pctB:58.1, dr:28.6, sc:0.228},
  {car:'Educacion Inicial (En linea)', fac:'FACE', n:1902, pctA:14.1, pctM:10.5, pctB:75.4, dr:17.7, sc:0.135},
  {car:'Educacion Especial (Presencial)', fac:'FACE', n:217, pctA:13.8, pctM:28.1, pctB:58.1, dr:22.6, sc:0.220},
  {car:'Educacion Basica (En linea)', fac:'FACE', n:2450, pctA:12.3, pctM:9.1, pctB:78.7, dr:21.8, sc:0.134},
  {car:'Educacion 2019 (Presencial)', fac:'FACE', n:711, pctA:12.1, pctM:10.7, pctB:77.2, dr:28.4, sc:0.181},
  {car:'Enfermeria (Presencial)', fac:'FACS', n:501, pctA:11.0, pctM:6.0, pctB:83.0, dr:22.2, sc:0.155},
  {car:'Educacion Inicial 2019 (Semipr.)', fac:'FACE', n:950, pctA:10.6, pctM:11.7, pctB:77.7, dr:23.9, sc:0.157},
  {car:'Pedagogia Lengua y Literatura (Pres.)', fac:'FACE', n:259, pctA:10.0, pctM:20.8, pctB:69.1, dr:26.6, sc:0.212},
  {car:'Ped. Act. Fisica y Deporte 2019 (Pres.)', fac:'FACE', n:374, pctA:9.6, pctM:35.0, pctB:55.3, dr:20.3, sc:0.240},
  {car:'Nutricion y Dietetica (Presencial)', fac:'FACS', n:265, pctA:8.7, pctM:44.2, pctB:47.2, dr:29.8, sc:0.253},
  {car:'Fisioterapia (Presencial)', fac:'FACS', n:366, pctA:6.6, pctM:10.9, pctB:82.5, dr:17.2, sc:0.173}
];

const DATOS_HR = [
  {v:'Cohorte de ingreso (+1)', hr:1.11, lb:1.10, ub:1.11, sig:true, dir:'riesgo'},
  {v:'Sin pareja vs Con pareja', hr:1.27, lb:1.21, ub:1.33, sig:true, dir:'riesgo'},
  {v:'Edad al ingreso (+1 ano)', hr:1.00, lb:1.00, ub:1.00, sig:false, dir:'riesgo'},
  {v:'Prov. Otra Ecuador vs Guayas', hr:1.06, lb:1.03, ub:1.10, sig:true, dir:'riesgo'},
  {v:'NSE Medio vs Bajo', hr:1.09, lb:1.06, ub:1.12, sig:true, dir:'riesgo'},
  {v:'NSE Alto vs Bajo', hr:1.02, lb:0.97, ub:1.08, sig:false, dir:'riesgo'},
  {v:'Cabeza de familia: Si vs No', hr:0.99, lb:0.96, ub:1.03, sig:false, dir:'protector'},
  {v:'Presencial vs En linea', hr:0.83, lb:0.77, ub:0.89, sig:true, dir:'protector'},
  {v:'Semipresencial vs En linea', hr:0.71, lb:0.64, ub:0.78, sig:true, dir:'protector'},
  {v:'Sexo: Mujer vs Hombre', hr:0.81, lb:0.79, ub:0.84, sig:true, dir:'protector'},
  {v:'Promedio t1 (+10 pts)', hr:0.66, lb:0.66, ub:0.66, sig:true, dir:'protector'}
];

const DATOS_AME = [
  {v:'Cohorte: 2019 a 2023', ame:18.2, p:'<0.001', nota:'Cada cohorte sucesiva acumula +1.65 pp mas de probabilidad de desertar'},
  {v:'Promedio t1 (+10 pts)', ame:-6.0, p:'<0.001', nota:'Cada 10 puntos adicionales en el promedio reducen 6.0 pp la desercion'},
  {v:'Sexo: Mujer vs Hombre', ame:-3.4, p:'<0.001', nota:'Las mujeres tienen 3.4 pp menos probabilidad de desertar'},
  {v:'Presencial vs En linea', ame:-3.0, p:'<0.001', nota:'Modalidad presencial reduce 3.0 pp la desercion frente a en linea'},
  {v:'Semipresencial vs En linea', ame:-5.3, p:'<0.001', nota:'Modalidad semipresencial reduce 5.3 pp frente a en linea (mayor efecto)'},
  {v:'Sin pareja vs Con pareja', ame:3.7, p:'<0.001', nota:'No tener pareja se asocia a 3.7 pp mas de probabilidad de desertar'}
];

const METRICAS_MODELOS = [
  {modelo:'Reg. Logistica (Ridge)', auc:0.8369, prauc:0.7889, sens:0.682, espec:0.838, ppv:0.690, npv:0.832, f1:0.686, brier:0.1478, campeon:false},
  {modelo:'Random Forest', auc:0.8429, prauc:0.7999, sens:0.645, espec:0.891, ppv:0.758, npv:0.825, f1:0.697, brier:0.1365, campeon:false},
  {modelo:'XGBoost', auc:0.8442, prauc:0.8008, sens:0.633, espec:0.905, ppv:0.780, npv:0.823, f1:0.699, brier:0.1356, campeon:false},
  {modelo:'Ensemble (LR+RF+XGB)', auc:0.8461, prauc:0.8027, sens:0.641, espec:0.898, ppv:0.770, npv:0.825, f1:0.700, brier:0.1361, campeon:true}
];

const IMPORTANCIA_VARS = [
  {v:'Promedio 1er periodo', imp:100.0, tipo:'Academico'},
  {v:'Carrera (riesgo historico)', imp:12.5, tipo:'Institucional'},
  {v:'Cohorte de ingreso', imp:9.1, tipo:'Institucional'},
  {v:'Edad al ingreso', imp:3.6, tipo:'Sociodemografico'},
  {v:'Modalidad', imp:3.2, tipo:'Institucional'},
  {v:'Duracion carrera (offset)', imp:2.0, tipo:'Institucional'},
  {v:'Facultad', imp:1.8, tipo:'Institucional'},
  {v:'Sexo', imp:1.7, tipo:'Sociodemografico'},
  {v:'Provincia de origen', imp:1.3, tipo:'Sociodemografico'},
  {v:'Tutorias en 1er periodo', imp:1.1, tipo:'Institucional'},
  {v:'Estado civil', imp:0.99, tipo:'Personal-Social'},
  {v:'Cabeza de familia', imp:0.76, tipo:'Personal-Social'},
  {v:'Nivel socioeconomico', imp:0.32, tipo:'Personal-Social'},
  {v:'Ocupacion jefe de hogar', imp:0.09, tipo:'Personal-Social'}
];

const ZONAS_CONFIG = {
  'A': {label:'ALTO',  color:'#dc2626', bg:'#fef2f2', border:'#fca5a5', umbral:'Score >= 0.50', tasa_real:'83.9%', n:6898,  pct:24.3},
  'M': {label:'MEDIO', color:'#d97706', bg:'#fffbeb', border:'#fcd34d', umbral:'Score 0.25-0.50',tasa_real:'29.9%', n:8073,  pct:28.5},
  'B': {label:'BAJO',  color:'#16a34a', bg:'#f0fdf4', border:'#86efac', umbral:'Score < 0.25',  tasa_real:'12.2%', n:13404, pct:47.2}
};

const ACCIONES_ZONA = {
  'A': [
    'Convocar al estudiante en los primeros 15 dias del periodo academico',
    'Asignar tutor academico con seguimiento intensivo (reunion quincenal)',
    'Verificar y gestionar acceso a gratuidad o beca de emergencia',
    'Evaluar carga academica y recomendar ajuste si es necesario',
    'Vincular a programa de apoyo psicologico y bienestar estudiantil',
    'Contactar a familia o red de apoyo para intervencion colaborativa',
    'Documentar plan de accion en el sistema de seguimiento estudiantil'
  ],
  'M': [
    'Programar entrevista de seguimiento academico en el segundo mes',
    'Ofrecer acceso a tutoria academica y monitoria de pares',
    'Reforzar informacion sobre beneficios de gratuidad, becas y apoyos',
    'Monitorear asistencia y rendimiento academico mensualmente',
    'Invitar a talleres de tecnicas de estudio y gestion del tiempo'
  ],
  'B': [
    'Mantener seguimiento regular a traves del sistema academico ordinario',
    'Informar sobre oportunidades de becas y reconocimiento academico',
    'Invitar a actividades de vinculacion e integracion institucional',
    'Reevaluar en el siguiente periodo para detectar cambios en el perfil de riesgo'
  ]
};

const SCORING_CARRERA = {
  'Turismo (En linea)': 0.619,
  'Turismo 2019 (Presencial)': 0.531,
  'Tecnologias de la Informacion (En linea)': 0.417,
  'Lic. en Psicologia 2019 (Presencial)': 0.184,
  'Pedagogia Idiomas 2019 (Presencial)': 0.445,
  'Economia (En linea)': 0.370,
  'Pedagogia Cs. Experiment. (Semipr.)': 0.414,
  'Pedagogia Idiomas (En linea)': 0.369,
  'Software 2019 (Presencial)': 0.363,
  'Comunicacion (En linea)': 0.311,
  'Comunicacion 2019 (Presencial)': 0.319,
  'Economia 2019 (Presencial)': 0.304,
  'Contabilidad y Auditoria 2019 (Pres.)': 0.278,
  'Alimentos 2019 (Presencial)': 0.259,
  'Biotecnologia 2019 (Presencial)': 0.256,
  'Adm. de Empresas (En linea)': 0.264,
  'Trabajo Social (En linea)': 0.179,
  'Derecho (En linea)': 0.175,
  'Adm. de Empresas 2019 (Presencial)': 0.231,
  'Trabajo Social 2019 (Semipr.)': 0.168,
  'Multimedia y Prod. Audiovisual (Pres.)': 0.310,
  'Ambiental (Presencial)': 0.236,
  'Psicologia (En linea)': 0.128,
  'Industrial (Presencial)': 0.228,
  'Educacion Inicial (En linea)': 0.135,
  'Educacion Especial (Presencial)': 0.220,
  'Educacion Basica (En linea)': 0.134,
  'Educacion 2019 (Presencial)': 0.181,
  'Enfermeria (Presencial)': 0.155,
  'Educacion Inicial 2019 (Semipr.)': 0.157,
  'Pedagogia Lengua y Literatura (Pres.)': 0.212,
  'Ped. Act. Fisica y Deporte 2019 (Pres.)': 0.240,
  'Nutricion y Dietetica (Presencial)': 0.253,
  'Fisioterapia (Presencial)': 0.173
};

