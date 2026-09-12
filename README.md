# Sitio web Grupo Empresarial MAKRA S.A.S.

Sitio web del Grupo Empresarial MAKRA S.A.S., con sus 4 líneas de negocio: Construcción, Alquiler de Equipos Livianos, Consultoría y Alquiler de Maquinaria Pesada. Hecho con HTML, CSS y JavaScript puro (sin frameworks, sin backend), pensado para editarse fácilmente en Visual Studio Code.

Cada línea de negocio tiene su propia página, enlazada desde las 4 tarjetas de la sección "Líneas de negocio" en el inicio.

## Estructura del proyecto

```
makra-web/
├── index.html                          → Inicio: hero, líneas de negocio, quiénes somos, clientes, contacto
├── construccion.html                   → Línea Construcción: quiénes somos + portafolio de proyectos
├── alquiler-equipos-livianos.html      → Línea Alquiler de Equipos Livianos
├── consultoria.html                    → Línea Consultoría
├── alquiler-maquinaria-pesada.html     → Línea Alquiler de Maquinaria Pesada
├── css/
│   └── styles.css      → Todos los estilos (colores, tipografías, responsive)
├── js/
│   └── script.js       → Menú móvil, animaciones, filtros, formulario, resaltado del menú activo
├── google-apps-script/
│   └── Code.gs          → Script opcional para registrar y priorizar cotizaciones en Google Sheets (ver sección 5)
├── images/
│   ├── favicon.png                   → Ícono de pestaña (ya en uso)
│   ├── hero-makra.jpg                → Banner del inicio (ya en uso)
│   ├── nuestros-clientes.jpg         → Logos de clientes reales (ya en uso)
│   ├── proyecto-1.jpg … proyecto-9.jpg   → Fotos reales de proyectos (ya en uso, sin marca ni logo de la constructora)
│   └── (32 fotos reales de equipos livianos + 2 de maquinaria pesada, todas en uso)
└── README.md
```

**Archivos que ya no se usan y puedes borrar de tu computador** (quedaron de versiones anteriores): `images/constructora-vanoy-logo.png` y `images/favicon-vanoy.png` (antes de ocultar el nombre de la constructora), y `images/eq-liviano-1.svg` a `eq-liviano-7.svg` y `images/maq-pesada-1.svg` a `maq-pesada-4.svg` (los íconos de ejemplo, ya reemplazados por fotos reales de cada equipo). Ningún archivo del sitio los referencia ya; bórralos tú mismo desde tu carpeta cuando quieras (yo no puedo eliminar archivos de tu computador desde aquí).

## 1. Abrir el proyecto en VS Code

1. Abre VS Code → `Archivo > Abrir carpeta...` → selecciona la carpeta `makra-web`.
2. Instala la extensión **Live Server** (de Ritwick Dey) desde el panel de extensiones.
3. Clic derecho sobre `index.html` → **"Open with Live Server"**. Se abrirá el sitio en tu navegador y se recargará solo cada vez que guardes un cambio.

## 2. Sobre la privacidad de la razón social

Por seguridad, en todo el sitio público **no aparece el nombre legal de la empresa constructora ni su NIT ni el nombre del representante legal** — todo se muestra bajo la marca "Grupo Empresarial MAKRA S.A.S.". La experiencia, los proyectos reales y los logos de clientes sí se muestran, pero atribuidos siempre a MAKRA, nunca a la razón social específica. Si en el futuro agregas nuevas fotos, documentos o textos, revisa que no contengan el nombre legal de la constructora antes de subirlos (por ejemplo, en el pie de una foto o en los metadatos de un PDF).

El correo de contacto (`contacto@grupomakra.com`) es un **placeholder**: debes crear esa cuenta de correo real (o usar la que prefieras) y actualizarla en `index.html` y en el footer de cada página.

## 3. Qué es real y qué falta por reemplazar

