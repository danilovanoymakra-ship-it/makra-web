/**
 * MAKRA S.A.S. — Registro y priorización de cotizaciones
 * =========================================================
 * Este script recibe cada solicitud del formulario "Arma tu cotización"
 * del sitio web (además del correo que ya llega por EmailJS) y la
 * guarda en esta Hoja de Cálculo, calculando automáticamente:
 *
 *   valor_estimado_equipos = Σ (días × precio_día) de cada equipo pedido
 *   costo_transporte_estimado = distancia_km(departamento) × tarifa_km
 *   valor_neto_estimado = valor_estimado_equipos − costo_transporte_estimado
 *
 * y una "Prioridad" (🟢 Alta / 🟡 Media / 🔴 Baja) según ese valor neto.
 *
 * Nota sobre el Municipio: el formulario también pide el municipio/ciudad
 * exacta de la obra (no solo el departamento), porque dentro de un mismo
 * departamento la distancia real puede variar muchísimo según las vías de
 * acceso. Por ahora el cálculo automático de transporte SIGUE usando la
 * distancia a nivel de departamento (Config-Distancias) — el municipio se
 * guarda como dato adicional en la columna "Municipio" para que tú lo uses
 * al revisar cada cotización a ojo. Si más adelante quieres que el cálculo
 * automático también use el municipio, se puede agregar una tabla de
 * distancias más detallada (o un servicio de geocodificación) — es un
 * paso más grande porque Colombia tiene más de 1.000 municipios.
 *
 * IMPORTANTE — esto NO es un modelo de "machine learning": es una
 * fórmula simple y transparente, 100% editable por ti. Todos los
 * precios y distancias viven en las hojas "Config-*" de abajo — puedes
 * corregirlos en cualquier momento sin tocar una sola línea de código,
 * y el próximo formulario que llegue ya usará los valores nuevos.
 *
 * INSTALACIÓN — ver README.md, sección "Registro y priorización de
 * cotizaciones". En resumen:
 *   1. Pega este código completo en el editor de Apps Script.
 *   2. Corre la función configurarHojas() UNA VEZ (menú ▶ arriba,
 *      eligiendo "configurarHojas" en el desplegable de funciones).
 *      Esto crea y llena las hojas Config-Equipos, Config-Parametros,
 *      Config-Distancias, Cotizaciones y Resumen.
 *   3. Publica el proyecto como Web App (Implementar > Nueva
 *      implementación > Aplicación web; Ejecutar como: Yo; Quién
 *      tiene acceso: Cualquier usuario).
 *   4. Copia la URL que te entrega y pégala en js/script.js, en la
 *      constante SHEETS_WEBAPP_URL.
 */

const HOJA_COTIZACIONES = 'Cotizaciones';
const HOJA_EQUIPOS = 'Config-Equipos';
const HOJA_PARAMETROS = 'Config-Parametros';
const HOJA_DISTANCIAS = 'Config-Distancias';
const HOJA_RESUMEN = 'Resumen';

/* ---------------------------------------------------------------------
   DATOS INICIALES (solo se usan la primera vez, al correr
   configurarHojas() — después de eso, lo que manda es lo que tú
   escribas en las hojas Config-*, este script nunca las vuelve a tocar).

   ⚠️ TODOS los precios de abajo son ESTIMACIONES DE REFERENCIA, no
   tarifas reales de MAKRA — no encontré tarifas públicas confiables
   para tus modelos específicos de equipo, así que puse números
   razonables solo para que la hoja funcione desde el primer día.
   Corrígelos en la hoja "Config-Equipos" en cuanto puedas — es la
   única forma de que el "valor estimado" sea realmente útil.
   --------------------------------------------------------------------- */
