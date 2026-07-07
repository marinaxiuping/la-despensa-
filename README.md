# La Despensa

Planificador de menús, recetario y lista de la compra — instalable en el móvil como app.

## Cómo arrancar (en tu ordenador)

Necesitas tener instalado [Node.js](https://nodejs.org) (versión 18 o superior). Después, en este directorio:

```bash
npm install
npm run dev
```

Te dará una dirección tipo `http://localhost:5173`. Ábrela en el navegador del ordenador para verla.

## Cómo instalar la app en tu móvil

Hay dos pasos: publicar la app online (es gratis) y luego "instalarla" en el móvil desde el navegador.

### 1. Publicar online con Vercel (lo más fácil, gratis)

1. Ejecuta `npm run build`. Te genera una carpeta `dist/` con la app lista.
2. Entra en [vercel.com](https://vercel.com) y crea cuenta gratuita.
3. Pulsa "Add New… → Project" y arrastra la carpeta `dist/` a la zona de subida (o si prefieres, sube todo a GitHub y conecta el repo).
4. Vercel te dará una URL pública del tipo `mi-despensa-xyz.vercel.app`.

Alternativas igual de fáciles: Netlify, Cloudflare Pages. Cualquiera vale.

### 2. Instalarla en el móvil

#### Android (Chrome)

1. Abre la URL de Vercel en Chrome.
2. Toca el menú (los tres puntos arriba) → **"Añadir a pantalla de inicio"** o **"Instalar app"**.
3. Aparece como una app normal con su icono, sin barras del navegador.

#### iPhone (Safari, *muy importante: solo Safari, no Chrome*)

1. Abre la URL en Safari.
2. Toca el botón de compartir (el cuadrado con flecha).
3. Baja y toca **"Añadir a pantalla de inicio"**.
4. Ya está.

### Mejorar el icono en iPhone (opcional)

iOS funciona mejor con un PNG. Cuando hayas tenido la app un rato y quieras pulir el icono:

1. Entra en [realfavicongenerator.net](https://realfavicongenerator.net).
2. Sube `public/icon.svg`.
3. Te genera todos los tamaños. Descarga el zip, copia `android-chrome-192x192.png` como `public/icon-192.png` y `android-chrome-512x512.png` como `public/icon-512.png`.
4. Vuelve a `npm run build` y re-despliega.

## Notas

- Los datos se guardan en `localStorage` del navegador (en el móvil, dentro de la app instalada). No salen del dispositivo.
- Si quieres que los datos se sincronicen entre dispositivos, eso ya requeriría un servicio externo (Firebase, Supabase…). Se puede añadir más adelante.
- La app funciona offline una vez instalada gracias al service worker (gestionado por `vite-plugin-pwa`).