- **9 proyectos reales** en la página de Construcción, con fotos del portafolio (ya recortadas para no mostrar ningún logo).
- **Logos de clientes reales** en la sección "Nuestros Clientes" del inicio.
- **Teléfono / WhatsApp real**: +57 317 381 1484.
- **36 equipos reales de alquiler**, con foto de catálogo y marca de cada uno: 4 en Maquinaria Pesada (Excavadora SANY SY135C, Rodillo Vibratorio Doble 1.300kg, Retroexcavadora Bobcat B760, Minicargador Bobcat S530) y 32 en Equipos Livianos, agrupados en 6 categorías con filtro (Concreto y Compactación, Herramienta Eléctrica, Plantas Eléctricas, Andamiaje y Accesorios, Topografía y Calidad, Otros Equipos). Todos estos equipos también se pueden seleccionar directamente en el cotizador de la sección Contacto.

Si más adelante agregan o quitan equipos del inventario, tráeme la lista actualizada (o el mismo tipo de documento con fotos) y actualizo las tarjetas correspondientes en `alquiler-equipos-livianos.html` o `alquiler-maquinaria-pesada.html`.

**Redes sociales**: en la sección de Contacto y en el footer, los íconos de Facebook, Instagram y TikTok todavía apuntan a `href="#"` — cámbialos por los enlaces reales de tus perfiles cuando los tengas.

## 4. El formulario "Arma tu cotización" (sección Contacto)

El antiguo formulario simple "Envíanos un mensaje" y el Cotizador ahora son **un solo formulario**, dentro de la sección Contacto (`index.html`): el cliente elige la línea (Maquinaria Pesada y/o Equipos Livianos), marca con su foto los equipos puntuales que necesita (agrupados por categoría en Equipos Livianos, igual que en el catálogo), da clic en **"Agrupar selección"** y ahí puede indicar los días de alquiler de cada equipo antes de completar sus datos (nombre, teléfono, correo, **departamento** y **municipio o ciudad de la obra** — ambos obligatorios y clave para el cálculo de prioridad de la sección 5) y enviar.

El catálogo de equipos que se muestra en el cotizador vive en `js/script.js`, en el arreglo `EQUIPOS` (al inicio del bloque "Cotizador"). Si agregan o quitan un equipo del inventario, se edita ahí mismo (nombre, imagen, línea y categoría) — no hace falta tocar el HTML.

### Cómo activar el envío real por correo

Este formulario ya está **completamente programado** para enviar por correo con **EmailJS** (gratis hasta 200 correos/mes, sin backend). Lo único que falta es que tú crees la cuenta gratuita y me pases (o pongas tú mismo) 3 datos. Pasos:

1. Entra a https://www.emailjs.com y crea una cuenta gratis (puedes usar tu Gmail `makra.sas.col@gmail.com`).
2. En el panel, ve a **Email Services** → **Add New Service** → elige **Gmail** (u Outlook) y conecta esa misma cuenta de correo. Te va a dar un **Service ID** (algo como `service_xxxxxxx`).
3. Ve a **Email Templates** → **Create New Template**. En el campo **"To Email"** de la plantilla escribe `makra.sas.col@gmail.com` (para que ahí lleguen las cotizaciones). En **"Reply To"** puedes poner `{{from_email}}` (así puedes responderle al cliente directo). En **"Subject"** escribe exactamente `Nueva solicitud de cotización — MAKRA` (deja ese texto fijo, sin variables) — así todos los correos del cotizador llegan con el mismo asunto y puedes armar el filtro de Gmail del paso siguiente. En el cuerpo del correo puedes usar estas variables, que ya le manda el formulario:
   - `{{from_name}}` — nombre del cliente
   - `{{from_phone}}` — teléfono del cliente
   - `{{from_email}}` — correo del cliente
   - `{{equipos}}` — el mensaje "Deseo consultar o cotizar el alquiler de estos equipos" junto con la lista de equipos marcados y sus días de alquiler
   - `{{mensaje}}` — el mensaje adicional (opcional) que escribió

   Ejemplo de cuerpo de plantilla:
   ```
   Nueva solicitud de cotización — MAKRA

   Nombre: {{from_name}}
   Teléfono: {{from_phone}}
   Correo: {{from_email}}

   {{equipos}}

   Mensaje adicional:
   {{mensaje}}
   ```
   Guarda la plantilla y copia su **Template ID** (algo como `template_xxxxxxx`).