const EQUIPOS_DEFAULT = [
  // id                        nombre                                          línea      precio_día_COP (ESTIMADO)
  ['exc-sany',            'Excavadora SANY SY135C',                       'pesada',   600000],
  ['rodillo-1300',        'Rodillo Vibratorio Doble 1.300kg',             'pesada',   350000],
  ['retro-bobcat',        'Retroexcavadora Bobcat B760',                  'pesada',   500000],
  ['mini-bobcat',         'Minicargador Bobcat S530',                     'pesada',   450000],

  ['mezcladora-2b',       'Mezcladora de Concreto 2 Bultos',              'liviana',  40000],
  ['mezcladora-1b',       'Mezcladora de Concreto 1 Bulto',               'liviana',  30000],
  ['mezcladora-05b',      'Mezcladora de Concreto 1/2 Bulto',             'liviana',  25000],
  ['apisonador-gas',      'Apisonador Tipo Canguro (gasolina)',           'liviana',  60000],
  ['apisonador-diesel',   'Apisonador Tipo Canguro (diesel)',             'liviana',  60000],
  ['rana',                'Rana Vibrocompactadora',                       'liviana',  50000],
  ['vibrador',            'Vibrador Eléctrico de Concreto',               'liviana',  25000],

  ['tronzadora',          'Tronzadora',                                    'liviana',  30000],
  ['compresor',           'Compresor de Aire Industrial',                 'liviana',  80000],
  ['rotomartillo-dewalt', 'Rotomartillo DeWalt',                          'liviana',  35000],
  ['rotomartillo-hilti',  'Rotomartillo Hilti',                           'liviana',  45000],
  ['martillo-demoledor',  'Martillo Demoledor Eléctrico',                 'liviana',  60000],
  ['taladro-inal-percutor','Taladro Inalámbrico Percutor',                'liviana',  25000],
  ['taladro-atornillador','Taladro Atornillador de Impacto',              'liviana',  20000],
  ['taladro-percutor',    'Taladro Percutor',                             'liviana',  20000],
  ['pulidora-7',          'Pulidora 7 Pulgadas',                          'liviana',  20000],
  ['pulidora-4',          'Pulidora 4 Pulgadas',                          'liviana',  18000],

  ['planta-4000',         'Planta Eléctrica 4000W',                       'liviana',  60000],
  ['planta-7000',         'Planta Eléctrica 7000W',                       'liviana',  90000],
  ['planta-10000',        'Planta Eléctrica 10000W',                      'liviana',  130000],

  ['andamio',             'Andamio Tubular',                              'liviana',  15000],
  ['escalera',            'Escalera Dieléctrica 5 Peldaños',              'liviana',  15000],
  ['extension',           'Extensión Eléctrica',                          'liviana',  10000],

  ['topografico-gnss',    'Equipo Topográfico GNSS RTK',                  'liviana',  150000],
  ['camisa-cilindro',     'Camisa Cilindro Prueba de Concreto 4x8',       'liviana',  10000],
  ['cono-slump',          'Cono Slump',                                    'liviana',  8000],

  ['corta-baldosa',       'Corta Baldosa Cerámica 1.2m',                  'liviana',  30000],
  ['ponchadora',          'Ponchadora Hidráulica',                        'liviana',  40000],
  ['isotanque',           'Isotanque Polietileno 1000L',                  'liviana',  30000],
  ['cosedora',            'Cosedora Industrial Taiwanesa',                'liviana',  20000],
  ['motobomba',           'Motobomba',                                     'liviana',  45000],
  ['zunchadora',          'Zunchadora Manual',                            'liviana',  15000],
];

/* ⚠️ Distancias APROXIMADAS por carretera desde Santa Marta (sede de
   MAKRA), calculadas a grandes rasgos — no son mediciones oficiales.
   "acceso" indica si el cálculo de transporte por carretera aplica:
     normal   → transporte terrestre normal
     dificil  → transporte terrestre posible pero más costoso/lento
                (vías en mal estado, zonas apartadas)
     sin_acceso_terrestre → requiere avión/barco o pasa por zonas de
                riesgo; el sistema NO calcula transporte automático,
                te avisa que cotices ese caso a mano.
   Corrígelas en la hoja "Config-Distancias" cuando conozcas mejor una
   ruta específica. */
