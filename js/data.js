const RESUMEN_GLOBAL = {
  total: 28375, alto: 6898, medio: 8073, bajo: 13404,
  pct_alto: 24.3, pct_medio: 28.5, pct_bajo: 47.2,
  total_desertores: 9834, pct_desercion_real: 34.7,
  auc_roc: 0.8461, f1: 0.6995, ppv: 0.716, npv: 0.8376,
  modelo_campeon: 'Ensemble (LR+RF+XGB)',
  umbral: 0.5432
};

const DATOS_COHORTE = [
  {coh:8, per:'Nov 2022-Mar 2023', n:7481, alto:1576, medio:1813, bajo:4092, deser:2410, pct_deser:32.2},
  {coh:9, per:'Abr-Ago 2023',      n:9799, alto:2769, medio:2767, bajo:4263, deser:3397, pct_deser:34.7},
  {coh:10,per:'Sep 2023-Ene 2024', n:11095,alto:2553, medio:3493, bajo:5049, deser:4027, pct_deser:36.3}
];

const DATOS_FACULTAD = [
  {fac:'FACE',    nombre:'Fac. Ciencias de la Educacion',       n:8938,  alto:1614, medio:2896, bajo:4428, deser:2433, pct_alto:18.1, pct_deser:27.2},
  {fac:'FACI',    nombre:'Fac. de Ciencias e Ingenieria',       n:4073,  alto:1231, medio:1390, bajo:1452, deser:1741, pct_alto:30.2, pct_deser:42.7},
  {fac:'FACS',    nombre:'Fac. Ciencias de la Salud',           n:1132,  alto:102,  medio:287,  bajo:743,  deser:253,  pct_alto:9.0,  pct_deser:22.3},
  {fac:'FACSECYD',nombre:'Fac. Cs. Economicas y Sociales',      n:14232, alto:3951, medio:3500, bajo:6781, deser:5407, pct_alto:27.8, pct_deser:38.0}
];

const DATOS_MODALIDAD = [
  {mod:'EN LINEA',      n:19256, alto:7929, medio:7831, bajo:3496, deser:7165},
  {mod:'PRESENCIAL',    n:7311,  alto:2530, medio:4539, bajo:242,  deser:2153},
  {mod:'SEMIPRESENCIAL',n:1808,  alto:472,  medio:866,  bajo:470,  deser:516}
];