4. Ve a **Account** → **General** y copia tu **Public Key**.
5. Abre `js/script.js`, busca estas 3 líneas cerca del comentario "Cotizador" y reemplaza los valores de ejemplo por los tuyos:
   ```js
   const EMAILJS_PUBLIC_KEY = 'TU_PUBLIC_KEY_AQUI';
   const EMAILJS_SERVICE_ID = 'TU_SERVICE_ID_AQUI';
   const EMAILJS_TEMPLATE_ID = 'TU_TEMPLATE_ID_AQUI';
   ```
6. Guarda, sube el cambio a GitHub (`git add js/script.js`, `git commit`, `git push`) y espera a que Cloudflare Pages termine de desplegar. Prueba el Cotizador en el sitio en vivo — debería llegarte el correo a `makra.sas.col@gmail.com`.

Mientras estos 3 valores sigan siendo los de ejemplo, el botón del Cotizador muestra un aviso pidiendo escribir por WhatsApp en su lugar, en vez de fallar en silencio.

### Que las cotizaciones nunca se pierdan: organízalas con una etiqueta en Gmail

Para que cada correo de cotización quede aparte y no se te pase entre el resto del correo, crea un filtro en Gmail que lo etiquete automáticamente (esto lo haces tú mismo, una sola vez, directo en tu cuenta de Gmail — no requiere tocar el código):

1. Entra a `makra.sas.col@gmail.com` en Gmail.
2. En la barra de búsqueda, escribe: `subject:"Nueva solicitud de cotización — MAKRA"` y da clic en el ícono de opciones de búsqueda (la flechita o los controles deslizantes, a la derecha de la barra).
3. Confirma que quede el mismo texto en el campo "Asunto" y da clic en **"Crear filtro"**.
4. Marca la casilla **"Aplicar la etiqueta"** → **"Nueva etiqueta"** → escribe algo como `Cotizaciones Web` → **Crear**.
5. Puedes también marcar **"Destacarlo siempre"** o **"Marcar como importante"** si quieres que resalte. **No** marques "Archivarlo", así el correo sigue apareciendo en tu bandeja de entrada además de quedar guardado bajo esa etiqueta — nunca se pierde y además queda ordenado.
6. Si quieres que también aplique a cotizaciones que ya te hayan llegado antes, marca **"Aplicar también a las conversaciones que coincidan"** antes de crear el filtro.
7. Da clic en **"Crear filtro"**. Listo — desde ahora, cada vez que alguien cotice desde la página, el correo te llega a la bandeja normal y también queda guardado en la etiqueta "Cotizaciones Web" (la ves en la barra lateral izquierda de Gmail), para que puedas repasarlas todas juntas cuando quieras.

## 5. Registro y priorización de cotizaciones (Google Sheets)

Además del correo que te llega por EmailJS, cada cotización puede quedar guardada en una Hoja de Cálculo de Google, con un cálculo automático de qué tan valiosa es (para ayudarte a decidir a cuál responder primero cuando lleguen varias). Esto es **opcional** — si no lo configuras, el formulario sigue funcionando exactamente igual y el correo te sigue llegando; simplemente no queda este registro extra.

**Cómo funciona, en criollo:** por cada equipo que el cliente marcó, multiplica los días de alquiler por un precio por día (que tú defines). A esa suma le resta un costo de transporte estimado, calculado según qué tan lejos está el departamento de la obra desde Santa Marta (y si hay maquinaria pesada de por medio, que necesita cama baja). El resultado es el "valor neto estimado" de esa cotización, y con eso la hoja le pone una etiqueta: 🟢 Alta, 🟡 Media o 🔴 Baja prioridad. Por ejemplo, tu caso de Villavicencio (8 meses) vs. Bolívar/Mompós (3 meses): aunque Villavicencio quede más lejos y pague más transporte, esa distancia es un costo único, mientras que los meses de alquiler se multiplican — por eso normalmente el cliente de más días termina con mayor "valor neto", y la hoja te lo muestra así de una vez, ordenado, sin que tengas que calcularlo a mano.