const DISTANCIAS_DEFAULT = [
  ['Magdalena', 0, 'normal'],
  ['Atlántico', 100, 'normal'],
  ['Cesar', 200, 'normal'],
  ['Cundinamarca', 950, 'normal'],
  ['Tolima', 1050, 'normal'],
  ['Amazonas', 0, 'sin_acceso_terrestre'],
  ['Antioquia', 700, 'normal'],
  ['Arauca', 950, 'dificil'],
  ['Bogotá D.C.', 950, 'normal'],
  ['Bolívar', 250, 'normal'],
  ['Boyacá', 900, 'normal'],
  ['Caldas', 850, 'normal'],
  ['Caquetá', 1150, 'dificil'],
  ['Casanare', 1000, 'dificil'],
  ['Cauca', 1150, 'normal'],
  ['Chocó', 1100, 'dificil'],
  ['Córdoba', 250, 'normal'],
  ['Guainía', 0, 'sin_acceso_terrestre'],
  ['Guaviare', 1200, 'dificil'],
  ['Huila', 1050, 'normal'],
  ['La Guajira', 200, 'normal'],
  ['Meta', 1050, 'normal'],
  ['Nariño', 1350, 'normal'],
  ['Norte de Santander', 550, 'normal'],
  ['Putumayo', 1300, 'dificil'],
  ['Quindío', 950, 'normal'],
  ['Risaralda', 900, 'normal'],
  ['San Andrés y Providencia', 0, 'sin_acceso_terrestre'],
  ['Santander', 450, 'normal'],
  ['Sucre', 200, 'normal'],
  ['Valle del Cauca', 1150, 'normal'],
  ['Vaupés', 0, 'sin_acceso_terrestre'],
  ['Vichada', 1100, 'dificil'],
];

/* ⚠️ También son ESTIMADOS — no encontré tarifas públicas de transporte
   por km para cama baja / furgón en Colombia (las empresas del sector
   cotizan caso por caso). Ajusta estos 3 números en "Config-Parametros"
   apenas tengas cifras reales de tus últimos transportes. */
const PARAMETROS_DEFAULT = [
  ['costo_transporte_por_km_pesada', 12000, 'COP por km, solo si la cotización incluye maquinaria PESADA (cama baja). ESTIMADO — ajústalo con tus costos reales.'],
  ['costo_transporte_por_km_liviana', 2500, 'COP por km, solo si la cotización es 100% de equipos LIVIANOS (transporte más pequeño/económico). ESTIMADO.'],
  ['umbral_prioridad_alta', 3000000, 'Valor neto estimado (COP) a partir del cual una cotización se marca 🟢 Alta prioridad.'],
  ['umbral_prioridad_media', 1000000, 'Valor neto estimado (COP) a partir del cual una cotización se marca 🟡 Media prioridad (por debajo de este número, 🔴 Baja).'],
];

/* =========================================================
   configurarHojas — correr UNA SOLA VEZ desde el editor
   ========================================================= */