const DATOS_CARRERA = [
  {car:'Turismo 2019 (Presencial)',              fac:'FACSECYD', n:193,  pctA:92.2, pctM:7.8,  pctB:0,    dr:57.0, sc:0.687},
  {car:'Pedagogia Idiomas 2019 (Presencial)',    fac:'FACE',     n:306,  pctA:84.0, pctM:16.0, pctB:0,    dr:41.8, sc:0.620},
  {car:'Turismo (En linea)',                     fac:'FACSECYD', n:1490, pctA:78.5, pctM:21.5, pctB:0,    dr:63.0, sc:0.763},
  {car:'Pedagogia Cs. Experiment. (Semipr.)',    fac:'FACE',     n:290,  pctA:75.5, pctM:24.5, pctB:0,    dr:48.6, sc:0.680},
  {car:'Tecnologias de la Informacion (En lin)', fac:'FACI',     n:1963, pctA:65.5, pctM:34.5, pctB:0,    dr:56.8, sc:0.650},
  {car:'Pedagogia Idiomas (En linea)',           fac:'FACE',     n:1479, pctA:60.2, pctM:39.8, pctB:0,    dr:45.2, sc:0.601},
  {car:'Economia (En linea)',                    fac:'FACSECYD', n:2625, pctA:59.5, pctM:40.4, pctB:0.1,  dr:43.2, sc:0.614},
  {car:'Software 2019 (Presencial)',             fac:'FACI',     n:438,  pctA:55.9, pctM:44.1, pctB:0,    dr:32.0, sc:0.558},
  {car:'Comunicacion 2019 (Presencial)',         fac:'FACSECYD', n:177,  pctA:46.9, pctM:53.1, pctB:0,    dr:40.1, sc:0.490},
  {car:'Multimedia y Prod. Audiovisual (Pres.)', fac:'FACSECYD', n:342,  pctA:45.9, pctM:54.1, pctB:0,    dr:25.4, sc:0.469},
  {car:'Comunicacion (En linea)',                fac:'FACSECYD', n:1689, pctA:45.4, pctM:54.5, pctB:0.1,  dr:44.2, sc:0.477},
  {car:'Economia 2019 (Presencial)',             fac:'FACSECYD', n:372,  pctA:45.2, pctM:54.8, pctB:0,    dr:35.2, sc:0.467},
  {car:'Contabilidad y Auditoria 2019 (Pres.)',  fac:'FACSECYD', n:527,  pctA:40.8, pctM:59.2, pctB:0,    dr:32.1, sc:0.424},
  {car:'Alimentos 2019 (Presencial)',            fac:'FACI',     n:318,  pctA:40.6, pctM:53.5, pctB:6.0,  dr:29.6, sc:0.418},
  {car:'Biotecnologia 2019 (Presencial)',        fac:'FACI',     n:343,  pctA:37.9, pctM:61.2, pctB:0.9,  dr:32.4, sc:0.394},
  {car:'Adm. de Empresas 2019 (Presencial)',     fac:'FACSECYD', n:571,  pctA:35.6, pctM:61.7, pctB:2.8,  dr:30.1, sc:0.370},
  {car:'Adm. de Empresas (En linea)',            fac:'FACSECYD', n:787,  pctA:33.0, pctM:67.0, pctB:0,    dr:39.1, sc:0.347},
  {car:'Ambiental (Presencial)',                 fac:'FACI',     n:262,  pctA:29.0, pctM:70.6, pctB:0,    dr:26.0, sc:0.315},
  {car:'Industrial (Presencial)',                fac:'FACI',     n:749,  pctA:28.8, pctM:68.5, pctB:2.7,  dr:28.6, sc:0.306},
  {car:'Derecho (En linea)',                     fac:'FACSECYD', n:2599, pctA:26.6, pctM:43.1, pctB:30.3, dr:25.6, sc:0.334},
  {car:'Educacion Especial (Presencial)',         fac:'FACE',     n:217,  pctA:24.9, pctM:72.4, pctB:2.8,  dr:22.6, sc:0.268},
  {car:'Trabajo Social (En linea)',              fac:'FACSECYD', n:2168, pctA:23.9, pctM:47.4, pctB:28.7, dr:31.9, sc:0.302},
  {car:'Trabajo Social 2019 (Semipr.)',          fac:'FACSECYD', n:568,  pctA:20.6, pctM:54.2, pctB:25.2, dr:26.1, sc:0.270},
  {car:'Educacion Inicial (En linea)',           fac:'FACE',     n:1902, pctA:19.6, pctM:33.9, pctB:46.5, dr:17.7, sc:0.242},
  {car:'Nutricion y Dietetica (Presencial)',      fac:'FACS',     n:265,  pctA:19.2, pctM:80.8, pctB:0,    dr:29.8, sc:0.245},
  {car:'Ped. Act. Fisica y Deporte 2019 (Pres.)',fac:'FACE',     n:374,  pctA:19.0, pctM:80.5, pctB:0.5,  dr:20.3, sc:0.222},
  {car:'Pedagogia Lengua y Literatura (Pres.)',  fac:'FACE',     n:259,  pctA:17.8, pctM:81.5, pctB:0.8,  dr:26.6, sc:0.214},
  {car:'Educacion 2019 (Presencial)',            fac:'FACE',     n:711,  pctA:17.7, pctM:74.1, pctB:8.2,  dr:28.4, sc:0.225},
  {car:'Psicologia (En linea)',                  fac:'FACSECYD', n:104,  pctA:17.3, pctM:31.7, pctB:51.0, dr:26.0, sc:0.238},
  {car:'Educacion Basica (En linea)',            fac:'FACE',     n:2450, pctA:16.0, pctM:37.2, pctB:46.7, dr:21.8, sc:0.207},
  {car:'Educacion Inicial 2019 (Semipr.)',       fac:'FACE',     n:950,  pctA:14.3, pctM:51.3, pctB:34.4, dr:23.9, sc:0.196},
  {car:'Enfermeria (Presencial)',                fac:'FACS',     n:501,  pctA:14.0, pctM:69.5, pctB:16.6, dr:22.2, sc:0.188},
  {car:'Fisioterapia (Presencial)',              fac:'FACS',     n:366,  pctA:12.8, pctM:79.2, pctB:7.9,  dr:17.2, sc:0.176}
];