**Sobre el municipio (no solo el departamento):** en Colombia, dentro de un mismo departamento la distancia real puede variar muchísimo si no hay buenas vías — por eso el formulario también pide el municipio o ciudad exacta, no solo el departamento. Por ahora el cálculo automático del transporte sigue usando la distancia a nivel de departamento (es lo "sencillo" con lo que arrancamos); el municipio queda guardado en su propia columna en la pestaña **Cotizaciones**, como dato adicional para que tú lo revises a ojo caso por caso. Si más adelante quieres que el cálculo automático también use el municipio, es posible, pero requiere una tabla de distancias mucho más detallada (Colombia tiene más de 1.000 municipios) o conectar un servicio de geocodificación — dímelo cuando llegues a ese punto y lo construimos.

**Aviso importante — para que sepas exactamente qué estás usando:** esto **no es un modelo de "machine learning"** — es una fórmula simple y 100% transparente (multiplicaciones y restas), no una predicción de un algoritmo entrenado con datos históricos. Es justo lo que tú mismo dijiste que empecemos con "algo sencillo". Un modelo más sofisticado (el "chillertín" del que hablabas) sí seria posible más adelante, pero necesita muchas cotizaciones históricas ya cerradas (con resultado real: si se alquiló o no, por cuánto, etc.) para "aprender" patrones — algo que iríamos acumulando con el tiempo si usamos esta hoja desde ya.

También debes saber que **los tres tipos de números que usa la fórmula son estimaciones mías, no tarifas reales de MAKRA**:
- **Precio por día de cada equipo**: no encontré tarifas públicas confiables para tus modelos específicos (SANY, Bobcat, etc.) — las que hay publicadas en internet son de máquinas más grandes o de otras marcas. Puse números de referencia razonables solo para que la hoja funcione desde el primer día.
- **Costo de transporte por km**: en Colombia las empresas de cama baja/transporte de maquinaria cotizan caso por caso — no hay una tarifa pública por kilómetro. También puse un estimado de referencia.
- **Distancias por departamento desde Santa Marta**: son aproximaciones mías por carretera, no mediciones oficiales.

La buena noticia: **los tres viven en la Hoja de Cálculo, no en el código** — puedes corregirlos tú mismo en cualquier momento (por ejemplo, en cuanto sepas cuánto te costó realmente un transporte a Villavicencio), sin tocar una sola línea de `script.js`, y la próxima cotización que llegue ya usa el número corregido.

### Instalación (una sola vez)

1. Crea una Hoja de Cálculo nueva en https://sheets.google.com — llámala, por ejemplo, "MAKRA — Cotizaciones".
2. Dentro de esa hoja, ve al menú **Extensiones → Apps Script**. Se abrirá un editor de código en una pestaña nueva.
3. Borra todo el código de ejemplo que aparece ahí (`function myFunction() {...}`) y pega en su lugar **todo** el contenido del archivo `google-apps-script/Code.gs` que te envié.
4. Guarda (ícono de disquete o `Ctrl+S`).
5. Arriba, junto al botón ▶ **Ejecutar**, hay un desplegable de funciones — elige **`configurarHojas`** y da clic en ▶ **Ejecutar**.
   - La primera vez te va a pedir autorización ("Se requiere autorización" → "Revisar permisos" → elige tu cuenta de Google → puede que aparezca una pantalla de advertencia de Google porque el script es tuyo y no está "verificado" por Google; da clic en "Avanzado" → "Ir a [nombre del proyecto] (no seguro)" → "Permitir"). Es tu propio script, así que es seguro autorizarlo.
   - Cuando termine, vuelve a la pestaña de la Hoja de Cálculo: ya deberías ver 5 pestañas nuevas abajo: **Config-Equipos**, **Config-Distancias**, **Config-Parametros**, **Cotizaciones** y **Resumen**.
6. Revisa **Config-Equipos** y corrige los precios por día que conozcas (no hace falta que los corrijas todos de una — puedes ir ajustando con el tiempo). Lo mismo con **Config-Distancias** y **Config-Parametros** si tienes mejores números.
7. De vuelta en el editor de Apps Script: menú **Implementar → Nueva implementación**. En "Selecciona el tipo", el ícono de engranaje → **Aplicación web**. Configura:
   - **Ejecutar como**: Yo (tu cuenta)
   - **Quién tiene acceso**: Cualquier usuario
   Da clic en **Implementar**, autoriza de nuevo si te lo pide, y copia la **URL de la aplicación web** que te entrega (termina en `/exec`).