function configurarHojas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // ---- Config-Equipos ----
  const hojaEquipos = obtenerOCrearHoja_(ss, HOJA_EQUIPOS);
  hojaEquipos.clear();
  hojaEquipos.getRange(1, 1, 1, 4).setValues([['id (no editar)', 'Equipo', 'Línea', 'Precio por día (COP)']]).setFontWeight('bold');
  hojaEquipos.getRange(2, 1, EQUIPOS_DEFAULT.length, 4).setValues(EQUIPOS_DEFAULT);
  hojaEquipos.setFrozenRows(1);
  hojaEquipos.autoResizeColumns(1, 4);

  // ---- Config-Distancias ----
  const hojaDist = obtenerOCrearHoja_(ss, HOJA_DISTANCIAS);
  hojaDist.clear();
  hojaDist.getRange(1, 1, 1, 3).setValues([['Departamento', 'Distancia aprox. desde Santa Marta (km)', 'Acceso (normal / dificil / sin_acceso_terrestre)']]).setFontWeight('bold');
  hojaDist.getRange(2, 1, DISTANCIAS_DEFAULT.length, 3).setValues(DISTANCIAS_DEFAULT);
  hojaDist.setFrozenRows(1);
  hojaDist.autoResizeColumns(1, 3);

  // ---- Config-Parametros ----
  const hojaParam = obtenerOCrearHoja_(ss, HOJA_PARAMETROS);
  hojaParam.clear();
  hojaParam.getRange(1, 1, 1, 3).setValues([['Parámetro (no editar)', 'Valor', 'Descripción']]).setFontWeight('bold');
  hojaParam.getRange(2, 1, PARAMETROS_DEFAULT.length, 3).setValues(PARAMETROS_DEFAULT);
  hojaParam.setFrozenRows(1);
  hojaParam.autoResizeColumns(1, 3);

  // ---- Cotizaciones ----
  const hojaCot = obtenerOCrearHoja_(ss, HOJA_COTIZACIONES);
  hojaCot.clear();
  const encabezadosCot = ['Fecha', 'Nombre', 'Teléfono', 'Correo', 'Departamento', 'Municipio',
    'Distancia (km)', 'Acceso', 'Línea', 'Equipos', 'Días totales',
    'Valor estimado equipos (COP)', 'Costo transporte estimado (COP)',
    'Valor neto estimado (COP)', 'Prioridad', 'Mensaje', 'Equipos (detalle técnico)'];
  hojaCot.getRange(1, 1, 1, encabezadosCot.length).setValues([encabezadosCot]).setFontWeight('bold');
  hojaCot.setFrozenRows(1);

  // ---- Resumen (leaderboard en vivo, ordenado por valor neto) ----
  const hojaResumen = obtenerOCrearHoja_(ss, HOJA_RESUMEN);
  hojaResumen.clear();
  hojaResumen.getRange(1, 1, 1, 9).setValues([[
    'Fecha', 'Nombre', 'Teléfono', 'Departamento', 'Municipio', 'Equipos', 'Días totales', 'Valor neto estimado (COP)', 'Prioridad',
  ]]).setFontWeight('bold');
  hojaResumen.getRange('A2').setFormula(
    '=IFERROR(QUERY(' + HOJA_COTIZACIONES + '!A2:Q, ' +
    '"select A,B,C,E,F,J,K,N,O where A is not null order by N desc", 0), "Aún no hay cotizaciones registradas.")'
  );
  hojaResumen.setFrozenRows(1);
  hojaResumen.autoResizeColumns(1, 9);

  ss.toast('Listo: hojas Config-Equipos, Config-Distancias, Config-Parametros, Cotizaciones y Resumen creadas/actualizadas.');
}

function obtenerOCrearHoja_(ss, nombre) {
  return ss.getSheetByName(nombre) || ss.insertSheet(nombre);
}

/* =========================================================
   doPost — recibe cada envío del formulario del sitio web
   ========================================================= */