const DATOS_HR = [
  {v:'Cohorte de ingreso (+1)',          hr:1.11, lb:1.09, ub:1.13, sig:true,  dir:'riesgo'},
  {v:'Sin pareja vs Con pareja',         hr:1.18, lb:1.13, ub:1.24, sig:true,  dir:'riesgo'},
  {v:'Edad al ingreso (+1 ano)',         hr:1.03, lb:1.02, ub:1.04, sig:true,  dir:'riesgo'},
  {v:'Prov. Otra Ecuador vs Guayas',     hr:1.05, lb:1.00, ub:1.10, sig:true,  dir:'riesgo'},
  {v:'NSE Medio vs Bajo',               hr:0.97, lb:0.93, ub:1.01, sig:false, dir:'protector'},
  {v:'NSE Alto vs Bajo',                hr:0.93, lb:0.86, ub:1.00, sig:false, dir:'protector'},
  {v:'Cabeza de familia: Si vs No',     hr:1.04, lb:0.98, ub:1.10, sig:false, dir:'riesgo'},
  {v:'Presencial vs En linea',          hr:0.88, lb:0.84, ub:0.92, sig:true,  dir:'protector'},
  {v:'Semipresencial vs En linea',      hr:0.77, lb:0.72, ub:0.82, sig:true,  dir:'protector'},
  {v:'Sexo: Mujer vs Hombre',           hr:0.84, lb:0.81, ub:0.87, sig:true,  dir:'protector'},
  {v:'Promedio t1 (+10 pts)',           hr:0.72, lb:0.70, ub:0.74, sig:true,  dir:'protector'}
];

const DATOS_AME = [
  {v:'Cohorte: 2019 a 2023',       ame:19.4, se:1.2, p:'<0.001', nota:'Cada cohorte sucesiva acumula +1.94 pp mas de probabilidad de desertar'},
  {v:'Promedio t1 (+10 pts)',      ame:-6.4, se:0.4, p:'<0.001', nota:'Cada 10 puntos adicionales en el promedio reducen 6.4 pp la desercion'},
  {v:'Sexo: Mujer vs Hombre',      ame:-3.6, se:0.5, p:'<0.001', nota:'Las mujeres tienen 3.6 pp menos probabilidad de desertar'},
  {v:'Presencial vs En linea',     ame:-3.2, se:0.7, p:'<0.001', nota:'Modalidad presencial reduce 3.2 pp la desercion frente a en linea'},
  {v:'Semipresencial vs En linea', ame:-5.7, se:1.0, p:'<0.001', nota:'Modalidad semipresencial reduce 5.7 pp frente a en linea (mayor efecto)'},
  {v:'Sin pareja vs Con pareja',   ame: 4.0, se:0.6, p:'<0.001', nota:'No tener pareja se asocia a 4.0 pp mas de probabilidad de desertar'}
];

