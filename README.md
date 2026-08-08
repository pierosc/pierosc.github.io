# Star Wars · El legado de la Fuerza

Sitio publicado: [pierosc.github.io](https://pierosc.github.io/)

Experiencia web cinematográfica de 29 archivos narrativos que explica los Episodios I al VI e integra *The Clone Wars*, *Obi-Wan Kenobi* y *Star Wars Rebels* en una sola línea temporal. Rex y Ahsoka cuentan con archivos prioritarios dedicados a sus historias.

## Controles

- Deslizar, usar la rueda o las flechas para avanzar.
- Usar la línea temporal lateral para saltar entre capítulos.
- Activar el sonido desde la esquina superior derecha.
- La animación se reduce automáticamente si el dispositivo tiene activada la preferencia de movimiento reducido.

## Imágenes

Las nueve escenas usan fotografías espaciales de [Unsplash](https://unsplash.com/s/photos/galaxy-space) con capas de color y composición propias. Para reemplazar cualquiera, edita el campo `image` del capítulo correspondiente en `app/page.tsx`; funcionan URLs remotas o rutas locales como `/images/episodio-1.jpg`.

## Desarrollo local

```bash
npm install
npm run dev
npm test
```

## Docker

```bash
docker compose up -d --build
```

La experiencia queda disponible en `http://localhost:8080`. Para detenerla:

```bash
docker compose down
```