function doPost(e) {
  try {
    const datos = JSON.parse(e.postData.contents);
    const config = leerConfiguracion_();
    const resultado = calcularPrioridad_(datos, config);
    registrarCotizacion_(datos, resultado);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* Lee las hojas Config-* TAL COMO ESTÉN en este momento — así, cuando
   edites un precio o una distancia en la hoja, el siguiente formulario
   que llegue ya usa el valor nuevo, sin tocar código. */
function leerConfiguracion_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const preciosPorId = {};
  const filasEquipos = ss.getSheetByName(HOJA_EQUIPOS).getDataRange().getValues();
  for (let i = 1; i < filasEquipos.length; i++) {
    const [id, , , precio] = filasEquipos[i];
    if (id) preciosPorId[id] = Number(precio) || 0;
  }

  const distanciasPorDepto = {};
  const filasDist = ss.getSheetByName(HOJA_DISTANCIAS).getDataRange().getValues();
  for (let i = 1; i < filasDist.length; i++) {
    const [depto, km, acceso] = filasDist[i];
    if (depto) distanciasPorDepto[depto] = { km: Number(km) || 0, acceso: String(acceso || 'normal').trim() };
  }

  const parametros = {};
  const filasParam = ss.getSheetByName(HOJA_PARAMETROS).getDataRange().getValues();
  for (let i = 1; i < filasParam.length; i++) {
    const [clave, valor] = filasParam[i];
    if (clave) parametros[clave] = Number(valor) || 0;
  }

  return { preciosPorId, distanciasPorDepto, parametros };
}

/* Calcula valor estimado, costo de transporte y prioridad para una
   cotización. Fórmula simple y transparente (no es "machine learning"):

     valor_estimado_equipos = Σ (días_i × precio_día_i)
     costo_transporte_estimado = distancia_km × tarifa_km_según_línea
     valor_neto_estimado = valor_estimado_equipos − costo_transporte_estimado

   Esta misma fórmula es la que responde el ejemplo de Villavicencio vs.
   Bolívar: un cliente lejano pero con muchos días de alquiler (8 meses)
   generalmente gana en valor neto frente a uno cercano con pocos días
   (3 meses), porque el transporte es un costo único mientras que los
   días de alquiler se multiplican. */
function calcularPrioridad_(datos, config) {
  const equipos = Array.isArray(datos.equipos) ? datos.equipos : [];

  let valorEquipos = 0;
  let diasTotales = 0;
  let hayPesada = false;
  let hayLiviana = false;

  equipos.forEach((it) => {
    const dias = Number(it.dias) || 0;
    const precio = config.preciosPorId[it.id] || 0;
    valorEquipos += dias * precio;
    diasTotales += dias;
    if (it.linea === 'pesada') hayPesada = true;
    if (it.linea === 'liviana') hayLiviana = true;
  });

  const linea = hayPesada && hayLiviana ? 'mixta' : (hayPesada ? 'pesada' : 'liviana');

  const infoDist = config.distanciasPorDepto[datos.departamento];
  const distanciaKm = infoDist ? infoDist.km : null;
  const acceso = infoDist ? infoDist.acceso : 'desconocido';

  let costoTransporte = 0;
  let notaTransporte = '';
  if (!infoDist) {
    notaTransporte = 'Departamento no encontrado en Config-Distancias — agrégalo para estimar transporte.';
  } else if (acceso === 'sin_acceso_terrestre') {
    notaTransporte = 'Sin acceso terrestre confiable — cotizar transporte manualmente.';
  } else {
    // Un solo viaje de cama baja cubre toda la maquinaria pesada del
    // pedido; si el pedido es 100% liviano, se usa la tarifa (menor)
    // de furgón/camioneta.
    const tarifaKm = hayPesada
      ? config.parametros.costo_transporte_por_km_pesada
      : config.parametros.costo_transporte_por_km_liviana;
    costoTransporte = distanciaKm * (tarifaKm || 0);
  }

  const valorNeto = valorEquipos - costoTransporte;

  let prioridad;
  if (valorNeto >= (config.parametros.umbral_prioridad_alta || 0)) {
    prioridad = '🟢 Alta';
  } else if (valorNeto >= (config.parametros.umbral_prioridad_media || 0)) {
    prioridad = '🟡 Media';
  } else {
    prioridad = '🔴 Baja';
  }
  if (notaTransporte) prioridad += ' ⚠️';

  return {
    linea, distanciaKm, acceso, notaTransporte,
    diasTotales, valorEquipos, costoTransporte, valorNeto, prioridad,
  };
}

function registrarCotizacion_(datos, r) {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_COTIZACIONES);
  const equipos = Array.isArray(datos.equipos) ? datos.equipos : [];
  const equiposTexto = equipos.map((it) => `${it.nombre} (${it.dias || '?'} día(s))`).join(', ');

  hoja.appendRow([
    datos.fecha ? new Date(datos.fecha) : new Date(),
    datos.nombre || '',
    datos.telefono || '',
    datos.email || '',
    datos.departamento || '',
    datos.municipio || '',
    r.distanciaKm === null ? 'N/D' : r.distanciaKm,
    r.acceso + (r.notaTransporte ? ` — ${r.notaTransporte}` : ''),
    r.linea,
    equiposTexto,
    r.diasTotales,
    r.valorEquipos,
    r.costoTransporte,
    r.valorNeto,
    r.prioridad,
    datos.mensaje || '',
    JSON.stringify(equipos),
  ]);
}