const METRICAS_MODELOS = [
  {modelo:'Reg. Logistica (Ridge)', auc:0.8369, prauc:0.7889, sens:0.769, espec:0.724, ppv:0.596, npv:0.857, f1:0.672, brier:0.1478, campeon:false},
  {modelo:'Random Forest',          auc:0.8429, prauc:0.7999, sens:0.686, espec:0.851, ppv:0.710, npv:0.841, f1:0.698, brier:0.1365, campeon:false},
  {modelo:'XGBoost',                auc:0.8442, prauc:0.8008, sens:0.670, espec:0.872, ppv:0.735, npv:0.832, f1:0.701, brier:0.1356, campeon:false},
  {modelo:'Ensemble (LR+RF+XGB)',   auc:0.8461, prauc:0.8027, sens:0.699, espec:0.841, ppv:0.716, npv:0.838, f1:0.700, brier:0.1361, campeon:true}
];

const IMPORTANCIA_VARS = [
  {v:'Promedio 1er periodo',        imp:100.0, tipo:'Academico'},
  {v:'Carrera (riesgo historico)',   imp:11.7,  tipo:'Institucional'},
  {v:'Cohorte de ingreso',          imp:9.4,   tipo:'Institucional'},
  {v:'Modalidad',                   imp:5.5,   tipo:'Institucional'},
  {v:'Edad al ingreso',             imp:4.9,   tipo:'Sociodemografico'},
  {v:'Duracion carrera (offset)',   imp:3.3,   tipo:'Institucional'},
  {v:'Facultad',                    imp:2.9,   tipo:'Institucional'},
  {v:'Sexo',                        imp:2.0,   tipo:'Sociodemografico'},
  {v:'Provincia de origen',         imp:2.0,   tipo:'Sociodemografico'},
  {v:'Tutorias en 1er periodo',     imp:1.5,   tipo:'Institucional'},
  {v:'Cabeza de familia',           imp:1.4,   tipo:'Personal-Social'},
  {v:'Estado civil',                imp:1.3,   tipo:'Personal-Social'},
  {v:'Nivel socioeconomico',        imp:0.25,  tipo:'Personal-Social'},
  {v:'Ocupacion jefe de hogar',     imp:0.06,  tipo:'Personal-Social'}
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
  'Turismo 2019 (Presencial)':                   0.687,
  'Pedagogia Idiomas 2019 (Presencial)':          0.620,
  'Turismo (En linea)':                           0.763,
  'Pedagogia Cs. Experiment. (Semipr.)':          0.680,
  'Tecnologias de la Informacion (En linea)':     0.650,
  'Pedagogia Idiomas (En linea)':                 0.601,
  'Economia (En linea)':                          0.614,
  'Software 2019 (Presencial)':                   0.558,
  'Comunicacion 2019 (Presencial)':               0.490,
  'Multimedia y Prod. Audiovisual (Pres.)':        0.469,
  'Comunicacion (En linea)':                      0.477,
  'Economia 2019 (Presencial)':                   0.467,
  'Contabilidad y Auditoria 2019 (Pres.)':         0.424,
  'Alimentos 2019 (Presencial)':                  0.418,
  'Biotecnologia 2019 (Presencial)':              0.394,
  'Adm. de Empresas 2019 (Presencial)':           0.370,
  'Adm. de Empresas (En linea)':                  0.347,
  'Ambiental (Presencial)':                       0.315,
  'Industrial (Presencial)':                      0.306,
  'Derecho (En linea)':                           0.334,
  'Educacion Especial (Presencial)':               0.268,
  'Trabajo Social (En linea)':                    0.302,
  'Trabajo Social 2019 (Semipr.)':                0.270,
  'Educacion Inicial (En linea)':                 0.242,
  'Nutricion y Dietetica (Presencial)':            0.245,
  'Ped. Act. Fisica y Deporte 2019 (Pres.)':       0.222,
  'Pedagogia Lengua y Literatura (Pres.)':         0.214,
  'Educacion 2019 (Presencial)':                  0.225,
  'Psicologia (En linea)':                        0.238,
  'Educacion Basica (En linea)':                  0.207,
  'Educacion Inicial 2019 (Semipr.)':             0.196,
  'Enfermeria (Presencial)':                      0.188,
  'Fisioterapia (Presencial)':                    0.176
};