8. Abre `js/script.js`, busca la constante `SHEETS_WEBAPP_URL` (cerca de las constantes de EmailJS) y reemplaza el valor de ejemplo por esa URL:
   ```js
   const SHEETS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
   ```
9. Guarda, sube el cambio a GitHub y espera a que Cloudflare Pages despliegue. Envía una cotización de prueba desde el sitio en vivo y revisa que aparezca una fila nueva en la pestaña **Cotizaciones** (y en **Resumen**, ordenada por valor neto).

Si en algún momento cambias o agregas equipos en `js/script.js` (el arreglo `EQUIPOS`), agrega también esa fila en **Config-Equipos** con su precio por día — si un equipo no está ahí, la hoja simplemente lo cuenta como $0 en el cálculo (no rompe nada, solo subestima el valor de esa cotización).

## 6. Hosting y dominio — en qué quedamos

**El hosting ya está resuelto y en producción, no falta nada ahí.** El sitio vive en un repositorio de GitHub (`danilovanoymakra-ship-it/makra-web`) conectado a **Cloudflare Pages**, gratis. Cada vez que haces `git push` a la rama `main`, Cloudflare lo detecta solo y publica la versión nueva en 1-2 minutos — así ha estado funcionando todo este tiempo, incluyendo cada uno de los cambios que hemos hecho en esta conversación. La URL gratuita que te da Cloudflare por ahora es:

```
https://makra-web.pages.dev
```

Lo único que queda pendiente, si lo quieres, es reemplazar esa URL por un **dominio propio** (algo como `www.grupomakra.com` en vez de `makra-web.pages.dev`). Esto tiene dos partes separadas:

1. **Comprar el dominio** (esto tiene un costo anual, normalmente entre 10 y 15 USD/año). Puedes comprarlo en cualquier registrador — Namecheap, GoDaddy, o directamente en **Cloudflare Registrar** (`https://dash.cloudflare.com` → "Domain Registration"), que suele salir más barato porque no le suman margen de reventa, y además queda todo en el mismo panel de Cloudflare donde ya está el sitio.
2. **Conectarlo a Cloudflare Pages**: una vez tengas el dominio (comprado ahí o en otro lado), entras al proyecto `makra-web` dentro de Cloudflare Pages → pestaña **"Custom domains"** → **"Set up a custom domain"** → escribes tu dominio y Cloudflare te guía para apuntar los DNS. Esto no toca el código del sitio para nada, es pura configuración en el panel de Cloudflare.

Si ya tienes un dominio comprado en otro lado (o un nombre en mente), dime y seguimos derecho al paso 2. Si no, te ayudo a decidir el nombre y a comprarlo.

**Alternativas de hosting** (no las necesitas, ya tienes Cloudflare Pages funcionando, pero por si algún día quieres comparar): Netlify y Vercel funcionan de forma muy similar (arrastrar la carpeta o conectar el repo de GitHub); GitHub Pages es otra opción gratis si el proyecto ya está en GitHub.

## 7. Buenas prácticas al agregar tus propias fotos

- Comprime las fotos antes de subirlas (herramientas gratis como https://squoosh.app o https://tinypng.com) para que el sitio cargue rápido.
- Usa un tamaño similar entre todas las fotos de una misma sección para que la cuadrícula se vea pareja.
- Nombra los archivos sin espacios ni tildes (ej. `minicargador-01.jpg`).
- Revisa cada foto nueva antes de subirla para confirmar que no muestre el nombre legal de la constructora ni su logo (ver sección 2).

## 8. Personalizar colores

Los colores del sitio están centralizados al inicio de `css/styles.css`, en la sección `:root`. Por ejemplo:

```css
--navy-900:#0B1420;   /* azul oscuro principal */
--yellow:#F5B301;     /* amarillo de acento / botones */
```

Cambiando esos valores puedes ajustar toda la paleta del sitio sin tocar el resto del código.

---

¿Dudas sobre cómo editar alguna sección o agregar contenido nuevo? Vuelve a esta conversación y pide ayuda con cualquiera de los archivos `.html` o `styles.css`.
