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
- **34 equipos reales de alquiler**, con foto de catálogo y marca de cada uno (tomado del listado que enviaste): 2 en Maquinaria Pesada (Retroexcavadora Bobcat B760, Minicargador Bobcat S530) y 32 en Equipos Livianos, agrupados en 6 categorías con filtro (Concreto y Compactación, Herramienta Eléctrica, Plantas Eléctricas, Andamiaje y Accesorios, Topografía y Calidad, Otros Equipos).

Si más adelante agregan o quitan equipos del inventario, tráeme la lista actualizada (o el mismo tipo de documento con fotos) y actualizo las tarjetas correspondientes en `alquiler-equipos-livianos.html` o `alquiler-maquinaria-pesada.html`.

**Redes sociales**: en la sección de Contacto y en el footer, los íconos de Facebook, Instagram y TikTok todavía apuntan a `href="#"` — cámbialos por los enlaces reales de tus perfiles cuando los tengas.

## 4. Los formularios (Cotizador y Contacto)

### 4.1 Formulario "Envíanos un mensaje" (sección Contacto)

Es una **plantilla visual**: por ahora solo muestra un mensaje de alerta al enviarse, no manda correos. Si quieres que también envíe correos de verdad, se puede conectar igual que el Cotizador (ver abajo) o con Formspree (https://formspree.io).

### 4.2 Formulario "Cotizador" (sección Cotizador) — cómo activar el envío real

Este formulario ya está **completamente programado** para enviar por correo con **EmailJS** (gratis hasta 200 correos/mes, sin backend). Lo único que falta es que tú crees la cuenta gratuita y me pases (o pongas tú mismo) 3 datos. Pasos:

1. Entra a https://www.emailjs.com y crea una cuenta gratis (puedes usar tu Gmail `makra.sas.col@gmail.com`).
2. En el panel, ve a **Email Services** → **Add New Service** → elige **Gmail** (u Outlook) y conecta esa misma cuenta de correo. Te va a dar un **Service ID** (algo como `service_xxxxxxx`).
3. Ve a **Email Templates** → **Create New Template**. En el campo **"To Email"** de la plantilla escribe `makra.sas.col@gmail.com` (para que ahí lleguen las cotizaciones). En **"Reply To"** puedes poner `{{from_email}}` (así puedes responderle al cliente directo). En el cuerpo del correo puedes usar estas variables, que ya le manda el formulario:
   - `{{from_name}}` — nombre del cliente
   - `{{from_phone}}` — teléfono del cliente
   - `{{from_email}}` — correo del cliente
   - `{{categorias}}` — lista de lo que marcó, con los días de uso de cada uno
   - `{{mensaje}}` — el mensaje adicional que escribió

   Ejemplo de cuerpo de plantilla:
   ```
   Nueva solicitud de cotización — MAKRA

   Nombre: {{from_name}}
   Teléfono: {{from_phone}}
   Correo: {{from_email}}

   Necesita:
   {{categorias}}

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

## 5. Publicar el sitio (hosting gratis recomendado: Netlify)

No tienes que pagar nada para tener el sitio en línea. La opción más rápida es **Netlify**:

1. Ve a https://app.netlify.com y crea una cuenta gratis (puedes usar tu correo o GitHub).
2. En el panel, busca la opción de arrastrar y soltar ("Deploy manually" / "Drag and drop your site folder").
3. Arrastra la carpeta `makra-web` completa (o comprime su contenido y arrástralo).
4. En segundos tu sitio queda publicado con una URL tipo `https://nombre-al-azar.netlify.app`.
5. Puedes cambiar ese nombre desde "Site settings" por algo como `https://makra-sas.netlify.app`, y más adelante conectar un dominio propio (ej. `www.grupomakra.com`) desde "Domain settings" si compras uno.

**Alternativas igual de válidas:**
- **Vercel** (https://vercel.com): funciona muy parecido a Netlify, ideal si luego quieres conectar con GitHub para que se actualice el sitio automáticamente cada vez que hagas un cambio.
- **GitHub Pages** (gratis, requiere tener el proyecto en un repositorio de GitHub): bueno si ya usas o quieres aprender Git/GitHub desde VS Code.

## 6. Buenas prácticas al agregar tus propias fotos

- Comprime las fotos antes de subirlas (herramientas gratis como https://squoosh.app o https://tinypng.com) para que el sitio cargue rápido.
- Usa un tamaño similar entre todas las fotos de una misma sección para que la cuadrícula se vea pareja.
- Nombra los archivos sin espacios ni tildes (ej. `minicargador-01.jpg`).
- Revisa cada foto nueva antes de subirla para confirmar que no muestre el nombre legal de la constructora ni su logo (ver sección 2).

## 7. Personalizar colores

Los colores del sitio están centralizados al inicio de `css/styles.css`, en la sección `:root`. Por ejemplo:

```css
--navy-900:#0B1420;   /* azul oscuro principal */
--yellow:#F5B301;     /* amarillo de acento / botones */
```

Cambiando esos valores puedes ajustar toda la paleta del sitio sin tocar el resto del código.

---

¿Dudas sobre cómo editar alguna sección o agregar contenido nuevo? Vuelve a esta conversación y pide ayuda con cualquiera de los archivos `.html` o `styles.css`.
